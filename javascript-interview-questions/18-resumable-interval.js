/**
 * ============================================
 * RESUMABLE INTERVAL - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function that creates a resumable interval object
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS A RESUMABLE INTERVAL?
 * -----------------------------
 * Unlike basic setInterval which only supports start/stop,
 * a resumable interval can be PAUSED and RESUMED, continuing
 * from where it left off.
 * 
 * KEY CHALLENGE:
 * --------------
 * When pausing, we need to track how much time has elapsed
 * in the current interval, so we can resume with the
 * remaining time.
 * 
 * Example:
 * - Interval: 5000ms
 * - Pause after: 3000ms
 * - Remaining: 2000ms
 * - On resume: Wait 2000ms, then continue with 5000ms intervals
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple pause/resume (restarts interval)
 * Note: This doesn't track remaining time
 */
function createIntervalBeginner(callback, delay) {
  let intervalId = null;
  let isPaused = false;
  
  return {
    start() {
      if (intervalId === null) {
        intervalId = setInterval(callback, delay);
        isPaused = false;
      }
    },
    
    pause() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        isPaused = true;
      }
    },
    
    resume() {
      if (isPaused) {
        this.start();
      }
    },
    
    stop() {
      clearInterval(intervalId);
      intervalId = null;
      isPaused = false;
    },
    
    isRunning() {
      return intervalId !== null;
    },
    
    isPaused() {
      return isPaused;
    }
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');
console.log('Basic interval with pause/resume (but loses remaining time on pause)');


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: True resumable interval with remaining time tracking
 */
function createResumableInterval(callback, delay) {
  let intervalId = null;
  let timeoutId = null;
  let startTime = null;
  let remaining = delay;
  let isPaused = false;
  let isRunning = false;
  let tickCount = 0;
  
  function tick() {
    tickCount++;
    startTime = Date.now();
    remaining = delay;
    callback(tickCount);
  }
  
  const api = {
    start() {
      if (isRunning) return api;
      
      isRunning = true;
      isPaused = false;
      startTime = Date.now();
      remaining = delay;
      
      intervalId = setInterval(tick, delay);
      
      return api;
    },
    
    pause() {
      if (!isRunning || isPaused) return api;
      
      // Calculate remaining time
      const elapsed = Date.now() - startTime;
      remaining = delay - (elapsed % delay);
      if (remaining <= 0) remaining = delay;
      
      // Clear timers
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      intervalId = null;
      timeoutId = null;
      
      isPaused = true;
      
      return api;
    },
    
    resume() {
      if (!isPaused) return api;
      
      isPaused = false;
      startTime = Date.now();
      
      // Use timeout for remaining time, then switch to interval
      timeoutId = setTimeout(() => {
        tick();
        intervalId = setInterval(tick, delay);
        timeoutId = null;
      }, remaining);
      
      return api;
    },
    
    stop() {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      intervalId = null;
      timeoutId = null;
      isRunning = false;
      isPaused = false;
      remaining = delay;
      tickCount = 0;
      
      return api;
    },
    
    reset() {
      api.stop();
      return api.start();
    },
    
    // Getters
    isRunning() {
      return isRunning && !isPaused;
    },
    
    isPaused() {
      return isPaused;
    },
    
    isStopped() {
      return !isRunning;
    },
    
    getRemaining() {
      if (isPaused) return remaining;
      if (!isRunning) return delay;
      
      const elapsed = Date.now() - startTime;
      return Math.max(0, delay - (elapsed % delay));
    },
    
    getTickCount() {
      return tickCount;
    },
    
    getDelay() {
      return delay;
    }
  };
  
  return api;
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const timer = createResumableInterval(() => {
  console.log('Tick at:', new Date().toISOString());
}, 2000);

console.log('Starting timer...');
timer.start();

setTimeout(() => {
  console.log('Pausing... Remaining:', timer.getRemaining(), 'ms');
  timer.pause();
}, 3500); // Pause 1.5s into 2nd interval

setTimeout(() => {
  console.log('Resuming...');
  timer.resume();
}, 5000);

setTimeout(() => {
  console.log('Stopping. Total ticks:', timer.getTickCount());
  timer.stop();
}, 9000);


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured resumable interval
 */
class ResumableInterval {
  constructor(callback, delay, options = {}) {
    this.callback = callback;
    this.delay = delay;
    this.options = {
      immediate: false,       // Execute immediately on start
      maxTicks: Infinity,     // Max number of ticks
      onStart: null,
      onPause: null,
      onResume: null,
      onStop: null,
      onTick: null,
      ...options
    };
    
    this.intervalId = null;
    this.timeoutId = null;
    this.startTime = null;
    this.pauseTime = null;
    this.remaining = delay;
    this.state = 'stopped'; // 'stopped' | 'running' | 'paused'
    this.tickCount = 0;
    this.totalRunTime = 0;
  }
  
  _tick() {
    this.tickCount++;
    this.startTime = Date.now();
    this.remaining = this.delay;
    
    this.options.onTick?.(this.tickCount, this);
    this.callback(this.tickCount, this);
    
    // Check max ticks
    if (this.tickCount >= this.options.maxTicks) {
      this.stop();
    }
  }
  
  start() {
    if (this.state === 'running') return this;
    
    this.state = 'running';
    this.startTime = Date.now();
    this.remaining = this.delay;
    
    this.options.onStart?.(this);
    
    // Immediate execution
    if (this.options.immediate && this.tickCount === 0) {
      this._tick();
      if (this.state !== 'running') return this; // Might have stopped in tick
    }
    
    this.intervalId = setInterval(() => this._tick(), this.delay);
    
    return this;
  }
  
  pause() {
    if (this.state !== 'running') return this;
    
    // Calculate remaining time
    const elapsed = Date.now() - this.startTime;
    this.remaining = this.delay - (elapsed % this.delay);
    if (this.remaining <= 0) this.remaining = this.delay;
    
    this.totalRunTime += elapsed;
    this.pauseTime = Date.now();
    
    // Clear timers
    clearInterval(this.intervalId);
    clearTimeout(this.timeoutId);
    this.intervalId = null;
    this.timeoutId = null;
    
    this.state = 'paused';
    this.options.onPause?.(this.remaining, this);
    
    return this;
  }
  
  resume() {
    if (this.state !== 'paused') return this;
    
    this.state = 'running';
    this.startTime = Date.now();
    
    this.options.onResume?.(this.remaining, this);
    
    // Resume with remaining time
    this.timeoutId = setTimeout(() => {
      this._tick();
      if (this.state === 'running') {
        this.intervalId = setInterval(() => this._tick(), this.delay);
      }
      this.timeoutId = null;
    }, this.remaining);
    
    return this;
  }
  
  stop() {
    if (this.state === 'stopped') return this;
    
    // Calculate final run time
    if (this.state === 'running') {
      this.totalRunTime += Date.now() - this.startTime;
    }
    
    clearInterval(this.intervalId);
    clearTimeout(this.timeoutId);
    this.intervalId = null;
    this.timeoutId = null;
    
    const previousState = this.state;
    this.state = 'stopped';
    this.remaining = this.delay;
    
    this.options.onStop?.(this.tickCount, this.totalRunTime, this);
    
    return this;
  }
  
  reset() {
    this.stop();
    this.tickCount = 0;
    this.totalRunTime = 0;
    return this;
  }
  
  restart() {
    return this.reset().start();
  }
  
  // Change delay (takes effect on next tick)
  setDelay(newDelay) {
    this.delay = newDelay;
    
    if (this.state === 'running') {
      // Restart with new delay
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => this._tick(), this.delay);
    }
    
    return this;
  }
  
  // Getters
  getState() { return this.state; }
  isRunning() { return this.state === 'running'; }
  isPaused() { return this.state === 'paused'; }
  isStopped() { return this.state === 'stopped'; }
  getTickCount() { return this.tickCount; }
  getDelay() { return this.delay; }
  getTotalRunTime() { return this.totalRunTime; }
  
  getRemaining() {
    if (this.state === 'paused') return this.remaining;
    if (this.state === 'stopped') return this.delay;
    
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.delay - (elapsed % this.delay));
  }
  
  getProgress() {
    const remaining = this.getRemaining();
    return 1 - (remaining / this.delay);
  }
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

const expertTimer = new ResumableInterval(
  (tick) => console.log(`Expert tick #${tick}`),
  2000,
  {
    immediate: true,
    maxTicks: 5,
    onStart: () => console.log('Timer started'),
    onPause: (remaining) => console.log(`Paused with ${remaining}ms remaining`),
    onResume: (remaining) => console.log(`Resuming, ${remaining}ms to next tick`),
    onStop: (ticks, totalTime) => console.log(`Stopped after ${ticks} ticks, ${totalTime}ms total`)
  }
);

// Demonstrate usage
expertTimer.start();

setTimeout(() => {
  expertTimer.pause();
  console.log('Progress:', (expertTimer.getProgress() * 100).toFixed(1) + '%');
}, 1500);

setTimeout(() => {
  expertTimer.resume();
}, 3000);

setTimeout(() => {
  expertTimer.stop();
}, 8000);


// ============================================
// PRACTICAL EXAMPLES
// ============================================

console.log('\n=== PRACTICAL EXAMPLES ===');

// 1. Countdown Timer
function createCountdown(seconds, onTick, onComplete) {
  let remaining = seconds;
  
  const interval = createResumableInterval(() => {
    remaining--;
    onTick(remaining);
    
    if (remaining <= 0) {
      interval.stop();
      onComplete?.();
    }
  }, 1000);
  
  // Initial tick
  onTick(remaining);
  
  return {
    ...interval,
    getSecondsRemaining: () => remaining
  };
}

// 2. Auto-save with activity detection
function createAutoSave(saveFn, delay = 30000) {
  const interval = new ResumableInterval(saveFn, delay);
  
  // Pause when tab is hidden
  document.addEventListener?.('visibilitychange', () => {
    if (document.hidden) {
      interval.pause();
    } else {
      interval.resume();
    }
  });
  
  return interval;
}

// 3. Progress tracker
function createProgressInterval(callback, delay, steps) {
  let currentStep = 0;
  
  const interval = new ResumableInterval(
    () => {
      currentStep++;
      callback(currentStep, steps, currentStep / steps);
      
      if (currentStep >= steps) {
        interval.stop();
      }
    },
    delay,
    { maxTicks: steps }
  );
  
  return {
    ...interval,
    getCurrentStep: () => currentStep,
    getTotalSteps: () => steps,
    getPercentage: () => (currentStep / steps) * 100
  };
}


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Track startTime to calculate remaining
 * 2. Use setTimeout for remaining, then setInterval
 * 3. Clear both timeout AND interval on pause/stop
 * 4. Return `this` for method chaining
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Explain the remaining time calculation
 * 2. Show understanding of setTimeout vs setInterval
 * 3. Mention cleanup importance
 * 4. Discuss state management
 * 
 * KEY FORMULA:
 * remaining = delay - (Date.now() - startTime) % delay
 */


module.exports = {
  createIntervalBeginner,
  createResumableInterval,
  ResumableInterval,
  createCountdown,
  createProgressInterval
};
