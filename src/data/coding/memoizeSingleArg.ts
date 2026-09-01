import type { CodingProblem } from "../../types";

export const memoizeSingleArgProblem: CodingProblem = {
  id: "coding-memoize-single",
  title: "Memoize with Single Argument",
  difficulty: "Beginner",
  category: "Coding",
  tags: [
    "memoization",
    "caching",
    "closures",
    "performance",
    "higher-order-functions",
  ],

  problem: `Implement a memoize function that takes a single-argument function and returns a new function that caches its results. When the memoized function is called with an argument it has seen before, it should return the cached result immediately without re-executing the original function.

This is the simplest form of memoization and is the perfect entry point for understanding the concept. Since there's only one argument, the cache key is straightforward — use the argument itself as the key in a Map or plain object. This avoids the complexity of multi-argument key generation.

Memoization is a fundamental optimization technique. It's the basis for React.memo, useMemo, and selector libraries like Reselect. This problem tests your understanding of closures (the cache lives in the closure), higher-order functions (accepting and returning functions), and the trade-off between time and space complexity.`,

  requirements: [
    "Accept a single-argument function and return a memoized version",
    "Cache results using the argument as the cache key",
    "Return cached results for previously seen arguments",
    "Only execute the original function once per unique argument",
    "Handle any argument type (primitives, objects by reference)",
    "Preserve the original function's return value exactly",
  ],

  examples: [
    {
      input: `const square = memoize(x => { console.log("calc"); return x * x; });\nsquare(4); // logs "calc", returns 16\nsquare(4);`,
      output: '16 (no "calc" logged second time)',
      explanation:
        "First call computes and caches. Second call returns cached result.",
    },
    {
      input: `const memoFib = memoize(n => n <= 1 ? n : memoFib(n-1) + memoFib(n-2));\nmemoFib(40);`,
      output: "102334155 (computed instantly)",
      explanation:
        "Without memoization, fib(40) takes billions of operations. Memoized version computes each value once.",
    },
    {
      input: `const upper = memoize(s => s.toUpperCase());\nupper("hello"); // "HELLO"\nupper("world"); // "WORLD"\nupper("hello");`,
      output: '"HELLO" (from cache)',
      explanation: "Different arguments get separate cache entries.",
    },
  ],

  edgeCases: [
    "Argument is undefined or null (should still be cached)",
    "Function returns undefined (should cache it, not treat as uncached)",
    "Function returns falsy values like 0, false, or empty string",
    "Object arguments — cached by reference, not by value",
  ],

  naiveApproach: `The most naive approach doesn't cache at all and just wraps the function. A slightly better naive approach uses a plain object ({}) as the cache with argument.toString() as the key. This fails because different values can have the same toString (e.g., [1,2].toString() === "1,2" === String("1,2")). It also coerces all keys to strings, conflating 1 and "1".`,

  optimalApproach: `The optimal approach for single-argument memoization uses a Map as the cache. Map preserves key types (unlike plain objects which coerce keys to strings), so number 1 and string "1" are separate keys. The memoized function checks cache.has(arg) first — if found, returns cache.get(arg). Otherwise, calls the original function, stores the result with cache.set(arg, result), and returns it.

Using has() instead of checking for undefined is important because the function might legitimately return undefined, and we want to cache that result too. The Map is created once in the closure and persists across all calls to the memoized function. For memory management, you could use a WeakMap if arguments are always objects (allows garbage collection of cached entries when the key object is no longer referenced).`,

  implementation: `function memoize(fn) {
  const cache = new Map();

  return function memoized(arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }

    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// Usage: expensive computation
const factorial = memoize(function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
});

console.log(factorial(10));  // 3628800 (computed)
console.log(factorial(10));  // 3628800 (cached)

// Usage: Fibonacci with memoization
const fib = memoize(function fibonacci(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

console.log(fib(50));  // 12586269025 (instant with memoization)

// Usage: API/string processing
const processName = memoize((name) => {
  console.log('Processing:', name);
  return name.trim().toLowerCase().replace(/\\s+/g, '-');
});

console.log(processName('  Hello World  ')); // 'hello-world' (logs Processing)
console.log(processName('  Hello World  ')); // 'hello-world' (from cache)
console.log(processName('Foo Bar'));          // 'foo-bar' (logs Processing)`,

  implementationTS: `function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new Map<T, R>();

  return function memoized(arg: T): R {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }

    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const square = memoize((x: number): number => x * x);
console.log(square(5));  // 25
console.log(square(5));  // 25 (cached)`,

  stepByStep: [
    "Create a new Map inside the closure to serve as the cache.",
    "Return a new function that takes a single argument.",
    "Check if the cache already has an entry for the argument using cache.has().",
    "If cached, return cache.get(arg) immediately — no function execution.",
    "If not cached, call the original function fn(arg) and store the result.",
    "Save the result in the cache with cache.set(arg, result).",
    "Return the computed result.",
  ],

  timeComplexity:
    "O(1) for cache hits. O(T) for cache misses where T is the original function's time complexity.",
  spaceComplexity: "O(n) where n is the number of unique arguments cached.",

  commonMistakes: [
    'Using a plain object instead of Map, which coerces keys to strings (1 and "1" collide)',
    "Checking cache[arg] !== undefined instead of cache.has(arg), which breaks if the function returns undefined",
    "Not returning the result from the memoized function after computing it",
    "Confusing memoization (caching returns) with debouncing/throttling (controlling call frequency)",
  ],

  followUps: [
    "How would you extend this to handle multiple arguments?",
    "How would you add a maximum cache size (LRU eviction)?",
    "What is the difference between memoize and React.useMemo?",
  ],
};
