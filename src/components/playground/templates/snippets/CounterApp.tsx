import { useState, useEffect } from "react";

export default function CounterApp() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState<number[]>([0]);

  const increment = () => {
    setCount((prev) => {
      const next = prev + 1;
      setHistory((h) => [...h, next]);
      return next;
    });
  };

  const decrement = () => {
    setCount((prev) => {
      const next = Math.max(0, prev - 1);
      setHistory((h) => [...h, next]);
      return next;
    });
  };

  const reset = () => {
    setCount(0);
    setHistory([0]);
  };

  useEffect(() => {
    console.log("⚡ React State changed: count =", count);
  }, [count]);

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: 32,
        background: "#09090b",
        color: "#f4f4f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: 16,
          padding: 32,
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#a1a1aa",
            display: "block",
            marginBottom: 8,
          }}
        >
          React Live Component
        </span>
        <h2 style={{ margin: "0 0 24px", fontSize: 24, fontWeight: 700 }}>
          Interactive Counter
        </h2>

        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            fontFamily: "monospace",
            color: "#ffa116",
            marginBottom: 24,
          }}
        >
          {count}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <button
            onClick={decrement}
            style={{
              flex: 1,
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 600,
              background: "#27272a",
              border: "1px solid #3f3f46",
              borderRadius: 8,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            − Decrement
          </button>
          <button
            onClick={increment}
            style={{
              flex: 1,
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 600,
              background: "#ffa116",
              border: "none",
              borderRadius: 8,
              color: "#000",
              cursor: "pointer",
            }}
          >
            + Increment
          </button>
          <button
            onClick={reset}
            style={{
              padding: "10px 14px",
              fontSize: 14,
              fontWeight: 600,
              background: "#27272a",
              border: "1px solid #3f3f46",
              borderRadius: 8,
              color: "#a1a1aa",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#71717a",
            fontFamily: "monospace",
            borderTop: "1px solid #27272a",
            paddingTop: 16,
          }}
        >
          History: {history.join(" → ")}
        </div>
      </div>
    </div>
  );
}
