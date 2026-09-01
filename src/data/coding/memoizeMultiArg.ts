import type { CodingProblem } from '../../types';

export const memoizeMultiArgProblem: CodingProblem = {
  id: 'coding-memoize-multi',
  title: 'Memoize with Multiple Arguments',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['memoization', 'caching', 'closures', 'performance', 'higher-order-functions'],

  problem: `Implement a memoize function that caches results of expensive function calls based on all arguments passed. When the memoized function is called again with the same set of arguments, it should return the cached result instead of re-executing the original function.

The main challenge is creating a reliable cache key from multiple arguments of varying types. A simple approach using JSON.stringify works for many cases but fails with argument ordering in objects or special values. A more robust approach uses a nested Map structure (trie) where each argument level creates a new Map branch.

This is a fundamental optimization technique used extensively in React (useMemo, React.memo), dynamic programming, and API response caching. Interviewers test this to evaluate your understanding of closures, cache invalidation trade-offs, and key-generation strategies.`,

  requirements: [
    'Accept a function and return a memoized version',
    'Cache results based on all arguments passed to the function',
    'Return cached results for identical argument sets',
    'Handle any number of arguments (variadic)',
    'Handle arguments of different types (primitives, objects, arrays)',
    'Preserve the original function\'s return value and behavior',
  ],

  examples: [
    {
      input: `const add = (a, b) => { console.log("computing"); return a + b; };\nconst memoAdd = memoize(add);\nmemoAdd(1, 2); // logs "computing", returns 3\nmemoAdd(1, 2);`,
      output: '3 (no "computing" logged the second time)',
      explanation: 'The second call with same args returns the cached result without executing the original function.',
    },
    {
      input: `const fn = memoize((x, y) => x * y);\nfn(3, 4); // 12\nfn(3, 5); // 15\nfn(3, 4);`,
      output: '12 (from cache)',
      explanation: 'Different argument sets have independent cache entries. (3,4) and (3,5) are separate.',
    },
    {
      input: `const factorial = memoize((n) => n <= 1 ? 1 : n * factorial(n - 1));\nfactorial(5);`,
      output: '120',
      explanation: 'Memoization works with recursive functions, caching intermediate results.',
    },
  ],

  edgeCases: [
    'Functions with zero arguments (always return cached result after first call)',
    'Arguments that include null, undefined, NaN, 0, and -0',
    'Object arguments where identity matters (same content but different references)',
    'Very large number of unique argument combinations (memory considerations)',
  ],

  naiveApproach: `The naive approach uses JSON.stringify on the arguments array to create a cache key. This is simple but has problems: it conflates different types that stringify the same way (undefined vs the string "undefined"), fails on circular references, ignores functions, and treats distinct objects with the same properties as identical. It also has performance overhead from serialization on every call.`,

  optimalApproach: `The optimal approach uses a nested Map structure (sometimes called a trie or map-tree). The idea is to use each argument as a key in a chain of Maps. For memoize(fn) called as fn(a, b, c), we navigate cache.get(a).get(b).get(c) to find the result. If any level doesn't exist, we create a new Map at that level.

This handles all argument types correctly because Map uses SameValueZero equality, which works for primitives and uses reference equality for objects. A special sentinel key marks the "leaf" entry that holds the cached result. This approach avoids serialization entirely and naturally handles any argument type.

For simpler use cases where arguments are always primitives, the JSON.stringify approach as a key into a plain object is perfectly adequate and more readable. The Map-trie is best when you need to handle object arguments by reference.`,

  implementation: `function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    let currentLevel = cache;

    for (const arg of args) {
      if (!currentLevel.has(arg)) {
        currentLevel.set(arg, new Map());
      }
      currentLevel = currentLevel.get(arg);
    }

    const RESULT_KEY = Symbol.for('memoize_result');

    if (currentLevel.has(RESULT_KEY)) {
      return currentLevel.get(RESULT_KEY);
    }

    const result = fn.apply(this, args);
    currentLevel.set(RESULT_KEY, result);
    return result;
  };
}

// Usage
const expensiveCalc = (a, b, c) => {
  console.log('Computing...');
  return a + b + c;
};

const memoCalc = memoize(expensiveCalc);

console.log(memoCalc(1, 2, 3));  // "Computing..." then 6
console.log(memoCalc(1, 2, 3));  // 6 (no "Computing...")
console.log(memoCalc(1, 2, 4));  // "Computing..." then 7

// Works with object arguments (by reference)
const getUser = memoize((config) => {
  console.log('Fetching...');
  return { name: 'Alice', ...config };
});

const cfg = { role: 'admin' };
console.log(getUser(cfg));       // "Fetching..."
console.log(getUser(cfg));       // cached (same reference)`,

  implementationTS: `function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<unknown, Map<unknown, unknown>>();

  return function (this: unknown, ...args: unknown[]): unknown {
    let currentLevel: Map<unknown, unknown> = cache;

    for (const arg of args) {
      if (!currentLevel.has(arg)) {
        currentLevel.set(arg, new Map());
      }
      currentLevel = currentLevel.get(arg) as Map<unknown, unknown>;
    }

    const RESULT_KEY = Symbol.for('memoize_result');

    if (currentLevel.has(RESULT_KEY)) {
      return currentLevel.get(RESULT_KEY);
    }

    const result = fn.apply(this, args);
    currentLevel.set(RESULT_KEY, result);
    return result;
  } as T;
}`,



  theoryAndConcepts: "WHAT IS MEMOIZATION?\n--------------------\nMemoization is an optimization technique that stores the results of\nexpensive function calls and returns cached results when same inputs occur.\n\nIt's a form of CACHING specific to function results.\n\nWHEN TO USE:\n------------\n1. Pure functions (same input = same output)\n2. Expensive computations (recursive, API calls)\n3. Frequently called with same arguments\n\nWHEN NOT TO USE:\n----------------\n1. Functions with side effects\n2. Random/time-dependent results\n3. Functions rarely called with same args\n4. Large argument objects (memory issues)\n\nTRADE-OFFS:\n-----------\n+ Faster subsequent calls (O(1) lookup)\n- Memory usage for cache\n- Cache invalidation complexity\n\n\n\nCACHE KEY STRATEGIES:\n---------------------\n1. Single primitive arg: Use arg directly as key\n2. Multiple args: JSON.stringify(args) or nested Maps\n3. Object args: WeakMap (allows garbage collection)\n4. Mixed: Combination of above",
  beginnerApproach: "Beginner: Memoize function with single argument\nSimplest case - use Map with argument as key",
  beginnerImplementation: "function memoizeSingleBeginner(fn) {\n  const cache = new Map();\n  \n  return function(arg) {\n    // Check if we have cached result\n    if (cache.has(arg)) {\n      console.log('Cache HIT for:', arg);\n      return cache.get(arg);\n    }\n    \n    // Compute and cache\n    console.log('Cache MISS for:', arg);\n    const result = fn(arg);\n    cache.set(arg, result);\n    return result;\n  };\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL (Single Arg) ===');\n\n// Expensive function - calculate factorial\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nconst memoizedFactorial = memoizeSingleBeginner(factorial);\n\nconsole.log(memoizedFactorial(5)); // Cache MISS, returns 120\nconsole.log(memoizedFactorial(5)); // Cache HIT, returns 120\nconsole.log(memoizedFactorial(10)); // Cache MISS, returns 3628800\nconsole.log(memoizedFactorial(10)); // Cache HIT",
  intermediateApproach: "Intermediate: Better memoization with:\n- WeakMap for object arguments (memory efficient)\n- Cache clearing\n- Cache size tracking",
  intermediateImplementation: "function memoizeIntermediate(fn) {\n  // Use Map for primitives, WeakMap for objects\n  const primitiveCache = new Map();\n  const objectCache = new WeakMap();\n  \n  function memoized(...args) {\n    // Single argument optimization\n    if (args.length === 1) {\n      const arg = args[0];\n      const isObject = arg !== null && typeof arg === 'object';\n      const cache = isObject ? objectCache : primitiveCache;\n      \n      if (cache.has(arg)) {\n        return cache.get(arg);\n      }\n      \n      const result = fn.call(this, arg);\n      cache.set(arg, result);\n      return result;\n    }\n    \n    // Multiple arguments - use JSON key\n    const key = JSON.stringify(args);\n    \n    if (primitiveCache.has(key)) {\n      return primitiveCache.get(key);\n    }\n    \n    const result = fn.apply(this, args);\n    primitiveCache.set(key, result);\n    return result;\n  }\n  \n  // Utility methods\n  memoized.clear = () => {\n    primitiveCache.clear();\n    // Note: WeakMap doesn't have clear(), entries are garbage collected\n  };\n  \n  memoized.delete = (key) => {\n    if (typeof key === 'object' && key !== null) {\n      return objectCache.delete(key);\n    }\n    return primitiveCache.delete(key);\n  };\n  \n  memoized.has = (key) => {\n    if (typeof key === 'object' && key !== null) {\n      return objectCache.has(key);\n    }\n    return primitiveCache.has(key);\n  };\n  \n  memoized.size = () => primitiveCache.size;\n  \n  return memoized;\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst processData = memoizeIntermediate((data) => {\n  console.log('Processing...');\n  return data.value * 2;\n});\n\nconst obj1 = { value: 10 };\nconst obj2 = { value: 10 }; // Same content, different reference\n\nconsole.log(processData(obj1)); // Processing... 20\nconsole.log(processData(obj1)); // Cached: 20\nconsole.log(processData(obj2)); // Processing... 20 (different object!)\n\nconsole.log('Cache size:', processData.size());\nprocessData.clear();\nconsole.log('After clear:', processData.size());",
  expertApproach: "Expert: Full-featured memoization with:\n- Custom key resolver\n- Max cache size (LRU eviction)\n- TTL (time-to-live)\n- Async support\n- Statistics",
  expertImplementation: "function memoizeExpert(fn, options = {}) {\n  const {\n    resolver = null,           // Custom key generator\n    maxSize = Infinity,        // Max cache entries\n    maxAge = Infinity,         // TTL in milliseconds\n    onHit = null,              // Callback on cache hit\n    onMiss = null,             // Callback on cache miss\n  } = options;\n  \n  // Use Map to maintain insertion order for LRU\n  const cache = new Map();\n  \n  // Statistics\n  const stats = {\n    hits: 0,\n    misses: 0,\n    evictions: 0\n  };\n  \n  function memoized(...args) {\n    // Generate cache key\n    const key = resolver \n      ? resolver.apply(this, args) \n      : (args.length === 1 ? args[0] : JSON.stringify(args));\n    \n    // Check cache\n    if (cache.has(key)) {\n      const entry = cache.get(key);\n      \n      // Check if expired\n      if (Date.now() < entry.expiresAt) {\n        stats.hits++;\n        onHit?.(key, entry.value);\n        \n        // Move to end for LRU\n        cache.delete(key);\n        cache.set(key, entry);\n        \n        return entry.value;\n      }\n      \n      // Expired - remove\n      cache.delete(key);\n    }\n    \n    // Cache miss\n    stats.misses++;\n    onMiss?.(key);\n    \n    // Compute result\n    const result = fn.apply(this, args);\n    \n    // Evict oldest if at max size\n    if (cache.size >= maxSize) {\n      const oldestKey = cache.keys().next().value;\n      cache.delete(oldestKey);\n      stats.evictions++;\n    }\n    \n    // Store with expiration\n    cache.set(key, {\n      value: result,\n      createdAt: Date.now(),\n      expiresAt: Date.now() + maxAge\n    });\n    \n    return result;\n  }\n  \n  // Utility methods\n  memoized.clear = () => {\n    cache.clear();\n    stats.hits = 0;\n    stats.misses = 0;\n    stats.evictions = 0;\n  };\n  \n  memoized.delete = (key) => cache.delete(key);\n  memoized.has = (key) => cache.has(key) && Date.now() < cache.get(key).expiresAt;\n  memoized.size = () => cache.size;\n  memoized.stats = () => ({ ...stats, size: cache.size });\n  \n  memoized.keys = () => Array.from(cache.keys());\n  memoized.entries = () => Array.from(cache.entries()).map(\n    ([k, v]) => [k, v.value]\n  );\n  \n  return memoized;\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// With max size (LRU)\nconst limitedCache = memoizeExpert(\n  (x) => {\n    console.log(`Computing for ${x}`);\n    return x * 2;\n  },\n  { maxSize: 3 }\n);\n\nconsole.log('--- Max Size Test ---');\nlimitedCache(1); // Computing\nlimitedCache(2); // Computing\nlimitedCache(3); // Computing\nconsole.log('Cache size:', limitedCache.size()); // 3\nlimitedCache(4); // Computing, evicts 1\nconsole.log('Cache size:', limitedCache.size()); // 3\nconsole.log('Keys:', limitedCache.keys()); // [2, 3, 4]\nlimitedCache(1); // Computing (was evicted)\n\n// With TTL\nconsole.log('\\n--- TTL Test ---');\nconst ttlCache = memoizeExpert(\n  (x) => {\n    console.log(`Computing TTL for ${x}`);\n    return x;\n  },\n  { maxAge: 100 } // 100ms TTL\n);\n\nttlCache('test'); // Computing\nttlCache('test'); // Cached\nsetTimeout(() => {\n  ttlCache('test'); // Computing (expired)\n}, 150);\n\n// With custom resolver\nconsole.log('\\n--- Custom Resolver Test ---');\nconst userCache = memoizeExpert(\n  (user) => {\n    console.log(`Fetching user ${user.id}`);\n    return { ...user, fetched: true };\n  },\n  { resolver: (user) => user.id }\n);\n\nuserCache({ id: 1, name: 'John' }); // Fetching\nuserCache({ id: 1, name: 'John Doe' }); // Cached (same id)\nuserCache({ id: 2, name: 'Jane' }); // Fetching\n\n// With statistics\nconsole.log('\\n--- Statistics ---');\nconsole.log(limitedCache.stats());",
  interviewTraps: [
      "console.log('\\n=== EDGE CASES ===');",
      "EDGE CASE 1: Object arguments with same content",
      "{ a: 1 } !== { a: 1 } (different references)",
      "const objMemo = memoizeIntermediate((obj) => obj.value * 2);",
      "const objA = { value: 5 };",
      "const objB = { value: 5 };",
      "console.log('Same object:', objMemo(objA) === objMemo(objA)); // true (cached)",
      "console.log('Different objects:', objMemo(objA), objMemo(objB)); // Both compute"
  ],
  stepByStep: [
    'Create a Map as the top-level cache inside a closure.',
    'Return a new function that accepts any number of arguments via rest params.',
    'For each argument, traverse deeper into the nested Map structure, creating new Maps as needed.',
    'After traversing all arguments, check the final Map for a sentinel RESULT_KEY.',
    'If the result exists, return it immediately (cache hit).',
    'If not, call the original function with all arguments, store the result at the RESULT_KEY, and return it.',
    'The nested Map structure ensures each unique argument combination maps to a unique leaf node.',
  ],

  timeComplexity: 'O(k) per call for cache lookup where k is the number of arguments. O(k + T) for cache misses where T is the original function\'s time complexity.',
  spaceComplexity: 'O(n * k) where n is the number of unique argument sets cached and k is the average number of arguments per call.',

  commonMistakes: [
    'Using JSON.stringify for cache keys, which conflates types and fails on circular references',
    'Not handling the zero-arguments case (need to still cache the result)',
    'Forgetting that Map uses reference equality for objects, so {a:1} !== {a:1}',
    'Not using a sentinel key for the result, potentially confusing nested Maps with cached results',
  ],

  followUps: [
    'How would you add a maximum cache size with LRU eviction?',
    'How would you implement cache expiration (TTL)?',
    'How does this relate to React.memo and useMemo? What are the differences?',
  ],
};
