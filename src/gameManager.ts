import { Player, formatNumber, sortPlayersByScore } from './utils.js';

/**
 * ゲーム管理クラス
 */
export class GameManager {
  private players: Player[] = [];
  private rateMultiplier: number = 1;
  private games: any[] = [];

  /**
   * プレイヤーを初期化
   * @param playerNames - プレイヤー名の配列
   */
  initializePlayers(playerNames: string[]): void {
    this.players = playerNames.map((name) => ({
      name: name,
      scores: [],
      gameCount: 0,
      totalScore: 0,
      finalScore: 0,
    }));
  }

  /**
   * レート倍率を設定
   * @param rate - 倍率
   */
  setRateMultiplier(rate: number): void {
    this.rateMultiplier = rate;
  }

  /**
   * スコアを記録
   * @param scores - 各プレイヤーのスコア
   */
  recordScores(scores: (string | number)[]): void {
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

  /**
   * 最終スコアを計算
   */
  private updateFinalScores(): void {
    this.players.forEach((player) => {
      player.finalScore = formatNumber(
        player.totalScore * this.rateMultiplier
      );
    });
  }

  /**
   * 現在のスコアを取得
   * @returns プレイヤー情報配列
   */
  getCurrentScores(): (Player & { currentScore: number })[] {
    return this.players.map((player) => ({
      ...player,
      currentScore:
        player.scores.length > 0 ? player.scores[player.scores.length - 1] : 0,
    }));
  }

  /**
   * ゲーム結果を取得（ソート済み）
   * @returns ソート済みプレイヤー配列
   */
  getResults(): Player[] {
    return sortPlayersByScore(this.players);
  }

  /**
   * プレイヤーのスコア履歴を取得
   * @param playerIndex - プレイヤーインデックス
   * @returns スコア配列
   */
  getPlayerScoreHistory(playerIndex: number): number[] {
    return this.players[playerIndex]?.scores || [];
  }

  /**
   * ゲーム状態をリセット
   */
  reset(): void {
    this.players = [];
    this.rateMultiplier = 1;
    this.games = [];
  }

  /**
   * ゲーム状態をエクスポート
   * @returns ゲーム状態
   */
  export(): any {
    return {
      players: this.players,
      rateMultiplier: this.rateMultiplier,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 全プレイヤーを取得
   */
  getPlayers(): Player[] {
    return this.players;
  }

  /**
   * レート倍率を取得
   */
  getRateMultiplier(): number {
    return this.rateMultiplier;
  }
}

// グローバルインスタンス
export const gameManager = new GameManager();
