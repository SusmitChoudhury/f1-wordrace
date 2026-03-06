import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, User, Play, Keyboard } from 'lucide-react';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [joinCode, setJoinCode] = useState('');
    const [playerName, setPlayerName] = useState(`Guest-${Math.floor(Math.random() * 10000)}`);

    const generateRoomCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleCreateRoom = () => {
        if (!playerName.trim()) return alert('Please enter a name');
        const code = generateRoomCode();
        navigate(`/room/${code}?mode=multiplayer&name=${encodeURIComponent(playerName)}`);
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!playerName.trim()) return alert('Please enter a name');
        if (joinCode.length === 6) {
            navigate(`/room/${joinCode}?mode=multiplayer&name=${encodeURIComponent(playerName)}`);
        } else {
            alert('Room code must be 6 digits.');
        }
    };

    const handleSinglePlayer = () => {
        if (!playerName.trim()) return alert('Please enter a name');
        const code = generateRoomCode();
        navigate(`/room/${code}?mode=singleplayer&name=${encodeURIComponent(playerName)}`);
    };

    return (
        <div style={{ flex: 1, padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6rem', overflowY: 'auto' }}>

            {/* Hero Section */}
            <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', width: '100%', textAlign: 'center', marginTop: '2rem' }}>
                <Keyboard size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h2 className="heading-1" style={{ marginBottom: '0.5rem' }}>FI WordRace</h2>
                <p className="text-body" style={{ marginBottom: '2rem' }}>
                    Race against friends or AI by typing fast and accurately.
                </p>

                <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Your Name</label>
                    <input
                        type="text"
                        className="input-field"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        maxLength={15}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Multiplayer Section */}
                    <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px' }}>
                        <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Users size={24} /> Multiplayer
                        </h3>

                        <button className="btn-primary" onClick={handleCreateRoom} style={{ width: '100%', marginBottom: '1.5rem' }}>
                            <Play size={20} /> Create New Room
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        </div>

                        <form onSubmit={handleJoinRoom} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder="Enter 6-digit room code"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="input-field"
                                style={{ textAlign: 'center', letterSpacing: '0.1em', fontSize: '1.125rem' }}
                            />
                            <button type="submit" className="btn-secondary" disabled={joinCode.length !== 6}>
                                Join
                            </button>
                        </form>
                    </div>

                    {/* Single Player Section */}
                    <div>
                        <button className="btn-secondary" onClick={handleSinglePlayer} style={{ width: '100%' }}>
                            <User size={20} /> Practice vs AI
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
