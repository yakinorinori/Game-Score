export function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach((screen) => {
        screen.classList.remove('active');
    });
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
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