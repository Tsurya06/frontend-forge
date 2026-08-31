import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.setAttribute('data-theme', resolved);
}

export function useTheme() {
  const [theme, setThemeValue] = useLocalStorage<Theme>('feeq-theme', 'system');

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeValue(next);
      applyTheme(next);
    },
    [setThemeValue],
  );

  const toggleTheme = useCallback(() => {
    setThemeValue((prev) => {
      const resolved = prev === 'system' ? getSystemTheme() : prev;
      const next = resolved === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return next;
    });
  }, [setThemeValue]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}
