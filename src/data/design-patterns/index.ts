import type { Topic } from "../../types";

export const designPatternsTopics: Topic[] = [
  {
    id: "frontend-design-patterns",
    title: "Frontend Design Patterns",
    description:
      "Essential design patterns used in frontend development including Singleton, Factory, Module, Observer, Provider, Prototype, and Higher-Order Component patterns with practical JavaScript and React implementations.",
    category: "Design Patterns",
    difficulty: "Advanced",
    tags: [
      "singleton",
      "factory",
      "module",
      "observer",
      "provider",
      "prototype",
      "HOC",
      "design-patterns",
    ],
    overview:
      "Design patterns are reusable solutions to common software design problems. In frontend development, patterns like Singleton, Factory, Observer, and Provider are foundational to building scalable, maintainable applications. Understanding these patterns helps developers recognize recurring problems, communicate solutions using shared vocabulary, and make informed architectural decisions.",
    concepts: [
      "Singleton ensures a class has only one instance with global access",
      "Factory creates objects without specifying their exact class",
      "Module encapsulates related code with private and public interfaces",
      "Observer enables loose coupling through publish-subscribe communication",
      "Provider supplies data to a component subtree without prop drilling",
      "Prototype creates objects by cloning an existing object",
      "Higher-Order Component enhances components by wrapping them with additional functionality",
    ],
    codeExamples: [
      {
        title: "Singleton Pattern - Configuration Manager",
        code: `class ConfigManager {
  private static instance: ConfigManager;
  private config: Record<string, string> = {};

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  get(key: string): string | undefined {
    return this.config[key];
  }

  set(key: string, value: string): void {
    this.config[key] = value;
  }
}

const config = ConfigManager.getInstance();
config.set('apiUrl', 'https://api.example.com');`,
        language: "typescript",
        explanation:
          "Singleton restricts instantiation to one object. Useful for shared configuration, logging, and caching services.",
      },
      {
        title: "Observer Pattern - Event Emitter",
        code: `type Listener<T> = (data: T) => void;

class EventEmitter<Events extends Record<string, unknown>> {
  private listeners = new Map<keyof Events, Set<Listener<unknown>>>();

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener as Listener<unknown>);
    return () => this.off(event, listener);
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    this.listeners.get(event)?.delete(listener as Listener<unknown>);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.listeners.get(event)?.forEach(listener => listener(data));
  }
}`,
        language: "typescript",
        explanation:
          "Observer pattern enables loose coupling through event-driven communication. Core to frontend event systems, state management, and real-time features.",
      },
    ],
    relatedTopicIds: [],
    questions: [
      {
        id: "pattern-1",
        question:
          "Explain the Singleton pattern. How is it implemented in JavaScript/TypeScript and what are common frontend use cases?",
        answer: `The Singleton pattern restricts a class to a single instance and provides a global point of access to that instance. When any part of the application requests the singleton, it receives the same object. This ensures that shared state or functionality is centralized and consistent across the entire application. The pattern is particularly useful when exactly one object is needed to coordinate actions across the system.

In JavaScript, the Singleton pattern can be implemented in several ways. The classical approach uses a class with a private constructor and a static getInstance method. The constructor is marked private (in TypeScript) to prevent external instantiation. getInstance checks if an instance already exists — if so, it returns the existing one; otherwise, it creates a new instance, stores it, and returns it. A simpler JavaScript approach leverages ES modules themselves as singletons: since modules are evaluated once and cached, exporting an object from a module guarantees that all importers receive the same reference.

Common frontend use cases include configuration managers that hold application-wide settings (API URLs, feature flags, environment variables) and need to be consistent across all components. Logging services that centralize log handling, formatting, and transport are natural singletons. Connection managers for WebSocket or EventSource connections ensure only one connection exists to avoid duplicate subscriptions and resource waste. Cache managers provide a single shared cache layer that all data-fetching code accesses.

The Singleton pattern has notable drawbacks in frontend development. It introduces global state, which makes testing difficult — you can't easily create fresh instances for each test, leading to test interference. It creates hidden dependencies: components that use a singleton don't declare it as a dependency in their interface, making the dependency graph opaque. It hinders code splitting because the singleton must be available everywhere it's used. In React applications, the Context/Provider pattern often serves similar purposes while being more testable and explicit about dependencies. Modern best practice favors dependency injection over singletons for most use cases.`,
        shortAnswer:
          "Singleton ensures only one instance of a class exists with global access. In JavaScript, implement via a class with private constructor and static getInstance, or leverage ES module caching. Frontend uses: config managers, loggers, WebSocket connections, caches. Drawbacks include hidden dependencies, testing difficulty, and tight coupling.",
        code: `// Classic Singleton with private constructor
class ConfigManager {
  private static instance: ConfigManager;
  private config: Map<string, string> = new Map();

  private constructor() {
    this.config.set('apiUrl', 'https://api.example.com');
    this.config.set('appName', 'MyApp');
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  get(key: string): string | undefined {
    return this.config.get(key);
  }

  set(key: string, value: string): void {
    this.config.set(key, value);
  }
}

// Usage: always returns the same instance
const config1 = ConfigManager.getInstance();
const config2 = ConfigManager.getInstance();
console.log(config1 === config2); // true

// ES Module Singleton (simpler approach)
// logger.ts — module is evaluated once and cached
class Logger {
  private logs: string[] = [];

  log(message: string): void {
    const entry = \`[\${new Date().toISOString()}] \${message}\`;
    this.logs.push(entry);
    console.log(entry);
  }

  getHistory(): string[] {
    return [...this.logs];
  }
}

export const logger = new Logger(); // single instance, module-cached

// Pros: Simple global access, consistent state, lazy initialization
// Cons: Hidden dependencies, hard to test, global state issues`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Design Patterns",
        topicId: "frontend-design-patterns",
        tags: [
          "singleton",
          "creational-pattern",
          "global-state",
          "configuration",
        ],
        commonMistakes: [
          "Using singletons for state that should be scoped to a component tree (use Context instead)",
          "Not considering testability — singletons with state are hard to reset between tests",
          "Creating singletons for everything, leading to hidden coupling between modules",
          "Ignoring thread safety in server-side rendering (SSR) where multiple requests share memory",
        ],
        followUps: [
          "Why are singletons sometimes called an anti-pattern?",
          "How does the ES module system naturally implement the singleton pattern?",
          "What are alternatives to Singleton in React applications?",
        ],
        interviewTips: [
          "Show both class-based and module-based implementations",
          "Discuss trade-offs honestly — singletons are simple but have real downsides",
          "Mention that React Context/Provider often replaces singletons in modern frontend apps",
        ],
      },
      {
        id: "pattern-2",
        question:
          "Explain the Factory pattern. How do you implement a component factory in React?",
        answer: `The Factory pattern provides an interface for creating objects without specifying their exact class or constructor. Instead of using new directly, client code calls a factory function or method that determines which class to instantiate based on input parameters, configuration, or runtime conditions. This decouples the creation logic from the consuming code, making it easy to add new types without modifying existing code.

In JavaScript/TypeScript, the Factory pattern is typically implemented as a function that takes a type discriminator and returns an appropriate object. A simple factory function uses a switch statement or object map to select the right constructor or configuration. An abstract factory provides an interface for creating families of related objects. The Factory pattern naturally aligns with TypeScript's discriminated unions, where a type field determines the shape of the rest of the object.

In React, the Factory pattern is extremely common for dynamic component rendering. A component factory maps type identifiers to React components, then a renderer component uses this mapping to instantiate the correct component based on data. This is the foundation of form builders (rendering different input types), dashboard builders (rendering different widget types), content management systems (rendering different block types), and notification systems (rendering different notification styles). The pattern enables data-driven UI where the backend determines what to render without the frontend needing to know all possibilities upfront.

The Factory pattern's main advantage is extensibility through the Open/Closed Principle — you can add new types by adding to the factory mapping without modifying the rendering code. It also enables lazy loading: the factory can use dynamic imports to load component code only when that type is needed. The main drawback is the indirection it introduces — following the code from data to rendered component requires looking up the factory mapping. For simple cases with only two or three types, a direct conditional is clearer than a factory.`,
        shortAnswer:
          "Factory creates objects without specifying their exact class, using a type discriminator to select the right constructor. In React, component factories map type strings to components for dynamic rendering. Use cases: form builders, dashboard widgets, CMS block renderers. Advantages: extensibility (Open/Closed Principle), lazy loading support.",
        code: `// Simple Factory function
interface Notification {
  type: string;
  message: string;
  render(): string;
}

function createNotification(
  type: 'success' | 'error' | 'warning',
  message: string
): Notification {
  const styles = {
    success: { icon: '✓', color: 'green' },
    error: { icon: '✗', color: 'red' },
    warning: { icon: '⚠', color: 'orange' },
  };
  const style = styles[type];
  return {
    type,
    message,
    render: () => \`[\${style.icon}] \${message}\`,
  };
}

// React Component Factory
interface WidgetProps {
  config: Record<string, unknown>;
}

const widgetRegistry: Record<string, React.ComponentType<WidgetProps>> = {
  chart: ChartWidget,
  table: TableWidget,
  metric: MetricWidget,
  text: TextWidget,
};

function registerWidget(type: string, component: React.ComponentType<WidgetProps>) {
  widgetRegistry[type] = component;
}

function WidgetFactory({ type, config }: { type: string; config: Record<string, unknown> }) {
  const Widget = widgetRegistry[type];
  if (!Widget) {
    return <div>Unknown widget type: {type}</div>;
  }
  return <Widget config={config} />;
}

// Dashboard using the factory
interface DashboardConfig {
  widgets: Array<{ id: string; type: string; config: Record<string, unknown> }>;
}

function Dashboard({ config }: { config: DashboardConfig }) {
  return (
    <div className="dashboard-grid">
      {config.widgets.map(widget => (
        <WidgetFactory
          key={widget.id}
          type={widget.type}
          config={widget.config}
        />
      ))}
    </div>
  );
}

// Factory with lazy loading
const lazyWidgetRegistry: Record<string, () => Promise<{ default: React.ComponentType<WidgetProps> }>> = {
  chart: () => import('./widgets/ChartWidget'),
  table: () => import('./widgets/TableWidget'),
};

function LazyWidgetFactory({ type, config }: { type: string; config: Record<string, unknown> }) {
  const LazyWidget = useMemo(
    () => lazy(lazyWidgetRegistry[type] ?? (() => import('./widgets/FallbackWidget'))),
    [type]
  );
  return (
    <Suspense fallback={<WidgetSkeleton />}>
      <LazyWidget config={config} />
    </Suspense>
  );
}

// Pros: Extensible, decoupled, supports lazy loading
// Cons: Indirection, harder to trace data flow, type safety requires careful setup`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "Design Patterns",
        topicId: "frontend-design-patterns",
        tags: [
          "factory",
          "creational-pattern",
          "component-factory",
          "React",
          "dynamic-rendering",
        ],
        commonMistakes: [
          "Using a factory for only two types — a simple conditional is clearer",
          "Not providing a fallback for unknown types, causing runtime errors",
          "Losing type safety in the factory mapping — use TypeScript generics to maintain types",
          "Not memoizing lazy components, causing re-creation on every render",
        ],
        followUps: [
          "What is the difference between Factory and Abstract Factory patterns?",
          "How does the Factory pattern support the Open/Closed Principle?",
          "How would you add plugin support using the Factory pattern?",
        ],
        interviewTips: [
          "Show a practical React use case like a dashboard or form builder",
          "Mention extensibility and the Open/Closed Principle as key benefits",
          "Demonstrate the lazy loading variant for bonus points",
        ],
      },
      {
        id: "pattern-3",
        question:
          "Explain the Module pattern. How does it achieve encapsulation in JavaScript and what are its modern equivalents?",
        answer: `The Module pattern is a design pattern that provides a way to encapsulate related code into a single unit with private and public interfaces. It leverages JavaScript's closures and function scoping to create private variables and methods that are inaccessible from outside the module, while selectively exposing a public API. This pattern was essential before ES modules existed, providing namespace management and information hiding in a language that lacked built-in module support.

The classic Module pattern uses an Immediately Invoked Function Expression (IIFE) to create a closure. Variables and functions declared inside the IIFE are private by default. The IIFE returns an object containing references to the functions and variables that should be public. External code can only interact with the module through this returned public interface. The Revealing Module Pattern is a variation where all functions are defined privately, and the returned object maps public names to private implementations, making it easy to see the entire public API at a glance.

In modern JavaScript, ES modules (import/export) have largely replaced the IIFE-based Module pattern, but the encapsulation principle remains identical. Variables not exported from a module are private — they can't be accessed by importing code. Named exports define the public interface. The \`#\` private class fields syntax (ES2022) provides true private fields at the language level, enforced by the runtime rather than by convention. TypeScript's private/protected modifiers provide compile-time encapsulation, though they don't enforce privacy at runtime.

In React, the Module pattern manifests in several ways. Custom hooks encapsulate stateful logic and expose only the return value as the public interface — internal state management is hidden. Context modules encapsulate shared state with a clean API. Barrel files (index.ts) control what a directory exports, creating a module boundary. Component libraries use the pattern to expose a clean public API while hiding internal helper components and utilities. The pattern's core value — hiding complexity behind a simple interface — is a fundamental principle in all frontend architecture.`,
        shortAnswer:
          "The Module pattern encapsulates code with private internals and a public API using closures (IIFE) or ES modules. Private variables are inaccessible outside; only explicitly exported/returned members are public. Modern equivalents: ES module exports, # private fields, TypeScript access modifiers, React custom hooks.",
        code: `// Classic Module Pattern (IIFE)
const CounterModule = (() => {
  let count = 0; // private
  const MAX = 100; // private

  function validate(value: number): boolean { // private
    return value >= 0 && value <= MAX;
  }

  return {
    increment(): number {
      if (validate(count + 1)) count++;
      return count;
    },
    decrement(): number {
      if (validate(count - 1)) count--;
      return count;
    },
    getCount(): number {
      return count;
    },
  };
})();

CounterModule.increment(); // 1
// CounterModule.count — undefined (private)
// CounterModule.validate — undefined (private)

// Revealing Module Pattern
const UserModule = (() => {
  const users: Map<string, User> = new Map();

  function addUser(user: User): void {
    users.set(user.id, user);
  }

  function getUser(id: string): User | undefined {
    return users.get(id);
  }

  function getAllUsers(): User[] {
    return Array.from(users.values());
  }

  return { addUser, getUser, getAllUsers };
})();

// ES Module equivalent (modern)
// userStore.ts
const users = new Map<string, User>(); // private (not exported)

export function addUser(user: User): void {
  users.set(user.id, user);
}

export function getUser(id: string): User | undefined {
  return users.get(id);
}

// Private class fields (ES2022)
class ApiClient {
  #baseUrl: string;
  #token: string | null = null;

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl;
  }

  setToken(token: string): void {
    this.#token = token;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(\`\${this.#baseUrl}\${path}\`, {
      headers: this.#token ? { Authorization: \`Bearer \${this.#token}\` } : {},
    });
    return response.json();
  }
}

// React: Custom hook as Module pattern
function useCounter(initial = 0, max = 100) {
  const [count, setCount] = useState(initial); // private state

  const increment = useCallback(() => {
    setCount(c => Math.min(c + 1, max));
  }, [max]);

  const decrement = useCallback(() => {
    setCount(c => Math.max(c - 1, 0));
  }, []);

  return { count, increment, decrement }; // public API
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Design Patterns",
        topicId: "frontend-design-patterns",
        tags: [
          "module",
          "encapsulation",
          "IIFE",
          "closures",
          "private-fields",
          "ES-modules",
        ],
        commonMistakes: [
          "Exposing internal state directly instead of through accessor methods",
          "Using TypeScript private modifier and assuming runtime privacy (it only enforces at compile time)",
          "Over-encapsulating: making everything private makes testing difficult",
          "Not using barrel files to control module boundaries in larger projects",
        ],
        followUps: [
          "What is the difference between the Module pattern and the Revealing Module pattern?",
          "How do ES modules provide encapsulation compared to the IIFE approach?",
          "What are TypeScript's private vs # private fields?",
        ],
        interviewTips: [
          "Explain the evolution: IIFE → CommonJS → ES modules → private class fields",
          "Connect to React: custom hooks are the modern Module pattern for stateful logic",
          "Mention that encapsulation is about hiding complexity, not just restricting access",
        ],
      },
      {
        id: "pattern-4",
        question:
          "Explain the Observer pattern. How is it used in frontend event systems and state management?",
        answer: `The Observer pattern defines a one-to-many dependency between objects where one object (the subject/observable) maintains a list of dependents (observers) and notifies them automatically of state changes. When the subject's state changes, all registered observers are notified and can react accordingly. This enables loose coupling — the subject doesn't need to know the specific classes of its observers, only that they implement a notification interface.

In JavaScript, the Observer pattern is ubiquitous. The DOM event system is the most fundamental example: addEventListener registers an observer (callback function) on a subject (DOM element) for a specific event type. When the event occurs, all registered observers are called. The pattern is also the foundation of Node.js's EventEmitter class, RxJS observables, and custom event bus implementations. The browser's MutationObserver, IntersectionObserver, and ResizeObserver APIs are all observer implementations for specific DOM changes.

In frontend state management, the Observer pattern is the core mechanism behind reactivity. Redux uses it: the store is the subject, and components subscribe as observers via useSelector. When dispatch changes the state, all subscribed components are notified and re-render if their selected state changed. Zustand, MobX, and Jotai all implement variations of the Observer pattern. React's own useState and useContext use a subscription mechanism internally — when state changes, React notifies the component to re-render.

The Observer pattern excels at decoupling event producers from consumers. An analytics module can observe user actions without the UI code knowing analytics exists. A notification system can observe multiple data sources (WebSocket messages, API responses, user actions) and display alerts without coupling to each source. The main drawback is that complex observer chains can become difficult to debug — when many observers react to the same event, understanding the cascade of effects requires tracing through all subscriptions. Memory leaks are another concern: forgetting to unsubscribe (remove the observer) when a component unmounts leaves dangling references that prevent garbage collection.`,
        shortAnswer:
          "Observer establishes one-to-many dependencies where a subject notifies all registered observers of state changes. Frontend examples: DOM events (addEventListener), Redux subscriptions, RxJS observables, IntersectionObserver. Enables loose coupling between event producers and consumers. Key concern: always unsubscribe to prevent memory leaks.",
        code: `// Type-safe EventEmitter (Observer pattern)
type EventMap = {
  userLogin: { userId: string; timestamp: number };
  cartUpdate: { items: CartItem[]; total: number };
  notification: { message: string; type: 'info' | 'error' };
};

class TypedEventEmitter<T extends Record<string, unknown>> {
  private listeners = new Map<keyof T, Set<(data: never) => void>>();

  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as (data: never) => void);

    return () => this.off(event, callback);
  }

  off<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    this.listeners.get(event)?.delete(callback as (data: never) => void);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners.get(event)?.forEach(cb => cb(data as never));
  }
}

// Usage
const events = new TypedEventEmitter<EventMap>();

const unsubscribe = events.on('cartUpdate', ({ items, total }) => {
  console.log(\`Cart: \${items.length} items, $\${total}\`);
});

events.emit('cartUpdate', { items: [{ id: '1', name: 'Widget', price: 10 }], total: 10 });
unsubscribe(); // clean up

// React: Custom hook using Observer pattern
function useEventListener<K extends keyof EventMap>(
  event: K,
  handler: (data: EventMap[K]) => void
): void {
  useEffect(() => {
    const unsubscribe = events.on(event, handler);
    return unsubscribe; // cleanup on unmount
  }, [event, handler]);
}

// Component observing events
function NotificationBar() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEventListener('notification', ({ message }) => {
    setNotifications(prev => [...prev, message]);
  });

  return (
    <div>
      {notifications.map((msg, i) => (
        <div key={i} className="notification">{msg}</div>
      ))}
    </div>
  );
}

// Pros: Loose coupling, extensible, supports broadcast communication
// Cons: Hard to debug event chains, memory leaks if not unsubscribed, ordering issues`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "Design Patterns",
        topicId: "frontend-design-patterns",
        tags: [
          "observer",
          "behavioral-pattern",
          "events",
          "pub-sub",
          "state-management",
        ],
        commonMistakes: [
          "Not unsubscribing when components unmount, causing memory leaks and stale callbacks",
          "Creating circular observer chains where A observes B and B observes A",
          "Not handling errors in observer callbacks — one failing observer shouldn't crash others",
          "Overusing events for simple parent-child communication where props/callbacks suffice",
        ],
        followUps: [
          "What is the difference between Observer and Pub/Sub patterns?",
          "How does React's reactivity model implement the Observer pattern?",
          "How do you debug complex event chains in production?",
        ],
        interviewTips: [
          "Connect to familiar APIs: addEventListener is the Observer pattern in action",
          "Mention the cleanup responsibility — useEffect return function unsubscribes",
          "Show type-safe implementation to demonstrate TypeScript proficiency",
        ],
      },
      {
        id: "pattern-5",
        question:
          "Explain the Provider pattern. How does React Context implement it and what are its trade-offs?",
        answer: `The Provider pattern makes data available to a subtree of components without explicitly passing it through every level of the component hierarchy (prop drilling). A Provider component wraps a section of the component tree and makes certain data or functionality available to any descendant that requests it. This pattern decouples data producers from data consumers, allowing them to communicate without intermediate components being aware of or involved in passing the data.

React's Context API is the standard implementation of the Provider pattern. createContext creates a context object. The Context.Provider component accepts a value prop and makes it available to all descendants. Any descendant component can consume the context using the useContext hook. The consuming component will automatically re-render when the context value changes. This pattern eliminates prop drilling — instead of passing theme, locale, or auth data through 10 levels of components, each component that needs the data accesses it directly from the nearest Provider.

The Provider pattern is used extensively in React for cross-cutting concerns: theme management (ThemeProvider), internationalization (IntlProvider), authentication (AuthProvider), routing (RouterProvider), state management (Redux Provider, Zustand), and data fetching (QueryClientProvider). These concerns affect many components throughout the tree and are impractical to pass as props. The pattern also enables inversion of control — the parent determines what value to provide, while children define what they need, promoting flexible composition.

The primary trade-off is performance. When a context value changes, every consumer of that context re-renders, even if they only use a portion of the value that hasn't changed. A monolithic context that combines theme, auth, and locale data causes all consumers to re-render when any one piece changes. Mitigations include: splitting contexts by update frequency (separate ThemeContext from AuthContext), memoizing context values with useMemo, using libraries like use-context-selector for granular subscriptions, or using a state management library with built-in selector support. Another drawback is that context values are invisible in the component's props, making data flow harder to trace compared to explicit props.`,
        shortAnswer:
          "Provider makes data available to a component subtree without prop drilling. React Context implements it: createContext + Provider + useContext. Used for themes, auth, i18n, routing. Trade-off: all consumers re-render on any context value change. Mitigate by splitting contexts, memoizing values, or using selector libraries.",
        code: `// React Context as Provider pattern
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: { bg: string; text: string; primary: string };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
    colors: theme === 'light'
      ? { bg: '#ffffff', text: '#000000', primary: '#0066cc' }
      : { bg: '#1a1a1a', text: '#ffffff', primary: '#4da6ff' },
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Composing multiple providers
function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <I18nProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </I18nProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Consumer component
function Header() {
  const { theme, toggleTheme, colors } = useTheme();
  const { user } = useAuth();

  return (
    <header style={{ backgroundColor: colors.bg, color: colors.text }}>
      <h1>App</h1>
      <span>{user?.name}</span>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </header>
  );
}

// Split contexts to prevent unnecessary re-renders
const ThemeValueContext = createContext<'light' | 'dark'>('light');
const ThemeActionsContext = createContext<{ toggleTheme: () => void }>({
  toggleTheme: () => {},
});

// Components using only actions don't re-render when theme value changes
function ThemeToggle() {
  const { toggleTheme } = useContext(ThemeActionsContext);
  return <button onClick={toggleTheme}>Toggle</button>;
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Design Patterns",
        topicId: "frontend-design-patterns",
        tags: [
          "provider",
          "React-Context",
          "prop-drilling",
          "composition",
          "dependency-injection",
        ],
        commonMistakes: [
          "Creating one giant context for all app state, causing excessive re-renders",
          "Not memoizing context values, creating new references on every render",
          "Not providing a custom hook (useTheme) with an error message for using context outside provider",
          "Using context for frequently changing values (mouse position, scroll) — use a subscription-based approach instead",
        ],
        followUps: [
          "When should you use Context vs. a state management library?",
          "How do you optimize context to prevent unnecessary re-renders?",
          "What is the compound component pattern and how does it use context?",
        ],
        interviewTips: [
          "Explain the problem Provider solves: prop drilling in deep component trees",
          "Show the complete pattern: createContext + Provider + useContext + custom hook",
          "Discuss the re-render problem and mitigation strategies (split, memoize, selectors)",
        ],
      },
      {
        id: "pattern-6",
        question:
          "Explain the Prototype pattern. How is it used in JavaScript for object creation and cloning?",
        answer: `The Prototype pattern creates new objects by cloning an existing object (the prototype) rather than constructing from scratch. Instead of defining a class and calling new, you copy an existing instance and modify the clone as needed. This is useful when object creation is expensive, when you want to avoid complex constructor logic, or when you need many similar objects with slight variations.

JavaScript is fundamentally a prototype-based language. Every object has an internal [[Prototype]] link (accessible via Object.getPrototypeOf or the __proto__ property) pointing to another object. When you access a property on an object that doesn't exist on that object directly, JavaScript walks up the prototype chain looking for it. Constructor functions and class syntax are syntactic abstractions over this prototype-based inheritance. Object.create(proto) creates a new object with proto as its prototype, directly implementing the Prototype pattern.

For practical object cloning in frontend development, the Prototype pattern is implemented through various cloning strategies. Shallow cloning with the spread operator ({...obj}) or Object.assign creates a new object with copies of the original's own properties, but nested objects remain shared references. Deep cloning with structuredClone (modern standard), JSON.parse(JSON.stringify(obj)) (limited — loses functions, Dates, etc.), or libraries like Lodash's cloneDeep creates fully independent copies. The choice depends on the data structure and whether nested mutation independence is needed.

In frontend applications, the Prototype pattern appears in configuration objects (clone a default config and override specific properties), immutable state management (Redux reducers create new state objects based on previous state), form handling (clone initial form values for reset functionality), undo/redo systems (snapshot state by cloning), and test data factories (clone a template object and override for each test). React's immutability requirement for state updates is essentially the Prototype pattern applied at the state management level — you always create new objects based on previous state rather than mutating in place.`,
        shortAnswer:
          "Prototype creates objects by cloning existing instances rather than constructing from scratch. JavaScript is natively prototype-based (prototype chain, Object.create). Practical cloning: spread operator (shallow), structuredClone (deep). Frontend uses: config defaults, immutable state updates, form reset values, undo/redo snapshots, test factories.",
        code: `// JavaScript's prototypal inheritance
const vehiclePrototype = {
  type: 'vehicle',
  start() { return \`\${this.name} started\`; },
  stop() { return \`\${this.name} stopped\`; },
};

const car = Object.create(vehiclePrototype);
car.name = 'Tesla Model 3';
car.type = 'car';
car.start(); // "Tesla Model 3 started"

// Prototype pattern for configuration
const defaultConfig = {
  theme: 'light' as const,
  language: 'en',
  notifications: { email: true, push: true, sms: false },
  accessibility: { fontSize: 16, highContrast: false },
};

function createUserConfig(overrides: DeepPartial<typeof defaultConfig>) {
  return structuredClone({ ...defaultConfig, ...overrides });
}

const userConfig = createUserConfig({
  theme: 'dark' as const,
  notifications: { email: true, push: false, sms: false },
});

// Prototype pattern in state management (Redux-style)
interface AppState {
  items: Item[];
  selectedId: string | null;
  filters: { status: string; search: string };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_ITEM':
      return { ...state, selectedId: action.payload }; // clone + modify
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] }; // clone array
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }, // nested clone
      };
    default:
      return state;
  }
}

// Form reset using prototype
function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const prototype = useRef(structuredClone(initialValues)); // preserve original
  const [values, setValues] = useState(structuredClone(initialValues));

  const reset = useCallback(() => {
    setValues(structuredClone(prototype.current)); // clone from prototype
  }, []);

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [key]: value }));
  }, []);

  return { values, setValue, reset };
}

// Pros: Efficient creation, avoids constructor complexity, natural in JS
// Cons: Deep cloning can be expensive, shared prototype mutations affect all clones`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Design Patterns",
        topicId: "frontend-design-patterns",
        tags: [
          "prototype",
          "creational-pattern",
          "cloning",
          "Object.create",
          "immutability",
        ],
        commonMistakes: [
          "Using shallow copy when deep copy is needed — nested objects remain shared references",
          "Mutating the prototype object, unintentionally affecting all objects derived from it",
          "Using JSON.parse(JSON.stringify()) for cloning objects with Dates, functions, or Maps",
          "Not using structuredClone (available in all modern browsers and Node 17+) for deep copies",
        ],
        followUps: [
          "What is the difference between prototypal and classical inheritance?",
          "How does structuredClone compare to JSON parse/stringify for cloning?",
          "How does React's immutability requirement relate to the Prototype pattern?",
        ],
        interviewTips: [
          "Explain that JavaScript is natively prototype-based, making this pattern fundamental",
          "Show practical examples: config cloning, state updates, form reset",
          "Discuss shallow vs. deep cloning trade-offs",
        ],
      },
      {
        id: "pattern-7",
        question:
          "What is the Higher-Order Component (HOC) pattern in React? When should you use it vs. hooks?",
        answer: `A Higher-Order Component (HOC) is a function that takes a component and returns a new enhanced component with additional props, behavior, or rendering logic. It's the component equivalent of a higher-order function — just as a higher-order function takes a function and returns an enhanced function, an HOC takes a component and returns an enhanced component. The original component is wrapped, not modified, preserving the single responsibility principle.

HOCs were the primary pattern for cross-cutting concerns in React before hooks were introduced. The pattern works by creating a wrapper component that manages some shared logic (data fetching, authentication, logging, theming) and passes the results as props to the wrapped component. The most well-known examples are Redux's connect(), React Router's withRouter(), and relay's createFragmentContainer(). An HOC like withAuth checks authentication state and either renders the wrapped component (if authenticated) or redirects to login.

Since React 16.8 introduced hooks, most use cases for HOCs have been replaced by custom hooks, which offer a simpler, more composable approach. Custom hooks compose linearly (call multiple hooks sequentially), while HOCs compose by nesting (wrapping components in layers), which creates the "wrapper hell" visible in React DevTools. Hooks don't have the props collision problem (two HOCs passing the same prop name), the ref forwarding complexity, or the static method hoisting issues that plague HOCs.

However, HOCs still have valid use cases in modern React. They're appropriate for class components that can't use hooks, for conditionally rendering components (an auth HOC that renders nothing or a fallback is cleaner than conditional rendering in every component), for injecting props from external systems (connecting to legacy stores or third-party integrations), and for adding wrapper elements (error boundaries, Suspense, providers) around components declaratively. The general guideline is: use hooks for logic reuse and HOCs for component-level concerns (wrapping, conditional rendering, provider injection). In practice, most new code should use hooks, but understanding HOCs remains important for maintaining existing codebases and for the rare cases where they're still the best tool.`,
        shortAnswer:
          "HOCs are functions that take a component and return an enhanced component with additional behavior. They were the pre-hooks pattern for cross-cutting concerns (auth, data fetching, theming). Custom hooks have replaced most HOC use cases with simpler composition. HOCs remain useful for class components, conditional rendering, and wrapper injection.",
        code: `// HOC: withAuth - conditionally render based on authentication
interface WithAuthProps {
  user: User;
}

function withAuth<P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<Omit<P, keyof WithAuthProps>> {
  return function AuthenticatedComponent(props) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" />;

    return <WrappedComponent {...(props as P)} user={user} />;
  };
}

// Usage
function Dashboard({ user }: { user: User }) {
  return <h1>Welcome, {user.name}</h1>;
}

const ProtectedDashboard = withAuth(Dashboard);
// <ProtectedDashboard /> — no need to pass user prop

// HOC: withLogging - add lifecycle logging
function withLogging<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  return function LoggedComponent(props: P) {
    useEffect(() => {
      console.log(\`\${componentName} mounted\`);
      return () => console.log(\`\${componentName} unmounted\`);
    }, []);

    useEffect(() => {
      console.log(\`\${componentName} updated\`, props);
    });

    return <WrappedComponent {...props} />;
  };
}

// HOC composition (wrapper hell problem)
const EnhancedComponent = withAuth(
  withTheme(
    withLogging(
      withErrorBoundary(MyComponent, 'MyComponent'),
      'MyComponent'
    )
  )
);

// EQUIVALENT with hooks (simpler)
function MyComponent() {
  const { user } = useAuth();       // was withAuth
  const { theme } = useTheme();     // was withTheme
  useLogging('MyComponent');         // was withLogging

  if (!user) return <Navigate to="/login" />;

  return <div style={{ color: theme.text }}>Hello, {user.name}</div>;
}

// When HOCs still make sense: wrapping with providers/boundaries
function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback: React.ReactNode
): React.FC<P> {
  return function BoundedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// Pros: Works with class components, declarative wrapping, conditional rendering
// Cons: Wrapper hell, prop collision, ref forwarding, harder to type in TS`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Design Patterns",
        topicId: "frontend-design-patterns",
        tags: [
          "HOC",
          "higher-order-component",
          "React",
          "composition",
          "hooks-comparison",
        ],
        commonMistakes: [
          "Creating HOCs inside render functions — creates a new component type on each render, losing state",
          "Not forwarding refs — the wrapped component can't be referenced from parent",
          "Prop name collisions when multiple HOCs inject props with the same name",
          "Not copying static methods from the wrapped component to the HOC result",
        ],
        followUps: [
          "What are render props and how do they compare to HOCs?",
          "How do you handle ref forwarding in HOCs?",
          "What is the compound component pattern?",
        ],
        interviewTips: [
          "Show you understand both the pattern and its modern alternatives (hooks)",
          "Explain when HOCs are still appropriate vs. when hooks are better",
          "Mention the wrapper hell and prop collision problems as key HOC drawbacks",
        ],
      },
      {
        id: "pattern-8",
        question:
          "Compare all seven design patterns (Singleton, Factory, Module, Observer, Provider, Prototype, HOC). When would you choose each in a frontend project?",
        answer: `Each design pattern addresses a specific category of problem in software design. Understanding when to apply each pattern — and when not to — is what separates a developer who knows patterns from one who uses them effectively. In frontend development, these seven patterns cover the major categories: object creation (Singleton, Factory, Prototype), code organization (Module), communication (Observer), dependency management (Provider), and component enhancement (HOC).

**Creational patterns** (Singleton, Factory, Prototype) address how objects are created. Use Singleton when exactly one instance should exist globally — configuration managers, connection pools, or application-wide caches. Use Factory when you need to create objects of different types based on runtime conditions — component registries, notification systems, or form field generators. Use Prototype when you need many similar objects with slight variations — default configurations, immutable state updates, or test data factories. In React, Factory is the most commonly used creational pattern (dynamic component rendering), while Singleton is largely replaced by Context/Provider.

**Structural/organizational patterns** (Module, Provider) address how code is structured and how components access shared concerns. Use Module when you need to encapsulate related functionality with a clean public API and hidden internals — utility libraries, service layers, custom hooks. Use Provider when you need to make data available to a component subtree without prop drilling — themes, authentication, localization, state management. Provider is arguably the most important pattern in React architecture, as it's the foundation of the entire context system and most state management libraries.

**Behavioral patterns** (Observer) and **component patterns** (HOC) address how objects communicate and how components are enhanced. Use Observer when you need loose coupling between event producers and consumers — real-time notifications, analytics tracking, cross-module communication. Use HOC when you need to add behavior to components declaratively, particularly when working with class components or when you need conditional rendering wrappers. In modern React, hooks have largely replaced both HOCs (for logic reuse) and some Observer use cases (state management with subscriptions), but understanding these patterns remains essential for designing systems, maintaining legacy code, and recognizing when the underlying principle applies even if the implementation mechanism has changed.

The key principle is to match the pattern to the problem, not the other way around. Over-engineering with patterns adds complexity without value. Start with the simplest solution (props, hooks, modules) and introduce patterns when the simple approach creates clear pain points (prop drilling → Provider, conditional rendering boilerplate → Factory, duplicate state management logic → Observer/custom hooks). Patterns are tools in your toolbox, not requirements to check off.`,
        shortAnswer:
          "Singleton: one global instance (config, cache). Factory: dynamic object/component creation by type. Module: encapsulation with public API. Observer: event-driven loose coupling. Provider: dependency injection for component trees. Prototype: object cloning for immutable updates. HOC: declarative component enhancement. Choose based on the specific problem; prefer simplicity over pattern application.",
        difficulty: "Advanced",
        type: "Scenario",
        category: "Design Patterns",
        topicId: "frontend-design-patterns",
        tags: [
          "design-patterns",
          "architecture",
          "comparison",
          "decision-making",
        ],
        commonMistakes: [
          "Applying patterns prematurely — solve the problem simply first, then refactor to patterns if needed",
          "Using Singleton when Provider/Context would be more testable and explicit",
          "Choosing HOCs over hooks in new code without a specific reason like class component support",
          "Implementing Observer when simple props or callbacks would suffice for parent-child communication",
        ],
        followUps: [
          "Can you combine multiple patterns in one solution? Give an example.",
          "How do design patterns relate to SOLID principles?",
          "What other patterns are common in frontend (Mediator, Strategy, Decorator)?",
        ],
        interviewTips: [
          "Organize by problem category: creation → structure → behavior → enhancement",
          "Give a concrete use case for each pattern, not just the definition",
          "Show maturity by discussing when NOT to use patterns — simplicity is valuable",
        ],
      },
      {
        id: "pattern-9",
        question:
          "How would you implement a real-time notification system using the Observer pattern?",
        answer: `Implementing a real-time notification system is a classic application of the Observer pattern where multiple parts of the application need to react to incoming notifications without tight coupling. The system needs a central notification manager (subject) that receives notifications from various sources (WebSocket, API polling, user actions) and broadcasts them to registered UI components (observers) that display or react to those notifications.

The architecture consists of three layers. The notification service layer connects to the data source (WebSocket for real-time, or polling for simpler setups) and emits raw notification events. The notification manager layer maintains the list of observers, handles notification state (read/unread, categories, priorities), and provides methods for subscribing, filtering, and managing notifications. The UI layer consists of observer components that subscribe to the manager and re-render when relevant notifications arrive — a bell icon showing unread count, a notification dropdown listing recent items, and toast components for high-priority alerts.

The Observer pattern provides key benefits here. Components can subscribe to only the notification types they care about — the toast system observes only urgent notifications while the dropdown shows all types. New notification consumers can be added (a notification sound player, an analytics tracker) without modifying the notification manager. The WebSocket connection is decoupled from the UI — the manager bridges them, so changing the transport layer (WebSocket to SSE, or adding a polling fallback) doesn't affect any UI component.

The implementation uses a typed EventEmitter for type safety, a React context/provider for making the notification system available to components, and custom hooks for subscribing to notifications with automatic cleanup. The custom hook pattern ensures that when a component unmounts, its subscription is automatically removed, preventing memory leaks and stale callback execution. For performance, notifications are stored in state using useReducer for predictable updates, and individual notification components use React.memo to prevent unnecessary re-renders when other notifications change.`,
        shortAnswer:
          "A notification system uses Observer with three layers: a notification service (WebSocket/API source), a notification manager (subject maintaining observer subscriptions and state), and UI components (observers subscribing via custom hooks). The pattern enables loose coupling, filtered subscriptions, and easy extensibility for new consumers.",
        code: `// Notification types
interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

type NotificationEvents = {
  added: Notification;
  removed: string;
  read: string;
  cleared: void;
};

// Notification Manager (Subject/Observable)
class NotificationManager {
  private notifications: Notification[] = [];
  private emitter = new TypedEventEmitter<NotificationEvents>();

  add(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const full: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      read: false,
    };
    this.notifications.unshift(full);
    this.emitter.emit('added', full);
    return full;
  }

  markRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.emitter.emit('read', id);
    }
  }

  getAll(): Notification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  onAdded(cb: (n: Notification) => void): () => void {
    return this.emitter.on('added', cb);
  }

  onRead(cb: (id: string) => void): () => void {
    return this.emitter.on('read', cb);
  }
}

// React integration via Provider pattern
const NotificationContext = createContext<NotificationManager | null>(null);

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const manager = useRef(new NotificationManager()).current;

  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com/notifications');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      manager.add(data);
    };
    return () => ws.close();
  }, [manager]);

  return (
    <NotificationContext.Provider value={manager}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook: subscribe to notifications (Observer)
function useNotifications() {
  const manager = useContext(NotificationContext)!;
  const [notifications, setNotifications] = useState(manager.getAll());
  const [unreadCount, setUnreadCount] = useState(manager.getUnreadCount());

  useEffect(() => {
    const unsubAdded = manager.onAdded(() => {
      setNotifications(manager.getAll());
      setUnreadCount(manager.getUnreadCount());
    });
    const unsubRead = manager.onRead(() => {
      setNotifications(manager.getAll());
      setUnreadCount(manager.getUnreadCount());
    });
    return () => { unsubAdded(); unsubRead(); };
  }, [manager]);

  return { notifications, unreadCount, markRead: manager.markRead.bind(manager) };
}

// Observer components
function NotificationBell() {
  const { unreadCount } = useNotifications();
  return (
    <button aria-label={\`\${unreadCount} unread notifications\`}>
      🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
    </button>
  );
}`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "Design Patterns",
        topicId: "frontend-design-patterns",
        tags: [
          "observer",
          "notifications",
          "real-time",
          "WebSocket",
          "architecture",
        ],
        commonMistakes: [
          "Not unsubscribing from the notification manager when components unmount",
          "Storing the full notification list in every observer instead of using the centralized manager",
          "Not handling WebSocket reconnection when the connection drops",
          "Blocking the main thread with synchronous notification processing in high-volume scenarios",
        ],
        followUps: [
          "How would you add notification persistence using localStorage or IndexedDB?",
          "How do you handle notification ordering and deduplication?",
          "How would you implement notification grouping for high-volume applications?",
        ],
        interviewTips: [
          "Show the full architecture: data source → manager → observers",
          "Demonstrate the loose coupling benefit: adding new observers doesn't modify the manager",
          "Include cleanup in the React hook to show you understand memory leak prevention",
        ],
      },
    ],
  },
];
