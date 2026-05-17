// Unit tests for game theory logic

// ===== Payoff data =====
const PD_PAYOFFS = {
  cooperate: { cooperate: [-1, -1], defect: [-10, 0] },
  defect:    { cooperate: [0, -10], defect: [-5, -5] },
};

// ===== Nash Equilibrium finder (mirrors simulator.js logic) =====
function findPureNashEquilibria(a11, b11, a12, b12, a21, b21, a22, b22) {
  const cells = [];
  if (a11 >= a21 && b11 >= b12) cells.push([0, 0]);
  if (a12 >= a22 && b12 >= b11) cells.push([0, 1]);
  if (a21 >= a11 && b21 >= b22) cells.push([1, 0]);
  if (a22 >= a12 && b22 >= b21) cells.push([1, 1]);
  return cells;
}

// ===== AI Strategies =====
const STRATEGIES = {
  'tit-for-tat': (history) => history.length === 0 ? 'cooperate' : history[history.length - 1].player,
  'always-defect': () => 'defect',
  'always-cooperate': () => 'cooperate',
};

// ===== Tests =====

describe('Prisoner\'s Dilemma payoffs', () => {
  test('mutual cooperation yields -1 each', () => {
    expect(PD_PAYOFFS.cooperate.cooperate).toEqual([-1, -1]);
  });

  test('defect against cooperate yields 0 for defector', () => {
    const [playerPayoff] = PD_PAYOFFS.defect.cooperate;
    expect(playerPayoff).toBe(0);
  });

  test('mutual defection yields -5 each (Nash equilibrium)', () => {
    expect(PD_PAYOFFS.defect.defect).toEqual([-5, -5]);
  });

  test('cooperation is pareto-superior to mutual defection', () => {
    const [ccA] = PD_PAYOFFS.cooperate.cooperate;
    const [ddA] = PD_PAYOFFS.defect.defect;
    expect(ccA).toBeGreaterThan(ddA);
  });
});

describe('Nash equilibrium finder', () => {
  test('prisoner\'s dilemma has one Nash equilibrium: (defect, defect)', () => {
    // PD: (cooperate=3, defect=5) for A; (cooperate=3, defect=5) for B (mapped to years avoided)
    // Using raw payoffs: a11=-1, b11=-1, a12=-10, b12=0, a21=0, b21=-10, a22=-5, b22=-5
    const equilibria = findPureNashEquilibria(-1, -1, -10, 0, 0, -10, -5, -5);
    expect(equilibria).toHaveLength(1);
    expect(equilibria[0]).toEqual([1, 1]);
  });

  test('stag hunt has two Nash equilibria', () => {
    // (4,4), (0,2), (2,0), (2,2)
    const equilibria = findPureNashEquilibria(4, 4, 0, 2, 2, 0, 2, 2);
    expect(equilibria).toHaveLength(2);
  });

  test('coordination game with dominant strategy has one equilibrium', () => {
    // Both prefer strategy 2 regardless
    const equilibria = findPureNashEquilibria(1, 1, 2, 3, 3, 2, 4, 4);
    expect(equilibria).toHaveLength(1);
    expect(equilibria[0]).toEqual([1, 1]);
  });

  test('matching pennies has no pure strategy Nash equilibrium', () => {
    // Head/Tail zero-sum: (1,-1),(-1,1),(-1,1),(1,-1)
    const equilibria = findPureNashEquilibria(1, -1, -1, 1, -1, 1, 1, -1);
    expect(equilibria).toHaveLength(0);
  });
});

describe('AI Strategies', () => {
  test('tit-for-tat cooperates on first round', () => {
    expect(STRATEGIES['tit-for-tat']([])).toBe('cooperate');
  });

  test('tit-for-tat mirrors last player move', () => {
    const history = [{ player: 'defect', ai: 'cooperate' }];
    expect(STRATEGIES['tit-for-tat'](history)).toBe('defect');
  });

  test('always-defect always returns defect', () => {
    expect(STRATEGIES['always-defect']([])).toBe('defect');
    expect(STRATEGIES['always-defect']([{ player: 'cooperate' }])).toBe('defect');
  });

  test('always-cooperate always returns cooperate', () => {
    expect(STRATEGIES['always-cooperate']([])).toBe('cooperate');
  });
});

describe('Game theory concepts', () => {
  test('mutual cooperation is pareto optimal in PD', () => {
    const [ccA, ccB] = PD_PAYOFFS.cooperate.cooperate;
    const [ddA, ddB] = PD_PAYOFFS.defect.defect;
    // cc dominates dd for both players
    expect(ccA > ddA && ccB > ddB).toBe(true);
  });

  test('defection is dominant strategy in single-round PD', () => {
    // For player A: defect vs cooperate > cooperate vs cooperate
    const defectVsCooperate = PD_PAYOFFS.defect.cooperate[0];
    const cooperateVsCooperate = PD_PAYOFFS.cooperate.cooperate[0];
    expect(defectVsCooperate).toBeGreaterThan(cooperateVsCooperate);

    // And: defect vs defect > cooperate vs defect
    const defectVsDefect = PD_PAYOFFS.defect.defect[0];
    const cooperateVsDefect = PD_PAYOFFS.cooperate.defect[0];
    expect(defectVsDefect).toBeGreaterThan(cooperateVsDefect);
  });
});
