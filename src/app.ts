import {
  showScreen,
  toggleElement,
  Player,
} from './utils.js';
import { gameManager } from './gameManager.js';

// ===== DOM要素 =====
const playerCountInput = document.getElementById(
  'playerCount'
) as HTMLInputElement;
const confirmCountBtn = document.getElementById(
  'confirmCountBtn'
) as HTMLButtonElement;
const playerNamesSection = document.getElementById(
  'playerNamesSection'
) as HTMLDivElement;
const playerNamesContainer = document.getElementById(
  'playerNamesContainer'
) as HTMLDivElement;
const startGameBtn = document.getElementById(
  'startGameBtn'
) as HTMLButtonElement;

const rateMultiplierInput = document.getElementById(
  'rateMultiplier'
) as HTMLInputElement;
const confirmRateBtn = document.getElementById(
  'confirmRateBtn'
) as HTMLButtonElement;

const scoresContainer = document.getElementById(
  'scoresContainer'
) as HTMLDivElement;
const scoreInputContainer = document.getElementById(
  'scoreInputContainer'
) as HTMLDivElement;
const recordScoreBtn = document.getElementById(
  'recordScoreBtn'
) as HTMLButtonElement;
const endGameBtn = document.getElementById(
  'endGameBtn'
) as HTMLButtonElement;

const finalResults = document.getElementById(
  'finalResults'
) as HTMLDivElement;
const restartBtn = document.getElementById(
  'restartBtn'
) as HTMLButtonElement;

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
  const nameInputs = document.querySelectorAll(
    '.player-name-input-field'
  ) as NodeListOf<HTMLInputElement>;
  const names = Array.from(nameInputs).map(
    (input) => input.value.trim() || 'プレイヤー'
  );

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

/**
 * ゲーム画面を初期化
 */
function initializeGameScreen(): void {
  // スコア表示エリアを初期化
  updateScoresDisplay();

  // スコア入力フォームを初期化
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

/**
 * スコア表示を更新
 */
function updateScoresDisplay(): void {
  scoresContainer.innerHTML = '';
  gameManager.getCurrentScores().forEach((player) => {
    const div = document.createElement('div');
    div.className = 'score-card';
    div.innerHTML = `
            <div class="score-card-name">${player.name}</div>
            <div class="score-card-value">${player.totalScore}</div>
            <div class="score-card-total">${player.gameCount}ゲーム</div>
            ${
              gameManager.getRateMultiplier() !== 1
                ? `<div class="score-card-total">最終: ${player.finalScore}</div>`
                : ''
            }
        `;
    scoresContainer.appendChild(div);
  });
}

/**
 * スコア記録
 */
recordScoreBtn.addEventListener('click', () => {
  const scoreInputs = document.querySelectorAll(
    '.score-input-field'
  ) as NodeListOf<HTMLInputElement>;
  const scores = Array.from(scoreInputs).map((input) => input.value.trim());

  // 入力値を検証
  if (scores.some((s) => s === '')) {
    alert('すべてのプレイヤーのスコアを入力してください');
    return;
  }

  // 数値の妥当性を検証
  const numScores = scores.map(s => {
    const num = parseFloat(s);
    if (isNaN(num)) {
      throw new Error(`Invalid score: ${s}`);
    }
    return num;
  });

  try {
    gameManager.recordScores(numScores);
    updateScoresDisplay();

    // 入力フォームをリセット
    scoreInputs.forEach((input) => {
      input.value = '';
    });

    // フィードバック
    const originalText = recordScoreBtn.textContent;
    recordScoreBtn.textContent = 'Recorded!';
    recordScoreBtn.disabled = true;
    setTimeout(() => {
      recordScoreBtn.textContent = originalText;
      recordScoreBtn.disabled = false;
    }, 1000);
  } catch (error) {
    alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
function showResults(): void {
  finalResults.innerHTML = '';
  const results = gameManager.getResults();

  results.forEach((player, rank) => {
    const div = document.createElement('div');
    div.className = 'result-item';

    const rankLabels = ['1st', '2nd', '3rd'];
    const rankText = rankLabels[rank] || `${rank + 1}th`;

    div.innerHTML = `
            <span class="result-rank">${rankText}</span>
            <span class="result-name">${player.name}</span>
            <div class="result-score">
                <div class="result-total">${player.finalScore}</div>
                <div class="result-rate">
                    ${player.totalScore}points
                    ${
                      gameManager.getRateMultiplier() !== 1
                        ? `x ${gameManager.getRateMultiplier()}`
                        : ''
                    }
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
console.log('Game Score Recording App started');
