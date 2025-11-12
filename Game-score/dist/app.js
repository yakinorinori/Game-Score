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
    const rate = parseFloat(rateMultiplierInput.value);
    if (rate <= 0) {
        alert('0より大きい倍率を設定してください');
        return;
    }
    gameManager.setRateMultiplier(rate);
    initializeGameScreen();
    showScreen('gameScreen');
});
function initializeGameScreen() {
    updateScoresDisplay();
    scoreInputContainer.innerHTML = '';
    gameManager.getPlayers().forEach((player, index) => {
        const div = document.createElement('div');
        div.className = 'score-input-item';
        div.innerHTML = `
            <label>${player.name}</label>
            <input type="number" class="score-input-field" data-index="${index}" placeholder="スコアを入力">
        `;
        scoreInputContainer.appendChild(div);
    });
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
    const scores = Array.from(scoreInputs).map((input) => input.value);
    if (scores.some((s) => s === '')) {
        alert('すべてのプレイヤーのスコアを入力してください');
        return;
    }
    try {
        gameManager.recordScores(scores);
        updateScoresDisplay();
        scoreInputs.forEach((input) => {
            input.value = '';
        });
        recordScoreBtn.textContent = '✓ 記録完了';
        setTimeout(() => {
            recordScoreBtn.textContent = 'スコア記録';
        }, 1000);
    }
    catch (error) {
        alert('エラー: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
        let rankEmoji = '🥇';
        if (rank === 1)
            rankEmoji = '🥈';
        if (rank === 2)
            rankEmoji = '🥉';
        div.innerHTML = `
            <span class="result-rank">${rankEmoji}</span>
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
console.log('🎮 ゲームスコア記録アプリ起動');
//# sourceMappingURL=app.js.map