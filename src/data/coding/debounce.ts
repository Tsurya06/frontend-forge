import type { CodingProblem } from "../../types";

export const debounceProblem: CodingProblem = {
  id: "coding-debounce",
  title: "Debounce with Cancel and Leading/Trailing Edge",
  difficulty: "Intermediate",
  category: "Coding",
  tags: ["debounce", "timers", "closures", "performance", "event-handling"],

  problem: `Implement a debounce function that delays invoking a function until after a specified wait period has elapsed since the last time it was called. If the function is called again before the wait period expires, the timer resets. This is essential for handling rapid-fire events like keystrokes, window resizing, or scroll events.

Your implementation should support three features beyond basic debouncing: (1) a cancel method to abort a pending invocation, (2) a flush method to immediately execute the pending invocation, and (3) configurable leading/trailing edge execution. Leading edge means the function fires immediately on the first call, then ignores subsequent calls within the wait period. Trailing edge (default) means the function fires after the wait period following the last call.

Debouncing is one of the most commonly asked frontend interview questions. It tests understanding of closures, timer management, the this context, and API design. Libraries like Lodash provide full-featured debounce implementations that serve as the gold standard.`,

  requirements: [
    "Delay function execution until after the wait period since the last call",
    "Reset the timer on each new call within the wait period",
    "Support trailing edge execution (fire after wait, default behavior)",
    "Support leading edge execution (fire immediately on first call)",
    "Provide a cancel() method to abort pending execution",
    "Provide a flush() method to immediately execute the pending call",
    "Preserve the this context and arguments of the most recent call",
  ],

  examples: [
    {
      input: `const log = debounce((msg) => console.log(msg), 300);\nlog("a"); log("b"); log("c");`,
      output: 'Logs "c" after 300ms (only the last call)',
      explanation:
        'Each call resets the timer. Only the last call ("c") executes after the wait period.',
    },
    {
      input: `const log = debounce((msg) => console.log(msg), 300, { leading: true });\nlog("a"); log("b"); log("c");`,
      output: 'Logs "a" immediately, then "c" after 300ms',
      explanation:
        "With leading: true, the first call fires immediately. The trailing call fires with the most recent args.",
    },
    {
      input: `const search = debounce(query => fetch(query), 500);\nsearch("h"); search("he"); search("hel");\nsearch.cancel();`,
      output: "No fetch is made (cancelled)",
      explanation: "cancel() aborts the pending debounced execution.",
    },
  ],

  edgeCases: [
    "Calling cancel when no invocation is pending (should be safe)",
    "Calling flush when no invocation is pending (should be a no-op)",
    "Both leading and trailing set to true (fire on both edges)",
    "Both leading and trailing set to false (never fires — edge case to handle)",
    "Rapid calls followed by a long pause",
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

  theoryAndConcepts:
    'WHAT IS DEBOUNCING?\n-------------------\nDebouncing delays function execution until a pause in invocations.\nThe function only executes after the user "stops" triggering it.\n\nVISUAL TIMELINE:\n----------------\nCalls:    |--X--X--X--X--------|-------X--X--------|\nWait:                   [300ms]           [300ms]\nExecute:                      \u2193                   \u2193\n\nUSE CASES:\n----------\n1. Search input (wait for user to stop typing)\n2. Window resize handlers\n3. Auto-save (save after user stops editing)\n4. Button click (prevent double-clicks)\n\nDEBOUNCE VS THROTTLE:\n---------------------\nDEBOUNCE: Waits for "silence", executes once at the end\nTHROTTLE: Executes at regular intervals during activity\n\nCalls:    |--X--X--X--X--X--X--|\nDebounce:                      \u2193 (once at end)\nThrottle: \u2193-----\u2193-----\u2193-----\u2193   (every N ms)\n\n\n\nDEBOUNCE OPTIONS:\n-----------------\nleading:  Execute on first call (immediate feedback)\ntrailing: Execute after delay (default behavior)\nmaxWait:  Maximum time to wait before forcing execution',
  beginnerApproach:
    "Beginner: Simple debounce (trailing only)\nMost common use case",
  beginnerImplementation:
    "function debounceBeginner(fn, delay) {\n  let timeoutId = null;\n  \n  return function(...args) {\n    // Clear previous timeout\n    clearTimeout(timeoutId);\n    \n    // Set new timeout\n    timeoutId = setTimeout(() => {\n      fn.apply(this, args);\n    }, delay);\n  };\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst logBeginner = debounceBeginner((text) => {\n  console.log('Search:', text);\n}, 300);\n\n// Simulate typing\nlogBeginner('h');\nlogBeginner('he');\nlogBeginner('hel');\nlogBeginner('hell');\nlogBeginner('hello');\n// Only \"hello\" will be logged after 300ms",
  intermediateApproach: "Intermediate: Debounce with cancel and flush",
  intermediateImplementation:
    "function debounceIntermediate(fn, delay) {\n  let timeoutId = null;\n  let lastArgs = null;\n  let lastThis = null;\n  \n  function debounced(...args) {\n    lastArgs = args;\n    lastThis = this;\n    \n    clearTimeout(timeoutId);\n    \n    timeoutId = setTimeout(() => {\n      fn.apply(lastThis, lastArgs);\n      timeoutId = null;\n      lastArgs = null;\n      lastThis = null;\n    }, delay);\n  }\n  \n  // Cancel pending execution\n  debounced.cancel = function() {\n    clearTimeout(timeoutId);\n    timeoutId = null;\n    lastArgs = null;\n    lastThis = null;\n  };\n  \n  // Execute immediately if pending\n  debounced.flush = function() {\n    if (timeoutId !== null) {\n      clearTimeout(timeoutId);\n      fn.apply(lastThis, lastArgs);\n      timeoutId = null;\n      lastArgs = null;\n      lastThis = null;\n    }\n  };\n  \n  // Check if there's a pending execution\n  debounced.pending = function() {\n    return timeoutId !== null;\n  };\n  \n  return debounced;\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst save = debounceIntermediate((data) => {\n  console.log('Saving:', data);\n}, 1000);\n\nsave('draft 1');\nsave('draft 2');\nconsole.log('Pending:', save.pending()); // true\n\n// Cancel example\nsave('draft 3');\nsave.cancel();\nconsole.log('After cancel, pending:', save.pending()); // false\n\n// Flush example\nsave('final');\nsave.flush(); // Saves immediately",
  expertApproach:
    "Expert: Full-featured debounce with leading, trailing, maxWait",
  expertImplementation:
    "function debounceExpert(fn, delay, options = {}) {\n  const {\n    leading = false,    // Execute on leading edge\n    trailing = true,    // Execute on trailing edge\n    maxWait = null      // Maximum time to wait\n  } = options;\n  \n  let timeoutId = null;\n  let maxTimeoutId = null;\n  let lastArgs = null;\n  let lastThis = null;\n  let lastCallTime = null;\n  let lastInvokeTime = 0;\n  let result = undefined;\n  \n  function invokeFunc(time) {\n    const args = lastArgs;\n    const thisArg = lastThis;\n    \n    lastArgs = lastThis = null;\n    lastInvokeTime = time;\n    result = fn.apply(thisArg, args);\n    return result;\n  }\n  \n  function shouldInvoke(time) {\n    const timeSinceLastCall = time - lastCallTime;\n    const timeSinceLastInvoke = time - lastInvokeTime;\n    \n    // First call, or enough time passed, or system time went backwards\n    return (\n      lastCallTime === null ||\n      timeSinceLastCall >= delay ||\n      timeSinceLastCall < 0 ||\n      (maxWait !== null && timeSinceLastInvoke >= maxWait)\n    );\n  }\n  \n  function remainingWait(time) {\n    const timeSinceLastCall = time - lastCallTime;\n    const timeSinceLastInvoke = time - lastInvokeTime;\n    const timeWaiting = delay - timeSinceLastCall;\n    \n    return maxWait !== null\n      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)\n      : timeWaiting;\n  }\n  \n  function trailingEdge(time) {\n    timeoutId = null;\n    \n    // Only invoke if we have args (meaning debounced was called)\n    if (trailing && lastArgs) {\n      return invokeFunc(time);\n    }\n    \n    lastArgs = lastThis = null;\n    return result;\n  }\n  \n  function timerExpired() {\n    const time = Date.now();\n    \n    if (shouldInvoke(time)) {\n      return trailingEdge(time);\n    }\n    \n    // Restart timer with remaining time\n    timeoutId = setTimeout(timerExpired, remainingWait(time));\n  }\n  \n  function leadingEdge(time) {\n    lastInvokeTime = time;\n    timeoutId = setTimeout(timerExpired, delay);\n    \n    // Invoke on leading edge\n    return leading ? invokeFunc(time) : result;\n  }\n  \n  function debounced(...args) {\n    const time = Date.now();\n    const isInvoking = shouldInvoke(time);\n    \n    lastArgs = args;\n    lastThis = this;\n    lastCallTime = time;\n    \n    if (isInvoking) {\n      if (timeoutId === null) {\n        return leadingEdge(time);\n      }\n      \n      // Handle maxWait case\n      if (maxWait !== null) {\n        timeoutId = setTimeout(timerExpired, delay);\n        return invokeFunc(time);\n      }\n    }\n    \n    if (timeoutId === null) {\n      timeoutId = setTimeout(timerExpired, delay);\n    }\n    \n    return result;\n  }\n  \n  debounced.cancel = function() {\n    if (timeoutId !== null) {\n      clearTimeout(timeoutId);\n    }\n    if (maxTimeoutId !== null) {\n      clearTimeout(maxTimeoutId);\n    }\n    lastInvokeTime = 0;\n    lastArgs = lastCallTime = lastThis = timeoutId = maxTimeoutId = null;\n  };\n  \n  debounced.flush = function() {\n    if (timeoutId === null) {\n      return result;\n    }\n    return trailingEdge(Date.now());\n  };\n  \n  debounced.pending = function() {\n    return timeoutId !== null;\n  };\n  \n  return debounced;\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Leading edge (immediate execution)\nconsole.log('--- Leading Edge ---');\nconst leadingDebounce = debounceExpert(\n  (x) => console.log('Leading:', x),\n  300,\n  { leading: true, trailing: false }\n);\n\nleadingDebounce('first'); // Executes immediately\nleadingDebounce('second'); // Ignored\nleadingDebounce('third'); // Ignored\n\n// Both leading and trailing\nconsole.log('\\n--- Leading + Trailing ---');\nconst bothDebounce = debounceExpert(\n  (x) => console.log('Both:', x),\n  300,\n  { leading: true, trailing: true }\n);\n\nbothDebounce('first'); // Executes immediately\nbothDebounce('second');\nbothDebounce('third'); // Will execute after 300ms\n\n// MaxWait (guarantees execution within time limit)\nconsole.log('\\n--- MaxWait ---');\nconst maxWaitDebounce = debounceExpert(\n  (x) => console.log('MaxWait:', x, 'at', Date.now()),\n  300,\n  { maxWait: 1000 }\n);\n\n// Continuous calls for 2 seconds\nlet counter = 0;\nconst interval = setInterval(() => {\n  maxWaitDebounce(++counter);\n}, 100);\n\nsetTimeout(() => {\n  clearInterval(interval);\n  maxWaitDebounce.flush();\n}, 2000);",
  interviewTraps: [
    "console.log('\\n=== EDGE CASES ===');",
    "EDGE CASE 1: Zero delay",
    "Still defers execution to next tick",
    "const zeroDelay = debounceBeginner((x) => console.log('Zero delay:', x), 0);",
    "zeroDelay('test'); // Executes on next tick",
    "EDGE CASE 2: Preserving `this` context",
    "const obj = {",
    "logValue: debounceBeginner(function() {",
  ],
  stepByStep: [
    "Initialize closure state: timerId, lastArgs, lastThis, and result.",
    "In the debounced function, save the latest arguments and this context.",
    "Check if this is the first call (no active timer) for leading-edge logic.",
    "Clear any existing timer with clearTimeout to reset the wait period.",
    "If leading mode and first call: invoke immediately, then start a new timer.",
    "If trailing mode (default): just start a new timer that will invoke when it fires.",
    "When the timer fires: check if there are saved args and trailing is enabled, invoke if so.",
    "Implement cancel(): clear the timer and reset all saved state.",
    "Implement flush(): if there's a pending timer and saved args, clear the timer and invoke immediately.",
  ],

  timeComplexity: "O(1) per call — just timer management and state updates.",
  spaceComplexity:
    "O(1) — fixed number of closure variables regardless of call frequency.",

  commonMistakes: [
    "Not preserving the `this` context — must use fn.apply(thisArg, args) not fn(...args)",
    "Not saving lastArgs on leading-edge invoke, causing stale arguments",
    "Forgetting to clear lastArgs after invoke, causing the trailing edge to fire with stale args",
    "Not handling the case where both leading and trailing are true (should fire on both edges)",
  ],

  followUps: [
    "What is the difference between debounce and throttle? When would you use each?",
    "How would you implement a debounce that returns a Promise resolving with the result?",
    "How does React's useDeferredValue relate to debouncing?",
  ],
};
