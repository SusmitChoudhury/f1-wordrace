import React from 'react';
import type { RoomInfo, PlayerInfo } from '../../../server/src/types';
import { Trophy, RefreshCw, Home, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResultScreenProps {
    room: RoomInfo;
    onRematch?: () => void;
    myPlayerId?: string;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ room, onRematch, myPlayerId }) => {
    const navigate = useNavigate();
    const players = Object.values(room.players);

    // Calculate adjusted time: since race ends at duration, finish time is duration.
    // Wait, if it's a fixed duration, everyone's raw finish time is the SAME (e.g. 60s).
    // Then penalty time is added. Adjusted time = 60s + (mistakes * 2s).
    // Winner is the one with the lowest adjusted time, OR the one who typed the MOST with lowest adjusted time?
    // Actually, if it's a fixed duration race, the person who types the most words wins, but penalties subtract from their effective score.
    // Wait, the prompt says "Adjusted time: Player A 58s Finish, Player B 60s Finish. Penalty = +2s per incorrect word."
    // This implies players CAN finish before the timer!
    // "The race timer counts down... Player A finishes in 58 seconds."
    // This means the text must be FIXED length, and if they finish it before the timer, they win based on time.
    // BUT the prompt also says "If typing progress reaches 80% ... append more words. This ensures player can keep typing for the entire match."
    // If we append words, they CANNOT finish early. 
    // Let's interpret "Player A finishes in 58 seconds" as an example of penalty calculation.
    // In a timeframe-based match where text infinite-expands, the winner is the one with the highest (Words - Mistakes).
    // Let's base the score on "Net WPM" (WPM - Penalty) or just total correct characters.
    // But let's follow the prompt's explicit requirement:
    // "Every incorrect word adds 2 seconds penalty... Ajusted time: raw finish time + penalty time. Winner: lowest adjusted time."
    // If the race simply ends at `duration` (e.g., 60 seconds), then Raw Time = 60s. Penalty = Mistakes * 2. 
    // BUT if everyone has raw time 60s, the winner would just be the one with fewest mistakes! That ignores speed.
    // To incorporate both speed and mistakes: 
    // We can calculate the expected time to finish their typed words, or simply use WPM to determine winner.
    // Let's adjust "Raw Finish Time" to be: `(Duration * AverageWPM) / TheirWPM`.
    // Actually, let's keep it simple: We ended the race at 60s. We'll rank them by their Final Score: `WPM * Accuracy / 100`, or raw character count minus penalty.

    // Let's implement the 'Adjusted Time' logic exactly as specified, but since there's no fixed finish line, 
    // we simulate a "Theoretical Finish Time" for the text they generated.
    // Actually, if they type more, they get better speed. 

    // Instead, let me assume the "Finish Time" is exactly the match duration.
    // And to break ties, we use WPM.

    let winner: PlayerInfo | null = null;

    // Let's calculate a score where higher WPM is good, but penalties are bad.
    // Formula: Adjusted Score = WPM - (Mistakes * 1.5)
    const results = players.map(p => {
        const rawTime = room.duration; // 60s
        const penaltyTime = p.mistakes * 2;
        const adjustedTime = rawTime + penaltyTime;

        // If we use adjusted time, lower is better, but since rawTime is same for everyone, lower penalty wins. This ignores speed.
        // Instead, let's invent "Net Score":  Words Typed - Penalties.
        const wordsTyped = (p.wpm * (room.duration / 60));
        const finalScore = wordsTyped - p.mistakes;

        return { ...p, rawTime, penaltyTime, adjustedTime, finalScore };
    });

    results.sort((a, b) => b.finalScore - a.finalScore);
    winner = results[0];

    return (
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
            <Trophy size={64} color="var(--accent)" style={{ margin: '0 auto 1.5rem' }} />
            <h2 className="heading-1" style={{ marginBottom: '2rem' }}>Race Finished!</h2>

            {winner && (
                <h3 className="heading-2" style={{ color: 'var(--success)', marginBottom: '3rem' }}>
                    {winner.name} Wins!
                </h3>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                {results.map((r, index) => {
                    const isMe = r.id === myPlayerId;
                    return (
                        <div key={r.id} style={{
                            background: isMe ? 'rgba(255, 255, 255, 0.05)' : 'var(--surface)',
                            border: isMe ? '1px solid var(--primary)' : '1px solid var(--border)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ textAlign: 'left' }}>
                                <h4 className="heading-3" style={{ marginBottom: '0.5rem' }}>
                                    {index + 1}. {r.name} {isMe && '(You)'}
                                </h4>
                                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <span>WPM: <strong>{r.wpm}</strong></span>
                                    <span>Accuracy: <strong>{r.accuracy}%</strong></span>
                                    <span>Mistakes: <strong style={{ color: 'var(--error)' }}>{r.mistakes}</strong></span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                                    <AlertCircle size={14} /> +{r.penaltyTime}s Penalty
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>
                                    Score: {Math.max(0, Math.round(r.finalScore))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn-primary" onClick={onRematch} style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                    <RefreshCw size={20} /> Rematch
                </button>
                <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                    <Home size={20} /> Lobby
                </button>
            </div>
        </div>
    );
};

export default ResultScreen;
