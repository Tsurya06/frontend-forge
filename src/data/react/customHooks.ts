import type { Topic } from "../../types";

export const customHookTopics: Topic[] = [
  {
    id: "react-custom-hooks-rules",
    title:
      "Custom Hooks, Rules of Hooks, Stale Closures & Advanced Hook Patterns",
    description:
      "In-depth mastery of React Hooks: Rules of Hooks, Custom Hook encapsulation, useReducer, useContext, useRef, useMemo, useCallback, and resolving stale closure and dependency array bugs.",
    category: "React",
    difficulty: "Intermediate",
    tags: [
      "react",
      "hooks",
      "custom-hooks",
      "useReducer",
      "stale-closures",
      "useCallback",
      "useMemo",
      "useRef",
    ],
    overview:
      "Hooks are functions that let you use state and lifecycle features from functional components. Building robust custom hooks requires understanding the Rules of Hooks (call order linked list), the mental model of closures across renders, avoiding stale closures in async callbacks/timers, and knowing when to reach for useReducer vs useState.",
    concepts: [
      "The Two Rules of Hooks: Only call at top level; Only call from React functions",
      "How React stores hooks internally: singly-linked list of hook cells on the current Fiber",
      "Custom Hooks: composing built-in hooks for reusable stateful logic",
      "The Stale Closure problem: why timers and async callbacks see outdated state and how to fix with useRef or functional updates",
      "useReducer: managing complex multi-branch state and action dispatching",
      "useRef vs useState: mutable values that do not trigger re-render vs reactive state",
      "useMemo and useCallback: reference stability and dependency array equality",
      "useLayoutEffect vs useEffect: synchronous pre-paint DOM measurement vs asynchronous post-paint",
    ],
    relatedTopicIds: ["react-components", "react-optimization"],
    questions: [
      {
        id: "react-hooks-1",
        question:
          "Why must Hooks only be called at the top level of a component (never inside loops, conditions, or nested functions)?",
        answer:
          "React does not identify hooks by name or unique string identifiers. Instead, React tracks hooks using an internal **singly-linked list of Hook nodes on the Fiber instance** (`fiber.memoizedState`).\n\nOn the initial render, React creates hook objects in sequence: Hook 1 -> Hook 2 -> Hook 3.\nOn every subsequent re-render, React traverses this linked list in the **exact same call order**, matching the current hook call with the corresponding node in the list.\n\nIf a hook is placed inside an `if` statement or loop:\n- When the condition changes, the order of hook calls shifts.\n- Hook 2 might accidentally read the state of Hook 3, causing state corruption, type errors, or crashes.\n- React's ESLint plugin (`eslint-plugin-react-hooks`) statically enforces this rule.",
        shortAnswer:
          "React tracks hooks as an ordered singly-linked list on the Fiber. Calling hooks conditionally disrupts the execution sequence, causing hooks to read state belonging to a different hook.",
        code: `// \u274C Broken: Conditional hook disrupts hook order on re-render
function BadComponent({ isSpecial }: { isSpecial: boolean }) {
  if (isSpecial) {
    useEffect(() => {}, []); // Hook order mismatch!
  }
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// \u2705 Correct: Condition inside the hook, hook at top level
function GoodComponent({ isSpecial }: { isSpecial: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isSpecial) return;
    // conditional logic safely inside effect
  }, [isSpecial]);

  return <div>{count}</div>;
}`,
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-custom-hooks-rules",
        tags: ["rules-of-hooks", "fiber", "call-order", "hooks-internal"],
        commonMistakes: [
          "Calling hooks inside helper functions called from JSX render.",
          "Early returning before all hooks are declared.",
        ],
        followUps: [
          "How does React 19 useActionState or use() hook relax some conditional constraints for Promises/Context?",
        ],
        interviewTips: [
          "Mention the `fiber.memoizedState` linked list to explain the exact internal reason.",
        ],
      },
      {
        id: "react-hooks-2",
        question:
          'What is the "Stale Closure" problem in React Hooks, and what are the three ways to fix it?',
        answer:
          "A **Stale Closure** occurs when a function (such as a `useEffect` callback, event listener, `setTimeout`, or `setInterval`) captures variables from an earlier render pass in its lexical scope and continues referencing those outdated values over time because the function was not re-created.\n\n**Classic Example**:\nAn interval created in `useEffect(() => { setInterval(() => setCount(count + 1), 1000) }, [])` captures `count = 0` forever, repeatedly setting `0 + 1 = 1` on every tick.\n\n**Three Ways to Fix Stale Closures:**\n1. **Functional State Updates**: Pass an updater callback `setCount(prev => prev + 1)` which receives the latest state directly from React.\n2. **`useRef` Bridge**: Store the value (or callback) in a mutable ref (`countRef.current`), which maintains reference stability while allowing real-time mutation.\n3. **Include all dependencies in the dependency array**: Ensure all captured values are in the `useEffect`/`useCallback` dependencies list so the closure is refreshed on changes.",
        shortAnswer:
          "Stale Closures happen when async callbacks or timers capture old state from past renders. Fixed by: (1) functional state updates (`setVal(prev => ...)`), (2) `useRef` mutable container, or (3) proper dependency array inclusion.",
        code: `import React, { useState, useEffect, useRef } from 'react';

export function Timer() {
  const [count, setCount] = useState(0);

  // \u2705 Fix 1: Functional update (Best for simple state)
  useEffect(() => {
    const id = setInterval(() => {
      setCount(prev => prev + 1); // Always reads latest state
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // \u2705 Fix 2: useRef bridge (Best for latest callbacks/complex objects)
  const countRef = useRef(count);
  countRef.current = count;

  useEffect(() => {
    const id = setInterval(() => {
      console.log('Current count via ref:', countRef.current);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return <div>Count: {count}</div>;
}`,
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-custom-hooks-rules",
        tags: [
          "stale-closures",
          "closures",
          "useEffect",
          "useRef",
          "functional-updates",
        ],
        commonMistakes: [
          "Omitting dependencies from useEffect arrays to avoid re-running the effect, creating silent stale closure bugs.",
          "Relying on state values directly inside setTimeout callbacks without functional updates.",
        ],
        followUps: [
          "How does the useEvent (or useEffectEvent) experimental hook solve the closure problem for callbacks?",
        ],
        interviewTips: [
          "Clearly demonstrate the functional update `setX(prev => ...)` pattern as the first line of defense.",
        ],
      },
      {
        id: "react-hooks-3",
        question:
          "How do you design and structure production-grade Custom Hooks in React? Build a useDebounce and useLocalStorage custom hook.",
        answer:
          "A custom hook is a JavaScript function whose name begins with `use` that calls other React hooks. Key design principles:\n1. **Single Responsibility**: Focus on one specific stateful concern (e.g. storage, media query, debouncing, network).\n2. **Type Safety**: Provide strict TypeScript interfaces for inputs, returns (tuples `[val, setVal] as const` or objects).\n3. **Return Stability**: Memoize callbacks and complex return objects with `useCallback`/`useMemo` so consumers don't suffer unnecessary re-renders.",
        shortAnswer:
          "Custom Hooks encapsulate reusable stateful logic into functions starting with `use`. They should provide strong TypeScript typing, memoized callback returns, and handle cleanup in useEffect.",
        code: `import { useState, useEffect, useCallback } from 'react';

// Custom Hook 1: useDebounce
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Custom Hook 2: useLocalStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue] as const;
}`,
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-custom-hooks-rules",
        tags: ["custom-hooks", "useDebounce", "useLocalStorage", "typescript"],
        commonMistakes: [
          "Forgetting `as const` on tuple returns, causing TypeScript to infer `(T | Function)[]` union instead of a tuple.",
          "Not wrapping localStorage access in try/catch (fails in Private Browsing mode or SSR environments).",
        ],
        followUps: [
          'How do you synchronize useLocalStorage across multiple browser tabs using the window "storage" event?',
        ],
        interviewTips: [
          'Add the window "storage" event listener to useLocalStorage to impress interviewers.',
        ],
      },
    ],
  },
];
