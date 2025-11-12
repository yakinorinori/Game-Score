import { formatNumber, sortPlayersByScore } from './utils.js';
export class GameManager {
    constructor() {
        this.players = [];
        this.rateMultiplier = 1;
        this.games = [];
    }
    initializePlayers(playerNames) {
        this.players = playerNames.map((name) => ({
            name: name,
            scores: [],
            gameCount: 0,
            totalScore: 0,
            finalScore: 0,
        }));
    }
    setRateMultiplier(rate) {
        this.rateMultiplier = rate;
    }
    recordScores(scores) {
        if (scores.length !== this.players.length) {
            throw new Error('スコア数がプレイヤー数と一致しません');
        }
        scores.forEach((score, index) => {
            const numScore = parseFloat(String(score));
            if (!isNaN(numScore)) {
                this.players[index].scores.push(numScore);
                this.players[index].gameCount += 1;
                this.players[index].totalScore += numScore;
                this.updateFinalScores();
            }
        });
    }
    updateFinalScores() {
        this.players.forEach((player) => {
            player.finalScore = formatNumber(player.totalScore * this.rateMultiplier);
        });
    }
    getCurrentScores() {
        return this.players.map((player) => ({
            ...player,
            currentScore: player.scores.length > 0 ? player.scores[player.scores.length - 1] : 0,
        }));
    }
    getResults() {
        return sortPlayersByScore(this.players);
    }
    getPlayerScoreHistory(playerIndex) {
        return this.players[playerIndex]?.scores || [];
    }
    reset() {
        this.players = [];
        this.rateMultiplier = 1;
        this.games = [];
    }
    export() {
        return {
            players: this.players,
            rateMultiplier: this.rateMultiplier,
            timestamp: new Date().toISOString(),
        };
    }
    getPlayers() {
        return this.players;
    }
    getRateMultiplier() {
        return this.rateMultiplier;
    }
}
export const gameManager = new GameManager();
//# sourceMappingURL=gameManager.js.map