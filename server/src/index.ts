import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { RoomInfo, PlayerInfo } from './types';
import { generateRandomText } from './utils/textGenerator';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3001;

// In-memory store for rooms
const rooms: Record<string, RoomInfo> = {};
const botIntervals: Record<string, NodeJS.Timeout> = {};

io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', ({ roomId, playerName, mode }: { roomId: string, playerName: string, mode?: string }) => {
        // If room doesn't exist, create it
        if (!rooms[roomId]) {
            rooms[roomId] = {
                id: roomId,
                state: 'waiting',
                players: {},
                text: '', // Will generate text when ready
                startTime: null,
                duration: 60 // Default duration
            };
        }

        const room = rooms[roomId];

        // Check if room is full
        if (Object.keys(room.players).length >= 2 && !room.players[socket.id]) {
            socket.emit('error', { message: 'Room is full (max 2 players).' });
            return;
        }

        if (room.state === 'racing' || room.state === 'finished') {
            socket.emit('error', { message: 'Race already started or finished.' });
            return;
        }

        room.players[socket.id] = {
            id: socket.id,
            name: playerName,
            isReady: false,
            progress: 0,
            wpm: 0,
            accuracy: 100,
            mistakes: 0,
            wordIndex: 0,
            penaltyTime: 0
        };

        if (mode === 'singleplayer' && Object.keys(room.players).length === 1) {
            // Add a bot player
            room.players['bot_1'] = {
                id: 'bot_1',
                name: 'ProRacer AI',
                isReady: true, // Bot is always ready
                progress: 0,
                wpm: 0,
                accuracy: 98,
                mistakes: 0,
                wordIndex: 0,
                penaltyTime: 0
            };
        }

        socket.join(roomId);

        // Broadcast updated room state
        io.to(roomId).emit('roomState', room);
    });

    socket.on('toggleReady', ({ roomId }: { roomId: string }) => {
        const room = rooms[roomId];
        if (!room || !room.players[socket.id]) return;

        room.players[socket.id].isReady = !room.players[socket.id].isReady;

        // Check if both players are ready
        const playerIds = Object.keys(room.players);
        const allReady = playerIds.length === 2 && playerIds.every(id => room.players[id].isReady);

        if (allReady && room.state === 'waiting') {
            room.state = 'ready';
            room.text = generateRandomText(40);
            io.to(roomId).emit('roomState', room);
            io.to(roomId).emit('countdownStarted', { time: 3 });

            let count = 3;
            const interval = setInterval(() => {
                count--;
                if (count > 0) {
                    io.to(roomId).emit('countdownTick', { time: count });
                } else {
                    clearInterval(interval);
                    room.state = 'racing';
                    room.startTime = Date.now();
                    io.to(roomId).emit('raceStarted', room);

                    // Start bot intervals if singleplayer
                    const botId = Object.keys(room.players).find(id => id.startsWith('bot_'));
                    if (botId) {
                        const bot = room.players[botId];
                        // Simulate 50 WPM on average. 50 WPM = 250cpm = ~4 chars per second.
                        // Every 100ms, chance to type a char is 40% (since 4 chars per 1000ms = 4 per 10 intervals).
                        let totalTyped = 0;
                        botIntervals[roomId] = setInterval(() => {
                            if (room.state !== 'racing') {
                                clearInterval(botIntervals[roomId]);
                                return;
                            }
                            // 40% chance to type correctly, 2% chance to make mistake
                            const rand = Math.random();
                            if (rand < 0.38) {
                                totalTyped += 1; // Correct char
                            } else if (rand < 0.40) {
                                bot.mistakes += 1; // Mistake
                            }

                            // Bot raw progress is strictly the total characters correctly typed
                            bot.progress = totalTyped;
                            bot.wpm = Math.round((totalTyped / 5) / ((Date.now() - (room.startTime || Date.now())) / 60000)) || 0;

                            io.to(roomId).emit('playerProgress', {
                                playerId: botId,
                                progress: bot.progress,
                                wpm: bot.wpm,
                                accuracy: bot.accuracy,
                                mistakes: bot.mistakes
                            });
                        }, 100);
                    }

                    // Start actual race timer
                    setTimeout(() => {
                        const activeRoom = rooms[roomId];
                        if (activeRoom && activeRoom.state === 'racing') {
                            activeRoom.state = 'finished';
                            // Calculate penalties
                            const pIds = Object.keys(activeRoom.players);
                            for (const pid of pIds) {
                                const p = activeRoom.players[pid];
                                p.penaltyTime = p.mistakes * 2; // +2 seconds per mistake
                            }
                            if (botIntervals[roomId]) {
                                clearInterval(botIntervals[roomId]);
                                delete botIntervals[roomId];
                            }
                            io.to(roomId).emit('raceFinished', activeRoom);
                        }
                    }, room.duration * 1000);
                }
            }, 1000);
        } else {
            io.to(roomId).emit('roomState', room);
        }
    });

    socket.on('typeProgress', ({ roomId, progress, wpm, accuracy, mistakes }) => {
        const room = rooms[roomId];
        if (room && room.players[socket.id]) {
            const player = room.players[socket.id];
            player.progress = progress;
            player.wpm = wpm;
            player.accuracy = accuracy;
            player.mistakes = mistakes;

            io.to(roomId).emit('playerProgress', {
                playerId: socket.id,
                progress, wpm, accuracy, mistakes
            });

            // Check win condition (progress >= 1)
            // But wait, the prompt says duration is time-based. "The race timer counts down. The track represents the full duration of the race. Car progress depends on typing performance during this time. Formula: carPosition = typingProgress * trackLength. Winner: adjusted time"
            // Let's hold off on finishing logic for a bit.
        }
    });

    socket.on('requestMoreText', ({ roomId, currentLength }) => {
        const room = rooms[roomId];
        if (room && room.text.length === currentLength) {
            const newText = generateRandomText(20);
            room.text += ' ' + newText;
            io.to(roomId).emit('textExpanded', { newText });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Find rooms user was in and remove them
        for (const roomId in rooms) {
            if (rooms[roomId].players[socket.id]) {
                delete rooms[roomId].players[socket.id];

                // If room is empty, delete it
                if (Object.keys(rooms[roomId].players).length === 0) {
                    delete rooms[roomId];
                } else {
                    // If a player leaves during race, end it or pause. Just reset to waiting for simplicity.
                    const room = rooms[roomId];
                    if (room.state !== 'finished') {
                        room.state = 'waiting';
                        // reset remaining player's ready state
                        for (const p in room.players) {
                            room.players[p].isReady = false;
                        }
                    }
                    io.to(roomId).emit('playerLeft', { playerId: socket.id });
                    io.to(roomId).emit('roomState', rooms[roomId]);
                }
            }
        }
    });
});

app.get('/', (req, res) => {
    res.send('FI WordRace API');
});

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
