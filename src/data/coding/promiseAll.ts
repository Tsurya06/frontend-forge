import type { CodingProblem } from '../../types';

export const promiseAllProblem: CodingProblem = {
  id: 'coding-promise-all',
  title: 'Implement Promise.all Polyfill',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['javascript', 'promises', 'async', 'polyfill', 'concurrency'],

  problem: `Implement a polyfill for Promise.all. The function \`promiseAll\` takes an iterable (or array) of promises (or plain values) and returns a single Promise that:
1. Resolves when all of the input promises have resolved, with an array of the resolved values in the exact same order as the input.
2. Rejects immediately as soon as ANY of the input promises rejects, with the rejection reason of that first rejected promise (fail-fast behavior).
3. If an empty array/iterable is passed, it resolves immediately with an empty array.
4. Non-promise values in the input array should be wrapped via \`Promise.resolve()\` so they resolve correctly.`,

  requirements: [
    'Return a new Promise',
    'Resolve with an array of results preserving original input index order',
    'Reject immediately when the first promise rejects (fail-fast)',
    'Handle non-promise values seamlessly',
    'Handle empty array input immediately',
    'Support any iterable (convert via Array.from or for...of)',
  ],

  examples: [
    {
      input: `const p1 = Promise.resolve(10);\nconst p2 = 20;\nconst p3 = new Promise(res => setTimeout(() => res(30), 50));\npromiseAll([p1, p2, p3])`,
      output: '[10, 20, 30]',
      explanation: 'Resolves with all three values in order once the asynchronous p3 finishes.',
    },
    {
      input: `const p1 = Promise.resolve(1);\nconst p2 = Promise.reject(new Error('Failed!'));\npromiseAll([p1, p2])`,
      output: 'Error: Failed!',
      explanation: 'Rejects immediately with the error from p2.',
    },
    {
      input: `promiseAll([])`,
      output: '[]',
      explanation: 'Empty array resolves immediately to empty array.',
    },
  ],

  edgeCases: [
    'Empty input array or iterable: resolves immediately to []',
    'Input contains non-promises (primitives, plain objects): wrap with Promise.resolve',
    'Promises that resolve out of order: results must maintain original input indices (use counter, not array.push)',
    'Input is a sparse array: preserve correct length and index placement',
    'Multiple rejections: only the first rejection reason is forwarded',
  ],

  naiveApproach: `A naive approach might use an async function and loop through each promise with \`await\`:
\`\`\`js
async function naivePromiseAll(promises) {
  const results = [];
  for (const p of promises) {
    results.push(await p);
  }
  return results;
}
\`\`\`
This is flawed because it runs promises sequentially in series rather than in parallel concurrency, defeating the entire performance purpose of Promise.all.`,

  optimalApproach: `The optimal approach attaches \`.then()\` handlers to all promises concurrently and tracks completion with an integer counter \`completedCount\`:
1. If the input iterable has length 0, resolve immediately with \`[]\`.
2. Allocate a \`results\` array of size $N$.
3. For each item at index $i$, wrap it with \`Promise.resolve(item)\`.
4. In the \`.then(value)\` callback:
   - Assign \`results[i] = value\` (preserving index order regardless of resolution timing).
   - Increment \`completedCount++\`.
   - If \`completedCount === totalCount\`, resolve the outer promise with \`results\`.
5. In the \`.catch(err)\` callback:
   - Immediately reject the outer promise with \`err\`.`,

  implementation: `function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    if (iterable == null || typeof iterable[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument is not iterable'));
    }

    const promises = Array.from(iterable);
    const total = promises.length;

    if (total === 0) {
      return resolve([]);
    }

    const results = new Array(total);
    let completed = 0;

    promises.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = value;
          completed++;
          if (completed === total) {
            resolve(results);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
}`,

  implementationTS: `export function promiseAll<T extends readonly unknown[] | []>(
  iterable: T
): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }> {
  return new Promise((resolve, reject) => {
    if (iterable == null || typeof (iterable as any)[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument is not iterable'));
    }

    const promises = Array.from(iterable);
    const total = promises.length;

    if (total === 0) {
      return resolve([] as any);
    }

    const results: any[] = new Array(total);
    let completed = 0;

    promises.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = value;
          completed++;
          if (completed === total) {
            resolve(results as any);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
}`,



  theoryAndConcepts: "WHAT IS Promise.all()?\n----------------------\nPromise.all() takes an iterable of promises and returns a single Promise that:\n- RESOLVES when ALL promises resolve (with array of results)\n- REJECTS when ANY promise rejects (with first rejection reason)\n\nKEY CHARACTERISTICS:\n--------------------\n1. Executes promises in parallel (not sequential)\n2. Results array matches input order (not completion order)\n3. Fail-fast: First rejection rejects the whole thing\n4. Non-promise values are wrapped with Promise.resolve()\n\nPROMISE STATIC METHODS:\n-----------------------\nPromise.all()        - All must succeed\nPromise.allSettled() - Wait for all to settle (success or failure)\nPromise.race()       - First to settle wins\nPromise.any()        - First to succeed wins\n\n\n\nVISUAL TIMELINE:\n----------------\nPromise.all([p1, p2, p3]):\n\np1: |----resolve----|\np2: |--resolve--|\np3: |------resolve------|\n                        \u2193\n                   returns [r1, r2, r3]\n\nIf any rejects:\np1: |----resolve----|\np2: |--reject--|\n              \u2193\n         rejects immediately",
  beginnerApproach: "Beginner: Basic Promise.all implementation",
  beginnerImplementation: "function promiseAllBeginner(promises) {\n  return new Promise((resolve, reject) => {\n    // Convert to array (handle iterables)\n    const promiseArray = Array.from(promises);\n    \n    // Handle empty array\n    if (promiseArray.length === 0) {\n      resolve([]);\n      return;\n    }\n    \n    const results = [];\n    let completedCount = 0;\n    \n    promiseArray.forEach((promise, index) => {\n      // Wrap non-promises\n      Promise.resolve(promise)\n        .then(value => {\n          results[index] = value; // Maintain order\n          completedCount++;\n          \n          // All done?\n          if (completedCount === promiseArray.length) {\n            resolve(results);\n          }\n        })\n        .catch(reject); // First rejection rejects all\n    });\n  });\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst p1 = Promise.resolve(1);\nconst p2 = new Promise(resolve => setTimeout(() => resolve(2), 100));\nconst p3 = Promise.resolve(3);\n\npromiseAllBeginner([p1, p2, p3]).then(results => {\n  console.log('All resolved:', results); // [1, 2, 3]\n});\n\n// With rejection\nconst pReject = Promise.reject('Error!');\npromiseAllBeginner([p1, pReject, p3]).catch(error => {\n  console.log('Rejected:', error); // 'Error!'\n});\n\n// With non-promises\npromiseAllBeginner([1, 2, 3]).then(results => {\n  console.log('Non-promises:', results); // [1, 2, 3]\n});",
  intermediateApproach: "Intermediate: Promise.allSettled implementation\nWaits for all promises regardless of success/failure\n\n\nIntermediate: Promise.race implementation\nReturns first settled promise (success or failure)",
  intermediateImplementation: "function promiseAllSettled(promises) {\n  return new Promise((resolve) => {\n    const promiseArray = Array.from(promises);\n    \n    if (promiseArray.length === 0) {\n      resolve([]);\n      return;\n    }\n    \n    const results = [];\n    let settledCount = 0;\n    \n    promiseArray.forEach((promise, index) => {\n      Promise.resolve(promise)\n        .then(value => {\n          results[index] = { status: 'fulfilled', value };\n        })\n        .catch(reason => {\n          results[index] = { status: 'rejected', reason };\n        })\n        .finally(() => {\n          settledCount++;\n          if (settledCount === promiseArray.length) {\n            resolve(results);\n          }\n        });\n    });\n  });\n}\n\nfunction promiseRace(promises) {\n  return new Promise((resolve, reject) => {\n    const promiseArray = Array.from(promises);\n    \n    // Note: Empty array = promise never settles (per spec)\n    \n    promiseArray.forEach(promise => {\n      Promise.resolve(promise).then(resolve, reject);\n    });\n  });\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\n// allSettled\npromiseAllSettled([\n  Promise.resolve(1),\n  Promise.reject('error'),\n  Promise.resolve(3)\n]).then(results => {\n  console.log('allSettled:', results);\n  // [\n  //   { status: 'fulfilled', value: 1 },\n  //   { status: 'rejected', reason: 'error' },\n  //   { status: 'fulfilled', value: 3 }\n  // ]\n});\n\n// race\nconst slow = new Promise(r => setTimeout(() => r('slow'), 200));\nconst fast = new Promise(r => setTimeout(() => r('fast'), 100));\n\npromiseRace([slow, fast]).then(result => {\n  console.log('Race winner:', result); // 'fast'\n});",
  expertApproach: "Expert: Promise.any implementation\nReturns first fulfilled promise, rejects only if ALL reject\n\n\nExpert: Promise.all with concurrency limit\nProcess at most N promises at a time\n\n\nExpert: Promise.map (like Array.map but with promises)\n\n\nExpert: Promise.retry\nRetry a promise-returning function on failure\n\n\nExpert: Promise.timeout\nReject if promise doesn't resolve within time limit",
  expertImplementation: "function promiseAny(promises) {\n  return new Promise((resolve, reject) => {\n    const promiseArray = Array.from(promises);\n    \n    if (promiseArray.length === 0) {\n      reject(new AggregateError([], 'All promises were rejected'));\n      return;\n    }\n    \n    const errors = [];\n    let rejectedCount = 0;\n    \n    promiseArray.forEach((promise, index) => {\n      Promise.resolve(promise)\n        .then(resolve) // First success wins\n        .catch(error => {\n          errors[index] = error;\n          rejectedCount++;\n          \n          // All rejected?\n          if (rejectedCount === promiseArray.length) {\n            reject(new AggregateError(errors, 'All promises were rejected'));\n          }\n        });\n    });\n  });\n}\n\n// AggregateError polyfill for older environments\nif (typeof AggregateError === 'undefined') {\n  class AggregateError extends Error {\n    constructor(errors, message) {\n      super(message);\n      this.errors = errors;\n      this.name = 'AggregateError';\n    }\n  }\n  globalThis.AggregateError = AggregateError;\n}\n\nfunction promiseAllWithLimit(promises, limit) {\n  return new Promise((resolve, reject) => {\n    const promiseArray = Array.from(promises);\n    \n    if (promiseArray.length === 0) {\n      resolve([]);\n      return;\n    }\n    \n    const results = new Array(promiseArray.length);\n    let currentIndex = 0;\n    let completedCount = 0;\n    let hasRejected = false;\n    \n    function runNext() {\n      if (hasRejected) return;\n      \n      const index = currentIndex++;\n      if (index >= promiseArray.length) return;\n      \n      Promise.resolve(promiseArray[index])\n        .then(value => {\n          if (hasRejected) return;\n          \n          results[index] = value;\n          completedCount++;\n          \n          if (completedCount === promiseArray.length) {\n            resolve(results);\n          } else {\n            runNext(); // Start next promise\n          }\n        })\n        .catch(error => {\n          hasRejected = true;\n          reject(error);\n        });\n    }\n    \n    // Start up to 'limit' promises\n    const initialBatch = Math.min(limit, promiseArray.length);\n    for (let i = 0; i < initialBatch; i++) {\n      runNext();\n    }\n  });\n}\n\nfunction promiseMap(items, mapper, options = {}) {\n  const { concurrency = Infinity } = options;\n  \n  const promises = items.map((item, index) => \n    () => Promise.resolve(mapper(item, index))\n  );\n  \n  if (concurrency === Infinity) {\n    return Promise.all(promises.map(fn => fn()));\n  }\n  \n  return promiseAllWithLimit(\n    promises.map(fn => fn()),\n    concurrency\n  );\n}\n\nfunction promiseRetry(fn, options = {}) {\n  const {\n    retries = 3,\n    delay = 1000,\n    backoff = 1, // Multiplier for delay\n    onRetry = null\n  } = options;\n  \n  return new Promise((resolve, reject) => {\n    let attempts = 0;\n    \n    function attempt() {\n      fn()\n        .then(resolve)\n        .catch(error => {\n          attempts++;\n          \n          if (attempts >= retries) {\n            reject(error);\n            return;\n          }\n          \n          const waitTime = delay * Math.pow(backoff, attempts - 1);\n          onRetry?.(error, attempts, waitTime);\n          \n          setTimeout(attempt, waitTime);\n        });\n    }\n    \n    attempt();\n  });\n}\n\nfunction promiseTimeout(promise, ms, message = 'Promise timed out') {\n  return Promise.race([\n    promise,\n    new Promise((_, reject) => {\n      setTimeout(() => reject(new Error(message)), ms);\n    })\n  ]);\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// any\nconst fail1 = Promise.reject('fail1');\nconst fail2 = Promise.reject('fail2');\nconst succeed = new Promise(r => setTimeout(() => r('success'), 100));\n\npromiseAny([fail1, fail2, succeed]).then(result => {\n  console.log('Any succeeded:', result); // 'success'\n});\n\npromiseAny([fail1, fail2]).catch(error => {\n  console.log('All rejected:', error.message); // 'All promises were rejected'\n});\n\n// Concurrency limit\nconsole.log('\\n--- Concurrency Limit ---');\nconst tasks = [1, 2, 3, 4, 5].map(i => \n  new Promise(r => {\n    console.log(`Starting task ${i}`);\n    setTimeout(() => {\n      console.log(`Completing task ${i}`);\n      r(i);\n    }, 100);\n  })\n);\n\npromiseAllWithLimit(tasks, 2).then(results => {\n  console.log('All completed:', results);\n});\n\n// Retry\nconsole.log('\\n--- Retry ---');\nlet attemptCount = 0;\nconst flakyFn = () => {\n  attemptCount++;\n  if (attemptCount < 3) {\n    return Promise.reject(new Error(`Attempt ${attemptCount} failed`));\n  }\n  return Promise.resolve('Success!');\n};\n\npromiseRetry(flakyFn, {\n  retries: 5,\n  delay: 100,\n  onRetry: (err, attempt) => console.log(`Retry ${attempt}:`, err.message)\n}).then(result => {\n  console.log('Finally succeeded:', result);\n});",
  interviewTraps: [
      "console.log('\\n=== EDGE CASES ===');",
      "EDGE CASE 1: Empty array",
      "Promise.all([]).then(r => console.log('Empty all:', r)); // []",
      "Promise.race([]) never settles!",
      "EDGE CASE 2: Non-promise values",
      "promiseAllBeginner([1, 2, 3]).then(r => console.log('Non-promises:', r)); // [1, 2, 3]",
      "EDGE CASE 3: Already resolved/rejected promises",
      "const resolved = Promise.resolve('already resolved');"
  ],
  stepByStep: [
    'Validate that input is iterable and convert to array.',
    'Handle empty array boundary case immediately.',
    'Create fixed-size results array and completed counter.',
    'Iterate with forEach capturing the index in closure.',
    'Wrap each element with Promise.resolve to handle plain values.',
    'On resolution, store value at captured index and increment counter.',
    'When counter equals total, resolve outer promise with results array.',
    'On rejection, reject outer promise immediately.',
  ],

  timeComplexity: 'O(N) where N is the number of promises to attach handlers, with concurrent execution time equal to the slowest individual promise (max(T_i)).',
  spaceComplexity: 'O(N) to store the results array and closure handlers.',

  alternativeSolutions: [
    'Implementing via Promise.allSettled by filtering rejections',
    'Using async iterator / generator with Promise.race for worker pooling',
  ],

  commonMistakes: [
    'Using results.push(val) instead of results[index] = val, which scrambles the order when faster promises resolve earlier.',
    'Checking results.length === total instead of an explicit completed count (empty slots in sparse arrays still increment length).',
    'Forgetting to wrap non-promise inputs with Promise.resolve().',
  ],

  followUps: [
    'How would you implement Promise.allSettled?',
    'How would you implement Promise.any and Promise.race?',
    'How would you limit concurrency to at most K active promises at a time (p-limit)?',
  ],
};
