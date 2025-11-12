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
const nextGameBtn = document.getElementById(
  'nextGameBtn'
) as HTMLButtonElement;

const winnerButtonsContainer = document.getElementById(
  'winnerButtonsContainer'
) as HTMLDivElement;
const winnerSelectionSection = document.getElementById(
  'winnerSelectionSection'
) as HTMLDivElement;
const scoreInputSection = document.getElementById(
  'scoreInputSection'
) as HTMLDivElement;
const scoresDisplaySection = document.getElementById(
  'scoresDisplaySection'
) as HTMLDivElement;

const finalResults = document.getElementById(
  'finalResults'
) as HTMLDivElement;
const restartBtn = document.getElementById(
  'restartBtn'
) as HTMLButtonElement;

const playerHistoryModal = document.getElementById(
  'playerHistoryModal'
) as HTMLDivElement;
const playerHistoryTitle = document.getElementById(
  'playerHistoryTitle'
) as HTMLHeadingElement;
const playerHistoryBody = document.getElementById(
  'playerHistoryBody'
) as HTMLDivElement;
const closeModalBtn = document.getElementById(
  'closeModalBtn'
) as HTMLButtonElement;
const closeModalBtnBottom = document.getElementById(
  'closeModalBtnBottom'
) as HTMLButtonElement;

// ゲーム状態
let currentWinnerId: number = -1;

// デバッグ：DOM要素の確認
console.log('=== DOM要素の確認 ===');
console.log('playerCountInput:', playerCountInput);
console.log('confirmCountBtn:', confirmCountBtn);
console.log('startGameBtn:', startGameBtn);
console.log('confirmRateBtn:', confirmRateBtn);
console.log('recordScoreBtn:', recordScoreBtn);
console.log('endGameBtn:', endGameBtn);

// ===== イベントリスナー =====

console.log('=== イベントリスナー登録開始 ===');

// null チェック
if (!startGameBtn) {
  console.error('ERROR: startGameBtn が見つかりません');
} else {
  console.log('OK: startGameBtn が見つかりました');
}

/**
 * プレイヤー数確定
 */
confirmCountBtn.addEventListener('click', () => {
  console.log('[EVENT] confirmCountBtn クリック');
  const count = parseInt(playerCountInput.value);
  console.log('入力プレイヤー数:', count);

  if (count < 1 || count > 10) {
    alert('1～10人の範囲で設定してください');
    return;
  }

  // プレイヤー名入力フォームを生成
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

/**
 * ゲーム開始（プレイヤー名入力後）
 */
startGameBtn.addEventListener('click', () => {
  console.log('[EVENT] startGameBtn クリック');
  const nameInputs = document.querySelectorAll(
    '.player-name-input-field'
  ) as NodeListOf<HTMLInputElement>;
  console.log('名前入力フィールド数:', nameInputs.length);
  
  const names = Array.from(nameInputs).map(
    (input) => input.value.trim() || 'プレイヤー'
  );
  console.log('入力プレイヤー名:', names);

  if (names.length === 0) {
    alert('プレイヤー数が不正です');
    return;
  }

  // ゲーム管理に名前を登録
  gameManager.initializePlayers(names);
  console.log('ゲーム管理に名前登録完了');

  // レート設定画面へ移動
  showScreen('rateScreen');
  console.log('rateScreen表示指示');
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

/**
 * ゲーム画面を初期化
 */
function initializeGameScreen(): void {
  console.log('ゲーム画面初期化開始');
  console.log('プレイヤー数:', gameManager.getPlayers().length);
  
  currentWinnerId = -1;
  
  // 勝者選択ボタンを生成
  winnerButtonsContainer.innerHTML = '';
  const players = gameManager.getPlayers();
  
  players.forEach((player, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary winner-btn';
    btn.textContent = player.name;
    btn.addEventListener('click', () => selectWinner(index));
    winnerButtonsContainer.appendChild(btn);
  });
  
  // 各セクションの表示状態を初期化
  winnerSelectionSection.classList.remove('hidden');
  scoreInputSection.classList.add('hidden');
  scoresDisplaySection.classList.add('hidden');
  
  console.log('ゲーム画面初期化完了');
}

/**
 * 勝者を選択
 */
function selectWinner(index: number): void {
  console.log('勝者選択:', index);
  currentWinnerId = index;
  
  // 勝者ボタンをハイライト
  const buttons = winnerButtonsContainer.querySelectorAll('.winner-btn');
  buttons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
  
  // スコア入力フォームを生成（勝者以外）
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
  
  // スコア入力セクションを表示
  winnerSelectionSection.classList.add('hidden');
  scoreInputSection.classList.remove('hidden');
  
  console.log('スコア入力フォーム準備完了');
}

/**
 * スコア表示を更新
 */
function updateScoresDisplay(): void {
  scoresContainer.innerHTML = '';
  gameManager.getCurrentScores().forEach((player, index) => {
    const div = document.createElement('div');
    div.className = 'score-card clickable';
    div.style.cursor = 'pointer';
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
    div.addEventListener('click', () => showPlayerHistory(index));
    scoresContainer.appendChild(div);
  });
}

/**
 * プレイヤー履歴を表示
 */
function showPlayerHistory(playerIndex: number): void {
  const players = gameManager.getPlayers();
  const player = players[playerIndex];
  const scores = gameManager.getPlayerScoreHistory(playerIndex);
  
  console.log(`プレイヤー: ${player.name}, スコア履歴:`, scores);
  
  playerHistoryTitle.textContent = `${player.name}のゲーム履歴`;
  
  let historyHTML = '';
  if (scores.length === 0) {
    historyHTML = '<p>まだゲームをプレイしていません。</p>';
  } else {
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

/**
 * スコア記録
 */
recordScoreBtn.addEventListener('click', () => {
  if (currentWinnerId === -1) {
    alert('勝者を選択してください');
    return;
  }

  const scoreInputs = document.querySelectorAll(
    '.score-input-field'
  ) as NodeListOf<HTMLInputElement>;
  
  // 入力値を検証
  const scoreValues = Array.from(scoreInputs).map((input) => input.value.trim());
  if (scoreValues.some((s) => s === '')) {
    alert('すべてのプレイヤーのスコアを入力してください');
    return;
  }

  // 数値の妥当性を検証
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
    // 勝者以外のスコアを取得（正の値を負の値に変換）
    const finalScores: number[] = [];
    const allPlayers = gameManager.getPlayers();
    let scoreIndex = 0;
    let loserTotal = 0;
    
    for (let i = 0; i < allPlayers.length; i++) {
      if (i === currentWinnerId) {
        // 勝者のスコアは後で計算
        finalScores.push(0);
      } else {
        const negativeScore = -numScores[scoreIndex];
        finalScores.push(negativeScore);
        loserTotal += numScores[scoreIndex];
        scoreIndex++;
      }
    }

    // 勝者のスコアを計算（敗者スコアの合計を正の値に）
    finalScores[currentWinnerId] = loserTotal;

    console.log('入力スコア:', numScores);
    console.log('最終スコア:', finalScores);
    
    gameManager.recordScores(finalScores);
    updateScoresDisplay();

    // 入力フォームをリセット
    scoreInputs.forEach((input) => {
      input.value = '';
    });

    // スコア表示セクションを表示
    scoreInputSection.classList.add('hidden');
    scoresDisplaySection.classList.remove('hidden');

    // フィードバック
    const originalText = recordScoreBtn.textContent;
    recordScoreBtn.textContent = '✓ 記録完了';
    recordScoreBtn.disabled = true;
    setTimeout(() => {
      recordScoreBtn.textContent = originalText;
      recordScoreBtn.disabled = false;
    }, 1000);
  } catch (error) {
    alert('エラー: ' + (error instanceof Error ? error.message : '不明なエラー'));
  }
});

/**
 * 次のゲーム
 */
nextGameBtn.addEventListener('click', () => {
  console.log('次のゲーム開始');
  currentWinnerId = -1;
  
  // 勝者選択画面に戻す
  winnerSelectionSection.classList.remove('hidden');
  scoreInputSection.classList.add('hidden');
  scoresDisplaySection.classList.add('hidden');
});

/**
 * ゲーム終了
 */
endGameBtn.addEventListener('click', () => {
  console.log('ゲーム終了');
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

    const rankLabels = ['1位', '2位', '3位'];
    const rankText = rankLabels[rank] || `${rank + 1}位`;

    div.innerHTML = `
            <span class="result-rank">${rankText}</span>
            <span class="result-name">${player.name}</span>
            <div class="result-score">
                <div class="result-total">${player.finalScore}</div>
                <div class="result-rate">
                    ${player.totalScore}点
                    ${
                      gameManager.getRateMultiplier() !== 1
                        ? `× ${gameManager.getRateMultiplier()}倍`
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

/**
 * モーダルを閉じる
 */
function closePlayerHistoryModal(): void {
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

// ===== 初期化 =====
console.log('ゲームスコア記録アプリ起動');

// グローバルエラーハンドラ
window.addEventListener('error', (event) => {
  console.error('グローバルエラー:', event.error);
  console.error('スタック:', event.error?.stack);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未処理のPromise拒否:', event.reason);
});

// モジュール読み込みチェック
console.log('gameManager:', gameManager);
console.log('showScreen:', showScreen);
