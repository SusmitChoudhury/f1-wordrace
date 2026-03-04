import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface TypingAreaProps {
    socket: Socket | null;
    roomId: string;
    initialText: string;
    onProgress?: (progress: number, wpm: number, accuracy: number, mistakes: number) => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({ socket, roomId, initialText, onProgress }) => {
    const [text, setText] = useState(initialText);
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [mistakes, setMistakes] = useState(0);
    const [totalTypedKeys, setTotalTypedKeys] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setText(initialText);
    }, [initialText]);

    const activeCharRef = useRef<HTMLSpanElement>(null);

    // Auto-scroll to current typing position
    useEffect(() => {
        if (activeCharRef.current) {
            activeCharRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [input.length]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        // Prevent paste (will also be handled by onPaste attribute)
        if (Math.abs(val.length - input.length) > 1) return; // Prevent paste or mass delete

        if (!startTime && val.length > 0) {
            setStartTime(Date.now());
        }

        if (val.length > input.length) {
            setTotalTypedKeys(prev => prev + 1);
        }

        setInput(val);

        // Calculate correct portion
        let correctCount = 0;
        let isError = false;
        for (let i = 0; i < val.length; i++) {
            if (val[i] === text[i] && !isError) {
                correctCount++;
            } else {
                isError = true;
                // Count mistake if we just added this wrong character
                if (i === val.length - 1 && val.length > input.length) {
                    setMistakes(m => m + 1);
                }
            }
        }

        const currentProgress = correctCount / text.length;

        const timeElapsedMinutes = (Date.now() - (startTime || Date.now())) / 60000;
        const wordsTyped = correctCount / 5;
        const wpm = timeElapsedMinutes > 0 ? Math.round(wordsTyped / timeElapsedMinutes) : 0;

        const accuracy = totalTypedKeys > 0 ? Math.round(((totalTypedKeys - mistakes) / totalTypedKeys) * 100) : 100;

        if (onProgress) {
            onProgress(currentProgress, wpm, accuracy, mistakes);
        }

        // Send to server (using absolute correct character count as progress instead of ratio)
        if (socket) {
            socket.emit('typeProgress', { roomId, progress: correctCount, wpm, accuracy, mistakes });
        }

        // Dynamic expansion check (ratio check is still useful to determine when to fetch more)
        if (currentProgress > 0.8) {
            if (socket) {
                socket.emit('requestMoreText', { roomId, currentLength: text.length });
            }
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on('textExpanded', ({ newText }: { newText: string }) => {
                setText(prev => prev + ' ' + newText);
            });
            return () => {
                socket.off('textExpanded');
            };
        }
    }, [socket]);

    return (
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', width: '100%', cursor: 'text', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }} onClick={() => inputRef.current?.focus()}>
            <div
                style={{
                    fontSize: '1.5rem',
                    lineHeight: '2.5rem',
                    color: 'var(--text-muted)',
                    fontFamily: "'JetBrains Mono', monospace",
                    position: 'relative',
                    userSelect: 'none',
                    overflowY: 'auto',
                    flex: 1,
                    // Hide scrollbar for cleaner look, text auto-scrolls anyway
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                }}
            >
                <style>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {text.split('').map((char, index) => {
                    let color = 'var(--text-muted)';
                    let background = 'transparent';

                    if (index < input.length) {
                        if (input[index] === char) {
                            color = 'var(--success)';
                        } else {
                            color = 'white';
                            background = 'var(--error)';
                        }
                    } else if (index === input.length) {
                        color = 'var(--text-main)';
                        background = 'rgba(255, 255, 255, 0.1)';
                    }

                    return (
                        <span
                            key={index}
                            ref={index === input.length ? activeCharRef : null}
                            style={{
                                color,
                                backgroundColor: background,
                                borderBottom: index === input.length ? '2px solid var(--primary)' : 'none',
                                transition: 'color 0.1s, background-color 0.1s',
                                borderRadius: background !== 'transparent' && index !== input.length ? '4px' : '0'
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>

            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleChange}
                onPaste={(e) => e.preventDefault()}
                style={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0
                }}
                autoComplete="off"
                spellCheck="false"
            />
        </div>
    );
};

export default TypingArea;
