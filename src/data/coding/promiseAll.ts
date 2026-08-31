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
