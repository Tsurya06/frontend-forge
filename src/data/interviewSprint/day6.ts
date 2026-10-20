import type { SprintDayLesson } from "./types";

export const day6Lesson: SprintDayLesson = {
  day: 6,
  id: "testing-machine-coding-microfrontends",
  title: "Testing Mastery, Machine Coding & Microfrontends",
  tagline: "React Testing Library philosophy, async queries, accessible autocomplete machine coding, and pragmatic Microfrontend architecture",
  estimatedMinutes: 80,
  objectives: [
    "Apply React Testing Library's core philosophy: test user behavior rather than internal implementation details",
    "Master RTL query priority (`getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByTestId`)",
    "Debug asynchronous test timing using `findBy*`, `waitFor()`, and eliminate artificial `act()` warnings",
    "Implement production-grade machine coding components: keyboard accessible autocomplete with ARIA combobox",
    "Evaluate Microfrontend trade-offs: Module Federation, shared dependencies, and when to reject microfrontends",
  ],
  beginnerOverview:
    "Writing reliable tests gives you the confidence to refactor without fear. Paired with strong machine coding execution and understanding modern distributed architectures (like microfrontends), this represents the ultimate technical hurdle in senior frontend hiring loops.",
  deepDiveExplanation:
    "React Testing Library enforces the golden rule: 'The more your tests resemble the way your software is used, the more confidence they can give you.' Tests should never inspect component state, private methods, or child component internals. Instead, query elements via accessible roles (`getByRole('button', { name: /submit/i })`) and user events via `@testing-library/user-event`. For complex Machine Coding interviews (such as typeahead autocomplete), interviewers evaluate state management, keyboard navigation (ArrowDown, ArrowUp, Enter, Escape), ARIA combobox attributes (`aria-expanded`, `aria-activedescendant`), loading/error/empty edge cases, and debounce hygiene. Finally, microfrontend architectures via Webpack 5 Module Federation allow independent deployments across large cross-functional teams, but introduce runtime dependency synchronization risks, CSS clashes, and bundle duplication that are toxic for small-to-mid engineering teams.",
  sections: [
    {
      id: "rtl-philosophy-query-priority",
      heading: "1. React Testing Library: Philosophy & Query Priority",
      content:
        "The golden rule of RTL: Do NOT test implementation details. Never assert on `wrapper.state()` or check if a internal method was called. If you refactor your component from `useState` to `useReducer`, zero tests should break as long as the user sees the same output.\n\nQuery Priority Hierarchy (from most preferred to least preferred):\n1. **`getByRole`**: The gold standard. Queries by accessible semantic role (`button`, `heading`, `textbox`, `combobox`) and accessible name.\n2. **`getByLabelText`**: Excellent for form fields linked with `<label>`.\n3. **`getByPlaceholderText`**: Acceptable fallback when no label exists.\n4. **`getByText`**: For non-interactive text content.\n5. **`getByTestId`**: Absolute last resort when semantic roles do not exist.",
      codeExample: {
        language: "tsx",
        caption: "Idiomatic RTL test simulating authentic user interactions",
        code: `import { render, screen } from "@testing-library/react";
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
});`,
      },
      keyTakeaway:
        "Always query with `getByRole` first. Test what the user sees and interacts with, never internal state.",
    },
    {
      id: "async-testing-timing",
      heading: "2. Async Testing: `findBy*`, `waitFor()`, and Act Warnings",
      content:
        "RTL provides three query variations:\n- **`getBy*`**: Synchronous. Throws immediately if element not found. Use for elements that should already exist.\n- **`queryBy*`**: Synchronous. Returns `null` if element not found. Use ONLY to assert element does NOT exist (`expect(screen.queryByText('Error')).not.toBeInTheDocument()`).\n- **`findBy*`**: Asynchronous. Returns a promise that polls the DOM with `waitFor` until the element appears (timeout 1000ms). Use for async data loading!\n\nFixing 'not wrapped in act(...)' warnings: This happens when state updates occur outside RTL's tracked event loop (e.g., an un-awaited promise resolves after test finishes). Always `await` async user interactions and await `findBy*` queries.",
      codeExample: {
        language: "tsx",
        caption: "Testing asynchronous data loading cleanly without act warnings",
        code: `test("displays user profile after successful API fetch", async () => {
  render(<UserProfile userId="u-123" />);

  // Assert loading spinner exists initially
  expect(screen.getByRole("status")).toHaveTextContent(/loading/i);

  // Await the arrival of the heading after async fetch resolves!
  // findByRole automatically wraps polling inside act()
  const heading = await screen.findByRole("heading", { name: /alex turner/i });
  expect(heading).toBeInTheDocument();

  // Assert loading spinner was removed
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});`,
      },
      keyTakeaway:
        "Use `findBy*` for async elements; use `queryBy*` for checking absence. Never wrap tests in manual `act()` calls when using userEvent.",
    },
    {
      id: "machine-coding-autocomplete",
      heading: "3. Machine Coding: Anatomy of a Flawless Autocomplete",
      content:
        "Typeahead Autocomplete is the #1 most frequent machine coding task across Google, Meta, and Uber. Interviewers look for these specific criteria:\n\n1. **Debounced input**: Never hit the network on every single keystroke (300ms debounce).\n2. **State Machine**: Handle `idle`, `loading`, `success`, `empty` (0 results), and `error` states.\n3. **Keyboard Accessibility**:\n   - `ArrowDown`: Moves active highlight down (cycles to 0).\n   - `ArrowUp`: Moves active highlight up (cycles to end).\n   - `Enter`: Selects currently highlighted item.\n   - `Escape`: Closes dropdown and clears active focus.\n4. **ARIA Combobox**:\n   - Input has `role=\"combobox\"`, `aria-expanded={isOpen}`, `aria-autocomplete=\"list\"`.\n   - Dropdown list has `role=\"listbox\"`.\n   - Each item has `role=\"option\"` and `aria-selected={isActive}`.\n   - Input has `aria-activedescendant=\"option-item-id\"` pointing to current active item.",
      codeExample: {
        language: "tsx",
        caption: "Keyboard navigation handler for Autocomplete component",
        code: `const handleKeyDown = (e: React.KeyboardEvent) => {
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
};`,
      },
      keyTakeaway:
        "Machine coding success requires: clean debounce, robust keyboard navigation (Arrow keys + Enter + Escape), and correct ARIA combobox attributes.",
    },
    {
      id: "microfrontends-module-federation",
      heading: "4. Microfrontends & Module Federation: Reality vs. Hype",
      content:
        "Microfrontends decompose a monolithic frontend into independently deployable applications owned by autonomous domain teams.\n\nModule Federation (Webpack 5 / Vite Plugin):\n- Allows a **Host Application** (shell) to dynamically import JavaScript chunks from a **Remote Application** at runtime over HTTP without build-time coupling.\n- Shared Dependencies: Configure `shared: { react: { singleton: true, requiredVersion: '...' } }` so both applications share a single instance of React in memory, preventing dual-React hook errors.\n\n**When Microfrontends are Justified**:\n- 100+ engineers across multiple autonomous squads with different release cadences where a single monolithic build pipeline creates bottleneck deployments.\n\n**When Microfrontends are an Anti-Pattern**:\n- Small-to-mid teams (<30 engineers). Microfrontends drastically increase bundle sizes (duplicate vendor libraries), introduce CSS style pollution, make end-to-end integration testing difficult, and break local developer developer ergonomics.",
      keyTakeaway:
        "Microfrontends solve organizational scaling problems for 100+ engineer teams. For 95% of applications, a modular monorepo (Turborepo/Nx) is vastly superior.",
    },
  ],
  misconceptions: [
    {
      myth: "You should achieve 100% test coverage by asserting on component state and props.",
      reality:
        "Testing state and props couples your tests to implementation details. When you refactor, tests break despite identical user behavior. Test outcomes and accessible UI, not state variables.",
    },
    {
      myth: "Microfrontends make every web application faster and easier to build.",
      reality:
        "Microfrontends almost always degrade end-user performance due to duplicated runtime overhead and independent network asset waterfalls. They exist to solve organizational team coordination, not runtime performance.",
    },
  ],
  realWorldScenario: {
    title: "Broken Autocomplete Screen Reader Compliance",
    problem:
      "A banking portal had an autocomplete dropdown built using simple `<div>` tags and CSS highlights. Blind users using VoiceOver were completely unaware that suggestions had appeared on screen and could not select options with Arrow keys.",
    solution:
      "Re-architected the component to follow the W3C ARIA 1.2 Combobox pattern: added `role=\"combobox\"`, `aria-expanded`, `aria-autocomplete=\"list\"`, and dynamic `aria-activedescendant`. Screen readers announced matching result counts in real time and voiced each option as users navigated with arrow keys.",
  },
  questions: [
    {
      id: "d6-q1",
      question: "What is the core philosophy of React Testing Library, and what is its query priority order?",
      difficulty: "medium",
      answer:
        "The core philosophy of RTL is: 'Test your software the way real users use it.' Tests should interact with components via accessible DOM elements and user events, completely ignoring internal state, methods, and component instances.\n\nQuery Priority Order:\n1. `getByRole`: Accessible roles (`button`, `heading`, `combobox`) + accessible name (`{ name: /save/i }`).\n2. `getByLabelText`: Form controls linked with labels.\n3. `getByPlaceholderText`: Input placeholders.\n4. `getByText`: Static non-interactive text elements.\n5. `getByTestId`: Last resort when no accessible role or text is feasible.",
      explanation:
        "Demonstrates deep alignment with modern frontend testing standards and accessibility-first thinking.",
      interviewTrap:
        "Listing `getByTestId` as the top priority. Test IDs ignore accessibility and give false confidence.",
    },
    {
      id: "d6-q2",
      question: "How do you handle and debug the dreaded 'Warning: An update to Component inside a test was not wrapped in act(...)'?",
      difficulty: "hard",
      answer:
        "An `act()` warning indicates that an asynchronous state update occurred in the component *after* React Testing Library finished its synchronous test execution frame. This typically happens because: 1) An unawaited promise resolved after the test ended, 2) A timer (setTimeout) fired without being awaited, or 3) A userEvent action was not properly awaited. To fix it: Always use `@testing-library/user-event` with `await user.click(...)`, use `await screen.findBy*` to wait for DOM updates caused by async promises, and ensure all useEffect subscriptions are awaited before the test exits.",
      explanation:
        "Every experienced frontend developer encounters this warning; knowing why it occurs and how to fix it without wrapping code in arbitrary `act()` wrappers is a huge differentiator.",
      interviewTrap:
        "Wrapping your entire test in manual `act(() => ...)` calls. That masks the root timing bug rather than solving it.",
    },
    {
      id: "d6-q3",
      question: "What are the essential requirements for an accessible typeahead autocomplete component?",
      difficulty: "hard",
      answer:
        "1. Semantic ARIA Combobox Pattern: Input must have `role=\"combobox\"`, `aria-expanded={isOpen}`, `aria-autocomplete=\"list\"`, `aria-controls=\"listbox-id\"`, and `aria-activedescendant=\"active-option-id\"`.\n2. Listbox Container: Dropdown must have `id=\"listbox-id\"` and `role=\"listbox\"`.\n3. Options: Each suggestion must have `role=\"option\"` and `aria-selected={isSelected}`.\n4. Keyboard Navigation: ArrowDown/ArrowUp to cycle active items, Enter to select, Escape to close, and Tab to blur and close.\n5. Debounce & State Management: Network calls debounced by ~300ms, with dedicated UI states for loading, empty results, and error recovery.",
      explanation:
        "This is the complete evaluation rubric used by interviewers for senior UI component tasks.",
      interviewTrap:
        "Building an autocomplete that only works with mouse clicks and has no keyboard or ARIA support.",
    },
    {
      id: "d6-q4",
      question: "When are Microfrontends justified, and what are their architectural drawbacks?",
      difficulty: "medium",
      answer:
        "Microfrontends are justified in large organizations (typically 100+ engineers) where independent squads need to develop, test, and deploy their portions of the application without being blocked by a shared monolithic release pipeline. Architectural drawbacks include: 1) Performance degradation due to duplicate vendor bundles and waterfall asset loading, 2) Complex shared dependency management (e.g. ensuring multiple React versions don't crash), 3) Global CSS style bleed, 4) Difficult cross-app state sharing, and 5) Frustrating local developer ergonomics. For most applications, a modular monorepo is far more efficient.",
      explanation:
        "Shows architectural maturity by acknowledging that microfrontends are an organizational solution, not a technical performance upgrade.",
      interviewTrap:
        "Claiming microfrontends make apps faster. They almost always make runtime performance worse.",
    },
  ],
  quiz: [
    {
      id: "d6-qz1",
      question: "Which React Testing Library query should you prefer above all others to find an interactive button?",
      options: [
        {
          id: "a",
          text: "screen.getByRole('button', { name: /save/i })",
          isCorrect: true,
          explanation: "getByRole tests both the semantic accessibility role and visible accessible name.",
        },
        {
          id: "b",
          text: "screen.getByTestId('save-button')",
          isCorrect: false,
          explanation: "Test IDs are the lowest priority fallback in RTL.",
        },
        {
          id: "c",
          text: "container.querySelector('.btn-primary')",
          isCorrect: false,
          explanation: "Querying by CSS class couples tests directly to styling implementation details.",
        },
      ],
      explanation: "getByRole is the highest priority query in React Testing Library.",
    },
    {
      id: "d6-qz2",
      question: "Which query type should you use to assert that a loading spinner is NOT present in the DOM?",
      options: [
        {
          id: "a",
          text: "screen.queryByRole('status')",
          isCorrect: true,
          explanation: "queryBy* returns null when an element is absent, allowing expect(...).not.toBeInTheDocument() without throwing.",
        },
        {
          id: "b",
          text: "screen.getByRole('status')",
          isCorrect: false,
          explanation: "getBy* throws an immediate exception if the element does not exist.",
        },
        {
          id: "c",
          text: "await screen.findByRole('status')",
          isCorrect: false,
          explanation: "findBy* polls until timeout and throws if not found.",
        },
      ],
      explanation: "Use queryBy* for checking the non-existence of elements.",
    },
    {
      id: "d6-qz3",
      question: "In Webpack 5 Module Federation, what does configuring `singleton: true` on shared React do?",
      options: [
        {
          id: "a",
          text: "It guarantees that only one shared instance of React is loaded in browser memory across host and remotes.",
          isCorrect: true,
          explanation: "Singletons prevent the duplicate React instance bug where hooks throw invalid dispatcher errors.",
        },
        {
          id: "b",
          text: "It converts React components into single-page HTML strings.",
          isCorrect: false,
          explanation: "Singletons relate to module sharing in memory, not HTML serialization.",
        },
        {
          id: "c",
          text: "It forces all components to render on a single thread in Web Workers.",
          isCorrect: false,
          explanation: "Module federation does not use web workers for singletons.",
        },
      ],
      explanation: "singleton: true prevents multiple copies of libraries with global state (like React) from running simultaneously.",
    },
  ],
  exercise: {
    id: "mc-api-autocomplete",
    title: "Accessible API Autocomplete with Keyboard Navigation",
    track: "machineCoding",
    url: "/machine-coding/api-autocomplete",
    description:
      "Build a complete typeahead autocomplete component featuring 300ms query debouncing, mock API response caching, loading indicators, empty states, keyboard arrow navigation, and Enter/Escape key selection.",
    expectedOutcome:
      "Fully accessible ARIA combobox pattern with keyboard navigation, instant debounce cancellation, and selection callback invocation.",
    complexityTip:
      "Remember to prevent default browser page scrolling on ArrowUp and ArrowDown inside the input handler.",
    starterSnippet: `// Exercise: Accessible Autocomplete
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
}`,
    hints: [
      "Use modulo arithmetic for Arrow navigation to wrap cleanly from start to end.",
      "Clear active index back to -1 when the user types a new character.",
      "Ensure dropdown closes and active index resets on Escape key press.",
    ],
  },
};
