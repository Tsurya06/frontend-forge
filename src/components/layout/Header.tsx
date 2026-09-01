import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Header.module.css";

interface HeaderProps {
  onMenuToggle: () => void;
}

function getInitialTheme(): "light" | "dark" {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        )
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <header className={styles.header}>
      <button
        className={styles.menuButton}
        onClick={onMenuToggle}
        aria-label="Toggle menu"
        type="button"
      >
        {"\u2630"}
      </button>
      <Link to="/" className={styles.headerBrand}>
        <img
          src={import.meta.env.BASE_URL + "favicon-32.png"}
          alt="FrontendForge Logo"
          className={styles.headerLogo}
        />
        <span className={styles.title}>FrontendForge</span>
      </Link>
      <form className={styles.search} onSubmit={handleSubmit} role="search">
        <span className={styles.searchIcon} aria-hidden="true">
          {"\u{1F50D}"}
        </span>
        <input
          ref={inputRef}
          type="search"
          className={styles.searchInput}
          placeholder="Search questions, topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />
        <span className={styles.shortcutHint} aria-hidden="true">
          /
        </span>
      </form>
      <div className={styles.actions}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          type="button"
        >
          {theme === "light" ? "\u{1F319}" : "\u2600\uFE0F"}
        </button>
      </div>
    </header>
  );
}
