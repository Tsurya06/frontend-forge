/**
 * ============================================
 * CANCELLABLE setInterval - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function that acts like setInterval but returns 
 * a function to cancel the Interval
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS setInterval?
 * --------------------
 * setInterval() repeatedly executes a function at specified intervals.
 * It returns an interval ID used to cancel it with clearInterval().
 * 
 * THE PROBLEM:
 * ------------
 * Native setInterval requires:
 * 1. Storing the interval ID manually
 * 2. Calling clearInterval(id) to stop
 * 3. Managing IDs can be messy in complex code
 * 
 * THE SOLUTION:
 * -------------
 * Create a wrapper that returns a cancel function directly,
 * encapsulating the ID management.
 * 
 * RELATED CONCEPTS:
 * -----------------
 * 1. setTimeout vs setInterval
 * 2. Closure (holding interval ID)
 * 3. Memory leaks (forgetting to clear)
 * 4. Browser throttling in background tabs
 */

/**
 * setInterval vs setTimeout:
 * --------------------------
 * setInterval: Repeats forever until cancelled
 * setTimeout: Runs once after delay
 * 
 * Recursive setTimeout: More precise timing (waits for completion)
 * setInterval: Can have drift if callback takes too long
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple wrapper returning cancel function
 */
function setIntervalBeginner(callback, delay) {
  // Start the interval
  const intervalId = setInterval(callback, delay);
  
  // Return cancel function
  return function cancel() {
    clearInterval(intervalId);
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

let count = 0;
const cancel = setIntervalBeginner(() => {
  count++;
  console.log('Tick:', count);
}, 500);

// Cancel after 2 seconds
setTimeout(() => {
  cancel();
  console.log('Interval cancelled at count:', count);
}, 2100);


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: With immediate execution option and arguments
 */
function setIntervalIntermediate(callback, delay, options = {}) {
  const { 
    immediate = false,  // Execute immediately before first interval
    args = []           // Arguments to pass to callback
  } = options;
  
  let intervalId = null;
  let isCancelled = false;
  
  // Execute immediately if requested
  if (immediate && !isCancelled) {
    callback(...args);
  }
  
  // Start interval
  intervalId = setInterval(() => {
    callback(...args);
  }, delay);
  
  // Return control object
  return {
    cancel() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        isCancelled = true;
      }
    },
    isCancelled() {
      return isCancelled;
    },
    isRunning() {
      return intervalId !== null && !isCancelled;
    }
  };
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const interval = setIntervalIntermediate(
  (msg) => console.log(msg, new Date().toISOString()),
  1000,
  { immediate: true, args: ['Tick at:'] }
);

console.log('Is running:', interval.isRunning());

setTimeout(() => {
  interval.cancel();
  console.log('Cancelled:', interval.isCancelled());
  console.log('Is running:', interval.isRunning());
}, 3500);


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured interval with:
 * - Pause/Resume
 * - Reset
 * - Tick count
 * - Remaining time tracking
 * - Dynamic delay change
 * - Max iterations
 */
function createInterval(callback, delay, options = {}) {
  const {
    immediate = false,
    maxIterations = Infinity,
    context = null,
    args = [],
    onStart = null,
    onStop = null,
    onTick = null
  } = options;
  
  let intervalId = null;
  let timeoutId = null;
  let tickCount = 0;
  let startTime = null;
  let remaining = delay;
  let isPaused = false;
  let isStarted = false;
  let currentDelay = delay;
  
  function tick() {
    tickCount++;
    startTime = Date.now();
    remaining = currentDelay;
    
    onTick?.(tickCount);
    callback.apply(context, args);
    
    // Check max iterations
    if (tickCount >= maxIterations) {
      stop();
    }
  }
  
  function start() {
    if (isStarted && !isPaused) return api;
    
    isStarted = true;
    isPaused = false;
    startTime = Date.now();
    
    onStart?.();
    
    // Immediate execution
    if (immediate && tickCount === 0) {
      tick();
      if (tickCount >= maxIterations) return api;
    }
    
    intervalId = setInterval(tick, currentDelay);
    
    return api;
  }
  
  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    isStarted = false;
    isPaused = false;
    tickCount = 0;
    remaining = currentDelay;
    
    onStop?.();
    
    return api;
  }
  
  function pause() {
    if (!isStarted || isPaused) return api;
    
    // Calculate remaining time in current interval
    remaining = currentDelay - (Date.now() - startTime);
    if (remaining < 0) remaining = 0;
    
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    intervalId = null;
    timeoutId = null;
    isPaused = true;
    
    return api;
  }
  
  function resume() {
    if (!isPaused) return api;
    
    isPaused = false;
    startTime = Date.now();
    
    // Use timeout for remaining time, then switch to interval
    timeoutId = setTimeout(() => {
      tick();
      if (tickCount < maxIterations) {
        intervalId = setInterval(tick, currentDelay);
      }
    }, remaining);
    
    return api;
  }
  
  function reset() {
    stop();
    return start();
  }
  
  function setDelay(newDelay) {
    currentDelay = newDelay;
    
    if (isStarted && !isPaused) {
      // Restart with new delay
      clearInterval(intervalId);
      intervalId = setInterval(tick, currentDelay);
    }
    
    return api;
  }
  
  const api = {
    start,
    stop,
    pause,
    resume,
    reset,
    setDelay,
    
    // Getters
    isRunning: () => isStarted && !isPaused,
    isPaused: () => isPaused,
    isStopped: () => !isStarted,
    getTickCount: () => tickCount,
    getDelay: () => currentDelay,
    getRemaining: () => {
      if (isPaused) return remaining;
      if (!isStarted) return currentDelay;
      return Math.max(0, currentDelay - (Date.now() - startTime));
    }
  };
  
  return api;
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

const timer = createInterval(
  () => console.log('Expert tick at:', new Date().toISOString()),
  1000,
  {
    immediate: true,
    maxIterations: 10,
    onStart: () => console.log('Timer started!'),
    onStop: () => console.log('Timer stopped!'),
    onTick: (count) => console.log(`Tick #${count}`)
  }
);

// Start the timer
timer.start();

// Pause after 2.5 seconds
setTimeout(() => {
  timer.pause();
  console.log('Paused! Remaining:', timer.getRemaining(), 'ms');
  console.log('Is paused:', timer.isPaused());
}, 2500);

// Resume after 4 seconds
setTimeout(() => {
  console.log('Resuming...');
  timer.resume();
}, 4000);

// Stop after 7 seconds
setTimeout(() => {
  timer.stop();
  console.log('Final tick count:', timer.getTickCount());
}, 7000);


// ============================================
// ALTERNATIVE: Using requestAnimationFrame
// ============================================

/**
 * For visual updates, requestAnimationFrame is better than setInterval
 * - Syncs with display refresh rate (usually 60fps)
 * - Pauses when tab is hidden
 * - More battery efficient
 */
function createAnimationInterval(callback, fps = 60) {
  let animationId = null;
  let lastTime = 0;
  const interval = 1000 / fps;
  
  function loop(currentTime) {
    animationId = requestAnimationFrame(loop);
    
    const delta = currentTime - lastTime;
    
    if (delta >= interval) {
      lastTime = currentTime - (delta % interval);
      callback(currentTime, delta);
    }
  }
  
  return {
    start() {
      if (animationId === null) {
        animationId = requestAnimationFrame(loop);
      }
      return this;
    },
    stop() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      return this;
    },
    isRunning() {
      return animationId !== null;
    }
  };
}

console.log('\n=== ANIMATION INTERVAL ===');
console.log('requestAnimationFrame-based interval for smooth animations');


// ============================================
// ALTERNATIVE: Recursive setTimeout
// ============================================

/**
 * More precise than setInterval for long-running tasks
 * Each tick waits for the previous to complete
 */
function createPreciseInterval(callback, delay) {
  let timeoutId = null;
  let isRunning = false;
  
  function tick() {
    callback();
    if (isRunning) {
      timeoutId = setTimeout(tick, delay);
    }
  }
  
  return {
    start() {
      if (!isRunning) {
        isRunning = true;
        timeoutId = setTimeout(tick, delay);
      }
      return this;
    },
    stop() {
      isRunning = false;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      return this;
    },
    isRunning() {
      return isRunning;
    }
  };
}


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: Zero delay
 * Browser enforces minimum of 4ms
 */
console.log('Zero delay becomes ~4ms minimum');

/**
 * EDGE CASE 2: Negative delay
 * Treated as 0
 */

/**
 * EDGE CASE 3: Very long delay
 * JavaScript uses 32-bit integer for delay
 * Max: 2147483647ms (~24.8 days)
 */
console.log('Max delay:', 2147483647, 'ms (~24.8 days)');

/**
 * EDGE CASE 4: Background tabs
 * Browsers throttle setInterval to 1000ms minimum
 */
console.log('Background tabs: min 1000ms');

/**
 * EDGE CASE 5: Callback throws error
 * Interval continues even if callback errors
 */
function safeInterval(callback, delay) {
  return setInterval(() => {
    try {
      callback();
    } catch (error) {
      console.error('Interval callback error:', error);
    }
  }, delay);
}

/**
 * EDGE CASE 6: Callback takes longer than delay
 * setInterval doesn't wait - can queue up calls
 * Solution: Use recursive setTimeout
 */


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Not clearing intervals on cleanup
 * Causes memory leaks
 * 
 * MISTAKE 2: Using setInterval for animations
 * Use requestAnimationFrame instead
 * 
 * MISTAKE 3: Assuming exact timing
 * JavaScript timers are not guaranteed to be precise
 * 
 * MISTAKE 4: Heavy computation in interval callback
 * Can block the main thread
 * 
 * MISTAKE 5: Multiple intervals for same task
 * Each start() should check if already running
 * 
 * MISTAKE 6: Not handling component unmount (React)
 * Clear interval in cleanup/unmount
 */


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. setInterval returns ID, clearInterval(id) to stop
 * 2. Encapsulate ID in closure for cleaner API
 * 3. Return object with start/stop/pause methods
 * 4. Use recursive setTimeout for precise timing
 * 5. Use requestAnimationFrame for animations
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with basic closure pattern
 * 2. Discuss pause/resume complexity (remaining time)
 * 3. Mention browser throttling in background
 * 4. Explain difference from setTimeout
 * 5. Discuss cleanup importance (React useEffect)
 * 
 * REACT EXAMPLE:
 * --------------
 * useEffect(() => {
 *   const interval = createInterval(callback, 1000);
 *   interval.start();
 *   return () => interval.stop(); // Cleanup!
 * }, []);
 */


// ============================================
// REAL-WORLD EXAMPLES
// ============================================

console.log('\n=== REAL-WORLD EXAMPLES ===');

// 1. Countdown timer
function createCountdown(seconds, onTick, onComplete) {
  let remaining = seconds;
  
  const interval = createInterval(
    () => {
      remaining--;
      onTick(remaining);
      if (remaining <= 0) {
        interval.stop();
        onComplete?.();
      }
    },
    1000,
    { immediate: false }
  );
  
  onTick(remaining); // Initial tick
  return interval;
}

// 2. Polling API
function createPoller(fetchFn, delay, options = {}) {
  const { onSuccess, onError, maxRetries = Infinity } = options;
  let retries = 0;
  
  return createInterval(
    async () => {
      try {
        const data = await fetchFn();
        retries = 0;
        onSuccess?.(data);
      } catch (error) {
        retries++;
        onError?.(error, retries);
        if (retries >= maxRetries) {
          // Will be stopped by maxIterations
        }
      }
    },
    delay,
    { maxIterations: maxRetries }
  );
}

// 3. Auto-save
function createAutoSave(saveFn, delay = 30000) {
  return createInterval(saveFn, delay);
}

// 4. Session timeout warning
function createSessionTimer(warningTime, logoutTime, onWarning, onLogout) {
  let elapsed = 0;
  
  const timer = createInterval(() => {
    elapsed++;
    
    if (elapsed === warningTime) {
      onWarning(logoutTime - elapsed);
    }
    
    if (elapsed >= logoutTime) {
      timer.stop();
      onLogout();
    }
  }, 1000);
  
  return {
    ...timer,
    resetActivity() {
      elapsed = 0;
    }
  };
}


module.exports = {
  setIntervalBeginner,
  setIntervalIntermediate,
  createInterval,
  createAnimationInterval,
  createPreciseInterval,
  createCountdown,
  createPoller
};
