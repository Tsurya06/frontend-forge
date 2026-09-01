/**
 * ============================================
 * DEBOUNCE WITH CANCEL - Complete Guide
 * ============================================
 * 
 * Topic: Implement a debounce function with cancel method
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS DEBOUNCING?
 * -------------------
 * Debouncing delays function execution until a pause in invocations.
 * The function only executes after the user "stops" triggering it.
 * 
 * VISUAL TIMELINE:
 * ----------------
 * Calls:    |--X--X--X--X--------|-------X--X--------|
 * Wait:                   [300ms]           [300ms]
 * Execute:                      ↓                   ↓
 * 
 * USE CASES:
 * ----------
 * 1. Search input (wait for user to stop typing)
 * 2. Window resize handlers
 * 3. Auto-save (save after user stops editing)
 * 4. Button click (prevent double-clicks)
 * 
 * DEBOUNCE VS THROTTLE:
 * ---------------------
 * DEBOUNCE: Waits for "silence", executes once at the end
 * THROTTLE: Executes at regular intervals during activity
 * 
 * Calls:    |--X--X--X--X--X--X--|
 * Debounce:                      ↓ (once at end)
 * Throttle: ↓-----↓-----↓-----↓   (every N ms)
 */

/**
 * DEBOUNCE OPTIONS:
 * -----------------
 * leading:  Execute on first call (immediate feedback)
 * trailing: Execute after delay (default behavior)
 * maxWait:  Maximum time to wait before forcing execution
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple debounce (trailing only)
 * Most common use case
 */
function debounceBeginner(fn, delay) {
  let timeoutId = null;
  
  return function(...args) {
    // Clear previous timeout
    clearTimeout(timeoutId);
    
    // Set new timeout
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const logBeginner = debounceBeginner((text) => {
  console.log('Search:', text);
}, 300);

// Simulate typing
logBeginner('h');
logBeginner('he');
logBeginner('hel');
logBeginner('hell');
logBeginner('hello');
// Only "hello" will be logged after 300ms


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Debounce with cancel and flush
 */
function debounceIntermediate(fn, delay) {
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;
  
  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      fn.apply(lastThis, lastArgs);
      timeoutId = null;
      lastArgs = null;
      lastThis = null;
    }, delay);
  }
  
  // Cancel pending execution
  debounced.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastArgs = null;
    lastThis = null;
  };
  
  // Execute immediately if pending
  debounced.flush = function() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      fn.apply(lastThis, lastArgs);
      timeoutId = null;
      lastArgs = null;
      lastThis = null;
    }
  };
  
  // Check if there's a pending execution
  debounced.pending = function() {
    return timeoutId !== null;
  };
  
  return debounced;
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const save = debounceIntermediate((data) => {
  console.log('Saving:', data);
}, 1000);

save('draft 1');
save('draft 2');
console.log('Pending:', save.pending()); // true

// Cancel example
save('draft 3');
save.cancel();
console.log('After cancel, pending:', save.pending()); // false

// Flush example
save('final');
save.flush(); // Saves immediately


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured debounce with leading, trailing, maxWait
 */
function debounceExpert(fn, delay, options = {}) {
  const {
    leading = false,    // Execute on leading edge
    trailing = true,    // Execute on trailing edge
    maxWait = null      // Maximum time to wait
  } = options;
  
  let timeoutId = null;
  let maxTimeoutId = null;
  let lastArgs = null;
  let lastThis = null;
  let lastCallTime = null;
  let lastInvokeTime = 0;
  let result = undefined;
  
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = null;
    lastInvokeTime = time;
    result = fn.apply(thisArg, args);
    return result;
  }
  
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    
    // First call, or enough time passed, or system time went backwards
    return (
      lastCallTime === null ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (maxWait !== null && timeSinceLastInvoke >= maxWait)
    );
  }
  
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = delay - timeSinceLastCall;
    
    return maxWait !== null
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }
  
  function trailingEdge(time) {
    timeoutId = null;
    
    // Only invoke if we have args (meaning debounced was called)
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    
    lastArgs = lastThis = null;
    return result;
  }
  
  function timerExpired() {
    const time = Date.now();
    
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    
    // Restart timer with remaining time
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  }
  
  function leadingEdge(time) {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, delay);
    
    // Invoke on leading edge
    return leading ? invokeFunc(time) : result;
  }
  
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    
    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(time);
      }
      
      // Handle maxWait case
      if (maxWait !== null) {
        timeoutId = setTimeout(timerExpired, delay);
        return invokeFunc(time);
      }
    }
    
    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, delay);
    }
    
    return result;
  }
  
  debounced.cancel = function() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId !== null) {
      clearTimeout(maxTimeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeoutId = maxTimeoutId = null;
  };
  
  debounced.flush = function() {
    if (timeoutId === null) {
      return result;
    }
    return trailingEdge(Date.now());
  };
  
  debounced.pending = function() {
    return timeoutId !== null;
  };
  
  return debounced;
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Leading edge (immediate execution)
console.log('--- Leading Edge ---');
const leadingDebounce = debounceExpert(
  (x) => console.log('Leading:', x),
  300,
  { leading: true, trailing: false }
);

leadingDebounce('first'); // Executes immediately
leadingDebounce('second'); // Ignored
leadingDebounce('third'); // Ignored

// Both leading and trailing
console.log('\n--- Leading + Trailing ---');
const bothDebounce = debounceExpert(
  (x) => console.log('Both:', x),
  300,
  { leading: true, trailing: true }
);

bothDebounce('first'); // Executes immediately
bothDebounce('second');
bothDebounce('third'); // Will execute after 300ms

// MaxWait (guarantees execution within time limit)
console.log('\n--- MaxWait ---');
const maxWaitDebounce = debounceExpert(
  (x) => console.log('MaxWait:', x, 'at', Date.now()),
  300,
  { maxWait: 1000 }
);

// Continuous calls for 2 seconds
let counter = 0;
const interval = setInterval(() => {
  maxWaitDebounce(++counter);
}, 100);

setTimeout(() => {
  clearInterval(interval);
  maxWaitDebounce.flush();
}, 2000);


// ============================================
// THROTTLE COMPARISON
// ============================================

/**
 * Throttle: Execute at most once per interval
 */
function throttle(fn, delay) {
  let lastTime = 0;
  let timeoutId = null;
  
  function throttled(...args) {
    const now = Date.now();
    const remaining = delay - (now - lastTime);
    
    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  }
  
  throttled.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastTime = 0;
  };
  
  return throttled;
}

console.log('\n=== THROTTLE COMPARISON ===');
console.log('Throttle executes at intervals during activity');
console.log('Debounce waits for silence before executing');


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: Zero delay
 * Still defers execution to next tick
 */
const zeroDelay = debounceBeginner((x) => console.log('Zero delay:', x), 0);
zeroDelay('test'); // Executes on next tick

/**
 * EDGE CASE 2: Preserving `this` context
 */
const obj = {
  value: 42,
  logValue: debounceBeginner(function() {
    console.log('this.value:', this.value);
  }, 100)
};
obj.logValue(); // this.value: 42

/**
 * EDGE CASE 3: Return value
 * Debounced functions don't return values immediately
 * (leading: true can return first call's value)
 */
const withReturn = debounceExpert(
  (x) => x * 2,
  100,
  { leading: true }
);
console.log('Return value:', withReturn(5)); // 10 (because leading: true)

/**
 * EDGE CASE 4: Multiple debounced instances
 * Each call to debounce() creates independent timers
 */
const debounce1 = debounceBeginner(console.log, 100);
const debounce2 = debounceBeginner(console.log, 100);
debounce1('one'); // Independent timer
debounce2('two'); // Independent timer


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Creating debounce inside render/loop
 * 
 * BAD:
 * function Component() {
 *   const handleSearch = debounce(search, 300); // New function each render!
 * }
 * 
 * GOOD:
 * const handleSearch = useMemo(() => debounce(search, 300), []);
 * 
 * MISTAKE 2: Not cleaning up on unmount
 * 
 * useEffect(() => {
 *   return () => debouncedFn.cancel(); // Clean up!
 * }, []);
 * 
 * MISTAKE 3: Forgetting about `this` binding
 * Use arrow functions or bind explicitly
 * 
 * MISTAKE 4: Using debounce where throttle is better
 * - Debounce: Search input, auto-save
 * - Throttle: Scroll handlers, resize handlers
 */


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Debounce delays until "silence"
 * 2. leading: Execute immediately on first call
 * 3. trailing: Execute after delay (default)
 * 4. maxWait: Force execution within time limit
 * 5. Always provide cancel() for cleanup
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with simple trailing debounce
 * 2. Explain difference from throttle
 * 3. Discuss leading vs trailing
 * 4. Mention cleanup importance
 * 5. Give real-world examples
 * 
 * COMMON USE CASES:
 * -----------------
 * - Search input: debounce(search, 300)
 * - Window resize: debounce(handleResize, 200)
 * - Auto-save: debounce(save, 1000)
 * - Form validation: debounce(validate, 500)
 */


// ============================================
// REAL-WORLD EXAMPLES
// ============================================

console.log('\n=== REAL-WORLD EXAMPLES ===');

// 1. Search input with cancel
function createSearchHandler(searchFn) {
  const debouncedSearch = debounceIntermediate(searchFn, 300);
  
  return {
    onInput(query) {
      if (query.length < 2) {
        debouncedSearch.cancel();
        return;
      }
      debouncedSearch(query);
    },
    onClear() {
      debouncedSearch.cancel();
    }
  };
}

// 2. Auto-save with immediate feedback
function createAutoSave(saveFn) {
  return debounceExpert(saveFn, 2000, {
    leading: true,  // Save immediately on first change
    trailing: true, // Also save after editing stops
    maxWait: 10000  // Force save at least every 10 seconds
  });
}

// 3. Resize handler
function createResizeHandler(callback) {
  return debounceExpert(callback, 150, {
    leading: true,   // Get initial dimensions
    trailing: true,  // Get final dimensions
    maxWait: 500     // Update periodically during resize
  });
}

// 4. Button click debounce (prevent double-click)
function createButtonHandler(handler) {
  return debounceExpert(handler, 300, {
    leading: true,
    trailing: false
  });
}


module.exports = {
  debounceBeginner,
  debounceIntermediate,
  debounceExpert,
  throttle
};
