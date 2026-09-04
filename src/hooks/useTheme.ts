import { useCallback, useEffect, useMemo } from "react";
import { STORAGE_KEYS } from "@/constants/storage";
import { useLocalStorage } from "./useLocalStorage";

export type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const storedFeeq = localStorage.getItem(STORAGE_KEYS.THEME);
  if (storedFeeq) {
    try {
      const parsed = JSON.parse(storedFeeq);
      if (parsed === "light" || parsed === "dark" || parsed === "system") return parsed;
    } catch {
      if (storedFeeq === "light" || storedFeeq === "dark" || storedFeeq === "system") {
        return storedFeeq as Theme;
      }
    }
  }
  const storedLegacy = localStorage.getItem(STORAGE_KEYS.LEGACY_THEME);
  if (storedLegacy === "light" || storedLegacy === "dark") {
    return storedLegacy as Theme;
  }
  return "system";
}

function applyTheme(theme: Theme): "light" | "dark" {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", resolved);
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.LEGACY_THEME, resolved);
  }
  return resolved;
}

export function useTheme() {
  const [theme, setThemeValue] = useLocalStorage<Theme>(
    STORAGE_KEYS.THEME,
    getInitialTheme(),
  );

  const resolvedTheme: "light" | "dark" = useMemo(() => {
    return theme === "system" ? getSystemTheme() : theme;
  }, [theme]);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeValue(next);
      applyTheme(next);
    },
    [setThemeValue],
  );

  const toggleTheme = useCallback(() => {
    setThemeValue((prev) => {
      const current = prev === "system" ? getSystemTheme() : prev;
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, [setThemeValue]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return { theme, resolvedTheme, setTheme, toggleTheme };
}
