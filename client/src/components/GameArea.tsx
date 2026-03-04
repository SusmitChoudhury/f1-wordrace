import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { User, CheckCircle, Clock } from 'lucide-react';
import type { RoomInfo } from '../../../server/src/types'; // Using relative path for types
import TypingArea from './TypingArea';
import RaceTrack from './RaceTrack';
import ResultScreen from './ResultScreen';

const SERVER_URL = 'http://localhost:3001';

const GameArea: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'multiplayer';
    const playerName = searchParams.get('name') || 'Guest';
    const navigate = useNavigate();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState<RoomInfo | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        // We want to initialize Socket for both multiplayer and singleplayer
        // since singleplayer relies on a server-simulated bot.
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
            newSocket.emit('joinRoom', { roomId, playerName, mode });
        });

        newSocket.on('roomState', (roomData: RoomInfo) => {
            setRoom(roomData);
            if (roomData.state !== 'ready') {
                setCountdown(null);
            }

            // If singleplayer and waiting, automatically toggle ready
            if (mode === 'singleplayer' && roomData.state === 'waiting') {
                const myPlayerId = newSocket.id;
                if (myPlayerId && roomData.players[myPlayerId] && !roomData.players[myPlayerId].isReady) {
                    newSocket.emit('toggleReady', { roomId });
                }
            }
        });

        newSocket.on('countdownStarted', ({ time }) => {
            setCountdown(time);
        });

        newSocket.on('countdownTick', ({ time }) => {
            setCountdown(time);
        });

        newSocket.on('raceStarted', (roomData: RoomInfo) => {
            setRoom(roomData);
            setCountdown(null);
            setTimeLeft(roomData.duration);
        });

        newSocket.on('raceFinished', (roomData: RoomInfo) => {
            setRoom(roomData);
            setCountdown(null);
            setTimeLeft(0);
        });

        newSocket.on('playerProgress', (data: { playerId: string, progress: number, wpm: number, accuracy: number, mistakes: number }) => {
            setRoom(prev => {
                if (!prev) return prev;
                if (!prev.players[data.playerId]) return prev;

                const newPlayers = { ...prev.players };
                newPlayers[data.playerId] = {
                    ...newPlayers[data.playerId],
                    progress: data.progress,
                    wpm: data.wpm,
                    accuracy: data.accuracy,
                    mistakes: data.mistakes
                };

                return { ...prev, players: newPlayers };
            });
        });

        newSocket.on('error', (err: { message: string }) => {
            alert(err.message);
            navigate('/');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [roomId, mode, playerName, navigate]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (room?.state === 'racing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => Math.max(0, prev - 1));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [room?.state, timeLeft]);

    const toggleReady = () => {
        if (socket) {
            socket.emit('toggleReady', { roomId });
        }
    };

    if (!isConnected) {
        return (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-body" style={{ fontSize: '1.25rem' }}>Connecting to server...</p>
            </div>
        );
    }

    // Find current player
    const myPlayerId = socket?.id;
    const players = room ? Object.values(room.players) : [];
    const myPlayer = myPlayerId && room ? room.players[myPlayerId] : null;

    return (
        <div style={{ padding: '1rem 2rem', display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', overflow: 'hidden', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
                <div>
                    <h2 className="heading-2">Room: <span style={{ fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--primary)' }}>{roomId}</span></h2>
                    <p className="text-body" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                        Mode: {mode === 'singleplayer' ? 'Vs AI' : 'Multiplayer'}
                    </p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/')}>
                    Leave Room
                </button>
            </div>

            {room && room.state === 'waiting' && !countdown && (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
                    <h3 className="heading-3" style={{ marginBottom: '2rem' }}>Waiting for players...</h3>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem', width: '100%' }}>
                        {/* Player Slots */}
                        {[0, 1].map((index) => {
                            const player = players[index];
                            return (
                                <div key={index} style={{
                                    background: 'var(--surface)',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    minWidth: '250px',
                                    border: player?.isReady ? '2px solid var(--success)' : '2px solid transparent',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {player ? (
                                        <>
                                            <User size={48} color={player.isReady ? 'var(--success)' : 'var(--text-muted)'} style={{ margin: '0 auto 1rem' }} />
                                            <h4 className="heading-3" style={{ marginBottom: '0.5rem' }}>{player.name} {player.id === myPlayerId && '(You)'}</h4>
                                            <p className="text-body" style={{ color: player.isReady ? 'var(--success)' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                {player.isReady ? <CheckCircle size={16} /> : <Clock size={16} />}
                                                {player.isReady ? 'Ready' : 'Not Ready'}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', borderRadius: '50%', border: '2px dashed var(--border)' }}></div>
                                            <h4 className="heading-3" style={{ color: 'var(--text-muted)' }}>Waiting...</h4>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <button
                        className="btn-primary"
                        style={{ fontSize: '1.25rem', padding: '1rem 3rem', background: myPlayer?.isReady ? 'var(--surface)' : 'var(--primary)' }}
                        onClick={toggleReady}
                        disabled={!myPlayer}
                    >
                        {myPlayer?.isReady ? 'Cancel Ready' : 'I am Ready!'}
                    </button>
                </div>
            )}

            {(countdown !== null || (room && room.state === 'ready')) && (
                <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <h2 className="heading-1" style={{ fontSize: '6rem', color: 'var(--primary)', marginBottom: '1rem', textShadow: '0 0 20px rgba(242, 24, 53, 0.5)' }}>
                        {countdown}
                    </h2>
                    <h3 className="heading-3">Get Ready!</h3>
                </div>
            )}

            {room && room.state === 'racing' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0 }}>
                    {/* Race Timer Header */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <div className="glass-panel" style={{ padding: '0.5rem 2rem', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--primary)' }}>
                            <Clock size={20} color="var(--primary)" />
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: timeLeft <= 10 ? 'var(--error)' : 'var(--text-main)' }}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                        </div>
                    </div>

                    {/* TOP SECTION: Race Track */}
                    <RaceTrack players={players} myPlayerId={myPlayerId} duration={room.duration} />

                    {/* MIDDLE SECTION: Typing Area */}
                    <TypingArea
                        socket={socket}
                        roomId={roomId || ''}
                        initialText={room.text || ''}
                    />

                    {/* BOTTOM SECTION: Stats */}
                    <div className="glass-panel" style={{ padding: '1.25rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>WPM</span>
                                <div className="heading-2" style={{ color: 'var(--primary)' }}>{myPlayer?.wpm || 0}</div>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Accuracy</span>
                                <div className="heading-2" style={{ color: 'var(--success)' }}>{myPlayer?.accuracy || 100}%</div>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Errors</span>
                                <div className="heading-2" style={{ color: 'var(--error)' }}>{myPlayer?.mistakes || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {room && room.state === 'finished' && (
                <ResultScreen
                    room={room}
                    myPlayerId={myPlayerId}
                    onRematch={() => socket?.emit('toggleReady', { roomId })} // Rematch logic
                />
            )}
        </div>
    );
};

export default GameArea;
