/**
 * ============================================
 * EVENT EMITTER - Complete Guide
 * ============================================
 * 
 * Topic: Implement a class that can subscribe to and emit events
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS AN EVENT EMITTER?
 * -------------------------
 * An Event Emitter implements the Observer/Pub-Sub pattern:
 * - Publishers emit events (don't know who's listening)
 * - Subscribers react to events (don't know who emitted)
 * 
 * This decouples components - they communicate via events, not direct calls.
 * 
 * NODE.JS EVENTS:
 * ---------------
 * Node.js has built-in EventEmitter class:
 * const EventEmitter = require('events');
 * 
 * COMMON METHODS:
 * ---------------
 * on(event, listener)    - Add listener
 * off(event, listener)   - Remove listener
 * once(event, listener)  - Add one-time listener
 * emit(event, ...args)   - Trigger event with data
 * 
 * USE CASES:
 * ----------
 * 1. Custom event systems
 * 2. Component communication
 * 3. Async operation notifications
 * 4. Plugin/middleware systems
 * 5. State change notifications
 */

/**
 * OBSERVER PATTERN:
 * -----------------
 * Subject (Observable)  ->  notifies  ->  Observers
 * 
 * Event Emitter is a specific implementation where:
 * - Subject = EventEmitter instance
 * - Observers = Listener functions
 * - notify = emit()
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Basic event emitter with on, off, emit
 */
class EventEmitterBeginner {
  constructor() {
    // Store listeners: { eventName: [listener1, listener2, ...] }
    this.events = {};
  }
  
  // Subscribe to an event
  on(event, listener) {
    // Create array for event if doesn't exist
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    // Add listener
    this.events[event].push(listener);
  }
  
  // Unsubscribe from an event
  off(event, listener) {
    if (!this.events[event]) return;
    
    // Find and remove listener
    const index = this.events[event].indexOf(listener);
    if (index !== -1) {
      this.events[event].splice(index, 1);
    }
  }
  
  // Emit an event
  emit(event, ...args) {
    if (!this.events[event]) return;
    
    // Call all listeners
    this.events[event].forEach(listener => {
      listener(...args);
    });
  }
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const emitter = new EventEmitterBeginner();

// Subscribe
const greetListener = (name) => console.log(`Hello, ${name}!`);
emitter.on('greet', greetListener);
emitter.on('greet', (name) => console.log(`Welcome, ${name}!`));

// Emit
emitter.emit('greet', 'John');
// Output: Hello, John! / Welcome, John!

// Unsubscribe
emitter.off('greet', greetListener);
emitter.emit('greet', 'Jane');
// Output: Welcome, Jane! (first listener removed)


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Add once, removeAllListeners, listenerCount
 * Use Map for better performance
 */
class EventEmitterIntermediate {
  constructor() {
    this.events = new Map();
  }
  
  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    this.events.get(event).push(listener);
    return this; // Enable chaining
  }
  
  off(event, listener) {
    if (!this.events.has(event)) return this;
    
    if (!listener) {
      // Remove all listeners for event
      this.events.delete(event);
      return this;
    }
    
    const listeners = this.events.get(event);
    const index = listeners.indexOf(listener);
    
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    
    // Clean up empty arrays
    if (listeners.length === 0) {
      this.events.delete(event);
    }
    
    return this;
  }
  
  // One-time listener
  once(event, listener) {
    // Create wrapper that removes itself after first call
    const wrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, wrapper);
    };
    
    // Store reference to original for removal
    wrapper.originalListener = listener;
    
    return this.on(event, wrapper);
  }
  
  emit(event, ...args) {
    if (!this.events.has(event)) return false;
    
    // Clone array to avoid issues if listener modifies it
    const listeners = [...this.events.get(event)];
    
    listeners.forEach(listener => {
      listener.apply(this, args);
    });
    
    return true;
  }
  
  // Get listener count for event
  listenerCount(event) {
    if (!this.events.has(event)) return 0;
    return this.events.get(event).length;
  }
  
  // Get all event names
  eventNames() {
    return Array.from(this.events.keys());
  }
  
  // Remove all listeners
  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
  
  // Get listeners for event
  listeners(event) {
    if (!this.events.has(event)) return [];
    return [...this.events.get(event)];
  }
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const emitter2 = new EventEmitterIntermediate();

// Chaining
emitter2
  .on('data', (d) => console.log('Data:', d))
  .on('error', (e) => console.log('Error:', e));

// Once
emitter2.once('connect', () => console.log('Connected!'));
emitter2.emit('connect'); // Connected!
emitter2.emit('connect'); // Nothing (listener removed)

// Listener count
console.log('Data listeners:', emitter2.listenerCount('data')); // 1
console.log('Event names:', emitter2.eventNames()); // ['data', 'error']


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured emitter with:
 * - Error handling
 * - Max listeners warning
 * - Prepend listeners
 * - Async emit
 * - Wildcard events
 */
class EventEmitterExpert {
  static defaultMaxListeners = 10;
  
  constructor() {
    this.events = new Map();
    this.maxListeners = EventEmitterExpert.defaultMaxListeners;
    this.onceWrappers = new WeakMap();
  }
  
  // Set max listeners (0 = unlimited)
  setMaxListeners(n) {
    this.maxListeners = n;
    return this;
  }
  
  getMaxListeners() {
    return this.maxListeners;
  }
  
  // Add listener (alias: addListener)
  on(event, listener, options = {}) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    const listeners = this.events.get(event);
    
    // Max listeners warning
    if (this.maxListeners > 0 && listeners.length >= this.maxListeners) {
      console.warn(
        `MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ` +
        `${listeners.length + 1} ${event} listeners added. ` +
        `Use emitter.setMaxListeners() to increase limit`
      );
    }
    
    // Prepend or append
    if (options.prepend) {
      listeners.unshift(listener);
    } else {
      listeners.push(listener);
    }
    
    // Emit 'newListener' event
    if (event !== 'newListener') {
      this.emit('newListener', event, listener);
    }
    
    return this;
  }
  
  addListener(event, listener) {
    return this.on(event, listener);
  }
  
  prependListener(event, listener) {
    return this.on(event, listener, { prepend: true });
  }
  
  // One-time listener
  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };
    
    this.onceWrappers.set(wrapper, listener);
    return this.on(event, wrapper);
  }
  
  prependOnceListener(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };
    
    this.onceWrappers.set(wrapper, listener);
    return this.on(event, wrapper, { prepend: true });
  }
  
  // Remove listener
  off(event, listener) {
    if (!this.events.has(event)) return this;
    
    const listeners = this.events.get(event);
    
    for (let i = listeners.length - 1; i >= 0; i--) {
      if (
        listeners[i] === listener ||
        this.onceWrappers.get(listeners[i]) === listener
      ) {
        listeners.splice(i, 1);
        
        // Emit 'removeListener' event
        if (event !== 'removeListener') {
          this.emit('removeListener', event, listener);
        }
        break;
      }
    }
    
    if (listeners.length === 0) {
      this.events.delete(event);
    }
    
    return this;
  }
  
  removeListener(event, listener) {
    return this.off(event, listener);
  }
  
  // Emit event
  emit(event, ...args) {
    // Special handling for 'error' event
    if (event === 'error' && !this.events.has('error')) {
      const error = args[0];
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unhandled error event');
    }
    
    if (!this.events.has(event)) {
      // Also check for wildcard listeners
      if (this.events.has('*')) {
        const wildcardListeners = [...this.events.get('*')];
        wildcardListeners.forEach(listener => {
          this.safeCall(listener, event, ...args);
        });
        return true;
      }
      return false;
    }
    
    const listeners = [...this.events.get(event)];
    
    listeners.forEach(listener => {
      this.safeCall(listener, ...args);
    });
    
    // Also notify wildcard listeners
    if (event !== '*' && this.events.has('*')) {
      const wildcardListeners = [...this.events.get('*')];
      wildcardListeners.forEach(listener => {
        this.safeCall(listener, event, ...args);
      });
    }
    
    return true;
  }
  
  // Safe call with error handling
  safeCall(listener, ...args) {
    try {
      listener.apply(this, args);
    } catch (error) {
      // Emit error or log
      if (this.events.has('error')) {
        this.emit('error', error);
      } else {
        console.error('Error in event listener:', error);
      }
    }
  }
  
  // Async emit (returns Promise)
  async emitAsync(event, ...args) {
    if (!this.events.has(event)) return false;
    
    const listeners = [...this.events.get(event)];
    
    await Promise.all(
      listeners.map(listener => 
        Promise.resolve(listener.apply(this, args))
      )
    );
    
    return true;
  }
  
  // Emit in series (wait for each listener)
  async emitSeries(event, ...args) {
    if (!this.events.has(event)) return false;
    
    const listeners = [...this.events.get(event)];
    
    for (const listener of listeners) {
      await Promise.resolve(listener.apply(this, args));
    }
    
    return true;
  }
  
  // Utility methods
  listenerCount(event) {
    return this.events.has(event) ? this.events.get(event).length : 0;
  }
  
  eventNames() {
    return Array.from(this.events.keys());
  }
  
  listeners(event) {
    if (!this.events.has(event)) return [];
    return this.events.get(event).map(listener => 
      this.onceWrappers.get(listener) || listener
    );
  }
  
  rawListeners(event) {
    return this.events.has(event) ? [...this.events.get(event)] : [];
  }
  
  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

const emitter3 = new EventEmitterExpert();

// Error handling
emitter3.on('error', (err) => console.log('Caught error:', err.message));

// Wildcard listener
emitter3.on('*', (event, ...args) => {
  console.log(`[Wildcard] Event: ${event}, Args:`, args);
});

// Regular events
emitter3.on('user:login', (user) => console.log('User logged in:', user));
emitter3.emit('user:login', { id: 1, name: 'John' });

// Async emit
emitter3.on('async', async () => {
  await new Promise(r => setTimeout(r, 100));
  console.log('Async listener done');
});

// Prepend
emitter3.on('order', () => console.log('Second'));
emitter3.prependListener('order', () => console.log('First'));
emitter3.emit('order');

// newListener/removeListener events
emitter3.on('newListener', (event) => {
  console.log(`New listener added for: ${event}`);
});


// ============================================
// TYPED EVENT EMITTER (TypeScript-friendly)
// ============================================

/**
 * For TypeScript, you'd define events interface:
 * 
 * interface MyEvents {
 *   'user:login': (user: User) => void;
 *   'user:logout': () => void;
 *   'error': (error: Error) => void;
 * }
 * 
 * class TypedEmitter<T> extends EventEmitter {
 *   on<K extends keyof T>(event: K, listener: T[K]): this;
 *   emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean;
 * }
 */


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: Removing listener during emit
 */
const emitter4 = new EventEmitterIntermediate();
let count = 0;

const listener1 = () => {
  console.log('Listener 1');
  emitter4.off('test', listener2); // Remove next listener
};
const listener2 = () => console.log('Listener 2');

emitter4.on('test', listener1);
emitter4.on('test', listener2);
emitter4.emit('test'); // Both still called (we cloned the array)

/**
 * EDGE CASE 2: Adding listener during emit
 */
const emitter5 = new EventEmitterIntermediate();
emitter5.on('test', () => {
  console.log('Original');
  emitter5.on('test', () => console.log('Added during emit'));
});
emitter5.emit('test'); // Only "Original" (new listener in next emit)

/**
 * EDGE CASE 3: Same listener added multiple times
 */
const emitter6 = new EventEmitterIntermediate();
const sameListener = () => console.log('Same');
emitter6.on('test', sameListener);
emitter6.on('test', sameListener);
console.log('Same listener count:', emitter6.listenerCount('test')); // 2


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Use Map/Object to store event -> listeners[]
 * 2. Clone listeners array before iterating
 * 3. Return `this` for method chaining
 * 4. Handle 'error' event specially
 * 5. once() wraps listener to self-remove
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with basic on/off/emit
 * 2. Add once() (common follow-up)
 * 3. Discuss memory leaks (forgotten listeners)
 * 4. Mention Node.js EventEmitter
 * 5. Explain Pub/Sub pattern
 * 
 * MEMORY CONSIDERATIONS:
 * ----------------------
 * - Always remove listeners when done
 * - Use once() for one-time events
 * - Set maxListeners to catch leaks
 * - Use WeakMap for reference tracking
 */


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Not cloning listeners array in emit
 * Modifications during emit cause issues
 * 
 * MISTAKE 2: Memory leaks from unremoved listeners
 * Always clean up in componentWillUnmount, etc.
 * 
 * MISTAKE 3: Forgetting error event handling
 * Unhandled 'error' should throw
 * 
 * MISTAKE 4: Not preserving `this` context
 * Use .apply(this, args) or arrow functions
 * 
 * MISTAKE 5: Synchronous emit blocking
 * Consider async emit for long operations
 */


module.exports = {
  EventEmitterBeginner,
  EventEmitterIntermediate,
  EventEmitterExpert
};
