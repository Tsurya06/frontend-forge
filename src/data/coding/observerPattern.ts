import type { CodingProblem } from "../../types";

export const observerPatternProblem: CodingProblem = {
  id: "coding-observer-pattern",
  title: "Implement the Observer Pattern (Observable / Subject)",
  difficulty: "Intermediate",
  category: "Coding",
  tags: [
    "javascript",
    "design-patterns",
    "observer-pattern",
    "pub-sub",
    "reactive-programming",
    "rxjs",
  ],

  problem: `Implement the classic Observer Pattern with a \`Subject\` (or \`Observable\`) and \`Observer\` interface in JavaScript/TypeScript.

The implementation must support:
1. \`subject.subscribe(observer)\`: Subscribes an observer (function or object with \`next\`, \`error\`, \`complete\` methods). Returns a subscription object with an \`unsubscribe()\` method.
2. \`subject.next(data)\`: Notifies all active subscribers with data.
3. \`subject.error(err)\`: Notifies subscribers of an error and completes the stream.
4. \`subject.complete()\`: Notifies subscribers of completion; no further values are emitted.
5. **BehaviorSubject**: A specialized subject variant that stores the "current" value and immediately emits it to any new subscriber upon subscription.
6. **Operators**: Basic pipeline operators like \`map\` and \`filter\` to transform streams.`,

  requirements: [
    "Subject with subscribe, next, error, complete methods",
    "Return subscription with unsubscribe() function",
    "Prevent memory leaks: unsubscribe cleans up observer reference",
    "BehaviorSubject storing current/initial value and replaying to new subscribers",
    "Stream completion stops further notifications",
  ],

  examples: [
    {
      input: `const subject = new Subject();\nconst sub1 = subject.subscribe(val => console.log('Sub 1:', val));\nsubject.next(10);\nconst sub2 = subject.subscribe(val => console.log('Sub 2:', val));\nsubject.next(20);\nsub1.unsubscribe();\nsubject.next(30);`,
      output: `Sub 1: 10\nSub 1: 20\nSub 2: 20\nSub 2: 30`,
      explanation:
        "sub1 receives 10 and 20, then unsubscribes; sub2 receives 20 and 30.",
    },
    {
      input: `const bSubject = new BehaviorSubject('initial');\nbSubject.subscribe(val => console.log('Received:', val));\nbSubject.next('updated');`,
      output: `Received: initial\nReceived: updated`,
      explanation:
        "BehaviorSubject immediately emits its current value on subscription.",
    },
  ],

  edgeCases: [
    "Unsubscribing multiple times: idempotent, does not throw error",
    "Unsubscribing inside an observer callback during a next() broadcast: iterate a copy of observers array to avoid index shifting",
    "Calling next() after complete() or error(): silently ignored",
    "Throwing inside an observer callback: isolate errors so other observers still receive data",
  ],

  naiveApproach: `A naive approach iterates directly over the observers array while calling each observer. If an observer calls \`unsubscribe()\` inside its callback, the array length changes in-place during the loop, skipping subsequent observers in the iteration.`,

  optimalApproach: `The optimal approach:
1. Stores observers in a \`Set\` or creates a snapshot copy (\`[...this.observers]\`) before iterating in \`next()\`.
2. Encapsulates observers into a normalized interface \`{ next, error, complete }\`.
3. Returns a subscription object with \`unsubscribe()\` that removes the observer from the set and flags itself as closed.
4. Tracks stream status: \`isStopped: boolean\` to ignore calls after complete/error.`,

  implementation: `class Subject {
  constructor() {
    this.observers = new Set();
    this.isClosed = false;
  }

  subscribe(observerOrNext, error, complete) {
    if (this.isClosed) {
      if (typeof complete === 'function') complete();
      return { unsubscribe: () => {} };
    }

    const observer = typeof observerOrNext === 'function'
      ? { next: observerOrNext, error, complete }
      : observerOrNext;

    this.observers.add(observer);

    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      }
    };
  }

  next(value) {
    if (this.isClosed) return;
    // Iterate snapshot copy to protect against in-flight unsubscribes
    for (const observer of Array.from(this.observers)) {
      try {
        if (typeof observer.next === 'function') {
          observer.next(value);
        }
      } catch (err) {
        console.error('Error in observer next():', err);
      }
    }
  }

  error(err) {
    if (this.isClosed) return;
    this.isClosed = true;
    for (const observer of Array.from(this.observers)) {
      try {
        if (typeof observer.error === 'function') {
          observer.error(err);
        }
      } catch (e) {
        console.error('Error in observer error():', e);
      }
    }
    this.observers.clear();
  }

  complete() {
    if (this.isClosed) return;
    this.isClosed = true;
    for (const observer of Array.from(this.observers)) {
      try {
        if (typeof observer.complete === 'function') {
          observer.complete();
        }
      } catch (err) {
        console.error('Error in observer complete():', err);
      }
    }
    this.observers.clear();
  }
}

class BehaviorSubject extends Subject {
  constructor(initialValue) {
    super();
    this.value = initialValue;
  }

  getValue() {
    if (this.isClosed) {
      throw new Error('BehaviorSubject is closed');
    }
    return this.value;
  }

  subscribe(observerOrNext, error, complete) {
    const subscription = super.subscribe(observerOrNext, error, complete);

    if (!this.isClosed) {
      const observer = typeof observerOrNext === 'function'
        ? { next: observerOrNext }
        : observerOrNext;

      if (typeof observer.next === 'function') {
        observer.next(this.value);
      }
    }

    return subscription;
  }

  next(value) {
    if (this.isClosed) return;
    this.value = value;
    super.next(value);
  }
}`,

  implementationTS: `export interface Observer<T> {
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
}

export interface Subscription {
  unsubscribe: () => void;
  readonly closed: boolean;
}

export class Subject<T> {
  protected observers = new Set<Observer<T>>();
  protected isClosed = false;

  subscribe(
    observerOrNext: Observer<T> | ((value: T) => void),
    error?: (err: any) => void,
    complete?: () => void
  ): Subscription {
    if (this.isClosed) {
      if (typeof complete === 'function') complete();
      return { unsubscribe: () => {}, closed: true };
    }

    const observer: Observer<T> =
      typeof observerOrNext === 'function'
        ? { next: observerOrNext, error, complete }
        : observerOrNext;

    this.observers.add(observer);
    let isSubscribed = true;

    return {
      unsubscribe: () => {
        if (!isSubscribed) return;
        isSubscribed = false;
        this.observers.delete(observer);
      },
      get closed() {
        return !isSubscribed;
      },
    };
  }

  next(value: T): void {
    if (this.isClosed) return;
    for (const observer of Array.from(this.observers)) {
      observer.next?.(value);
    }
  }

  error(err: any): void {
    if (this.isClosed) return;
    this.isClosed = true;
    for (const observer of Array.from(this.observers)) {
      observer.error?.(err);
    }
    this.observers.clear();
  }

  complete(): void {
    if (this.isClosed) return;
    this.isClosed = true;
    for (const observer of Array.from(this.observers)) {
      observer.complete?.();
    }
    this.observers.clear();
  }
}

export class BehaviorSubject<T> extends Subject<T> {
  private _value: T;

  constructor(initialValue: T) {
    super();
    this._value = initialValue;
  }

  getValue(): T {
    return this._value;
  }

  override subscribe(
    observerOrNext: Observer<T> | ((value: T) => void),
    error?: (err: any) => void,
    complete?: () => void
  ): Subscription {
    const subscription = super.subscribe(observerOrNext, error, complete);
    if (!this.isClosed) {
      const observer: Observer<T> =
        typeof observerOrNext === 'function'
          ? { next: observerOrNext }
          : observerOrNext;
      observer.next?.(this._value);
    }
    return subscription;
  }

  override next(value: T): void {
    this._value = value;
    super.next(value);
  }
}`,

  theoryAndConcepts:
    "WHAT IS THE OBSERVER PATTERN?\n-----------------------------\nA behavioral design pattern where an object (Subject/Observable)\nmaintains a list of dependents (Observers) and notifies them\nautomatically of state changes.\n\nAlso known as:\n- Pub/Sub (Publish/Subscribe)\n- Event Emitter\n- Listener Pattern\n\nKEY COMPONENTS:\n---------------\n1. Subject (Observable): Maintains observers, sends notifications\n2. Observer: Receives updates from subject\n3. ConcreteSubject: Stores state, notifies when state changes\n4. ConcreteObserver: Implements update logic\n\nUSE CASES:\n----------\n- Event handling (DOM events)\n- State management (Redux, MobX)\n- Real-time updates (WebSocket messages)\n- Data binding (frameworks)\n- Logging systems\n\nOBSERVER vs EVENT EMITTER:\n--------------------------\nObserver: Objects subscribe to subject\nEvent Emitter: Functions subscribe to named events\n(In practice, very similar - EventEmitter is a form of Observer)",
  beginnerApproach: "Beginner: Simple Observer Pattern",
  beginnerImplementation:
    "class SubjectBeginner {\n  constructor() {\n    this.observers = [];\n  }\n  \n  // Add observer\n  subscribe(observer) {\n    this.observers.push(observer);\n  }\n  \n  // Remove observer\n  unsubscribe(observer) {\n    this.observers = this.observers.filter(obs => obs !== observer);\n  }\n  \n  // Notify all observers\n  notify(data) {\n    this.observers.forEach(observer => observer(data));\n  }\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst subject = new SubjectBeginner();\n\n// Observer functions\nconst observer1 = (data) => console.log('Observer 1:', data);\nconst observer2 = (data) => console.log('Observer 2:', data);\n\nsubject.subscribe(observer1);\nsubject.subscribe(observer2);\n\nsubject.notify('Hello Observers!');\n\nsubject.unsubscribe(observer1);\nsubject.notify('Only Observer 2');",
  intermediateApproach:
    "Intermediate: Observable with state\n\n\nIntermediate: Observer with filter (selective subscription)",
  intermediateImplementation:
    "class Observable {\n  constructor(initialState = null) {\n    this._observers = new Set();\n    this._state = initialState;\n  }\n  \n  // Get current state\n  get state() {\n    return this._state;\n  }\n  \n  // Set state and notify\n  set state(newState) {\n    const oldState = this._state;\n    this._state = newState;\n    this._notify(newState, oldState);\n  }\n  \n  // Update state (for objects)\n  setState(updater) {\n    const oldState = this._state;\n    \n    if (typeof updater === 'function') {\n      this._state = updater(this._state);\n    } else {\n      this._state = { ...this._state, ...updater };\n    }\n    \n    this._notify(this._state, oldState);\n  }\n  \n  // Subscribe with automatic unsubscribe function\n  subscribe(observer) {\n    this._observers.add(observer);\n    \n    // Immediately call with current state\n    observer(this._state, this._state);\n    \n    // Return unsubscribe function\n    return () => {\n      this._observers.delete(observer);\n    };\n  }\n  \n  _notify(newState, oldState) {\n    this._observers.forEach(observer => {\n      try {\n        observer(newState, oldState);\n      } catch (error) {\n        console.error('Observer error:', error);\n      }\n    });\n  }\n}\n\nclass SelectiveObservable extends Observable {\n  subscribe(observer, selector = state => state) {\n    let previousSelected = selector(this._state);\n    \n    const wrappedObserver = (newState, oldState) => {\n      const newSelected = selector(newState);\n      const oldSelected = previousSelected;\n      \n      // Only notify if selected value changed\n      if (newSelected !== oldSelected) {\n        previousSelected = newSelected;\n        observer(newSelected, oldSelected);\n      }\n    };\n    \n    return super.subscribe(wrappedObserver);\n  }\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst store = new Observable({ count: 0, name: 'Test' });\n\nconst unsubscribe = store.subscribe((state, oldState) => {\n  console.log('State changed:', oldState, '->', state);\n});\n\nstore.setState({ count: 1 });\nstore.setState(state => ({ ...state, count: state.count + 1 }));\n\nunsubscribe();\nstore.setState({ count: 100 }); // No log - unsubscribed\n\n// Selective\nconst selectiveStore = new SelectiveObservable({ a: 1, b: 2 });\nselectiveStore.subscribe(\n  (value) => console.log('A changed:', value),\n  state => state.a\n);\n\nselectiveStore.setState({ a: 1, b: 100 }); // No notify (a unchanged)\nselectiveStore.setState({ a: 2, b: 100 }); // Notify (a changed)",
  expertApproach:
    "Expert: Full-featured Observable System\n\n\nExpert: Reactive programming style",
  expertImplementation:
    "class AdvancedObservable {\n  constructor(initialState = {}) {\n    this._state = initialState;\n    this._observers = new Map(); // Map<observerId, { callback, options }>\n    this._nextId = 0;\n    this._middleware = [];\n    this._history = [];\n    this._maxHistory = 10;\n  }\n  \n  // Get state or nested value\n  get(path) {\n    if (!path) return this._state;\n    \n    return path.split('.').reduce((obj, key) => \n      obj && obj[key] !== undefined ? obj[key] : undefined\n    , this._state);\n  }\n  \n  // Set state with optional path\n  set(pathOrValue, value) {\n    let newState;\n    \n    if (typeof pathOrValue === 'string') {\n      newState = this._setNested(this._state, pathOrValue, value);\n    } else {\n      newState = typeof pathOrValue === 'function' \n        ? pathOrValue(this._state) \n        : pathOrValue;\n    }\n    \n    // Run middleware\n    for (const mw of this._middleware) {\n      newState = mw(newState, this._state);\n      if (newState === false) return; // Middleware can cancel\n    }\n    \n    // Save history\n    this._history.push(this._state);\n    if (this._history.length > this._maxHistory) {\n      this._history.shift();\n    }\n    \n    const oldState = this._state;\n    this._state = newState;\n    this._notify(newState, oldState);\n  }\n  \n  _setNested(obj, path, value) {\n    const keys = path.split('.');\n    const newObj = { ...obj };\n    let current = newObj;\n    \n    for (let i = 0; i < keys.length - 1; i++) {\n      current[keys[i]] = { ...current[keys[i]] };\n      current = current[keys[i]];\n    }\n    \n    current[keys[keys.length - 1]] = value;\n    return newObj;\n  }\n  \n  // Subscribe with options\n  subscribe(callback, options = {}) {\n    const {\n      immediate = true,      // Call immediately with current state\n      selector = null,       // Select specific part of state\n      equalityFn = (a, b) => a === b, // Custom equality check\n      debounce = 0           // Debounce notifications\n    } = options;\n    \n    const id = this._nextId++;\n    \n    let previousSelected = selector ? selector(this._state) : this._state;\n    let timeoutId = null;\n    \n    const wrappedCallback = (newState, oldState) => {\n      const newSelected = selector ? selector(newState) : newState;\n      \n      // Check if changed\n      if (equalityFn(newSelected, previousSelected)) {\n        return;\n      }\n      \n      const oldSelected = previousSelected;\n      previousSelected = newSelected;\n      \n      if (debounce > 0) {\n        clearTimeout(timeoutId);\n        timeoutId = setTimeout(() => {\n          callback(newSelected, oldSelected);\n        }, debounce);\n      } else {\n        callback(newSelected, oldSelected);\n      }\n    };\n    \n    this._observers.set(id, { callback: wrappedCallback, options });\n    \n    // Immediate call\n    if (immediate) {\n      callback(previousSelected, previousSelected);\n    }\n    \n    // Return unsubscribe function\n    return () => {\n      clearTimeout(timeoutId);\n      this._observers.delete(id);\n    };\n  }\n  \n  // Add middleware\n  use(middleware) {\n    this._middleware.push(middleware);\n    return () => {\n      const index = this._middleware.indexOf(middleware);\n      if (index > -1) this._middleware.splice(index, 1);\n    };\n  }\n  \n  // Undo last change\n  undo() {\n    if (this._history.length > 0) {\n      const previousState = this._history.pop();\n      const oldState = this._state;\n      this._state = previousState;\n      this._notify(this._state, oldState);\n      return true;\n    }\n    return false;\n  }\n  \n  // Batch multiple updates\n  batch(updates) {\n    const oldState = this._state;\n    let newState = this._state;\n    \n    for (const update of updates) {\n      if (typeof update === 'function') {\n        newState = update(newState);\n      } else {\n        newState = { ...newState, ...update };\n      }\n    }\n    \n    this._state = newState;\n    this._notify(newState, oldState);\n  }\n  \n  _notify(newState, oldState) {\n    this._observers.forEach(({ callback }) => {\n      try {\n        callback(newState, oldState);\n      } catch (error) {\n        console.error('Observer error:', error);\n      }\n    });\n  }\n  \n  // Observable info\n  get observerCount() {\n    return this._observers.size;\n  }\n  \n  get historyLength() {\n    return this._history.length;\n  }\n}\n\nclass ReactiveValue {\n  static create(initialValue) {\n    return new ReactiveValue(initialValue);\n  }\n  \n  constructor(initialValue) {\n    this._value = initialValue;\n    this._subscribers = new Set();\n    this._derivations = new Set();\n  }\n  \n  get value() {\n    return this._value;\n  }\n  \n  set value(newValue) {\n    if (this._value !== newValue) {\n      this._value = newValue;\n      this._notify();\n      this._updateDerived();\n    }\n  }\n  \n  subscribe(fn) {\n    this._subscribers.add(fn);\n    return () => this._subscribers.delete(fn);\n  }\n  \n  _notify() {\n    this._subscribers.forEach(fn => fn(this._value));\n  }\n  \n  _updateDerived() {\n    this._derivations.forEach(derived => derived._recompute());\n  }\n  \n  // Create derived value\n  derive(computeFn) {\n    const derived = new DerivedValue(computeFn, [this]);\n    this._derivations.add(derived);\n    return derived;\n  }\n  \n  // Combine multiple reactive values\n  static combine(reactives, combineFn) {\n    return new DerivedValue(() => combineFn(...reactives.map(r => r.value)), reactives);\n  }\n}\n\nclass DerivedValue extends ReactiveValue {\n  constructor(computeFn, dependencies) {\n    super(null);\n    this._computeFn = computeFn;\n    this._dependencies = dependencies;\n    this._recompute();\n  }\n  \n  _recompute() {\n    this.value = this._computeFn();\n  }\n  \n  // Derived values are read-only\n  set value(v) {\n    super.value = v;\n  }\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Advanced Observable\nconst appState = new AdvancedObservable({\n  user: { name: 'John', age: 30 },\n  settings: { theme: 'dark' }\n});\n\n// Middleware for logging\nappState.use((newState, oldState) => {\n  console.log('State update:', { from: oldState, to: newState });\n  return newState;\n});\n\n// Subscribe to specific path\nconst unsubUser = appState.subscribe(\n  (user) => console.log('User changed:', user),\n  { selector: state => state.user }\n);\n\nappState.set('user.name', 'Jane');\nappState.set('settings.theme', 'light'); // User observer not called\n\nappState.undo(); // Revert last change\n\n// Reactive values\nconst count = ReactiveValue.create(0);\nconst doubled = count.derive(c => c.value * 2);\n\ndoubled.subscribe(val => console.log('Doubled:', val));\n\ncount.value = 5; // Logs: \"Doubled: 10\"",
  interviewTraps: [
    "QUICK REFERENCE:",
    "Subject: Maintains list of observers, notifies them",
    "Observer: Receives updates, implements update method",
    "INTERVIEW TIPS:",
    "1. Explain the pattern conceptually first",
    "2. Show simple implementation",
    "3. Discuss use cases (events, state, data binding)",
    "4. Mention memory leaks (unsubscribe!)",
  ],
  stepByStep: [
    "Define Subject class maintaining observers Set and isClosed boolean.",
    "Implement subscribe returning subscription with idempotent unsubscribe closure.",
    "Implement next iterating snapshot of observers and executing callback safely.",
    "Implement error and complete closing stream and cleaning up observer Set.",
    "Subclass BehaviorSubject to store current value and immediately emit to new subscribers.",
  ],

  timeComplexity:
    "O(1) subscription and unsubscription; O(K) broadcast where K is the number of active subscribers.",
  spaceComplexity: "O(K) to store references to active subscribers in memory.",

  alternativeSolutions: [
    "EventEmitter (keyed by string event names vs typed streams)",
    "BroadcastChannel / CustomEvent browser event system",
  ],

  commonMistakes: [
    "Iterating over the live observers collection while allowing subscribers to unsubscribe in their next() handlers.",
    "Emitting values after complete() or error() has been called.",
    "Not emitting initial value synchronously during BehaviorSubject.subscribe().",
  ],

  followUps: [
    "How does the Observer pattern differ from the Pub/Sub pattern (broker vs direct coupling)?",
    "How would you implement a pipe() method supporting map, filter, and debounce operators?",
    "How is this pattern used internally in React state managers like Zustand, Redux, and RxJS?",
  ],
};
