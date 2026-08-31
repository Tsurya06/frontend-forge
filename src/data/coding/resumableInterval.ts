import type { CodingProblem } from '../../types';

export const resumableIntervalProblem: CodingProblem = {
  id: 'coding-resumable-interval',
  title: 'Resumable Interval with Start/Stop/Resume/Reset',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['timers', 'state-machine', 'closures', 'OOP', 'browser-api'],

  problem: `Create an interval utility object that provides fine-grained control over periodic execution. Unlike a simple setInterval, this utility should support four operations: start (begin the interval), stop (pause without losing state), resume (continue from where it stopped), and reset (restart the interval and optionally change the callback or delay).

This pattern is essential for building countdown timers, polling mechanisms, animation loops, and auto-save features. The key challenge is managing the internal state correctly: tracking whether the interval is running, paused, or stopped, handling the remaining time when paused mid-interval, and ensuring that resume picks up at the right point.

Your implementation should be robust against edge cases like calling start when already running, calling resume when not paused, or calling stop multiple times. Each method should be idempotent and safe to call in any state.`,

  requirements: [
    'start(): Begin executing the callback at the specified interval',
    'stop(): Pause execution, remembering elapsed time in the current interval',
    'resume(): Continue from where stop() paused (accounting for elapsed time)',
    'reset(): Clear all state and optionally restart with new parameters',
    'Prevent duplicate starts (calling start while already running should be a no-op)',
    'Track running state so consumers can check if the interval is active',
    'Return the interval object for method chaining',
  ],

  examples: [
    {
      input: `const timer = createResumableInterval(() => console.log("tick"), 1000);\ntimer.start(); // starts ticking every 1s`,
      output: 'Logs "tick" every second',
      explanation: 'start() initiates the repeating interval.',
    },
    {
      input: `timer.stop(); // pauses at 600ms into current interval\ntimer.resume(); // next tick fires in ~400ms`,
      output: 'Resumes with only the remaining time for the current interval',
      explanation: 'stop() saves the elapsed portion; resume() only waits for the remainder before the next full interval cycle.',
    },
    {
      input: `timer.reset();\ntimer.start();`,
      output: 'Restarts from scratch as if newly created',
      explanation: 'reset() clears all internal state so start() begins a fresh interval.',
    },
  ],

  edgeCases: [
    'Calling start() when already running (should be no-op)',
    'Calling resume() when not paused (should be no-op)',
    'Calling stop() when already stopped (should be no-op)',
    'Calling reset() while running (should stop and clear)',
    'Very short intervals (0-10ms)',
  ],

  naiveApproach: `A naive approach directly uses setInterval and clearInterval for start/stop. The problem is that clearInterval cancels the entire interval — when you restart it, you lose the elapsed time within the current tick. If the interval is 1000ms and you stop at 600ms in, restarting with setInterval waits a full 1000ms instead of the remaining 400ms. There's no way to resume mid-interval with native setInterval alone.`,

  optimalApproach: `The optimal approach uses setTimeout internally and tracks timing state. When the interval starts, record the timestamp (Date.now()). Use setTimeout for each tick. When stop() is called, calculate how much time has elapsed since the last tick started and store the remaining time (delay - elapsed).

When resume() is called, use a one-time setTimeout with the remaining time. Once that fires, switch back to the regular interval cycle. This gives the user a seamless resume experience. The state machine has three states: idle, running, paused. Each method checks the current state and only acts if the transition is valid.

The reset() method clears all timers and resets internal state (remaining time, start time) to initial values. The implementation uses closure-based private state to encapsulate the timer IDs and timing variables.`,

  implementation: `function createResumableInterval(callback, delay) {
  let timerId = null;
  let startTime = null;
  let remaining = delay;
  let isRunning = false;

  function tick() {
    startTime = Date.now();
    callback();
    timerId = setTimeout(tick, delay);
  }

  function start() {
    if (isRunning) return api;
    isRunning = true;
    remaining = delay;
    startTime = Date.now();
    timerId = setTimeout(tick, delay);
    return api;
  }

  function stop() {
    if (!isRunning) return api;
    isRunning = false;
    clearTimeout(timerId);
    timerId = null;
    const elapsed = Date.now() - startTime;
    remaining = Math.max(delay - elapsed, 0);
    return api;
  }

  function resume() {
    if (isRunning || remaining === delay) return api;
    isRunning = true;
    startTime = Date.now();

    timerId = setTimeout(() => {
      callback();
      remaining = delay;
      startTime = Date.now();
      timerId = setTimeout(tick, delay);
    }, remaining);

    return api;
  }

  function reset(newCallback, newDelay) {
    clearTimeout(timerId);
    timerId = null;
    isRunning = false;
    remaining = newDelay || delay;
    startTime = null;
    if (newCallback) callback = newCallback;
    if (newDelay) delay = newDelay;
    return api;
  }

  const api = {
    start,
    stop,
    resume,
    reset,
    get isRunning() { return isRunning; },
  };

  return api;
}

// Usage
const timer = createResumableInterval(() => {
  console.log('Tick at', new Date().toLocaleTimeString());
}, 1000);

timer.start();

// Stop after 2.5 seconds (mid-interval)
setTimeout(() => {
  timer.stop();
  console.log('Paused. Running:', timer.isRunning);
}, 2500);

// Resume after 3 more seconds
setTimeout(() => {
  timer.resume();
  console.log('Resumed. Running:', timer.isRunning);
}, 5500);

// Final stop
setTimeout(() => {
  timer.reset();
  console.log('Reset. Running:', timer.isRunning);
}, 8000);`,

  implementationTS: `interface ResumableInterval {
  start(): ResumableInterval;
  stop(): ResumableInterval;
  resume(): ResumableInterval;
  reset(newCallback?: () => void, newDelay?: number): ResumableInterval;
  readonly isRunning: boolean;
}

function createResumableInterval(
  callback: () => void,
  delay: number,
): ResumableInterval {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let startTime: number | null = null;
  let remaining: number = delay;
  let isRunning = false;
  let cb = callback;
  let interval = delay;

  function tick(): void {
    startTime = Date.now();
    cb();
    timerId = setTimeout(tick, interval);
  }

  const api: ResumableInterval = {
    start() {
      if (isRunning) return api;
      isRunning = true;
      remaining = interval;
      startTime = Date.now();
      timerId = setTimeout(tick, interval);
      return api;
    },
    stop() {
      if (!isRunning) return api;
      isRunning = false;
      clearTimeout(timerId!);
      timerId = null;
      const elapsed = Date.now() - (startTime ?? Date.now());
      remaining = Math.max(interval - elapsed, 0);
      return api;
    },
    resume() {
      if (isRunning || remaining === interval) return api;
      isRunning = true;
      startTime = Date.now();
      timerId = setTimeout(() => {
        cb();
        remaining = interval;
        startTime = Date.now();
        timerId = setTimeout(tick, interval);
      }, remaining);
      return api;
    },
    reset(newCallback?: () => void, newDelay?: number) {
      if (timerId !== null) clearTimeout(timerId);
      timerId = null;
      isRunning = false;
      if (newCallback) cb = newCallback;
      if (newDelay) interval = newDelay;
      remaining = interval;
      startTime = null;
      return api;
    },
    get isRunning() { return isRunning; },
  };

  return api;
}`,

  stepByStep: [
    'Initialize closure state: timerId, startTime, remaining (set to full delay), and isRunning flag.',
    'start(): If already running, return early. Set isRunning, record startTime, schedule first setTimeout.',
    'tick(): Record startTime, call the callback, schedule the next setTimeout with full delay.',
    'stop(): Clear the timeout, calculate elapsed time, store remaining = delay - elapsed.',
    'resume(): Schedule a one-shot setTimeout for the remaining time. On fire, call callback, then switch to regular tick() cycle.',
    'reset(): Clear any active timeout, reset all state to initial values, optionally accept new callback/delay.',
    'Return an API object with all methods and an isRunning getter.',
  ],

  timeComplexity: 'O(1) for each method call. The callback execution time depends on the user\'s function.',
  spaceComplexity: 'O(1) — only a fixed number of state variables in the closure.',

  commonMistakes: [
    'Not tracking remaining time when stopping, causing resume to wait a full interval instead of the remainder',
    'Forgetting to update startTime when resuming, leading to incorrect remaining time on the next stop',
    'Not guarding against duplicate start/resume calls, causing multiple concurrent timers',
    'Using setInterval internally, which makes mid-interval resume impossible',
  ],

  followUps: [
    'How would you add an onTick event that reports the elapsed time since start?',
    'How would you implement drift correction for more accurate long-running intervals?',
    'How would you adapt this for a React hook (useResumableInterval)?',
  ],
};
