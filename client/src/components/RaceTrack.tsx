import React from 'react';
import type { PlayerInfo } from '../../../server/src/types';

interface RaceTrackProps {
    players: PlayerInfo[];
    myPlayerId?: string;
    duration: number;
}

const RaceTrack: React.FC<RaceTrackProps> = ({ players, myPlayerId, duration }) => {
    // Math: Average pro typist is 150 WPM (which is super fast, 150*5 = 750 keystrokes / minute).
    // The visual max distance of the track should be calculated based on the duration.
    // e.g. 60s race -> max theoretical keystrokes = 750 * (60/60) = 750.
    // So distance scale = 750 keystrokes to cover 100% of the track.

    // Convert duration (seconds) -> minutes
    const durationMins = duration / 60;
    // Let's set the visual max target at 160 WPM perfect typing.
    const maxTheoreticalCharacters = 160 * 5 * durationMins;

    return (
        <div style={{ padding: '0', marginBottom: '1rem', width: '100%', position: 'relative', overflow: 'hidden', flexShrink: 0, borderRadius: '16px', border: '2px solid #2a3d24' }}>

            {/* The Environment wrapper */}
            {/* We apply a small infinite background animation to give illusion of forward speed */}
            <div style={{
                width: '100%',
                background: '#4CAF50', // Grass green base
                position: 'relative',
                padding: '2rem 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
            }}>

                {/* Asphalt Road */}
                <div style={{
                    width: '100%',
                    background: '#1a1a1a', // Dark asphalt
                    borderTop: '4px solid #fff',
                    borderBottom: '4px solid #fff',
                    position: 'relative',
                    padding: '1.5rem 0',
                    boxShadow: '0 0 10px rgba(0,0,0,0.8)'
                }}>

                    {/* Start/Finish lines */}
                    <div style={{
                        position: 'absolute',
                        left: '4%',
                        top: 0, bottom: 0,
                        width: '8px',
                        background: 'repeating-linear-gradient(to bottom, #fff 0, #fff 8px, #000 8px, #000 16px)'
                    }} />

                    <div style={{
                        position: 'absolute',
                        right: '4%',
                        top: 0, bottom: 0,
                        width: '8px',
                        background: 'repeating-linear-gradient(to bottom, #fff 0, #fff 8px, #000 8px, #000 16px)',
                        boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                    }} />

                    {players.map((player, index) => {
                        // In the new logic, progress = absolute keystrokes
                        // If progress was a ratio originally, we adjust. Assuming backend sends absolute keystrokes now.
                        // Wait, did I update backend? Yes, bot.progress = totalTyped. 
                        // Client typingArea sends `progress: correctCount`.
                        const absoluteDistance = player.progress;

                        // Map 0 -> maxTheoreticalCharacters to 4% -> 88% visual left position (leaving room for car body at finish)
                        // If they exceed theoretical max, clamp at 90%
                        const percentage = Math.min((absoluteDistance / maxTheoreticalCharacters) * 84, 86);
                        const leftPos = `calc(4% + ${percentage}%)`;

                        const isMe = player.id === myPlayerId;
                        const carColor = isMe ? 'var(--primary)' : 'var(--accent)';

                        // Bouncing animation inline styles
                        const animationStyle = {
                            animation: player.wpm > 0 ? 'carBounce 0.2s infinite alternate' : 'none'
                        };

                        return (
                            <div key={player.id} style={{ position: 'relative', height: '40px', marginBottom: index === players.length - 1 ? 0 : '1.5rem' }}>

                                {/* Dashed Center Lane Marking (drawn below the FIRST lane only to separate them) */}
                                {index === 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-12px',
                                        left: '4%',
                                        right: '4%',
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #fff 50%, transparent 50%)',
                                        backgroundSize: '40px 100%',
                                    }} />
                                )}

                                {/* The Car itself */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: leftPos,
                                        transform: 'translateY(-50%)',
                                        transition: 'left 0.2s linear',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        zIndex: 2
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(5px 5px 5px rgba(0,0,0,0.7))', ...animationStyle }}>
                                        <svg viewBox="0 0 100 30" width="80" height="24">
                                            {/* Exhaust Flare (only active if wpm > 10) */}
                                            {player.wpm > 10 && (
                                                <polygon points="0,15 -15,10 -10,15 -15,20" fill="rgba(255, 165, 0, 0.8)" />
                                            )}

                                            {/* Rear Wing Endplates */}
                                            <rect x="2" y="2" width="6" height="26" fill="#111" rx="1" />
                                            {/* Rear Wing Main */}
                                            <rect x="4" y="6" width="6" height="18" fill={carColor} />

                                            {/* Rear Wheels */}
                                            <rect x="12" y="0" width="16" height="6" fill="#1a1a1a" rx="2" />
                                            <rect x="12" y="24" width="16" height="6" fill="#1a1a1a" rx="2" />

                                            {/* Suspension Rear */}
                                            <line x1="18" y1="6" x2="25" y2="12" stroke="#444" strokeWidth="2" />
                                            <line x1="18" y1="24" x2="25" y2="18" stroke="#444" strokeWidth="2" />

                                            {/* Floor/Sidepods base */}
                                            <path d="M 25 7 L 55 5 L 60 10 L 60 20 L 55 25 L 25 23 Z" fill="#222" />

                                            {/* Main central chassis */}
                                            <path d="M 10 12 L 10 18 L 40 18 L 75 16 L 85 16 L 85 14 L 75 14 L 40 12 Z" fill={carColor} />

                                            {/* Sidepods top (colored) */}
                                            <path d="M 30 8 L 50 7 L 55 11 L 30 11 Z" fill={carColor} />
                                            <path d="M 30 22 L 50 23 L 55 19 L 30 19 Z" fill={carColor} />

                                            {/* Halo & Cockpit */}
                                            <ellipse cx="50" cy="15" rx="5" ry="3.5" fill="#000" />
                                            <path d="M 45 15 L 50 11 L 55 15 L 50 19 Z" fill="none" stroke="#333" strokeWidth="1.5" />

                                            {/* Front Suspension */}
                                            <line x1="75" y1="14" x2="80" y2="6" stroke="#444" strokeWidth="1.5" />
                                            <line x1="75" y1="16" x2="80" y2="24" stroke="#444" strokeWidth="1.5" />

                                            {/* Front Wheels */}
                                            <rect x="75" y="1" width="14" height="5" fill="#1a1a1a" rx="1.5" />
                                            <rect x="75" y="24" width="14" height="5" fill="#1a1a1a" rx="1.5" />

                                            {/* Nose cone */}
                                            <path d="M 75 14 L 92 14 L 95 15 L 92 16 L 75 16 Z" fill={carColor} />

                                            {/* Front Wing */}
                                            <path d="M 88 5 L 96 5 L 98 15 L 96 25 L 88 25 L 90 20 L 92 15 L 90 10 Z" fill="#111" />
                                            <rect x="90" y="10" width="4" height="10" fill={carColor} rx="1" />
                                        </svg>
                                    </div>
                                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,1)', whiteSpace: 'nowrap' }}>
                                        {player.name} {isMe && '(You)'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Inject Global Keyframe for bounding */}
            <style>{`
                @keyframes carBounce {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-2px); }
                }
            `}</style>
        </div>
    );
};

export default RaceTrack;

