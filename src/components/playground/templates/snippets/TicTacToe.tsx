import { useReducer, useCallback, useMemo } from "react";

type Player = "X" | "O";
type CellValue = Player | null;
type Board = CellValue[];

interface GameState {
  history: Board[];
  currentMove: number;
  scores: { X: number; O: number; draws: number };
}

type GameAction =
  | { type: "PLAY"; index: number }
  | { type: "JUMP_TO"; move: number }
  | { type: "RESTART" }
  | { type: "NEW_GAME" };

const WINNING_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

function checkWinner(board: Board): { winner: Player; line: readonly [number, number, number] } | null {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: [a, b, c] as const };
    }
  }
  return null;
}

const INITIAL_STATE: GameState = {
  history: [Array(9).fill(null)],
  currentMove: 0,
  scores: { X: 0, O: 0, draws: 0 },
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "PLAY": {
      const currentBoard = state.history[state.currentMove];
      if (!currentBoard || currentBoard[action.index] || checkWinner(currentBoard)) {
        return state;
      }
      const isXNext = state.currentMove % 2 === 0;
      const nextBoard = [...currentBoard];
      nextBoard[action.index] = isXNext ? "X" : "O";

      const newHistory = [
        ...state.history.slice(0, state.currentMove + 1),
        nextBoard,
      ];
      const winResult = checkWinner(nextBoard);
      const isDraw = !winResult && nextBoard.every(Boolean);

      return {
        ...state,
        history: newHistory,
        currentMove: newHistory.length - 1,
        scores: winResult
          ? { ...state.scores, [winResult.winner]: state.scores[winResult.winner] + 1 }
          : isDraw
            ? { ...state.scores, draws: state.scores.draws + 1 }
            : state.scores,
      };
    }
    case "JUMP_TO":
      return { ...state, currentMove: action.move };
    case "RESTART":
      return {
        ...state,
        history: [Array(9).fill(null)],
        currentMove: 0,
      };
    case "NEW_GAME":
      return INITIAL_STATE;
    default:
      return state;
  }
}

export default function TicTacToe() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const currentBoard = state.history[state.currentMove] ?? Array(9).fill(null);
  const winInfo = useMemo(() => checkWinner(currentBoard), [currentBoard]);
  const isDraw = !winInfo && currentBoard.every(Boolean);
  const isXNext = state.currentMove % 2 === 0;

  const handleCellClick = useCallback(
    (index: number) => {
      dispatch({ type: "PLAY", index });
    },
    [],
  );

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 24,
        background: "#09090b",
        color: "#f4f4f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 24 }}>Tic-Tac-Toe</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: 20,
            background: "#18181b",
            padding: 12,
            borderRadius: 8,
          }}
        >
          <div>X Wins: {state.scores.X}</div>
          <div>Draws: {state.scores.draws}</div>
          <div>O Wins: {state.scores.O}</div>
        </div>

        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 16,
            color: winInfo ? "#4ade80" : isDraw ? "#fbbf24" : "#60a5fa",
          }}
        >
          {winInfo
            ? `Winner: ${winInfo.winner}! 🎉`
            : isDraw
              ? "Game ended in a Draw! 🤝"
              : `Next Player: ${isXNext ? "X" : "O"}`}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {currentBoard.map((cell, idx) => {
            const isWinningCell = winInfo?.line.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                style={{
                  height: 90,
                  fontSize: 36,
                  fontWeight: 800,
                  background: isWinningCell ? "#166534" : "#18181b",
                  border: isWinningCell ? "2px solid #22c55e" : "1px solid #27272a",
                  borderRadius: 8,
                  color: cell === "X" ? "#60a5fa" : "#f87171",
                  cursor: cell || winInfo ? "default" : "pointer",
                }}
              >
                {cell}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={() => dispatch({ type: "RESTART" })}
            style={{
              padding: "10px 16px",
              borderRadius: 6,
              background: "#27272a",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Reset Board
          </button>
          <button
            onClick={() => dispatch({ type: "NEW_GAME" })}
            style={{
              padding: "10px 16px",
              borderRadius: 6,
              background: "#ef4444",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Reset All Scores
          </button>
        </div>
      </div>
    </div>
  );
}
