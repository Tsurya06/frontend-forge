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
