export function showScreen(screenId) {
    console.log(`[showScreen] 画面切り替え: ${screenId}`);
    const screens = document.querySelectorAll('.screen');
    console.log(`[showScreen] 全スクリーン数: ${screens.length}`);
    screens.forEach((screen) => {
        screen.classList.remove('active');
        screen.classList.remove('hidden');
    });
    const screen = document.getElementById(screenId);
    console.log(`[showScreen] 対象スクリーン: `, screen);
    if (screen) {
        screen.classList.add('active');
        screen.classList.remove('hidden');
        console.log(`[showScreen] ${screenId} にクラス 'active' を追加、'hidden' を削除`);
    }
    else {
        console.error(`[showScreen] エラー: ${screenId} が見つかりません`);
    }
}
export function toggleElement(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        if (show) {
            element.classList.remove('hidden');
        }
        else {
            element.classList.add('hidden');
        }
    }
}
export function sortPlayersByScore(players) {
    return [...players].sort((a, b) => b.totalScore - a.totalScore);
}
export function formatNumber(value) {
    return Math.round(value * 10) / 10;
}
export function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (e) {
        console.error('ストレージ保存エラー:', e);
    }
}
export function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    catch (e) {
        console.error('ストレージ取得エラー:', e);
        return null;
    }
}
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
    }
    catch (e) {
        console.error('ストレージ削除エラー:', e);
    }
}
//# sourceMappingURL=utils.js.map