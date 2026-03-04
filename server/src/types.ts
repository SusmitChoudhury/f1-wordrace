export type RoomState = 'waiting' | 'ready' | 'racing' | 'finished';

export interface PlayerInfo {
    id: string; // socket id
    name: string;
    isReady: boolean;
    progress: number; // 0 to 1
    wpm: number;
    accuracy: number;
    mistakes: number;
    wordIndex: number; // For keeping track of text completion and expansion
    penaltyTime: number; // In seconds
}

export interface RoomInfo {
    id: string;
    state: RoomState;
    players: Record<string, PlayerInfo>;
    text: string;
    startTime: number | null;
    duration: number; // Race duration in seconds (30, 60, 90)
}
