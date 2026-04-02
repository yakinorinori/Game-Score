/* ===== ゲーム管理クラス ===== */

class GameManager {
    constructor() {
        this.players = [];
        this.rateMultiplier = 1;
        this.games = []; // ゲーム履歴
    }

    /**
     * プレイヤーを初期化
     * @param {Array<string>} playerNames - プレイヤー名の配列
     */
    initializePlayers(playerNames) {
        this.players = playerNames.map(name => ({
            name: name,
            scores: [], // 各ゲームのスコア
            gameCount: 0, // ゲーム数
            totalScore: 0, // 総スコア（倍率適用前）
            finalScore: 0 // 最終スコア（倍率適用後）
        }));
    }

    /**
     * レート倍率を設定
     * @param {number} rate - 倍率
     */
    setRateMultiplier(rate) {
        this.rateMultiplier = rate;
    }

    /**
     * スコアを記録
     * @param {Array<number>} scores - 各プレイヤーのスコア
     */
    recordScores(scores) {
        if (scores.length !== this.players.length) {
            throw new Error('スコア数がプレイヤー数と一致しません');
        }

        scores.forEach((score, index) => {
            const numScore = parseFloat(score);
            if (!isNaN(numScore)) {
                this.players[index].scores.push(numScore);
                this.players[index].gameCount += 1;
                this.players[index].totalScore += numScore;
                this.updateFinalScores();
            }
        });
    }

    /**
     * 最終スコアを計算
     */
    updateFinalScores() {
        this.players.forEach(player => {
            player.finalScore = formatNumber(player.totalScore * this.rateMultiplier);
        });
    }

    /**
     * 現在のスコアを取得
     * @returns {Array} - プレイヤー情報配列
     */
    getCurrentScores() {
        return this.players.map(player => ({
            ...player,
            currentScore: player.scores.length > 0 ? player.scores[player.scores.length - 1] : 0
        }));
    }

    /**
     * ゲーム結果を取得（ソート済み）
     * @returns {Array} - ソート済みプレイヤー配列
     */
    getResults() {
        return sortPlayersByScore(this.players);
    }

    /**
     * プレイヤーのスコア履歴を取得
     * @param {number} playerIndex - プレイヤーインデックス
     * @returns {Array} - スコア配列
     */
    getPlayerScoreHistory(playerIndex) {
        return this.players[playerIndex]?.scores || [];
    }

    /**
     * ゲーム状態をリセット
     */
    reset() {
        this.players = [];
        this.rateMultiplier = 1;
        this.games = [];
    }

    /**
     * ゲーム状態をエクスポート
     * @returns {object} - ゲーム状態
     */
    export() {
        return {
            players: this.players,
            rateMultiplier: this.rateMultiplier,
            timestamp: new Date().toISOString()
        };
    }
}

// グローバルインスタンス
const gameManager = new GameManager();
