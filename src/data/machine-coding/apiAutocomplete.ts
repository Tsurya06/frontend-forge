import type { MachineCodingProblem } from '../../types';

export const apiAutocompleteProblem: MachineCodingProblem = {
  id: 'mc-api-autocomplete',
  title: 'API Autocomplete',
  difficulty: 'Advanced',
  category: 'Machine Coding',
  tags: ['autocomplete', 'api', 'debounce', 'keyboard-navigation', 'race-condition', 'abort-controller', 'combobox'],
  problemStatement: `Build an API-backed autocomplete/typeahead component in React. As the user types, the component fetches suggestions from a remote API (simulated), displays them in a dropdown, and allows selection via mouse click or keyboard navigation (ArrowUp/Down to navigate, Enter to select, Escape to close).

The component must handle race conditions where a slow API response for an earlier query arrives after a faster response for a later query. This is solved by aborting previous requests or ignoring stale responses. The dropdown should show loading and error states inline. Debouncing should be applied to prevent excessive API calls on every keystroke.

This is a common senior-level interview problem that tests async handling, keyboard event management, WAI-ARIA combobox patterns, and defensive coding against race conditions.`,
  functionalRequirements: [
    'Text input that fetches suggestions from an API as the user types',
    'Debounce input to avoid API call on every keystroke (300ms)',
    'Display suggestions in a dropdown list below the input',
    'Keyboard navigation: ArrowDown/Up to highlight suggestions, Enter to select, Escape to close',
    'Mouse click on a suggestion selects it and populates the input',
    'Loading indicator shown inside dropdown while fetching',
    'Error message with retry shown if API call fails',
    'Cancel previous in-flight request when a new one starts (AbortController)',
    'Clear suggestions when input is empty',
  ],
  nonFunctionalRequirements: [
    'WAI-ARIA combobox pattern: role="combobox", aria-expanded, aria-activedescendant, role="listbox"',
    'Race condition handling: stale responses do not overwrite fresher results',
    'Dropdown positions correctly and does not overflow the viewport',
    'Click outside the dropdown closes it',
  ],
  componentHierarchy: `Autocomplete
├── InputWrapper
│   ├── TextInput (role="combobox")
│   └── ClearButton
├── SuggestionsDropdown (role="listbox")
│   ├── LoadingIndicator
│   ├── ErrorMessage
│   ├── SuggestionItem (role="option", per result)
│   └── NoResults
└── VisuallyHidden (aria-live announcements)`,
  stateDesign: `interface Suggestion {
  id: string;
  label: string;
}

const [query, setQuery] = useState('');
const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
const [isOpen, setIsOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [activeIndex, setActiveIndex] = useState(-1);
// Ref to track the latest request ID for stale response detection
const requestIdRef = useRef(0);
const abortRef = useRef<AbortController | null>(null);`,
  architecture: `The Autocomplete component debounces the query input. When the debounced value changes, it fires an API request with an incrementing request ID and an AbortController. Before starting a new request, it aborts the previous one. When the response arrives, it checks if the request ID matches the latest — if not, the response is stale and discarded.

Keyboard navigation maintains an activeIndex that cycles through suggestions. ArrowDown increments, ArrowUp decrements, and Enter selects the active item. The dropdown visibility is tied to focus state and whether there are suggestions/loading/error to show. Clicking outside uses a mousedown listener on the document to close the dropdown.`,
  implementation: `import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Suggestion {
  id: string;
  label: string;
}

const FRUITS = [
  'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry', 'Cherry',
  'Coconut', 'Cranberry', 'Date', 'Dragon Fruit', 'Elderberry', 'Fig', 'Grape',
  'Grapefruit', 'Guava', 'Kiwi', 'Lemon', 'Lime', 'Lychee', 'Mango', 'Melon',
  'Nectarine', 'Orange', 'Papaya', 'Passion Fruit', 'Peach', 'Pear', 'Pineapple',
  'Plum', 'Pomegranate', 'Raspberry', 'Strawberry', 'Tangerine', 'Watermelon',
];

async function mockSearch(query: string, signal: AbortSignal): Promise<Suggestion[]> {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, 200 + Math.random() * 300);
    signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); });
  });

  const lower = query.toLowerCase();
  return FRUITS
    .filter((f) => f.toLowerCase().includes(lower))
    .map((f) => ({ id: f.toLowerCase().replace(/\\s+/g, '-'), label: f }));
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Autocomplete() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = 'autocomplete-listbox';

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const currentId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const results = await mockSearch(searchQuery, controller.signal);
      if (currentId !== requestIdRef.current) return;

      setSuggestions(results);
      setIsOpen(true);
      setActiveIndex(-1);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      if (currentId !== requestIdRef.current) return;
      setError((err as Error).message);
    } finally {
      if (currentId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectSuggestion = (suggestion: Suggestion) => {
    setQuery(suggestion.label);
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          selectSuggestion(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const activeDescendant = activeIndex >= 0 ? \`suggestion-\${activeIndex}\` : undefined;
  const showDropdown = isOpen && (isLoading || error || suggestions.length > 0 || (debouncedQuery && suggestions.length === 0 && !isLoading));

  return (
    <div ref={containerRef} style={{ maxWidth: 400, margin: '0 auto', padding: 16, position: 'relative' }}>
      <label htmlFor="autocomplete-input" style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>
        Search fruits
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id="autocomplete-input"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={activeDescendant}
          aria-autocomplete="list"
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (!e.target.value) setIsOpen(false); }}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Type to search…"
          style={{
            width: '100%', padding: '10px 36px 10px 12px', fontSize: 14,
            border: '2px solid #e2e8f0', borderRadius: 8, outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); setIsOpen(false); }}
            aria-label="Clear search"
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18,
            }}
          >
            ×
          </button>
        )}
      </div>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Suggestions"
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
            padding: 0, listStyle: 'none', background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 240,
            overflowY: 'auto', zIndex: 10,
          }}
        >
          {isLoading && (
            <li style={{ padding: '10px 12px', color: '#64748b', fontSize: 14 }}>Loading…</li>
          )}
          {error && (
            <li style={{ padding: '10px 12px', color: '#ef4444', fontSize: 14 }}>
              Error: {error}{' '}
              <button
                onClick={() => fetchSuggestions(debouncedQuery)}
                style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Retry
              </button>
            </li>
          )}
          {!isLoading && !error && suggestions.length === 0 && debouncedQuery && (
            <li style={{ padding: '10px 12px', color: '#94a3b8', fontSize: 14 }}>No results found</li>
          )}
          {!isLoading && suggestions.map((s, i) => (
            <li
              key={s.id}
              id={\`suggestion-\${i}\`}
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => selectSuggestion(s)}
              onMouseEnter={() => setActiveIndex(i)}
              style={{
                padding: '8px 12px', cursor: 'pointer', fontSize: 14,
                background: i === activeIndex ? '#eff6ff' : '#fff',
                color: i === activeIndex ? '#2563eb' : '#1e293b',
              }}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}

      <div aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {suggestions.length > 0 && \`\${suggestions.length} suggestions available\`}
      </div>
    </div>
  );
}`,
  accessibility: `Implements the WAI-ARIA combobox pattern: the input has role="combobox", aria-expanded, aria-controls, aria-activedescendant, and aria-autocomplete="list". The dropdown has role="listbox" and each item has role="option" with aria-selected. A visually hidden live region announces the number of available suggestions. Keyboard navigation follows the standard combobox interaction: arrows to navigate, Enter to select, Escape to close. The label is properly associated with the input via htmlFor/id.`,
  performance: `Debouncing at 300ms reduces API calls by ~80% during fast typing. AbortController cancels in-flight requests so the network doesn't pile up. The request ID pattern ensures stale responses are discarded even if abort fails. The dropdown uses max-height with overflow scrolling for long result lists. Click-outside detection uses a single document-level listener added once on mount.`,
  edgeCases: [
    'Race condition: slow response for "a" arrives after fast response for "ab" — request ID check discards stale result',
    'Empty query — clear suggestions immediately, don\'t fetch',
    'API returns empty array — show "No results" message',
    'Keyboard navigation wraps around from last to first item',
    'User pastes a long string — debounce still applies',
    'Focus moves to dropdown item via keyboard but mouse hovers different item — activeIndex updated by both',
    'Component unmounts during fetch — AbortController prevents state update',
  ],
  testingStrategy: [
    'Unit test: useDebounce delays value correctly',
    'Unit test: mockSearch filters results and respects abort signal',
    'Integration test: typing triggers suggestions after debounce delay',
    'Integration test: ArrowDown/Up cycles through suggestions correctly',
    'Integration test: Enter selects the active suggestion and populates input',
    'Integration test: Escape closes dropdown',
    'Integration test: clicking a suggestion selects it',
    'Integration test: clicking outside closes dropdown',
    'Race condition test: fast responses overwrite slow stale responses',
  ],
  improvements: [
    'Add highlighting of the matched substring within each suggestion',
    'Implement recently searched items shown before API results',
    'Add keyboard shortcut (Ctrl+K) to focus the search input',
    'Support multi-select with chips/tags in the input',
    'Implement virtual scrolling for very large suggestion lists',
  ],
  followUpQuestions: [
    'How does aria-activedescendant work and why is it preferred over moving DOM focus to list items?',
    'How would you handle a scenario where the API requires authentication tokens?',
    'What alternative approaches exist for race condition handling besides AbortController?',
    'How would you implement typeahead with client-side caching of API results?',
  ],
};
