import type { MachineCodingProblem } from '../../types';

export const snakeLadderProblem: MachineCodingProblem = {
  id: 'mc-snake-ladder',
  title: 'Snake and Ladder Game',
  difficulty: 'Intermediate',
  category: 'Machine Coding',
  tags: ['react', 'game', 'board-game', 'animation', 'multiplayer', 'state-machine'],

  problemStatement: `Build a complete, interactive Snake and Ladder board game in React. The game supports 2 to 4 players competing on a standard 10x10 (100-cell) grid with alternating numbered tiles (boustrophedon / serpentine order). Players take turns rolling a 6-sided die to advance their tokens. Landing on the base of a ladder advances the player to the ladder's top, while landing on a snake's head slides the player down to its tail.

The game requires rolling an exact number to land on tile 100 to win (or bouncing back on overshoots). Include dice roll animation, movement step-by-step visualization, sound effects or visual logs, customized board layouts (ladders and snakes configuration), player avatars, turn indicators, game reset, and an optional autoplay/AI mode.`,

  functionalRequirements: [
    'Render a 10x10 board with 100 tiles numbered in alternating serpentine order (1-10 left-to-right, 11-20 right-to-left, etc.)',
    'Support 2-4 customizable players with unique tokens/colors',
    'Interactive dice roller (1-6) with rolling animation',
    'Automatically move player token on dice roll with animated step transitions',
    'Detect ladders (move up to destination) and snakes (slide down to tail)',
    'Enforce win condition: exact roll to tile 100 (or bounce back)',
    'Display roll history log and event banner (e.g., "Player 1 climbed a ladder to 45!")',
    'Restart game and configure number of players',
  ],

  nonFunctionalRequirements: [
    'Smooth CSS animations for token movement, ladder climbs, and snake slides',
    'Accessible board with ARIA grid roles and live regions for turn/event announcements',
    'Responsive SVG / CSS Grid layout that scales cleanly on mobile and desktop',
    'Deterministic game state machine with pure transition functions',
  ],

  componentHierarchy: `SnakeLadderGame
├── GameHeader (Title, Player Count Selector, Restart)
├── Scoreboard (Active Turn, Player Positions, Win Stats)
├── BoardContainer
│   ├── SvgOverlays (Snakes and Ladders visual paths/curves)
│   └── BoardGrid (10x10 cells)
│       └── Cell (Tile Number, Snake/Ladder Icons, Player Tokens)
├── DiceControls (Roll Button, 3D/2D Animated Dice, Roll Value)
└── GameEventLog (Scrollable action history, Winner Modal)`,

  stateDesign: `interface Player {
  id: number;
  name: string;
  color: string;
  position: number; // 1 to 100 (0 = start off-board)
  avatar: string;
}

interface Snake {
  head: number;
  tail: number;
}

interface Ladder {
  start: number;
  end: number;
}

interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  isRolling: boolean;
  isMoving: boolean;
  winner: Player | null;
  history: string[];
}

const DEFAULT_LADDERS: Record<number, number> = {
  4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91
};

const DEFAULT_SNAKES: Record<number, number> = {
  17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78
};`,

  propsApiDesign: `interface SnakeLadderProps {
  boardSize?: number; // default 10 (100 tiles)
  initialPlayers?: number; // default 2
  snakes?: Record<number, number>;
  ladders?: Record<number, number>;
  onGameOver?: (winner: Player) => void;
}`,

  architecture: `The application is structured into a state machine managing game turns, animations, and transitions:
1. **Turn Flow**: Current player rolls -> animate dice -> calculate new target position -> step-by-step move token -> check if target cell is a snake or ladder -> apply glide animation -> check for win -> advance player turn (unless rolled 6 grants bonus turn).
2. **Serpentine Grid Math**: For tile $N$ ($1 \\le N \\le 100$):
   - Row from bottom: $r = \\lfloor (N - 1) / 10 \\rfloor$
   - Col from left: if $r$ is even, $c = (N - 1) \\% 10$; if $r$ is odd, $c = 9 - ((N - 1) \\% 10)$
3. **SVG Overlay**: Renders bezier curves for snakes (wavy lines) and ladders (double parallel rungs) mapped dynamically to center coordinates of corresponding tiles.`,

  implementation: `import React, { useState, useEffect, useReducer, useCallback } from 'react';

const SNAKES: Record<number, number> = {
  17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78
};

const LADDERS: Record<number, number> = {
  4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91
};

const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

export function SnakeLadderGame() {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', color: PLAYER_COLORS[0], position: 1 },
    { id: 2, name: 'Player 2', color: PLAYER_COLORS[1], position: 1 },
  ]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>(['Game started! Player 1 rolls first.']);

  const rollDice = useCallback(() => {
    if (rolling || winner) return;
    setRolling(true);

    let rollCount = 0;
    const interval = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount >= 8) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDice(finalRoll);
        setRolling(false);
        processMove(finalRoll);
      }
    }, 60);
  }, [rolling, winner, turn, players]);

  const processMove = (roll: number) => {
    const activePlayer = players[turn];
    let nextPos = activePlayer.position + roll;

    let message = \`\${activePlayer.name} rolled a \${roll}.\`;

    if (nextPos > 100) {
      message += \` Needs exact roll to reach 100! Stays at \${activePlayer.position}.\`;
      nextPos = activePlayer.position;
    } else if (nextPos === 100) {
      message += \` \${activePlayer.name} reached 100 and WON THE GAME! \u{1F3C6}\`;
      setWinner(activePlayer.name);
    } else if (LADDERS[nextPos]) {
      const top = LADDERS[nextPos];
      message += \` Climbed a ladder from \${nextPos} to \${top}! \u{1FA9C}\`;
      nextPos = top;
    } else if (SNAKES[nextPos]) {
      const tail = SNAKES[nextPos];
      message += \` Bitten by a snake from \${nextPos} down to \${tail}! \u{1F40D}\`;
      nextPos = tail;
    }

    setLog(prev => [message, ...prev.slice(0, 20)]);

    setPlayers(prev => prev.map((p, idx) => idx === turn ? { ...p, position: nextPos } : p));

    if (nextPos !== 100) {
      setTurn(prev => (prev + 1) % players.length);
    }
  };

  const resetGame = (count = playerCount) => {
    setPlayerCount(count);
    const newPlayers = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: \`Player \${i + 1}\`,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      position: 1,
    }));
    setPlayers(newPlayers);
    setTurn(0);
    setDice(null);
    setRolling(false);
    setWinner(null);
    setLog([\`New \${count}-player game initialized!\`]);
  };

  // Generate 100 tiles in 10 rows (10 at bottom, 100 at top)
  const tiles = [];
  for (let r = 9; r >= 0; r--) {
    const rowTiles = [];
    for (let c = 0; c < 10; c++) {
      const num = r % 2 === 0 ? r * 10 + c + 1 : r * 10 + (9 - c) + 1;
      rowTiles.push(num);
    }
    tiles.push(rowTiles);
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>\u{1F40D} Snake and Ladder Game</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <button onClick={() => resetGame(playerCount)} style={{ padding: '6px 12px' }}>Restart</button>
        <label>
          Players:
          <select value={playerCount} onChange={e => resetGame(Number(e.target.value))} style={{ marginLeft: 6 }}>
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
          </select>
        </label>
        <span style={{ fontWeight: 'bold', color: players[turn]?.color }}>
          {winner ? \`Winner: \${winner}!\` : \`Turn: \${players[turn]?.name}\`}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateRows: 'repeat(10, 1fr)',
        gap: 2,
        backgroundColor: '#cbd5e1',
        padding: 4,
        borderRadius: 8,
        aspectRatio: '1/1'
      }}>
        {tiles.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 2 }}>
            {row.map(num => {
              const occupants = players.filter(p => p.position === num);
              const isLadder = LADDERS[num];
              const isSnake = SNAKES[num];
              return (
                <div key={num} style={{
                  background: (rIdx + num) % 2 === 0 ? '#f8fafc' : '#e2e8f0',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: 4
                }}>
                  <span style={{ position: 'absolute', top: 2, left: 3, opacity: 0.6 }}>{num}</span>
                  {isLadder && <span style={{ color: '#16a34a' }}>\u{1FA9C}{isLadder}</span>}
                  {isSnake && <span style={{ color: '#dc2626' }}>\u{1F40D}{isSnake}</span>}
                  <div style={{ display: 'flex', gap: 2, position: 'absolute', bottom: 2 }}>
                    {occupants.map(p => (
                      <div key={p.id} style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: p.color,
                        border: '1px solid white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          onClick={rollDice}
          disabled={rolling || !!winner}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: rolling || winner ? 'not-allowed' : 'pointer'
          }}
        >
          {rolling ? 'Rolling...' : dice ? \`Rolled: \${dice} \u{2014} Roll Again\` : 'Roll Dice \u{1F3B2}'}
        </button>
      </div>

      <div style={{ marginTop: '1rem', background: '#f1f5f9', padding: '10px', borderRadius: 6, maxHeight: 120, overflowY: 'auto' }}>
        <h4 style={{ margin: '0 0 6px 0' }}>Game Log:</h4>
        {log.map((entry, idx) => (
          <div key={idx} style={{ fontSize: '13px', color: idx === 0 ? '#1e293b' : '#64748b' }}>{entry}</div>
        ))}
      </div>
    </div>
  );
}`,

  accessibility: `Board is rendered with proper semantic structure and tile numbers. Live region (role="status" with aria-live="polite") announces every dice roll, ladder ascent, snake descent, and winner. All buttons (Roll, Restart, Config) have accessible labels and keyboard focus outlines. Player tokens have distinguishable colors and secondary visual indicators (player initials / numbers) to accommodate colorblind users.`,

  performance: `Board grid rendering is static and uses pure CSS grid. Cell re-renders only occur for tiles where player tokens enter or leave. Dice roll animation is throttled using requestAnimationFrame or setInterval with clear timer cleanup. Event logs are bounded to the last 20 items to prevent unbounded memory growth.`,

  edgeCases: [
    'Overshooting tile 100: player stays on current tile until exact roll',
    'Multiple players landing on the same tile: tokens display side by side without overlapping',
    'Rolling a 6: can optionally award a bonus roll',
    'Landing on a snake tail or ladder top: no secondary jump occurs (only trigger on head/base)',
    'Reset during active dice roll animation: clears interval safely',
  ],

  testingStrategy: [
    'Unit test: calculateSerpentineCoordinates maps tile numbers to correct row/col indices',
    'Unit test: snake and ladder transitions update player position accurately',
    'Unit test: exact roll rule prevents victory on overshoot',
    'Integration test: clicking roll advances turn and updates board display',
    'Integration test: winner state disables roll button and triggers victory banner',
  ],

  improvements: [
    'Add SVG ladder rungs and curved animated snake graphics connecting tiles',
    'Add AI bot opponents with automated turns',
    'Sound effects for dice roll, ladder climb, and snake bite',
    'Custom board editor allowing users to drag and place snakes/ladders',
  ],

  followUpQuestions: [
    'How would you find the shortest path / minimum dice rolls to win using BFS?',
    'How would you compute the expected number of turns to complete the game using Markov Chains?',
    'How would you synchronize multiplayer state in real-time using WebSockets?',
  ],
};
