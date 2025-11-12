import { showScreen, toggleElement, } from './utils.js';
import { gameManager } from './gameManager.js';
const playerCountInput = document.getElementById('playerCount');
const confirmCountBtn = document.getElementById('confirmCountBtn');
const playerNamesSection = document.getElementById('playerNamesSection');
const playerNamesContainer = document.getElementById('playerNamesContainer');
const startGameBtn = document.getElementById('startGameBtn');
const rateMultiplierInput = document.getElementById('rateMultiplier');
const confirmRateBtn = document.getElementById('confirmRateBtn');
const scoresContainer = document.getElementById('scoresContainer');
const scoreInputContainer = document.getElementById('scoreInputContainer');
const recordScoreBtn = document.getElementById('recordScoreBtn');
const endGameBtn = document.getElementById('endGameBtn');
const finalResults = document.getElementById('finalResults');
const restartBtn = document.getElementById('restartBtn');
console.log('=== DOM要素の確認 ===');
console.log('playerCountInput:', playerCountInput);
console.log('confirmCountBtn:', confirmCountBtn);
console.log('startGameBtn:', startGameBtn);
console.log('confirmRateBtn:', confirmRateBtn);
console.log('recordScoreBtn:', recordScoreBtn);
console.log('endGameBtn:', endGameBtn);
console.log('=== イベントリスナー登録開始 ===');
if (!startGameBtn) {
    console.error('ERROR: startGameBtn が見つかりません');
}
else {
    console.log('OK: startGameBtn が見つかりました');
}
confirmCountBtn.addEventListener('click', () => {
    console.log('[EVENT] confirmCountBtn クリック');
    const count = parseInt(playerCountInput.value);
    console.log('入力プレイヤー数:', count);
    if (count < 1 || count > 10) {
        alert('1～10人の範囲で設定してください');
        return;
    }
    playerNamesContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'player-name-input';
        const inputId = `playerName${i}`;
        div.innerHTML = `
            <label for="${inputId}">プレイヤー${i + 1}</label>
            <input type="text" id="${inputId}" name="playerName${i}" class="player-name-input-field" placeholder="名前を入力" value="プレイヤー${i + 1}">
        `;
        playerNamesContainer.appendChild(div);
    }
    console.log('プレイヤー名入力フォーム生成完了');
    toggleElement('playerNamesSection', true);
    console.log('playerNamesSection表示');
});
startGameBtn.addEventListener('click', () => {
    console.log('[EVENT] startGameBtn クリック');
    const nameInputs = document.querySelectorAll('.player-name-input-field');
    console.log('名前入力フィールド数:', nameInputs.length);
    const names = Array.from(nameInputs).map((input) => input.value.trim() || 'プレイヤー');
    console.log('入力プレイヤー名:', names);
    if (names.length === 0) {
        alert('プレイヤー数が不正です');
        return;
    }
    gameManager.initializePlayers(names);
    console.log('ゲーム管理に名前登録完了');
    showScreen('rateScreen');
    console.log('rateScreen表示指示');
});
confirmRateBtn.addEventListener('click', () => {
    const rateValue = rateMultiplierInput.value.trim();
    if (!rateValue) {
        alert('倍率を入力してください');
        return;
    }
    const rate = parseFloat(rateValue);
    if (isNaN(rate) || rate <= 0) {
        alert('0より大きい倍率を設定してください');
        return;
    }
    console.log('=== ゲーム開始処理 ===');
    console.log('入力倍率:', rate);
    gameManager.setRateMultiplier(rate);
    console.log('倍率設定完了');
    initializeGameScreen();
    console.log('ゲーム画面初期化完了');
    showScreen('gameScreen');
    console.log('gameScreen表示指示完了');
    const gameScreenElement = document.getElementById('gameScreen');
    console.log('gameScreenElement:', gameScreenElement);
    console.log('gameScreenクラス:', gameScreenElement?.className);
    console.log('gameScreen内のh1:', gameScreenElement?.querySelector('h1')?.textContent);
    console.log('scoresContainer:', scoresContainer);
    console.log('scoreInputContainer:', scoreInputContainer);
});
function initializeGameScreen() {
    console.log('ゲーム画面初期化開始');
    console.log('プレイヤー数:', gameManager.getPlayers().length);
    updateScoresDisplay();
    console.log('スコア表示更新完了');
    scoreInputContainer.innerHTML = '';
    const players = gameManager.getPlayers();
    console.log('プレイヤー情報:', players);
    players.forEach((player, index) => {
        const div = document.createElement('div');
        div.className = 'score-input-item';
        const inputId = `score${index}`;
        div.innerHTML = `
            <label for="${inputId}">${player.name}</label>
            <input type="number" id="${inputId}" name="score${index}" class="score-input-field" data-index="${index}" placeholder="スコアを入力">
        `;
        scoreInputContainer.appendChild(div);
    });
    console.log('スコア入力フォーム生成完了');
    console.log('scoreInputContainer個数:', scoreInputContainer.children.length);
}
function updateScoresDisplay() {
    scoresContainer.innerHTML = '';
    gameManager.getCurrentScores().forEach((player) => {
        const div = document.createElement('div');
        div.className = 'score-card';
        div.innerHTML = `
            <div class="score-card-name">${player.name}</div>
            <div class="score-card-value">${player.totalScore}</div>
            <div class="score-card-total">${player.gameCount}ゲーム</div>
            ${gameManager.getRateMultiplier() !== 1
            ? `<div class="score-card-total">最終: ${player.finalScore}</div>`
            : ''}
        `;
        scoresContainer.appendChild(div);
    });
}
recordScoreBtn.addEventListener('click', () => {
    const scoreInputs = document.querySelectorAll('.score-input-field');
    const scores = Array.from(scoreInputs).map((input) => input.value.trim());
    if (scores.some((s) => s === '')) {
        alert('すべてのプレイヤーのスコアを入力してください');
        return;
    }
    const numScores = scores.map(s => {
        const num = parseFloat(s);
        if (isNaN(num)) {
            throw new Error(`無効なスコア: ${s}`);
        }
        return num;
    });
    try {
        gameManager.recordScores(numScores);
        updateScoresDisplay();
        scoreInputs.forEach((input) => {
            input.value = '';
        });
        const originalText = recordScoreBtn.textContent;
        recordScoreBtn.textContent = '✓ 記録完了';
        recordScoreBtn.disabled = true;
        setTimeout(() => {
            recordScoreBtn.textContent = originalText;
            recordScoreBtn.disabled = false;
        }, 1000);
    }
    catch (error) {
        alert('エラー: ' + (error instanceof Error ? error.message : '不明なエラー'));
    }
});
endGameBtn.addEventListener('click', () => {
    showResults();
    showScreen('resultScreen');
});
function showResults() {
    finalResults.innerHTML = '';
    const results = gameManager.getResults();
    results.forEach((player, rank) => {
        const div = document.createElement('div');
        div.className = 'result-item';
        const rankLabels = ['1位', '2位', '3位'];
        const rankText = rankLabels[rank] || `${rank + 1}位`;
        div.innerHTML = `
            <span class="result-rank">${rankText}</span>
            <span class="result-name">${player.name}</span>
            <div class="result-score">
                <div class="result-total">${player.finalScore}</div>
                <div class="result-rate">
                    ${player.totalScore}点
                    ${gameManager.getRateMultiplier() !== 1
            ? `× ${gameManager.getRateMultiplier()}倍`
            : ''}
                </div>
            </div>
        `;
        finalResults.appendChild(div);
    });
}
restartBtn.addEventListener('click', () => {
    gameManager.reset();
    rateMultiplierInput.value = '1';
    playerCountInput.value = '2';
    playerNamesSection.classList.add('hidden');
    showScreen('setupScreen');
});
console.log('ゲームスコア記録アプリ起動');
window.addEventListener('error', (event) => {
    console.error('グローバルエラー:', event.error);
    console.error('スタック:', event.error?.stack);
});
window.addEventListener('unhandledrejection', (event) => {
    console.error('未処理のPromise拒否:', event.reason);
});
console.log('gameManager:', gameManager);
console.log('showScreen:', showScreen);
//# sourceMappingURL=app.js.map