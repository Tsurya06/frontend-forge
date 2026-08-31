import type { Topic } from '../../types';

export const introTopics: Topic[] = [
  {
    id: 'react-intro',
    title: 'Introduction to React',
    description:
      'Core philosophy of React including the virtual DOM, declarative rendering, reconciliation algorithm, and React Fiber architecture.',
    category: 'React',
    difficulty: 'Beginner',
    tags: ['react', 'virtual dom', 'reconciliation', 'fiber', 'declarative', 'component model'],
    overview:
      'React is a declarative, component-based JavaScript library for building user interfaces. It introduces a virtual DOM abstraction that lets developers describe what the UI should look like and lets React figure out how to update the real DOM efficiently. The Fiber architecture, introduced in React 16, rewrote the reconciliation engine to support incremental rendering, prioritization, and concurrent features.',
    concepts: [
      'Declarative vs imperative rendering',
      'Component-based architecture',
      'Virtual DOM representation',
      'Reconciliation algorithm',
      'React Fiber architecture',
      'Unidirectional data flow',
      'JSX compilation',
      'React element tree',
    ],
    relatedTopicIds: ['react-vdom', 'react-components', 'react-jsx'],
    questions: [
      {
        id: 'react-intro-1',
        question: 'What is React and why was it created?',
        answer:
          'React is an open-source JavaScript library developed by Facebook (now Meta) for building user interfaces, particularly single-page applications. It was created in 2013 by Jordan Walke to solve the problem of efficiently updating complex UIs in response to data changes. Before React, developers used imperative DOM manipulation or two-way data binding frameworks that became difficult to reason about as applications grew.\n\nReact introduced a declarative paradigm where developers describe what the UI should look like for a given state, and React handles the DOM updates. Instead of manually calling methods like appendChild or innerHTML, you write components that return a description of the UI. When state changes, React re-renders the component and calculates the minimal set of DOM operations needed.\n\nThe component model is central to React. Every piece of UI is a component — a self-contained, reusable unit that manages its own rendering logic. Components compose together to form complex interfaces, much like functions compose in functional programming. This composability makes it easier to build, test, and maintain large applications.\n\nReact also introduced the virtual DOM — a lightweight in-memory representation of the real DOM. When a component re-renders, React builds a new virtual DOM tree, diffs it against the previous one, and applies only the changes to the actual DOM. This approach avoids expensive full-page re-renders and provides excellent performance for most applications.',
        shortAnswer:
          'React is a declarative JavaScript library for building UIs, created by Facebook to solve the problem of efficiently updating complex interfaces. It uses a component-based architecture and virtual DOM to minimize expensive DOM operations.',
        code: 'import { createRoot } from "react-dom/client";\n\nfunction Welcome({ name }: { name: string }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Welcome name="React" />\n      <Welcome name="World" />\n    </div>\n  );\n}\n\nconst root = createRoot(document.getElementById("root")!);\nroot.render(<App />);',
        language: 'tsx',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-intro',
        tags: ['react', 'introduction', 'declarative', 'components'],
        commonMistakes: [
          'Calling React a framework — it is a library focused on the view layer, not a full MVC framework.',
          'Thinking React replaces HTML — JSX compiles to JavaScript function calls that produce DOM elements.',
          'Assuming React is the only way to build SPAs — Vue, Angular, Svelte, and others serve similar purposes.',
        ],
        followUps: [
          'What is the difference between React and Angular?',
          'How does the virtual DOM improve performance?',
          'What is the difference between React and ReactDOM?',
        ],
        interviewTips: [
          'Start with the problem React solves (efficient UI updates) before describing how it solves it.',
          'Mention that React is a library, not a framework, and explain the distinction.',
        ],
      },
      {
        id: 'react-intro-2',
        question: 'What is the Virtual DOM and how does it work?',
        answer:
          'The Virtual DOM (VDOM) is a lightweight, in-memory JavaScript representation of the actual DOM. It is a plain object tree that mirrors the structure of the real DOM but is much cheaper to create and manipulate. When a React component renders, it returns React elements — plain JavaScript objects describing the UI — which form the virtual DOM tree.\n\nWhen state or props change, React creates a new virtual DOM tree by re-rendering the affected components. It then compares this new tree with the previous snapshot using a process called reconciliation or "diffing." The algorithm walks both trees simultaneously, identifies the minimal set of changes, and applies them to the real DOM in a single batch.\n\nReact\'s diffing algorithm makes two key assumptions to achieve O(n) complexity instead of O(n³). First, elements of different types produce entirely different subtrees. Second, developers provide stable key props on lists so React can match elements across renders without comparing every permutation.\n\nIt is important to understand that the virtual DOM is not inherently faster than direct DOM manipulation. Its value lies in the programming model: developers write declarative code describing the desired UI, and React handles the imperative DOM operations efficiently.',
        shortAnswer:
          'The Virtual DOM is an in-memory JavaScript object tree mirroring the real DOM. When state changes, React builds a new virtual tree, diffs it against the previous one using an O(n) algorithm, and applies only minimal mutations to the real DOM.',
        code: '// What React elements look like under the hood\nconst element = <h1 className="title">Hello</h1>;\n\n// Compiles to:\nconst element2 = React.createElement("h1", { className: "title" }, "Hello");\n\n// Produces a plain object (virtual DOM node):\n// {\n//   type: "h1",\n//   props: { className: "title", children: "Hello" }\n// }\n\n// React diffs old vs new virtual DOM:\n// Old: <h1 className="title">Hello</h1>\n// New: <h1 className="title">Hello, React!</h1>\n// Diff result: update text content of h1',
        language: 'tsx',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-intro',
        tags: ['virtual dom', 'reconciliation', 'diffing', 'performance'],
        commonMistakes: [
          'Claiming the virtual DOM is always faster than direct DOM manipulation — it provides a better programming model, not guaranteed speed.',
          'Thinking the virtual DOM is a shadow DOM — shadow DOM is a browser API for encapsulation, unrelated to React.',
          'Assuming every state change triggers a full re-render of the entire app — React only re-renders the affected component subtree.',
        ],
        followUps: [
          'What are the two assumptions React\'s diffing algorithm makes?',
          'How do keys help the reconciliation process?',
          'What is the difference between the virtual DOM and the shadow DOM?',
        ],
        interviewTips: [
          'Explain the diffing algorithm\'s two heuristics to show deeper understanding.',
          'Mention that the VDOM is a trade-off: it adds overhead for the programming model benefit.',
        ],
      },
      {
        id: 'react-intro-3',
        question: 'What is React Fiber and why was it introduced?',
        answer:
          'React Fiber is the complete rewrite of React\'s core reconciliation algorithm, introduced in React 16. The previous "stack reconciler" processed updates synchronously in a single, uninterruptible pass. Large component trees could block the main thread for hundreds of milliseconds, causing janky animations, unresponsive inputs, and poor user experience.\n\nFiber introduces incremental rendering — the ability to split rendering work into chunks spread across multiple frames. Each unit of work is a "fiber" node containing component info, props, state, and tree pointers (child, sibling, parent). This linked-list structure enables efficient traversal and interruption, unlike the recursive call stack.\n\nThe key innovation is work prioritization. Not all updates are equally urgent: user input is high-priority, while a data visualization re-render can be deferred. Fiber assigns priority levels to updates and can pause low-priority work for high-priority updates. It maintains "current" and "work-in-progress" trees, swapping them atomically on commit.\n\nFiber laid the groundwork for concurrent features like Suspense, transitions, and automatic batching in React 18. Without Fiber\'s ability to pause, prioritize, and resume work, these features would not be possible.',
        shortAnswer:
          'React Fiber is the reimplementation of React\'s reconciler introduced in React 16. It replaces the synchronous stack reconciler with an incremental, priority-based architecture that can pause, abort, and resume rendering work, enabling concurrent features like Suspense and transitions.',
        code: 'import { useTransition, useState } from "react";\n\nfunction SearchResults({ query }: { query: string }) {\n  const results = heavyFilter(query);\n  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>;\n}\n\nfunction App() {\n  const [query, setQuery] = useState("");\n  const [deferredQuery, setDeferredQuery] = useState("");\n  const [isPending, startTransition] = useTransition();\n\n  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {\n    setQuery(e.target.value);\n    startTransition(() => {\n      setDeferredQuery(e.target.value);\n    });\n  }\n\n  return (\n    <div>\n      <input value={query} onChange={handleChange} />\n      {isPending && <span>Loading...</span>}\n      <SearchResults query={deferredQuery} />\n    </div>\n  );\n}',
        language: 'tsx',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-intro',
        tags: ['fiber', 'reconciliation', 'concurrent', 'performance'],
        commonMistakes: [
          'Confusing Fiber with the virtual DOM — Fiber is the reconciliation engine, the virtual DOM is the representation it operates on.',
          'Thinking Fiber uses Web Workers — Fiber works on the main thread but splits work into interruptible chunks.',
          'Assuming all React 16+ code automatically uses concurrent mode — concurrent features require explicit opt-in via createRoot.',
        ],
        followUps: [
          'What is the difference between the render phase and the commit phase?',
          'How does useTransition leverage Fiber\'s architecture?',
          'What are the priority levels in React Fiber?',
        ],
        interviewTips: [
          'Explain the problem Fiber solves (main thread blocking) before explaining how it works.',
          'Connect Fiber to concurrent features like Suspense and useTransition to show the full picture.',
        ],
      },
      {
        id: 'react-intro-4',
        question: 'What is reconciliation in React?',
        answer:
          'Reconciliation is the process by which React updates the DOM. When a component\'s state or props change, React calls the render function to get a new tree of React elements. It then figures out how to efficiently update the real DOM to match this new tree. The algorithm that performs this comparison is the reconciliation or "diffing" algorithm.\n\nReact achieves O(n) complexity by making two heuristic assumptions. First, two elements of different types produce entirely different subtrees, so React unmounts the old subtree and mounts a new one. Second, developers hint at stable children by providing a key prop. When comparing same-type elements, React keeps the DOM node and only updates changed attributes, then recurses into children.\n\nFor lists of children, React uses keys to match elements between old and new lists. Without keys, React compares children by index, leading to unnecessary unmounting when items are reordered. With stable keys, React identifies which items were added, removed, or moved, applying minimum DOM operations.\n\nReconciliation happens in two phases under Fiber. The render phase traverses the tree and computes the diff (pure, interruptible). The commit phase applies changes to the real DOM in a single synchronous pass, ensuring the UI never shows a partially updated state.',
        shortAnswer:
          'Reconciliation is React\'s O(n) algorithm for determining minimal DOM updates when state changes. It uses two heuristics: different element types produce different subtrees, and keys identify stable list items. The diff is computed in the render phase and applied in the commit phase.',
        code: '// Different types → full rebuild\n// Old: <div><Counter /></div>\n// New: <span><Counter /></span>\n// React destroys div + Counter, creates span + new Counter\n\n// Same type → update attributes only\n// Old: <div className="old" />\n// New: <div className="new" />\n// React updates only className\n\n// Keys in lists\nfunction TodoList({ todos }: { todos: { id: string; text: string }[] }) {\n  return (\n    <ul>\n      {todos.map(todo => (\n        <li key={todo.id}>{todo.text}</li>\n      ))}\n    </ul>\n  );\n}\n\n// Without key: [A, B, C] → [B, C] → React updates A→B, B→C, removes C\n// With key: React knows A was removed, B and C stay unchanged',
        language: 'tsx',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-intro',
        tags: ['reconciliation', 'diffing', 'keys', 'virtual dom'],
        commonMistakes: [
          'Thinking reconciliation compares against the real DOM — it compares two virtual DOM trees.',
          'Using array index as key in dynamic lists — defeats the purpose when items are reordered.',
          'Believing reconciliation avoids re-rendering — it avoids unnecessary DOM mutations, but the component function still runs.',
        ],
        followUps: [
          'What happens when an element\'s type changes during reconciliation?',
          'Why is using Math.random() as a key problematic?',
          'How does React handle component reconciliation vs element reconciliation?',
        ],
        interviewTips: [
          'Mention the two heuristics and their O(n) complexity — this shows you understand why React is fast.',
          'Distinguish between re-rendering (calling the component function) and DOM updates (actual mutations).',
        ],
      },
      {
        id: 'react-intro-5',
        question: 'What is the difference between declarative and imperative programming in React\'s context?',
        answer:
          'Imperative programming tells the computer how to do something step by step. In DOM manipulation, this means writing instructions like "find this element, change its text, add this class." The developer is responsible for every mutation. jQuery-era code is a classic example: you query DOM nodes and manually update each piece of the UI when data changes.\n\nDeclarative programming, which React embraces, tells the computer what the result should look like. Instead of step-by-step DOM instructions, you describe the desired UI state and let React figure out the mutations needed. A React component is essentially a function from state to UI: given this data, here is what the screen should show.\n\nThis distinction has profound implications for code quality. Imperative DOM code requires explicit handling of every possible state transition. React\'s declarative model lets you express each state as a separate visual output, and React transitions between them automatically. This enables optimizations like batching, memoization, and concurrent rendering that would be impossible with imperative calls React cannot intercept.',
        shortAnswer:
          'Imperative programming describes how to update the DOM step by step, while declarative programming (React) describes what the UI should look like for a given state. React converts declarative descriptions into efficient imperative DOM operations automatically.',
        code: '// Imperative approach (vanilla JS)\nconst button = document.getElementById("counter-btn")!;\nlet count = 0;\nbutton.addEventListener("click", () => {\n  count++;\n  button.textContent = `Count: ${count}`;\n});\n\n// Declarative approach (React)\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(c => c + 1)}>\n      Count: {count}\n    </button>\n  );\n}',
        language: 'tsx',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-intro',
        tags: ['declarative', 'imperative', 'paradigm'],
        commonMistakes: [
          'Thinking declarative means no side effects — React components can have side effects via useEffect.',
          'Overusing refs for imperative DOM access when a declarative solution exists.',
          'Confusing declarative rendering with functional programming — they overlap but are distinct concepts.',
        ],
        followUps: [
          'When would you need imperative code in a React application?',
          'How does React\'s declarative model enable server-side rendering?',
        ],
        interviewTips: [
          'Use a concrete before/after example: show imperative jQuery code vs the declarative React equivalent.',
          'Connect the declarative model to testability — pure functions from state to UI are easy to test.',
        ],
      },
      {
        id: 'react-intro-6',
        question: 'What is the difference between React and ReactDOM?',
        answer:
          'React and ReactDOM are two separate packages that serve distinct purposes. React (the react package) contains the core library: the component model, hooks, the element creation API, and the reconciliation logic. It is platform-agnostic — it knows how to build and diff virtual DOM trees but has no knowledge of how to render to any specific target.\n\nReactDOM (the react-dom package) is the renderer for web browsers. It knows how to take React\'s reconciliation output and apply it to the browser\'s DOM. It provides createRoot for mounting a React tree and hydrateRoot for hydrating server-rendered HTML. ReactDOM also handles browser-specific concerns like event delegation and synthetic events.\n\nThis separation exists because React can render to targets other than the browser DOM. React Native renders to iOS and Android views. react-three-fiber renders to WebGL via Three.js. react-pdf renders to PDF documents. All of these use the same react package for component logic and hooks but have their own platform-specific rendering code.\n\nIn practice, a typical React web application imports from both packages. You import hooks from react and the root-creation API from react-dom/client. This split was formalized in React 18 with the move from ReactDOM.render (deprecated) to createRoot.',
        shortAnswer:
          'React is the core library containing the component model, hooks, and reconciliation logic. ReactDOM is the browser-specific renderer that applies React\'s output to the browser DOM. They are separate so React can work with different renderers (ReactDOM, React Native, etc.).',
        code: '// react — core library (platform-agnostic)\nimport { useState, useEffect } from "react";\n\n// react-dom/client — browser renderer\nimport { createRoot } from "react-dom/client";\n\n// react-dom/server — server-side rendering\nimport { renderToString } from "react-dom/server";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;\n}\n\n// Client-side rendering\nconst root = createRoot(document.getElementById("root")!);\nroot.render(<App />);\n\n// Server-side rendering\nconst html = renderToString(<App />);',
        language: 'tsx',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-intro',
        tags: ['react', 'react-dom', 'renderer', 'architecture'],
        commonMistakes: [
          'Importing render from react-dom instead of createRoot from react-dom/client in React 18+.',
          'Assuming React only works in browsers — it can render to native, PDF, terminal, and more.',
          'Mixing ReactDOM.render (legacy) with concurrent features like useTransition.',
        ],
        followUps: [
          'What is the difference between createRoot and hydrateRoot?',
          'Can you share components between React web and React Native?',
          'What changed from ReactDOM.render to createRoot in React 18?',
        ],
        interviewTips: [
          'Highlight the renderer-agnostic design as an architectural strength of React.',
          'Mention the React 18 migration from ReactDOM.render to createRoot to show you are current.',
        ],
      },
    ],
  },

  {
    id: 'react-jsx',
    title: 'JSX',
    description:
      'JSX syntax, embedding expressions, fragments, conditional rendering patterns, and how JSX compiles to JavaScript.',
    category: 'React',
    difficulty: 'Beginner',
    tags: ['jsx', 'syntax', 'expressions', 'fragments', 'conditional rendering'],
    overview:
      'JSX is a syntax extension for JavaScript that looks like HTML but compiles to React.createElement calls. It allows developers to write component templates in a familiar, readable format while still having access to the full power of JavaScript expressions.',
    concepts: [
      'JSX syntax and transpilation',
      'Embedding JavaScript expressions',
      'JSX attributes vs HTML attributes',
      'React Fragments',
      'Conditional rendering patterns',
      'Lists and iteration in JSX',
      'JSX spread attributes',
    ],
    relatedTopicIds: ['react-intro', 'react-components', 'react-props'],
    questions: [
      {
        id: 'react-jsx-1',
        question: 'What is JSX and how does it work under the hood?',
        answer:
          'JSX stands for JavaScript XML. It is a syntax extension that allows you to write HTML-like markup directly inside JavaScript files. JSX is not valid JavaScript — it must be transpiled by Babel or TypeScript into standard JavaScript function calls before the browser can execute it.\n\nUnder the hood, each JSX element is transformed into a React.createElement call (or the newer automatic JSX transform\'s jsx function). For example, <div className="box">Hello</div> becomes React.createElement("div", { className: "box" }, "Hello"). The automatic transform, introduced in React 17, imports jsx from react/jsx-runtime automatically, eliminating the need for explicit React imports.\n\nJSX supports embedding any JavaScript expression inside curly braces. You can include variables, function calls, ternary operators, and complex expressions. However, statements like if-else and for loops cannot be used directly — you must use expressions (ternaries, map, logical operators) instead.\n\nBecause JSX compiles to JavaScript, it has full access to the language\'s capabilities. You can store JSX in variables, pass it as function arguments, return it from functions, and use it in arrays. This makes JSX strictly more powerful than traditional HTML templating languages.',
        shortAnswer:
          'JSX is a syntax extension that compiles to React.createElement (or the automatic jsx transform) calls returning plain objects describing the UI. Expressions are embedded with curly braces. The automatic transform in React 17+ eliminates the need for explicit React imports.',
        code: '// JSX syntax\nconst element = <h1 className="greeting">Hello, world!</h1>;\n\n// Compiles to (classic transform):\nconst element2 = React.createElement("h1", { className: "greeting" }, "Hello, world!");\n\n// Automatic transform (React 17+):\nimport { jsx as _jsx } from "react/jsx-runtime";\nconst element3 = _jsx("h1", { className: "greeting", children: "Hello, world!" });\n\n// Embedding expressions\nconst name = "React";\nconst greeting = <h1>Hello, {name.toUpperCase()}!</h1>;\n\n// JSX is an expression — assign to variables, pass as args\nfunction getGreeting(user: string | null) {\n  return user ? <h1>Hello, {user}!</h1> : <h1>Hello, stranger!</h1>;\n}',
        language: 'tsx',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-jsx',
        tags: ['jsx', 'transpilation', 'createElement', 'expressions'],
        commonMistakes: [
          'Using class instead of className — class is a reserved word in JavaScript.',
          'Forgetting that JSX expressions must return a single root element.',
          'Trying to use statements (if/else, for) directly inside JSX curly braces instead of expressions.',
        ],
        followUps: [
          'What is the automatic JSX transform and why was it introduced?',
          'Can you use JSX without React?',
          'What are the differences between JSX and HTML?',
        ],
        interviewTips: [
          'Show you understand JSX is syntactic sugar by explaining what it compiles to.',
          'Mention the automatic transform to demonstrate awareness of modern React tooling.',
        ],
      },
      {
        id: 'react-jsx-2',
        question: 'What are React Fragments and why are they useful?',
        answer:
          'React Fragments let you group multiple child elements without adding extra DOM nodes. In React, a component must return a single root element. Before Fragments, developers wrapped sibling elements in a <div>, which added unnecessary nodes to the DOM and sometimes broke CSS layouts (flexbox, grid) or produced invalid HTML (e.g., <div> inside <tr>).\n\nFragments solve this with an invisible wrapper. You can use the explicit <React.Fragment> syntax or the shorthand <> ... </>. The explicit syntax is required when you need a key prop, which is common when rendering lists of grouped elements.\n\nFragments also improve performance marginally by reducing DOM node count. In large lists or deeply nested trees, eliminating unnecessary wrapper nodes reduces memory usage and speeds up DOM operations like layout calculations.',
        shortAnswer:
          'React Fragments (<React.Fragment> or <>) return multiple elements without extra DOM nodes. They preserve valid HTML structure and prevent CSS layout issues. Use the explicit syntax when a key prop is needed.',
        code: '// Without Fragment — adds unnecessary div\nfunction WithDiv() {\n  return (\n    <div>\n      <h1>Title</h1>\n      <p>Content</p>\n    </div>\n  );\n}\n\n// With Fragment shorthand — no extra DOM node\nfunction WithFragment() {\n  return (\n    <>\n      <h1>Title</h1>\n      <p>Content</p>\n    </>\n  );\n}\n\n// Explicit Fragment with key (required for lists)\nimport { Fragment } from "react";\n\nfunction Glossary({ items }: { items: { id: string; term: string; desc: string }[] }) {\n  return (\n    <dl>\n      {items.map(item => (\n        <Fragment key={item.id}>\n          <dt>{item.term}</dt>\n          <dd>{item.desc}</dd>\n        </Fragment>\n      ))}\n    </dl>\n  );\n}',
        language: 'tsx',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-jsx',
        tags: ['fragments', 'jsx', 'dom', 'semantic html'],
        commonMistakes: [
          'Using the shorthand <> syntax when a key prop is needed — shorthand does not support attributes.',
          'Wrapping table rows in <div> instead of Fragments, producing invalid HTML.',
          'Over-nesting Fragments unnecessarily when a single parent element is semantically appropriate.',
        ],
        followUps: [
          'When would you use the explicit Fragment syntax over the shorthand?',
          'Can Fragments accept any props besides key?',
        ],
        interviewTips: [
          'Give a concrete example where a wrapper div breaks layout (flexbox, table).',
          'Mention the key prop distinction between shorthand and explicit Fragment syntax.',
        ],
      },
      {
        id: 'react-jsx-3',
        question: 'What are the common patterns for conditional rendering in JSX?',
        answer:
          'Conditional rendering in React displays different UI based on conditions. Since JSX only supports expressions, you cannot use if-else blocks directly. React developers use several expression-based patterns, each suited to different scenarios.\n\nThe ternary operator (condition ? a : b) is the most common for choosing between two elements. The logical AND (condition && <Element />) is ideal for render-or-nothing. However, && has a gotcha: if the condition is 0 (a falsy number), React renders "0" in the DOM. Fix with explicit boolean coercion: {count > 0 && <Badge />}.\n\nFor multiple conditions, extract logic outside the JSX return using if-else or switch statements to assign JSX to a variable. Early return patterns within the component function are also effective: if (isLoading) return <Spinner />; if (!data) return <Error />; return <Content />. This "guard clause" pattern keeps the happy path unindented.',
        shortAnswer:
          'Common patterns include ternary operators (a ? b : c) for two-way choices, logical AND (condition && element) for render-or-nothing, if-else outside the return for complex conditions, and early returns for guard clauses. Avoid the falsy-zero gotcha with && by using explicit boolean coercion.',
        code: '// Ternary operator\nfunction Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {\n  return isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>;\n}\n\n// Logical AND — render or nothing\nfunction Mailbox({ unreadCount }: { unreadCount: number }) {\n  return (\n    <div>\n      <h1>Inbox</h1>\n      {unreadCount > 0 && <span>You have {unreadCount} unread messages.</span>}\n    </div>\n  );\n}\n\n// Gotcha: falsy zero renders "0" in the DOM\nfunction BadExample({ count }: { count: number }) {\n  return <div>{count && <span>Count: {count}</span>}</div>;\n}\nfunction FixedExample({ count }: { count: number }) {\n  return <div>{count > 0 && <span>Count: {count}</span>}</div>;\n}\n\n// Early return pattern\nfunction UserProfile({ user, isLoading }: { user: User | null; isLoading: boolean }) {\n  if (isLoading) return <Spinner />;\n  if (!user) return <p>User not found.</p>;\n  return <div><h1>{user.name}</h1></div>;\n}',
        language: 'tsx',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-jsx',
        tags: ['conditional rendering', 'ternary', 'logical and', 'patterns'],
        commonMistakes: [
          'Using && with a numeric condition that can be 0 — React renders the number 0 instead of nothing.',
          'Deeply nesting ternary operators making code unreadable — extract to variables instead.',
          'Using if-else inside JSX curly braces — only expressions are allowed, not statements.',
        ],
        followUps: [
          'How would you handle rendering based on user roles?',
          'What is the nullish coalescing operator (??) and when is it useful in JSX?',
        ],
        interviewTips: [
          'Mention the 0-gotcha with && — it is a common interview follow-up.',
          'Explain when to use each pattern rather than picking just one.',
        ],
      },
      {
        id: 'react-jsx-4',
        question: 'What are the key differences between JSX and HTML?',
        answer:
          'Although JSX looks similar to HTML, there are several important differences because JSX compiles to JavaScript. Attribute naming follows JavaScript conventions: class becomes className, for becomes htmlFor, event handlers use camelCase (onClick, onChange). The style attribute accepts a JavaScript object with camelCased properties instead of a CSS string.\n\nJSX requires all tags to be properly closed. Self-closing tags like <img>, <input>, and <br> must be explicitly self-closed: <img />, <input />, <br />. JSX expressions must return a single root element, solved with Fragments (<>). Boolean attributes work differently: disabled in HTML equals disabled={true} in JSX.\n\nJSX uses curly braces for JavaScript expressions, and comments use {/* comment */} syntax instead of HTML comments. Importantly, JSX automatically escapes embedded values to prevent XSS attacks, while raw HTML interpolation does not.',
        shortAnswer:
          'JSX differs from HTML: className instead of class, htmlFor instead of for, camelCase events, self-closing tags required, single root element, JS object for style, curly braces for expressions, and automatic XSS escaping.',
        code: '// className instead of class\nconst div = <div className="container">Content</div>;\n\n// htmlFor instead of for\nconst label = <label htmlFor="email">Email</label>;\n\n// camelCase event handlers\nconst button = <button onClick={() => alert("clicked")}>Click</button>;\n\n// Style as object with camelCase properties\nconst styled = (\n  <div style={{ backgroundColor: "blue", fontSize: "16px", marginTop: 10 }}>\n    Styled\n  </div>\n);\n\n// Self-closing tags required\nconst inputs = (\n  <form>\n    <input type="text" />\n    <br />\n    <img src="photo.jpg" alt="Photo" />\n  </form>\n);\n\n// Automatic XSS escaping\nconst userInput = \'<script>alert("xss")</script>\';\nconst safe = <div>{userInput}</div>; // Renders as text, not HTML',
        language: 'tsx',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-jsx',
        tags: ['jsx', 'html', 'differences', 'attributes'],
        commonMistakes: [
          'Using class instead of className — produces a warning and may not work correctly.',
          'Writing style as a string instead of an object.',
          'Forgetting to self-close void elements like <img />, <input />, and <br />.',
        ],
        followUps: [
          'How does dangerouslySetInnerHTML work and when should you use it?',
          'How does JSX handle XSS prevention?',
        ],
        interviewTips: [
          'Group differences by category (naming, syntax, expressions) for a structured answer.',
          'Mention XSS protection as a security benefit of JSX over raw HTML string interpolation.',
        ],
      },
      {
        id: 'react-jsx-5',
        question: 'How do you render lists in JSX and why are keys important?',
        answer:
          'Rendering lists uses Array.map to return a JSX element for each item. Each element must have a unique key prop to help React\'s reconciliation algorithm identify which items have changed, been added, or removed. Without keys, React compares items by index, leading to incorrect behavior when items are reordered, inserted, or deleted.\n\nThe ideal key is a unique, stable identifier from your data — a database ID or UUID. Using the array index is acceptable only for static lists that never change order. With dynamic lists, index keys cause state bugs: component state gets attached to the wrong item, and animations break.\n\nKeys must be unique among siblings but not globally. They are not passed as props — if a child needs the ID, pass it as a separate prop. The key prop can also force a component to remount: changing a component\'s key tells React to destroy the old instance and create a new one, resetting all state.',
        shortAnswer:
          'Lists are rendered with Array.map(), each element needing a unique key for efficient reconciliation. Use stable IDs from data, not array indices for dynamic lists. Keys are unique among siblings, not passed as props, and can force remounting when changed.',
        code: 'interface User { id: string; name: string; email: string; }\n\nfunction UserList({ users }: { users: User[] }) {\n  return (\n    <ul>\n      {users.map(user => (\n        <li key={user.id}>\n          {user.name} — {user.email}\n        </li>\n      ))}\n    </ul>\n  );\n}\n\n// BAD: using index as key with dynamic list\nfunction BadList({ items }: { items: string[] }) {\n  return (\n    <ul>\n      {items.map((item, index) => (\n        <li key={index}>\n          <input defaultValue={item} />\n        </li>\n      ))}\n    </ul>\n  );\n}\n\n// Using key to reset component state\nfunction EditUser({ userId }: { userId: string }) {\n  return <UserForm key={userId} userId={userId} />;\n}',
        language: 'tsx',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-jsx',
        tags: ['lists', 'keys', 'map', 'reconciliation'],
        commonMistakes: [
          'Using array index as key for dynamic lists — causes state bugs when items are reordered or deleted.',
          'Using Math.random() as key — forces React to remount every item on every render.',
          'Expecting the key prop to be accessible inside the child component.',
        ],
        followUps: [
          'What happens if two siblings have the same key?',
          'How can you use the key prop to reset a component\'s state?',
          'When is it acceptable to use index as a key?',
        ],
        interviewTips: [
          'Explain the performance implication: wrong keys cause unnecessary DOM mutations and state corruption.',
          'Mention the key-reset pattern as an advanced technique.',
        ],
      },
    ],
  },
];
