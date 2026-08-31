import type { CodingProblem } from '../../types';

export const asyncSeriesProblem: CodingProblem = {
  id: 'coding-async-series',
  title: 'Execute Async Tasks in Series',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['async', 'promises', 'series-execution', 'callbacks', 'control-flow'],

  problem: `Implement a function \`asyncSeries\` that takes an array of asynchronous task functions and executes them one after another — in series — collecting the resolved results in order. Each task is a function that returns a Promise. The next task must not start until the previous one has resolved.

This is a fundamental async control-flow pattern used extensively in real-world applications: database migrations that must run sequentially, file processing pipelines where each step depends on the previous, API calls that must respect rate limits, and initialization sequences where services depend on each other.

Your function should return a Promise that resolves with an array of all results in the same order as the input tasks. If any task rejects, the entire series should reject immediately with that error, without executing remaining tasks.`,

  requirements: [
    'Accept an array of functions, each returning a Promise',
    'Execute tasks strictly one at a time in input order',
    'Collect all resolved values into an array preserving order',
    'Return a Promise that resolves with the results array',
    'Reject immediately if any task rejects, skipping remaining tasks',
    'Handle an empty tasks array by resolving with an empty array',
    'Each task receives no arguments (zero-parameter async functions)',
  ],

  examples: [
    {
      input: `const tasks = [\n  () => new Promise(res => setTimeout(() => res('a'), 100)),\n  () => new Promise(res => setTimeout(() => res('b'), 50)),\n  () => new Promise(res => setTimeout(() => res('c'), 75)),\n];\nasyncSeries(tasks);`,
      output: `Promise resolves with ['a', 'b', 'c']`,
      explanation: 'Even though task 2 has a shorter delay, it only starts after task 1 completes. Results are in input order.',
    },
    {
      input: `const tasks = [\n  () => Promise.resolve(1),\n  () => Promise.reject(new Error('fail')),\n  () => Promise.resolve(3),\n];\nasyncSeries(tasks);`,
      output: `Promise rejects with Error('fail')`,
      explanation: 'Task 2 rejects, so task 3 never executes and the overall promise rejects.',
    },
    {
      input: `asyncSeries([]);`,
      output: `Promise resolves with []`,
      explanation: 'An empty input array resolves with an empty results array.',
    },
  ],

  edgeCases: [
    'Empty tasks array should resolve with []',
    'Single task array should resolve with a single-element array',
    'Task that rejects should halt execution of subsequent tasks',
    'Tasks returning non-Promise values (auto-wrapped by async/await)',
    'Tasks with varying execution times still run strictly in order',
  ],

  naiveApproach: `A naive approach might try to use forEach or map with async callbacks, but these don't actually serialize execution — all tasks would start nearly simultaneously. Another naive attempt uses a simple for loop without await, which similarly fails to wait for each task to finish. Some developers attempt to chain .then() calls manually with reduce but get confused about accumulating results.`,

  optimalApproach: `The optimal approach uses a simple async/await for...of loop. Declare an empty results array, then iterate through the tasks array. For each task function, await its invocation and push the resolved value into the results array. Because await pauses the loop until the Promise settles, each task is guaranteed to complete before the next begins.

Alternatively, you can use Array.reduce to build a Promise chain. Start with Promise.resolve([]) as the accumulator. For each task, chain a .then() that invokes the task, awaits its result, and appends it to the accumulated array. This approach is more functional but harder to read. The async/await approach is preferred for clarity and is equally performant. Both approaches correctly propagate rejections — await throws on rejection, and an unhandled .then() rejection propagates down the chain.`,

  implementation: `function asyncSeries(tasks) {
  return tasks.reduce((chain, task) => {
    return chain.then((results) => {
      return task().then((result) => {
        results.push(result);
        return results;
      });
    });
  }, Promise.resolve([]));
}

async function asyncSeriesAwait(tasks) {
  const results = [];
  for (const task of tasks) {
    const result = await task();
    results.push(result);
  }
  return results;
}

// Usage
const tasks = [
  () => new Promise((res) => setTimeout(() => res('first'), 300)),
  () => new Promise((res) => setTimeout(() => res('second'), 100)),
  () => new Promise((res) => setTimeout(() => res('third'), 200)),
];

asyncSeries(tasks).then(console.log);
// ['first', 'second', 'third'] — order matches input, not completion time

asyncSeriesAwait(tasks).then(console.log);
// ['first', 'second', 'third']

// Error handling
const failingTasks = [
  () => Promise.resolve('ok'),
  () => Promise.reject(new Error('boom')),
  () => Promise.resolve('never reached'),
];

asyncSeries(failingTasks).catch((err) => console.log(err.message));
// 'boom' — third task never executes`,

  stepByStep: [
    'Accept an array of task functions that each return a Promise.',
    'Initialize a results accumulator (empty array).',
    'Iterate through tasks sequentially using reduce with Promise chain or async for...of loop.',
    'For each task, invoke it and await the resolved value.',
    'Push the resolved value into the results array.',
    'If any task rejects, propagation halts the chain / throws in the loop.',
    'After all tasks complete, return the accumulated results array.',
  ],

  timeComplexity: 'O(n) where n is the number of tasks (each task is invoked exactly once).',
  spaceComplexity: 'O(n) for storing the results array.',

  commonMistakes: [
    'Using forEach with async callbacks — forEach does not await, so all tasks fire concurrently',
    'Forgetting to invoke the task function — writing task instead of task() inside the loop',
    'Not handling the empty array case — some reduce implementations throw on empty arrays without an initial value',
    'Using Promise.all instead of sequential execution — Promise.all runs tasks in parallel',
  ],

  followUps: [
    'How would you implement asyncParallel that runs all tasks concurrently?',
    'How would you add a concurrency limit (e.g., run at most 3 tasks at a time)?',
    'How would you modify this to pass the result of each task as input to the next (waterfall pattern)?',
    'How would you implement asyncSeriesWithRetry that retries each failed task N times?',
  ],
};
