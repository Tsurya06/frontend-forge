import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import { useProgressContext } from "@/context/ProgressContext";
import { useThemeContext } from "@/context/ThemeContext";
import {
  Menu,
  Search,
  Flame,
  Bookmark,
  TrendingUp,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import styles from "./Header.module.css";

interface HeaderProps {
  readonly onMenuToggle: () => void;
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

export function Header({ onMenuToggle }: Readonly<HeaderProps>) {
  const { resolvedTheme, toggleTheme } = useThemeContext();
  const [internalQuery, setInternalQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { dailyStreak } = useProgressContext();

  const isOnSearch = location.pathname === "/search";
  const urlQuery = isOnSearch ? new URLSearchParams(location.search).get("q") || "" : "";
  const query = isOnSearch ? urlQuery : internalQuery;

  const setQuery = useCallback(
    (val: string) => {
      if (isOnSearch) {
        navigate(val ? `/search?q=${encodeURIComponent(val)}` : "/search", { replace: true });
      } else {
        setInternalQuery(val);
      }
    },
    [isOnSearch, navigate],
  );

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

  const handleClear = useCallback(() => {
    if (isOnSearch) {
      navigate("/search", { replace: true });
    } else {
      setInternalQuery("");
    }
    inputRef.current?.focus();
  }, [isOnSearch, navigate]);

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
          <Menu size={18} />
        </button>

        <Link to="/" className={styles.headerBrand}>
          <img
            src={import.meta.env.BASE_URL + "favicon-32.png"}
            alt="FrontendForge"
            className={styles.headerLogo}
          />
          <span className={styles.brandText}>FrontendForge</span>
        </Link>

        {/* FrontendForge Horizontal Nav Links (Desktop) */}
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
          className={`${styles.search} ${isSearchOpen || query ? styles.searchExpanded : ""}`}
          onSubmit={handleSubmit}
          role="search"
        >
          <span className={styles.searchIcon} aria-hidden="true">
            <Search size={14} />
          </span>
          <input
            ref={inputRef}
            type="search"
            data-search-input="true"
            className={styles.searchInput}
            placeholder="Search problems, topics..."
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              if (!val && location.pathname === "/search") {
                navigate("/search");
              }
            }}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setIsSearchOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                inputRef.current?.blur();
                setIsSearchOpen(false);
              }
            }}
            aria-label="Search problems"
          />
          {query ? (
            <button
              type="button"
              className={styles.searchClearBtn}
              onClick={handleClear}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="Clear search"
              title="Clear search"
            >
              ✕
            </button>
          ) : (
            <span className={styles.shortcutHint} aria-hidden="true">
              /
            </span>
          )}
        </form>

        {/* Daily Streak Pill */}
        <Link
          to="/daily"
          className={`${styles.streakPill} ${dailyStreak === 0 ? styles.streakPillZero : ""}`}
          title={
            dailyStreak > 0
              ? `Current Streak: ${dailyStreak} day${dailyStreak > 1 ? "s" : ""}`
              : "Streak broken (0 days) — Solve a daily challenge to ignite your streak!"
          }
        >
          <Flame
            size={14}
            className={dailyStreak > 0 ? styles.streakFlame : styles.streakFlameZero}
          />
          <span className={styles.streakCount}>{dailyStreak}</span>
        </Link>

        {/* Bookmarks */}
        <Link
          to="/bookmarks"
          className={styles.iconBtn}
          title="Saved Bookmarks"
          aria-label="Bookmarks"
        >
          <Bookmark size={16} />
        </Link>

        {/* Analytics Profile */}
        <Link
          to="/progress"
          className={styles.iconBtn}
          title="My Progress & Analytics"
          aria-label="Progress & Analytics"
        >
          <TrendingUp size={16} />
        </Link>

        {/* Theme Toggle */}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
          type="button"
        >
          {resolvedTheme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Settings */}
        <Link
          to="/settings"
          className={styles.iconBtn}
          title="Settings & Data Management"
          aria-label="Settings"
        >
          <Settings size={16} />
        </Link>
      </div>
    </header>
  );
}
