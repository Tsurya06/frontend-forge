import type { CodingProblem } from "../../types";

export const eventEmitterProblem: CodingProblem = {
  id: "coding-event-emitter",
  title: "Implement EventEmitter",
  difficulty: "Intermediate",
  category: "Coding",
  tags: ["events", "pub-sub", "design-pattern", "observer", "callbacks"],

  problem: `Implement an EventEmitter class that provides a publish-subscribe (pub/sub) event system. The class should support four core methods: on (subscribe to an event), off (unsubscribe), emit (trigger an event with optional data), and once (subscribe but automatically unsubscribe after the first trigger).

The EventEmitter pattern is one of the most fundamental design patterns in JavaScript. It's used in Node.js (the events module), browser DOM events, React synthetic events, and virtually every UI framework. Understanding this pattern is essential for building decoupled, event-driven architectures.

Key implementation details include supporting multiple listeners per event, maintaining listener order, handling the case where a listener removes itself during emit (concurrent modification), and ensuring once listeners fire exactly once even if the event is emitted multiple times in quick succession.`,

  requirements: [
    "on(event, listener): Register a listener for an event, return unsubscribe function",
    "off(event, listener): Remove a specific listener from an event",
    "emit(event, ...args): Call all listeners for an event with the provided arguments",
    "once(event, listener): Register a listener that fires only once then auto-removes",
    "Support multiple listeners per event",
    "Maintain listener execution order (FIFO)",
    "Handle removing a listener that doesn't exist gracefully",
  ],

  examples: [
    {
      input: `const emitter = new EventEmitter();\nemitter.on('data', (msg) => console.log(msg));\nemitter.emit('data', 'hello');`,
      output: 'Logs: "hello"',
      explanation:
        "The listener registered with on() is called when the event is emitted with the provided argument.",
    },
    {
      input: `emitter.once('connect', () => console.log('connected'));\nemitter.emit('connect');\nemitter.emit('connect');`,
      output: 'Logs "connected" only once',
      explanation:
        "The once listener auto-unsubscribes after the first emit, so the second emit has no effect.",
    },
    {
      input: `const listener = (x) => console.log(x);\nemitter.on('tick', listener);\nemitter.off('tick', listener);\nemitter.emit('tick', 42);`,
      output: "Nothing logged",
      explanation:
        "The listener was removed with off() before emit, so it doesn't fire.",
    },
  ],

  edgeCases: [
    "Emitting an event with no listeners (should not throw)",
    "Removing a listener during emit (concurrent modification)",
    "Registering the same listener function twice for the same event",
    "Calling off() with a listener that was never registered",
    "once listener that throws an error (should still be removed)",
  ],

  naiveApproach: `A naive approach stores listeners in a plain object with arrays: { eventName: [fn1, fn2] }. It works for simple cases but has issues: removing listeners by reference during iteration can cause skipped listeners, once() is tricky to implement without a wrapper, and there's no protection against adding the same listener twice. The naive version also often forgets to handle emit for non-existent events.`,

  optimalApproach: `The optimal approach uses a Map<string, Set<Function>> or Map<string, Function[]> as the internal store. For emit, iterate over a copy of the listeners array to safely handle modifications during iteration (a listener calling off on itself). For once, create a wrapper function that calls the original listener then calls off — but store a reference mapping so off(event, originalListener) can find and remove the wrapper.

The Map provides cleaner semantics than a plain object (no prototype pollution, any string as key). Using a snapshot (spread or slice) of the listeners array during emit prevents concurrent modification bugs. The once wrapper pattern ensures exactly-once semantics even in edge cases.`,

  implementation: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);

    return () => this.off(event, listener);
  }

  off(event, listener) {
    const listeners = this.events.get(event);
    if (!listeners) return;

    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
      this.events.delete(event);
    }
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners) return false;

    const snapshot = [...listeners];
    for (const listener of snapshot) {
      listener(...args);
    }
    return true;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };

    wrapper._originalListener = listener;
    this.on(event, wrapper);

    return () => this.off(event, wrapper);
  }

  listenerCount(event) {
    const listeners = this.events.get(event);
    return listeners ? listeners.length : 0;
  }

  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

// Usage
const emitter = new EventEmitter();

emitter.on('message', (text) => console.log('Received:', text));

const unsubscribe = emitter.on('message', (text) =>
  console.log('Also got:', text)
);

emitter.emit('message', 'hello');
// Received: hello
// Also got: hello

unsubscribe();
emitter.emit('message', 'world');
// Received: world

emitter.once('connect', () => console.log('Connected!'));
emitter.emit('connect'); // Connected!
emitter.emit('connect'); // (nothing)

console.log(emitter.listenerCount('message')); // 1`,

  implementationTS: `type Listener = (...args: unknown[]) => void;

class EventEmitter {
  private events: Map<string, Listener[]> = new Map();

  on(event: string, listener: Listener): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);

    return () => this.off(event, listener);
  }

  off(event: string, listener: Listener): void {
    const listeners = this.events.get(event);
    if (!listeners) return;

    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
      this.events.delete(event);
    }
  }

  emit(event: string, ...args: unknown[]): boolean {
    const listeners = this.events.get(event);
    if (!listeners) return false;

    const snapshot = [...listeners];
    for (const listener of snapshot) {
      listener(...args);
    }
    return true;
  }

  once(event: string, listener: Listener): () => void {
    const wrapper: Listener = (...args: unknown[]) => {
      this.off(event, wrapper);
      listener(...args);
    };

    this.on(event, wrapper);
    return () => this.off(event, wrapper);
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.length ?? 0;
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}`,

  theoryAndConcepts:
    "WHAT IS AN EVENT EMITTER?\n-------------------------\nAn Event Emitter implements the Observer/Pub-Sub pattern:\n- Publishers emit events (don't know who's listening)\n- Subscribers react to events (don't know who emitted)\n\nThis decouples components - they communicate via events, not direct calls.\n\nNODE.JS EVENTS:\n---------------\nNode.js has built-in EventEmitter class:\nconst EventEmitter = require('events');\n\nCOMMON METHODS:\n---------------\non(event, listener)    - Add listener\noff(event, listener)   - Remove listener\nonce(event, listener)  - Add one-time listener\nemit(event, ...args)   - Trigger event with data\n\nUSE CASES:\n----------\n1. Custom event systems\n2. Component communication\n3. Async operation notifications\n4. Plugin/middleware systems\n5. State change notifications\n\n\n\nOBSERVER PATTERN:\n-----------------\nSubject (Observable)  ->  notifies  ->  Observers\n\nEvent Emitter is a specific implementation where:\n- Subject = EventEmitter instance\n- Observers = Listener functions\n- notify = emit()",
  beginnerApproach: "Beginner: Basic event emitter with on, off, emit",
  beginnerImplementation:
    "class EventEmitterBeginner {\n  constructor() {\n    // Store listeners: { eventName: [listener1, listener2, ...] }\n    this.events = {};\n  }\n  \n  // Subscribe to an event\n  on(event, listener) {\n    // Create array for event if doesn't exist\n    if (!this.events[event]) {\n      this.events[event] = [];\n    }\n    \n    // Add listener\n    this.events[event].push(listener);\n  }\n  \n  // Unsubscribe from an event\n  off(event, listener) {\n    if (!this.events[event]) return;\n    \n    // Find and remove listener\n    const index = this.events[event].indexOf(listener);\n    if (index !== -1) {\n      this.events[event].splice(index, 1);\n    }\n  }\n  \n  // Emit an event\n  emit(event, ...args) {\n    if (!this.events[event]) return;\n    \n    // Call all listeners\n    this.events[event].forEach(listener => {\n      listener(...args);\n    });\n  }\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst emitter = new EventEmitterBeginner();\n\n// Subscribe\nconst greetListener = (name) => console.log(`Hello, ${name}!`);\nemitter.on('greet', greetListener);\nemitter.on('greet', (name) => console.log(`Welcome, ${name}!`));\n\n// Emit\nemitter.emit('greet', 'John');\n// Output: Hello, John! / Welcome, John!\n\n// Unsubscribe\nemitter.off('greet', greetListener);\nemitter.emit('greet', 'Jane');\n// Output: Welcome, Jane! (first listener removed)",
  intermediateApproach:
    "Intermediate: Add once, removeAllListeners, listenerCount\nUse Map for better performance",
  intermediateImplementation:
    "class EventEmitterIntermediate {\n  constructor() {\n    this.events = new Map();\n  }\n  \n  on(event, listener) {\n    if (typeof listener !== 'function') {\n      throw new TypeError('Listener must be a function');\n    }\n    \n    if (!this.events.has(event)) {\n      this.events.set(event, []);\n    }\n    \n    this.events.get(event).push(listener);\n    return this; // Enable chaining\n  }\n  \n  off(event, listener) {\n    if (!this.events.has(event)) return this;\n    \n    if (!listener) {\n      // Remove all listeners for event\n      this.events.delete(event);\n      return this;\n    }\n    \n    const listeners = this.events.get(event);\n    const index = listeners.indexOf(listener);\n    \n    if (index !== -1) {\n      listeners.splice(index, 1);\n    }\n    \n    // Clean up empty arrays\n    if (listeners.length === 0) {\n      this.events.delete(event);\n    }\n    \n    return this;\n  }\n  \n  // One-time listener\n  once(event, listener) {\n    // Create wrapper that removes itself after first call\n    const wrapper = (...args) => {\n      listener.apply(this, args);\n      this.off(event, wrapper);\n    };\n    \n    // Store reference to original for removal\n    wrapper.originalListener = listener;\n    \n    return this.on(event, wrapper);\n  }\n  \n  emit(event, ...args) {\n    if (!this.events.has(event)) return false;\n    \n    // Clone array to avoid issues if listener modifies it\n    const listeners = [...this.events.get(event)];\n    \n    listeners.forEach(listener => {\n      listener.apply(this, args);\n    });\n    \n    return true;\n  }\n  \n  // Get listener count for event\n  listenerCount(event) {\n    if (!this.events.has(event)) return 0;\n    return this.events.get(event).length;\n  }\n  \n  // Get all event names\n  eventNames() {\n    return Array.from(this.events.keys());\n  }\n  \n  // Remove all listeners\n  removeAllListeners(event) {\n    if (event) {\n      this.events.delete(event);\n    } else {\n      this.events.clear();\n    }\n    return this;\n  }\n  \n  // Get listeners for event\n  listeners(event) {\n    if (!this.events.has(event)) return [];\n    return [...this.events.get(event)];\n  }\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst emitter2 = new EventEmitterIntermediate();\n\n// Chaining\nemitter2\n  .on('data', (d) => console.log('Data:', d))\n  .on('error', (e) => console.log('Error:', e));\n\n// Once\nemitter2.once('connect', () => console.log('Connected!'));\nemitter2.emit('connect'); // Connected!\nemitter2.emit('connect'); // Nothing (listener removed)\n\n// Listener count\nconsole.log('Data listeners:', emitter2.listenerCount('data')); // 1\nconsole.log('Event names:', emitter2.eventNames()); // ['data', 'error']",
  expertApproach:
    "Expert: Full-featured emitter with:\n- Error handling\n- Max listeners warning\n- Prepend listeners\n- Async emit\n- Wildcard events",
  expertImplementation:
    "class EventEmitterExpert {\n  static defaultMaxListeners = 10;\n  \n  constructor() {\n    this.events = new Map();\n    this.maxListeners = EventEmitterExpert.defaultMaxListeners;\n    this.onceWrappers = new WeakMap();\n  }\n  \n  // Set max listeners (0 = unlimited)\n  setMaxListeners(n) {\n    this.maxListeners = n;\n    return this;\n  }\n  \n  getMaxListeners() {\n    return this.maxListeners;\n  }\n  \n  // Add listener (alias: addListener)\n  on(event, listener, options = {}) {\n    if (typeof listener !== 'function') {\n      throw new TypeError('Listener must be a function');\n    }\n    \n    if (!this.events.has(event)) {\n      this.events.set(event, []);\n    }\n    \n    const listeners = this.events.get(event);\n    \n    // Max listeners warning\n    if (this.maxListeners > 0 && listeners.length >= this.maxListeners) {\n      console.warn(\n        `MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ` +\n        `${listeners.length + 1} ${event} listeners added. ` +\n        `Use emitter.setMaxListeners() to increase limit`\n      );\n    }\n    \n    // Prepend or append\n    if (options.prepend) {\n      listeners.unshift(listener);\n    } else {\n      listeners.push(listener);\n    }\n    \n    // Emit 'newListener' event\n    if (event !== 'newListener') {\n      this.emit('newListener', event, listener);\n    }\n    \n    return this;\n  }\n  \n  addListener(event, listener) {\n    return this.on(event, listener);\n  }\n  \n  prependListener(event, listener) {\n    return this.on(event, listener, { prepend: true });\n  }\n  \n  // One-time listener\n  once(event, listener) {\n    const wrapper = (...args) => {\n      this.off(event, wrapper);\n      listener.apply(this, args);\n    };\n    \n    this.onceWrappers.set(wrapper, listener);\n    return this.on(event, wrapper);\n  }\n  \n  prependOnceListener(event, listener) {\n    const wrapper = (...args) => {\n      this.off(event, wrapper);\n      listener.apply(this, args);\n    };\n    \n    this.onceWrappers.set(wrapper, listener);\n    return this.on(event, wrapper, { prepend: true });\n  }\n  \n  // Remove listener\n  off(event, listener) {\n    if (!this.events.has(event)) return this;\n    \n    const listeners = this.events.get(event);\n    \n    for (let i = listeners.length - 1; i >= 0; i--) {\n      if (\n        listeners[i] === listener ||\n        this.onceWrappers.get(listeners[i]) === listener\n      ) {\n        listeners.splice(i, 1);\n        \n        // Emit 'removeListener' event\n        if (event !== 'removeListener') {\n          this.emit('removeListener', event, listener);\n        }\n        break;\n      }\n    }\n    \n    if (listeners.length === 0) {\n      this.events.delete(event);\n    }\n    \n    return this;\n  }\n  \n  removeListener(event, listener) {\n    return this.off(event, listener);\n  }\n  \n  // Emit event\n  emit(event, ...args) {\n    // Special handling for 'error' event\n    if (event === 'error' && !this.events.has('error')) {\n      const error = args[0];\n      if (error instanceof Error) {\n        throw error;\n      }\n      throw new Error('Unhandled error event');\n    }\n    \n    if (!this.events.has(event)) {\n      // Also check for wildcard listeners\n      if (this.events.has('*')) {\n        const wildcardListeners = [...this.events.get('*')];\n        wildcardListeners.forEach(listener => {\n          this.safeCall(listener, event, ...args);\n        });\n        return true;\n      }\n      return false;\n    }\n    \n    const listeners = [...this.events.get(event)];\n    \n    listeners.forEach(listener => {\n      this.safeCall(listener, ...args);\n    });\n    \n    // Also notify wildcard listeners\n    if (event !== '*' && this.events.has('*')) {\n      const wildcardListeners = [...this.events.get('*')];\n      wildcardListeners.forEach(listener => {\n        this.safeCall(listener, event, ...args);\n      });\n    }\n    \n    return true;\n  }\n  \n  // Safe call with error handling\n  safeCall(listener, ...args) {\n    try {\n      listener.apply(this, args);\n    } catch (error) {\n      // Emit error or log\n      if (this.events.has('error')) {\n        this.emit('error', error);\n      } else {\n        console.error('Error in event listener:', error);\n      }\n    }\n  }\n  \n  // Async emit (returns Promise)\n  async emitAsync(event, ...args) {\n    if (!this.events.has(event)) return false;\n    \n    const listeners = [...this.events.get(event)];\n    \n    await Promise.all(\n      listeners.map(listener => \n        Promise.resolve(listener.apply(this, args))\n      )\n    );\n    \n    return true;\n  }\n  \n  // Emit in series (wait for each listener)\n  async emitSeries(event, ...args) {\n    if (!this.events.has(event)) return false;\n    \n    const listeners = [...this.events.get(event)];\n    \n    for (const listener of listeners) {\n      await Promise.resolve(listener.apply(this, args));\n    }\n    \n    return true;\n  }\n  \n  // Utility methods\n  listenerCount(event) {\n    return this.events.has(event) ? this.events.get(event).length : 0;\n  }\n  \n  eventNames() {\n    return Array.from(this.events.keys());\n  }\n  \n  listeners(event) {\n    if (!this.events.has(event)) return [];\n    return this.events.get(event).map(listener => \n      this.onceWrappers.get(listener) || listener\n    );\n  }\n  \n  rawListeners(event) {\n    return this.events.has(event) ? [...this.events.get(event)] : [];\n  }\n  \n  removeAllListeners(event) {\n    if (event) {\n      this.events.delete(event);\n    } else {\n      this.events.clear();\n    }\n    return this;\n  }\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\nconst emitter3 = new EventEmitterExpert();\n\n// Error handling\nemitter3.on('error', (err) => console.log('Caught error:', err.message));\n\n// Wildcard listener\nemitter3.on('*', (event, ...args) => {\n  console.log(`[Wildcard] Event: ${event}, Args:`, args);\n});\n\n// Regular events\nemitter3.on('user:login', (user) => console.log('User logged in:', user));\nemitter3.emit('user:login', { id: 1, name: 'John' });\n\n// Async emit\nemitter3.on('async', async () => {\n  await new Promise(r => setTimeout(r, 100));\n  console.log('Async listener done');\n});\n\n// Prepend\nemitter3.on('order', () => console.log('Second'));\nemitter3.prependListener('order', () => console.log('First'));\nemitter3.emit('order');\n\n// newListener/removeListener events\nemitter3.on('newListener', (event) => {\n  console.log(`New listener added for: ${event}`);\n});",
  interviewTraps: [
    "console.log('\\n=== EDGE CASES ===');",
    "EDGE CASE 1: Removing listener during emit",
    "const emitter4 = new EventEmitterIntermediate();",
    "let count = 0;",
    "const listener1 = () => {",
    "console.log('Listener 1');",
    "emitter4.off('test', listener2); // Remove next listener",
    "const listener2 = () => console.log('Listener 2');",
  ],
  stepByStep: [
    "Initialize a Map to store event names as keys and listener arrays as values.",
    "on(): Get or create the listener array for the event, push the new listener, return an unsubscribe function.",
    "off(): Find the listener in the event's array by reference (indexOf), splice it out, clean up empty arrays.",
    "emit(): Get the listener array, create a snapshot copy, iterate the snapshot calling each listener with the provided args.",
    "once(): Create a wrapper function that calls off(event, wrapper) then calls the original listener. Register the wrapper via on().",
    "The snapshot in emit() prevents bugs when listeners modify the listener list during iteration.",
    "Return boolean from emit() to indicate whether any listeners were called.",
  ],

  timeComplexity:
    "O(n) for emit where n is the number of listeners. O(n) for off (indexOf search). O(1) for on.",
  spaceComplexity:
    "O(e * l) where e is the number of event types and l is the average number of listeners per event.",

  commonMistakes: [
    "Not using a snapshot during emit, causing skipped or double-called listeners when the list is modified",
    "Implementing once() without a wrapper, leading to inability to remove the listener by reference",
    "Forgetting to clean up empty listener arrays, causing memory leaks over time",
    "Using === to compare wrapper functions with original listeners in off(), breaking once+off interop",
  ],

  followUps: [
    'How would you add support for wildcard events (e.g., on("user.*", callback))?',
    "How would you implement async event emission (await all listeners)?",
    "How does this compare to the Node.js EventEmitter API?",
  ],
};
