/**
 * ============================================
 * MEMOIZATION - Complete Guide
 * ============================================
 * 
 * Topic: Implement memoization for functions with single and multiple arguments
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS MEMOIZATION?
 * --------------------
 * Memoization is an optimization technique that stores the results of
 * expensive function calls and returns cached results when same inputs occur.
 * 
 * It's a form of CACHING specific to function results.
 * 
 * WHEN TO USE:
 * ------------
 * 1. Pure functions (same input = same output)
 * 2. Expensive computations (recursive, API calls)
 * 3. Frequently called with same arguments
 * 
 * WHEN NOT TO USE:
 * ----------------
 * 1. Functions with side effects
 * 2. Random/time-dependent results
 * 3. Functions rarely called with same args
 * 4. Large argument objects (memory issues)
 * 
 * TRADE-OFFS:
 * -----------
 * + Faster subsequent calls (O(1) lookup)
 * - Memory usage for cache
 * - Cache invalidation complexity
 */

/**
 * CACHE KEY STRATEGIES:
 * ---------------------
 * 1. Single primitive arg: Use arg directly as key
 * 2. Multiple args: JSON.stringify(args) or nested Maps
 * 3. Object args: WeakMap (allows garbage collection)
 * 4. Mixed: Combination of above
 */

// ============================================
// BEGINNER LEVEL - Single Argument
// ============================================

/**
 * Beginner: Memoize function with single argument
 * Simplest case - use Map with argument as key
 */
function memoizeSingleBeginner(fn) {
  const cache = new Map();
  
  return function(arg) {
    // Check if we have cached result
    if (cache.has(arg)) {
      console.log('Cache HIT for:', arg);
      return cache.get(arg);
    }
    
    // Compute and cache
    console.log('Cache MISS for:', arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL (Single Arg) ===');

// Expensive function - calculate factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

const memoizedFactorial = memoizeSingleBeginner(factorial);

console.log(memoizedFactorial(5)); // Cache MISS, returns 120
console.log(memoizedFactorial(5)); // Cache HIT, returns 120
console.log(memoizedFactorial(10)); // Cache MISS, returns 3628800
console.log(memoizedFactorial(10)); // Cache HIT


// ============================================
// BEGINNER LEVEL - Multiple Arguments (Simple)
// ============================================

/**
 * Beginner: Multiple args using JSON.stringify
 * Simple but has limitations with object order
 */
function memoizeMultipleBeginner(fn) {
  const cache = new Map();
  
  return function(...args) {
    // Create cache key from all arguments
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Cache HIT');
      return cache.get(key);
    }
    
    console.log('Cache MISS');
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Test
console.log('\n=== BEGINNER LEVEL (Multiple Args - JSON) ===');

const add = (a, b, c) => {
  console.log('Computing...');
  return a + b + c;
};

const memoizedAdd = memoizeMultipleBeginner(add);
console.log(memoizedAdd(1, 2, 3)); // Computing... 6
console.log(memoizedAdd(1, 2, 3)); // Cache HIT, 6
console.log(memoizedAdd(1, 2, 4)); // Computing... 7


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Better memoization with:
 * - WeakMap for object arguments (memory efficient)
 * - Cache clearing
 * - Cache size tracking
 */
function memoizeIntermediate(fn) {
  // Use Map for primitives, WeakMap for objects
  const primitiveCache = new Map();
  const objectCache = new WeakMap();
  
  function memoized(...args) {
    // Single argument optimization
    if (args.length === 1) {
      const arg = args[0];
      const isObject = arg !== null && typeof arg === 'object';
      const cache = isObject ? objectCache : primitiveCache;
      
      if (cache.has(arg)) {
        return cache.get(arg);
      }
      
      const result = fn.call(this, arg);
      cache.set(arg, result);
      return result;
    }
    
    // Multiple arguments - use JSON key
    const key = JSON.stringify(args);
    
    if (primitiveCache.has(key)) {
      return primitiveCache.get(key);
    }
    
    const result = fn.apply(this, args);
    primitiveCache.set(key, result);
    return result;
  }
  
  // Utility methods
  memoized.clear = () => {
    primitiveCache.clear();
    // Note: WeakMap doesn't have clear(), entries are garbage collected
  };
  
  memoized.delete = (key) => {
    if (typeof key === 'object' && key !== null) {
      return objectCache.delete(key);
    }
    return primitiveCache.delete(key);
  };
  
  memoized.has = (key) => {
    if (typeof key === 'object' && key !== null) {
      return objectCache.has(key);
    }
    return primitiveCache.has(key);
  };
  
  memoized.size = () => primitiveCache.size;
  
  return memoized;
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const processData = memoizeIntermediate((data) => {
  console.log('Processing...');
  return data.value * 2;
});

const obj1 = { value: 10 };
const obj2 = { value: 10 }; // Same content, different reference

console.log(processData(obj1)); // Processing... 20
console.log(processData(obj1)); // Cached: 20
console.log(processData(obj2)); // Processing... 20 (different object!)

console.log('Cache size:', processData.size());
processData.clear();
console.log('After clear:', processData.size());


// ============================================
// INTERMEDIATE LEVEL - Nested Map Approach
// ============================================

/**
 * Nested Maps: Each argument level has its own Map
 * Better for multiple arguments, works with objects as keys
 */
function memoizeNestedMap(fn) {
  const cache = new Map();
  
  return function(...args) {
    let currentCache = cache;
    
    // Navigate through nested maps for each argument
    for (let i = 0; i < args.length - 1; i++) {
      if (!currentCache.has(args[i])) {
        currentCache.set(args[i], new Map());
      }
      currentCache = currentCache.get(args[i]);
    }
    
    // Check last argument
    const lastArg = args[args.length - 1];
    
    if (currentCache.has(lastArg)) {
      return currentCache.get(lastArg);
    }
    
    // Compute and store
    const result = fn.apply(this, args);
    currentCache.set(lastArg, result);
    return result;
  };
}

// Test
console.log('\n=== NESTED MAP APPROACH ===');

const multiply = memoizeNestedMap((a, b, c) => {
  console.log('Computing multiply...');
  return a * b * c;
});

console.log(multiply(2, 3, 4)); // Computing... 24
console.log(multiply(2, 3, 4)); // Cached: 24
console.log(multiply(2, 3, 5)); // Computing... 30
console.log(multiply(2, 4, 4)); // Computing... 32


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured memoization with:
 * - Custom key resolver
 * - Max cache size (LRU eviction)
 * - TTL (time-to-live)
 * - Async support
 * - Statistics
 */
function memoizeExpert(fn, options = {}) {
  const {
    resolver = null,           // Custom key generator
    maxSize = Infinity,        // Max cache entries
    maxAge = Infinity,         // TTL in milliseconds
    onHit = null,              // Callback on cache hit
    onMiss = null,             // Callback on cache miss
  } = options;
  
  // Use Map to maintain insertion order for LRU
  const cache = new Map();
  
  // Statistics
  const stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };
  
  function memoized(...args) {
    // Generate cache key
    const key = resolver 
      ? resolver.apply(this, args) 
      : (args.length === 1 ? args[0] : JSON.stringify(args));
    
    // Check cache
    if (cache.has(key)) {
      const entry = cache.get(key);
      
      // Check if expired
      if (Date.now() < entry.expiresAt) {
        stats.hits++;
        onHit?.(key, entry.value);
        
        // Move to end for LRU
        cache.delete(key);
        cache.set(key, entry);
        
        return entry.value;
      }
      
      // Expired - remove
      cache.delete(key);
    }
    
    // Cache miss
    stats.misses++;
    onMiss?.(key);
    
    // Compute result
    const result = fn.apply(this, args);
    
    // Evict oldest if at max size
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
      stats.evictions++;
    }
    
    // Store with expiration
    cache.set(key, {
      value: result,
      createdAt: Date.now(),
      expiresAt: Date.now() + maxAge
    });
    
    return result;
  }
  
  // Utility methods
  memoized.clear = () => {
    cache.clear();
    stats.hits = 0;
    stats.misses = 0;
    stats.evictions = 0;
  };
  
  memoized.delete = (key) => cache.delete(key);
  memoized.has = (key) => cache.has(key) && Date.now() < cache.get(key).expiresAt;
  memoized.size = () => cache.size;
  memoized.stats = () => ({ ...stats, size: cache.size });
  
  memoized.keys = () => Array.from(cache.keys());
  memoized.entries = () => Array.from(cache.entries()).map(
    ([k, v]) => [k, v.value]
  );
  
  return memoized;
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// With max size (LRU)
const limitedCache = memoizeExpert(
  (x) => {
    console.log(`Computing for ${x}`);
    return x * 2;
  },
  { maxSize: 3 }
);

console.log('--- Max Size Test ---');
limitedCache(1); // Computing
limitedCache(2); // Computing
limitedCache(3); // Computing
console.log('Cache size:', limitedCache.size()); // 3
limitedCache(4); // Computing, evicts 1
console.log('Cache size:', limitedCache.size()); // 3
console.log('Keys:', limitedCache.keys()); // [2, 3, 4]
limitedCache(1); // Computing (was evicted)

// With TTL
console.log('\n--- TTL Test ---');
const ttlCache = memoizeExpert(
  (x) => {
    console.log(`Computing TTL for ${x}`);
    return x;
  },
  { maxAge: 100 } // 100ms TTL
);

ttlCache('test'); // Computing
ttlCache('test'); // Cached
setTimeout(() => {
  ttlCache('test'); // Computing (expired)
}, 150);

// With custom resolver
console.log('\n--- Custom Resolver Test ---');
const userCache = memoizeExpert(
  (user) => {
    console.log(`Fetching user ${user.id}`);
    return { ...user, fetched: true };
  },
  { resolver: (user) => user.id }
);

userCache({ id: 1, name: 'John' }); // Fetching
userCache({ id: 1, name: 'John Doe' }); // Cached (same id)
userCache({ id: 2, name: 'Jane' }); // Fetching

// With statistics
console.log('\n--- Statistics ---');
console.log(limitedCache.stats());


// ============================================
// EXPERT LEVEL - Async Memoization
// ============================================

/**
 * Memoize async functions
 * Important: Cache the Promise, not the resolved value
 */
function memoizeAsync(fn, options = {}) {
  const { maxSize = Infinity, maxAge = Infinity } = options;
  const cache = new Map();
  
  return async function(...args) {
    const key = JSON.stringify(args);
    
    // Check cache
    if (cache.has(key)) {
      const entry = cache.get(key);
      if (Date.now() < entry.expiresAt) {
        return entry.promise;
      }
      cache.delete(key);
    }
    
    // Evict if needed
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    
    // Create and cache the promise immediately
    // This prevents duplicate requests for same key
    const promise = fn.apply(this, args);
    
    cache.set(key, {
      promise,
      expiresAt: Date.now() + maxAge
    });
    
    try {
      return await promise;
    } catch (error) {
      // Remove from cache on error
      cache.delete(key);
      throw error;
    }
  };
}

// Test Async
console.log('\n=== ASYNC MEMOIZATION ===');

const fetchUser = memoizeAsync(async (id) => {
  console.log(`Fetching user ${id}...`);
  await new Promise(r => setTimeout(r, 100));
  return { id, name: `User ${id}` };
});

// Multiple simultaneous calls - only one fetch!
Promise.all([
  fetchUser(1),
  fetchUser(1),
  fetchUser(1)
]).then(results => {
  console.log('Results:', results.length, 'items'); // 3 items, but only 1 fetch
});


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: Object arguments with same content
 * { a: 1 } !== { a: 1 } (different references)
 */
const objMemo = memoizeIntermediate((obj) => obj.value * 2);
const objA = { value: 5 };
const objB = { value: 5 };
console.log('Same object:', objMemo(objA) === objMemo(objA)); // true (cached)
console.log('Different objects:', objMemo(objA), objMemo(objB)); // Both compute

/**
 * EDGE CASE 2: null and undefined as arguments
 */
const nullMemo = memoizeMultipleBeginner((a) => a === null ? 'null' : 'not null');
console.log('null:', nullMemo(null));
console.log('undefined:', nullMemo(undefined));

/**
 * EDGE CASE 3: Functions as arguments
 * JSON.stringify loses functions
 */
const fnMemo = memoizeNestedMap((a, fn) => fn(a));
const double = x => x * 2;
console.log('Function arg:', fnMemo(5, double)); // Works with nested Map!

/**
 * EDGE CASE 4: NaN as argument
 * NaN !== NaN, but Map handles it correctly
 */
const nanMemo = memoizeSingleBeginner((x) => x);
console.log('NaN:', nanMemo(NaN)); // Works!
console.log('NaN cached:', nanMemo(NaN)); // Cached!

/**
 * EDGE CASE 5: Very large arguments
 * Can cause memory issues
 */
// Consider: Maximum key size, argument size limits


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Memoizing impure functions
 * Functions with side effects give inconsistent results
 * 
 * MISTAKE 2: Using JSON.stringify for object keys
 * Object property order can differ, causing cache misses
 * 
 * MISTAKE 3: Not handling `this` context
 * Arrow functions preserve context, but need .apply/.call
 * 
 * MISTAKE 4: Caching promises incorrectly
 * Cache the promise, not the result, to prevent duplicate requests
 * 
 * MISTAKE 5: Forgetting cache invalidation
 * Data can become stale - use TTL or manual clearing
 * 
 * MISTAKE 6: Unlimited cache growth
 * Can cause memory leaks - use maxSize or WeakMap
 */


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Use Map for primitives, WeakMap for objects
 * 2. JSON.stringify for simple multi-arg memoization
 * 3. Nested Maps for complex multi-arg with object support
 * 4. Cache the Promise for async functions
 * 5. Consider TTL for time-sensitive data
 * 6. Implement LRU eviction for bounded memory
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with simple Map-based solution
 * 2. Discuss trade-offs (memory vs speed)
 * 3. Mention cache invalidation strategies
 * 4. Explain when NOT to use memoization
 * 5. Discuss pure function requirement
 * 
 * TIME COMPLEXITY:
 * - Cache hit: O(1)
 * - Cache miss: O(fn) + O(1) for caching
 * 
 * SPACE COMPLEXITY:
 * - O(n) where n is number of unique argument combinations
 */


// ============================================
// REAL-WORLD EXAMPLES
// ============================================

console.log('\n=== REAL-WORLD EXAMPLES ===');

// 1. Fibonacci (classic example)
const fib = memoizeSingleBeginner(function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
console.log('Fibonacci(40):', fib(40)); // Fast with memoization!

// 2. API response caching
const fetchApi = memoizeAsync(async (endpoint) => {
  const response = await fetch(endpoint);
  return response.json();
}, { maxAge: 60000 }); // Cache for 1 minute

// 3. Expensive DOM calculations
const getElementDimensions = memoizeExpert(
  (element) => ({
    width: element.offsetWidth,
    height: element.offsetHeight,
    rect: element.getBoundingClientRect()
  }),
  { resolver: (el) => el.id || el }
);

// 4. String formatting
const formatCurrency = memoizeExpert(
  (amount, currency, locale) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount);
  }
);

console.log(formatCurrency(1234.56, 'USD', 'en-US')); // $1,234.56
console.log(formatCurrency(1234.56, 'EUR', 'de-DE')); // 1.234,56 €


module.exports = {
  memoizeSingleBeginner,
  memoizeMultipleBeginner,
  memoizeIntermediate,
  memoizeNestedMap,
  memoizeExpert,
  memoizeAsync
};
