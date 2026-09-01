import type { MachineCodingProblem } from "../../types";

export const connectFourProblem: MachineCodingProblem = {
  id: "mc-connect-four",
  title: "Connect Four",
  difficulty: "Advanced",
  category: "Machine Coding",
  tags: [
    "game",
    "grid",
    "win-detection",
    "state-machine",
    "two-player",
    "algorithm",
  ],
  problemStatement: `Build a Connect Four game in React where two players take turns dropping colored discs into a 7-column, 6-row grid. The disc falls to the lowest available row in the selected column. The game detects a win when a player gets four consecutive discs horizontally, vertically, or diagonally, and also detects a draw when the board is full.

The UI should display the game board, indicate whose turn it is, highlight the winning four discs when a win is detected, and provide a restart button to reset the game. Hovering over a column should preview where the disc will drop (i.e., highlight the target cell). Clicking a full column should be a no-op.

This problem tests 2D array manipulation, game state management, algorithm design for win detection, and clean React component architecture.`,
  functionalRequirements: [
    "Render a 7×6 grid representing the Connect Four board",
    "Players alternate turns: Player 1 (Red) and Player 2 (Yellow)",
    "Clicking a column drops a disc to the lowest empty row in that column",
    "Detect a win (4 in a row: horizontal, vertical, both diagonals) and display the winner",
    "Detect a draw when all 42 cells are filled with no winner",
    "Highlight the four winning cells when a win is detected",
    "Provide a restart button that resets the board and turn",
    "Hover preview: show a ghost disc in the target cell when hovering over a column",
  ],
  nonFunctionalRequirements: [
    "Win detection algorithm runs efficiently after each move (check only from last placed disc)",
    "Board state is immutable — create new arrays on each move",
    "Clean separation of game logic from rendering",
    "Accessible: announce turns and outcomes to screen readers via live regions",
  ],
  componentHierarchy: `ConnectFour
├── StatusBar (current player, winner, draw)
├── Board
│   ├── Column (×7)
│   │   └── Cell (×6 per column)
│   │       └── Disc (colored circle)
├── RestartButton
└── LiveAnnouncer (sr-only)`,
  stateDesign: `type CellValue = null | 'red' | 'yellow';
type Board = CellValue[][];  // board[row][col], row 0 = top

interface GameState {
  board: Board;
  currentPlayer: 'red' | 'yellow';
  winner: 'red' | 'yellow' | null;
  isDraw: boolean;
  winningCells: [number, number][];  // [row, col] tuples
  hoverCol: number | null;
}

const ROWS = 6;
const COLS = 7;

function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}`,
  architecture: `The game maintains a 2D board array where board[row][col] holds null, 'red', or 'yellow'. When a column is clicked, the component finds the lowest empty row in that column and places the current player's disc. After each move, a checkWin function scans four directions (horizontal, vertical, two diagonals) from the newly placed disc, counting consecutive same-colored cells. If any direction reaches 4, the game is won and the winning cell coordinates are stored. The game also checks for a draw by verifying if all cells are filled. Game logic functions are pure and testable independently.`,
  implementation: `import React, { useState, useCallback, useMemo } from 'react';

type CellValue = null | 'red' | 'yellow';
type Board = CellValue[][];

const ROWS = 6;
const COLS = 7;
const DIRECTIONS: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];

function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array<CellValue>(COLS).fill(null));
}

function getLowestEmptyRow(board: Board, col: number): number {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) return row;
  }
  return -1;
}

function checkWin(board: Board, row: number, col: number): [number, number][] | null {
  const color = board[row][col];
  if (!color) return null;

  for (const [dr, dc] of DIRECTIONS) {
    const cells: [number, number][] = [[row, col]];

    for (const sign of [1, -1]) {
      for (let step = 1; step < 4; step++) {
        const r = row + dr * step * sign;
        const c = col + dc * step * sign;
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== color) break;
        cells.push([r, c]);
      }
    }

    if (cells.length >= 4) return cells;
  }
  return null;
}

function isBoardFull(board: Board): boolean {
  return board[0].every((cell) => cell !== null);
}

export default function ConnectFour() {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'yellow'>('red');
  const [winner, setWinner] = useState<'red' | 'yellow' | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const winningSet = useMemo(() => {
    const set = new Set<string>();
    winningCells.forEach(([r, c]) => set.add(\`\${r}-\${c}\`));
    return set;
  }, [winningCells]);

  const dropDisc = useCallback(
    (col: number) => {
      if (winner || isDraw) return;
      const row = getLowestEmptyRow(board, col);
      if (row === -1) return;

      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = currentPlayer;

      const winResult = checkWin(newBoard, row, col);
      if (winResult) {
        setBoard(newBoard);
        setWinner(currentPlayer);
        setWinningCells(winResult);
        return;
      }

      if (isBoardFull(newBoard)) {
        setBoard(newBoard);
        setIsDraw(true);
        return;
      }

      setBoard(newBoard);
      setCurrentPlayer((prev) => (prev === 'red' ? 'yellow' : 'red'));
    },
    [board, currentPlayer, winner, isDraw]
  );

  const restart = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('red');
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
    setHoverCol(null);
  };

  const getPreviewRow = (col: number): number => {
    if (winner || isDraw) return -1;
    return getLowestEmptyRow(board, col);
  };

  const gameOver = winner || isDraw;

  return (
    <div style={{ textAlign: 'center', padding: 16 }}>
      <h2 style={{ margin: '0 0 8px' }}>Connect Four</h2>

      <div aria-live="polite" style={{ marginBottom: 12, fontSize: 16, fontWeight: 500 }}>
        {winner && (
          <span style={{ color: winner === 'red' ? '#ef4444' : '#eab308' }}>
            {winner === 'red' ? 'Red' : 'Yellow'} wins! 🎉
          </span>
        )}
        {isDraw && <span style={{ color: '#64748b' }}>It's a draw!</span>}
        {!gameOver && (
          <span>
            Turn:{' '}
            <span style={{ color: currentPlayer === 'red' ? '#ef4444' : '#eab308', fontWeight: 700 }}>
              {currentPlayer === 'red' ? 'Red' : 'Yellow'}
            </span>
          </span>
        )}
      </div>

      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: \`repeat(\${COLS}, 48px)\`,
          gap: 4,
          padding: 8,
          background: '#1e40af',
          borderRadius: 8,
        }}
        role="grid"
        aria-label="Connect Four board"
      >
        {board.map((row, ri) =>
          row.map((cell, ci) => {
            const isWinning = winningSet.has(\`\${ri}-\${ci}\`);
            const isPreview = hoverCol === ci && ri === getPreviewRow(ci) && !cell;

            return (
              <div
                key={\`\${ri}-\${ci}\`}
                role="gridcell"
                aria-label={\`Row \${ri + 1}, Column \${ci + 1}\${cell ? \`, \${cell}\` : ', empty'}\`}
                onClick={() => dropDisc(ci)}
                onMouseEnter={() => setHoverCol(ci)}
                onMouseLeave={() => setHoverCol(null)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: cell
                    ? cell === 'red'
                      ? '#ef4444'
                      : '#eab308'
                    : isPreview
                    ? currentPlayer === 'red'
                      ? 'rgba(239,68,68,0.3)'
                      : 'rgba(234,179,8,0.3)'
                    : '#e2e8f0',
                  cursor: gameOver ? 'default' : 'pointer',
                  transition: 'background 0.15s',
                  boxShadow: isWinning ? '0 0 0 3px #fff, 0 0 8px rgba(0,0,0,0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.1)',
                }}
              />
            );
          })
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={restart}
          style={{
            padding: '8px 24px',
            background: '#1e40af',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          {gameOver ? 'Play Again' : 'Restart'}
        </button>
      </div>
    </div>
  );
}`,
  accessibility: `The board uses role="grid" with role="gridcell" on each cell, and aria-labels describe position and contents. Turn and outcome are announced via an aria-live region. Keyboard users can navigate the grid; in a production version, arrow key navigation within the grid and Enter to drop would be added. Color choices for red/yellow are high-contrast. Winning cells are highlighted with a ring, not relying solely on color.`,
  performance: `Win detection only checks from the last placed disc outward in four directions, making it O(1) rather than scanning the entire board. Board state is cloned with map + spread, which is O(rows × cols) — trivial for a 6×7 grid. The winning cell set is memoized with useMemo to avoid recalculation on re-renders. The hover preview calculates the target row on each render but is also O(rows) at worst.`,
  edgeCases: [
    "Clicking a full column — getLowestEmptyRow returns -1, move is ignored",
    "Win on the very last cell (full board) — win takes priority over draw detection",
    "Diagonal wins touching board edges — bounds checking prevents out-of-range access",
    "Clicking after game is over — all clicks are no-ops until restart",
    "Very fast clicks — React batching ensures state consistency",
  ],
  testingStrategy: [
    "Unit test: checkWin detects horizontal, vertical, and both diagonal wins",
    "Unit test: checkWin returns null when no four-in-a-row exists",
    "Unit test: getLowestEmptyRow returns correct row and -1 for full columns",
    "Unit test: isBoardFull returns true only when all cells are filled",
    "Integration test: clicking columns alternates player colors",
    "Integration test: winning triggers winner display and disables further moves",
    "Integration test: restart resets board and all state to initial",
  ],
  improvements: [
    "Add drop animation (CSS transition/animation for disc falling into place)",
    "Implement an AI opponent using minimax with alpha-beta pruning",
    "Add online multiplayer via WebSocket",
    "Track game history and allow undo of last move",
    "Add sound effects for disc drop and win",
  ],
  followUpQuestions: [
    "How would you implement an AI opponent? What algorithm would you use?",
    "How would you optimize win detection for larger board sizes?",
    "How would you add a disc-drop animation that looks physically realistic?",
    "How would you implement undo/redo for game moves?",
  ],
};
