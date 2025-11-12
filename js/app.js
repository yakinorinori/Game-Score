/* ===== メインアプリケーション ===== */

// DOM要素
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

// ===== イベントリスナー =====

/**
 * プレイヤー数確定
 */
confirmCountBtn.addEventListener('click', () => {
    const count = parseInt(playerCountInput.value);
    
    if (count < 1 || count > 10) {
        alert('1～10人の範囲で設定してください');
        return;
    }

    // プレイヤー名入力フォームを生成
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

/**
 * ゲーム開始（プレイヤー名入力後）
 */
startGameBtn.addEventListener('click', () => {
    const nameInputs = document.querySelectorAll('.player-name-input-field');
    const names = Array.from(nameInputs).map(input => input.value.trim() || 'プレイヤー');

    if (names.length === 0) {
        alert('プレイヤー数が不正です');
        return;
    }

    // ゲーム管理に名前を登録
    gameManager.initializePlayers(names);

    // レート設定画面へ移動
    showScreen('rateScreen');
});

/**
 * レート確定
 */
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

/**
 * ゲーム画面を初期化
 */
function initializeGameScreen() {
    // スコア表示エリアを初期化
    updateScoresDisplay();

    // スコア入力フォームを初期化
    scoreInputContainer.innerHTML = '';
    gameManager.players.forEach((player, index) => {
        const div = document.createElement('div');
        div.className = 'score-input-item';
        div.innerHTML = `
            <label>${player.name}</label>
            <input type="number" class="score-input-field" data-index="${index}" placeholder="スコアを入力">
        `;
        scoreInputContainer.appendChild(div);
    });
}

/**
 * スコア表示を更新
 */
function updateScoresDisplay() {
    scoresContainer.innerHTML = '';
    gameManager.getCurrentScores().forEach(player => {
        const div = document.createElement('div');
        div.className = 'score-card';
        div.innerHTML = `
            <div class="score-card-name">${player.name}</div>
            <div class="score-card-value">${player.totalScore}</div>
            <div class="score-card-total">${player.gameCount}ゲーム</div>
            ${gameManager.rateMultiplier !== 1 ? `<div class="score-card-total">最終: ${player.finalScore}</div>` : ''}
        `;
        scoresContainer.appendChild(div);
    });
}

/**
 * スコア記録
 */
recordScoreBtn.addEventListener('click', () => {
    const scoreInputs = document.querySelectorAll('.score-input-field');
    const scores = Array.from(scoreInputs).map(input => input.value);

    // 入力値を検証
    if (scores.some(s => s === '')) {
        alert('すべてのプレイヤーのスコアを入力してください');
        return;
    }

    try {
        gameManager.recordScores(scores);
        updateScoresDisplay();

        // 入力フォームをリセット
        scoreInputs.forEach(input => input.value = '');

        // フィードバック
        recordScoreBtn.textContent = '✓ 記録完了';
        setTimeout(() => {
            recordScoreBtn.textContent = 'スコア記録';
        }, 1000);

    } catch (error) {
        alert('エラー: ' + error.message);
    }
});

/**
 * ゲーム終了
 */
endGameBtn.addEventListener('click', () => {
    showResults();
    showScreen('resultScreen');
});

/**
 * 結果画面を表示
 */
function showResults() {
    finalResults.innerHTML = '';
    const results = gameManager.getResults();

    results.forEach((player, rank) => {
        const div = document.createElement('div');
        div.className = 'result-item';
        
        let rankEmoji = '🥇';
        if (rank === 1) rankEmoji = '🥈';
        if (rank === 2) rankEmoji = '🥉';

        div.innerHTML = `
            <span class="result-rank">${rankEmoji}</span>
            <span class="result-name">${player.name}</span>
            <div class="result-score">
                <div class="result-total">${player.finalScore}</div>
                <div class="result-rate">
                    ${player.totalScore}点
                    ${gameManager.rateMultiplier !== 1 ? `× ${gameManager.rateMultiplier}倍` : ''}
                </div>
            </div>
        `;
        finalResults.appendChild(div);
    });
}

/**
 * リスタート
 */
restartBtn.addEventListener('click', () => {
    gameManager.reset();
    rateMultiplierInput.value = '1';
    playerCountInput.value = '2';
    playerNamesSection.classList.add('hidden');
    showScreen('setupScreen');
});

// ===== 初期化 =====
console.log('ゲームスコア記録アプリ起動');
