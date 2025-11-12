export declare function showScreen(screenId: string): void;
export declare function toggleElement(elementId: string, show: boolean): void;
export declare function sortPlayersByScore(players: Player[]): Player[];
export declare function formatNumber(value: number): number;
export declare function saveToStorage(key: string, value: any): void;
export declare function getFromStorage(key: string): any;
export declare function removeFromStorage(key: string): void;
export interface Player {
    name: string;
    scores: number[];
    gameCount: number;
    totalScore: number;
    finalScore: number;
}
export interface GameState {
    players: Player[];
    rateMultiplier: number;
    timestamp: string;
}
//# sourceMappingURL=utils.d.ts.map