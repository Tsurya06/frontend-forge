import type { CodingProblem } from '../../types';

export const observerPatternProblem: CodingProblem = {
  id: 'coding-observer-pattern',
  title: 'Implement the Observer Pattern (Observable / Subject)',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['javascript', 'design-patterns', 'observer-pattern', 'pub-sub', 'reactive-programming', 'rxjs'],

  problem: `Implement the classic Observer Pattern with a \`Subject\` (or \`Observable\`) and \`Observer\` interface in JavaScript/TypeScript.

The implementation must support:
1. \`subject.subscribe(observer)\`: Subscribes an observer (function or object with \`next\`, \`error\`, \`complete\` methods). Returns a subscription object with an \`unsubscribe()\` method.
2. \`subject.next(data)\`: Notifies all active subscribers with data.
3. \`subject.error(err)\`: Notifies subscribers of an error and completes the stream.
4. \`subject.complete()\`: Notifies subscribers of completion; no further values are emitted.
5. **BehaviorSubject**: A specialized subject variant that stores the "current" value and immediately emits it to any new subscriber upon subscription.
6. **Operators**: Basic pipeline operators like \`map\` and \`filter\` to transform streams.`,

  requirements: [
    'Subject with subscribe, next, error, complete methods',
    'Return subscription with unsubscribe() function',
    'Prevent memory leaks: unsubscribe cleans up observer reference',
    'BehaviorSubject storing current/initial value and replaying to new subscribers',
    'Stream completion stops further notifications',
  ],

  examples: [
    {
      input: `const subject = new Subject();\nconst sub1 = subject.subscribe(val => console.log('Sub 1:', val));\nsubject.next(10);\nconst sub2 = subject.subscribe(val => console.log('Sub 2:', val));\nsubject.next(20);\nsub1.unsubscribe();\nsubject.next(30);`,
      output: `Sub 1: 10\nSub 1: 20\nSub 2: 20\nSub 2: 30`,
      explanation: 'sub1 receives 10 and 20, then unsubscribes; sub2 receives 20 and 30.',
    },
    {
      input: `const bSubject = new BehaviorSubject('initial');\nbSubject.subscribe(val => console.log('Received:', val));\nbSubject.next('updated');`,
      output: `Received: initial\nReceived: updated`,
      explanation: 'BehaviorSubject immediately emits its current value on subscription.',
    },
  ],

  edgeCases: [
    'Unsubscribing multiple times: idempotent, does not throw error',
    'Unsubscribing inside an observer callback during a next() broadcast: iterate a copy of observers array to avoid index shifting',
    'Calling next() after complete() or error(): silently ignored',
    'Throwing inside an observer callback: isolate errors so other observers still receive data',
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

  stepByStep: [
    'Define Subject class maintaining observers Set and isClosed boolean.',
    'Implement subscribe returning subscription with idempotent unsubscribe closure.',
    'Implement next iterating snapshot of observers and executing callback safely.',
    'Implement error and complete closing stream and cleaning up observer Set.',
    'Subclass BehaviorSubject to store current value and immediately emit to new subscribers.',
  ],

  timeComplexity: 'O(1) subscription and unsubscription; O(K) broadcast where K is the number of active subscribers.',
  spaceComplexity: 'O(K) to store references to active subscribers in memory.',

  alternativeSolutions: [
    'EventEmitter (keyed by string event names vs typed streams)',
    'BroadcastChannel / CustomEvent browser event system',
  ],

  commonMistakes: [
    'Iterating over the live observers collection while allowing subscribers to unsubscribe in their next() handlers.',
    'Emitting values after complete() or error() has been called.',
    'Not emitting initial value synchronously during BehaviorSubject.subscribe().',
  ],

  followUps: [
    'How does the Observer pattern differ from the Pub/Sub pattern (broker vs direct coupling)?',
    'How would you implement a pipe() method supporting map, filter, and debounce operators?',
    'How is this pattern used internally in React state managers like Zustand, Redux, and RxJS?',
  ],
};
