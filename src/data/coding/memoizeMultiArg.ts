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
