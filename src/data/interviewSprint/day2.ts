import type { SprintDayLesson } from "./types";

export const day2Lesson: SprintDayLesson = {
  day: 2,
  id: "advanced-react-patterns",
  title: "Advanced React Patterns & State Architecture",
  tagline: "Custom hooks, component composition, nuanced memoization trade-offs, context splitting, portals, and error boundaries",
  estimatedMinutes: 80,
  objectives: [
    "Design composable custom hooks that encapsulate reactive state logic cleanly",
    "Evaluate the genuine performance trade-offs of useMemo, useCallback, and React.memo",
    "Mitigate React Context re-render thrashing through context splitting and selective subscriptions",
    "Implement accessible portals with proper keyboard focus trapping and ARIA attributes",
    "Construct resilient Error Boundaries and decouple server state from client UI state",
  ],
  beginnerOverview:
    "As React codebases grow, simplistic prop-passing breaks down. Advanced patterns like custom hooks, compound components, context splitting, and error boundaries allow engineers to build maintainable, resilient architectures that scale smoothly across teams.",
  deepDiveExplanation:
    "Senior React architecture is defined by how state and boundaries are organized. Prop drilling should be solved first with component composition (`children`) before reaching for global stores. When using React Context, understand that any context value reference change forces every consuming component to re-render, bypassing `React.memo`. Performance optimization requires knowing when NOT to memoize: `useCallback` and `useMemo` carry allocation overhead and dependency array comparison costs that frequently exceed the cost of re-rendering lightweight leaf components. For external server data, treating it as cached server state rather than client UI state prevents state desynchronization.",
  sections: [
    {
      id: "custom-hooks-architecture",
      heading: "1. Custom Hooks: Encapsulating Logic vs. Sharing State",
      content:
        "Custom hooks share *stateful logic*, not state instances. Every component calling `useDebounce()` receives its own completely independent state and effect instances.\n\nA great custom hook should:\n1. Adhere strictly to the Rules of Hooks.\n2. Accept options configurations with sensible defaults.\n3. Return stable references (memoized callbacks/handlers) to prevent cascading renders in consumers.",
      codeExample: {
        language: "typescript",
        caption: "Production-ready useDebounce hook with cancellation support",
        code: `import { useState, useEffect } from "react";

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
}`,
      },
      keyTakeaway:
        "Custom hooks create independent state per caller. Use custom hooks to abstract complex side effects, timers, or browser API subscriptions.",
    },
    {
      id: "memoization-tradeoffs",
      heading: "2. The Truth About Memoization (useMemo, useCallback, React.memo)",
      content:
        "In interviews, candidates often recommend wrapping every function in `useCallback` and every component in `React.memo`. This is a classic junior anti-pattern. Memoization is NOT free.\n\nEvery `useMemo` and `useCallback` requires:\n1. Memory allocation for closure function references.\n2. Array allocation for dependency lists.\n3. Comparison of every element in the dependency array on every single render pass.\n\nWhen TO memoize:\n- Passing callbacks to heavily optimized `React.memo` children where re-rendering is genuinely expensive (e.g. large tables, charts, interactive canvases).\n- Expensive computations (heavy regex, sorting 10,000 items, cryptographic hashing).\n- Values used in the dependency array of a `useEffect` to prevent infinite loops.\n\nWhen NOT to memoize:\n- Inline button click handlers passed to native DOM elements (`<button onClick={...}>`). Native DOM nodes cannot be skipped by React.memo!\n- Primitive numbers, strings, or booleans.",
      codeExample: {
        language: "typescript",
        caption: "Targeted memoization: when useCallback actually provides value",
        code: `// ✅ Meaningful: Child is wrapped in React.memo
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
}`,
      },
      keyTakeaway:
        "useCallback is only effective if the consumer is wrapped in React.memo or uses the callback in an effect dependency array. Otherwise, it wastes memory and CPU.",
    },
    {
      id: "context-splitting",
      heading: "3. Context Splitting & Preventing Cascading Re-renders",
      content:
        "When a React Context value updates, EVERY component calling `useContext(MyContext)` re-renders unconditionally. Even if a child only cares about `user.name`, updating `user.cartCount` will force that child to re-render.\n\nSenior Architecture Fix: Split Context into independent slices:\n1. State Context (holds read-only data).\n2. Dispatch Context (holds stable dispatch functions).\nBecause dispatch functions from `useReducer` never change identity, components that only trigger actions never re-render when state updates!",
      codeExample: {
        language: "typescript",
        caption: "Context Splitting: Separating State from Dispatch",
        code: `const ThemeStateContext = createContext<ThemeState | null>(null);
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
}`,
      },
      keyTakeaway:
        "Separate frequently changing state from stable dispatch functions to eliminate context re-render cascades.",
    },
    {
      id: "portals-and-modals",
      heading: "4. Portals & Modal Accessibility (A11y)",
      content:
        "`ReactDOM.createPortal` renders children into a distinct DOM node outside the parent DOM tree (e.g. `document.body`), avoiding CSS clipping from parent `overflow: hidden` or `z-index` stacking context traps.\n\nCrucial Interview Fact: Event bubbling still follows the *React component tree*, not the browser DOM tree! An event fired inside a portal bubbles up to the React parent component.\n\nAccessible Modal Checklist:\n- `role=\"dialog\"` and `aria-modal=\"true\"`.\n- `aria-labelledby` linked to the modal title.\n- Trap keyboard Tab focus inside the modal.\n- Close on Escape key press and backdrop click.\n- Restore focus to trigger element upon closing.",
      codeExample: {
        language: "typescript",
        caption: "Accessible Modal with Portal and Escape key listener",
        code: `import { createPortal } from "react-dom";
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
}`,
      },
      keyTakeaway:
        "Portals break free of CSS stacking contexts while preserving React's synthetic event bubbling tree.",
    },
    {
      id: "error-boundaries",
      heading: "5. Error Boundaries & Graceful Degradation",
      content:
        "Error Boundaries catch JavaScript errors during the Render phase, lifecycle methods, and constructors of their child component tree. They prevent an unhandled error in a single component from crashing the entire application into a white screen.\n\nImportant Limitation: Error boundaries do NOT catch:\n1. Errors inside event handlers (use standard try/catch).\n2. Asynchronous code (e.g. `setTimeout` or `requestAnimationFrame`).\n3. Server-Side Rendering (SSR) errors.\n4. Errors thrown in the Error Boundary itself.",
      codeExample: {
        language: "typescript",
        caption: "Class-based Error Boundary with reset capability",
        code: `import React, { Component, ErrorInfo, ReactNode } from "react";

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
}`,
      },
      keyTakeaway:
        "Isolate volatile features (e.g. third-party widgets, rich text editors) within their own localized Error Boundaries.",
    },
  ],
  misconceptions: [
    {
      myth: "Wrapping all component functions in React.memo makes the entire app faster.",
      reality:
        "React.memo performs shallow prop equality comparisons on every render. If props are objects or callbacks created without stable references, the shallow comparison always fails, adding CPU overhead before rendering anyway.",
    },
    {
      myth: "Events fired inside a React Portal only bubble to DOM parents.",
      reality:
        "React's synthetic event system bubbles events according to the React Virtual DOM hierarchy, not the browser DOM node placement.",
    },
    {
      myth: "Global state libraries like Redux or Zustand should store server API responses.",
      reality:
        "Server state is cached, remote, and asynchronous; client state is local, ephemeral, and synchronous. Storing server data in global stores leads to manual cache invalidation bugs. Prefer dedicated cache solutions (TanStack Query / SWR / RTK Query).",
    },
  ],
  realWorldScenario: {
    title: "High-Frequency Stock Ticker in a Global Context",
    problem:
      "A trading dashboard placed live stock quote prices in a root AppContext alongside user profile data and active tab selections. When prices ticked 10 times a second, the entire navigation bar, settings drawer, and user profile re-rendered constantly, freezing the main thread.",
    solution:
      "Implemented Context Splitting. Moved volatile streaming ticker quotes into a dedicated MarketDataContext and kept user auth/UI state in a separate static context. Utilized localized subscriptions with selectors so only the specific ticker row re-rendered on price fluctuations.",
  },
  questions: [
    {
      id: "d2-q1",
      question: "Explain the architectural trade-offs of memoization in React. When is useMemo harmful?",
      difficulty: "hard",
      answer:
        "Memoization introduces memory overhead (allocating closures, dependency arrays, and cache slots) and CPU overhead (shallowly comparing dependency array items on every single render). If the computation is trivial (e.g. string concatenation, simple object creation, or array filtering under 100 items), the cost of the dependency check exceeds the recalculation cost. Furthermore, if a dependency changes on every render (such as an unmemoized object prop), useMemo runs on every render regardless, creating pure overhead.",
      explanation:
        "Senior candidates know that premature memoization clutters code and degrades performance. Memoize only when measuring a bottleneck or maintaining referential stability for downstream React.memo/effects.",
      interviewTrap:
        "Don't claim memoization is a free performance win. Always mention dependency comparison costs and cache memory overhead.",
    },
    {
      id: "d2-q2",
      question: "How do React Portals work with event bubbling?",
      difficulty: "medium",
      answer:
        "Although a Portal mounts DOM elements in a completely separate DOM hierarchy (e.g., at `document.body`), React's synthetic event system dispatches events along the React component tree. This means an `onClick` originating inside a child modal rendered via a portal will bubble up and trigger an `onClick` handler on its React parent component, even though the DOM nodes are unrelated in the browser DOM tree.",
      explanation:
        "Interviewers test this to check if you understand React's SyntheticEvent abstraction versus native browser event dispatching.",
      interviewTrap:
        "Thinking portal events can only be captured via native `addEventListener` on the portal container.",
    },
    {
      id: "d2-q3",
      question: "Why can't an Error Boundary catch errors inside an onClick handler, and how do you handle them?",
      difficulty: "medium",
      answer:
        "Error Boundaries only intercept errors thrown during the Render phase, lifecycle methods, and constructors while React is actively building the UI. Event handlers run asynchronously after the render cycle completes in response to user events. Because an event handler error does not corrupt the React rendering tree, React does not need an Error Boundary to recover. To handle event handler errors, use standard `try/catch` blocks inside the handler.",
      explanation:
        "Clarifying when React renders vs when events fire is a core frontend competency.",
      interviewTrap:
        "Saying that Error Boundaries catch all JavaScript errors anywhere in the application.",
    },
    {
      id: "d2-q4",
      question: "What is context re-render thrashing and how do you solve it?",
      difficulty: "hard",
      answer:
        "Context re-render thrashing occurs when a context provider passes an object whose reference changes on every render (e.g. `value={{ user, logout }}`). Every component calling `useContext` will re-render, even if the specific property it reads did not change, completely bypassing `React.memo` on those components. Solutions include: 1) Memoizing the context value with `useMemo`, 2) Context splitting (separating fast-updating state from slow-updating state, and state from dispatch), and 3) Using component composition where children are passed as `children` prop.",
      explanation:
        "Demonstrates architectural capability to design performant global state without third-party libraries.",
      interviewTrap:
        "Assuming `React.memo` will stop a child component from re-rendering when the context it consumes changes.",
    },
  ],
  quiz: [
    {
      id: "d2-qz1",
      question: "When does useCallback provide a genuine performance benefit?",
      options: [
        {
          id: "a",
          text: "Whenever passing a click handler to a native `<button>` element.",
          isCorrect: false,
          explanation: "Native HTML elements cannot be memoized; useCallback here only adds comparison overhead.",
        },
        {
          id: "b",
          text: "When passing the callback to a child component wrapped in React.memo or as a dependency of an effect.",
          isCorrect: true,
          explanation: "Preserving referential identity prevents React.memo from re-rendering the child.",
        },
        {
          id: "c",
          text: "It compiles the JavaScript function to WebAssembly for faster execution.",
          isCorrect: false,
          explanation: "useCallback does not compile to WebAssembly.",
        },
      ],
      explanation: "useCallback is designed specifically to maintain referential equality across render cycles for memoized children or effect dependencies.",
    },
    {
      id: "d2-qz2",
      question: "Which of the following errors CANNOT be caught by a React Error Boundary?",
      options: [
        {
          id: "a",
          text: "An error thrown inside a child component's render function.",
          isCorrect: false,
          explanation: "Render phase errors are the primary target of Error Boundaries.",
        },
        {
          id: "b",
          text: "An unhandled promise rejection inside an asynchronous fetch call within a button's onClick.",
          isCorrect: true,
          explanation: "Error Boundaries do not catch errors inside async callbacks or event handlers.",
        },
        {
          id: "c",
          text: "An error inside a child component's useLayoutEffect.",
          isCorrect: false,
          explanation: "Lifecycle and layout effect errors during commit are intercepted.",
        },
      ],
      explanation: "Error boundaries catch errors during rendering, lifecycles, and constructors—not in event handlers or async timers.",
    },
    {
      id: "d2-qz3",
      question: "Why should frequently changing state and stable dispatch functions be separated into two distinct contexts?",
      options: [
        {
          id: "a",
          text: "Because React only allows primitive values in a single Context.",
          isCorrect: false,
          explanation: "Context accepts any JavaScript value.",
        },
        {
          id: "b",
          text: "So that components only needing to dispatch actions never re-render when the state value changes.",
          isCorrect: true,
          explanation: "Stable dispatch references never trigger re-renders in dispatch-only consumers.",
        },
        {
          id: "c",
          text: "It is required by TypeScript to satisfy compiler safety.",
          isCorrect: false,
          explanation: "Context splitting is a performance architectural pattern, not a TypeScript requirement.",
        },
      ],
      explanation: "Context splitting prevents unnecessary re-renders in components that dispatch events but do not render state.",
    },
  ],
  exercise: {
    id: "mc-debounced-search",
    title: "Reusable useDebounce Hook & Keyboard-Accessible Modal",
    track: "machineCoding",
    url: "/machine-coding/debounced-search",
    description:
      "Construct a production-grade debounced search input with immediate local typing, debounced network query simulation, and a keyboard-accessible detail modal with Escape-to-close and focus retention.",
    expectedOutcome:
      "Zero typing lag, debounced query execution after 300ms pause, and fully accessible dialog modal mounted via createPortal.",
    complexityTip:
      "Ensure the modal listener cleans up keydown event listeners on unmount to avoid memory leaks.",
    starterSnippet: `// Exercise: Debounced Search & Modal
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
}`,
    hints: [
      "Return a cleanup function from the useDebounce effect that invokes clearTimeout.",
      "In the modal, stop click propagation on the dialog card so clicking inside does not trigger backdrop onClose.",
      "Use createPortal with document.body to prevent parent overflow clipping.",
    ],
  },
};
