import { Player } from './utils.js';
export declare class GameManager {
    private players;
    private rateMultiplier;
    private games;
    initializePlayers(playerNames: string[]): void;
    setRateMultiplier(rate: number): void;
    recordScores(scores: (string | number)[]): void;
    private updateFinalScores;
    getCurrentScores(): (Player & {
        currentScore: number;
    })[];
    getResults(): Player[];
    getPlayerScoreHistory(playerIndex: number): number[];
    reset(): void;
    export(): any;
    getPlayers(): Player[];
    getRateMultiplier(): number;
}
export declare const gameManager: GameManager;
//# sourceMappingURL=gameManager.d.ts.map