/* ===== ユーティリティ関数 ===== */

/**
 * 画面を切り替える
 * @param {string} screenId - 表示する画面のID
 */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

/**
 * 要素の表示/非表示を切り替える
 * @param {string} elementId - 要素のID
 * @param {boolean} show - 表示するか
 */
function toggleElement(elementId, show) {
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
 * 配列をスコアでソート（降順）
 * @param {Array} players - プレイヤー配列
 * @returns {Array} - ソート済み配列
 */
function sortPlayersByScore(players) {
    return [...players].sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * 数値をフォーマット
 * @param {number} value - 数値
 * @returns {string} - フォーマット済み文字列
 */
function formatNumber(value) {
    return Math.round(value * 10) / 10;
}

/**
 * LocalStorageにデータを保存
 * @param {string} key - キー
 * @param {any} value - 値
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('ストレージ保存エラー:', e);
    }
}

/**
 * LocalStorageからデータを取得
 * @param {string} key - キー
 * @returns {any} - 取得した値
 */
function getFromStorage(key) {
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
 * @param {string} key - キー
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error('ストレージ削除エラー:', e);
    }
}
