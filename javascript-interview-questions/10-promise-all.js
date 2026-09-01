/**
 * ============================================
 * PROMISE.ALL POLYFILL - Complete Guide
 * ============================================
 * 
 * Topic: Implement Promise.all() and related Promise methods
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS Promise.all()?
 * ----------------------
 * Promise.all() takes an iterable of promises and returns a single Promise that:
 * - RESOLVES when ALL promises resolve (with array of results)
 * - REJECTS when ANY promise rejects (with first rejection reason)
 * 
 * KEY CHARACTERISTICS:
 * --------------------
 * 1. Executes promises in parallel (not sequential)
 * 2. Results array matches input order (not completion order)
 * 3. Fail-fast: First rejection rejects the whole thing
 * 4. Non-promise values are wrapped with Promise.resolve()
 * 
 * PROMISE STATIC METHODS:
 * -----------------------
 * Promise.all()        - All must succeed
 * Promise.allSettled() - Wait for all to settle (success or failure)
 * Promise.race()       - First to settle wins
 * Promise.any()        - First to succeed wins
 */

/**
 * VISUAL TIMELINE:
 * ----------------
 * Promise.all([p1, p2, p3]):
 * 
 * p1: |----resolve----|
 * p2: |--resolve--|
 * p3: |------resolve------|
 *                         ↓
 *                    returns [r1, r2, r3]
 * 
 * If any rejects:
 * p1: |----resolve----|
 * p2: |--reject--|
 *               ↓
 *          rejects immediately
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Basic Promise.all implementation
 */
function promiseAllBeginner(promises) {
  return new Promise((resolve, reject) => {
    // Convert to array (handle iterables)
    const promiseArray = Array.from(promises);
    
    // Handle empty array
    if (promiseArray.length === 0) {
      resolve([]);
      return;
    }
    
    const results = [];
    let completedCount = 0;
    
    promiseArray.forEach((promise, index) => {
      // Wrap non-promises
      Promise.resolve(promise)
        .then(value => {
          results[index] = value; // Maintain order
          completedCount++;
          
          // All done?
          if (completedCount === promiseArray.length) {
            resolve(results);
          }
        })
        .catch(reject); // First rejection rejects all
    });
  });
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const p1 = Promise.resolve(1);
const p2 = new Promise(resolve => setTimeout(() => resolve(2), 100));
const p3 = Promise.resolve(3);

promiseAllBeginner([p1, p2, p3]).then(results => {
  console.log('All resolved:', results); // [1, 2, 3]
});

// With rejection
const pReject = Promise.reject('Error!');
promiseAllBeginner([p1, pReject, p3]).catch(error => {
  console.log('Rejected:', error); // 'Error!'
});

// With non-promises
promiseAllBeginner([1, 2, 3]).then(results => {
  console.log('Non-promises:', results); // [1, 2, 3]
});


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Promise.allSettled implementation
 * Waits for all promises regardless of success/failure
 */
function promiseAllSettled(promises) {
  return new Promise((resolve) => {
    const promiseArray = Array.from(promises);
    
    if (promiseArray.length === 0) {
      resolve([]);
      return;
    }
    
    const results = [];
    let settledCount = 0;
    
    promiseArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = { status: 'fulfilled', value };
        })
        .catch(reason => {
          results[index] = { status: 'rejected', reason };
        })
        .finally(() => {
          settledCount++;
          if (settledCount === promiseArray.length) {
            resolve(results);
          }
        });
    });
  });
}

/**
 * Intermediate: Promise.race implementation
 * Returns first settled promise (success or failure)
 */
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    const promiseArray = Array.from(promises);
    
    // Note: Empty array = promise never settles (per spec)
    
    promiseArray.forEach(promise => {
      Promise.resolve(promise).then(resolve, reject);
    });
  });
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

// allSettled
promiseAllSettled([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).then(results => {
  console.log('allSettled:', results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 3 }
  // ]
});

// race
const slow = new Promise(r => setTimeout(() => r('slow'), 200));
const fast = new Promise(r => setTimeout(() => r('fast'), 100));

promiseRace([slow, fast]).then(result => {
  console.log('Race winner:', result); // 'fast'
});


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Promise.any implementation
 * Returns first fulfilled promise, rejects only if ALL reject
 */
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    const promiseArray = Array.from(promises);
    
    if (promiseArray.length === 0) {
      reject(new AggregateError([], 'All promises were rejected'));
      return;
    }
    
    const errors = [];
    let rejectedCount = 0;
    
    promiseArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve) // First success wins
        .catch(error => {
          errors[index] = error;
          rejectedCount++;
          
          // All rejected?
          if (rejectedCount === promiseArray.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
    });
  });
}

// AggregateError polyfill for older environments
if (typeof AggregateError === 'undefined') {
  class AggregateError extends Error {
    constructor(errors, message) {
      super(message);
      this.errors = errors;
      this.name = 'AggregateError';
    }
  }
  globalThis.AggregateError = AggregateError;
}

/**
 * Expert: Promise.all with concurrency limit
 * Process at most N promises at a time
 */
function promiseAllWithLimit(promises, limit) {
  return new Promise((resolve, reject) => {
    const promiseArray = Array.from(promises);
    
    if (promiseArray.length === 0) {
      resolve([]);
      return;
    }
    
    const results = new Array(promiseArray.length);
    let currentIndex = 0;
    let completedCount = 0;
    let hasRejected = false;
    
    function runNext() {
      if (hasRejected) return;
      
      const index = currentIndex++;
      if (index >= promiseArray.length) return;
      
      Promise.resolve(promiseArray[index])
        .then(value => {
          if (hasRejected) return;
          
          results[index] = value;
          completedCount++;
          
          if (completedCount === promiseArray.length) {
            resolve(results);
          } else {
            runNext(); // Start next promise
          }
        })
        .catch(error => {
          hasRejected = true;
          reject(error);
        });
    }
    
    // Start up to 'limit' promises
    const initialBatch = Math.min(limit, promiseArray.length);
    for (let i = 0; i < initialBatch; i++) {
      runNext();
    }
  });
}

/**
 * Expert: Promise.map (like Array.map but with promises)
 */
function promiseMap(items, mapper, options = {}) {
  const { concurrency = Infinity } = options;
  
  const promises = items.map((item, index) => 
    () => Promise.resolve(mapper(item, index))
  );
  
  if (concurrency === Infinity) {
    return Promise.all(promises.map(fn => fn()));
  }
  
  return promiseAllWithLimit(
    promises.map(fn => fn()),
    concurrency
  );
}

/**
 * Expert: Promise.retry
 * Retry a promise-returning function on failure
 */
function promiseRetry(fn, options = {}) {
  const {
    retries = 3,
    delay = 1000,
    backoff = 1, // Multiplier for delay
    onRetry = null
  } = options;
  
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    function attempt() {
      fn()
        .then(resolve)
        .catch(error => {
          attempts++;
          
          if (attempts >= retries) {
            reject(error);
            return;
          }
          
          const waitTime = delay * Math.pow(backoff, attempts - 1);
          onRetry?.(error, attempts, waitTime);
          
          setTimeout(attempt, waitTime);
        });
    }
    
    attempt();
  });
}

/**
 * Expert: Promise.timeout
 * Reject if promise doesn't resolve within time limit
 */
function promiseTimeout(promise, ms, message = 'Promise timed out') {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    })
  ]);
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// any
const fail1 = Promise.reject('fail1');
const fail2 = Promise.reject('fail2');
const succeed = new Promise(r => setTimeout(() => r('success'), 100));

promiseAny([fail1, fail2, succeed]).then(result => {
  console.log('Any succeeded:', result); // 'success'
});

promiseAny([fail1, fail2]).catch(error => {
  console.log('All rejected:', error.message); // 'All promises were rejected'
});

// Concurrency limit
console.log('\n--- Concurrency Limit ---');
const tasks = [1, 2, 3, 4, 5].map(i => 
  new Promise(r => {
    console.log(`Starting task ${i}`);
    setTimeout(() => {
      console.log(`Completing task ${i}`);
      r(i);
    }, 100);
  })
);

promiseAllWithLimit(tasks, 2).then(results => {
  console.log('All completed:', results);
});

// Retry
console.log('\n--- Retry ---');
let attemptCount = 0;
const flakyFn = () => {
  attemptCount++;
  if (attemptCount < 3) {
    return Promise.reject(new Error(`Attempt ${attemptCount} failed`));
  }
  return Promise.resolve('Success!');
};

promiseRetry(flakyFn, {
  retries: 5,
  delay: 100,
  onRetry: (err, attempt) => console.log(`Retry ${attempt}:`, err.message)
}).then(result => {
  console.log('Finally succeeded:', result);
});


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: Empty array
 */
Promise.all([]).then(r => console.log('Empty all:', r)); // []
// Promise.race([]) never settles!

/**
 * EDGE CASE 2: Non-promise values
 */
promiseAllBeginner([1, 2, 3]).then(r => console.log('Non-promises:', r)); // [1, 2, 3]

/**
 * EDGE CASE 3: Already resolved/rejected promises
 */
const resolved = Promise.resolve('already resolved');
const rejected = Promise.reject('already rejected');
// Still processes them correctly

/**
 * EDGE CASE 4: Thenable objects (duck typing)
 */
const thenable = {
  then(resolve) {
    resolve('thenable result');
  }
};
Promise.all([thenable]).then(r => console.log('Thenable:', r));

/**
 * EDGE CASE 5: Promises resolving to undefined
 */
Promise.all([Promise.resolve(undefined)]).then(r => {
  console.log('Undefined result:', r); // [undefined]
});

/**
 * EDGE CASE 6: Order preservation
 */
const slowFirst = new Promise(r => setTimeout(() => r('slow'), 200));
const fastSecond = new Promise(r => setTimeout(() => r('fast'), 100));
Promise.all([slowFirst, fastSecond]).then(r => {
  console.log('Order preserved:', r); // ['slow', 'fast'] (not completion order)
});


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * Promise.all     - All must succeed, first rejection fails all
 * Promise.allSettled - Wait for all, get status of each
 * Promise.race    - First to settle wins
 * Promise.any     - First to succeed wins (ES2021)
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Handle empty array case
 * 2. Use Promise.resolve() to wrap non-promises
 * 3. Preserve order in results array
 * 4. Remember fail-fast behavior
 * 5. Don't forget completedCount check
 * 
 * COMMON PATTERNS:
 * ----------------
 * - Parallel fetch: Promise.all([fetch(url1), fetch(url2)])
 * - Timeout: Promise.race([fetch(url), timeout(5000)])
 * - Graceful failure: Promise.allSettled([...]).then(filterSuccess)
 */


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Not handling empty array
 * Should resolve to [] immediately
 * 
 * MISTAKE 2: Using results.push() instead of results[index]
 * Push doesn't preserve order!
 * 
 * MISTAKE 3: Forgetting Promise.resolve() wrapper
 * Non-promise values need wrapping
 * 
 * MISTAKE 4: Not checking if all completed
 * completedCount === promiseArray.length
 * 
 * MISTAKE 5: Calling resolve multiple times
 * Only first call matters, but avoid for clarity
 */


// ============================================
// REAL-WORLD EXAMPLES
// ============================================

console.log('\n=== REAL-WORLD EXAMPLES ===');

// 1. Parallel API calls
async function fetchMultipleUsers(ids) {
  const promises = ids.map(id => 
    fetch(`/api/users/${id}`).then(r => r.json())
  );
  return Promise.all(promises);
}

// 2. Load with timeout
async function fetchWithTimeout(url, ms = 5000) {
  return promiseTimeout(fetch(url), ms, `Fetch to ${url} timed out`);
}

// 3. Batch processing with limit
async function processBatch(items, processor, batchSize = 5) {
  return promiseMap(items, processor, { concurrency: batchSize });
}

// 4. Retry with exponential backoff
async function fetchWithRetry(url) {
  return promiseRetry(
    () => fetch(url).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),
    { retries: 3, delay: 1000, backoff: 2 }
  );
}

// 5. Race with fallback
async function fetchWithFallback(primaryUrl, fallbackUrl) {
  try {
    return await promiseTimeout(fetch(primaryUrl), 3000);
  } catch {
    return fetch(fallbackUrl);
  }
}


module.exports = {
  promiseAllBeginner,
  promiseAllSettled,
  promiseRace,
  promiseAny,
  promiseAllWithLimit,
  promiseMap,
  promiseRetry,
  promiseTimeout
};
