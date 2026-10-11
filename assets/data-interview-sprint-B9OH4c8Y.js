var e={day:1,id:`react-fundamentals-rendering`,title:`React Fundamentals & Rendering Internals`,tagline:`Render vs Commit phases, Fiber reconciliation, state batching snapshots, and hook execution mechanics`,estimatedMinutes:75,objectives:[`Differentiate the pure Render phase from the DOM mutating Commit phase`,`Master the 4 triggers of component re-renders and React 18/19 automatic batching`,`Understand immutable state snapshots and the mechanics behind stale closures`,`Write resilient effects with strict dependency arrays and cleanup routines`,`Implement effective key-based reconciliation and avoid derived state anti-patterns`],beginnerOverview:`React components are functions that transform current state and props into Virtual DOM representations. Unlike vanilla DOM manipulation where you update elements imperatively, React computes differences using a Fiber tree and commits minimal changes to the actual browser DOM.`,deepDiveExplanation:`At an architectural level, React divides rendering into two distinct phases: the Render phase (reconciliation) and the Commit phase. In the Render phase, React invokes your component function, evaluates JSX into React Elements, and diffs the resulting new Fiber sub-tree against the current Fiber work-in-progress tree. This phase is completely synchronous (or interruptible under Concurrent Features) and MUST remain pure without side effects. In the Commit phase, React takes the computed DOM mutations, writes them to the browser DOM in a single synchronous pass, runs useLayoutEffect cleanups and setups, paints to screen, and subsequently schedules useEffect callbacks asynchronously after paint.`,sections:[{id:`render-commit-phases`,heading:`1. Render Phase vs. Commit Phase`,content:"The Render Phase computes what changed by constructing a new Fiber tree. Component functions, useState initializers, and useMemo callbacks run here. Because this phase can be restarted or aborted by React (e.g., in Concurrent Mode or Transitions), causing side effects like HTTP requests or direct DOM mutations here leads to race conditions and duplicate executions.\n\nThe Commit Phase applies those changes to the real DOM. It is synchronous and cannot be interrupted. Once DOM nodes are created or updated, React fires `useLayoutEffect` synchronously before the browser paints, followed by `useEffect` asynchronously on the next event loop frame after paint.",codeExample:{language:`typescript`,caption:`Side effects must only exist in Commit phase hooks`,code:`// ❌ ANTI-PATTERN: Side effect executed during pure Render Phase
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
}`},keyTakeaway:`Keep component functions pure. Render phase = pure math & JSX computation. Commit phase = DOM mutation & side-effect dispatch.`},{id:`render-triggers-batching`,heading:`2. Re-render Triggers & Automatic Batching`,content:`A component re-renders ONLY when:
1. Its own internal state changes via useState or useReducer dispatch.
2. Its parent component re-renders (causing children to re-render unless memoized).
3. A React Context value it consumes changes.
4. A custom hook it subscribes to triggers a state update.

Note: Props changing alone is NOT an independent trigger; props change because the parent re-rendered!

In React 18 and 19, Automatic Batching groups multiple state updates inside promises, timeouts, and native event handlers into a single re-render cycle, preventing intermediate layout thrashing.`,codeExample:{language:`typescript`,caption:`Automatic Batching in React 18/19 across asynchronous boundaries`,code:`function CounterWithAsync() {
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
}`},expectedOutput:`A single render pass with both count and flag updated simultaneously.`,keyTakeaway:`React batches all state updates within the same microtask queue, regardless of where they are initiated.`},{id:`state-snapshots-closures`,heading:`3. State Snapshots & Stale Closures`,content:"State in React behaves like a constant snapshot for each render frame. Inside a given render execution, the `count` variable will never mutate. Asynchronous handlers, timers, and uncleaned effect callbacks capture variables from the specific render frame in which they were created. If an effect runs once (`[]`) and sets up an interval referencing `count`, it creates a classic Stale Closure bug.",codeExample:{language:`typescript`,caption:`Stale Closure bug vs Functional Updater fix`,code:`// ❌ STALE CLOSURE: Captures count = 0 forever
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
}, []);`},expectedOutput:`Timer cleanly increments 0, 1, 2, 3... every second without stale memory traps.`,keyTakeaway:"Always use functional state updates `setState(prev => ...)` when the next value derives from the current value inside timers or async callbacks."},{id:`keys-reconciliation`,heading:`4. Keys & Fiber Reconciliation`,content:`React uses the \`key\` prop to identify Fiber nodes across consecutive renders. When reconciling children:
- Same key & same element type = Fiber is preserved, props updated in place.
- Different key or different element type = Fiber and corresponding DOM node are destroyed and recreated from scratch.

Using array indices as keys (\`key={index}\`) causes UI corruption whenever items are filtered, prepended, or deleted, because stateful children (inputs, timers) remain bound to position index instead of the item's identity.`,codeExample:{language:`typescript`,caption:`Using keys to force element re-mounting / state reset`,code:`// Resetting form state when user changes by updating key
function UserEditor({ selectedUserId }: { selectedUserId: string }) {
  // When selectedUserId changes, React discards the old Fiber and mounts a fresh one,
  // completely resetting all internal state without manual useEffect resets!
  return <EditUserForm key={selectedUserId} userId={selectedUserId} />;
}`},keyTakeaway:`Keys must be stable, unique, and predictable. Changing a component's key intentionally resets its entire state subtree cleanly.`},{id:`derived-state-antipatterns`,heading:`5. Derived State vs. useEffect Syncing Anti-patterns`,content:"One of the most widespread junior-to-mid frontend anti-patterns is synchronizing props to state using `useEffect`. If a value can be computed from existing props or state, calculate it on the fly during render (or memoize with `useMemo`). Creating extra state and updating it in an effect forces an unnecessary second render and introduces race conditions.",codeExample:{language:`typescript`,caption:`Anti-pattern: Effect sync vs. Pure Render computation`,code:`// ❌ BAD: Redundant state + extra render cycle
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
}`},keyTakeaway:`Do not use useEffect to transform data for rendering. Compute it inline or with useMemo.`}],misconceptions:[{myth:`Props changing is an independent cause of component re-renders.`,reality:`Props changing does not trigger renders independently. A component re-renders because its parent re-rendered and passed new props down. If you wrap the child in React.memo, it will skip rendering when props are shallowly equal.`},{myth:`useEffect runs immediately after the component function returns JSX.`,reality:"No. The component function runs during the Render phase. `useLayoutEffect` runs synchronously after DOM mutations before paint. `useEffect` runs asynchronously after the browser has completed layout and painted pixels on screen."},{myth:`useRef changes trigger a lightweight re-render.`,reality:"Mutating `ref.current` is a synchronous mutation of a plain JavaScript object. It produces zero re-renders."}],realWorldScenario:{title:`E-Commerce Filterable Product Catalog`,problem:`A developer implemented search, category filters, and sorting by creating separate useState variables for filteredProducts and sorting. They hooked them together with three chaining useEffect calls. The catalog was jittery, flashed stale items on typing, and suffered from infinite re-render loops.`,solution:`Removed the redundant state and all chaining useEffects. Stored only the raw server products and the active user filter criteria in state. Derived the filtered and sorted list cleanly during render inside a single useMemo hook. This eliminated 3 extra render passes per keystroke and removed all visual race conditions.`},questions:[{id:`d1-q1`,question:`Explain the difference between the Render Phase and Commit Phase in React.`,difficulty:`medium`,answer:`The Render Phase is the pure calculation phase where React executes component functions, builds the new Fiber work-in-progress tree, and computes the diff against the current tree. It produces no user-visible changes and can be aborted or restarted. The Commit Phase is synchronous and non-interruptible: React applies all computed changes to the actual DOM, runs layout effects, and schedules passive effects after paint.`,explanation:`In interviews, emphasizing that the render phase must remain pure without side effects shows strong senior architectural grounding.`,interviewTrap:`Never say that React updates the DOM every time a component function is called. The function call is merely the render calculation.`},{id:`d1-q2`,question:`What causes a stale closure in React, and how do you resolve it?`,difficulty:`hard`,answer:"A stale closure occurs when an asynchronous callback (such as setTimeout, setInterval, or Promise.then) or an effect captures a state variable from an earlier render pass. Because state variables are immutable snapshots per render, the callback continues referencing the outdated value rather than the latest state. It is resolved by: 1) Using a functional state updater `setState(prev => ...)`, 2) Storing the mutable latest value in a `useRef`, or 3) Accurately including the state variable in the dependency array and cleaning up prior timers.",explanation:`Interviewers use stale closure questions to test if candidates understand JavaScript lexical scope combined with React render lifecycles.`,interviewTrap:`Candidates often mistakenly add an eslint-disable comment to suppress dependency array warnings instead of fixing the closure mechanics.`},{id:`d1-q3`,question:`Why is using array index as a key considered an anti-pattern in dynamic lists?`,difficulty:`medium`,answer:"React uses keys to match Fiber nodes between renders. When index is used as a key (`key={index}`), if an item is inserted, deleted, or reordered, every item after the insertion point gets reassigned a different key. React treats the items as having their props changed rather than having their identities moved, which causes uncontrolled child state (like input focus, text entry, or CSS animations) to remain glued to the wrong item.",explanation:"Always use unique and stable business identifiers (e.g. `item.id`) as keys in lists.",interviewTrap:"Generating random keys on the fly like `key={Math.random()}` is even worse—it forces React to destroy and recreate DOM nodes on every single render pass."},{id:`d1-q4`,question:`When should you use useLayoutEffect instead of useEffect?`,difficulty:`hard`,answer:"You should use `useLayoutEffect` only when you need to read DOM measurements (such as scroll position, element bounding rect, or tooltip dimensions) and synchronously mutate the DOM before the browser paints pixels to the screen. Because `useLayoutEffect` blocks the browser paint, using it prevents visual flickering (e.g., positioning a floating tooltip). For all other asynchronous tasks (network calls, subscriptions, event logging), use `useEffect` to avoid blocking main-thread painting.",explanation:`99% of effects belong in useEffect. useLayoutEffect should be reserved exclusively for DOM layout measurements.`,interviewTrap:`Do not use useLayoutEffect for data fetching; it degrades Time to Interactive by blocking the paint cycle.`}],quiz:[{id:`d1-qz1`,question:`In React 18+, how many times will the component re-render when both state updates execute after an await in an async function?`,options:[{id:`a`,text:`Two times, because async await breaks React's event loop handler batching.`,isCorrect:!1,explanation:`In React 17 and below, async calls broke batching. React 18 introduced Automatic Batching across all contexts.`},{id:`b`,text:`One time, because React 18+ automatically batches all updates regardless of where they occur.`,isCorrect:!0,explanation:`React 18's automatic batching wraps updates inside microtasks into a single render cycle.`},{id:`c`,text:`Zero times until the next user interaction occurs.`,isCorrect:!1,explanation:`State updates trigger reconciliation immediately.`}],explanation:`Automatic batching in React 18+ groups state dispatches inside setTimeout, Promises, and native event handlers.`},{id:`d1-qz2`,question:`Which of the following actions executes during the pure Render Phase?`,options:[{id:`a`,text:`The body of the component function evaluating JSX and useMemo computations.`,isCorrect:!0,explanation:`The component function body and useMemo runs synchronously during the Render phase.`},{id:`b`,text:`The cleanup function returned by useEffect.`,isCorrect:!1,explanation:`useEffect cleanups run in the Commit phase after paint.`},{id:`c`,text:`Writing innerHTML to document.getElementById('root').`,isCorrect:!1,explanation:`DOM mutations occur strictly in the Commit phase.`}],explanation:`Component functions are pure render calculations. DOM writes and effect callbacks are deferred to Commit.`},{id:`d1-qz3`,question:`What is the recommended approach to reset all internal state of a child component when an active ID prop changes?`,options:[{id:`a`,text:"Pass a unique `key={activeId}` to the child component.",isCorrect:!0,explanation:`Changing the key tells React to tear down the old Fiber tree and mount a fresh one with initial state.`},{id:`b`,text:`Write a useEffect in the child that listens to activeId and calls every setState.`,isCorrect:!1,explanation:`Syncing props to state with useEffect forces redundant re-renders and risks flash of stale content.`},{id:`c`,text:`Mutate window.location to trigger a full page reload.`,isCorrect:!1,explanation:`Full page reloads break single-page application user experience.`}],explanation:"Supplying a dynamic `key` prop tells React to treat the component as a completely distinct instance."}],exercise:{id:`mc-searchable-grid`,title:`Searchable Filterable Data Grid with Clean Boundaries`,track:`machineCoding`,url:`/machine-coding/searchable-grid`,description:`Implement a searchable, filterable user directory with real-time text query, category tags, sortable column headers, empty search states, and clean separation between data derivation and UI rendering.`,expectedOutcome:`Clean single-pass rendering without redundant useEffect syncs, instant multi-criteria filtering, and keyboard-accessible table sorting.`,complexityTip:`Derive filtered and sorted data in render with useMemo. Avoid holding a second 'filteredList' state variable in useState.`,starterSnippet:`// Exercise: Searchable Filterable List with Clean Boundaries
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
}`,hints:["Avoid creating a `[filteredItems, setFilteredItems] = useState()` sync hook.",`Ensure item keys use unique persistent IDs instead of array indices.`,`Check that empty query string renders the full catalog with zero delay.`]}},t={day:2,id:`advanced-react-patterns`,title:`Advanced React Patterns & State Architecture`,tagline:`Custom hooks, component composition, nuanced memoization trade-offs, context splitting, portals, and error boundaries`,estimatedMinutes:80,objectives:[`Design composable custom hooks that encapsulate reactive state logic cleanly`,`Evaluate the genuine performance trade-offs of useMemo, useCallback, and React.memo`,`Mitigate React Context re-render thrashing through context splitting and selective subscriptions`,`Implement accessible portals with proper keyboard focus trapping and ARIA attributes`,`Construct resilient Error Boundaries and decouple server state from client UI state`],beginnerOverview:`As React codebases grow, simplistic prop-passing breaks down. Advanced patterns like custom hooks, compound components, context splitting, and error boundaries allow engineers to build maintainable, resilient architectures that scale smoothly across teams.`,deepDiveExplanation:"Senior React architecture is defined by how state and boundaries are organized. Prop drilling should be solved first with component composition (`children`) before reaching for global stores. When using React Context, understand that any context value reference change forces every consuming component to re-render, bypassing `React.memo`. Performance optimization requires knowing when NOT to memoize: `useCallback` and `useMemo` carry allocation overhead and dependency array comparison costs that frequently exceed the cost of re-rendering lightweight leaf components. For external server data, treating it as cached server state rather than client UI state prevents state desynchronization.",sections:[{id:`custom-hooks-architecture`,heading:`1. Custom Hooks: Encapsulating Logic vs. Sharing State`,content:`Custom hooks share *stateful logic*, not state instances. Every component calling \`useDebounce()\` receives its own completely independent state and effect instances.

A great custom hook should:
1. Adhere strictly to the Rules of Hooks.
2. Accept options configurations with sensible defaults.
3. Return stable references (memoized callbacks/handlers) to prevent cascading renders in consumers.`,codeExample:{language:`typescript`,caption:`Production-ready useDebounce hook with cancellation support`,code:`import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Cancel timer if value or delay changes before timeout fires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}`},keyTakeaway:`Custom hooks create independent state per caller. Use custom hooks to abstract complex side effects, timers, or browser API subscriptions.`},{id:`memoization-tradeoffs`,heading:`2. The Truth About Memoization (useMemo, useCallback, React.memo)`,content:`In interviews, candidates often recommend wrapping every function in \`useCallback\` and every component in \`React.memo\`. This is a classic junior anti-pattern. Memoization is NOT free.

Every \`useMemo\` and \`useCallback\` requires:
1. Memory allocation for closure function references.
2. Array allocation for dependency lists.
3. Comparison of every element in the dependency array on every single render pass.

When TO memoize:
- Passing callbacks to heavily optimized \`React.memo\` children where re-rendering is genuinely expensive (e.g. large tables, charts, interactive canvases).
- Expensive computations (heavy regex, sorting 10,000 items, cryptographic hashing).
- Values used in the dependency array of a \`useEffect\` to prevent infinite loops.

When NOT to memoize:
- Inline button click handlers passed to native DOM elements (\`<button onClick={...}>\`). Native DOM nodes cannot be skipped by React.memo!
- Primitive numbers, strings, or booleans.`,codeExample:{language:`typescript`,caption:`Targeted memoization: when useCallback actually provides value`,code:`// ✅ Meaningful: Child is wrapped in React.memo
const ExpensiveChart = React.memo(({ onSelect }: { onSelect: (id: string) => void }) => {
  // Heavy chart rendering with SVG canvas
  return <div onClick={() => onSelect('chart-1')}>...</div>;
});

function Dashboard() {
  const [zoom, setZoom] = useState(1);

  // Without useCallback, ExpensiveChart re-renders whenever zoom changes!
  const handleSelect = useCallback((id: string) => {
    console.log("Selected:", id);
  }, []); // Stable identity preserves memoization

  // ❌ Unnecessary: Memoizing a native button click handler
  const handleZoom = useCallback(() => setZoom(z => z + 1), []); 
  // <button> is native DOM; useCallback adds dependency check overhead for zero gain!

  return (
    <div>
      <button onClick={() => setZoom(z => z + 1)}>Zoom</button>
      <ExpensiveChart onSelect={handleSelect} />
    </div>
  );
}`},keyTakeaway:`useCallback is only effective if the consumer is wrapped in React.memo or uses the callback in an effect dependency array. Otherwise, it wastes memory and CPU.`},{id:`context-splitting`,heading:`3. Context Splitting & Preventing Cascading Re-renders`,content:"When a React Context value updates, EVERY component calling `useContext(MyContext)` re-renders unconditionally. Even if a child only cares about `user.name`, updating `user.cartCount` will force that child to re-render.\n\nSenior Architecture Fix: Split Context into independent slices:\n1. State Context (holds read-only data).\n2. Dispatch Context (holds stable dispatch functions).\nBecause dispatch functions from `useReducer` never change identity, components that only trigger actions never re-render when state updates!",codeExample:{language:`typescript`,caption:`Context Splitting: Separating State from Dispatch`,code:`const ThemeStateContext = createContext<ThemeState | null>(null);
const ThemeDispatchContext = createContext<React.Dispatch<ThemeAction> | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, initialTheme);

  return (
    <ThemeStateContext.Provider value={state}>
      {/* dispatch identity never changes across the app lifetime! */}
      <ThemeDispatchContext.Provider value={dispatch}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
}

// Consuming only dispatch: This button NEVER re-renders when theme changes!
function ThemeToggleBtn() {
  const dispatch = useContext(ThemeDispatchContext);
  return <button onClick={() => dispatch({ type: 'TOGGLE' })}>Toggle</button>;
}`},keyTakeaway:`Separate frequently changing state from stable dispatch functions to eliminate context re-render cascades.`},{id:`portals-and-modals`,heading:`4. Portals & Modal Accessibility (A11y)`,content:'`ReactDOM.createPortal` renders children into a distinct DOM node outside the parent DOM tree (e.g. `document.body`), avoiding CSS clipping from parent `overflow: hidden` or `z-index` stacking context traps.\n\nCrucial Interview Fact: Event bubbling still follows the *React component tree*, not the browser DOM tree! An event fired inside a portal bubbles up to the React parent component.\n\nAccessible Modal Checklist:\n- `role="dialog"` and `aria-modal="true"`.\n- `aria-labelledby` linked to the modal title.\n- Trap keyboard Tab focus inside the modal.\n- Close on Escape key press and backdrop click.\n- Restore focus to trigger element upon closing.',codeExample:{language:`typescript`,caption:`Accessible Modal with Portal and Escape key listener`,code:`import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    // Focus first interactive element inside modal
    modalRef.current?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div 
        ref={modalRef} 
        tabIndex={-1} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
        className="modal-content"
        onClick={e => e.stopPropagation()} // Stop click bubbling to backdrop
      >
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>,
    document.body
  );
}`},keyTakeaway:`Portals break free of CSS stacking contexts while preserving React's synthetic event bubbling tree.`},{id:`error-boundaries`,heading:`5. Error Boundaries & Graceful Degradation`,content:`Error Boundaries catch JavaScript errors during the Render phase, lifecycle methods, and constructors of their child component tree. They prevent an unhandled error in a single component from crashing the entire application into a white screen.

Important Limitation: Error boundaries do NOT catch:
1. Errors inside event handlers (use standard try/catch).
2. Asynchronous code (e.g. \`setTimeout\` or \`requestAnimationFrame\`).
3. Server-Side Rendering (SSR) errors.
4. Errors thrown in the Error Boundary itself.`,codeExample:{language:`typescript`,caption:`Class-based Error Boundary with reset capability`,code:`import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  fallback: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to telemetry service (e.g. Sentry)
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  return () {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.handleReset);
    }
    return this.props.children;
  }
}`},keyTakeaway:`Isolate volatile features (e.g. third-party widgets, rich text editors) within their own localized Error Boundaries.`}],misconceptions:[{myth:`Wrapping all component functions in React.memo makes the entire app faster.`,reality:`React.memo performs shallow prop equality comparisons on every render. If props are objects or callbacks created without stable references, the shallow comparison always fails, adding CPU overhead before rendering anyway.`},{myth:`Events fired inside a React Portal only bubble to DOM parents.`,reality:`React's synthetic event system bubbles events according to the React Virtual DOM hierarchy, not the browser DOM node placement.`},{myth:`Global state libraries like Redux or Zustand should store server API responses.`,reality:`Server state is cached, remote, and asynchronous; client state is local, ephemeral, and synchronous. Storing server data in global stores leads to manual cache invalidation bugs. Prefer dedicated cache solutions (TanStack Query / SWR / RTK Query).`}],realWorldScenario:{title:`High-Frequency Stock Ticker in a Global Context`,problem:`A trading dashboard placed live stock quote prices in a root AppContext alongside user profile data and active tab selections. When prices ticked 10 times a second, the entire navigation bar, settings drawer, and user profile re-rendered constantly, freezing the main thread.`,solution:`Implemented Context Splitting. Moved volatile streaming ticker quotes into a dedicated MarketDataContext and kept user auth/UI state in a separate static context. Utilized localized subscriptions with selectors so only the specific ticker row re-rendered on price fluctuations.`},questions:[{id:`d2-q1`,question:`Explain the architectural trade-offs of memoization in React. When is useMemo harmful?`,difficulty:`hard`,answer:`Memoization introduces memory overhead (allocating closures, dependency arrays, and cache slots) and CPU overhead (shallowly comparing dependency array items on every single render). If the computation is trivial (e.g. string concatenation, simple object creation, or array filtering under 100 items), the cost of the dependency check exceeds the recalculation cost. Furthermore, if a dependency changes on every render (such as an unmemoized object prop), useMemo runs on every render regardless, creating pure overhead.`,explanation:`Senior candidates know that premature memoization clutters code and degrades performance. Memoize only when measuring a bottleneck or maintaining referential stability for downstream React.memo/effects.`,interviewTrap:`Don't claim memoization is a free performance win. Always mention dependency comparison costs and cache memory overhead.`},{id:`d2-q2`,question:`How do React Portals work with event bubbling?`,difficulty:`medium`,answer:"Although a Portal mounts DOM elements in a completely separate DOM hierarchy (e.g., at `document.body`), React's synthetic event system dispatches events along the React component tree. This means an `onClick` originating inside a child modal rendered via a portal will bubble up and trigger an `onClick` handler on its React parent component, even though the DOM nodes are unrelated in the browser DOM tree.",explanation:`Interviewers test this to check if you understand React's SyntheticEvent abstraction versus native browser event dispatching.`,interviewTrap:"Thinking portal events can only be captured via native `addEventListener` on the portal container."},{id:`d2-q3`,question:`Why can't an Error Boundary catch errors inside an onClick handler, and how do you handle them?`,difficulty:`medium`,answer:"Error Boundaries only intercept errors thrown during the Render phase, lifecycle methods, and constructors while React is actively building the UI. Event handlers run asynchronously after the render cycle completes in response to user events. Because an event handler error does not corrupt the React rendering tree, React does not need an Error Boundary to recover. To handle event handler errors, use standard `try/catch` blocks inside the handler.",explanation:`Clarifying when React renders vs when events fire is a core frontend competency.`,interviewTrap:`Saying that Error Boundaries catch all JavaScript errors anywhere in the application.`},{id:`d2-q4`,question:`What is context re-render thrashing and how do you solve it?`,difficulty:`hard`,answer:"Context re-render thrashing occurs when a context provider passes an object whose reference changes on every render (e.g. `value={{ user, logout }}`). Every component calling `useContext` will re-render, even if the specific property it reads did not change, completely bypassing `React.memo` on those components. Solutions include: 1) Memoizing the context value with `useMemo`, 2) Context splitting (separating fast-updating state from slow-updating state, and state from dispatch), and 3) Using component composition where children are passed as `children` prop.",explanation:`Demonstrates architectural capability to design performant global state without third-party libraries.`,interviewTrap:"Assuming `React.memo` will stop a child component from re-rendering when the context it consumes changes."}],quiz:[{id:`d2-qz1`,question:`When does useCallback provide a genuine performance benefit?`,options:[{id:`a`,text:"Whenever passing a click handler to a native `<button>` element.",isCorrect:!1,explanation:`Native HTML elements cannot be memoized; useCallback here only adds comparison overhead.`},{id:`b`,text:`When passing the callback to a child component wrapped in React.memo or as a dependency of an effect.`,isCorrect:!0,explanation:`Preserving referential identity prevents React.memo from re-rendering the child.`},{id:`c`,text:`It compiles the JavaScript function to WebAssembly for faster execution.`,isCorrect:!1,explanation:`useCallback does not compile to WebAssembly.`}],explanation:`useCallback is designed specifically to maintain referential equality across render cycles for memoized children or effect dependencies.`},{id:`d2-qz2`,question:`Which of the following errors CANNOT be caught by a React Error Boundary?`,options:[{id:`a`,text:`An error thrown inside a child component's render function.`,isCorrect:!1,explanation:`Render phase errors are the primary target of Error Boundaries.`},{id:`b`,text:`An unhandled promise rejection inside an asynchronous fetch call within a button's onClick.`,isCorrect:!0,explanation:`Error Boundaries do not catch errors inside async callbacks or event handlers.`},{id:`c`,text:`An error inside a child component's useLayoutEffect.`,isCorrect:!1,explanation:`Lifecycle and layout effect errors during commit are intercepted.`}],explanation:`Error boundaries catch errors during rendering, lifecycles, and constructors—not in event handlers or async timers.`},{id:`d2-qz3`,question:`Why should frequently changing state and stable dispatch functions be separated into two distinct contexts?`,options:[{id:`a`,text:`Because React only allows primitive values in a single Context.`,isCorrect:!1,explanation:`Context accepts any JavaScript value.`},{id:`b`,text:`So that components only needing to dispatch actions never re-render when the state value changes.`,isCorrect:!0,explanation:`Stable dispatch references never trigger re-renders in dispatch-only consumers.`},{id:`c`,text:`It is required by TypeScript to satisfy compiler safety.`,isCorrect:!1,explanation:`Context splitting is a performance architectural pattern, not a TypeScript requirement.`}],explanation:`Context splitting prevents unnecessary re-renders in components that dispatch events but do not render state.`}],exercise:{id:`mc-debounced-search`,title:`Reusable useDebounce Hook & Keyboard-Accessible Modal`,track:`machineCoding`,url:`/machine-coding/debounced-search`,description:`Construct a production-grade debounced search input with immediate local typing, debounced network query simulation, and a keyboard-accessible detail modal with Escape-to-close and focus retention.`,expectedOutcome:`Zero typing lag, debounced query execution after 300ms pause, and fully accessible dialog modal mounted via createPortal.`,complexityTip:`Ensure the modal listener cleans up keydown event listeners on unmount to avoid memory leaks.`,starterSnippet:`// Exercise: Debounced Search & Modal
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export function AccessibleModal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="backdrop" onClick={onClose}>
      <div className="dialog" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}`,hints:[`Return a cleanup function from the useDebounce effect that invokes clearTimeout.`,`In the modal, stop click propagation on the dialog card so clicking inside does not trigger backdrop onClose.`,`Use createPortal with document.body to prevent parent overflow clipping.`]}},n={day:3,id:`performance-core-web-vitals`,title:`Performance & Core Web Vitals Optimization`,tagline:`LCP, INP, CLS thresholds, long task breaking, React profiling, list virtualization, and real user monitoring`,estimatedMinutes:85,objectives:[`Memorize and master Google's 3 Core Web Vitals thresholds: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1`,`Diagnose and eliminate high INP caused by JavaScript main-thread blocking long tasks (>50ms)`,`Prevent Cumulative Layout Shift (CLS) using explicit dimensions, aspect-ratio, and font display strategies`,`Profile React render cascades using DevTools Flamegraphs and pinpoint unnecessary re-renders`,`Implement list virtualization and distinguish Lab synthetic metrics (Lighthouse) from Field RUM metrics (CrUX)`],beginnerOverview:`Web performance directly impacts conversion, user engagement, and search engine ranking. Core Web Vitals are Google's standardized metrics quantifying real user experience across loading speed, user responsiveness, and visual stability.`,deepDiveExplanation:"Core Web Vitals consist of three pillar metrics: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS). INP replaced FID (First Input Delay) as a Core Web Vital to capture the *entire lifecycle* of user interactions (input delay + processing time + presentation delay) across the whole session, not just the first click. Whenever JavaScript executes a task taking longer than 50ms (a Long Task), the main thread cannot process user gestures or render animation frames. Senior engineers use `PerformanceObserver`, React Profiler flamegraphs, code splitting, and `scheduler.yield()` or microtask chunking to ensure 60fps responsiveness.",sections:[{id:`cwv-thresholds-breakdown`,heading:`1. Core Web Vitals Targets & Diagnostic Anatomy`,content:`Every frontend engineer MUST know these exact target thresholds:

1. **LCP (Largest Contentful Paint)**: Measures loading speed. The render time of the largest image or text block in viewport.
   - **Good**: ≤ 2.5 seconds
   - **Needs Improvement**: 2.5s – 4.0s
   - **Poor**: > 4.0s

2. **INP (Interaction to Next Paint)**: Measures responsiveness. Time from when a user interacts (click, keypress, tap) until the browser presents the next visual frame on screen.
   - **Good**: ≤ 200 milliseconds
   - **Needs Improvement**: 200ms – 500ms
   - **Poor**: > 500ms

3. **CLS (Cumulative Layout Shift)**: Measures visual stability. Sum of layout shift scores for unexpected movements of visible elements.
   - **Good**: ≤ 0.1
   - **Needs Improvement**: 0.1 – 0.25
   - **Poor**: > 0.25`,codeExample:{language:`typescript`,caption:`Measuring Core Web Vitals in JavaScript using PerformanceObserver`,code:`// Observing LCP with PerformanceObserver API
const lcpObserver = new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log("LCP candidate time:", lastEntry.startTime); // Target: <= 2500ms
});
lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

// Observing Layout Shifts (CLS)
let clsScore = 0;
const clsObserver = new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    // Only count shifts that were NOT caused by recent user input
    if (!(entry as any).hadRecentInput) {
      clsScore += (entry as any).value;
    }
  }
  console.log("Current CLS Score:", clsScore); // Target: <= 0.1
});
clsObserver.observe({ type: "layout-shift", buffered: true });`},keyTakeaway:`Thresholds: LCP ≤ 2.5s | INP ≤ 200ms | CLS ≤ 0.1. Measure buffered performance entries to capture early load events.`},{id:`inp-and-long-tasks`,heading:`2. Cracking INP: Breaking Long Tasks (>50ms)`,content:`Any synchronous JavaScript execution block running longer than 50ms is classified by the browser as a Long Task. During a long task, the browser main thread is completely frozen: clicks, keystrokes, and scrolls cannot be processed, spiking INP.

INP consists of 3 distinct phases:
1. **Input Delay**: Time waiting for previous tasks to finish before handler starts.
2. **Processing Time**: Synchronous execution of the event handler code.
3. **Presentation Delay**: Time for browser to layout, paint, and display the next frame.

To optimize INP:
- Yield to the main thread during heavy calculations using \`await scheduler.yield()\` or \`setTimeout(..., 0)\`.
- Use \`useTransition\` to mark non-urgent UI updates as interruptible.`,codeExample:{language:`typescript`,caption:`Yielding to the main thread to prevent UI freezing during large data processing`,code:`async function yieldToMain() {
  if ('scheduler' in window && 'yield' in (window as any).scheduler) {
    await (window as any).scheduler.yield();
  } else {
    // Fallback: yield via task queue
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}

// Processing 50,000 items without freezing the browser
async function processLargeDataset(items: string[]) {
  const chunkSize = 1000;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    // Process chunk synchronously
    computeChunk(chunk);

    // Yield control back to browser so it can process user clicks & paint!
    await yieldToMain();
  }
}`},keyTakeaway:`Break CPU-bound loops into chunks and yield to the main thread every ~16ms-50ms to keep INP well below 200ms.`},{id:`cls-prevention`,heading:`3. Eliminating Cumulative Layout Shift (CLS)`,content:"CLS happens when elements shift unexpectedly after initial render. Major causes and solutions:\n\n1. **Images without dimensions**: Browser doesn't know image aspect ratio until image bytes download, causing page content below to violently jump.\n   - **Fix**: Always specify `width` and `height` attributes on `<img>` or use CSS `aspect-ratio: 16 / 9`.\n2. **Dynamic ad banners / dynamic content injected above the fold**:\n   - **Fix**: Reserve static container placeholder dimensions (e.g. `min-height: 250px`).\n3. **FOUT (Flash of Unstyled Text) / FOIT**:\n   - **Fix**: Use `font-display: optional` or preload web fonts to prevent text reflow when custom fonts arrive.",codeExample:{language:`css`,caption:`CSS Aspect-Ratio & Skeleton placeholders to guarantee 0.00 CLS`,code:`/* Reserve layout space before remote image or banner loads */
.banner-card {
  width: 100%;
  aspect-ratio: 16 / 9; /* Browser reserves exact height immediately! */
  background: #282828;  /* Subtle placeholder surface prevents jump */
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}`},expectedOutput:`Zero layout shift (CLS = 0.00) even on slow 3G connections when images load slowly.`,keyTakeaway:`Always reserve aspect-ratio or min-height for dynamically loaded media, ads, and remote data cards.`},{id:`virtualization-dom-optimization`,heading:`4. List Virtualization: Rendering 100,000 Rows at 60 FPS`,content:"Rendering 10,000 DOM nodes consumes hundreds of megabytes of memory and causes severe layout/style recalculation lag. Virtualization renders only the items currently visible in the user's viewport (plus a small buffer of 3-5 items above and below).\n\nKey Concepts:\n- **Container Height**: Defines the scrollable boundary.\n- **Total Height (Spacer)**: `items.length * itemHeight` keeps the scrollbar native and accurate.\n- **Start Index**: `Math.floor(scrollTop / itemHeight)`\n- **Visible Count**: `Math.ceil(containerHeight / itemHeight)`\n- **Offset Transform**: `translateY(startIndex * itemHeight)` positions rendered items accurately.",codeExample:{language:`typescript`,caption:`Core mathematics of a fixed-height virtualized list`,code:`function VirtualList({ items, itemHeight = 40, containerHeight = 400 }: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2); // 2 buffer
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 4; // 4 buffer
  const visibleItems = items.slice(startIndex, startIndex + visibleCount);
  const offsetY = startIndex * itemHeight;

  return (
    <div 
      style={{ height: containerHeight, overflowY: 'auto', position: 'relative' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      {/* Invisible spacer keeps scrollbar accurate */}
      <div style={{ height: totalHeight, width: '100%' }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {visibleItems.map(item => (
            <div key={item.id} style={{ height: itemHeight }}>
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`},keyTakeaway:`Virtualization replaces tens of thousands of DOM nodes with ~20 active nodes, keeping memory negligible and scrolling at 60fps.`},{id:`lab-vs-field-crux`,heading:`5. Lab vs. Field Data (Lighthouse vs. CrUX)`,content:`A critical senior interview distinction:

- **Lab Data (Synthetic)**: Collected in a controlled environment using tools like Lighthouse on a single simulated device/network. Good for reproducible debugging and pre-commit checks, but cannot measure INP accurately because no real humans are clicking the UI.

- **Field Data (RUM / Real User Monitoring)**: Collected from actual users visiting the site across real devices, networks, and sessions (e.g. Chrome User Experience Report - CrUX). Field data is what Google uses for search ranking algorithms.

A site can have a 100/100 Lighthouse score in Lab testing while having a terrible INP in the Field due to low-end Android mobile devices and long-running analytics scripts.`,keyTakeaway:`Lighthouse measures Lab data; CrUX measures Field data. INP can only be measured reliably with Field data from real user interactions.`}],misconceptions:[{myth:`Lighthouse 100 score guarantees your site passes Google's Core Web Vitals.`,reality:`Lighthouse is synthetic lab data. Google ranks sites using real-user Field data from CrUX over a rolling 28-day window. If real users on low-end devices experience lag, the site fails Core Web Vitals regardless of Lighthouse scores.`},{myth:`First Input Delay (FID) is still a Core Web Vital.`,reality:`In March 2024, Google officially replaced FID with INP (Interaction to Next Paint). FID only measured the very first click's input delay; INP measures all clicks, taps, and keystrokes throughout the entire page lifecycle.`}],realWorldScenario:{title:`E-Commerce Checkout Button Freezing (High INP)`,problem:`When users clicked 'Place Order' on a high-traffic retail app, the button froze for 680ms with no visual feedback. Users repeatedly smashed the button, submitting duplicate orders. Field INP was 720ms ('Poor').`,solution:"Root cause analysis revealed the click handler was synchronously calculating cart tax and dispatching 4 synchronous analytics trackers before updating UI state. Refactored the handler to immediately set `isSubmitting = true` (providing instantaneous visual feedback in <50ms) and deferred the analytics logging using `queueMicrotask` and `navigator.sendBeacon`. Reduced INP to 65ms ('Good')."},questions:[{id:`d3-q1`,question:`State the three Core Web Vitals metrics, their exact target thresholds, and what each measures.`,difficulty:`medium`,answer:`1. LCP (Largest Contentful Paint) ≤ 2.5s: Measures loading performance by timing when the largest visible image or text block is rendered.
2. INP (Interaction to Next Paint) ≤ 200ms: Measures responsiveness by tracking the latency of all user interactions (clicks, keypresses, taps) until the next frame paints.
3. CLS (Cumulative Layout Shift) ≤ 0.1: Measures visual stability by summing layout shift scores of unexpected content movement.`,explanation:`Every frontend candidate must state these three numbers without hesitation.`,interviewTrap:`Saying FID instead of INP, or getting the thresholds wrong (e.g. saying 100ms for INP or 0.25 for CLS).`},{id:`d3-q2`,question:`What is the difference between Lab Data and Field Data, and why does it matter?`,difficulty:`medium`,answer:`Lab data is gathered in simulated, controlled test conditions (e.g., Lighthouse running on a MacBook with CPU throttling). It is repeatable and useful for debugging, but does not capture real-world user variety or authentic user interaction latency. Field data (RUM) is gathered from real users browsing on real devices and networks across the globe (e.g., Google CrUX). Field data reflects actual user experience and is the basis for Google's search ranking algorithms.`,explanation:`Shows maturity in understanding real-world production monitoring versus development tools.`,interviewTrap:`Relying solely on local Lighthouse audits to claim a website has passed Core Web Vitals.`},{id:`d3-q3`,question:`How do you diagnose and optimize high Interaction to Next Paint (INP)?`,difficulty:`hard`,answer:"INP has three sub-phases: Input Delay, Processing Time, and Presentation Delay. 1) Identify slow interactions using PerformanceObserver with `type: 'event'` or Chrome DevTools Performance panel (looking for Long Tasks >50ms). 2) Minimize Input Delay by avoiding main-thread blocking tasks during page idle. 3) Minimize Processing Time by offloading heavy work to Web Workers, breaking long loops using `await scheduler.yield()`, and deferring non-critical tracking. 4) Minimize Presentation Delay by keeping DOM trees shallow and avoiding forced synchronous layouts (layout thrashing) in the render cycle.",explanation:`Breaking INP into its three constituent parts immediately signals senior-level understanding.`,interviewTrap:`Confusing INP with LCP or only mentioning debouncing without explaining main-thread yielding.`},{id:`d3-q4`,question:`How does list virtualization work and what are its trade-offs?`,difficulty:`hard`,answer:"List virtualization calculates the visible slice of items based on container height and scroll offset, rendering only those ~15-25 DOM elements plus a small buffer. It simulates the full list height using an outer spacer element with `height: totalCount * itemHeight` so the scrollbar remains natural. Trade-offs include: complex implementation for variable dynamic row heights, keyboard accessibility / screen reader navigation requires virtual focus management, and Ctrl+F browser native in-page text search only finds visible items.",explanation:`Senior engineers understand both how virtualization works and its accessibility trade-offs.`,interviewTrap:`Failing to mention the trade-offs (like in-page Ctrl+F search breaking) when recommending virtualization.`}],quiz:[{id:`d3-qz1`,question:`What is Google's recommended target threshold for Interaction to Next Paint (INP)?`,options:[{id:`a`,text:`200 milliseconds or less`,isCorrect:!0,explanation:`Google's 75th percentile threshold for a 'Good' INP rating is ≤ 200ms.`},{id:`b`,text:`100 milliseconds or less`,isCorrect:!1,explanation:`100ms was the threshold for FID; INP includes processing and presentation delay with a threshold of 200ms.`},{id:`c`,text:`2.5 seconds or less`,isCorrect:!1,explanation:`2.5 seconds is the target threshold for LCP, not INP.`}],explanation:`Good Core Web Vitals thresholds: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.`},{id:`d3-qz2`,question:`How can you prevent Cumulative Layout Shift (CLS) when loading responsive images?`,options:[{id:`a`,text:`Always provide explicit width/height attributes or a CSS aspect-ratio on the container.`,isCorrect:!0,explanation:`This allows the browser to calculate the container height before image bytes are downloaded.`},{id:`b`,text:`Wrap all images in a React.memo component.`,isCorrect:!1,explanation:`React.memo affects component re-renders, not DOM layout shift geometry.`},{id:`c`,text:`Convert all images to SVG base64 strings inline.`,isCorrect:!1,explanation:`Inlining large SVGs bloats the HTML bundle and harms LCP.`}],explanation:`CSS aspect-ratio reserves the geometry box immediately, eliminating layout shift.`},{id:`d3-qz3`,question:`Why does a 50ms task duration represent a critical boundary in browser performance?`,options:[{id:`a`,text:`Tasks exceeding 50ms are classified as 'Long Tasks' that block the event loop from servicing user input.`,isCorrect:!0,explanation:`The browser needs the main thread to stay responsive. Tasks >50ms cause noticeable input latency.`},{id:`b`,text:`The browser automatically terminates any script running longer than 50ms with an Out of Memory error.`,isCorrect:!1,explanation:`Browsers do not terminate scripts at 50ms.`},{id:`c`,text:`50ms is the maximum size of a TCP packet.`,isCorrect:!1,explanation:`TCP packets are measured in bytes, not time.`}],explanation:`Tasks >50ms are Long Tasks that directly inflate INP and cause frame drops.`}],exercise:{id:`coding-web-vitals-scenarios`,title:`Core Web Vitals Diagnostics & Scenario Evaluator`,track:`coding`,url:`/coding/coding-web-vitals-scenarios`,description:`Analyze and diagnose real-world frontend performance metric scenarios: evaluate LCP, INP, and CLS scores, classify performance buckets ('Good', 'Needs Improvement', 'Poor'), and calculate aggregate session scores.`,expectedOutcome:`Pass all test cases verifying exact metric threshold categorization and layout shift aggregations.`,complexityTip:`Ensure boundaries match the official spec: LCP <= 2500ms, INP <= 200ms, CLS <= 0.1.`,starterSnippet:`// Exercise: Web Vitals Diagnostics
export function evaluateVitals(metrics) {
  const { lcp, inp, cls } = metrics;
  
  const getRating = (val, good, poor) => {
    if (val <= good) return 'good';
    if (val <= poor) return 'needs-improvement';
    return 'poor';
  };

  return {
    lcpRating: getRating(lcp, 2500, 4000),
    inpRating: getRating(inp, 200, 500),
    clsRating: getRating(cls, 0.1, 0.25),
    isAllGood: lcp <= 2500 && inp <= 200 && cls <= 0.1
  };
}`,hints:[`Check that LCP is measured in milliseconds (2500ms = 2.5s).`,`Notice that CLS is a dimensionless unitless score (0.1, 0.25).`,`Verify that boundary conditions use <= rather than <.`]}},r={day:4,id:`browser-internals-build-tools`,title:`Browser Internals, Event Loop & Modern Build Tools`,tagline:`DOM/CSSOM pipeline, compositing, microtask/macrotask event loop execution, Vite vs Webpack, tree-shaking, and CDN caching`,estimatedMinutes:80,objectives:[`Trace the critical rendering path: DOM + CSSOM → Render Tree → Layout (Reflow) → Paint → Compositing`,"Identify CSS properties that trigger Reflow vs Repaint vs GPU Compositing (`transform`, `opacity`)","Predict exact execution order of Call Stack, Microtasks (`Promise`, `queueMicrotask`), and Macrotasks (`setTimeout`)",`Explain how Vite leverages native browser ESM and esbuild for sub-second HMR vs Webpack bundle overhead`,`Master Tree-Shaking mechanics (ESM static analysis vs CommonJS) and immutable cache strategies`],beginnerOverview:`Understanding what the browser does under the hood when parsing HTML, CSS, and executing JavaScript separates engineers who write code from engineers who build high-performance web systems.`,deepDiveExplanation:"The browser's Critical Rendering Path starts by parsing HTML tokens into the DOM and CSS rules into the CSSOM. Combining visible DOM nodes with CSSOM computed styles yields the Render Tree. The browser then computes geometric coordinates (Layout / Reflow), draws pixels into layer bitmaps (Paint), and sends layers to the GPU to merge on screen (Compositing). Animating geometric properties (width, top, margin) forces expensive Layout and Paint on the main thread; animating `transform` or `opacity` bypasses Layout and Paint entirely, executing directly on the GPU compositor thread. Meanwhile, JavaScript execution follows the HTML5 Event Loop specification where the microtask queue is drained to completion after every single synchronous task before any macrotask runs.",sections:[{id:`critical-rendering-path`,heading:`1. The Critical Rendering Path: Reflow vs. Repaint vs. Composite`,content:`The rendering pipeline steps:
1. **DOM Tree**: HTML parser converts raw bytes → characters → tokens → nodes → DOM Tree.
2. **CSSOM Tree**: CSS bytes converted into computed style rule tree.
3. **Render Tree**: Combines DOM and CSSOM. Elements with \`display: none\` are excluded (elements with \`visibility: hidden\` are included as empty boxes).
4. **Layout (Reflow)**: Computes exact geometry (X, Y, width, height) of every render node.
5. **Paint (Repaint)**: Fills in pixels (colors, borders, shadows, text).
6. **Compositing**: GPU merges distinct visual layers into the final screen buffer.

Performance Golden Rule: Only \`transform\` and \`opacity\` can be handled exclusively on the compositor thread without triggering layout or paint!`,codeExample:{language:`css`,caption:`60 FPS GPU-accelerated animation vs 15 FPS Layout Thrashing`,code:`/* ❌ TERRIBLE: Triggers Layout + Paint on every frame (CPU heavy) */
.box-slow {
  transition: left 0.3s ease;
  left: 200px; /* Forces full page reflow and repaint */
}

/* ✅ 60 FPS OPTIMAL: Bypasses Layout & Paint, runs on GPU Compositor */
.box-fast {
  transition: transform 0.3s ease;
  transform: translateX(200px); /* GPU layer translation only */
  will-change: transform;       /* Hints browser to create dedicated GPU layer */
}`},keyTakeaway:"Always animate `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`, or `margin` in interactive UI."},{id:`event-loop-microtasks-macrotasks`,heading:`2. The JavaScript Event Loop, Microtasks & Tasks`,content:"JavaScript is single-threaded. Concurrency is handled by the Event Loop coordination between:\n\n1. **Call Stack**: Executes synchronous code until empty.\n2. **Microtask Queue**: `Promise.then/catch/finally`, `queueMicrotask()`, `MutationObserver`.\n   - **Rule**: When the call stack empties, the browser drains the ENTIRE microtask queue until completely empty, including any new microtasks queued while draining!\n3. **Render Step**: Browser style recalculation, layout, and paint (runs ~every 16.6ms for 60fps display if main thread is free).\n4. **Macrotask (Task) Queue**: `setTimeout`, `setInterval`, `setImmediate`, I/O, UI click dispatch.\n   - **Rule**: The event loop takes EXACTLY ONE macrotask, executes it, and immediately checks the microtask queue again.",codeExample:{language:`javascript`,caption:`Classic interview question: Predict the exact console output order`,code:`console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
}).then(() => {
  console.log("4");
});

queueMicrotask(() => {
  console.log("5");
});

console.log("6");

// Execution Order:
// 1. Sync: "1", "6"
// 2. Microtasks drained in FIFO order: "3", "5", "4"
// 3. Macrotask from timer: "2"
// Output: 1, 6, 3, 5, 4, 2`},expectedOutput:`1, 6, 3, 5, 4, 2`,keyTakeaway:`Microtasks always run before macrotasks. The event loop exhausts all queued microtasks before rendering or taking the next timer.`},{id:`vite-vs-webpack`,heading:`3. Build Tools: Vite (ESM + esbuild/Rollup) vs. Webpack`,content:`Traditional bundlers (Webpack) bundle your entire codebase before starting the local dev server. As an application scales to 5,000 modules, server boot and HMR slow to crawl.

Vite transforms this by splitting dependencies from source code:
- **Dependencies** (rarely change): Pre-bundled once with Go-based \`esbuild\` (10-100x faster than JS bundlers).
- **Source Code**: Served unbundled over native browser ES Modules (\`<script type="module">\`). When a file changes, Vite only re-transforms that single file and sends an HMR update via WebSocket, achieving 10ms instantaneous HMR regardless of project size.

In production, Vite uses Rollup (or Rolldown) for highly optimized static bundle tree-shaking and asset hashing.`,keyTakeaway:`Webpack bundles eagerly before serving. Vite serves unbundled native ESM on-demand during development and bundles with Rollup for production.`},{id:`tree-shaking-mechanics`,heading:`4. Tree-Shaking: How it Works & Why CommonJS Fails`,content:"Tree-shaking is dead code elimination that removes unused exports from final production bundles.\n\nWhy it requires ES Modules (ESM):\n- `import` and `export` statements are **static**: they cannot be nested inside `if` statements or dynamic expressions. The bundler can build a complete dependency graph and detect untouched exports *at build time*.\n\nWhy CommonJS fails tree-shaking:\n- `require('./module')` is **dynamic**: it can be called conditionally at runtime (`if (cond) require(...)`). Bundlers cannot guarantee whether an export is safe to delete, so they must bundle the entire module.\n\nPackage.json `\"sideEffects\": false`:\n- Informs bundlers that files in this package do not modify globals or have side effects on import, permitting aggressive unused class/function stripping.",codeExample:{language:`javascript`,caption:`ESM Tree-shakable import vs CommonJS full bundle penalty`,code:`// ✅ Tree-shakable (ESM): Bundler imports ONLY debounce (~1KB)
import { debounce } from 'lodash-es';

// ❌ BUNDLE BLOAT (CommonJS): Imports the entire 70KB lodash library!
const { debounce } = require('lodash');`},keyTakeaway:"Tree-shaking requires static ES Module syntax. Always import from ESM-compatible packages and declare `sideEffects: false`."},{id:`cdn-caching-strategies`,heading:`5. Production Caching Strategies (HTTP Headers & Hashing)`,content:"The gold standard for single-page application (SPA) caching on CDNs:\n\n1. **Static Assets (JS, CSS, Images with Content Hashes, e.g. `index-aQPLYkrj.js`)**:\n   - Header: `Cache-Control: public, max-age=31536000, immutable`\n   - Because the filename changes whenever file content changes, browsers and CDNs can cache it safely for 1 full year without re-validating.\n\n2. **HTML Entrypoint (`index.html`)**:\n   - Header: `Cache-Control: no-cache` (or `no-store, must-revalidate`)\n   - Tells the browser to always revalidate `index.html` with the server (using ETag or 304). When you deploy a new version with updated script hashes, users get the new app immediately on their next page refresh without stale cache lockouts!",keyTakeaway:"Hash asset filenames with 1-year immutable caching; serve index.html with `no-cache` to enable instant zero-downtime releases."}],misconceptions:[{myth:`setTimeout(fn, 0) runs immediately on the very next line.`,reality:`No. setTimeout queues a macrotask in the timer queue. It cannot run until the current call stack empties AND all microtasks are drained.`},{myth:`Tree-shaking works on any npm package as long as you use Webpack 5 or Vite.`,reality:"If the package is published only as CommonJS (`module.exports`), modern bundlers cannot safely tree-shake unused exports without ESM exports or specialized Babel transforms."}],realWorldScenario:{title:`Stale Bundle CDN Deployment Incident`,problem:"A frontend team deployed a critical hotfix, but 40% of users continued reporting the bug for hours. Investigation showed their CDN was caching `index.html` with `max-age=86400` (24 hours). Returning users kept loading the old `index.html` which referenced old chunk hashes.",solution:"Configured Cloudflare CDN caching rules: Set `Cache-Control: no-cache` on `/index.html` so browsers always revalidate the entry file, while leaving `/assets/*.js` and `/assets/*.css` with `max-age=31536000, immutable`. All subsequent deployments reflected globally in <2 seconds."},questions:[{id:`d4-q1`,question:`Explain the difference between Layout (Reflow), Repaint, and Compositing. Which CSS properties are cheapest to animate?`,difficulty:`medium`,answer:"Layout (Reflow) recalculates the geometric dimensions and positions of elements on page. It is the most expensive operation. Repaint redraws visual aspects (color, visibility, shadows) without changing geometry. Compositing groups painted layers and blends them on the GPU for display on screen. The cheapest properties to animate are `transform` and `opacity` because modern browsers execute them exclusively on the GPU Compositor thread, skipping both Layout and Paint completely.",explanation:`Directly answers UI smoothness questions and demonstrates understanding of the browser rendering engine.`,interviewTrap:"Saying that `left` or `top` with CSS transitions is GPU accelerated. It is not; it triggers reflow on every frame unless using `transform`."},{id:`d4-q2`,question:`What is the difference between a Microtask and a Macrotask in the JavaScript Event Loop?`,difficulty:`medium`,answer:"A Macrotask (Task) comes from timers (`setTimeout`, `setInterval`), I/O, UI event handlers, or message channels. A Microtask comes from `Promise.then/catch`, `queueMicrotask`, or `MutationObserver`. The key difference is queue execution behavior: after a task completes, the event loop drains the *entire* microtask queue to completion before yielding to browser rendering or executing the next macrotask. If microtasks schedule more microtasks, they continue executing synchronously, potentially starving the macrotask queue.",explanation:`One of the top 3 most frequently asked JavaScript interview questions across FAANG and top startups.`,interviewTrap:`Claiming that setTimeout(fn, 0) executes before Promise.resolve().then(fn). Microtasks ALWAYS execute first.`},{id:`d4-q3`,question:`How does Vite achieve instant server start compared to Webpack?`,difficulty:`medium`,answer:"Webpack builds an entire dependency graph and bundles all JavaScript into bundles before opening a local port. Vite splits code into dependencies and source code. It pre-bundles external dependencies once using Go-compiled `esbuild` (10-100x faster than Node-based tools), and serves application source code directly as native browser ES Modules over HTTP. The browser requests individual files on-demand as they are imported. When a file is modified, Vite only re-transforms that single file and pushes it over WebSocket HMR without rebundling the rest of the application.",explanation:`Shows modern tooling mastery and architectural awareness of ESM in browsers.`,interviewTrap:`Saying Vite doesn't bundle in production. Vite uses Rollup to create bundles for production deployments.`},{id:`d4-q4`,question:`What is tree-shaking, and what package.json configuration enables it?`,difficulty:`hard`,answer:'Tree-shaking is the process of removing unused exports from the final JavaScript bundle. It relies on the static structure of ES2015 module syntax (`import` and `export`) where imports are deterministic and statically analyzable at compile time. In package.json, setting `"sideEffects": false` tells the bundler that none of the files in the package contain side effects (like mutating global variables or modifying prototypes), allowing the bundler to safely drop any export that is not explicitly consumed by the application.',explanation:`Bundle size optimization is a core senior frontend responsibility.`,interviewTrap:'Forgetting to mention that CSS imports or polyfills are side effects. If a project has CSS files, `"sideEffects": ["*.css"]` must be specified to avoid dropping styling.'}],quiz:[{id:`d4-qz1`,question:`Which of the following CSS properties can be animated without triggering a Layout (Reflow) or Paint operation?`,options:[{id:`a`,text:`transform and opacity`,isCorrect:!0,explanation:`These run exclusively on the GPU compositor thread without triggering layout or paint.`},{id:`b`,text:`top and left`,isCorrect:!1,explanation:`top and left change geometry and force Layout (Reflow) on every frame.`},{id:`c`,text:`width and height`,isCorrect:!1,explanation:`width and height trigger expensive reflows.`}],explanation:`GPU compositor handles transform and opacity directly.`},{id:`d4-qz2`,question:`Given: console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); console.log('D'); What is printed?`,options:[{id:`a`,text:`A, D, C, B`,isCorrect:!0,explanation:`A and D run synchronously; then the microtask C runs; then the macrotask B runs.`},{id:`b`,text:`A, B, C, D`,isCorrect:!1,explanation:`B is in the timer macrotask queue and cannot execute before synchronous code D.`},{id:`c`,text:`A, D, B, C`,isCorrect:!1,explanation:`Microtask C must run before the timer macrotask B.`}],explanation:`Sync code → Microtask queue → Macrotask queue.`},{id:`d4-qz3`,question:`What is the optimal Cache-Control policy for index.html versus hashed asset bundles (e.g. bundle.a8f2c.js)?`,options:[{id:`a`,text:`index.html: no-cache | hashed assets: max-age=31536000, immutable`,isCorrect:!0,explanation:`This allows instant updates via index.html revalidation while maximizing CDN caching for assets.`},{id:`b`,text:`index.html: max-age=31536000 | hashed assets: no-cache`,isCorrect:!1,explanation:`Caching index.html for a year prevents users from receiving any new deployments.`},{id:`c`,text:`Both index.html and assets should be cached with max-age=0.`,isCorrect:!1,explanation:`Disabling asset caching degrades page load speed significantly.`}],explanation:`Revalidate the entry HTML and cache content-hashed assets immutably.`}],exercise:{id:`coding-async-series`,title:`Event Loop & Async Pipeline Execution`,track:`coding`,url:`/coding/coding-async-series`,description:`Implement an asynchronous series execution pipeline that resolves asynchronous tasks sequentially without blocking the browser main thread, handling errors, timeout bounds, and microtask resolution order.`,expectedOutcome:`Sequential execution of asynchronous tasks with strict ordering, error propagation, and non-blocking event loop behavior.`,complexityTip:`Use reduce or for-await-of loop rather than Promise.all, ensuring tasks execute in serial order.`,starterSnippet:`// Exercise: Async Series Pipeline
export async function asyncSeries(tasks) {
  const results = [];
  for (const task of tasks) {
    try {
      const res = await task();
      results.push(res);
    } catch (err) {
      throw err; // Fail fast on error
    }
  }
  return results;
}`,hints:[`Avoid Promise.all because Promise.all executes tasks in parallel.`,`Ensure each promise settles before the next function is invoked.`,`Handle rejected promises properly according to spec.`]}},i={day:5,id:`architecture-apis-security-a11y`,title:`Frontend Architecture, APIs, Security & Accessibility`,tagline:`Feature slicing, AbortController race condition elimination, JWT rotation, XSS/CSRF defenses, and WCAG AA accessibility`,estimatedMinutes:85,objectives:[`Structure enterprise frontends using Feature-Sliced Design instead of flat layer-based folders`,`Eliminate network race conditions using AbortController and resilient retry interceptors`,`Secure single-page applications against XSS, CSRF, and prototype pollution attacks`,`Store auth tokens safely: httpOnly SameSite cookies vs ephemeral in-memory access tokens`,`Comply with WCAG 2.1 AA standards: roving tabindex, focus restoration, and ARIA live announcements`],beginnerOverview:`Building real-world applications requires more than just making components look nice. A robust frontend system handles network failures, prevents race conditions, resists malicious security attacks, and is accessible to all users including those using screen readers and keyboards.`,deepDiveExplanation:"Modern frontend architecture relies on vertical feature-based organization where related components, hooks, API services, and types live together inside self-contained domain boundaries. For networking, an API client must implement standard interceptors for token refresh, exponential backoff retries, and request cancellation via `AbortController` to eliminate race conditions when search inputs change rapidly. On the security front, cross-site scripting (XSS) is mitigated by avoiding unsanitized HTML injection, utilizing Content Security Policy (CSP) headers, and storing sensitive JWT refresh tokens in `httpOnly`, `Secure`, `SameSite=Strict` cookies. For accessibility (a11y), full keyboard operability, visible focus rings, explicit form label associations, and semantic ARIA announcements ensure compliance with legal and ethical WCAG AA standards.",sections:[{id:`feature-based-architecture`,heading:`1. Architecture: Feature-Sliced vs. Layer-Based Organization`,content:"Layer-based organization groups by file type (`/components`, `/hooks`, `/services`, `/types`). When a developer modifies the 'Billing' feature, they must jump across 5 different folders, leading to high cognitive load and loose cohesion.\n\nFeature-based organization (Vertical Slicing) groups code by business domain:\n```\nsrc/\n  features/\n    auth/          -> components/, hooks/, api/, types/\n    billing/       -> components/, hooks/, api/, types/\n    dashboard/     -> components/, hooks/, api/, types/\n  shared/          -> ui/ (Button, Modal), utils/, hooks/\n```\nBenefits: High cohesion, clear ownership boundaries, easy dead-code deletion, and simpler code reviews.",keyTakeaway:"Group by feature domain first; group by technical file type only within the feature. Shared low-level primitives belong in `shared/`."},{id:`abort-controller-race-conditions`,heading:`2. API Layer: Eliminating Race Conditions with AbortController`,content:`When a user types 'Re' then quickly types 'React', two asynchronous network requests are dispatched. If Request 1 ('Re') is delayed by network lag and resolves *after* Request 2 ('React'), the UI displays outdated results for 'Re' despite the input saying 'React'. This is a Network Race Condition.

Fix: Cancel the preceding pending request using \`AbortController\` whenever a new request is initiated or the component unmounts.`,codeExample:{language:`typescript`,caption:`Canceling pending search requests with AbortController in useEffect`,code:`useEffect(() => {
  // 1. Create a fresh AbortController for this effect run
  const controller = new AbortController();

  async function searchUsers() {
    try {
      setLoading(true);
      const res = await fetch(\`/api/users?q=\${encodeURIComponent(query)}\`, {
        signal: controller.signal // Bind fetch to abort signal
      });
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      // Don't set error state if request was intentionally aborted
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (query.trim()) {
    searchUsers();
  }

  // 2. Abort running request if query changes or component unmounts!
  return () => {
    controller.abort();
  };
}, [query]);`},keyTakeaway:"Always pass `controller.signal` to fetch calls and abort in effect cleanup to guarantee only the latest request updates state."},{id:`auth-security-tokens`,heading:`3. Security: JWT Storage, XSS & CSRF Defenses`,content:"Where should you store JWTs in a Single Page App?\n\n- ❌ **localStorage**: Extremely vulnerable to Cross-Site Scripting (XSS). Any third-party script or npm supply chain attack can execute `localStorage.getItem('token')` and exfiltrate credentials instantly.\n- ✅ **Recommended (Dual-Token Pattern)**:\n  1. **Access Token (Short-lived, e.g. 10 mins)**: Stored strictly in memory (JavaScript variable / React Context). If XSS occurs, the token expires quickly.\n  2. **Refresh Token (Long-lived, e.g. 7 days)**: Stored in an `httpOnly`, `Secure`, `SameSite=Strict` cookie. JavaScript cannot read `httpOnly` cookies, preventing token theft even in the event of XSS!\n\nWhen the memory access token expires, an API interceptor transparently calls `/auth/refresh` using the cookie to obtain a fresh access token without user disruption.",keyTakeaway:`Never store long-lived tokens in localStorage. Store refresh tokens in httpOnly cookies and access tokens in memory.`},{id:`xss-csrf-defense-mechanics`,heading:`4. Defending Against XSS and CSRF`,content:"- **XSS (Cross-Site Scripting)**: Occurs when untrusted user input is rendered into the DOM as executable HTML/JS. React automatically escapes variables in JSX (`<div>{userInput}</div>`), protecting against most injection. The vulnerability arises when developers use `dangerouslySetInnerHTML`. If rendering rich text, always sanitize using `DOMPurify.sanitize(input)`.\n\n- **CSRF (Cross-Site Request Forgery)**: Occurs when an attacker trick's a user's browser into submitting unauthorized requests to a site they are authenticated with. Mitigated by:\n  1. Cookie attribute `SameSite=Lax` or `SameSite=Strict` (prevents cross-origin requests from sending the cookie).\n  2. Custom request headers (e.g. `X-CSRF-Token` or `X-Requested-With`), which browsers forbid cross-origin forms from setting without explicit CORS preflight permission.",codeExample:{language:`typescript`,caption:`Safe HTML sanitization with DOMPurify`,code:`import DOMPurify from "dompurify";

function SafeRichText({ untrustedHtml }: { untrustedHtml: string }) {
  // Sanitize strips malicious <script>, onerror=, and iframe vectors
  const cleanHtml = DOMPurify.sanitize(untrustedHtml);

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}`},keyTakeaway:`Never bypass React's escaping without DOMPurify sanitization. Use SameSite cookies and custom headers for CSRF protection.`},{id:`accessibility-wcag-patterns`,heading:`5. Accessibility (A11y) & WCAG AA Compliance`,content:'Accessibility is a legal and engineering imperative. Core patterns for production web applications:\n\n1. **Semantic HTML**: Use `<button>` instead of `<div onClick>`. Native buttons come with built-in Enter/Space keyboard handlers, focus management, and screen reader roles.\n2. **Accessible Forms**: Explicitly link inputs to labels using `id` and `htmlFor`. Link error messages using `aria-describedby` and set `aria-invalid={hasError}`.\n3. **Screen Reader Announcements**: Use `aria-live="polite"` on notification banners or search result count containers so screen readers announce dynamic changes without interrupting speech.\n4. **Focus Rings**: Never set `outline: none` without providing an alternative `:focus-visible` styling.',codeExample:{language:`tsx`,caption:`WCAG-compliant Accessible Form Field`,code:`interface InputProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (val: string) => void;
}

export function AccessibleInput({ id, label, value, error, onChange }: InputProps) {
  const errorId = \`\${id}-error\`;

  return (
    <div className="field-group">
      <label htmlFor={id} className="field-label">{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={error ? "input-error" : "input-normal"}
      />
      {error && (
        <span id={errorId} role="alert" className="error-message">
          {error}
        </span>
      )}
    </div>
  );
}`},keyTakeaway:`Tie labels to inputs with htmlFor/id; link error descriptions with aria-describedby and role="alert".`}],misconceptions:[{myth:`localStorage is safe for auth tokens as long as you encrypt the token string.`,reality:`Any encryption key stored in client-side JavaScript is accessible to any XSS payload running in the same origin. Storing tokens in localStorage remains inherently vulnerable to script extraction.`},{myth:`Adding aria-label to every element improves accessibility.`,reality:`Overusing ARIA often overrides semantic HTML and creates confusing experiences for screen readers ('No ARIA is better than Bad ARIA'). Use semantic HTML first.`}],realWorldScenario:{title:`Typeahead Autocomplete Race Condition Bug`,problem:`A flight booking engine experienced complaints where users searching for 'Tokyo' saw search results for 'New York'. The user had previously typed 'New York', backspaced, and typed 'Tokyo', but the 'New York' API response arrived 1.2 seconds late over high-latency cellular networks, overwriting Tokyo.`,solution:`Refactored the API search hook to instantiate an AbortController. Every new keystroke immediately aborted the prior pending flight search. Added optimistic state clearing and result validation, completely eliminating stale response overrides.`},questions:[{id:`d5-q1`,question:`How do you store JWT tokens securely in a modern Single Page Application (SPA)?`,difficulty:`hard`,answer:"The recommended enterprise pattern is Dual-Token Rotation: 1) Store the short-lived Access Token (5-15 mins) strictly in JavaScript memory (React Context or a closure variable). Because it is not in localStorage or sessionStorage, it cannot be stolen via simple XSS storage scraping. 2) Store the long-lived Refresh Token (7-30 days) in an `httpOnly`, `Secure`, `SameSite=Strict` HTTP cookie. Because `httpOnly` cookies cannot be accessed by client JavaScript, attackers cannot steal the refresh token. An Axios/fetch response interceptor intercepts 401 Unauthorized responses, transparently posts to `/api/auth/refresh` with the cookie to obtain a new in-memory access token, and retries the original request.",explanation:`This is the definitive answer top engineering teams look for on authentication security.`,interviewTrap:`Saying 'I store it in localStorage because it's convenient.' That immediately flags security gaps.`},{id:`d5-q2`,question:`What is an asynchronous network race condition, and how do you resolve it in React?`,difficulty:`medium`,answer:"A network race condition occurs when multiple asynchronous requests are initiated in sequence (e.g. typing query 'a' then query 'ab'), but the earlier request takes longer to resolve over the network than the later request. If the earlier response arrives last, it overwrites the state with stale data. In React, you resolve it by: 1) Using `AbortController` in the `useEffect` cleanup function to actively cancel the prior HTTP request when dependencies change, or 2) Using a boolean flag (`let isCurrent = true; return () => { isCurrent = false; };`) and ignoring responses if `isCurrent` is false when the promise resolves.",explanation:`Essential for building any search, autocomplete, or tabbed data-fetching UI.`,interviewTrap:`Only mentioning debouncing. Debouncing reduces request frequency, but does not guarantee responses arrive in chronological order.`},{id:`d5-q3`,question:`What is the difference between XSS and CSRF? What defenses prevent each?`,difficulty:`medium`,answer:"XSS (Cross-Site Scripting) is an attack where malicious JavaScript is injected into the victim's browser and executed in the context of the vulnerable origin. Defenses include React JSX auto-escaping, sanitizing HTML with DOMPurify, Content Security Policy (CSP) headers, and storing sensitive tokens outside localStorage.\n\nCSRF (Cross-Site Request Forgery) is an attack where an attacker tricks an authenticated user's browser into submitting unauthorized requests to another site where the user is logged in. Defenses include `SameSite=Lax` or `Strict` cookie attributes, custom anti-CSRF request headers (`X-CSRF-Token`), and verifying Origin/Referer headers on the backend.",explanation:`Core web security knowledge required for mid to senior frontend roles.`,interviewTrap:`Confusing the two: XSS steals data or executes arbitrary code; CSRF performs unauthorized actions on behalf of a logged-in user.`},{id:`d5-q4`,question:`What are the key requirements for an accessible modal dialog according to WAI-ARIA?`,difficulty:`medium`,answer:'1. Markup: Container must have `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="modal-title-id"`.\n2. Focus Trapping: When Tab or Shift+Tab is pressed, focus must cycle exclusively through interactive elements inside the modal, never escaping to the underlying page.\n3. Initial Focus: Focus must be placed on the first interactive element or close button when opened.\n4. Escape Key: Pressing Escape must close the modal.\n5. Focus Restoration: When closed, keyboard focus must be restored back to the trigger button that originally opened the modal.\n6. Background Inert: The background page must be made inert or have `aria-hidden="true"` while open.',explanation:`Modal accessibility is the standard benchmark test for a11y knowledge in technical interviews.`,interviewTrap:`Forgetting to restore focus to the trigger button when the modal closes.`}],quiz:[{id:`d5-qz1`,question:`Why should an application avoid storing authentication JWT refresh tokens in localStorage?`,options:[{id:`a`,text:`Because any Cross-Site Scripting (XSS) vulnerability allows malicious scripts to read and steal the token.`,isCorrect:!0,explanation:`localStorage is accessible to any script running on the origin.`},{id:`b`,text:`Because localStorage is cleared automatically every 15 minutes by modern browsers.`,isCorrect:!1,explanation:`localStorage persists indefinitely until cleared manually.`},{id:`c`,text:`Because localStorage cannot store strings longer than 16 characters.`,isCorrect:!1,explanation:`localStorage typically supports 5-10MB of string data.`}],explanation:`httpOnly cookies protect against script-based token exfiltration; localStorage provides zero protection against XSS.`},{id:`d5-qz2`,question:`How does AbortController prevent UI race conditions when fetching search queries?`,options:[{id:`a`,text:`It forces the backend database to execute queries synchronously.`,isCorrect:!1,explanation:`AbortController operates in the browser network layer, not the database.`},{id:`b`,text:`It aborts earlier pending HTTP requests when a new search query is typed, ensuring obsolete responses are discarded.`,isCorrect:!0,explanation:`controller.abort() terminates the HTTP stream and rejects the fetch with an AbortError.`},{id:`c`,text:`It compresses the JSON response with gzip.`,isCorrect:!1,explanation:`AbortController does not compress responses.`}],explanation:`Aborting pending requests ensures that late-arriving stale data cannot overwrite newer search results.`},{id:`d5-qz3`,question:`Which HTML attribute links an error description message to an input field for assistive screen readers?`,options:[{id:`a`,text:`aria-describedby="error-element-id"`,isCorrect:!0,explanation:`aria-describedby references the id of the error text element so screen readers announce it.`},{id:`b`,text:`alt="error message"`,isCorrect:!1,explanation:`alt is for images, not form inputs.`},{id:`c`,text:`title="error message"`,isCorrect:!1,explanation:`title creates a browser tooltip and is not reliably announced by all screen readers.`}],explanation:`aria-describedby links descriptive or error text directly to form control inputs.`}],exercise:{id:`coding-fetch-with-retries`,title:`Resilient API Client with Exponential Backoff Retries`,track:`coding`,url:`/coding/coding-fetch-with-retries`,description:"Implement a production-grade async API wrapper `fetchWithRetries(fn, retries, delay)` that handles transient network errors with exponential backoff delays, success resolution, and terminal failure rejection.",expectedOutcome:`Pass all test cases verifying exponential backoff timing, max retry limits, and clean error forwarding on terminal failure.`,complexityTip:"Calculate retry delays using `delay * Math.pow(2, attempt)` and ensure errors are thrown when retries are exhausted.",starterSnippet:`// Exercise: Fetch With Exponential Retries
export async function fetchWithRetries(fn, retries = 3, delay = 100) {
  let attempts = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempts++;
      if (attempts > retries) {
        throw err;
      }
      const backoffDelay = delay * Math.pow(2, attempts - 1);
      await new Promise(res => setTimeout(res, backoffDelay));
    }
  }
}`,hints:[`Ensure you wait for the backoff timeout before re-invoking fn.`,`Check that attempts strictly does not exceed the retries parameter.`,`Preserve the original error instance when throwing on final failure.`]}},a={day:6,id:`testing-machine-coding-microfrontends`,title:`Testing Mastery, Machine Coding & Microfrontends`,tagline:`React Testing Library philosophy, async queries, accessible autocomplete machine coding, and pragmatic Microfrontend architecture`,estimatedMinutes:80,objectives:[`Apply React Testing Library's core philosophy: test user behavior rather than internal implementation details`,"Master RTL query priority (`getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByTestId`)","Debug asynchronous test timing using `findBy*`, `waitFor()`, and eliminate artificial `act()` warnings",`Implement production-grade machine coding components: keyboard accessible autocomplete with ARIA combobox`,`Evaluate Microfrontend trade-offs: Module Federation, shared dependencies, and when to reject microfrontends`],beginnerOverview:`Writing reliable tests gives you the confidence to refactor without fear. Paired with strong machine coding execution and understanding modern distributed architectures (like microfrontends), this represents the ultimate technical hurdle in senior frontend hiring loops.`,deepDiveExplanation:"React Testing Library enforces the golden rule: 'The more your tests resemble the way your software is used, the more confidence they can give you.' Tests should never inspect component state, private methods, or child component internals. Instead, query elements via accessible roles (`getByRole('button', { name: /submit/i })`) and user events via `@testing-library/user-event`. For complex Machine Coding interviews (such as typeahead autocomplete), interviewers evaluate state management, keyboard navigation (ArrowDown, ArrowUp, Enter, Escape), ARIA combobox attributes (`aria-expanded`, `aria-activedescendant`), loading/error/empty edge cases, and debounce hygiene. Finally, microfrontend architectures via Webpack 5 Module Federation allow independent deployments across large cross-functional teams, but introduce runtime dependency synchronization risks, CSS clashes, and bundle duplication that are toxic for small-to-mid engineering teams.",sections:[{id:`rtl-philosophy-query-priority`,heading:`1. React Testing Library: Philosophy & Query Priority`,content:"The golden rule of RTL: Do NOT test implementation details. Never assert on `wrapper.state()` or check if a internal method was called. If you refactor your component from `useState` to `useReducer`, zero tests should break as long as the user sees the same output.\n\nQuery Priority Hierarchy (from most preferred to least preferred):\n1. **`getByRole`**: The gold standard. Queries by accessible semantic role (`button`, `heading`, `textbox`, `combobox`) and accessible name.\n2. **`getByLabelText`**: Excellent for form fields linked with `<label>`.\n3. **`getByPlaceholderText`**: Acceptable fallback when no label exists.\n4. **`getByText`**: For non-interactive text content.\n5. **`getByTestId`**: Absolute last resort when semantic roles do not exist.",codeExample:{language:`tsx`,caption:`Idiomatic RTL test simulating authentic user interactions`,code:`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

test("submits login form with valid credentials", async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  // 1. Query by accessible role and label
  const emailInput = screen.getByRole("textbox", { name: /email/i });
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole("button", { name: /sign in/i });

  // 2. Simulate realistic user typing and click
  await user.type(emailInput, "engineer@example.com");
  await user.type(passwordInput, "SecretPass123!");
  await user.click(submitButton);

  // 3. Verify user-visible outcome
  expect(handleSubmit).toHaveBeenCalledTimes(1);
  expect(handleSubmit).toHaveBeenCalledWith({
    email: "engineer@example.com",
    password: "SecretPass123!",
  });
});`},keyTakeaway:"Always query with `getByRole` first. Test what the user sees and interacts with, never internal state."},{id:`async-testing-timing`,heading:"2. Async Testing: `findBy*`, `waitFor()`, and Act Warnings",content:"RTL provides three query variations:\n- **`getBy*`**: Synchronous. Throws immediately if element not found. Use for elements that should already exist.\n- **`queryBy*`**: Synchronous. Returns `null` if element not found. Use ONLY to assert element does NOT exist (`expect(screen.queryByText('Error')).not.toBeInTheDocument()`).\n- **`findBy*`**: Asynchronous. Returns a promise that polls the DOM with `waitFor` until the element appears (timeout 1000ms). Use for async data loading!\n\nFixing 'not wrapped in act(...)' warnings: This happens when state updates occur outside RTL's tracked event loop (e.g., an un-awaited promise resolves after test finishes). Always `await` async user interactions and await `findBy*` queries.",codeExample:{language:`tsx`,caption:`Testing asynchronous data loading cleanly without act warnings`,code:`test("displays user profile after successful API fetch", async () => {
  render(<UserProfile userId="u-123" />);

  // Assert loading spinner exists initially
  expect(screen.getByRole("status")).toHaveTextContent(/loading/i);

  // Await the arrival of the heading after async fetch resolves!
  // findByRole automatically wraps polling inside act()
  const heading = await screen.findByRole("heading", { name: /alex turner/i });
  expect(heading).toBeInTheDocument();

  // Assert loading spinner was removed
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});`},keyTakeaway:"Use `findBy*` for async elements; use `queryBy*` for checking absence. Never wrap tests in manual `act()` calls when using userEvent."},{id:`machine-coding-autocomplete`,heading:`3. Machine Coding: Anatomy of a Flawless Autocomplete`,content:'Typeahead Autocomplete is the #1 most frequent machine coding task across Google, Meta, and Uber. Interviewers look for these specific criteria:\n\n1. **Debounced input**: Never hit the network on every single keystroke (300ms debounce).\n2. **State Machine**: Handle `idle`, `loading`, `success`, `empty` (0 results), and `error` states.\n3. **Keyboard Accessibility**:\n   - `ArrowDown`: Moves active highlight down (cycles to 0).\n   - `ArrowUp`: Moves active highlight up (cycles to end).\n   - `Enter`: Selects currently highlighted item.\n   - `Escape`: Closes dropdown and clears active focus.\n4. **ARIA Combobox**:\n   - Input has `role="combobox"`, `aria-expanded={isOpen}`, `aria-autocomplete="list"`.\n   - Dropdown list has `role="listbox"`.\n   - Each item has `role="option"` and `aria-selected={isActive}`.\n   - Input has `aria-activedescendant="option-item-id"` pointing to current active item.',codeExample:{language:`tsx`,caption:`Keyboard navigation handler for Autocomplete component`,code:`const handleKeyDown = (e: React.KeyboardEvent) => {
  if (!isOpen || suggestions.length === 0) return;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % suggestions.length);
      break;
    case "ArrowUp":
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      break;
    case "Enter":
      e.preventDefault();
      if (activeIndex >= 0) {
        selectSuggestion(suggestions[activeIndex]);
      }
      break;
    case "Escape":
      setIsOpen(false);
      setActiveIndex(-1);
      break;
  }
};`},keyTakeaway:`Machine coding success requires: clean debounce, robust keyboard navigation (Arrow keys + Enter + Escape), and correct ARIA combobox attributes.`},{id:`microfrontends-module-federation`,heading:`4. Microfrontends & Module Federation: Reality vs. Hype`,content:`Microfrontends decompose a monolithic frontend into independently deployable applications owned by autonomous domain teams.

Module Federation (Webpack 5 / Vite Plugin):
- Allows a **Host Application** (shell) to dynamically import JavaScript chunks from a **Remote Application** at runtime over HTTP without build-time coupling.
- Shared Dependencies: Configure \`shared: { react: { singleton: true, requiredVersion: '...' } }\` so both applications share a single instance of React in memory, preventing dual-React hook errors.

**When Microfrontends are Justified**:
- 100+ engineers across multiple autonomous squads with different release cadences where a single monolithic build pipeline creates bottleneck deployments.

**When Microfrontends are an Anti-Pattern**:
- Small-to-mid teams (<30 engineers). Microfrontends drastically increase bundle sizes (duplicate vendor libraries), introduce CSS style pollution, make end-to-end integration testing difficult, and break local developer developer ergonomics.`,keyTakeaway:`Microfrontends solve organizational scaling problems for 100+ engineer teams. For 95% of applications, a modular monorepo (Turborepo/Nx) is vastly superior.`}],misconceptions:[{myth:`You should achieve 100% test coverage by asserting on component state and props.`,reality:`Testing state and props couples your tests to implementation details. When you refactor, tests break despite identical user behavior. Test outcomes and accessible UI, not state variables.`},{myth:`Microfrontends make every web application faster and easier to build.`,reality:`Microfrontends almost always degrade end-user performance due to duplicated runtime overhead and independent network asset waterfalls. They exist to solve organizational team coordination, not runtime performance.`}],realWorldScenario:{title:`Broken Autocomplete Screen Reader Compliance`,problem:"A banking portal had an autocomplete dropdown built using simple `<div>` tags and CSS highlights. Blind users using VoiceOver were completely unaware that suggestions had appeared on screen and could not select options with Arrow keys.",solution:'Re-architected the component to follow the W3C ARIA 1.2 Combobox pattern: added `role="combobox"`, `aria-expanded`, `aria-autocomplete="list"`, and dynamic `aria-activedescendant`. Screen readers announced matching result counts in real time and voiced each option as users navigated with arrow keys.'},questions:[{id:`d6-q1`,question:`What is the core philosophy of React Testing Library, and what is its query priority order?`,difficulty:`medium`,answer:"The core philosophy of RTL is: 'Test your software the way real users use it.' Tests should interact with components via accessible DOM elements and user events, completely ignoring internal state, methods, and component instances.\n\nQuery Priority Order:\n1. `getByRole`: Accessible roles (`button`, `heading`, `combobox`) + accessible name (`{ name: /save/i }`).\n2. `getByLabelText`: Form controls linked with labels.\n3. `getByPlaceholderText`: Input placeholders.\n4. `getByText`: Static non-interactive text elements.\n5. `getByTestId`: Last resort when no accessible role or text is feasible.",explanation:`Demonstrates deep alignment with modern frontend testing standards and accessibility-first thinking.`,interviewTrap:"Listing `getByTestId` as the top priority. Test IDs ignore accessibility and give false confidence."},{id:`d6-q2`,question:`How do you handle and debug the dreaded 'Warning: An update to Component inside a test was not wrapped in act(...)'?`,difficulty:`hard`,answer:"An `act()` warning indicates that an asynchronous state update occurred in the component *after* React Testing Library finished its synchronous test execution frame. This typically happens because: 1) An unawaited promise resolved after the test ended, 2) A timer (setTimeout) fired without being awaited, or 3) A userEvent action was not properly awaited. To fix it: Always use `@testing-library/user-event` with `await user.click(...)`, use `await screen.findBy*` to wait for DOM updates caused by async promises, and ensure all useEffect subscriptions are awaited before the test exits.",explanation:"Every experienced frontend developer encounters this warning; knowing why it occurs and how to fix it without wrapping code in arbitrary `act()` wrappers is a huge differentiator.",interviewTrap:"Wrapping your entire test in manual `act(() => ...)` calls. That masks the root timing bug rather than solving it."},{id:`d6-q3`,question:`What are the essential requirements for an accessible typeahead autocomplete component?`,difficulty:`hard`,answer:'1. Semantic ARIA Combobox Pattern: Input must have `role="combobox"`, `aria-expanded={isOpen}`, `aria-autocomplete="list"`, `aria-controls="listbox-id"`, and `aria-activedescendant="active-option-id"`.\n2. Listbox Container: Dropdown must have `id="listbox-id"` and `role="listbox"`.\n3. Options: Each suggestion must have `role="option"` and `aria-selected={isSelected}`.\n4. Keyboard Navigation: ArrowDown/ArrowUp to cycle active items, Enter to select, Escape to close, and Tab to blur and close.\n5. Debounce & State Management: Network calls debounced by ~300ms, with dedicated UI states for loading, empty results, and error recovery.',explanation:`This is the complete evaluation rubric used by interviewers for senior UI component tasks.`,interviewTrap:`Building an autocomplete that only works with mouse clicks and has no keyboard or ARIA support.`},{id:`d6-q4`,question:`When are Microfrontends justified, and what are their architectural drawbacks?`,difficulty:`medium`,answer:`Microfrontends are justified in large organizations (typically 100+ engineers) where independent squads need to develop, test, and deploy their portions of the application without being blocked by a shared monolithic release pipeline. Architectural drawbacks include: 1) Performance degradation due to duplicate vendor bundles and waterfall asset loading, 2) Complex shared dependency management (e.g. ensuring multiple React versions don't crash), 3) Global CSS style bleed, 4) Difficult cross-app state sharing, and 5) Frustrating local developer ergonomics. For most applications, a modular monorepo is far more efficient.`,explanation:`Shows architectural maturity by acknowledging that microfrontends are an organizational solution, not a technical performance upgrade.`,interviewTrap:`Claiming microfrontends make apps faster. They almost always make runtime performance worse.`}],quiz:[{id:`d6-qz1`,question:`Which React Testing Library query should you prefer above all others to find an interactive button?`,options:[{id:`a`,text:`screen.getByRole('button', { name: /save/i })`,isCorrect:!0,explanation:`getByRole tests both the semantic accessibility role and visible accessible name.`},{id:`b`,text:`screen.getByTestId('save-button')`,isCorrect:!1,explanation:`Test IDs are the lowest priority fallback in RTL.`},{id:`c`,text:`container.querySelector('.btn-primary')`,isCorrect:!1,explanation:`Querying by CSS class couples tests directly to styling implementation details.`}],explanation:`getByRole is the highest priority query in React Testing Library.`},{id:`d6-qz2`,question:`Which query type should you use to assert that a loading spinner is NOT present in the DOM?`,options:[{id:`a`,text:`screen.queryByRole('status')`,isCorrect:!0,explanation:`queryBy* returns null when an element is absent, allowing expect(...).not.toBeInTheDocument() without throwing.`},{id:`b`,text:`screen.getByRole('status')`,isCorrect:!1,explanation:`getBy* throws an immediate exception if the element does not exist.`},{id:`c`,text:`await screen.findByRole('status')`,isCorrect:!1,explanation:`findBy* polls until timeout and throws if not found.`}],explanation:`Use queryBy* for checking the non-existence of elements.`},{id:`d6-qz3`,question:"In Webpack 5 Module Federation, what does configuring `singleton: true` on shared React do?",options:[{id:`a`,text:`It guarantees that only one shared instance of React is loaded in browser memory across host and remotes.`,isCorrect:!0,explanation:`Singletons prevent the duplicate React instance bug where hooks throw invalid dispatcher errors.`},{id:`b`,text:`It converts React components into single-page HTML strings.`,isCorrect:!1,explanation:`Singletons relate to module sharing in memory, not HTML serialization.`},{id:`c`,text:`It forces all components to render on a single thread in Web Workers.`,isCorrect:!1,explanation:`Module federation does not use web workers for singletons.`}],explanation:`singleton: true prevents multiple copies of libraries with global state (like React) from running simultaneously.`}],exercise:{id:`mc-api-autocomplete`,title:`Accessible API Autocomplete with Keyboard Navigation`,track:`machineCoding`,url:`/machine-coding/api-autocomplete`,description:`Build a complete typeahead autocomplete component featuring 300ms query debouncing, mock API response caching, loading indicators, empty states, keyboard arrow navigation, and Enter/Escape key selection.`,expectedOutcome:`Fully accessible ARIA combobox pattern with keyboard navigation, instant debounce cancellation, and selection callback invocation.`,complexityTip:`Remember to prevent default browser page scrolling on ArrowUp and ArrowDown inside the input handler.`,starterSnippet:`// Exercise: Accessible Autocomplete
import React, { useState, useEffect } from 'react';

export function Autocomplete({ fetchSuggestions, onSelect }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setItems([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchSuggestions(query);
        setItems(results);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  const handleKeyDown = (e) => {
    if (!isOpen || items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(prev => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(prev => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0) {
        onSelect(items[activeIdx]);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="autocomplete-container">
      <input
        role="combobox"
        aria-expanded={isOpen}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
      />
      {loading && <div>Loading...</div>}
      {isOpen && (
        <ul role="listbox">
          {items.map((item, idx) => (
            <li
              key={item.id}
              role="option"
              aria-selected={idx === activeIdx}
              className={idx === activeIdx ? 'active' : ''}
              onClick={() => { onSelect(item); setIsOpen(false); }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,hints:[`Use modulo arithmetic for Arrow navigation to wrap cleanly from start to end.`,`Clear active index back to -1 when the user types a new character.`,`Ensure dropdown closes and active index resets on Escape key press.`]}},o=[{id:`sc-sys-design`,category:`system-design`,title:`Scenario 1: Infinite Social Feed with Real-Time Updates`,scenario:`You are designing the web feed for a high-traffic social media platform (similar to LinkedIn or Twitter/X). The feed supports infinite scrolling with media (images/videos), optimistic reactions (likes/reposts), and live notification banners indicating '5 new posts available'.`,prompt:`Explain your architectural design covering: component tree boundaries, data fetching & virtualization, optimistic UI updates, WebSocket/SSE connection management, and memory leak prevention for long sessions.`,expectedKeyPoints:[`Virtualization (windowing) to cap DOM node count below 50 nodes even when scrolling 10,000 items.`,"Buffer pool pagination with cursor-based API (`next_cursor`) instead of offset-based pagination.",`Optimistic mutation updates: immediately increment like count, dispatch network request, and rollback on error.`,`Server-Sent Events (SSE) or WebSockets for live post notification banner without interrupting active scroll position.`,`Memory capping: Evacuate distant offscreen image textures and detach unused event listeners.`],sampleStrongAnswer:`I would structure this feed with three core layers: 1) Data & Network Layer: Use cursor-based pagination with a TanStack Query infinite cache. Maintain an in-memory queue for incoming real-time SSE updates. Rather than prepending new posts directly into the active feed (which causes jarring scroll jumping), display a floating 'N new posts' pill at the top of the viewport. 2) Rendering Layer: Implement list virtualization with dynamic row height estimation. 3) Mutation Layer: Optimistically toggle likes with a rollback snapshot in case the network fails. 4) Memory Management: Detach HTML5 video players from DOM when scrolled out of view and enforce a sliding window buffer of 200 items in memory to prevent browser tab bloat.`,difficulty:`hard`},{id:`sc-perf-debug`,category:`performance`,title:`Scenario 2: Diagnosing 650ms INP on a Filter Drawer`,scenario:`Production RUM data indicates that opening a sidebar filter drawer on your e-commerce search results page has an INP of 650ms ('Poor') on mobile devices. Desktop works with acceptable latency.`,prompt:`Walk the interviewer step-by-step through how you reproduce, profile, pinpoint the root cause, and implement the fix for this performance degradation.`,expectedKeyPoints:[`Reproduce in Chrome DevTools using 4x/6x CPU Throttling on mobile viewport.`,`Record a Performance profile and inspect the Main thread flamegraph for Long Tasks (>50ms).`,`Check for forced synchronous layouts (Layout Thrashing) where DOM reads and writes alternate.`,"Inspect if the drawer animation uses layout-triggering properties (`width`, `left`) instead of GPU-accelerated `transform: translateX()`.",`Check if opening the drawer forces an unnecessary re-render of the entire 100-item product list behind it.`],sampleStrongAnswer:"First, I reproduce the issue in Chrome DevTools by setting CPU Throttling to 4x slowdown and enabling mobile viewport emulation. I record a trace while clicking the filter button and examine the interaction timeline. I look for: 1) Animation mechanism: If the drawer transitions `left: 0`, I replace it with `transform: translateX(0)` to offload animation to the GPU Compositor thread. 2) Re-render cascading: I check the React DevTools Profiler to see if opening the drawer updates a shared parent state that causes all 100 product cards to re-render. If so, I isolate the drawer state or wrap the product list in React.memo. 3) Recalculate Styles: Ensure no synchronous DOM measurements (`element.offsetHeight`) occur during the toggle handler.",difficulty:`hard`},{id:`sc-testing-a11y`,category:`testing-a11y`,title:`Scenario 3: Accessible Custom Multi-Select Dropdown with RTL Tests`,scenario:"Your team built a custom multi-select tag picker. A user audit found that keyboard users cannot navigate options, and automated tests only check whether a CSS class `.tag-selected` exists.",prompt:`Describe the ARIA attributes, keyboard interaction model, and the React Testing Library test cases you would write to test user behavior rather than implementation details.`,expectedKeyPoints:['WAI-ARIA Combobox / Listbox multi-select pattern: `role="combobox"`, `aria-multiselectable="true"`, `role="option"` with `aria-selected`.',`Keyboard controls: ArrowDown/ArrowUp to highlight, Space/Enter to toggle selection, Backspace to delete previous tag.`,"RTL test: Query by `screen.getByRole('combobox')`, type with `userEvent.type`, select options with `userEvent.click` or keyboard.","Assert on visible selected tags with `screen.getByRole('button', { name: /remove react/i })` rather than inspecting CSS class names."],sampleStrongAnswer:'For accessibility, the trigger input uses `role="combobox"` with `aria-expanded` and `aria-haspopup="listbox"`. The popup list uses `role="listbox"` with `aria-multiselectable="true"`, and each option has `role="option"` and `aria-selected`. Keyboard navigation supports ArrowDown/Up, Space/Enter to toggle, and Escape to dismiss. For RTL testing, I write tests simulating real user behavior: 1) User clicks combobox, 2) User presses ArrowDown and Enter, 3) Verify the tag appears by asserting `expect(screen.getByRole(\'button\', { name: /remove typescript/i })).toBeInTheDocument()`. I never assert on `.tag-selected` CSS classes.',difficulty:`medium`},{id:`sc-tradeoffs`,category:`tradeoffs`,title:`Scenario 4: Technical Debt & Architectural Past Decisions`,scenario:`An interviewer asks: 'Tell me about a time you had to make a difficult technical trade-off or compromise on a frontend project. What did you choose and what were the consequences?'`,prompt:`Structure a compelling, honest senior-level response using the STAR format (Situation, Task, Action, Result) focusing on architectural trade-offs.`,expectedKeyPoints:[`Clear context and business constraints (e.g. deadline vs technical purity).`,`Evaluation of multiple candidate options (Option A vs Option B with pros and cons).`,`Deliberate decision-making criteria (e.g. optimizing for time-to-market while creating an explicit tech debt tracker).`,`Measuring outcome and follow-up remediation.`],sampleStrongAnswer:`On a prior project, we needed to roll out a complex analytics dashboard within a tight 3-week enterprise deadline. The ideal architecture was a normalized TanStack Query cache with custom graph rendering. However, learning curves and migration time would have caused a 3-week delay. I made the deliberate decision to adopt a lightweight charting library with centralized Context, accepting the trade-off of higher memory usage for un-virtualized graphs. To mitigate this risk, I created an explicit technical debt ticket with performance budgets (bundle size <250KB, max data points capped at 500). We hit the client launch on time, and during the subsequent quarter, refactored to the normalized cache once user feedback proved the feature's business value.`,difficulty:`medium`}],s=[e,t,n,r,i,a,{day:7,id:`mock-interview-consolidation`,title:`Capstone Assessment, System Design & Final Mastery`,tagline:`Comprehensive 45-minute timed capstone assessment, frontend system design, performance troubleshooting, and the ultimate technical readiness checklist`,estimatedMinutes:90,objectives:[`Execute a simulated 45-minute frontend technical capstone assessment covering Days 1 through 6`,`Structure large-scale Frontend System Design answers (Virtualization, SSE, Optimistic UI, Caching)`,`Troubleshoot real-world Core Web Vitals production performance degradation under time constraints`,`Articulate engineering trade-offs, past project decisions, and technical debt management using the STAR model`,`Complete the final technical readiness checklist and review flagged revision topics`],beginnerOverview:`The final day consolidates your knowledge into senior-level engineering execution. Senior frontend engineering evaluates not just whether you know the answers, but how clearly you communicate, how you structure trade-offs, and how calmly you troubleshoot ambiguous production requirements.`,deepDiveExplanation:`A complete frontend architecture evaluation typically consists of four components: 1) JavaScript fundamentals & React rendering internals, 2) Hands-on machine coding with live test cases, 3) Frontend System Design (scaling component trees, state caching, and network resilience), and 4) Architectural trade-offs. Performing under timed pressure requires having standardized mental frameworks: always clarify requirements upfront, state assumptions explicitly, analyze edge cases (empty states, errors, accessibility), and evaluate trade-offs rather than jumping into code prematurely.`,sections:[{id:`interview-mental-frameworks`,heading:`1. The 4-Step Technical Engineering Framework`,content:`When presented with any complex coding or architecture challenge, never start typing immediately. Follow this 4-step framework:

1. **Clarify (2-3 mins)**: Confirm input constraints, edge cases (empty states, large inputs, localization, mobile viewports), and authentication expectations.
2. **High-Level Architecture (5 mins)**: Outline component boundaries, state ownership (local vs global vs server), and API contracts before implementation.
3. **Iterative Implementation (25 mins)**: Build the happy path first, followed by error states, loading skeletons, and keyboard accessibility.
4. **Verification & Edge Cases (5 mins)**: Walk through test inputs, state time/space complexity, and identify follow-up optimizations (virtualization, caching).`,keyTakeaway:`Clarify requirements first, outline component hierarchy second, code cleanly third, and review edge cases fourth.`},{id:`system-design-rubric`,heading:`2. The Frontend System Design Blueprint`,content:`Frontend System Design questions test your ability to build web applications at enterprise scale. Use the RADIO framework:

- **R** - Requirements: Functional (what features) & Non-functional (perf, latency, a11y, devices).
- **A** - Architecture: High-level component tree and module boundaries.
- **D** - Data Model & API: REST vs GraphQL, schema payloads, pagination (cursor vs offset), state management.
- **I** - Interface & UX: Skeletons, optimistic updates, offline mode, empty states.
- **O** - Optimization & Security: Virtualization, code splitting, asset caching, XSS/CSRF protections.`,keyTakeaway:`Use the RADIO framework to keep frontend system design discussions structured and thorough.`},{id:`final-revision-checklist`,heading:`3. 10-Point Technical Mastery Checklist`,content:`Verify you can explain each of these points in under 60 seconds:

1. React Render vs Commit phase and why functions must remain pure.
2. Stale closures, functional state updates, and effect dependency arrays.
3. Exact Core Web Vitals thresholds: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
4. JavaScript Event Loop: Call stack, Microtasks (Promise), and Macrotasks (setTimeout).
5. CSS Reflow vs Repaint vs Compositing (\`transform\` and \`opacity\` GPU acceleration).
6. Vite unbundled ESM dev server vs Webpack bundle overhead.
7. Dual-Token JWT pattern: Memory access token + httpOnly refresh cookie.
8. AbortController request cancellation to eliminate search race conditions.
9. React Testing Library query priority: \`getByRole\` over all else.
10. Microfrontend trade-offs and Module Federation singletons.`,keyTakeaway:`Review these 10 core concepts to solidify your senior frontend engineering foundation.`}],misconceptions:[{myth:`In machine coding interviews, the candidate who finishes first gets the best score.`,reality:`Interviewers grade code readability, component architecture, keyboard accessibility, edge case handling, and communication far higher than raw typing speed.`},{myth:`You should never admit you don't know something in an interview.`,reality:`Making up false facts is an immediate disqualifier. Senior engineers say: 'I haven't used that specific API in production, but based on how similar browser APIs operate, here is how I would approach it...'`}],realWorldScenario:{title:`Senior Engineering Hiring Loop Debrief`,problem:`A candidate successfully coded an autocomplete component in 15 minutes, but failed the interview. The debrief revealed: zero keyboard accessibility, no debounce on network requests, array indices used as React keys, and complete silence throughout the coding phase.`,solution:`A second candidate took 25 minutes, but proactively communicated trade-offs, added ARIA combobox attributes, handled error and empty states, and explained how they would optimize with virtualization at scale. The second candidate received a Strong Hire recommendation.`},questions:[{id:`d7-q1`,question:`How do you handle a situation where an interviewer gives you ambiguous or incomplete requirements?`,difficulty:`medium`,answer:`Ambiguity is intentional. Senior candidates do not assume answers; they ask clarifying questions. I start by confirming: 1) Who are the target users and devices (mobile vs desktop)? 2) What are the data volumes (10 items vs 100,000 items)? 3) How should error and offline states behave? 4) What is the MVP scope versus 'nice-to-have' extensions? Asking these questions demonstrates leadership and prevents wasted engineering effort.`,explanation:`Shows product maturity and communication acumen.`,interviewTrap:`Immediately coding based on your own unverified assumptions.`},{id:`d7-q2`,question:`How do you optimize an application for low-bandwidth, high-latency mobile networks in emerging markets?`,difficulty:`hard`,answer:"1) Aggressive Code Splitting: Split routes with React.lazy and dynamically import heavy libraries (e.g. chart engines or date formatters). 2) Image Optimization: Use modern formats (AVIF/WebP) with `srcset` and `sizes`, responsive sizing, and lazy loading. 3) Modern Build: Ship modern ES2020+ code to eliminate transpiled polyfill bloat. 4) Caching & Service Workers: Implement Workbox service worker caching for offline shell capability. 5) Network Resiliency: Use exponential backoff retries with AbortController cancellation for flaky connections. 6) Lightweight Alternatives: Replace bulky packages (e.g. date-fns instead of moment.js, preact/signals where appropriate).",explanation:`A classic system design and performance question for global-scale products.`,interviewTrap:`Focusing only on code splitting and forgetting image payloads, which typically account for 70%+ of total page weight.`},{id:`d7-q3`,question:`What is your approach to technical debt in a fast-moving engineering team?`,difficulty:`medium`,answer:`I view technical debt as financial debt: taking on debt intentionally to hit a critical market milestone is acceptable, but unmanaged debt will bankrupt the team in interest (bug regressions, slowed velocity, developer attrition). I manage it by: 1) Making debt visible: document shortcuts in tickets with quantifiable impact. 2) The Boy Scout Rule: leave code cleaner than you found it during routine feature work. 3) Dedicating 15-20% of every sprint cycle to technical health, refactoring, and automated test coverage.`,explanation:`Demonstrates pragmatic engineering leadership.`,interviewTrap:`Demanding that all feature development stop for 3 months for a complete rewrite. Complete rewrites almost always fail.`},{id:`d7-q4`,question:`Explain how you would design an optimistic UI update with rollback capability.`,difficulty:`medium`,answer:"An optimistic update updates the client UI immediately before the server response arrives, giving the user a 0ms instantaneous experience. The pattern: 1) Save a snapshot of the current state (`const previousState = state`). 2) Immediately update the UI state optimistically (`setState(optimisticState)`). 3) Send the network mutation. 4) If the mutation succeeds, reconcile with any server-returned metadata (e.g. assigned ID or timestamp). 5) If the mutation fails, rollback to the snapshot (`setState(previousState)`) and display an accessible toast error with a retry button.",explanation:`Standard pattern in high-quality modern web applications.`,interviewTrap:`Forgetting to capture the rollback snapshot or not providing feedback when the operation fails.`}],quiz:[{id:`d7-qz1`,question:`What is the very first step you should take in a technical frontend interview?`,options:[{id:`a`,text:`Clarify requirements, constraints, edge cases, and target devices with the interviewer.`,isCorrect:!0,explanation:`Clarifying questions establish scope and prevent coding the wrong solution.`},{id:`b`,text:`Immediately start typing state hooks and component boilerplate.`,isCorrect:!1,explanation:`Jumping straight into code without clarifying requirements is a common red flag.`},{id:`c`,text:`Install 10 third-party npm packages.`,isCorrect:!1,explanation:`Interviewers prefer clean vanilla/React solutions without heavy external dependencies.`}],explanation:`Always clarify requirements and define boundaries before implementing.`},{id:`d7-qz2`,question:`In an optimistic UI update, what must always be preserved before applying the optimistic change?`,options:[{id:`a`,text:`A snapshot of the prior state, in order to rollback cleanly if the network request fails.`,isCorrect:!0,explanation:`The prior state snapshot is essential to revert the UI if the server rejects the mutation.`},{id:`b`,text:`The user's session cookie in localStorage.`,isCorrect:!1,explanation:`Session cookies belong in httpOnly headers, not state rollback logic.`},{id:`c`,text:`A screenshot of the browser DOM.`,isCorrect:!1,explanation:`Screenshots are unnecessary for state reconciliation.`}],explanation:`Preserve a rollback state snapshot to restore UI consistency on network failure.`},{id:`d7-qz3`,question:`Which Core Web Vital metric would be most damaged by un-virtualized infinite scroll lists?`,options:[{id:`a`,text:`INP (Interaction to Next Paint), due to main-thread blocking style recalculations on huge DOM trees.`,isCorrect:!0,explanation:`Tens of thousands of DOM elements cause severe style/layout calculation lag, spiking INP.`},{id:`b`,text:`FCP (First Contentful Paint), because initial paint requires scrolling.`,isCorrect:!1,explanation:`FCP only measures the very first pixel painted on page load.`},{id:`c`,text:`DNS lookup latency.`,isCorrect:!1,explanation:`DNS lookup occurs before any DOM is rendered.`}],explanation:`Bloated DOM trees trigger massive recalculate style costs, freezing user interaction responsiveness (INP).`}],exercise:{id:`coding-debounce`,title:`Timed Coding Challenge: Production Debounce with Cancel & Immediate`,track:`coding`,url:`/coding/coding-debounce`,description:"Under timed test conditions, implement a full-featured `debounce(fn, wait, options)` utility supporting delay timers, `cancel()`, `flush()`, and leading/trailing execution flags.",expectedOutcome:`Pass all test cases verifying exact wait delays, timer resets, and cancellation methods.`,complexityTip:`Store timer in a closure, clear prior timeout on new calls, and preserve this/arguments context.`,starterSnippet:`// Exercise: Production Debounce Utility
export function debounce(func, wait) {
  let timeoutId = null;

  function debounced(...args) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, wait);
  }

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}`,hints:[`Ensure debounced.cancel() clears the active timeoutId.`,`Use func.apply(this, args) to preserve correct execution context.`,`Verify that consecutive rapid calls delay execution until wait milliseconds of silence.`]}}];function c(e){return s.find(t=>t.day===e)}function l(e){return s.find(t=>t.id===e)}export{o as i,c as n,l as r,s as t};