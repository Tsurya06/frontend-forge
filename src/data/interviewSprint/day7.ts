import type { SprintDayLesson } from "./types";

export interface MockScenario {
  id: string;
  category: "coding" | "system-design" | "performance" | "testing-a11y" | "tradeoffs";
  title: string;
  scenario: string;
  prompt: string;
  expectedKeyPoints: string[];
  sampleStrongAnswer: string;
  difficulty: "medium" | "hard";
}

export const day7MockScenarios: MockScenario[] = [
  {
    id: "sc-sys-design",
    category: "system-design",
    title: "Scenario 1: Infinite Social Feed with Real-Time Updates",
    scenario:
      "You are designing the web feed for a high-traffic social media platform (similar to LinkedIn or Twitter/X). The feed supports infinite scrolling with media (images/videos), optimistic reactions (likes/reposts), and live notification banners indicating '5 new posts available'.",
    prompt:
      "Explain your architectural design covering: component tree boundaries, data fetching & virtualization, optimistic UI updates, WebSocket/SSE connection management, and memory leak prevention for long sessions.",
    expectedKeyPoints: [
      "Virtualization (windowing) to cap DOM node count below 50 nodes even when scrolling 10,000 items.",
      "Buffer pool pagination with cursor-based API (`next_cursor`) instead of offset-based pagination.",
      "Optimistic mutation updates: immediately increment like count, dispatch network request, and rollback on error.",
      "Server-Sent Events (SSE) or WebSockets for live post notification banner without interrupting active scroll position.",
      "Memory capping: Evacuate distant offscreen image textures and detach unused event listeners.",
    ],
    sampleStrongAnswer:
      "I would structure this feed with three core layers: 1) Data & Network Layer: Use cursor-based pagination with a TanStack Query infinite cache. Maintain an in-memory queue for incoming real-time SSE updates. Rather than prepending new posts directly into the active feed (which causes jarring scroll jumping), display a floating 'N new posts' pill at the top of the viewport. 2) Rendering Layer: Implement list virtualization with dynamic row height estimation. 3) Mutation Layer: Optimistically toggle likes with a rollback snapshot in case the network fails. 4) Memory Management: Detach HTML5 video players from DOM when scrolled out of view and enforce a sliding window buffer of 200 items in memory to prevent browser tab bloat.",
    difficulty: "hard",
  },
  {
    id: "sc-perf-debug",
    category: "performance",
    title: "Scenario 2: Diagnosing 650ms INP on a Filter Drawer",
    scenario:
      "Production RUM data indicates that opening a sidebar filter drawer on your e-commerce search results page has an INP of 650ms ('Poor') on mobile devices. Desktop works with acceptable latency.",
    prompt:
      "Walk the interviewer step-by-step through how you reproduce, profile, pinpoint the root cause, and implement the fix for this performance degradation.",
    expectedKeyPoints: [
      "Reproduce in Chrome DevTools using 4x/6x CPU Throttling on mobile viewport.",
      "Record a Performance profile and inspect the Main thread flamegraph for Long Tasks (>50ms).",
      "Check for forced synchronous layouts (Layout Thrashing) where DOM reads and writes alternate.",
      "Inspect if the drawer animation uses layout-triggering properties (`width`, `left`) instead of GPU-accelerated `transform: translateX()`.",
      "Check if opening the drawer forces an unnecessary re-render of the entire 100-item product list behind it.",
    ],
    sampleStrongAnswer:
      "First, I reproduce the issue in Chrome DevTools by setting CPU Throttling to 4x slowdown and enabling mobile viewport emulation. I record a trace while clicking the filter button and examine the interaction timeline. I look for: 1) Animation mechanism: If the drawer transitions `left: 0`, I replace it with `transform: translateX(0)` to offload animation to the GPU Compositor thread. 2) Re-render cascading: I check the React DevTools Profiler to see if opening the drawer updates a shared parent state that causes all 100 product cards to re-render. If so, I isolate the drawer state or wrap the product list in React.memo. 3) Recalculate Styles: Ensure no synchronous DOM measurements (`element.offsetHeight`) occur during the toggle handler.",
    difficulty: "hard",
  },
  {
    id: "sc-testing-a11y",
    category: "testing-a11y",
    title: "Scenario 3: Accessible Custom Multi-Select Dropdown with RTL Tests",
    scenario:
      "Your team built a custom multi-select tag picker. A user audit found that keyboard users cannot navigate options, and automated tests only check whether a CSS class `.tag-selected` exists.",
    prompt:
      "Describe the ARIA attributes, keyboard interaction model, and the React Testing Library test cases you would write to test user behavior rather than implementation details.",
    expectedKeyPoints: [
      "WAI-ARIA Combobox / Listbox multi-select pattern: `role=\"combobox\"`, `aria-multiselectable=\"true\"`, `role=\"option\"` with `aria-selected`.",
      "Keyboard controls: ArrowDown/ArrowUp to highlight, Space/Enter to toggle selection, Backspace to delete previous tag.",
      "RTL test: Query by `screen.getByRole('combobox')`, type with `userEvent.type`, select options with `userEvent.click` or keyboard.",
      "Assert on visible selected tags with `screen.getByRole('button', { name: /remove react/i })` rather than inspecting CSS class names.",
    ],
    sampleStrongAnswer:
      "For accessibility, the trigger input uses `role=\"combobox\"` with `aria-expanded` and `aria-haspopup=\"listbox\"`. The popup list uses `role=\"listbox\"` with `aria-multiselectable=\"true\"`, and each option has `role=\"option\"` and `aria-selected`. Keyboard navigation supports ArrowDown/Up, Space/Enter to toggle, and Escape to dismiss. For RTL testing, I write tests simulating real user behavior: 1) User clicks combobox, 2) User presses ArrowDown and Enter, 3) Verify the tag appears by asserting `expect(screen.getByRole('button', { name: /remove typescript/i })).toBeInTheDocument()`. I never assert on `.tag-selected` CSS classes.",
    difficulty: "medium",
  },
  {
    id: "sc-tradeoffs",
    category: "tradeoffs",
    title: "Scenario 4: Technical Debt & Architectural Past Decisions",
    scenario:
      "An interviewer asks: 'Tell me about a time you had to make a difficult technical trade-off or compromise on a frontend project. What did you choose and what were the consequences?'",
    prompt:
      "Structure a compelling, honest senior-level response using the STAR format (Situation, Task, Action, Result) focusing on architectural trade-offs.",
    expectedKeyPoints: [
      "Clear context and business constraints (e.g. deadline vs technical purity).",
      "Evaluation of multiple candidate options (Option A vs Option B with pros and cons).",
      "Deliberate decision-making criteria (e.g. optimizing for time-to-market while creating an explicit tech debt tracker).",
      "Measuring outcome and follow-up remediation.",
    ],
    sampleStrongAnswer:
      "On a prior project, we needed to roll out a complex analytics dashboard within a tight 3-week enterprise deadline. The ideal architecture was a normalized TanStack Query cache with custom graph rendering. However, learning curves and migration time would have caused a 3-week delay. I made the deliberate decision to adopt a lightweight charting library with centralized Context, accepting the trade-off of higher memory usage for un-virtualized graphs. To mitigate this risk, I created an explicit technical debt ticket with performance budgets (bundle size <250KB, max data points capped at 500). We hit the client launch on time, and during the subsequent quarter, refactored to the normalized cache once user feedback proved the feature's business value.",
    difficulty: "medium",
  },
];

export const day7Lesson: SprintDayLesson = {
  day: 7,
  id: "mock-interview-consolidation",
  title: "Capstone Assessment, System Design & Final Mastery",
  tagline: "Comprehensive 45-minute timed capstone assessment, frontend system design, performance troubleshooting, and the ultimate technical readiness checklist",
  estimatedMinutes: 90,
  objectives: [
    "Execute a simulated 45-minute frontend technical capstone assessment covering Days 1 through 6",
    "Structure large-scale Frontend System Design answers (Virtualization, SSE, Optimistic UI, Caching)",
    "Troubleshoot real-world Core Web Vitals production performance degradation under time constraints",
    "Articulate engineering trade-offs, past project decisions, and technical debt management using the STAR model",
    "Complete the final technical readiness checklist and review flagged revision topics",
  ],
  beginnerOverview:
    "The final day consolidates your knowledge into senior-level engineering execution. Senior frontend engineering evaluates not just whether you know the answers, but how clearly you communicate, how you structure trade-offs, and how calmly you troubleshoot ambiguous production requirements.",
  deepDiveExplanation:
    "A complete frontend architecture evaluation typically consists of four components: 1) JavaScript fundamentals & React rendering internals, 2) Hands-on machine coding with live test cases, 3) Frontend System Design (scaling component trees, state caching, and network resilience), and 4) Architectural trade-offs. Performing under timed pressure requires having standardized mental frameworks: always clarify requirements upfront, state assumptions explicitly, analyze edge cases (empty states, errors, accessibility), and evaluate trade-offs rather than jumping into code prematurely.",
  sections: [
    {
      id: "interview-mental-frameworks",
      heading: "1. The 4-Step Technical Engineering Framework",
      content:
        "When presented with any complex coding or architecture challenge, never start typing immediately. Follow this 4-step framework:\n\n1. **Clarify (2-3 mins)**: Confirm input constraints, edge cases (empty states, large inputs, localization, mobile viewports), and authentication expectations.\n2. **High-Level Architecture (5 mins)**: Outline component boundaries, state ownership (local vs global vs server), and API contracts before implementation.\n3. **Iterative Implementation (25 mins)**: Build the happy path first, followed by error states, loading skeletons, and keyboard accessibility.\n4. **Verification & Edge Cases (5 mins)**: Walk through test inputs, state time/space complexity, and identify follow-up optimizations (virtualization, caching).",
      keyTakeaway:
        "Clarify requirements first, outline component hierarchy second, code cleanly third, and review edge cases fourth.",
    },
    {
      id: "system-design-rubric",
      heading: "2. The Frontend System Design Blueprint",
      content:
        "Frontend System Design questions test your ability to build web applications at enterprise scale. Use the RADIO framework:\n\n- **R** - Requirements: Functional (what features) & Non-functional (perf, latency, a11y, devices).\n- **A** - Architecture: High-level component tree and module boundaries.\n- **D** - Data Model & API: REST vs GraphQL, schema payloads, pagination (cursor vs offset), state management.\n- **I** - Interface & UX: Skeletons, optimistic updates, offline mode, empty states.\n- **O** - Optimization & Security: Virtualization, code splitting, asset caching, XSS/CSRF protections.",
      keyTakeaway:
        "Use the RADIO framework to keep frontend system design discussions structured and thorough.",
    },
    {
      id: "final-revision-checklist",
      heading: "3. 10-Point Technical Mastery Checklist",
      content:
        "Verify you can explain each of these points in under 60 seconds:\n\n1. React Render vs Commit phase and why functions must remain pure.\n2. Stale closures, functional state updates, and effect dependency arrays.\n3. Exact Core Web Vitals thresholds: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.\n4. JavaScript Event Loop: Call stack, Microtasks (Promise), and Macrotasks (setTimeout).\n5. CSS Reflow vs Repaint vs Compositing (`transform` and `opacity` GPU acceleration).\n6. Vite unbundled ESM dev server vs Webpack bundle overhead.\n7. Dual-Token JWT pattern: Memory access token + httpOnly refresh cookie.\n8. AbortController request cancellation to eliminate search race conditions.\n9. React Testing Library query priority: `getByRole` over all else.\n10. Microfrontend trade-offs and Module Federation singletons.",
      keyTakeaway:
        "Review these 10 core concepts to solidify your senior frontend engineering foundation.",
    },
  ],
  misconceptions: [
    {
      myth: "In machine coding interviews, the candidate who finishes first gets the best score.",
      reality:
        "Interviewers grade code readability, component architecture, keyboard accessibility, edge case handling, and communication far higher than raw typing speed.",
    },
    {
      myth: "You should never admit you don't know something in an interview.",
      reality:
        "Making up false facts is an immediate disqualifier. Senior engineers say: 'I haven't used that specific API in production, but based on how similar browser APIs operate, here is how I would approach it...'",
    },
  ],
  realWorldScenario: {
    title: "Senior Engineering Hiring Loop Debrief",
    problem:
      "A candidate successfully coded an autocomplete component in 15 minutes, but failed the interview. The debrief revealed: zero keyboard accessibility, no debounce on network requests, array indices used as React keys, and complete silence throughout the coding phase.",
    solution:
      "A second candidate took 25 minutes, but proactively communicated trade-offs, added ARIA combobox attributes, handled error and empty states, and explained how they would optimize with virtualization at scale. The second candidate received a Strong Hire recommendation.",
  },
  questions: [
    {
      id: "d7-q1",
      question: "How do you handle a situation where an interviewer gives you ambiguous or incomplete requirements?",
      difficulty: "medium",
      answer:
        "Ambiguity is intentional. Senior candidates do not assume answers; they ask clarifying questions. I start by confirming: 1) Who are the target users and devices (mobile vs desktop)? 2) What are the data volumes (10 items vs 100,000 items)? 3) How should error and offline states behave? 4) What is the MVP scope versus 'nice-to-have' extensions? Asking these questions demonstrates leadership and prevents wasted engineering effort.",
      explanation:
        "Shows product maturity and communication acumen.",
      interviewTrap:
        "Immediately coding based on your own unverified assumptions.",
    },
    {
      id: "d7-q2",
      question: "How do you optimize an application for low-bandwidth, high-latency mobile networks in emerging markets?",
      difficulty: "hard",
      answer:
        "1) Aggressive Code Splitting: Split routes with React.lazy and dynamically import heavy libraries (e.g. chart engines or date formatters). 2) Image Optimization: Use modern formats (AVIF/WebP) with `srcset` and `sizes`, responsive sizing, and lazy loading. 3) Modern Build: Ship modern ES2020+ code to eliminate transpiled polyfill bloat. 4) Caching & Service Workers: Implement Workbox service worker caching for offline shell capability. 5) Network Resiliency: Use exponential backoff retries with AbortController cancellation for flaky connections. 6) Lightweight Alternatives: Replace bulky packages (e.g. date-fns instead of moment.js, preact/signals where appropriate).",
      explanation:
        "A classic system design and performance question for global-scale products.",
      interviewTrap:
        "Focusing only on code splitting and forgetting image payloads, which typically account for 70%+ of total page weight.",
    },
    {
      id: "d7-q3",
      question: "What is your approach to technical debt in a fast-moving engineering team?",
      difficulty: "medium",
      answer:
        "I view technical debt as financial debt: taking on debt intentionally to hit a critical market milestone is acceptable, but unmanaged debt will bankrupt the team in interest (bug regressions, slowed velocity, developer attrition). I manage it by: 1) Making debt visible: document shortcuts in tickets with quantifiable impact. 2) The Boy Scout Rule: leave code cleaner than you found it during routine feature work. 3) Dedicating 15-20% of every sprint cycle to technical health, refactoring, and automated test coverage.",
      explanation:
        "Demonstrates pragmatic engineering leadership.",
      interviewTrap:
        "Demanding that all feature development stop for 3 months for a complete rewrite. Complete rewrites almost always fail.",
    },
    {
      id: "d7-q4",
      question: "Explain how you would design an optimistic UI update with rollback capability.",
      difficulty: "medium",
      answer:
        "An optimistic update updates the client UI immediately before the server response arrives, giving the user a 0ms instantaneous experience. The pattern: 1) Save a snapshot of the current state (`const previousState = state`). 2) Immediately update the UI state optimistically (`setState(optimisticState)`). 3) Send the network mutation. 4) If the mutation succeeds, reconcile with any server-returned metadata (e.g. assigned ID or timestamp). 5) If the mutation fails, rollback to the snapshot (`setState(previousState)`) and display an accessible toast error with a retry button.",
      explanation:
        "Standard pattern in high-quality modern web applications.",
      interviewTrap:
        "Forgetting to capture the rollback snapshot or not providing feedback when the operation fails.",
    },
  ],
  quiz: [
    {
      id: "d7-qz1",
      question: "What is the very first step you should take in a technical frontend interview?",
      options: [
        {
          id: "a",
          text: "Clarify requirements, constraints, edge cases, and target devices with the interviewer.",
          isCorrect: true,
          explanation: "Clarifying questions establish scope and prevent coding the wrong solution.",
        },
        {
          id: "b",
          text: "Immediately start typing state hooks and component boilerplate.",
          isCorrect: false,
          explanation: "Jumping straight into code without clarifying requirements is a common red flag.",
        },
        {
          id: "c",
          text: "Install 10 third-party npm packages.",
          isCorrect: false,
          explanation: "Interviewers prefer clean vanilla/React solutions without heavy external dependencies.",
        },
      ],
      explanation: "Always clarify requirements and define boundaries before implementing.",
    },
    {
      id: "d7-qz2",
      question: "In an optimistic UI update, what must always be preserved before applying the optimistic change?",
      options: [
        {
          id: "a",
          text: "A snapshot of the prior state, in order to rollback cleanly if the network request fails.",
          isCorrect: true,
          explanation: "The prior state snapshot is essential to revert the UI if the server rejects the mutation.",
        },
        {
          id: "b",
          text: "The user's session cookie in localStorage.",
          isCorrect: false,
          explanation: "Session cookies belong in httpOnly headers, not state rollback logic.",
        },
        {
          id: "c",
          text: "A screenshot of the browser DOM.",
          isCorrect: false,
          explanation: "Screenshots are unnecessary for state reconciliation.",
        },
      ],
      explanation: "Preserve a rollback state snapshot to restore UI consistency on network failure.",
    },
    {
      id: "d7-qz3",
      question: "Which Core Web Vital metric would be most damaged by un-virtualized infinite scroll lists?",
      options: [
        {
          id: "a",
          text: "INP (Interaction to Next Paint), due to main-thread blocking style recalculations on huge DOM trees.",
          isCorrect: true,
          explanation: "Tens of thousands of DOM elements cause severe style/layout calculation lag, spiking INP.",
        },
        {
          id: "b",
          text: "FCP (First Contentful Paint), because initial paint requires scrolling.",
          isCorrect: false,
          explanation: "FCP only measures the very first pixel painted on page load.",
        },
        {
          id: "c",
          text: "DNS lookup latency.",
          isCorrect: false,
          explanation: "DNS lookup occurs before any DOM is rendered.",
        },
      ],
      explanation: "Bloated DOM trees trigger massive recalculate style costs, freezing user interaction responsiveness (INP).",
    },
  ],
  exercise: {
    id: "coding-debounce",
    title: "Timed Coding Challenge: Production Debounce with Cancel & Immediate",
    track: "coding",
    url: "/coding/coding-debounce",
    description:
      "Under timed test conditions, implement a full-featured `debounce(fn, wait, options)` utility supporting delay timers, `cancel()`, `flush()`, and leading/trailing execution flags.",
    expectedOutcome:
      "Pass all test cases verifying exact wait delays, timer resets, and cancellation methods.",
    complexityTip:
      "Store timer in a closure, clear prior timeout on new calls, and preserve this/arguments context.",
    starterSnippet: `// Exercise: Production Debounce Utility
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
}`,
    hints: [
      "Ensure debounced.cancel() clears the active timeoutId.",
      "Use func.apply(this, args) to preserve correct execution context.",
      "Verify that consecutive rapid calls delay execution until wait milliseconds of silence.",
    ],
  },
};
