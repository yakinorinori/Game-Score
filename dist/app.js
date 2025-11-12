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
const nextGameBtn = document.getElementById('nextGameBtn');
const winnerButtonsContainer = document.getElementById('winnerButtonsContainer');
const winnerSelectionSection = document.getElementById('winnerSelectionSection');
const scoreInputSection = document.getElementById('scoreInputSection');
const scoresDisplaySection = document.getElementById('scoresDisplaySection');
const finalResults = document.getElementById('finalResults');
const restartBtn = document.getElementById('restartBtn');
const playerHistoryModal = document.getElementById('playerHistoryModal');
const playerHistoryTitle = document.getElementById('playerHistoryTitle');
const playerHistoryBody = document.getElementById('playerHistoryBody');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeModalBtnBottom = document.getElementById('closeModalBtnBottom');
let currentWinnerId = -1;
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
    currentWinnerId = -1;
    winnerButtonsContainer.innerHTML = '';
    const players = gameManager.getPlayers();
    players.forEach((player, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary winner-btn';
        btn.textContent = player.name;
        btn.addEventListener('click', () => selectWinner(index));
        winnerButtonsContainer.appendChild(btn);
    });
    winnerSelectionSection.classList.remove('hidden');
    scoreInputSection.classList.add('hidden');
    scoresDisplaySection.classList.add('hidden');
    console.log('ゲーム画面初期化完了');
}
function selectWinner(index) {
    console.log('勝者選択:', index);
    currentWinnerId = index;
    const buttons = winnerButtonsContainer.querySelectorAll('.winner-btn');
    buttons.forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('selected');
        }
        else {
            btn.classList.remove('selected');
        }
    });
    scoreInputContainer.innerHTML = '';
    const players = gameManager.getPlayers();
    players.forEach((player, playerIndex) => {
        if (playerIndex !== index) {
            const div = document.createElement('div');
            div.className = 'score-input-item';
            const inputId = `score${playerIndex}`;
            div.innerHTML = `
              <label for="${inputId}">${player.name}</label>
              <input type="number" id="${inputId}" name="score${playerIndex}" class="score-input-field" data-index="${playerIndex}" min="0" placeholder="正の値を入力">
          `;
            scoreInputContainer.appendChild(div);
        }
    });
    winnerSelectionSection.classList.add('hidden');
    scoreInputSection.classList.remove('hidden');
    console.log('スコア入力フォーム準備完了');
}
function updateScoresDisplay() {
    scoresContainer.innerHTML = '';
    gameManager.getCurrentScores().forEach((player, index) => {
        const div = document.createElement('div');
        div.className = 'score-card clickable';
        div.style.cursor = 'pointer';
        div.innerHTML = `
            <div class="score-card-name">${player.name}</div>
            <div class="score-card-value">${player.totalScore}</div>
            <div class="score-card-total">${player.gameCount}ゲーム</div>
            ${gameManager.getRateMultiplier() !== 1
            ? `<div class="score-card-total">最終: ${player.finalScore}</div>`
            : ''}
        `;
        div.addEventListener('click', () => showPlayerHistory(index));
        scoresContainer.appendChild(div);
    });
}
function showPlayerHistory(playerIndex) {
    const players = gameManager.getPlayers();
    const player = players[playerIndex];
    const scores = gameManager.getPlayerScoreHistory(playerIndex);
    console.log(`プレイヤー: ${player.name}, スコア履歴:`, scores);
    playerHistoryTitle.textContent = `${player.name}のゲーム履歴`;
    let historyHTML = '';
    if (scores.length === 0) {
        historyHTML = '<p>まだゲームをプレイしていません。</p>';
    }
    else {
        scores.forEach((score, gameNum) => {
            historyHTML += `
        <div class="game-history-item">
          <div class="game-history-item-score">${score}</div>
          <div class="game-history-item-detail">ゲーム${gameNum + 1}</div>
        </div>
      `;
        });
    }
    playerHistoryBody.innerHTML = historyHTML;
    playerHistoryModal.classList.add('active');
    playerHistoryModal.classList.remove('hidden');
}
recordScoreBtn.addEventListener('click', () => {
    if (currentWinnerId === -1) {
        alert('勝者を選択してください');
        return;
    }
    const scoreInputs = document.querySelectorAll('.score-input-field');
    const scoreValues = Array.from(scoreInputs).map((input) => input.value.trim());
    if (scoreValues.some((s) => s === '')) {
        alert('すべてのプレイヤーのスコアを入力してください');
        return;
    }
    const numScores = scoreValues.map(s => {
        const num = parseFloat(s);
        if (isNaN(num)) {
            throw new Error(`無効なスコア: ${s}`);
        }
        if (num < 0) {
            throw new Error('正の値のみ入力してください');
        }
        return num;
    });
    try {
        const finalScores = [];
        const allPlayers = gameManager.getPlayers();
        let scoreIndex = 0;
        let loserTotal = 0;
        for (let i = 0; i < allPlayers.length; i++) {
            if (i === currentWinnerId) {
                finalScores.push(0);
            }
            else {
                const negativeScore = -numScores[scoreIndex];
                finalScores.push(negativeScore);
                loserTotal += numScores[scoreIndex];
                scoreIndex++;
            }
        }
        finalScores[currentWinnerId] = loserTotal;
        console.log('入力スコア:', numScores);
        console.log('最終スコア:', finalScores);
        gameManager.recordScores(finalScores);
        updateScoresDisplay();
        scoreInputs.forEach((input) => {
            input.value = '';
        });
        scoreInputSection.classList.add('hidden');
        scoresDisplaySection.classList.remove('hidden');
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
nextGameBtn.addEventListener('click', () => {
    console.log('次のゲーム開始');
    currentWinnerId = -1;
    winnerSelectionSection.classList.remove('hidden');
    scoreInputSection.classList.add('hidden');
    scoresDisplaySection.classList.add('hidden');
});
endGameBtn.addEventListener('click', () => {
    console.log('ゲーム終了');
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
function closePlayerHistoryModal() {
    playerHistoryModal.classList.remove('active');
    playerHistoryModal.classList.add('hidden');
}
closeModalBtn.addEventListener('click', () => {
    closePlayerHistoryModal();
});
closeModalBtnBottom.addEventListener('click', () => {
    closePlayerHistoryModal();
});
playerHistoryModal.addEventListener('click', (e) => {
    if (e.target === playerHistoryModal) {
        closePlayerHistoryModal();
    }
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