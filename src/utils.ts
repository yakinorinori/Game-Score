// ===== ユーティリティ関数 =====

/**
 * 画面を切り替える
 * @param screenId - 表示する画面のID
 */
export function showScreen(screenId: string): void {
  const screens = document.querySelectorAll('.screen');
  screens.forEach((screen) => {
    screen.classList.remove('active');
  });

  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add('active');
  }
}

/**
 * 要素の表示/非表示を切り替える
 * @param elementId - 要素のID
 * @param show - 表示するか
 */
export function toggleElement(elementId: string, show: boolean): void {
  const element = document.getElementById(elementId);
  if (element) {
    if (show) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }
}

/**
 * プレイヤーをスコアでソート（降順）
 * @param players - プレイヤー配列
 * @returns ソート済み配列
 */
export function sortPlayersByScore(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * 数値をフォーマット
 * @param value - 数値
 * @returns フォーマット済み文字列
 */
export function formatNumber(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * LocalStorageにデータを保存
 * @param key - キー
 * @param value - 値
 */
export function saveToStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('ストレージ保存エラー:', e);
  }
}

/**
 * LocalStorageからデータを取得
 * @param key - キー
 * @returns 取得した値
 */
export function getFromStorage(key: string): any {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error('ストレージ取得エラー:', e);
    return null;
  }
}

/**
 * LocalStorageからデータを削除
 * @param key - キー
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('ストレージ削除エラー:', e);
  }
}

// ===== 型定義 =====

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
