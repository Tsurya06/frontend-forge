import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useProgressContext } from "@/context/ProgressContext";
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

const navItems = [
  { label: "Explore", path: "/topics" },
  { label: "Problems", path: "/coding" },
  { label: "Machine Coding", path: "/machine-coding" },
  { label: "System Design", path: "/system-design" },
  { label: "Roadmap", path: "/roadmap" },
  { label: "Daily", path: "/daily" },
  { label: "Sandbox", path: "/playground" },
];

export function Header({ onMenuToggle }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { dailyStreak } = useProgressContext();

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
        setIsSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
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
      setIsSearchOpen(false);
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.leftGroup}>
        <button
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
          type="button"
        >
          {"\u2630"}
        </button>

        <Link to="/" className={styles.headerBrand}>
          <img
            src={import.meta.env.BASE_URL + "favicon-32.png"}
            alt="FrontendForge"
            className={styles.headerLogo}
          />
          <span className={styles.brandText}>FrontendForge</span>
        </Link>

        {/* LeetCode Horizontal Nav Links (Desktop) */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeNavLink : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={styles.rightGroup}>
        {/* Search Bar */}
        <form
          className={`${styles.search} ${isSearchOpen ? styles.searchExpanded : ""}`}
          onSubmit={handleSubmit}
          role="search"
        >
          <span className={styles.searchIcon} aria-hidden="true">
            {"\u{1F50D}"}
          </span>
          <input
            ref={inputRef}
            type="search"
            data-search-input="true"
            className={styles.searchInput}
            placeholder="Search problems, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setIsSearchOpen(false)}
            aria-label="Search problems"
          />
          <span className={styles.shortcutHint} aria-hidden="true">
            /
          </span>
        </form>

        {/* Daily Streak Pill */}
        <Link to="/daily" className={styles.streakPill} title="Current Streak">
          <span className={styles.streakFlame}>🔥</span>
          <span className={styles.streakCount}>{dailyStreak || 1}</span>
        </Link>

        {/* Bookmarks */}
        <Link
          to="/bookmarks"
          className={styles.iconBtn}
          title="Saved Bookmarks"
          aria-label="Bookmarks"
        >
          ⭐
        </Link>

        {/* Analytics Profile */}
        <Link
          to="/progress"
          className={styles.iconBtn}
          title="My Progress & Analytics"
          aria-label="Progress & Analytics"
        >
          📊
        </Link>

        {/* Settings */}
        <Link
          to="/settings"
          className={styles.iconBtn}
          title="Settings & Data Management"
          aria-label="Settings"
        >
          ⚙️
        </Link>

        {/* Theme Toggle */}
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
