import type { CodingProblem } from '../../types';

export const customSetIntervalProblem: CodingProblem = {
  id: 'coding-set-interval',
  title: 'Implement Custom setInterval',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['timers', 'setTimeout', 'closures', 'async', 'browser-api'],

  problem: `Implement a custom version of setInterval using only setTimeout. The function should repeatedly call a callback at a specified interval and return a cancel function that stops the repetition when invoked.

The native setInterval has a subtle behavior: it schedules the next call at a fixed interval from the start of the previous call, regardless of how long the callback takes. Depending on interview requirements, you might implement it as scheduling the next call after the previous one completes (chained setTimeout), or at fixed wall-clock intervals. The chained approach is generally preferred because it prevents overlapping executions when the callback takes longer than the interval.

This problem tests understanding of JavaScript's event loop, timer APIs, closure-based state management, and the differences between setInterval and chained setTimeout.`,

  requirements: [
    'Accept a callback function and an interval in milliseconds',
    'Repeatedly execute the callback at the specified interval using setTimeout',
    'Return a cancel/clear function that stops future executions',
    'The callback should not execute after cancel is called',
    'Handle edge cases like zero or negative intervals',
    'Optional: support passing arguments to the callback',
  ],

  examples: [
    {
      input: `const cancel = customSetInterval(() => console.log("tick"), 1000);`,
      output: 'Logs "tick" every ~1000ms',
      explanation: 'The callback is called repeatedly using chained setTimeout calls.',
    },
    {
      input: `const cancel = customSetInterval(() => console.log("tick"), 1000);\nsetTimeout(() => cancel(), 3500);`,
      output: 'Logs "tick" 3 times then stops',
      explanation: 'Calling cancel() after 3.5 seconds stops the interval, so approximately 3 ticks occur.',
    },
    {
      input: `const cancel = customSetInterval((msg) => console.log(msg), 500, "hello");`,
      output: 'Logs "hello" every ~500ms',
      explanation: 'Extra arguments are forwarded to the callback.',
    },
  ],

  edgeCases: [
    'Calling cancel immediately before any callback fires',
    'Calling cancel multiple times (should be safe/idempotent)',
    'Very short intervals (0ms or 1ms)',
    'Callback that throws an error (should not prevent future calls)',
  ],

  naiveApproach: `A naive approach might just wrap setInterval in a function and return clearInterval. But the actual challenge is implementing setInterval from scratch using only setTimeout. Another naive attempt might use a while loop with a sleep, but JavaScript is single-threaded and this would block the event loop entirely.`,

  optimalApproach: `The optimal approach uses a recursive pattern: schedule a setTimeout that calls the callback and then schedules the next setTimeout. A boolean flag or timer ID tracked in a closure allows the cancel function to prevent the next scheduling.

The function creates a closure over a "cancelled" flag. An inner function (tick) calls setTimeout with the given delay. When the timer fires, it checks the cancelled flag — if not cancelled, it executes the callback and calls tick() again to schedule the next iteration. The returned cancel function simply sets the cancelled flag to true and clears the pending timeout.

This chained-setTimeout approach is actually superior to native setInterval for async work because it guarantees the interval between the END of one callback and the START of the next, preventing overlapping executions.`,

  implementation: `function customSetInterval(callback, delay, ...args) {
  let timerId = null;
  let cancelled = false;

  function tick() {
    timerId = setTimeout(() => {
      if (cancelled) return;
      callback(...args);
      tick();
    }, delay);
  }

  tick();

  return function cancel() {
    cancelled = true;
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };
}

// Usage
let count = 0;
const cancel = customSetInterval(() => {
  count++;
  console.log('Tick:', count);
}, 1000);

// Stop after 5 ticks
setTimeout(() => {
  cancel();
  console.log('Cancelled after', count, 'ticks');
}, 5500);

// With arguments
const cancelGreet = customSetInterval(
  (name, emoji) => console.log(\`Hello \${name} \${emoji}\`),
  2000,
  'World',
  '👋'
);

setTimeout(() => cancelGreet(), 7000);`,

  implementationTS: `function customSetInterval(
  callback: (...args: unknown[]) => void,
  delay: number,
  ...args: unknown[]
): () => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let cancelled = false;

  function tick(): void {
    timerId = setTimeout(() => {
      if (cancelled) return;
      callback(...args);
      tick();
    }, delay);
  }

  tick();

  return function cancel(): void {
    cancelled = true;
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };
}`,



  theoryAndConcepts: "WHAT IS setInterval?\n--------------------\nsetInterval() repeatedly executes a function at specified intervals.\nIt returns an interval ID used to cancel it with clearInterval().\n\nTHE PROBLEM:\n------------\nNative setInterval requires:\n1. Storing the interval ID manually\n2. Calling clearInterval(id) to stop\n3. Managing IDs can be messy in complex code\n\nTHE SOLUTION:\n-------------\nCreate a wrapper that returns a cancel function directly,\nencapsulating the ID management.\n\nRELATED CONCEPTS:\n-----------------\n1. setTimeout vs setInterval\n2. Closure (holding interval ID)\n3. Memory leaks (forgetting to clear)\n4. Browser throttling in background tabs\n\n\n\nsetInterval vs setTimeout:\n--------------------------\nsetInterval: Repeats forever until cancelled\nsetTimeout: Runs once after delay\n\nRecursive setTimeout: More precise timing (waits for completion)\nsetInterval: Can have drift if callback takes too long",
  beginnerApproach: "Beginner: Simple wrapper returning cancel function",
  beginnerImplementation: "function setIntervalBeginner(callback, delay) {\n  // Start the interval\n  const intervalId = setInterval(callback, delay);\n  \n  // Return cancel function\n  return function cancel() {\n    clearInterval(intervalId);\n  };\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nlet count = 0;\nconst cancel = setIntervalBeginner(() => {\n  count++;\n  console.log('Tick:', count);\n}, 500);\n\n// Cancel after 2 seconds\nsetTimeout(() => {\n  cancel();\n  console.log('Interval cancelled at count:', count);\n}, 2100);",
  intermediateApproach: "Intermediate: With immediate execution option and arguments",
  intermediateImplementation: "function setIntervalIntermediate(callback, delay, options = {}) {\n  const { \n    immediate = false,  // Execute immediately before first interval\n    args = []           // Arguments to pass to callback\n  } = options;\n  \n  let intervalId = null;\n  let isCancelled = false;\n  \n  // Execute immediately if requested\n  if (immediate && !isCancelled) {\n    callback(...args);\n  }\n  \n  // Start interval\n  intervalId = setInterval(() => {\n    callback(...args);\n  }, delay);\n  \n  // Return control object\n  return {\n    cancel() {\n      if (intervalId !== null) {\n        clearInterval(intervalId);\n        intervalId = null;\n        isCancelled = true;\n      }\n    },\n    isCancelled() {\n      return isCancelled;\n    },\n    isRunning() {\n      return intervalId !== null && !isCancelled;\n    }\n  };\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst interval = setIntervalIntermediate(\n  (msg) => console.log(msg, new Date().toISOString()),\n  1000,\n  { immediate: true, args: ['Tick at:'] }\n);\n\nconsole.log('Is running:', interval.isRunning());\n\nsetTimeout(() => {\n  interval.cancel();\n  console.log('Cancelled:', interval.isCancelled());\n  console.log('Is running:', interval.isRunning());\n}, 3500);",
  expertApproach: "Expert: Full-featured interval with:\n- Pause/Resume\n- Reset\n- Tick count\n- Remaining time tracking\n- Dynamic delay change\n- Max iterations",
  expertImplementation: "function createInterval(callback, delay, options = {}) {\n  const {\n    immediate = false,\n    maxIterations = Infinity,\n    context = null,\n    args = [],\n    onStart = null,\n    onStop = null,\n    onTick = null\n  } = options;\n  \n  let intervalId = null;\n  let timeoutId = null;\n  let tickCount = 0;\n  let startTime = null;\n  let remaining = delay;\n  let isPaused = false;\n  let isStarted = false;\n  let currentDelay = delay;\n  \n  function tick() {\n    tickCount++;\n    startTime = Date.now();\n    remaining = currentDelay;\n    \n    onTick?.(tickCount);\n    callback.apply(context, args);\n    \n    // Check max iterations\n    if (tickCount >= maxIterations) {\n      stop();\n    }\n  }\n  \n  function start() {\n    if (isStarted && !isPaused) return api;\n    \n    isStarted = true;\n    isPaused = false;\n    startTime = Date.now();\n    \n    onStart?.();\n    \n    // Immediate execution\n    if (immediate && tickCount === 0) {\n      tick();\n      if (tickCount >= maxIterations) return api;\n    }\n    \n    intervalId = setInterval(tick, currentDelay);\n    \n    return api;\n  }\n  \n  function stop() {\n    if (intervalId !== null) {\n      clearInterval(intervalId);\n      intervalId = null;\n    }\n    if (timeoutId !== null) {\n      clearTimeout(timeoutId);\n      timeoutId = null;\n    }\n    \n    isStarted = false;\n    isPaused = false;\n    tickCount = 0;\n    remaining = currentDelay;\n    \n    onStop?.();\n    \n    return api;\n  }\n  \n  function pause() {\n    if (!isStarted || isPaused) return api;\n    \n    // Calculate remaining time in current interval\n    remaining = currentDelay - (Date.now() - startTime);\n    if (remaining < 0) remaining = 0;\n    \n    clearInterval(intervalId);\n    clearTimeout(timeoutId);\n    intervalId = null;\n    timeoutId = null;\n    isPaused = true;\n    \n    return api;\n  }\n  \n  function resume() {\n    if (!isPaused) return api;\n    \n    isPaused = false;\n    startTime = Date.now();\n    \n    // Use timeout for remaining time, then switch to interval\n    timeoutId = setTimeout(() => {\n      tick();\n      if (tickCount < maxIterations) {\n        intervalId = setInterval(tick, currentDelay);\n      }\n    }, remaining);\n    \n    return api;\n  }\n  \n  function reset() {\n    stop();\n    return start();\n  }\n  \n  function setDelay(newDelay) {\n    currentDelay = newDelay;\n    \n    if (isStarted && !isPaused) {\n      // Restart with new delay\n      clearInterval(intervalId);\n      intervalId = setInterval(tick, currentDelay);\n    }\n    \n    return api;\n  }\n  \n  const api = {\n    start,\n    stop,\n    pause,\n    resume,\n    reset,\n    setDelay,\n    \n    // Getters\n    isRunning: () => isStarted && !isPaused,\n    isPaused: () => isPaused,\n    isStopped: () => !isStarted,\n    getTickCount: () => tickCount,\n    getDelay: () => currentDelay,\n    getRemaining: () => {\n      if (isPaused) return remaining;\n      if (!isStarted) return currentDelay;\n      return Math.max(0, currentDelay - (Date.now() - startTime));\n    }\n  };\n  \n  return api;\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\nconst timer = createInterval(\n  () => console.log('Expert tick at:', new Date().toISOString()),\n  1000,\n  {\n    immediate: true,\n    maxIterations: 10,\n    onStart: () => console.log('Timer started!'),\n    onStop: () => console.log('Timer stopped!'),\n    onTick: (count) => console.log(`Tick #${count}`)\n  }\n);\n\n// Start the timer\ntimer.start();\n\n// Pause after 2.5 seconds\nsetTimeout(() => {\n  timer.pause();\n  console.log('Paused! Remaining:', timer.getRemaining(), 'ms');\n  console.log('Is paused:', timer.isPaused());\n}, 2500);\n\n// Resume after 4 seconds\nsetTimeout(() => {\n  console.log('Resuming...');\n  timer.resume();\n}, 4000);\n\n// Stop after 7 seconds\nsetTimeout(() => {\n  timer.stop();\n  console.log('Final tick count:', timer.getTickCount());\n}, 7000);",
  interviewTraps: [
      "console.log('\\n=== EDGE CASES ===');",
      "EDGE CASE 1: Zero delay",
      "Browser enforces minimum of 4ms",
      "console.log('Zero delay becomes ~4ms minimum');",
      "EDGE CASE 2: Negative delay",
      "Treated as 0",
      "EDGE CASE 3: Very long delay",
      "JavaScript uses 32-bit integer for delay"
  ],
  stepByStep: [
    'Declare state variables in a closure: timerId to track the current timeout, and a cancelled flag.',
    'Define a tick() function that schedules a setTimeout with the given delay.',
    'Inside the timeout callback, first check if cancelled is true — if so, return immediately.',
    'If not cancelled, invoke the original callback with any extra arguments.',
    'Call tick() again to schedule the next repetition (recursive chaining).',
    'Call tick() once immediately to start the first timer.',
    'Return a cancel function that sets cancelled = true and clears the pending timeout.',
  ],

  timeComplexity: 'O(1) per tick — each setTimeout callback does constant work beyond the user callback.',
  spaceComplexity: 'O(1) — only a timer ID and boolean flag are stored in the closure.',

  commonMistakes: [
    'Not clearing the pending timeout in the cancel function, causing one more callback to fire',
    'Using setInterval internally instead of implementing with setTimeout from scratch',
    'Not checking the cancelled flag inside the timeout callback, causing race conditions',
    'Scheduling the next tick before the callback runs (use after to avoid overlap)',
  ],

  followUps: [
    'How would you implement a version that adjusts timing to stay on schedule (drift correction)?',
    'What is the difference between chained setTimeout and setInterval in terms of timing?',
    'How would you implement setInterval that pauses when the browser tab is inactive?',
  ],
};
