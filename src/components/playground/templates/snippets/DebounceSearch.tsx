import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const FRAMEWORKS = [
  "React.js",
  "Next.js",
  "Vue.js",
  "Nuxt.js",
  "Svelte",
  "SvelteKit",
  "Angular",
  "Solid.js",
  "Astro",
  "Remix",
  "Qwik",
  "Preact",
  "Gatsby",
];

export default function DebounceSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const isSearching = query !== debouncedQuery;

  const results = FRAMEWORKS.filter((f) =>
    f.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  useEffect(() => {
    if (!isSearching && debouncedQuery) {
      console.log("🔍 Executing search query for:", debouncedQuery);
    }
  }, [isSearching, debouncedQuery]);

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
        <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>
          Debounced Autocomplete
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: 13, margin: "0 0 16px" }}>
          Typing updates instantly; search triggers after 400ms pause.
        </p>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search frontend frameworks..."
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "#27272a",
            border: "1px solid #3f3f46",
            borderRadius: 8,
            color: "#fff",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 16,
          }}
        />

        <div style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 12 }}>
          {isSearching
            ? "⏳ Waiting for typing pause..."
            : `Found ${results.length} frameworks for "${debouncedQuery}":`}
        </div>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {results.map((item) => (
            <li
              key={item}
              style={{
                padding: "10px 14px",
                background: "#212124",
                borderRadius: 6,
                border: "1px solid #2f2f32",
                fontSize: 14,
              }}
            >
              ⚡ {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
