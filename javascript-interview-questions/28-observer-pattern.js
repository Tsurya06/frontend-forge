/**
 * ============================================
 * OBSERVER PATTERN - Complete Guide
 * ============================================
 * 
 * Topic: Implement the Observer Pattern in JavaScript
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS THE OBSERVER PATTERN?
 * -----------------------------
 * A behavioral design pattern where an object (Subject/Observable)
 * maintains a list of dependents (Observers) and notifies them
 * automatically of state changes.
 * 
 * Also known as:
 * - Pub/Sub (Publish/Subscribe)
 * - Event Emitter
 * - Listener Pattern
 * 
 * KEY COMPONENTS:
 * ---------------
 * 1. Subject (Observable): Maintains observers, sends notifications
 * 2. Observer: Receives updates from subject
 * 3. ConcreteSubject: Stores state, notifies when state changes
 * 4. ConcreteObserver: Implements update logic
 * 
 * USE CASES:
 * ----------
 * - Event handling (DOM events)
 * - State management (Redux, MobX)
 * - Real-time updates (WebSocket messages)
 * - Data binding (frameworks)
 * - Logging systems
 * 
 * OBSERVER vs EVENT EMITTER:
 * --------------------------
 * Observer: Objects subscribe to subject
 * Event Emitter: Functions subscribe to named events
 * (In practice, very similar - EventEmitter is a form of Observer)
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple Observer Pattern
 */
class SubjectBeginner {
  constructor() {
    this.observers = [];
  }
  
  // Add observer
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  // Remove observer
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  // Notify all observers
  notify(data) {
    this.observers.forEach(observer => observer(data));
  }
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const subject = new SubjectBeginner();

// Observer functions
const observer1 = (data) => console.log('Observer 1:', data);
const observer2 = (data) => console.log('Observer 2:', data);

subject.subscribe(observer1);
subject.subscribe(observer2);

subject.notify('Hello Observers!');

subject.unsubscribe(observer1);
subject.notify('Only Observer 2');


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Observable with state
 */
class Observable {
  constructor(initialState = null) {
    this._observers = new Set();
    this._state = initialState;
  }
  
  // Get current state
  get state() {
    return this._state;
  }
  
  // Set state and notify
  set state(newState) {
    const oldState = this._state;
    this._state = newState;
    this._notify(newState, oldState);
  }
  
  // Update state (for objects)
  setState(updater) {
    const oldState = this._state;
    
    if (typeof updater === 'function') {
      this._state = updater(this._state);
    } else {
      this._state = { ...this._state, ...updater };
    }
    
    this._notify(this._state, oldState);
  }
  
  // Subscribe with automatic unsubscribe function
  subscribe(observer) {
    this._observers.add(observer);
    
    // Immediately call with current state
    observer(this._state, this._state);
    
    // Return unsubscribe function
    return () => {
      this._observers.delete(observer);
    };
  }
  
  _notify(newState, oldState) {
    this._observers.forEach(observer => {
      try {
        observer(newState, oldState);
      } catch (error) {
        console.error('Observer error:', error);
      }
    });
  }
}

/**
 * Intermediate: Observer with filter (selective subscription)
 */
class SelectiveObservable extends Observable {
  subscribe(observer, selector = state => state) {
    let previousSelected = selector(this._state);
    
    const wrappedObserver = (newState, oldState) => {
      const newSelected = selector(newState);
      const oldSelected = previousSelected;
      
      // Only notify if selected value changed
      if (newSelected !== oldSelected) {
        previousSelected = newSelected;
        observer(newSelected, oldSelected);
      }
    };
    
    return super.subscribe(wrappedObserver);
  }
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const store = new Observable({ count: 0, name: 'Test' });

const unsubscribe = store.subscribe((state, oldState) => {
  console.log('State changed:', oldState, '->', state);
});

store.setState({ count: 1 });
store.setState(state => ({ ...state, count: state.count + 1 }));

unsubscribe();
store.setState({ count: 100 }); // No log - unsubscribed

// Selective
const selectiveStore = new SelectiveObservable({ a: 1, b: 2 });
selectiveStore.subscribe(
  (value) => console.log('A changed:', value),
  state => state.a
);

selectiveStore.setState({ a: 1, b: 100 }); // No notify (a unchanged)
selectiveStore.setState({ a: 2, b: 100 }); // Notify (a changed)


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured Observable System
 */
class AdvancedObservable {
  constructor(initialState = {}) {
    this._state = initialState;
    this._observers = new Map(); // Map<observerId, { callback, options }>
    this._nextId = 0;
    this._middleware = [];
    this._history = [];
    this._maxHistory = 10;
  }
  
  // Get state or nested value
  get(path) {
    if (!path) return this._state;
    
    return path.split('.').reduce((obj, key) => 
      obj && obj[key] !== undefined ? obj[key] : undefined
    , this._state);
  }
  
  // Set state with optional path
  set(pathOrValue, value) {
    let newState;
    
    if (typeof pathOrValue === 'string') {
      newState = this._setNested(this._state, pathOrValue, value);
    } else {
      newState = typeof pathOrValue === 'function' 
        ? pathOrValue(this._state) 
        : pathOrValue;
    }
    
    // Run middleware
    for (const mw of this._middleware) {
      newState = mw(newState, this._state);
      if (newState === false) return; // Middleware can cancel
    }
    
    // Save history
    this._history.push(this._state);
    if (this._history.length > this._maxHistory) {
      this._history.shift();
    }
    
    const oldState = this._state;
    this._state = newState;
    this._notify(newState, oldState);
  }
  
  _setNested(obj, path, value) {
    const keys = path.split('.');
    const newObj = { ...obj };
    let current = newObj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    return newObj;
  }
  
  // Subscribe with options
  subscribe(callback, options = {}) {
    const {
      immediate = true,      // Call immediately with current state
      selector = null,       // Select specific part of state
      equalityFn = (a, b) => a === b, // Custom equality check
      debounce = 0           // Debounce notifications
    } = options;
    
    const id = this._nextId++;
    
    let previousSelected = selector ? selector(this._state) : this._state;
    let timeoutId = null;
    
    const wrappedCallback = (newState, oldState) => {
      const newSelected = selector ? selector(newState) : newState;
      
      // Check if changed
      if (equalityFn(newSelected, previousSelected)) {
        return;
      }
      
      const oldSelected = previousSelected;
      previousSelected = newSelected;
      
      if (debounce > 0) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          callback(newSelected, oldSelected);
        }, debounce);
      } else {
        callback(newSelected, oldSelected);
      }
    };
    
    this._observers.set(id, { callback: wrappedCallback, options });
    
    // Immediate call
    if (immediate) {
      callback(previousSelected, previousSelected);
    }
    
    // Return unsubscribe function
    return () => {
      clearTimeout(timeoutId);
      this._observers.delete(id);
    };
  }
  
  // Add middleware
  use(middleware) {
    this._middleware.push(middleware);
    return () => {
      const index = this._middleware.indexOf(middleware);
      if (index > -1) this._middleware.splice(index, 1);
    };
  }
  
  // Undo last change
  undo() {
    if (this._history.length > 0) {
      const previousState = this._history.pop();
      const oldState = this._state;
      this._state = previousState;
      this._notify(this._state, oldState);
      return true;
    }
    return false;
  }
  
  // Batch multiple updates
  batch(updates) {
    const oldState = this._state;
    let newState = this._state;
    
    for (const update of updates) {
      if (typeof update === 'function') {
        newState = update(newState);
      } else {
        newState = { ...newState, ...update };
      }
    }
    
    this._state = newState;
    this._notify(newState, oldState);
  }
  
  _notify(newState, oldState) {
    this._observers.forEach(({ callback }) => {
      try {
        callback(newState, oldState);
      } catch (error) {
        console.error('Observer error:', error);
      }
    });
  }
  
  // Observable info
  get observerCount() {
    return this._observers.size;
  }
  
  get historyLength() {
    return this._history.length;
  }
}

/**
 * Expert: Reactive programming style
 */
class ReactiveValue {
  static create(initialValue) {
    return new ReactiveValue(initialValue);
  }
  
  constructor(initialValue) {
    this._value = initialValue;
    this._subscribers = new Set();
    this._derivations = new Set();
  }
  
  get value() {
    return this._value;
  }
  
  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._notify();
      this._updateDerived();
    }
  }
  
  subscribe(fn) {
    this._subscribers.add(fn);
    return () => this._subscribers.delete(fn);
  }
  
  _notify() {
    this._subscribers.forEach(fn => fn(this._value));
  }
  
  _updateDerived() {
    this._derivations.forEach(derived => derived._recompute());
  }
  
  // Create derived value
  derive(computeFn) {
    const derived = new DerivedValue(computeFn, [this]);
    this._derivations.add(derived);
    return derived;
  }
  
  // Combine multiple reactive values
  static combine(reactives, combineFn) {
    return new DerivedValue(() => combineFn(...reactives.map(r => r.value)), reactives);
  }
}

class DerivedValue extends ReactiveValue {
  constructor(computeFn, dependencies) {
    super(null);
    this._computeFn = computeFn;
    this._dependencies = dependencies;
    this._recompute();
  }
  
  _recompute() {
    this.value = this._computeFn();
  }
  
  // Derived values are read-only
  set value(v) {
    super.value = v;
  }
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Advanced Observable
const appState = new AdvancedObservable({
  user: { name: 'John', age: 30 },
  settings: { theme: 'dark' }
});

// Middleware for logging
appState.use((newState, oldState) => {
  console.log('State update:', { from: oldState, to: newState });
  return newState;
});

// Subscribe to specific path
const unsubUser = appState.subscribe(
  (user) => console.log('User changed:', user),
  { selector: state => state.user }
);

appState.set('user.name', 'Jane');
appState.set('settings.theme', 'light'); // User observer not called

appState.undo(); // Revert last change

// Reactive values
const count = ReactiveValue.create(0);
const doubled = count.derive(c => c.value * 2);

doubled.subscribe(val => console.log('Doubled:', val));

count.value = 5; // Logs: "Doubled: 10"


// ============================================
// COMPARISON: OBSERVER VARIANTS
// ============================================

console.log('\n=== OBSERVER VARIANTS ===');

/**
 * 1. Classic Observer (GoF pattern)
 */
class ClassicSubject {
  constructor() { this.observers = []; }
  attach(observer) { this.observers.push(observer); }
  detach(observer) { this.observers = this.observers.filter(o => o !== observer); }
  notify(data) { this.observers.forEach(o => o.update(data)); }
}

class ClassicObserver {
  update(data) {
    console.log('ClassicObserver received:', data);
  }
}

/**
 * 2. Event-based (Node.js style)
 */
class EventBasedSubject {
  constructor() { this.events = new Map(); }
  on(event, handler) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(handler);
  }
  emit(event, data) {
    (this.events.get(event) || []).forEach(h => h(data));
  }
}

/**
 * 3. RxJS-style Observable
 */
function createObservable(subscribeFn) {
  return {
    subscribe(observer) {
      const obs = typeof observer === 'function' 
        ? { next: observer, error: () => {}, complete: () => {} }
        : observer;
      return subscribeFn(obs);
    },
    pipe(...operators) {
      return operators.reduce((source, op) => op(source), this);
    }
  };
}


// ============================================
// REAL-WORLD APPLICATIONS
// ============================================

console.log('\n=== REAL-WORLD APPLICATIONS ===');

// 1. Simple Store (Redux-like)
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();
  
  return {
    getState: () => state,
    dispatch: (action) => {
      state = reducer(state, action);
      listeners.forEach(listener => listener(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

// 2. Form state observer
function createFormObserver(form) {
  const subject = new SubjectBeginner();
  
  form.addEventListener('input', (e) => {
    subject.notify({
      field: e.target.name,
      value: e.target.value
    });
  });
  
  return subject;
}


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * Subject: Maintains list of observers, notifies them
 * Observer: Receives updates, implements update method
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Explain the pattern conceptually first
 * 2. Show simple implementation
 * 3. Discuss use cases (events, state, data binding)
 * 4. Mention memory leaks (unsubscribe!)
 * 
 * GOTCHAS:
 * --------
 * - Always provide unsubscribe mechanism
 * - Handle errors in observers
 * - Consider order of notifications
 * - Avoid infinite notification loops
 */


module.exports = {
  SubjectBeginner,
  Observable,
  SelectiveObservable,
  AdvancedObservable,
  ReactiveValue,
  createObservable,
  createStore
};
