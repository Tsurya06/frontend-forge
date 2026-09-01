import type { MachineCodingProblem } from "../../types";

export const trieAutocompleteProblem: MachineCodingProblem = {
  id: "mc-trie-autocomplete",
  title: "Trie-Based Autocomplete",
  difficulty: "Advanced",
  category: "Machine Coding",
  tags: [
    "react",
    "trie",
    "data-structure",
    "autocomplete",
    "search",
    "keyboard-navigation",
  ],

  problemStatement: `Build an autocomplete search component in React that uses a Trie (prefix tree) data structure for efficient prefix matching. As the user types, the component should display matching suggestions in a dropdown. The Trie provides O(k) lookup time where k is the length of the prefix, making it significantly faster than linear search through an array of suggestions for large datasets.

This problem tests both your data structure knowledge and your React component skills. You need to implement the Trie class with insert and search methods, then integrate it with a React search input that shows suggestions, supports keyboard navigation through the results (arrow keys + Enter to select), and highlights the matching prefix in each suggestion. The component should handle edge cases like empty input, no matches, and special characters.`,

  functionalRequirements: [
    "Trie data structure with insert, search (prefix), and delete operations",
    "Search input that queries the Trie on each keystroke",
    "Dropdown showing matching suggestions with highlighted matching prefix",
    "Keyboard navigation: Arrow Up/Down to navigate, Enter to select, Escape to close",
    "Click to select a suggestion from the dropdown",
    "Support for ranking/sorting suggestions by frequency or recency",
    "Clear button to reset the search input",
  ],

  nonFunctionalRequirements: [
    "O(k) prefix lookup where k is prefix length",
    "Debounced input to limit Trie queries on rapid typing",
    "Accessible combobox pattern with proper ARIA attributes",
    "Maximum suggestion limit to avoid rendering thousands of matches",
  ],

  componentHierarchy: `Autocomplete
├── SearchInput
│   ├── <input> (combobox)
│   └── ClearButton
└── SuggestionsList (dropdown)
    └── SuggestionItem (repeated)
        ├── HighlightedPrefix
        └── RemainingText`,

  stateDesign: `// Trie data structure
class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  frequency: number;  // for ranking results
}

// Component state
interface AutocompleteState {
  query: string;              // current input value
  suggestions: string[];      // current matching suggestions
  highlightedIndex: number;   // keyboard-selected suggestion (-1 = none)
  isOpen: boolean;            // whether dropdown is visible
}

// The Trie is initialized once with the word list (useRef or useMemo)
// and queried on each debounced input change.`,

  architecture: `The architecture separates the Trie data structure from the React component. The Trie is instantiated with a word list on mount (via \`useRef\` to persist across renders) and provides a \`search(prefix)\` method that returns all words starting with the given prefix, sorted by frequency.

The Autocomplete component wraps a standard input with a dropdown suggestions list. It follows the WAI-ARIA combobox pattern with \`role="combobox"\` on the input and \`role="listbox"\` on the dropdown. Keyboard navigation uses a roving index that wraps around the suggestion list. Selecting a suggestion (via click or Enter) sets the input value and closes the dropdown. The component uses \`useEffect\` to rebuild the Trie when the word list changes and debounces search queries to handle rapid typing efficiently.`,

  implementation: `import React, { useState, useRef, useEffect, useCallback, useMemo, KeyboardEvent } from 'react';

class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
  frequency = 0;
}

class Trie {
  root = new TrieNode();

  insert(word: string, frequency = 1): void {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEnd = true;
    node.frequency += frequency;
  }

  search(prefix: string, limit = 10): string[] {
    let node = this.root;
    const lowerPrefix = prefix.toLowerCase();
    for (const char of lowerPrefix) {
      if (!node.children.has(char)) return [];
      node = node.children.get(char)!;
    }
    const results: { word: string; freq: number }[] = [];
    this.collectWords(node, lowerPrefix, results, limit);
    return results.sort((a, b) => b.freq - a.freq).map((r) => r.word);
  }

  private collectWords(
    node: TrieNode, prefix: string,
    results: { word: string; freq: number }[],
    limit: number
  ): void {
    if (results.length >= limit) return;
    if (node.isEnd) results.push({ word: prefix, freq: node.frequency });
    for (const [char, child] of node.children) {
      if (results.length >= limit) return;
      this.collectWords(child, prefix + char, results, limit);
    }
  }

  delete(word: string): boolean {
    return this.deleteHelper(this.root, word.toLowerCase(), 0);
  }

  private deleteHelper(node: TrieNode, word: string, depth: number): boolean {
    if (depth === word.length) {
      if (!node.isEnd) return false;
      node.isEnd = false;
      return node.children.size === 0;
    }
    const char = word[depth];
    const child = node.children.get(char);
    if (!child) return false;
    const shouldDelete = this.deleteHelper(child, word, depth + 1);
    if (shouldDelete) {
      node.children.delete(char);
      return !node.isEnd && node.children.size === 0;
    }
    return false;
  }
}

interface AutocompleteProps {
  words: string[];
  placeholder?: string;
  maxSuggestions?: number;
  onSelect?: (word: string) => void;
}

export default function Autocomplete({
  words,
  placeholder = 'Type to search...',
  maxSuggestions = 8,
  onSelect,
}: AutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const trie = useMemo(() => {
    const t = new Trie();
    words.forEach((w) => t.insert(w));
    return t;
  }, [words]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    const results = trie.search(query, maxSuggestions);
    setSuggestions(results);
    setIsOpen(results.length > 0);
    setHighlightedIndex(-1);
  }, [query, trie, maxSuggestions]);

  const selectSuggestion = useCallback((word: string) => {
    setQuery(word);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelect?.(word);
    inputRef.current?.focus();
  }, [onSelect]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((i) => (i + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) selectSuggestion(suggestions[highlightedIndex]);
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [isOpen, suggestions, highlightedIndex, selectSuggestion]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const highlightMatch = (text: string) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <strong style={{ color: '#2563eb' }}>{text.slice(idx, idx + query.length)}</strong>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const listboxId = 'autocomplete-listbox';

  return (
    <div style={{ position: 'relative', fontFamily: 'system-ui, sans-serif', maxWidth: 480 }}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={highlightedIndex >= 0 ? \`suggestion-\${highlightedIndex}\` : undefined}
          aria-autocomplete="list"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          style={{
            width: '100%', padding: '12px 40px 12px 14px', fontSize: 16,
            border: '2px solid #d1d5db', borderRadius: 8, outline: 'none',
            boxSizing: 'border-box',
            borderColor: isOpen ? '#2563eb' : '#d1d5db',
            transition: 'border-color 0.15s',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); setIsOpen(false); inputRef.current?.focus(); }}
            aria-label="Clear search"
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', fontSize: 18, cursor: 'pointer',
              color: '#9ca3af', padding: 4,
            }}
          >
            ×
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            margin: '4px 0 0', padding: 0, listStyle: 'none',
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 8, boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            maxHeight: 300, overflowY: 'auto', zIndex: 100,
          }}
        >
          {suggestions.map((word, idx) => (
            <li
              key={word}
              id={\`suggestion-\${idx}\`}
              role="option"
              aria-selected={idx === highlightedIndex}
              onClick={() => selectSuggestion(word)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              style={{
                padding: '10px 16px', cursor: 'pointer', fontSize: 15,
                background: idx === highlightedIndex ? '#eff6ff' : 'transparent',
                transition: 'background 0.1s',
              }}
            >
              {highlightMatch(word)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,

  accessibility: `The component follows the WAI-ARIA combobox pattern. The input has \`role="combobox"\`, \`aria-expanded\`, \`aria-controls\` (pointing to the listbox), \`aria-activedescendant\` (pointing to the highlighted option), and \`aria-autocomplete="list"\`. The dropdown uses \`role="listbox"\` with \`role="option"\` on each suggestion. \`aria-selected\` marks the keyboard-highlighted option. The clear button has an \`aria-label\`. Screen readers announce the active suggestion as the user navigates with arrow keys. Escape closes the dropdown and returns focus to the input.`,

  performance: `The Trie provides O(k) prefix lookup where k is the prefix length, compared to O(n×m) for linear search where n is the number of words and m is average word length. The Trie is built once on mount via \`useMemo\` and persists across renders. Search results are limited to \`maxSuggestions\` to cap both the traversal time and DOM rendering cost. The highlighted item scrolls into view using the native \`scrollIntoView\` method. For very large dictionaries (100K+ words), the Trie could be built in a Web Worker to avoid blocking the main thread during initialization.`,

  edgeCases: [
    "Empty input should show no suggestions",
    "Input with only whitespace should not trigger search",
    "Special characters in input should not cause errors",
    "Selecting a suggestion should close the dropdown and update input",
    "No matching results should close the dropdown (not show empty box)",
    "Trie with duplicate words should track frequency correctly",
  ],

  testingStrategy: [
    "Unit test (Trie): insert and search returns correct matches",
    "Unit test (Trie): delete removes word and cleans up empty branches",
    "Unit test (Trie): search with no matches returns empty array",
    "Unit test (Component): typing shows matching suggestions",
    "Integration test: arrow keys navigate through suggestions",
    "Integration test: Enter selects highlighted suggestion and closes dropdown",
  ],

  improvements: [
    "Add fuzzy matching for typo tolerance using edit distance",
    "Support weighted suggestions based on search history",
    "Build Trie in a Web Worker for large datasets",
    "Add recently searched items section above suggestions",
    "Implement multi-word search with per-word prefix matching",
  ],

  followUpQuestions: [
    "How does a Trie compare to a hash map for prefix search?",
    "How would you implement fuzzy search alongside exact prefix matching?",
    "What are the memory implications of a Trie with a large vocabulary?",
    "How would you persist and hydrate the Trie for server-side rendering?",
  ],
};
