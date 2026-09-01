import type { MachineCodingProblem } from "../../types";

export const ticTacToeProblem: MachineCodingProblem = {
  id: "mc-tic-tac-toe",
  title: "Tic Tac Toe Game",
  difficulty: "Intermediate",
  category: "Machine Coding",
  tags: ["react", "game", "state-management", "win-detection", "two-player"],

  problemStatement: `Build a Tic Tac Toe game in React with two-player support and win detection. The game should display a 3x3 grid where players alternate placing X and O marks. After each move, the game checks for a winner (three in a row horizontally, vertically, or diagonally) or a draw (all cells filled with no winner). This is a classic coding challenge that tests your understanding of game state management, immutable updates, and algorithmic thinking.

Extend the basic game with features like move history (allowing players to jump back to any previous state), score tracking across multiple rounds, highlighting the winning combination, and an optional AI opponent using the minimax algorithm. The component should display whose turn it is, announce the winner or draw, and allow restarting the game.`,

  functionalRequirements: [
    "Display a 3x3 game grid with clickable cells",
    "Alternate between X and O players on each move",
    "Detect win conditions (rows, columns, diagonals)",
    "Detect draw when all cells are filled with no winner",
    "Display current player turn and game result",
    "Highlight the winning combination of cells",
    "Restart game / new round button",
    "Move history with ability to jump to any previous state",
  ],

  nonFunctionalRequirements: [
    "Immutable state updates for time-travel (history) support",
    "Efficient win detection algorithm",
    "Accessible grid with proper ARIA roles for game board",
    "Responsive layout that works on mobile",
  ],

  componentHierarchy: `TicTacToe
├── ScoreBoard
│   ├── PlayerXScore
│   └── PlayerOScore
├── StatusBar (turn / result display)
├── Board (3x3 grid)
│   └── Cell (repeated 9 times)
├── MoveHistory
│   └── HistoryButton (repeated)
└── RestartButton`,

  stateDesign: `// State shape
interface GameState {
  history: Board[];         // array of board states for time travel
  currentMove: number;      // index into history
  scores: { X: number; O: number; draws: number };
}

type Board = (Player | null)[];   // 9-element array
type Player = 'X' | 'O';

// The current board is history[currentMove].
// The current player is derived: move % 2 === 0 ? 'X' : 'O'.
// Win detection checks all 8 possible lines on the current board.`,

  architecture: `The game uses an array-based board representation where each cell is indexed 0-8 (left-to-right, top-to-bottom). Win detection checks 8 predefined winning combinations (3 rows, 3 columns, 2 diagonals) against the current board state. The game maintains a full history of board states, enabling time-travel by setting the \`currentMove\` index.

State is managed with \`useReducer\` for predictable updates. Each move creates a new board state (immutable) and appends it to the history, truncating any future states if the player jumped back and made a different move. The current player is derived from the move count rather than stored separately, following React's principle of minimal state. Score tracking persists across rounds.`,

  implementation: `import React, { useReducer, useCallback, useMemo } from 'react';

type Player = 'X' | 'O';
type CellValue = Player | null;
type Board = CellValue[];

interface GameState {
  history: Board[];
  currentMove: number;
  scores: { X: number; O: number; draws: number };
}

type GameAction =
  | { type: 'PLAY'; index: number }
  | { type: 'JUMP_TO'; move: number }
  | { type: 'RESTART' }
  | { type: 'NEW_GAME' };

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: Board): { winner: Player; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  return null;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAY': {
      const current = state.history[state.currentMove];
      if (current[action.index] || checkWinner(current)) return state;
      const newBoard = [...current];
      newBoard[action.index] = state.currentMove % 2 === 0 ? 'X' : 'O';
      const newHistory = [...state.history.slice(0, state.currentMove + 1), newBoard];
      const newMove = state.currentMove + 1;

      const result = checkWinner(newBoard);
      const isDraw = !result && newBoard.every((c) => c !== null);
      const newScores = { ...state.scores };
      if (result) newScores[result.winner]++;
      else if (isDraw) newScores.draws++;

      return { history: newHistory, currentMove: newMove, scores: newScores };
    }
    case 'JUMP_TO':
      return { ...state, currentMove: action.move };
    case 'RESTART':
      return { ...state, history: [Array(9).fill(null)], currentMove: 0 };
    case 'NEW_GAME':
      return { history: [Array(9).fill(null)], currentMove: 0, scores: { X: 0, O: 0, draws: 0 } };
    default:
      return state;
  }
}

export default function TicTacToe() {
  const [state, dispatch] = useReducer(gameReducer, {
    history: [Array(9).fill(null)],
    currentMove: 0,
    scores: { X: 0, O: 0, draws: 0 },
  });

  const board = state.history[state.currentMove];
  const currentPlayer: Player = state.currentMove % 2 === 0 ? 'X' : 'O';
  const result = useMemo(() => checkWinner(board), [board]);
  const isDraw = !result && board.every((c) => c !== null);
  const gameOver = !!result || isDraw;
  const winningLine = result?.line ?? [];

  const handleCellClick = useCallback((index: number) => {
    dispatch({ type: 'PLAY', index });
  }, []);

  const status = result
    ? \`Winner: \${result.winner}!\`
    : isDraw
      ? "It's a draw!"
      : \`Next player: \${currentPlayer}\`;

  const cellStyle = (index: number): React.CSSProperties => ({
    width: 80, height: 80,
    border: '2px solid #d1d5db', background: winningLine.includes(index) ? '#dcfce7' : '#fff',
    fontSize: 32, fontWeight: 700, cursor: gameOver || board[index] ? 'default' : 'pointer',
    color: board[index] === 'X' ? '#2563eb' : '#dc2626',
    transition: 'background 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  return (
    <div style={{ fontFamily: 'system-ui', textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 20 }}>
        <div style={{ fontWeight: state.currentMove % 2 === 0 && !gameOver ? 700 : 400 }}>
          <span style={{ color: '#2563eb', fontSize: 24 }}>X</span>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{state.scores.X}</div>
        </div>
        <div>
          <span style={{ color: '#6b7280', fontSize: 14 }}>Draws</span>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{state.scores.draws}</div>
        </div>
        <div style={{ fontWeight: state.currentMove % 2 === 1 && !gameOver ? 700 : 400 }}>
          <span style={{ color: '#dc2626', fontSize: 24 }}>O</span>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{state.scores.O}</div>
        </div>
      </div>

      <div
        style={{
          fontSize: 18, fontWeight: 600, marginBottom: 16,
          color: gameOver ? '#22c55e' : '#374151',
        }}
        aria-live="polite"
      >
        {status}
      </div>

      <div
        role="grid"
        aria-label="Tic Tac Toe board"
        style={{
          display: 'inline-grid', gridTemplateColumns: 'repeat(3, 80px)',
          gap: 0, borderRadius: 8, overflow: 'hidden',
          border: '2px solid #d1d5db',
        }}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            role="gridcell"
            aria-label={\`Cell \${Math.floor(index / 3) + 1},\${(index % 3) + 1}: \${cell || 'empty'}\`}
            onClick={() => handleCellClick(index)}
            disabled={gameOver || !!cell}
            style={cellStyle(index)}
          >
            {cell}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button
          onClick={() => dispatch({ type: 'RESTART' })}
          style={{
            padding: '10px 20px', border: '1px solid #d1d5db',
            borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 14,
          }}
        >
          Restart Round
        </button>
        <button
          onClick={() => dispatch({ type: 'NEW_GAME' })}
          style={{
            padding: '10px 20px', border: 'none', borderRadius: 6,
            background: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: 14,
          }}
        >
          New Game
        </button>
      </div>

      {state.history.length > 1 && (
        <div style={{ marginTop: 20 }}>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#6b7280' }}>Move History</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {state.history.map((_, move) => (
              <button
                key={move}
                onClick={() => dispatch({ type: 'JUMP_TO', move })}
                style={{
                  padding: '4px 10px', fontSize: 12, borderRadius: 4,
                  border: '1px solid #d1d5db',
                  background: move === state.currentMove ? '#2563eb' : '#fff',
                  color: move === state.currentMove ? '#fff' : '#374151',
                  cursor: 'pointer',
                }}
              >
                {move === 0 ? 'Start' : \`#\${move}\`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}`,

  accessibility: `The game board uses \`role="grid"\` with \`role="gridcell"\` on each cell. Each cell has an \`aria-label\` describing its position (row, column) and current value (X, O, or empty). Disabled cells (already filled or game over) have the \`disabled\` attribute. The status message uses \`aria-live="polite"\` to announce turn changes and game results to screen readers. Colors are supplemented with text labels (X vs O) so the game is playable without color differentiation. All controls are keyboard accessible.`,

  performance: `The board is represented as a flat 9-element array for O(1) cell access. Win detection checks at most 8 lines per move, which is constant time. Board states are stored as separate arrays (not shared), enabling clean time-travel without copy-on-write complexity. The \`useMemo\` for win detection avoids rechecking on unrelated state changes. The \`useCallback\` on cell click handlers prevents unnecessary re-renders. For the standard 3x3 game, performance is never a concern, but the architecture scales to larger grids.`,

  edgeCases: [
    "Clicking an already-filled cell should be a no-op",
    "Clicking after game is won should be a no-op",
    "Time-traveling back and making a different move should truncate future history",
    "Draw detection must check all 9 cells are filled with no winner",
    "Score tracking across restart vs new game (restart keeps scores, new game resets)",
  ],

  testingStrategy: [
    "Unit test: checkWinner detects all 8 winning combinations",
    "Unit test: checkWinner returns null when no winner",
    "Unit test: PLAY action alternates between X and O",
    "Unit test: PLAY action is rejected on occupied cell or after game over",
    "Integration test: full game flow from start to win",
    "Integration test: time travel to previous move and replay",
  ],

  improvements: [
    "Add AI opponent using minimax algorithm with alpha-beta pruning",
    "Support configurable board size (4x4, 5x5) with adjustable win length",
    "Add move animations when placing marks",
    "Implement online multiplayer with WebSocket",
    "Add game replay feature with auto-playback",
  ],

  followUpQuestions: [
    "How would you implement the minimax algorithm for an AI opponent?",
    "How does time-travel work with immutable state in React?",
    "How would you scale the win detection algorithm for an NxN board?",
    "What data structure would you use for an undo/redo system in a complex game?",
  ],
};
