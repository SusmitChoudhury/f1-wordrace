import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, User, Play, Keyboard, Trophy, Zap, Crosshair, Target, ShieldAlert, Globe } from 'lucide-react';

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

            {/* How It Works Section */}
            <div style={{ maxWidth: '1000px', width: '100%' }}>
                <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '3rem' }}>How It Works</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <User size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>Step 1</h3>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Enter Your Name</p>
                        <p className="text-body" style={{ fontSize: '0.875rem' }}>Players enter a display name before starting the race.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <Globe size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>Step 2</h3>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Choose Game Mode</p>
                        <p className="text-body" style={{ fontSize: '0.875rem' }}>Players can either race against friends in multiplayer or challenge the AI in single-player mode.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <Keyboard size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>Step 3</h3>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Start Typing</p>
                        <p className="text-body" style={{ fontSize: '0.875rem' }}>A paragraph will appear. The faster and more accurately you type, the faster your car moves on the track.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <Trophy size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>Step 4</h3>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Win the Race</p>
                        <p className="text-body" style={{ fontSize: '0.875rem' }}>The player who types faster and reaches the furthest on the track within the time limit wins the race.</p>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', padding: '4rem', textAlign: 'center', background: 'rgba(242, 24, 53, 0.05)', border: '1px solid rgba(242, 24, 53, 0.1)' }}>
                <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>About FI WordRace</h2>
                <p className="text-body" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                    FI WordRace is a competitive typing racing game where speed and accuracy determine your performance on the track.
                </p>
                <p className="text-body" style={{ fontSize: '1.125rem' }}>
                    Players race against friends or AI by typing paragraphs quickly and correctly. The game combines typing practice with a fun racing experience, making it both educational and entertaining.
                </p>
            </div>

            {/* Features Section */}
            <div style={{ maxWidth: '1000px', width: '100%', marginBottom: '4rem' }}>
                <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '3rem' }}>Features</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Users size={24} color="var(--success)" />
                        <span style={{ fontWeight: 600 }}>Real-time multiplayer racing</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Target size={24} color="var(--primary)" />
                        <span style={{ fontWeight: 600 }}>AI opponent mode</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Crosshair size={24} color="var(--accent)" />
                        <span style={{ fontWeight: 600 }}>Typing speed and accuracy tracking</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Zap size={24} color="#00e5ff" />
                        <span style={{ fontWeight: 600 }}>Dynamic race track visualization</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <ShieldAlert size={24} color="var(--error)" />
                        <span style={{ fontWeight: 600 }}>Penalty system for typing mistakes</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
