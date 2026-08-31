import type { CodingProblem } from '../../types';

export const debounceProblem: CodingProblem = {
  id: 'coding-debounce',
  title: 'Debounce with Cancel and Leading/Trailing Edge',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['debounce', 'timers', 'closures', 'performance', 'event-handling'],

  problem: `Implement a debounce function that delays invoking a function until after a specified wait period has elapsed since the last time it was called. If the function is called again before the wait period expires, the timer resets. This is essential for handling rapid-fire events like keystrokes, window resizing, or scroll events.

Your implementation should support three features beyond basic debouncing: (1) a cancel method to abort a pending invocation, (2) a flush method to immediately execute the pending invocation, and (3) configurable leading/trailing edge execution. Leading edge means the function fires immediately on the first call, then ignores subsequent calls within the wait period. Trailing edge (default) means the function fires after the wait period following the last call.

Debouncing is one of the most commonly asked frontend interview questions. It tests understanding of closures, timer management, the this context, and API design. Libraries like Lodash provide full-featured debounce implementations that serve as the gold standard.`,

  requirements: [
    'Delay function execution until after the wait period since the last call',
    'Reset the timer on each new call within the wait period',
    'Support trailing edge execution (fire after wait, default behavior)',
    'Support leading edge execution (fire immediately on first call)',
    'Provide a cancel() method to abort pending execution',
    'Provide a flush() method to immediately execute the pending call',
    'Preserve the this context and arguments of the most recent call',
  ],

  examples: [
    {
      input: `const log = debounce((msg) => console.log(msg), 300);\nlog("a"); log("b"); log("c");`,
      output: 'Logs "c" after 300ms (only the last call)',
      explanation: 'Each call resets the timer. Only the last call ("c") executes after the wait period.',
    },
    {
      input: `const log = debounce((msg) => console.log(msg), 300, { leading: true });\nlog("a"); log("b"); log("c");`,
      output: 'Logs "a" immediately, then "c" after 300ms',
      explanation: 'With leading: true, the first call fires immediately. The trailing call fires with the most recent args.',
    },
    {
      input: `const search = debounce(query => fetch(query), 500);\nsearch("h"); search("he"); search("hel");\nsearch.cancel();`,
      output: 'No fetch is made (cancelled)',
      explanation: 'cancel() aborts the pending debounced execution.',
    },
  ],

  edgeCases: [
    'Calling cancel when no invocation is pending (should be safe)',
    'Calling flush when no invocation is pending (should be a no-op)',
    'Both leading and trailing set to true (fire on both edges)',
    'Both leading and trailing set to false (never fires — edge case to handle)',
    'Rapid calls followed by a long pause',
  ],

  naiveApproach: `A naive debounce just uses clearTimeout and setTimeout — each call clears the previous timer and sets a new one. While this handles the basic trailing-edge case, it doesn't support leading edge, cancel, or flush. It also often loses the this context by not using apply/call when invoking the original function.`,

  optimalApproach: `The optimal approach tracks several pieces of state in a closure: the timer ID, the most recent arguments and context, and whether we're in a debounce cycle (for leading edge). The returned function clears any existing timer, saves the latest args and context, then sets a new timer for the wait duration.

For leading edge: on the first call (when no timer is active), invoke immediately. Set a flag indicating we're in a cycle. Subsequent calls within the wait period update the saved args but don't invoke. When the timer fires, check if there are newer args to invoke with (trailing), then reset the cycle flag.

The cancel method clears the timer and resets all state. The flush method checks if there's a pending invocation, and if so, clears the timer and executes immediately with the saved args. Both are attached as properties of the returned function.`,

  implementation: `function debounce(fn, wait, options = {}) {
  const { leading = false, trailing = true } = options;

  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let result;

  function invoke() {
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = null;
    lastThis = null;
    result = fn.apply(thisArg, args);
    return result;
  }

  function startTimer() {
    timerId = setTimeout(() => {
      timerId = null;
      if (trailing && lastArgs) {
        invoke();
      }
    }, wait);
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    const isFirstCall = timerId === null;

    clearTimeout(timerId);

    if (leading && isFirstCall) {
      invoke();
      startTimer();
    } else {
      startTimer();
    }

    return result;
  }

  debounced.cancel = function () {
    clearTimeout(timerId);
    timerId = null;
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = function () {
    if (timerId !== null && lastArgs) {
      clearTimeout(timerId);
      timerId = null;
      return invoke();
    }
    return result;
  };

  debounced.pending = function () {
    return timerId !== null;
  };

  return debounced;
}

// Usage: basic trailing debounce
const onResize = debounce(() => {
  console.log('Resized at', Date.now());
}, 250);

window.addEventListener('resize', onResize);

// Usage: search with leading edge
const onSearch = debounce(
  (query) => console.log('Searching:', query),
  300,
  { leading: true, trailing: true }
);

onSearch('h');    // fires immediately: "Searching: h"
onSearch('he');   // resets timer
onSearch('hel');  // resets timer
// after 300ms: "Searching: hel"

// Usage: cancel pending
const autoSave = debounce((data) => {
  console.log('Saving:', data);
}, 2000);

autoSave({ text: 'draft' });
autoSave.cancel(); // abort the save
console.log('Pending:', autoSave.pending()); // false`,

  implementationTS: `interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
  pending(): boolean;
}

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: DebounceOptions = {},
): DebouncedFunction<T> {
  const { leading = false, trailing = true } = options;

  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null;
  let result: ReturnType<T> | undefined;

  function invoke(): ReturnType<T> {
    const args = lastArgs!;
    const thisArg = lastThis;
    lastArgs = null;
    lastThis = null;
    result = fn.apply(thisArg, args);
    return result!;
  }

  function startTimer(): void {
    timerId = setTimeout(() => {
      timerId = null;
      if (trailing && lastArgs) {
        invoke();
      }
    }, wait);
  }

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;
    const isFirstCall = timerId === null;

    if (timerId !== null) clearTimeout(timerId);

    if (leading && isFirstCall) {
      invoke();
      startTimer();
    } else {
      startTimer();
    }

    return result;
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timerId !== null) clearTimeout(timerId);
    timerId = null;
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = () => {
    if (timerId !== null && lastArgs) {
      clearTimeout(timerId);
      timerId = null;
      return invoke();
    }
    return result;
  };

  debounced.pending = () => timerId !== null;

  return debounced;
}`,

  stepByStep: [
    'Initialize closure state: timerId, lastArgs, lastThis, and result.',
    'In the debounced function, save the latest arguments and this context.',
    'Check if this is the first call (no active timer) for leading-edge logic.',
    'Clear any existing timer with clearTimeout to reset the wait period.',
    'If leading mode and first call: invoke immediately, then start a new timer.',
    'If trailing mode (default): just start a new timer that will invoke when it fires.',
    'When the timer fires: check if there are saved args and trailing is enabled, invoke if so.',
    'Implement cancel(): clear the timer and reset all saved state.',
    'Implement flush(): if there\'s a pending timer and saved args, clear the timer and invoke immediately.',
  ],

  timeComplexity: 'O(1) per call — just timer management and state updates.',
  spaceComplexity: 'O(1) — fixed number of closure variables regardless of call frequency.',

  commonMistakes: [
    'Not preserving the `this` context — must use fn.apply(thisArg, args) not fn(...args)',
    'Not saving lastArgs on leading-edge invoke, causing stale arguments',
    'Forgetting to clear lastArgs after invoke, causing the trailing edge to fire with stale args',
    'Not handling the case where both leading and trailing are true (should fire on both edges)',
  ],

  followUps: [
    'What is the difference between debounce and throttle? When would you use each?',
    'How would you implement a debounce that returns a Promise resolving with the result?',
    'How does React\'s useDeferredValue relate to debouncing?',
  ],
};
