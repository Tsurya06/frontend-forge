import type { CodingProblem } from '../../types';

export const eventEmitterProblem: CodingProblem = {
  id: 'coding-event-emitter',
  title: 'Implement EventEmitter',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['events', 'pub-sub', 'design-pattern', 'observer', 'callbacks'],

  problem: `Implement an EventEmitter class that provides a publish-subscribe (pub/sub) event system. The class should support four core methods: on (subscribe to an event), off (unsubscribe), emit (trigger an event with optional data), and once (subscribe but automatically unsubscribe after the first trigger).

The EventEmitter pattern is one of the most fundamental design patterns in JavaScript. It's used in Node.js (the events module), browser DOM events, React synthetic events, and virtually every UI framework. Understanding this pattern is essential for building decoupled, event-driven architectures.

Key implementation details include supporting multiple listeners per event, maintaining listener order, handling the case where a listener removes itself during emit (concurrent modification), and ensuring once listeners fire exactly once even if the event is emitted multiple times in quick succession.`,

  requirements: [
    'on(event, listener): Register a listener for an event, return unsubscribe function',
    'off(event, listener): Remove a specific listener from an event',
    'emit(event, ...args): Call all listeners for an event with the provided arguments',
    'once(event, listener): Register a listener that fires only once then auto-removes',
    'Support multiple listeners per event',
    'Maintain listener execution order (FIFO)',
    'Handle removing a listener that doesn\'t exist gracefully',
  ],

  examples: [
    {
      input: `const emitter = new EventEmitter();\nemitter.on('data', (msg) => console.log(msg));\nemitter.emit('data', 'hello');`,
      output: 'Logs: "hello"',
      explanation: 'The listener registered with on() is called when the event is emitted with the provided argument.',
    },
    {
      input: `emitter.once('connect', () => console.log('connected'));\nemitter.emit('connect');\nemitter.emit('connect');`,
      output: 'Logs "connected" only once',
      explanation: 'The once listener auto-unsubscribes after the first emit, so the second emit has no effect.',
    },
    {
      input: `const listener = (x) => console.log(x);\nemitter.on('tick', listener);\nemitter.off('tick', listener);\nemitter.emit('tick', 42);`,
      output: 'Nothing logged',
      explanation: 'The listener was removed with off() before emit, so it doesn\'t fire.',
    },
  ],

  edgeCases: [
    'Emitting an event with no listeners (should not throw)',
    'Removing a listener during emit (concurrent modification)',
    'Registering the same listener function twice for the same event',
    'Calling off() with a listener that was never registered',
    'once listener that throws an error (should still be removed)',
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

  stepByStep: [
    'Initialize a Map to store event names as keys and listener arrays as values.',
    'on(): Get or create the listener array for the event, push the new listener, return an unsubscribe function.',
    'off(): Find the listener in the event\'s array by reference (indexOf), splice it out, clean up empty arrays.',
    'emit(): Get the listener array, create a snapshot copy, iterate the snapshot calling each listener with the provided args.',
    'once(): Create a wrapper function that calls off(event, wrapper) then calls the original listener. Register the wrapper via on().',
    'The snapshot in emit() prevents bugs when listeners modify the listener list during iteration.',
    'Return boolean from emit() to indicate whether any listeners were called.',
  ],

  timeComplexity: 'O(n) for emit where n is the number of listeners. O(n) for off (indexOf search). O(1) for on.',
  spaceComplexity: 'O(e * l) where e is the number of event types and l is the average number of listeners per event.',

  commonMistakes: [
    'Not using a snapshot during emit, causing skipped or double-called listeners when the list is modified',
    'Implementing once() without a wrapper, leading to inability to remove the listener by reference',
    'Forgetting to clean up empty listener arrays, causing memory leaks over time',
    'Using === to compare wrapper functions with original listeners in off(), breaking once+off interop',
  ],

  followUps: [
    'How would you add support for wildcard events (e.g., on("user.*", callback))?',
    'How would you implement async event emission (await all listeners)?',
    'How does this compare to the Node.js EventEmitter API?',
  ],
};
