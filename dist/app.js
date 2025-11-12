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
confirmCountBtn.addEventListener('click', () => {
    const count = parseInt(playerCountInput.value);
    if (count < 1 || count > 10) {
        alert('1～10人の範囲で設定してください');
        return;
    }
    playerNamesContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'player-name-input';
        div.innerHTML = `
            <label>プレイヤー${i + 1}</label>
            <input type="text" class="player-name-input-field" placeholder="名前を入力" value="プレイヤー${i + 1}">
        `;
        playerNamesContainer.appendChild(div);
    }
    toggleElement('playerNamesSection', true);
});
startGameBtn.addEventListener('click', () => {
    const nameInputs = document.querySelectorAll('.player-name-input-field');
    const names = Array.from(nameInputs).map((input) => input.value.trim() || 'プレイヤー');
    if (names.length === 0) {
        alert('プレイヤー数が不正です');
        return;
    }
    gameManager.initializePlayers(names);
    showScreen('rateScreen');
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
    gameManager.setRateMultiplier(rate);
    initializeGameScreen();
    showScreen('gameScreen');
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
        div.innerHTML = `
            <label>${player.name}</label>
            <input type="number" class="score-input-field" data-index="${index}" placeholder="スコアを入力">
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
//# sourceMappingURL=app.js.map