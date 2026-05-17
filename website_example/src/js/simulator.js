// ===== Prisoner's Dilemma (single round) =====
const PD_PAYOFFS = {
  cooperate: { cooperate: [-1, -1], defect: [-10, 0] },
  defect:    { cooperate: [0, -10], defect: [-5, -5] },
};

const AI_LABELS = { cooperate: '沉默（合作）', defect: '認罪（背叛）' };

function pdChoose(playerChoice) {
  const aiChoice = Math.random() < 0.5 ? 'cooperate' : 'defect';
  const [playerPayoff, aiPayoff] = PD_PAYOFFS[playerChoice][aiChoice];

  const resultEl = document.getElementById('pd-result');
  const textEl = document.getElementById('pd-result-text');
  const detailEl = document.getElementById('pd-result-detail');

  resultEl.hidden = false;

  const playerLabel = AI_LABELS[playerChoice];
  const aiLabel = AI_LABELS[aiChoice];

  textEl.textContent = `你選擇「${playerLabel}」，對方選擇「${aiLabel}」`;

  let outcome = '';
  if (playerPayoff === 0) outcome = '你無罪釋放！但對方服刑 10 年。';
  else if (aiPayoff === 0) outcome = '對方無罪釋放！你服刑 10 年。';
  else if (playerPayoff === -1) outcome = '雙方都保持沉默，各服刑 1 年。這是帕累托最優！';
  else outcome = '雙方都認罪，各服刑 5 年。這是納許均衡，但對雙方都不好。';

  detailEl.innerHTML = `
    <div class="info-box info-note" style="margin:0.5rem 0;">
      <p>${outcome}</p>
      <p style="margin-top:0.5rem">你的刑期：<strong>${Math.abs(playerPayoff)} 年</strong> | 對方刑期：<strong>${Math.abs(aiPayoff)} 年</strong></p>
    </div>
  `;

  document.getElementById('btn-cooperate').disabled = true;
  document.getElementById('btn-defect').disabled = true;
}

function pdReset() {
  document.getElementById('pd-result').hidden = true;
  document.getElementById('btn-cooperate').disabled = false;
  document.getElementById('btn-defect').disabled = false;
}

// ===== Repeated Prisoner's Dilemma =====
let gameState = null;

const STRATEGIES = {
  'tit-for-tat': (history) => history.length === 0 ? 'cooperate' : history[history.length - 1].player,
  'always-defect': () => 'defect',
  'always-cooperate': () => 'cooperate',
  'random': () => Math.random() < 0.5 ? 'cooperate' : 'defect',
};

function startRepeatedPD() {
  const strategyKey = document.querySelector('input[name="ai-strategy"]:checked').value;
  gameState = { round: 0, playerScore: 0, aiScore: 0, history: [], strategy: strategyKey };

  const area = document.getElementById('repeated-game-area');
  area.innerHTML = '<div style="font-size:0.85rem;color:var(--color-text-subtle);margin-bottom:0.5rem">輪次 / 你的選擇 / 電腦選擇</div>';

  const scoreEl = document.getElementById('repeated-score');
  scoreEl.hidden = false;
  updateScoreDisplay();

  area.insertAdjacentHTML('beforeend', '<div style="margin-top:0.5rem;display:flex;gap:0.5rem;flex-wrap:wrap;" id="round-btns"><button class="btn btn-primary btn-sm" onclick="repeatChoice(\'cooperate\')">沉默（合作）</button><button class="btn btn-sm" style="background:var(--color-danger);color:#fff;border:none;padding:0.4rem 1rem;border-radius:8px;cursor:pointer" onclick="repeatChoice(\'defect\')">認罪（背叛）</button></div>');
}

function repeatChoice(playerChoice) {
  if (!gameState || gameState.round >= 10) return;

  const aiChoice = STRATEGIES[gameState.strategy](gameState.history);
  const [playerPayoff, aiPayoff] = PD_PAYOFFS[playerChoice][aiChoice];

  gameState.round++;
  gameState.playerScore += playerPayoff;
  gameState.aiScore += aiPayoff;
  gameState.history.push({ player: playerChoice, ai: aiChoice, playerPayoff, aiPayoff });

  const area = document.getElementById('repeated-game-area');
  const entry = document.createElement('div');
  entry.className = 'round-entry new';
  entry.innerHTML = `
    <span class="round-num">第 ${gameState.round} 輪</span>
    <span class="${playerChoice === 'cooperate' ? 'cooperate-badge' : 'defect-badge'}">${playerChoice === 'cooperate' ? '沉默' : '認罪'} (${playerPayoff})</span>
    <span class="${aiChoice === 'cooperate' ? 'cooperate-badge' : 'defect-badge'}">${aiChoice === 'cooperate' ? '沉默' : '認罪'} (${aiPayoff})</span>
  `;
  area.insertBefore(entry, area.querySelector('#round-btns'));

  updateScoreDisplay();

  if (gameState.round >= 10) {
    const btns = document.getElementById('round-btns');
    const winner = gameState.playerScore > gameState.aiScore ? '你贏了！' : gameState.playerScore < gameState.aiScore ? '電腦贏了！' : '平手！';
    btns.innerHTML = `<div class="info-box info-note" style="width:100%"><strong>遊戲結束 — ${winner}</strong><br>你的總得分：${gameState.playerScore} | 電腦：${gameState.aiScore}</div><button class="btn btn-secondary btn-sm" onclick="startRepeatedPD()" style="margin-top:0.5rem">再玩一次</button>`;
  }
}

function updateScoreDisplay() {
  document.getElementById('player-score').textContent = gameState.playerScore;
  document.getElementById('ai-score').textContent = gameState.aiScore;
  document.getElementById('round-count').textContent = gameState.round;
}

// ===== Nash Equilibrium Finder =====
function findNashEquilibrium() {
  const a11 = parseFloat(document.getElementById('a11').value);
  const b11 = parseFloat(document.getElementById('b11').value);
  const a12 = parseFloat(document.getElementById('a12').value);
  const b12 = parseFloat(document.getElementById('b12').value);
  const a21 = parseFloat(document.getElementById('a21').value);
  const b21 = parseFloat(document.getElementById('b21').value);
  const a22 = parseFloat(document.getElementById('a22').value);
  const b22 = parseFloat(document.getElementById('b22').value);

  if ([a11, b11, a12, b12, a21, b21, a22, b22].some(isNaN)) {
    document.getElementById('nash-result').innerHTML = '<p class="no-nash">請輸入有效的數字。</p>';
    return;
  }

  const nashCells = [];

  // Check (strategy1, strategy1): A prefers row1 if a11>=a21; B prefers col1 if b11>=b12
  if (a11 >= a21 && b11 >= b12) nashCells.push({ label: '(策略1, 策略1)', a: a11, b: b11 });
  // Check (strategy1, strategy2): A prefers row1 if a12>=a22; B prefers col2 if b12>=b11
  if (a12 >= a22 && b12 >= b11) nashCells.push({ label: '(策略1, 策略2)', a: a12, b: b12 });
  // Check (strategy2, strategy1): A prefers row2 if a21>=a11; B prefers col1 if b21>=b22
  if (a21 >= a11 && b21 >= b22) nashCells.push({ label: '(策略2, 策略1)', a: a21, b: b21 });
  // Check (strategy2, strategy2): A prefers row2 if a22>=a12; B prefers col2 if b22>=b21
  if (a22 >= a12 && b22 >= b21) nashCells.push({ label: '(策略2, 策略2)', a: a22, b: b22 });

  const resultEl = document.getElementById('nash-result');

  if (nashCells.length === 0) {
    resultEl.innerHTML = `
      <p class="no-nash">⚠️ 此賽局沒有純策略納許均衡。</p>
      <div class="info-box info-note" style="margin-top:1rem">
        <strong>提示：</strong> 根據納許定理，此賽局必定存在混合策略均衡。玩家應以特定機率隨機選擇策略。
      </div>
    `;
    return;
  }

  resultEl.innerHTML = `
    <p style="color:var(--color-success);font-weight:600;margin-bottom:0.75rem">找到 ${nashCells.length} 個純策略納許均衡：</p>
    ${nashCells.map(cell => `
      <div class="nash-cell">
        <strong>${cell.label}</strong>
        玩家 A 報酬：${cell.a}，玩家 B 報酬：${cell.b}
      </div>
    `).join('')}
    <div class="info-box info-note" style="margin-top:0.75rem;font-size:0.85rem">
      在納許均衡中，任何玩家單方面改變策略都不會提高自己的報酬。
    </div>
  `;
}

// Expose functions to global scope for inline onclick handlers
window.pdChoose = pdChoose;
window.pdReset = pdReset;
window.startRepeatedPD = startRepeatedPD;
window.repeatChoice = repeatChoice;
window.findNashEquilibrium = findNashEquilibrium;
