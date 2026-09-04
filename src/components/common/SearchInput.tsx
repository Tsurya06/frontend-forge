import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  readonly value?: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly debounceMs?: number;
  readonly className?: string;
}

export function SearchInput({
  value: controlledValue,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  className,
}: Readonly<SearchInputProps>) {
  const [prevControlled, setPrevControlled] = useState(controlledValue);
  const [internalValue, setInternalValue] = useState(controlledValue ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (controlledValue !== undefined && controlledValue !== prevControlled) {
    setPrevControlled(controlledValue);
    setInternalValue(controlledValue);
  }

  const debouncedOnChange = useCallback(
    (val: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(val);
      }, debounceMs);
    },
    [onChange, debounceMs],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInternalValue(val);
    debouncedOnChange(val);
  }

  function handleClear() {
    setInternalValue("");
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <span className={styles.icon} aria-hidden="true">
        {"\u{1F50D}"}
      </span>
      <input
        ref={inputRef}
        type="search"
        className={styles.input}
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {internalValue && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Clear search"
        >
          {"\u2715"}
        </button>
      )}
      {!internalValue && (
        <span className={styles.shortcutHint} aria-hidden="true">
          /
        </span>
      )}
    </div>
  );
}
