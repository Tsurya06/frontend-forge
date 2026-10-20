import type { SprintDayLesson } from "./types";

export const day1Lesson: SprintDayLesson = {
  day: 1,
  id: "react-fundamentals-rendering",
  title: "React Fundamentals & Rendering Internals",
  tagline: "Render vs Commit phases, Fiber reconciliation, state batching snapshots, and hook execution mechanics",
  estimatedMinutes: 75,
  objectives: [
    "Differentiate the pure Render phase from the DOM mutating Commit phase",
    "Master the 4 triggers of component re-renders and React 18/19 automatic batching",
    "Understand immutable state snapshots and the mechanics behind stale closures",
    "Write resilient effects with strict dependency arrays and cleanup routines",
    "Implement effective key-based reconciliation and avoid derived state anti-patterns",
  ],
  beginnerOverview:
    "React components are functions that transform current state and props into Virtual DOM representations. Unlike vanilla DOM manipulation where you update elements imperatively, React computes differences using a Fiber tree and commits minimal changes to the actual browser DOM.",
  deepDiveExplanation:
    "At an architectural level, React divides rendering into two distinct phases: the Render phase (reconciliation) and the Commit phase. In the Render phase, React invokes your component function, evaluates JSX into React Elements, and diffs the resulting new Fiber sub-tree against the current Fiber work-in-progress tree. This phase is completely synchronous (or interruptible under Concurrent Features) and MUST remain pure without side effects. In the Commit phase, React takes the computed DOM mutations, writes them to the browser DOM in a single synchronous pass, runs useLayoutEffect cleanups and setups, paints to screen, and subsequently schedules useEffect callbacks asynchronously after paint.",
  sections: [
    {
      id: "render-commit-phases",
      heading: "1. Render Phase vs. Commit Phase",
      content:
        "The Render Phase computes what changed by constructing a new Fiber tree. Component functions, useState initializers, and useMemo callbacks run here. Because this phase can be restarted or aborted by React (e.g., in Concurrent Mode or Transitions), causing side effects like HTTP requests or direct DOM mutations here leads to race conditions and duplicate executions.\n\nThe Commit Phase applies those changes to the real DOM. It is synchronous and cannot be interrupted. Once DOM nodes are created or updated, React fires `useLayoutEffect` synchronously before the browser paints, followed by `useEffect` asynchronously on the next event loop frame after paint.",
      codeExample: {
        language: "typescript",
        caption: "Side effects must only exist in Commit phase hooks",
        code: `// ❌ ANTI-PATTERN: Side effect executed during pure Render Phase
function UserProfile({ userId }: { userId: string }) {
  // Dangerous! If render is aborted or re-invoked, this triggers duplicate requests
  fetchUserData(userId); 

  // ✅ CORRECT: Side effects deferred to Commit Phase
  useEffect(() => {
    let active = true;
    fetchUserData(userId).then(data => {
      if (active) setUser(data);
    });
    return () => { active = false; }; // Cleanup prevents race conditions
  }, [userId]);

  return <div>...</div>;
}`,
      },
      keyTakeaway:
        "Keep component functions pure. Render phase = pure math & JSX computation. Commit phase = DOM mutation & side-effect dispatch.",
    },
    {
      id: "render-triggers-batching",
      heading: "2. Re-render Triggers & Automatic Batching",
      content:
        "A component re-renders ONLY when:\n1. Its own internal state changes via useState or useReducer dispatch.\n2. Its parent component re-renders (causing children to re-render unless memoized).\n3. A React Context value it consumes changes.\n4. A custom hook it subscribes to triggers a state update.\n\nNote: Props changing alone is NOT an independent trigger; props change because the parent re-rendered!\n\nIn React 18 and 19, Automatic Batching groups multiple state updates inside promises, timeouts, and native event handlers into a single re-render cycle, preventing intermediate layout thrashing.",
      codeExample: {
        language: "typescript",
        caption: "Automatic Batching in React 18/19 across asynchronous boundaries",
        code: `function CounterWithAsync() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  async function handleClick() {
    // Both state updates are batched together into ONE render pass
    // even though they occur after an await boundary!
    await fetch('/api/log');
    setCount(c => c + 1);
    setFlag(f => !f);
    // React executes exactly 1 re-render here
  }

  return <button onClick={handleClick}>{count} - {String(flag)}</button>;
}`,
      },
      expectedOutput: "A single render pass with both count and flag updated simultaneously.",
      keyTakeaway:
        "React batches all state updates within the same microtask queue, regardless of where they are initiated.",
    },
    {
      id: "state-snapshots-closures",
      heading: "3. State Snapshots & Stale Closures",
      content:
        "State in React behaves like a constant snapshot for each render frame. Inside a given render execution, the `count` variable will never mutate. Asynchronous handlers, timers, and uncleaned effect callbacks capture variables from the specific render frame in which they were created. If an effect runs once (`[]`) and sets up an interval referencing `count`, it creates a classic Stale Closure bug.",
      codeExample: {
        language: "typescript",
        caption: "Stale Closure bug vs Functional Updater fix",
        code: `// ❌ STALE CLOSURE: Captures count = 0 forever
useEffect(() => {
  const timer = setInterval(() => {
    // count is closed over as 0 on every tick!
    setCount(count + 1); 
  }, 1000);
  return () => clearInterval(timer);
}, []); // Empty dependency array traps count

// ✅ FIX 1: Functional State Updater (Never traps outer variable)
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1); // Reads latest state directly from React queue
  }, 1000);
  return () => clearInterval(timer);
}, []);`,
      },
      expectedOutput: "Timer cleanly increments 0, 1, 2, 3... every second without stale memory traps.",
      keyTakeaway:
        "Always use functional state updates `setState(prev => ...)` when the next value derives from the current value inside timers or async callbacks.",
    },
    {
      id: "keys-reconciliation",
      heading: "4. Keys & Fiber Reconciliation",
      content:
        "React uses the `key` prop to identify Fiber nodes across consecutive renders. When reconciling children:\n- Same key & same element type = Fiber is preserved, props updated in place.\n- Different key or different element type = Fiber and corresponding DOM node are destroyed and recreated from scratch.\n\nUsing array indices as keys (`key={index}`) causes UI corruption whenever items are filtered, prepended, or deleted, because stateful children (inputs, timers) remain bound to position index instead of the item's identity.",
      codeExample: {
        language: "typescript",
        caption: "Using keys to force element re-mounting / state reset",
        code: `// Resetting form state when user changes by updating key
function UserEditor({ selectedUserId }: { selectedUserId: string }) {
  // When selectedUserId changes, React discards the old Fiber and mounts a fresh one,
  // completely resetting all internal state without manual useEffect resets!
  return <EditUserForm key={selectedUserId} userId={selectedUserId} />;
}`,
      },
      keyTakeaway:
        "Keys must be stable, unique, and predictable. Changing a component's key intentionally resets its entire state subtree cleanly.",
    },
    {
      id: "derived-state-antipatterns",
      heading: "5. Derived State vs. useEffect Syncing Anti-patterns",
      content:
        "One of the most widespread junior-to-mid frontend anti-patterns is synchronizing props to state using `useEffect`. If a value can be computed from existing props or state, calculate it on the fly during render (or memoize with `useMemo`). Creating extra state and updating it in an effect forces an unnecessary second render and introduces race conditions.",
      codeExample: {
        language: "typescript",
        caption: "Anti-pattern: Effect sync vs. Pure Render computation",
        code: `// ❌ BAD: Redundant state + extra render cycle
function SearchResults({ items, query }: { items: Item[]; query: string }) {
  const [filtered, setFiltered] = useState<Item[]>([]);
  
  useEffect(() => {
    setFiltered(items.filter(i => i.name.includes(query)));
  }, [items, query]); // Triggers unnecessary 2nd render after every search!
  
  return <ItemList items={filtered} />;
}

// ✅ GOOD: Computed directly during render
function SearchResults({ items, query }: { items: Item[]; query: string }) {
  const filtered = useMemo(() => {
    return items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
  }, [items, query]); // 0 extra renders, instant calculation

  return <ItemList items={filtered} />;
}`,
      },
      keyTakeaway:
        "Do not use useEffect to transform data for rendering. Compute it inline or with useMemo.",
    },
  ],
  misconceptions: [
    {
      myth: "Props changing is an independent cause of component re-renders.",
      reality:
        "Props changing does not trigger renders independently. A component re-renders because its parent re-rendered and passed new props down. If you wrap the child in React.memo, it will skip rendering when props are shallowly equal.",
    },
    {
      myth: "useEffect runs immediately after the component function returns JSX.",
      reality:
        "No. The component function runs during the Render phase. `useLayoutEffect` runs synchronously after DOM mutations before paint. `useEffect` runs asynchronously after the browser has completed layout and painted pixels on screen.",
    },
    {
      myth: "useRef changes trigger a lightweight re-render.",
      reality:
        "Mutating `ref.current` is a synchronous mutation of a plain JavaScript object. It produces zero re-renders.",
    },
  ],
  realWorldScenario: {
    title: "E-Commerce Filterable Product Catalog",
    problem:
      "A developer implemented search, category filters, and sorting by creating separate useState variables for filteredProducts and sorting. They hooked them together with three chaining useEffect calls. The catalog was jittery, flashed stale items on typing, and suffered from infinite re-render loops.",
    solution:
      "Removed the redundant state and all chaining useEffects. Stored only the raw server products and the active user filter criteria in state. Derived the filtered and sorted list cleanly during render inside a single useMemo hook. This eliminated 3 extra render passes per keystroke and removed all visual race conditions.",
  },
  questions: [
    {
      id: "d1-q1",
      question: "Explain the difference between the Render Phase and Commit Phase in React.",
      difficulty: "medium",
      answer:
        "The Render Phase is the pure calculation phase where React executes component functions, builds the new Fiber work-in-progress tree, and computes the diff against the current tree. It produces no user-visible changes and can be aborted or restarted. The Commit Phase is synchronous and non-interruptible: React applies all computed changes to the actual DOM, runs layout effects, and schedules passive effects after paint.",
      explanation:
        "In interviews, emphasizing that the render phase must remain pure without side effects shows strong senior architectural grounding.",
      interviewTrap:
        "Never say that React updates the DOM every time a component function is called. The function call is merely the render calculation.",
    },
    {
      id: "d1-q2",
      question: "What causes a stale closure in React, and how do you resolve it?",
      difficulty: "hard",
      answer:
        "A stale closure occurs when an asynchronous callback (such as setTimeout, setInterval, or Promise.then) or an effect captures a state variable from an earlier render pass. Because state variables are immutable snapshots per render, the callback continues referencing the outdated value rather than the latest state. It is resolved by: 1) Using a functional state updater `setState(prev => ...)`, 2) Storing the mutable latest value in a `useRef`, or 3) Accurately including the state variable in the dependency array and cleaning up prior timers.",
      explanation:
        "Interviewers use stale closure questions to test if candidates understand JavaScript lexical scope combined with React render lifecycles.",
      interviewTrap:
        "Candidates often mistakenly add an eslint-disable comment to suppress dependency array warnings instead of fixing the closure mechanics.",
    },
    {
      id: "d1-q3",
      question: "Why is using array index as a key considered an anti-pattern in dynamic lists?",
      difficulty: "medium",
      answer:
        "React uses keys to match Fiber nodes between renders. When index is used as a key (`key={index}`), if an item is inserted, deleted, or reordered, every item after the insertion point gets reassigned a different key. React treats the items as having their props changed rather than having their identities moved, which causes uncontrolled child state (like input focus, text entry, or CSS animations) to remain glued to the wrong item.",
      explanation:
        "Always use unique and stable business identifiers (e.g. `item.id`) as keys in lists.",
      interviewTrap:
        "Generating random keys on the fly like `key={Math.random()}` is even worse—it forces React to destroy and recreate DOM nodes on every single render pass.",
    },
    {
      id: "d1-q4",
      question: "When should you use useLayoutEffect instead of useEffect?",
      difficulty: "hard",
      answer:
        "You should use `useLayoutEffect` only when you need to read DOM measurements (such as scroll position, element bounding rect, or tooltip dimensions) and synchronously mutate the DOM before the browser paints pixels to the screen. Because `useLayoutEffect` blocks the browser paint, using it prevents visual flickering (e.g., positioning a floating tooltip). For all other asynchronous tasks (network calls, subscriptions, event logging), use `useEffect` to avoid blocking main-thread painting.",
      explanation:
        "99% of effects belong in useEffect. useLayoutEffect should be reserved exclusively for DOM layout measurements.",
      interviewTrap:
        "Do not use useLayoutEffect for data fetching; it degrades Time to Interactive by blocking the paint cycle.",
    },
  ],
  quiz: [
    {
      id: "d1-qz1",
      question: "In React 18+, how many times will the component re-render when both state updates execute after an await in an async function?",
      options: [
        {
          id: "a",
          text: "Two times, because async await breaks React's event loop handler batching.",
          isCorrect: false,
          explanation: "In React 17 and below, async calls broke batching. React 18 introduced Automatic Batching across all contexts.",
        },
        {
          id: "b",
          text: "One time, because React 18+ automatically batches all updates regardless of where they occur.",
          isCorrect: true,
          explanation: "React 18's automatic batching wraps updates inside microtasks into a single render cycle.",
        },
        {
          id: "c",
          text: "Zero times until the next user interaction occurs.",
          isCorrect: false,
          explanation: "State updates trigger reconciliation immediately.",
        },
      ],
      explanation: "Automatic batching in React 18+ groups state dispatches inside setTimeout, Promises, and native event handlers.",
    },
    {
      id: "d1-qz2",
      question: "Which of the following actions executes during the pure Render Phase?",
      options: [
        {
          id: "a",
          text: "The body of the component function evaluating JSX and useMemo computations.",
          isCorrect: true,
          explanation: "The component function body and useMemo runs synchronously during the Render phase.",
        },
        {
          id: "b",
          text: "The cleanup function returned by useEffect.",
          isCorrect: false,
          explanation: "useEffect cleanups run in the Commit phase after paint.",
        },
        {
          id: "c",
          text: "Writing innerHTML to document.getElementById('root').",
          isCorrect: false,
          explanation: "DOM mutations occur strictly in the Commit phase.",
        },
      ],
      explanation: "Component functions are pure render calculations. DOM writes and effect callbacks are deferred to Commit.",
    },
    {
      id: "d1-qz3",
      question: "What is the recommended approach to reset all internal state of a child component when an active ID prop changes?",
      options: [
        {
          id: "a",
          text: "Pass a unique `key={activeId}` to the child component.",
          isCorrect: true,
          explanation: "Changing the key tells React to tear down the old Fiber tree and mount a fresh one with initial state.",
        },
        {
          id: "b",
          text: "Write a useEffect in the child that listens to activeId and calls every setState.",
          isCorrect: false,
          explanation: "Syncing props to state with useEffect forces redundant re-renders and risks flash of stale content.",
        },
        {
          id: "c",
          text: "Mutate window.location to trigger a full page reload.",
          isCorrect: false,
          explanation: "Full page reloads break single-page application user experience.",
        },
      ],
      explanation: "Supplying a dynamic `key` prop tells React to treat the component as a completely distinct instance.",
    },
  ],
  exercise: {
    id: "mc-searchable-grid",
    title: "Searchable Filterable Data Grid with Clean Boundaries",
    track: "machineCoding",
    url: "/machine-coding/searchable-grid",
    description:
      "Implement a searchable, filterable user directory with real-time text query, category tags, sortable column headers, empty search states, and clean separation between data derivation and UI rendering.",
    expectedOutcome:
      "Clean single-pass rendering without redundant useEffect syncs, instant multi-criteria filtering, and keyboard-accessible table sorting.",
    complexityTip:
      "Derive filtered and sorted data in render with useMemo. Avoid holding a second 'filteredList' state variable in useState.",
    starterSnippet: `// Exercise: Searchable Filterable List with Clean Boundaries
import React, { useState, useMemo } from 'react';

export function SearchableList({ items }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortKey, setSortKey] = useState('name');

  // DERIVE: Filter & sort in a single memoized pass
  const visibleItems = useMemo(() => {
    return items
      .filter(item => {
        const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
        const matchesCat = category === 'all' || item.category === category;
        return matchesQuery && matchesCat;
      })
      .sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  }, [items, query, category, sortKey]);

  return (
    <div>
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Search items..." 
      />
      {visibleItems.length === 0 ? (
        <p>No matching results found.</p>
      ) : (
        <ul>
          {visibleItems.map(item => (
            <li key={item.id}>{item.name} ({item.category})</li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    hints: [
      "Avoid creating a `[filteredItems, setFilteredItems] = useState()` sync hook.",
      "Ensure item keys use unique persistent IDs instead of array indices.",
      "Check that empty query string renders the full catalog with zero delay.",
    ],
  },
};
