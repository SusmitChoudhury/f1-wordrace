import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Loader2 } from 'lucide-react';

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
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-panel" style={{ padding: '4rem', maxWidth: '600px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

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
        </div>
    );
};

export default LandingPage;
