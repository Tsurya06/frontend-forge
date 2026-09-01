import type { Topic } from "../../types";

export const classComponentTopics: Topic[] = [
  {
    id: "react-class-components",
    title: "Class Components, Lifecycle Methods & Error Boundaries",
    description:
      "Deep coverage of React class components, the legacy and modern lifecycle phases (Mounting, Updating, Unmounting), and Error Boundaries (getDerivedStateFromError, componentDidCatch).",
    category: "React",
    difficulty: "Intermediate",
    tags: [
      "react",
      "class-components",
      "lifecycle",
      "error-boundaries",
      "componentDidMount",
      "componentDidCatch",
    ],
    overview:
      "While functional components with Hooks are the modern standard in React, class components remain essential for legacy codebases and Error Boundaries (which currently still require class components). Understanding lifecycle sequencing, legacy vs modern methods, and error boundary containment is vital for senior frontend interviews.",
    concepts: [
      "Class component syntax and this binding (`this.state`, `this.setState`)",
      "Mounting phase: constructor -> static getDerivedStateFromProps -> render -> componentDidMount",
      "Updating phase: static getDerivedStateFromProps -> shouldComponentUpdate -> render -> getSnapshotBeforeUpdate -> componentDidUpdate",
      "Unmounting phase: componentWillUnmount (cleanup)",
      "Error Boundaries: static getDerivedStateFromError and componentDidCatch",
      "Deprecated lifecycles: componentWillMount, componentWillReceiveProps, componentWillUpdate",
      "Mapping class lifecycles to useEffect and useLayoutEffect",
    ],
    relatedTopicIds: ["react-components", "react-custom-hooks"],
    questions: [
      {
        id: "react-class-1",
        question:
          "Explain the complete React component lifecycle for class components across Mounting, Updating, and Unmounting phases.",
        answer:
          "React class component lifecycle comprises three phases:\n\n1. **Mounting Phase** (Creating and inserting into DOM):\n- `constructor(props)`: Initializes state and binds event handlers.\n- `static getDerivedStateFromProps(props, state)`: Syncs state with props changes before rendering (rarely needed).\n- `render()`: Pure function returning React elements.\n- `componentDidMount()`: Runs once after insertion into DOM. Ideal for API calls, subscriptions, and DOM measurements.\n\n2. **Updating Phase** (Props/State changes or forceUpdate):\n- `static getDerivedStateFromProps(props, state)`\n- `shouldComponentUpdate(nextProps, nextState)`: Performance gatekeeper returning boolean (PureComponent implements this with shallow compare).\n- `render()`\n- `getSnapshotBeforeUpdate(prevProps, prevState)`: Captures DOM info (e.g. scroll position) before changes are committed.\n- `componentDidUpdate(prevProps, prevState, snapshot)`: Runs after DOM updates are committed.\n\n3. **Unmounting Phase** (Removal from DOM):\n- `componentWillUnmount()`: Cleanup subscriptions, timers, and abort in-flight requests.\n\n4. **Error Handling Phase**:\n- `static getDerivedStateFromError(error)` and `componentDidCatch(error, info)`.",
        shortAnswer:
          "Mounting: constructor -> getDerivedStateFromProps -> render -> componentDidMount. Updating: getDerivedStateFromProps -> shouldComponentUpdate -> render -> getSnapshotBeforeUpdate -> componentDidUpdate. Unmounting: componentWillUnmount.",
        code: `import React, { Component } from 'react';

interface Props { userId: string; }
interface State { user: any; loading: boolean; }

export class UserProfile extends Component<Props, State> {
  private timerId?: number;

  constructor(props: Props) {
    super(props);
    this.state = { user: null, loading: true };
  }

  componentDidMount() {
    this.fetchUser(this.props.userId);
    this.timerId = window.setInterval(() => console.log('Ping'), 30000);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser(this.props.userId);
    }
  }

  componentWillUnmount() {
    if (this.timerId) clearInterval(this.timerId);
  }

  private async fetchUser(id: string) {
    this.setState({ loading: true });
    const res = await fetch(\`/api/users/\${id}\`);
    const user = await res.json();
    this.setState({ user, loading: false });
  }

  render() {
    const { user, loading } = this.state;
    if (loading) return <div>Loading...</div>;
    return <div>Hello, {user?.name}</div>;
  }
}`,
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-class-components",
        tags: [
          "class-components",
          "lifecycle",
          "componentDidMount",
          "componentDidUpdate",
          "componentWillUnmount",
        ],
        commonMistakes: [
          "Calling setState in componentDidUpdate without a conditional check comparing prevProps vs props, triggering an infinite render loop.",
          "Forgetting to cleanup event listeners or timers in componentWillUnmount.",
        ],
        followUps: [
          "How do getDerivedStateFromProps and getSnapshotBeforeUpdate differ from useEffect?",
        ],
        interviewTips: [
          "Trace the execution order of parent vs child componentDidMount (child mounts before parent).",
        ],
      },
      {
        id: "react-class-2",
        question:
          "What are Error Boundaries in React, how are they implemented, and what errors can they NOT catch?",
        answer:
          "**Error Boundaries** are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the whole component tree.\n\nAn Error Boundary is defined by implementing either or both:\n1. `static getDerivedStateFromError(error)`: Updates state to render fallback UI on the next render pass.\n2. `componentDidCatch(error, errorInfo)`: Logs error details, component stack traces, and sends telemetry to monitoring services (e.g. Sentry).\n\n**What Error Boundaries CANNOT Catch:**\n- Event handlers (e.g. errors inside `onClick={() => { ... }}`; use `try/catch` instead).\n- Asynchronous code (e.g. `setTimeout`, `requestAnimationFrame`, or rejected `fetch()` promises).\n- Server-Side Rendering (SSR) errors.\n- Errors thrown in the Error Boundary component itself (rather than in its children).",
        shortAnswer:
          "Error Boundaries catch errors in child component rendering, lifecycles, and constructors using static getDerivedStateFromError and componentDidCatch. They CANNOT catch errors in event handlers, async promises/timers, or SSR.",
        code: `import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  fallback?: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo.componentStack);
    // Send to monitoring service (Sentry, Datadog)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert" style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}`,
        language: "tsx",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "React",
        topicId: "react-class-components",
        tags: [
          "error-boundary",
          "componentDidCatch",
          "getDerivedStateFromError",
          "resilience",
        ],
        commonMistakes: [
          "Expecting Error Boundaries to catch async errors in fetch() or setTimeout (must use try/catch or react-error-boundary useErrorBoundary hook).",
          "Attempting to write an Error Boundary as a functional component (Hooks do not currently support getDerivedStateFromError).",
        ],
        followUps: [
          "How does react-error-boundary library allow resetting error state?",
        ],
        interviewTips: [
          "Mention the 4 exclusions (event handlers, async, SSR, self-errors) — this is a classic interview gotcha.",
        ],
      },
    ],
  },
];
