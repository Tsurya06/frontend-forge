import type { CodingProblem } from "../../types";

export const resumableIntervalProblem: CodingProblem = {
  id: "coding-resumable-interval",
  title: "Resumable Interval with Start/Stop/Resume/Reset",
  difficulty: "Intermediate",
  category: "Coding",
  tags: ["timers", "state-machine", "closures", "OOP", "browser-api"],

  problem: `Create an interval utility object that provides fine-grained control over periodic execution. Unlike a simple setInterval, this utility should support four operations: start (begin the interval), stop (pause without losing state), resume (continue from where it stopped), and reset (restart the interval and optionally change the callback or delay).

This pattern is essential for building countdown timers, polling mechanisms, animation loops, and auto-save features. The key challenge is managing the internal state correctly: tracking whether the interval is running, paused, or stopped, handling the remaining time when paused mid-interval, and ensuring that resume picks up at the right point.

Your implementation should be robust against edge cases like calling start when already running, calling resume when not paused, or calling stop multiple times. Each method should be idempotent and safe to call in any state.`,

  requirements: [
    "start(): Begin executing the callback at the specified interval",
    "stop(): Pause execution, remembering elapsed time in the current interval",
    "resume(): Continue from where stop() paused (accounting for elapsed time)",
    "reset(): Clear all state and optionally restart with new parameters",
    "Prevent duplicate starts (calling start while already running should be a no-op)",
    "Track running state so consumers can check if the interval is active",
    "Return the interval object for method chaining",
  ],

  examples: [
    {
      input: `const timer = createResumableInterval(() => console.log("tick"), 1000);\ntimer.start(); // starts ticking every 1s`,
      output: 'Logs "tick" every second',
      explanation: "start() initiates the repeating interval.",
    },
    {
      input: `timer.stop(); // pauses at 600ms into current interval\ntimer.resume(); // next tick fires in ~400ms`,
      output: "Resumes with only the remaining time for the current interval",
      explanation:
        "stop() saves the elapsed portion; resume() only waits for the remainder before the next full interval cycle.",
    },
    {
      input: `timer.reset();\ntimer.start();`,
      output: "Restarts from scratch as if newly created",
      explanation:
        "reset() clears all internal state so start() begins a fresh interval.",
    },
  ],

  edgeCases: [
    "Calling start() when already running (should be no-op)",
    "Calling resume() when not paused (should be no-op)",
    "Calling stop() when already stopped (should be no-op)",
    "Calling reset() while running (should stop and clear)",
    "Very short intervals (0-10ms)",
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

  theoryAndConcepts:
    "WHAT IS A RESUMABLE INTERVAL?\n-----------------------------\nUnlike basic setInterval which only supports start/stop,\na resumable interval can be PAUSED and RESUMED, continuing\nfrom where it left off.\n\nKEY CHALLENGE:\n--------------\nWhen pausing, we need to track how much time has elapsed\nin the current interval, so we can resume with the\nremaining time.\n\nExample:\n- Interval: 5000ms\n- Pause after: 3000ms\n- Remaining: 2000ms\n- On resume: Wait 2000ms, then continue with 5000ms intervals",
  beginnerApproach:
    "Beginner: Simple pause/resume (restarts interval)\nNote: This doesn't track remaining time",
  beginnerImplementation:
    "function createIntervalBeginner(callback, delay) {\n  let intervalId = null;\n  let isPaused = false;\n  \n  return {\n    start() {\n      if (intervalId === null) {\n        intervalId = setInterval(callback, delay);\n        isPaused = false;\n      }\n    },\n    \n    pause() {\n      if (intervalId !== null) {\n        clearInterval(intervalId);\n        intervalId = null;\n        isPaused = true;\n      }\n    },\n    \n    resume() {\n      if (isPaused) {\n        this.start();\n      }\n    },\n    \n    stop() {\n      clearInterval(intervalId);\n      intervalId = null;\n      isPaused = false;\n    },\n    \n    isRunning() {\n      return intervalId !== null;\n    },\n    \n    isPaused() {\n      return isPaused;\n    }\n  };\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\nconsole.log('Basic interval with pause/resume (but loses remaining time on pause)');",
  intermediateApproach:
    "Intermediate: True resumable interval with remaining time tracking",
  intermediateImplementation:
    "function createResumableInterval(callback, delay) {\n  let intervalId = null;\n  let timeoutId = null;\n  let startTime = null;\n  let remaining = delay;\n  let isPaused = false;\n  let isRunning = false;\n  let tickCount = 0;\n  \n  function tick() {\n    tickCount++;\n    startTime = Date.now();\n    remaining = delay;\n    callback(tickCount);\n  }\n  \n  const api = {\n    start() {\n      if (isRunning) return api;\n      \n      isRunning = true;\n      isPaused = false;\n      startTime = Date.now();\n      remaining = delay;\n      \n      intervalId = setInterval(tick, delay);\n      \n      return api;\n    },\n    \n    pause() {\n      if (!isRunning || isPaused) return api;\n      \n      // Calculate remaining time\n      const elapsed = Date.now() - startTime;\n      remaining = delay - (elapsed % delay);\n      if (remaining <= 0) remaining = delay;\n      \n      // Clear timers\n      clearInterval(intervalId);\n      clearTimeout(timeoutId);\n      intervalId = null;\n      timeoutId = null;\n      \n      isPaused = true;\n      \n      return api;\n    },\n    \n    resume() {\n      if (!isPaused) return api;\n      \n      isPaused = false;\n      startTime = Date.now();\n      \n      // Use timeout for remaining time, then switch to interval\n      timeoutId = setTimeout(() => {\n        tick();\n        intervalId = setInterval(tick, delay);\n        timeoutId = null;\n      }, remaining);\n      \n      return api;\n    },\n    \n    stop() {\n      clearInterval(intervalId);\n      clearTimeout(timeoutId);\n      intervalId = null;\n      timeoutId = null;\n      isRunning = false;\n      isPaused = false;\n      remaining = delay;\n      tickCount = 0;\n      \n      return api;\n    },\n    \n    reset() {\n      api.stop();\n      return api.start();\n    },\n    \n    // Getters\n    isRunning() {\n      return isRunning && !isPaused;\n    },\n    \n    isPaused() {\n      return isPaused;\n    },\n    \n    isStopped() {\n      return !isRunning;\n    },\n    \n    getRemaining() {\n      if (isPaused) return remaining;\n      if (!isRunning) return delay;\n      \n      const elapsed = Date.now() - startTime;\n      return Math.max(0, delay - (elapsed % delay));\n    },\n    \n    getTickCount() {\n      return tickCount;\n    },\n    \n    getDelay() {\n      return delay;\n    }\n  };\n  \n  return api;\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst timer = createResumableInterval(() => {\n  console.log('Tick at:', new Date().toISOString());\n}, 2000);\n\nconsole.log('Starting timer...');\ntimer.start();\n\nsetTimeout(() => {\n  console.log('Pausing... Remaining:', timer.getRemaining(), 'ms');\n  timer.pause();\n}, 3500); // Pause 1.5s into 2nd interval\n\nsetTimeout(() => {\n  console.log('Resuming...');\n  timer.resume();\n}, 5000);\n\nsetTimeout(() => {\n  console.log('Stopping. Total ticks:', timer.getTickCount());\n  timer.stop();\n}, 9000);",
  expertApproach: "Expert: Full-featured resumable interval",
  expertImplementation:
    "class ResumableInterval {\n  constructor(callback, delay, options = {}) {\n    this.callback = callback;\n    this.delay = delay;\n    this.options = {\n      immediate: false,       // Execute immediately on start\n      maxTicks: Infinity,     // Max number of ticks\n      onStart: null,\n      onPause: null,\n      onResume: null,\n      onStop: null,\n      onTick: null,\n      ...options\n    };\n    \n    this.intervalId = null;\n    this.timeoutId = null;\n    this.startTime = null;\n    this.pauseTime = null;\n    this.remaining = delay;\n    this.state = 'stopped'; // 'stopped' | 'running' | 'paused'\n    this.tickCount = 0;\n    this.totalRunTime = 0;\n  }\n  \n  _tick() {\n    this.tickCount++;\n    this.startTime = Date.now();\n    this.remaining = this.delay;\n    \n    this.options.onTick?.(this.tickCount, this);\n    this.callback(this.tickCount, this);\n    \n    // Check max ticks\n    if (this.tickCount >= this.options.maxTicks) {\n      this.stop();\n    }\n  }\n  \n  start() {\n    if (this.state === 'running') return this;\n    \n    this.state = 'running';\n    this.startTime = Date.now();\n    this.remaining = this.delay;\n    \n    this.options.onStart?.(this);\n    \n    // Immediate execution\n    if (this.options.immediate && this.tickCount === 0) {\n      this._tick();\n      if (this.state !== 'running') return this; // Might have stopped in tick\n    }\n    \n    this.intervalId = setInterval(() => this._tick(), this.delay);\n    \n    return this;\n  }\n  \n  pause() {\n    if (this.state !== 'running') return this;\n    \n    // Calculate remaining time\n    const elapsed = Date.now() - this.startTime;\n    this.remaining = this.delay - (elapsed % this.delay);\n    if (this.remaining <= 0) this.remaining = this.delay;\n    \n    this.totalRunTime += elapsed;\n    this.pauseTime = Date.now();\n    \n    // Clear timers\n    clearInterval(this.intervalId);\n    clearTimeout(this.timeoutId);\n    this.intervalId = null;\n    this.timeoutId = null;\n    \n    this.state = 'paused';\n    this.options.onPause?.(this.remaining, this);\n    \n    return this;\n  }\n  \n  resume() {\n    if (this.state !== 'paused') return this;\n    \n    this.state = 'running';\n    this.startTime = Date.now();\n    \n    this.options.onResume?.(this.remaining, this);\n    \n    // Resume with remaining time\n    this.timeoutId = setTimeout(() => {\n      this._tick();\n      if (this.state === 'running') {\n        this.intervalId = setInterval(() => this._tick(), this.delay);\n      }\n      this.timeoutId = null;\n    }, this.remaining);\n    \n    return this;\n  }\n  \n  stop() {\n    if (this.state === 'stopped') return this;\n    \n    // Calculate final run time\n    if (this.state === 'running') {\n      this.totalRunTime += Date.now() - this.startTime;\n    }\n    \n    clearInterval(this.intervalId);\n    clearTimeout(this.timeoutId);\n    this.intervalId = null;\n    this.timeoutId = null;\n    \n    const previousState = this.state;\n    this.state = 'stopped';\n    this.remaining = this.delay;\n    \n    this.options.onStop?.(this.tickCount, this.totalRunTime, this);\n    \n    return this;\n  }\n  \n  reset() {\n    this.stop();\n    this.tickCount = 0;\n    this.totalRunTime = 0;\n    return this;\n  }\n  \n  restart() {\n    return this.reset().start();\n  }\n  \n  // Change delay (takes effect on next tick)\n  setDelay(newDelay) {\n    this.delay = newDelay;\n    \n    if (this.state === 'running') {\n      // Restart with new delay\n      clearInterval(this.intervalId);\n      this.intervalId = setInterval(() => this._tick(), this.delay);\n    }\n    \n    return this;\n  }\n  \n  // Getters\n  getState() { return this.state; }\n  isRunning() { return this.state === 'running'; }\n  isPaused() { return this.state === 'paused'; }\n  isStopped() { return this.state === 'stopped'; }\n  getTickCount() { return this.tickCount; }\n  getDelay() { return this.delay; }\n  getTotalRunTime() { return this.totalRunTime; }\n  \n  getRemaining() {\n    if (this.state === 'paused') return this.remaining;\n    if (this.state === 'stopped') return this.delay;\n    \n    const elapsed = Date.now() - this.startTime;\n    return Math.max(0, this.delay - (elapsed % this.delay));\n  }\n  \n  getProgress() {\n    const remaining = this.getRemaining();\n    return 1 - (remaining / this.delay);\n  }\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\nconst expertTimer = new ResumableInterval(\n  (tick) => console.log(`Expert tick #${tick}`),\n  2000,\n  {\n    immediate: true,\n    maxTicks: 5,\n    onStart: () => console.log('Timer started'),\n    onPause: (remaining) => console.log(`Paused with ${remaining}ms remaining`),\n    onResume: (remaining) => console.log(`Resuming, ${remaining}ms to next tick`),\n    onStop: (ticks, totalTime) => console.log(`Stopped after ${ticks} ticks, ${totalTime}ms total`)\n  }\n);\n\n// Demonstrate usage\nexpertTimer.start();\n\nsetTimeout(() => {\n  expertTimer.pause();\n  console.log('Progress:', (expertTimer.getProgress() * 100).toFixed(1) + '%');\n}, 1500);\n\nsetTimeout(() => {\n  expertTimer.resume();\n}, 3000);\n\nsetTimeout(() => {\n  expertTimer.stop();\n}, 8000);",
  interviewTraps: [
    "QUICK REFERENCE:",
    "1. Track startTime to calculate remaining",
    "2. Use setTimeout for remaining, then setInterval",
    "3. Clear both timeout AND interval on pause/stop",
    "4. Return `this` for method chaining",
    "INTERVIEW TIPS:",
    "1. Explain the remaining time calculation",
    "2. Show understanding of setTimeout vs setInterval",
  ],
  stepByStep: [
    "Initialize closure state: timerId, startTime, remaining (set to full delay), and isRunning flag.",
    "start(): If already running, return early. Set isRunning, record startTime, schedule first setTimeout.",
    "tick(): Record startTime, call the callback, schedule the next setTimeout with full delay.",
    "stop(): Clear the timeout, calculate elapsed time, store remaining = delay - elapsed.",
    "resume(): Schedule a one-shot setTimeout for the remaining time. On fire, call callback, then switch to regular tick() cycle.",
    "reset(): Clear any active timeout, reset all state to initial values, optionally accept new callback/delay.",
    "Return an API object with all methods and an isRunning getter.",
  ],

  timeComplexity:
    "O(1) for each method call. The callback execution time depends on the user's function.",
  spaceComplexity:
    "O(1) — only a fixed number of state variables in the closure.",

  commonMistakes: [
    "Not tracking remaining time when stopping, causing resume to wait a full interval instead of the remainder",
    "Forgetting to update startTime when resuming, leading to incorrect remaining time on the next stop",
    "Not guarding against duplicate start/resume calls, causing multiple concurrent timers",
    "Using setInterval internally, which makes mid-interval resume impossible",
  ],

  followUps: [
    "How would you add an onTick event that reports the elapsed time since start?",
    "How would you implement drift correction for more accurate long-running intervals?",
    "How would you adapt this for a React hook (useResumableInterval)?",
  ],
};
