import type { Topic } from "../../types";

export const componentTopics: Topic[] = [
  {
    id: "react-components",
    title: "React Components",
    description:
      "Understanding functional and class components, component composition, reusability, and controlled vs uncontrolled patterns.",
    category: "React",
    difficulty: "Beginner",
    tags: ["components", "functional", "class", "composition", "reusability"],
    overview:
      "Components are the building blocks of React applications. They encapsulate UI logic and presentation into reusable, self-contained units. Modern React strongly favors functional components with hooks over class components.",
    concepts: [
      "Functional components",
      "Class components",
      "Component composition vs inheritance",
      "Controlled vs uncontrolled components",
      "Pure components",
      "Component reusability patterns",
    ],
    relatedTopicIds: [
      "react-functional",
      "react-class",
      "react-props",
      "react-hooks",
    ],
    questions: [
      {
        id: "react-components-1",
        question:
          "What is the difference between functional and class components?",
        answer:
          "Functional components are plain JavaScript functions that accept a props object and return JSX. With hooks (React 16.8), they can manage state, side effects, context, and all features previously exclusive to class components. They are simpler, produce less boilerplate, and are the recommended approach.\n\nClass components are ES6 classes extending React.Component. They define a render() method returning JSX, manage state through this.state/this.setState, and use lifecycle methods like componentDidMount. They use the this keyword extensively, which introduces complexity around method binding.\n\nA significant difference is how they capture values. Functional components close over props and state from their render — callbacks see values from when they were created. Class components access this.props which always points to the latest values. The React team recommends functional components for all new code; class components are not deprecated but receive no new features.",
        shortAnswer:
          "Functional components are plain functions using hooks for state and effects. Class components extend React.Component with lifecycle methods. Functional components are simpler, capture values via closures, and are the modern standard.",
        code: "// Functional component\nfunction Welcome({ name }: { name: string }) {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `${name} - ${count} clicks`;\n  }, [name, count]);\n\n  return (\n    <div>\n      <h1>Hello, {name}!</h1>\n      <button onClick={() => setCount(c => c + 1)}>Clicked {count} times</button>\n    </div>\n  );\n}\n\n// Equivalent class component\nclass WelcomeClass extends React.Component<{ name: string }, { count: number }> {\n  state = { count: 0 };\n\n  componentDidMount() { document.title = `${this.props.name} - ${this.state.count} clicks`; }\n  componentDidUpdate() { document.title = `${this.props.name} - ${this.state.count} clicks`; }\n\n  render() {\n    return (\n      <div>\n        <h1>Hello, {this.props.name}!</h1>\n        <button onClick={() => this.setState(s => ({ count: s.count + 1 }))}>\n          Clicked {this.state.count} times\n        </button>\n      </div>\n    );\n  }\n}",
        language: "tsx",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "React",
        topicId: "react-components",
        tags: ["functional", "class", "comparison", "hooks"],
        commonMistakes: [
          "Thinking class components are deprecated — they are fully supported, just not recommended for new code.",
          "Forgetting to bind this in class component event handlers.",
          "Mixing hooks with class components — hooks only work in functional components.",
        ],
        followUps: [
          "Can hooks completely replace class component features?",
          "What is the only feature class components have that hooks cannot replicate?",
        ],
        interviewTips: [
          "Lead with the modern recommendation (functional + hooks) then explain class components for legacy context.",
          "Mention error boundaries as the one remaining class component use case.",
        ],
      },
      {
        id: "react-components-2",
        question:
          "What is component composition and why is it preferred over inheritance?",
        answer:
          "Component composition builds complex UIs by combining simpler components, much like composing functions. Instead of class inheritance (Child extends Parent), React encourages components that accept other components as children or props and render them within their own output.\n\nThe primary pattern is the children prop. Content between a component's tags is passed as children, allowing components like Card, Modal, or Layout to define structure while remaining content-agnostic. Named slot props (header={<Nav />}, sidebar={<Menu />}) give explicit control over which content appears where.\n\nReact's documentation explicitly recommends composition over inheritance — the team has never found a use case where inheritance is necessary. Inheritance creates tight coupling, makes parents fragile, and complicates refactoring. With hooks, even shared logic is better handled through custom hooks than HOCs or inheritance.",
        shortAnswer:
          "Component composition builds complex UIs by combining simple components using children and props-as-components patterns. React favors composition because it keeps components independent and avoids the tight coupling of inheritance.",
        code: '// Composition via children\nfunction Card({ children, title }: { children: React.ReactNode; title: string }) {\n  return (\n    <div className="card">\n      <h2>{title}</h2>\n      <div className="card-body">{children}</div>\n    </div>\n  );\n}\n\n<Card title="Profile">\n  <p>Name: John Doe</p>\n  <p>Email: john@example.com</p>\n</Card>\n\n// Named slots\ninterface LayoutProps {\n  header: React.ReactNode;\n  sidebar: React.ReactNode;\n  children: React.ReactNode;\n}\n\nfunction Layout({ header, sidebar, children }: LayoutProps) {\n  return (\n    <div className="layout">\n      <header>{header}</header>\n      <aside>{sidebar}</aside>\n      <main>{children}</main>\n    </div>\n  );\n}\n\n// Specialization (composition, not inheritance)\nfunction WelcomeDialog() {\n  return <Dialog title="Welcome" message="Thanks for visiting!" />;\n}',
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-components",
        tags: ["composition", "children", "slots", "inheritance"],
        commonMistakes: [
          "Using inheritance to share behavior — use hooks or composition instead.",
          "Overcomplicating with nested slot patterns when children suffices.",
          "Confusing the children prop with child component references.",
        ],
        followUps: [
          "What are render props and how do they relate to composition?",
          "How do custom hooks replace HOCs?",
        ],
        interviewTips: [
          'Quote the React docs: "we haven\'t found any use cases where we would recommend creating component inheritance hierarchies."',
          "Show the slots pattern as an alternative to children for multi-region layouts.",
        ],
      },
      {
        id: "react-components-3",
        question: "What are controlled and uncontrolled components?",
        answer:
          "Controlled components are form elements whose values are driven by React state. The state is the single source of truth: the input's value comes from state, and changes trigger a handler that updates state. This closed loop gives you complete control over the form data for real-time validation, formatting, and synchronization.\n\nUncontrolled components let the DOM manage form state. Instead of setting value, you use defaultValue and read the value via a ref when needed (typically on submit). File inputs are always uncontrolled since their value is read-only for security reasons.\n\nControlled is recommended for most cases because it enables real-time validation, conditional submit disabling, and data synchronization. Uncontrolled suits integration with non-React code or performance-critical scenarios. Libraries like React Hook Form use uncontrolled components internally with refs for performance while providing a controlled-like API.",
        shortAnswer:
          "Controlled components have values driven by React state via value + onChange. Uncontrolled components manage their own state in the DOM, read via refs. Controlled is preferred for validation and data control; uncontrolled suits performance-critical or integration scenarios.",
        code: '// Controlled component\nfunction ControlledInput() {\n  const [value, setValue] = useState("");\n  return (\n    <input\n      value={value}\n      onChange={e => setValue(e.target.value)}\n      placeholder="Controlled"\n    />\n  );\n}\n\n// Uncontrolled component\nfunction UncontrolledInput() {\n  const inputRef = useRef<HTMLInputElement>(null);\n\n  function handleSubmit(e: React.FormEvent) {\n    e.preventDefault();\n    alert(`Value: ${inputRef.current?.value}`);\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input ref={inputRef} defaultValue="initial" />\n      <button type="submit">Submit</button>\n    </form>\n  );\n}\n\n// File input is always uncontrolled\nfunction FileUpload() {\n  const fileRef = useRef<HTMLInputElement>(null);\n  return <input type="file" ref={fileRef} />;\n}',
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-components",
        tags: ["controlled", "uncontrolled", "forms", "state"],
        commonMistakes: [
          "Setting value without onChange creates a read-only input.",
          "Switching between controlled and uncontrolled by toggling value and defaultValue.",
          "Using refs to read controlled input values instead of reading from state.",
        ],
        followUps: [
          "How does React Hook Form use uncontrolled components for performance?",
          "What happens if you set value without an onChange handler?",
        ],
        interviewTips: [
          "Explain the trade-off: controlled gives power, uncontrolled gives performance.",
          "Mention that file inputs are always uncontrolled as a practical edge case.",
        ],
      },
      {
        id: "react-components-4",
        question:
          "What are pure components and how do they optimize rendering?",
        answer:
          "A pure component produces the same output for the same props and state — given identical inputs, it always renders identically. This predictability enables React to skip re-renders when nothing has changed, improving performance.\n\nFor class components, React.PureComponent implements shouldComponentUpdate with shallow prop/state comparison. For functional components, React.memo wraps the function and caches results when props are unchanged. Both use reference equality (===) for objects and arrays, so new references bypass the optimization even if values are identical.\n\nPure components are not always appropriate. Cheap components gain little from memoization but pay comparison overhead. Components that almost always receive new props waste time on comparisons. Best candidates are expensive components that render frequently with the same props. Parents must stabilize references with useMemo/useCallback for memo to be effective.",
        shortAnswer:
          "Pure components produce identical output for identical inputs. React.PureComponent (class) and React.memo (functional) skip re-renders via shallow comparison. They require stable references for objects/arrays to be effective.",
        code: 'const ExpensiveList = React.memo(function ExpensiveList(\n  { items, onSelect }: { items: string[]; onSelect: (item: string) => void }\n) {\n  console.log("ExpensiveList rendered");\n  return (\n    <ul>\n      {items.map(item => (\n        <li key={item} onClick={() => onSelect(item)}>{item}</li>\n      ))}\n    </ul>\n  );\n});\n\nfunction App() {\n  const [query, setQuery] = useState("");\n  const items = useMemo(() => data.filter(i => i.includes(query)), [query]);\n  const handleSelect = useCallback((item: string) => {\n    console.log("Selected:", item);\n  }, []);\n\n  return (\n    <div>\n      <input value={query} onChange={e => setQuery(e.target.value)} />\n      <ExpensiveList items={items} onSelect={handleSelect} />\n    </div>\n  );\n}\n\n// Custom comparison function\nconst UserCard = React.memo(\n  function UserCard({ user }: { user: { id: string; name: string } }) {\n    return <div>{user.name}</div>;\n  },\n  (prev, next) => prev.user.id === next.user.id\n);',
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-components",
        tags: [
          "pure components",
          "React.memo",
          "PureComponent",
          "optimization",
        ],
        commonMistakes: [
          "Creating new object/array references in the parent every render, defeating shallow comparison.",
          "Wrapping every component in React.memo by default.",
          "Assuming React.memo does deep comparison — it does shallow by default.",
        ],
        followUps: [
          "How do useMemo and useCallback complement React.memo?",
          "When should you NOT use React.memo?",
        ],
        interviewTips: [
          "Emphasize that React.memo is an optimization, not a guarantee.",
          "Explain the relationship between stable references and memoization effectiveness.",
        ],
      },
      {
        id: "react-components-5",
        question: "How do you design reusable components in React?",
        answer:
          "Reusable components do one thing well, accept configuration through props, and make no assumptions about context. Separate concerns by splitting into generic presentational pieces and specific business-logic pieces. A Button handles visual presentation (size, variant) but not business logic (what happens on click).\n\nUse composition patterns for flexibility: accept children or render props, use the rest/spread pattern (...rest) to forward native HTML attributes, provide sensible defaults for optional props, and allow className/style overrides. TypeScript interfaces document the props contract and catch misuse at compile time.\n\nHandle edge cases gracefully — define behavior for empty arrays, loading states, and errors. Render useful empty states and loading skeletons by default, with props to customize each. Test components in isolation with tools like Storybook. If a component is difficult to render in isolation, it is likely too coupled.",
        shortAnswer:
          "Reusable components follow single responsibility, accept well-typed props, use composition (children, render props) for flexibility, provide sensible defaults, forward native HTML attributes, and handle edge cases gracefully.",
        code: 'interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: "primary" | "secondary" | "ghost";\n  size?: "sm" | "md" | "lg";\n  isLoading?: boolean;\n  leftIcon?: React.ReactNode;\n}\n\nfunction Button({\n  variant = "primary",\n  size = "md",\n  isLoading = false,\n  leftIcon,\n  children,\n  disabled,\n  className,\n  ...rest\n}: ButtonProps) {\n  return (\n    <button\n      className={`btn btn-${variant} btn-${size} ${className ?? ""}`}\n      disabled={disabled || isLoading}\n      {...rest}\n    >\n      {isLoading ? <Spinner size={size} /> : leftIcon}\n      {children}\n    </button>\n  );\n}\n\n// Flexible usage\n<Button>Default primary</Button>\n<Button variant="secondary" size="lg">Large</Button>\n<Button isLoading onClick={handleSubmit}>Submitting...</Button>\n<Button leftIcon={<PlusIcon />}>Add item</Button>',
        language: "tsx",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "React",
        topicId: "react-components",
        tags: ["reusability", "component design", "props", "patterns"],
        commonMistakes: [
          "Making components too specific to one use case.",
          "Adding too many props — leads to prop bloat.",
          "Not forwarding native HTML attributes.",
        ],
        followUps: [
          "How do you handle polymorphic components?",
          "What is the compound component pattern?",
        ],
        interviewTips: [
          "Walk through designing a Button step by step to demonstrate your process.",
          "Mention TypeScript, testing, and Storybook as supporting tools.",
        ],
      },
    ],
  },
  {
    id: "react-state",
    title: "Component State",
    description:
      "Managing component state with useState, understanding batching, immutability rules, and state update patterns.",
    category: "React",
    difficulty: "Beginner",
    tags: ["state", "useState", "batching", "immutability", "state updates"],
    overview:
      "State is data that changes over time and drives rendering. React provides useState for simple state and useReducer for complex logic. Understanding batching, immutability, and derived state is essential for correct React applications.",
    concepts: [
      "useState hook",
      "Functional updates",
      "Batching",
      "Immutability",
      "Derived state",
      "Lazy initialization",
      "useReducer",
    ],
    relatedTopicIds: ["react-hooks", "react-data-flow", "react-performance"],
    questions: [
      {
        id: "react-state-1",
        question: "How does useState work and what are its rules?",
        answer:
          "useState adds local state to a functional component. It accepts an initial value and returns [currentValue, setter]. The state persists across re-renders in a fiber node. The initial value is used only during the first render; for expensive initializations, pass a lazy initializer function: useState(() => computeExpensive()).\n\nThe setter accepts either a new value directly or an updater function. Updater functions (setCount(prev => prev + 1)) receive the current state and return the new state — essential when multiple updates depend on previous state. State updates are asynchronous and batched: React schedules re-renders and processes all updates before re-rendering.\n\nReact uses Object.is to determine if state changed. If the setter receives a value identical to current state, React bails out of re-rendering. This is why immutability matters: mutating an object and passing it back returns the same reference, so React sees no change and skips the update.",
        shortAnswer:
          "useState returns [value, setter]. The initial value is used only on first render (pass a function for expensive computation). Setters accept values or updater functions. Updates are batched and asynchronous. React skips re-renders if the new value is identical (Object.is).",
        code: 'function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;\n}\n\n// Updater function — necessary for dependent updates\nfunction BatchedCounter() {\n  const [count, setCount] = useState(0);\n\n  function handleClick() {\n    setCount(c => c + 1);\n    setCount(c => c + 1);\n    setCount(c => c + 1); // count will be +3\n  }\n  return <button onClick={handleClick}>Count: {count}</button>;\n}\n\n// Lazy initialization\nfunction FormWithDefaults() {\n  const [formData, setFormData] = useState(() => {\n    const saved = localStorage.getItem("formData");\n    return saved ? JSON.parse(saved) : { name: "", email: "" };\n  });\n\n  return <input value={formData.name} onChange={e =>\n    setFormData(prev => ({ ...prev, name: e.target.value }))\n  } />;\n}',
        language: "tsx",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "React",
        topicId: "react-state",
        tags: ["useState", "state", "updater", "batching"],
        commonMistakes: [
          "Reading state immediately after calling the setter — state updates on next render.",
          "Using direct value form when multiple updates depend on each other.",
          "Passing expensive computation without wrapping in a function — it runs every render.",
        ],
        followUps: [
          "When should you use useReducer instead of useState?",
          "How does React 18 batching differ from React 17?",
        ],
        interviewTips: [
          "Demonstrate batching understanding with multiple setCount calls.",
          "Mention the lazy initializer pattern.",
        ],
      },
      {
        id: "react-state-2",
        question: "What is state batching in React and how does it work?",
        answer:
          "State batching groups multiple state updates into a single re-render. Instead of re-rendering after each setState, React waits until all updates complete and performs one re-render. This dramatically reduces renders and DOM updates.\n\nReact 17 only batched inside React event handlers. Updates in setTimeout, Promises, or native listeners triggered separate re-renders. React 18 introduced automatic batching for all contexts via createRoot. Every setState call in any execution context is batched.\n\nWhen using updater functions in a batch, each updater receives the result of the previous update, ensuring correctness. For rare cases requiring immediate synchronous updates, flushSync from react-dom forces re-render before continuing. Use it sparingly — it bypasses batching optimizations.",
        shortAnswer:
          "Batching groups multiple setState calls into one re-render. React 18 batches automatically everywhere (event handlers, promises, timeouts). Updater functions in a batch chain correctly. Use flushSync for rare immediate update needs.",
        code: '// Batching in event handlers (React 17 and 18)\nfunction Profile() {\n  const [name, setName] = useState("Alice");\n  const [age, setAge] = useState(25);\n\n  function handleClick() {\n    setName("Bob");  // queued\n    setAge(30);      // queued\n    // ONE re-render with both updates\n  }\n  return <button onClick={handleClick}>{name}, {age}</button>;\n}\n\n// React 18: automatic batching in async code\nfunction AsyncBatching() {\n  const [count, setCount] = useState(0);\n  const [flag, setFlag] = useState(false);\n\n  function handleClick() {\n    fetch("/api/data").then(() => {\n      setCount(c => c + 1); // batched in React 18\n      setFlag(f => !f);     // single re-render\n    });\n  }\n  return <button onClick={handleClick}>{count}</button>;\n}\n\n// flushSync — force immediate re-render (escape hatch)\nimport { flushSync } from "react-dom";\n\nfunction WithFlushSync() {\n  const [count, setCount] = useState(0);\n\n  function handleClick() {\n    flushSync(() => { setCount(c => c + 1); });\n    // DOM is updated at this point\n  }\n  return <span>{count}</span>;\n}',
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-state",
        tags: ["batching", "state updates", "React 18", "flushSync"],
        commonMistakes: [
          "Expecting state to update immediately after setState.",
          "Using direct values instead of updaters for dependent updates.",
          "Overusing flushSync — it bypasses batching optimizations.",
        ],
        followUps: [
          "How does createRoot enable automatic batching?",
          "How does batching interact with useTransition?",
        ],
        interviewTips: [
          "Contrast React 17 (only event handlers) with React 18 (everything batched).",
          "Mention flushSync as an escape hatch but explain why to avoid it.",
        ],
      },
      {
        id: "react-state-3",
        question: "Why is immutability important when updating state in React?",
        answer:
          "Immutability means never modifying existing state directly — instead create new copies with changes. React uses reference comparison (Object.is) to detect state changes. Mutating an object and passing it to the setter returns the same reference, so React concludes nothing changed and skips re-rendering.\n\nImmutability also enables optimization features. React.memo, useMemo, and useCallback rely on reference comparison. If objects are always replaced (not mutated), changed references reliably signal new data. Mutation breaks this contract and makes memoization unreliable.\n\nFor objects, use spread ({...obj, key: newValue}). For arrays, use methods returning new arrays (map, filter, concat) instead of mutating ones (push, splice, sort on original). For deeply nested structures, consider Immer which lets you write mutation-like code that produces immutable updates under the hood.",
        shortAnswer:
          "React uses Object.is to detect state changes. Mutating state returns the same reference, skipping re-renders. Immutable updates create new references, triggering re-renders correctly. Use spread operators or Immer for updates.",
        code: '// WRONG: mutating state\nfunction MutationBug() {\n  const [user, setUser] = useState({ name: "Alice", age: 25 });\n  function birthday() {\n    user.age += 1;   // mutation — same reference\n    setUser(user);    // React sees same reference → no re-render!\n  }\n  return <div>{user.age}</div>;\n}\n\n// CORRECT: immutable update\nfunction ImmutableUpdate() {\n  const [user, setUser] = useState({ name: "Alice", age: 25 });\n  function birthday() {\n    setUser({ ...user, age: user.age + 1 }); // new object → re-render\n  }\n  return <div>{user.age}</div>;\n}\n\n// Array immutability\nfunction TodoList() {\n  const [todos, setTodos] = useState<string[]>([]);\n\n  const addTodo = (text: string) => setTodos([...todos, text]);\n  const removeTodo = (i: number) => setTodos(todos.filter((_, idx) => idx !== i));\n  const updateTodo = (i: number, text: string) =>\n    setTodos(todos.map((t, idx) => (idx === i ? text : t)));\n}\n\n// Nested objects — spread at every level\nfunction NestedUpdate() {\n  const [state, setState] = useState({\n    user: { name: "Alice", address: { city: "NYC", zip: "10001" } },\n  });\n\n  function updateCity(city: string) {\n    setState(prev => ({\n      ...prev,\n      user: { ...prev.user, address: { ...prev.user.address, city } },\n    }));\n  }\n}',
        language: "tsx",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "React",
        topicId: "react-state",
        tags: ["immutability", "state updates", "spread", "Object.is"],
        commonMistakes: [
          "Mutating state objects directly and expecting re-renders.",
          "Forgetting to spread at every nesting level for deep updates.",
          "Using array methods that mutate (push, pop, splice, sort).",
        ],
        followUps: [
          "How does Immer simplify immutable updates?",
          "How does immutability enable time-travel debugging?",
        ],
        interviewTips: [
          "Explain the Object.is check as the reason immutability matters.",
          "Mention Immer as a practical tool for complex nested updates.",
        ],
      },
      {
        id: "react-state-4",
        question: "When should you use useReducer instead of useState?",
        answer:
          "useReducer provides an alternative for complex state logic. It follows the Redux pattern: dispatch actions to a reducer function that computes new state based on current state and action. While useState suffices for simple values, useReducer excels when multiple values change together or transitions are complex.\n\nThe first use case is when multiple state values change together (form with name, email, errors, submission status). A single reducer handles all transitions in one place. The second is complex state machines where transitions depend on both current state and action type (network request states, multi-step wizards).\n\nuseReducer also integrates well with context. Since dispatch is stable (reference never changes), passing it through context avoids unnecessary re-renders in consuming components wrapped with React.memo. The reducer function is pure and testable independently without rendering.",
        shortAnswer:
          "Use useReducer when state is complex (multiple related values), transitions depend on current state + action type, you want testable state logic, or when providing update functions through context (dispatch is stable).",
        code: 'interface FormState {\n  name: string;\n  email: string;\n  isSubmitting: boolean;\n  error: string | null;\n}\n\ntype FormAction =\n  | { type: "SET_FIELD"; field: string; value: string }\n  | { type: "SUBMIT_START" }\n  | { type: "SUBMIT_SUCCESS" }\n  | { type: "SUBMIT_ERROR"; error: string };\n\nconst initialState: FormState = { name: "", email: "", isSubmitting: false, error: null };\n\nfunction formReducer(state: FormState, action: FormAction): FormState {\n  switch (action.type) {\n    case "SET_FIELD":\n      return { ...state, [action.field]: action.value, error: null };\n    case "SUBMIT_START":\n      return { ...state, isSubmitting: true, error: null };\n    case "SUBMIT_SUCCESS":\n      return initialState;\n    case "SUBMIT_ERROR":\n      return { ...state, isSubmitting: false, error: action.error };\n  }\n}\n\nfunction ContactForm() {\n  const [state, dispatch] = useReducer(formReducer, initialState);\n\n  async function handleSubmit(e: React.FormEvent) {\n    e.preventDefault();\n    dispatch({ type: "SUBMIT_START" });\n    try {\n      await submitForm(state);\n      dispatch({ type: "SUBMIT_SUCCESS" });\n    } catch (err) {\n      dispatch({ type: "SUBMIT_ERROR", error: (err as Error).message });\n    }\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        value={state.name}\n        onChange={e => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })}\n      />\n      {state.error && <p className="error">{state.error}</p>}\n      <button disabled={state.isSubmitting}>Submit</button>\n    </form>\n  );\n}',
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-state",
        tags: ["useReducer", "state management", "actions", "reducer"],
        commonMistakes: [
          "Using useReducer for simple toggle/counter state where useState is clearer.",
          "Putting side effects in the reducer — reducers must be pure.",
          "Forgetting to return new state in every switch case.",
        ],
        followUps: [
          "How does useReducer compare to Redux?",
          "Can you use useReducer with useContext for global state?",
        ],
        interviewTips: [
          "Explain when to choose useReducer over useState with concrete criteria.",
          "Mention that dispatch is a stable reference, ideal for context.",
        ],
      },
      {
        id: "react-state-5",
        question: "What is derived state and how should you handle it?",
        answer:
          'Derived state is any value computable from existing state or props. A filtered list from items + query is derived state. The principle is: don\'t store what you can compute. Calculate derived values during render — they are always fresh and consistent.\n\nA common anti-pattern is synchronizing state with useEffect. Storing derived values in state and updating via useEffect causes an extra render cycle and adds unnecessary complexity. If you find yourself writing useEffect to "sync" one state with another, the derived value should be computed directly during render instead.\n\nFor expensive computations, use useMemo to cache the result — it recomputes only when dependencies change. Another anti-pattern is copying props into state. If a component receives a prop and stores it in useState, prop changes are ignored because useState initializes only once. Use the prop directly, or use the key prop to reset the component.',
        shortAnswer:
          "Derived state is computable from existing state or props — compute it during render instead of storing separately. Use useMemo for expensive computations. Avoid syncing state with useEffect and copying props into state.",
        code: '// BAD: storing derived state\nfunction BadFilteredList({ items }: { items: string[] }) {\n  const [query, setQuery] = useState("");\n  const [filteredItems, setFilteredItems] = useState(items);\n\n  useEffect(() => {\n    setFilteredItems(items.filter(i => i.includes(query)));\n  }, [items, query]);\n\n  return <div>{filteredItems.map(i => <div key={i}>{i}</div>)}</div>;\n}\n\n// GOOD: compute during render\nfunction GoodFilteredList({ items }: { items: string[] }) {\n  const [query, setQuery] = useState("");\n  const filteredItems = items.filter(i => i.includes(query));\n\n  return (\n    <div>\n      <input value={query} onChange={e => setQuery(e.target.value)} />\n      {filteredItems.map(i => <div key={i}>{i}</div>)}\n    </div>\n  );\n}\n\n// useMemo for expensive computations\nfunction ExpensiveList({ items }: { items: LargeItem[] }) {\n  const [query, setQuery] = useState("");\n  const filtered = useMemo(\n    () => items.filter(i => expensiveMatch(i, query)),\n    [items, query]\n  );\n  return <VirtualList items={filtered} />;\n}',
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-state",
        tags: ["derived state", "useMemo", "anti-pattern", "useEffect"],
        commonMistakes: [
          "Storing computed values in state and syncing with useEffect.",
          "Copying props into state, ignoring prop updates.",
          "Using useMemo for trivial computations.",
        ],
        followUps: [
          "How do you decide whether to use useMemo?",
          "What is the key-reset pattern?",
        ],
        interviewTips: [
          'Frame this around "don\'t sync, compute."',
          'Mention the React docs article "You Might Not Need an Effect."',
        ],
      },
    ],
  },
  {
    id: "react-props",
    title: "Props",
    description:
      "Passing data between components via props, destructuring, children, default values, and TypeScript typing.",
    category: "React",
    difficulty: "Beginner",
    tags: ["props", "children", "destructuring", "defaults", "typescript"],
    overview:
      "Props are the mechanism for passing data from parent to child components. They are read-only, enabling unidirectional data flow. Understanding how to define, type, and use props effectively is fundamental to composable React applications.",
    concepts: [
      "Passing and destructuring props",
      "The children prop",
      "Default prop values",
      "TypeScript interfaces",
      "Prop drilling",
      "Callback props",
    ],
    relatedTopicIds: ["react-components", "react-data-flow", "react-context"],
    questions: [
      {
        id: "react-props-1",
        question: "What are props and how do they differ from state?",
        answer:
          "Props (properties) are inputs passed from parent to child as JSX attributes. They are read-only — a component cannot modify its own props. They flow unidirectionally from parent to child, making the application predictable and debuggable.\n\nState is internal data managed by the component itself, mutable through setState or the useState setter. When state changes, the component and its children re-render. A parent's state often becomes a child's props — when state changes, new props flow down.\n\nThink of props as function arguments and state as local variables. A function cannot modify its arguments but can create and modify local variables. Similarly, a component cannot modify props but can manage state.",
        shortAnswer:
          "Props are read-only inputs from parent to child (like function arguments). State is internal mutable data owned by the component (like local variables). Props flow down unidirectionally.",
        code: 'interface GreetingProps { name: string; age: number; }\n\nfunction Greeting({ name, age }: GreetingProps) {\n  return <p>{name} is {age} years old</p>;\n}\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;\n}\n\n// Parent state becomes child props\nfunction App() {\n  const [user, setUser] = useState({ name: "Alice", age: 30 });\n  return (\n    <div>\n      <Greeting name={user.name} age={user.age} />\n      <button onClick={() => setUser(u => ({ ...u, age: u.age + 1 }))}>Birthday</button>\n    </div>\n  );\n}',
        language: "tsx",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "React",
        topicId: "react-props",
        tags: ["props", "state", "unidirectional", "data flow"],
        commonMistakes: [
          "Trying to modify props inside a child component.",
          "Duplicating props into state unnecessarily.",
          "Confusing props (from parent) and state (internal).",
        ],
        followUps: [
          "Can a child communicate back to the parent?",
          "What is lifting state up?",
        ],
        interviewTips: [
          "Use the function argument vs local variable analogy.",
          "Mention unidirectional data flow as a design principle.",
        ],
      },
      {
        id: "react-props-2",
        question: "What is the children prop and how do you use it?",
        answer:
          "The children prop contains content placed between a component's opening and closing JSX tags. It allows components to act as wrappers or containers. children can be text, elements, arrays, null, or even functions (render props). The type React.ReactNode covers all cases.\n\nThis enables powerful composition: Layout, Card, Modal define structure while remaining content-agnostic. React.Children utilities (map, forEach, count, toArray) handle edge cases like null children and nested arrays when processing children programmatically.\n\nFor most cases, simply render {children} directly. The render props pattern (passing a function as children) allows parent-to-child data flow where the wrapper provides data to its content, though this pattern has been largely supplanted by hooks.",
        shortAnswer:
          "The children prop contains content between a component's tags. Typed as React.ReactNode, it enables wrapper/container patterns where components define structure while consumers provide content.",
        code: 'function Card({ title, children }: { title: string; children: React.ReactNode }) {\n  return (\n    <div className="card">\n      <h3>{title}</h3>\n      <div className="card-body">{children}</div>\n    </div>\n  );\n}\n\n<Card title="Profile">\n  <p>Name: Alice</p>\n  <p>Email: alice@example.com</p>\n</Card>\n\n// Render prop pattern\ninterface DataFetcherProps<T> {\n  url: string;\n  children: (data: T, isLoading: boolean) => React.ReactNode;\n}\n\nfunction DataFetcher<T>({ url, children }: DataFetcherProps<T>) {\n  const [data, setData] = useState<T | null>(null);\n  const [isLoading, setIsLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(url).then(r => r.json()).then(d => { setData(d); setIsLoading(false); });\n  }, [url]);\n\n  return <>{data ? children(data, isLoading) : <p>Loading...</p>}</>;\n}\n\n// React.Children utilities\nfunction List({ children }: { children: React.ReactNode }) {\n  return (\n    <ul>\n      {React.Children.map(children, (child, index) => (\n        <li key={index}>{child}</li>\n      ))}\n    </ul>\n  );\n}',
        language: "tsx",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "React",
        topicId: "react-props",
        tags: ["children", "composition", "ReactNode", "render props"],
        commonMistakes: [
          "Using React.ReactElement instead of React.ReactNode — ReactNode is broader.",
          "Assuming children is always an array.",
          "Not using React.Children.map for safe iteration.",
        ],
        followUps: [
          "What is the difference between React.ReactNode and React.ReactElement?",
          "How do you pass data to children?",
        ],
        interviewTips: [
          "Show the composition value: children makes components reusable containers.",
          "Mention React.Children utilities for edge cases.",
        ],
      },
      {
        id: "react-props-3",
        question: "What is prop drilling and how do you avoid it?",
        answer:
          "Prop drilling passes data through intermediate components that don't use it, just to reach a deeply nested consumer. If App has user data that a deeply nested Avatar needs, the data passes through Header → NavBar → UserSection → Avatar, even though intermediates never use it.\n\nThis increases coupling, makes refactoring harder (adding/removing a prop requires changes in every intermediate), and obscures data flow. Three solutions exist: Context API broadcasts data to any descendant without passing through intermediates. Component composition restructures the hierarchy so parents render nested components directly. State management libraries (Redux, Zustand) provide centralized stores.\n\nComposition should be tried first — it is simpler and keeps data flow explicit. Context suits widely-shared data (auth, theme, locale). State management libraries suit complex cross-cutting state. Don't overuse avoidance patterns for shallow trees where direct passing is clearer.",
        shortAnswer:
          "Prop drilling passes data through intermediate components that don't use it. Avoid with Context API (widely-shared data), component composition (restructure hierarchy), or state management libraries (complex global state).",
        code: '// Prop drilling problem\nfunction App() {\n  const [user] = useState({ name: "Alice", avatar: "/alice.png" });\n  return <Header user={user} />;\n}\nfunction Header({ user }: { user: User }) {\n  return <NavBar user={user} />;\n}\nfunction NavBar({ user }: { user: User }) {\n  return <Avatar src={user.avatar} />;\n}\n\n// Solution 1: Context API\nconst UserContext = createContext<User | null>(null);\n\nfunction App() {\n  const [user] = useState({ name: "Alice", avatar: "/alice.png" });\n  return (\n    <UserContext.Provider value={user}>\n      <Header />\n    </UserContext.Provider>\n  );\n}\nfunction Avatar() {\n  const user = useContext(UserContext);\n  return <img src={user?.avatar} alt={user?.name} />;\n}\n\n// Solution 2: Component composition\nfunction App() {\n  const [user] = useState({ name: "Alice", avatar: "/alice.png" });\n  return (\n    <Header>\n      <Avatar src={user.avatar} />\n    </Header>\n  );\n}\nfunction Header({ children }: { children: React.ReactNode }) {\n  return <nav>{children}</nav>;\n}',
        language: "tsx",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "React",
        topicId: "react-props",
        tags: ["prop drilling", "context", "composition", "state management"],
        commonMistakes: [
          "Reaching for context before trying composition.",
          "Using a single context for all app data.",
          "Overusing avoidance patterns for shallow trees.",
        ],
        followUps: [
          "How does Context cause performance issues?",
          "When should you use a state management library vs Context?",
        ],
        interviewTips: [
          "Show multiple solutions and explain when each is appropriate.",
          "Emphasize composition first — it is simpler.",
        ],
      },
      {
        id: "react-props-4",
        question: "How do you set default prop values in React?",
        answer:
          "The recommended approach for functional components is JavaScript default parameters in the destructuring pattern. This is idiomatic, works with TypeScript, and keeps defaults close to usage. Defaults trigger on undefined (not null).\n\nFor complex defaults like objects or arrays, define the default outside the component to avoid creating new references every render. An inline default ({}) creates a new object each render, which defeats memoization if passed to a child wrapped in React.memo.\n\nTypeScript enhances defaults by marking props as optional (?) while providing defaults in destructuring. Class components use static defaultProps, which still works but is de-emphasized in modern React.",
        shortAnswer:
          'Use JavaScript default parameters in destructuring: function Button({ size = "md" }). Define complex defaults outside the component for stable references. Defaults trigger for undefined, not null.',
        code: 'interface ButtonProps {\n  variant?: "primary" | "secondary";\n  size?: "sm" | "md" | "lg";\n  disabled?: boolean;\n  children: React.ReactNode;\n}\n\nfunction Button({\n  variant = "primary",\n  size = "md",\n  disabled = false,\n  children,\n}: ButtonProps) {\n  return (\n    <button className={`btn-${variant} btn-${size}`} disabled={disabled}>\n      {children}\n    </button>\n  );\n}\n\n// Usage — all optional props have defaults\n<Button>Click me</Button>\n<Button variant="secondary" size="lg">Large</Button>\n\n// Complex defaults — define outside for reference stability\nconst DEFAULT_STYLE: React.CSSProperties = { padding: 8, margin: 0 };\nconst DEFAULT_ITEMS: string[] = [];\n\nfunction Widget({\n  style = DEFAULT_STYLE,\n  items = DEFAULT_ITEMS,\n}: {\n  style?: React.CSSProperties;\n  items?: string[];\n}) {\n  return <div style={style}>{items.map(i => <span key={i}>{i}</span>)}</div>;\n}',
        language: "tsx",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "React",
        topicId: "react-props",
        tags: ["defaults", "destructuring", "typescript"],
        commonMistakes: [
          "Defining object/array defaults inline — creates new references every render.",
          "Confusing undefined and null — defaults only apply for undefined.",
          "Using defaultProps with functional components.",
        ],
        followUps: [
          "How does null vs undefined affect defaults?",
          "Why should complex defaults be outside the component?",
        ],
        interviewTips: [
          "Mention reference stability for object defaults.",
          "Explain the null vs undefined distinction.",
        ],
      },
      {
        id: "react-props-5",
        question: "How do you type props effectively with TypeScript?",
        answer:
          'Type props with interfaces or type aliases. For components wrapping native HTML elements, extend built-in attribute types (React.ButtonHTMLAttributes<HTMLButtonElement>) to accept both custom and native attributes. Use the rest/spread pattern to forward native props.\n\nDiscriminated unions model mutually exclusive configurations: { as: "button"; onClick: () => void } | { as: "link"; href: string }. TypeScript narrows based on the discriminant. Generic components accept type parameters flowing through props for end-to-end type safety.\n\nAvoid React.FC — it implicitly included children (fixed in React 18 types), doesn\'t support generics cleanly, and obscures the return type. Prefer typing the props parameter directly.',
        shortAnswer:
          "Type props with interfaces. Extend native HTML attributes for wrapper components. Use discriminated unions for mutually exclusive configs and generics for type-safe data components. Avoid React.FC.",
        code: '// Extending native HTML attributes\ninterface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {\n  label: string;\n  error?: string;\n}\n\nfunction TextField({ label, error, ...inputProps }: TextFieldProps) {\n  return (\n    <div>\n      <label>{label}</label>\n      <input {...inputProps} />\n      {error && <span className="error">{error}</span>}\n    </div>\n  );\n}\n\n// Discriminated union\ntype LinkOrButton =\n  | { as?: "button"; onClick: () => void; href?: never }\n  | { as: "link"; href: string; onClick?: never };\n\ntype ActionProps = LinkOrButton & { children: React.ReactNode };\n\nfunction Action(props: ActionProps) {\n  if (props.as === "link") return <a href={props.href}>{props.children}</a>;\n  return <button onClick={props.onClick}>{props.children}</button>;\n}\n\n// Generic component\ninterface SelectProps<T> {\n  items: T[];\n  value: T;\n  onChange: (value: T) => void;\n  getLabel: (item: T) => string;\n  getKey: (item: T) => string;\n}\n\nfunction Select<T>({ items, value, onChange, getLabel, getKey }: SelectProps<T>) {\n  return (\n    <select\n      value={getKey(value)}\n      onChange={e => {\n        const item = items.find(i => getKey(i) === e.target.value);\n        if (item) onChange(item);\n      }}\n    >\n      {items.map(item => (\n        <option key={getKey(item)} value={getKey(item)}>{getLabel(item)}</option>\n      ))}\n    </select>\n  );\n}',
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-props",
        tags: ["typescript", "generics", "discriminated unions", "type safety"],
        commonMistakes: [
          "Using any for props.",
          "Not extending native HTML attributes for wrapper components.",
          "Using React.FC which doesn't support generics cleanly.",
        ],
        followUps: [
          "How do you type the ref prop with forwardRef?",
          "What are Omit, Pick, and Partial useful for in props?",
        ],
        interviewTips: [
          "Show a real-world generic example.",
          "Explain why React.FC is discouraged.",
        ],
      },
    ],
  },
];
