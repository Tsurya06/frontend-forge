import React, { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Master JavaScript Event Loop", completed: true },
    { id: 2, text: "Build React Playground sandbox", completed: true },
    { id: 3, text: "Ace Senior Frontend Interview", completed: false },
  ]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: input.trim(), completed: false },
    ]);
    setInput("");
  };

  const toggle = (id: number) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const remove = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 32,
        background: "#09090b",
        color: "#f4f4f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: "100%",
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h2 style={{ margin: "0 0 16px", fontSize: 22 }}>
          Interactive Todo List
        </h2>
        <form
          onSubmit={addTodo}
          style={{ display: "flex", gap: 8, marginBottom: 16 }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add new task..."
            style={{
              flex: 1,
              padding: "10px 14px",
              background: "#27272a",
              border: "1px solid #3f3f46",
              borderRadius: 8,
              color: "#fff",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              background: "#ffa116",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              color: "#000",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </form>

        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {(["all", "active", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: filter === f ? "#ffa116" : "#27272a",
                color: filter === f ? "#000" : "#a1a1aa",
                textTransform: "capitalize",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {filtered.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "#212124",
                borderRadius: 8,
                border: "1px solid #2f2f32",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggle(t.id)}
                />
                <span
                  style={{
                    textDecoration: t.completed ? "line-through" : "none",
                    color: t.completed ? "#71717a" : "#f4f4f5",
                  }}
                >
                  {t.text}
                </span>
              </label>
              <button
                onClick={() => remove(t.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
