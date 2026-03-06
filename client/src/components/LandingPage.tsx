import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Loader2, Users, User, Keyboard, Trophy, Zap, Crosshair, Target, ShieldAlert, Globe } from 'lucide-react';

const SERVER_URL = 'https://f1-wordrace.onrender.com';

const loadingMessages = [
    "Preparing track...",
    "Starting race server...",
    "Warming up engines...",
    "Checking tire pressure...",
    "Waiting for green light..."
];

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [isStarting, setIsStarting] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isStarting) {
            interval = setInterval(() => {
                setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [isStarting]);

    const handleStartRace = async () => {
        setIsStarting(true);
        setMessageIndex(0);

        const pollServer = async () => {
            try {
                // Ping the server. Using the root endpoint defined in index.ts
                const response = await fetch(`${SERVER_URL}/`);
                if (response.ok) {
                    navigate('/multiplayer');
                    return true;
                }
            } catch (error) {
                console.log("Server still waking up...");
            }
            return false;
        };

        // Polling loop
        const checkReady = async () => {
            const isReady = await pollServer();
            if (!isReady) {
                setTimeout(checkReady, 3000); // Check again in 3 seconds
            }
        };

        checkReady();
    };

    return (
        <div style={{ flex: 1, padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6rem', overflowY: 'auto', scrollBehavior: 'smooth' }}>

            {/* Hero Section */}
            <div id="home" className="glass-panel" style={{ padding: '4rem', maxWidth: '600px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginTop: '2rem' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <Flag size={48} color="var(--primary)" />
                </div>

                <div>
                    <h1 className="heading-1" style={{ fontSize: '3.5rem', marginBottom: '1rem', fontStyle: 'italic', letterSpacing: '-1px' }}>
                        <span style={{ color: 'var(--primary)' }}>FI</span> WordRace
                    </h1>
                    <p className="heading-3" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                        Race your friends by typing faster
                    </p>
                </div>

                <div style={{ width: '100%', marginTop: '2rem' }}>
                    {!isStarting ? (
                        <button
                            className="btn-primary"
                            style={{ width: '100%', padding: '1.25rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                            onClick={handleStartRace}
                        >
                            <Flag size={24} /> Start Race
                        </button>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '1rem' }}>
                            <Loader2 size={40} color="var(--primary)" className="spin" style={{ animation: 'spin 2s linear infinite' }} />
                            <p className="heading-3" style={{ color: 'var(--accent)', animation: 'pulse 1.5s infinite' }}>
                                {loadingMessages[messageIndex]}
                            </p>
                            <style>{`
                                @keyframes spin { 100% { transform: rotate(360deg); } }
                                @keyframes pulse { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
                            `}</style>
                        </div>
                    )}
                </div>

            </div>

            {/* How It Works Section */}
            <div id="how-it-works" style={{ maxWidth: '1000px', width: '100%' }}>
                <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '3rem' }}>How It Works</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <User size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>Step 1</h3>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Enter Your Name</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <Globe size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>Step 2</h3>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Create or join a room</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <Keyboard size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>Step 3</h3>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Start typing to accelerate your F1 car</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <Zap size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>Step 4</h3>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Faster and more accurate typing makes your car move faster</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <ShieldAlert size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>Step 5</h3>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Mistakes add time penalties</p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" style={{ maxWidth: '1000px', width: '100%' }}>
                <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '3rem' }}>Features</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Users size={24} color="var(--success)" />
                        <span style={{ fontWeight: 600 }}>Real-time multiplayer typing race</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Trophy size={24} color="var(--accent)" />
                        <span style={{ fontWeight: 600 }}>F1-style racing experience</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Globe size={24} color="var(--primary)" />
                        <span style={{ fontWeight: 600 }}>Room code system for playing with friends</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Target size={24} color="var(--accent)" />
                        <span style={{ fontWeight: 600 }}>Single player practice mode</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <ShieldAlert size={24} color="var(--error)" />
                        <span style={{ fontWeight: 600 }}>Accuracy penalty system</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Crosshair size={24} color="#00e5ff" />
                        <span style={{ fontWeight: 600 }}>Live typing speed calculation</span>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div id="about" className="glass-panel" style={{ maxWidth: '800px', width: '100%', padding: '4rem', textAlign: 'center', background: 'rgba(242, 24, 53, 0.05)', border: '1px solid rgba(242, 24, 53, 0.1)', marginBottom: '4rem' }}>
                <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>About</h2>
                <p className="text-body" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                    F1 WordRace is a browser-based typing race game where players compete in real time. Typing speed controls an F1 car on a track, combining gaming with typing practice.
                </p>
            </div>

        </div>
    );
};

export default LandingPage;
