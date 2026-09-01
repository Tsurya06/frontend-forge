import type { CodingProblem } from "../../types";

export const asyncSeriesProblem: CodingProblem = {
  id: "coding-async-series",
  title: "Execute Async Tasks in Series",
  difficulty: "Intermediate",
  category: "Coding",
  tags: ["async", "promises", "series-execution", "callbacks", "control-flow"],

  problem: `Implement a function \`asyncSeries\` that takes an array of asynchronous task functions and executes them one after another — in series — collecting the resolved results in order. Each task is a function that returns a Promise. The next task must not start until the previous one has resolved.

This is a fundamental async control-flow pattern used extensively in real-world applications: database migrations that must run sequentially, file processing pipelines where each step depends on the previous, API calls that must respect rate limits, and initialization sequences where services depend on each other.

Your function should return a Promise that resolves with an array of all results in the same order as the input tasks. If any task rejects, the entire series should reject immediately with that error, without executing remaining tasks.`,

  requirements: [
    "Accept an array of functions, each returning a Promise",
    "Execute tasks strictly one at a time in input order",
    "Collect all resolved values into an array preserving order",
    "Return a Promise that resolves with the results array",
    "Reject immediately if any task rejects, skipping remaining tasks",
    "Handle an empty tasks array by resolving with an empty array",
    "Each task receives no arguments (zero-parameter async functions)",
  ],

  examples: [
    {
      input: `const tasks = [\n  () => new Promise(res => setTimeout(() => res('a'), 100)),\n  () => new Promise(res => setTimeout(() => res('b'), 50)),\n  () => new Promise(res => setTimeout(() => res('c'), 75)),\n];\nasyncSeries(tasks);`,
      output: `Promise resolves with ['a', 'b', 'c']`,
      explanation:
        "Even though task 2 has a shorter delay, it only starts after task 1 completes. Results are in input order.",
    },
    {
      input: `const tasks = [\n  () => Promise.resolve(1),\n  () => Promise.reject(new Error('fail')),\n  () => Promise.resolve(3),\n];\nasyncSeries(tasks);`,
      output: `Promise rejects with Error('fail')`,
      explanation:
        "Task 2 rejects, so task 3 never executes and the overall promise rejects.",
    },
    {
      input: `asyncSeries([]);`,
      output: `Promise resolves with []`,
      explanation: "An empty input array resolves with an empty results array.",
    },
  ],

  edgeCases: [
    "Empty tasks array should resolve with []",
    "Single task array should resolve with a single-element array",
    "Task that rejects should halt execution of subsequent tasks",
    "Tasks returning non-Promise values (auto-wrapped by async/await)",
    "Tasks with varying execution times still run strictly in order",
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

  theoryAndConcepts:
    "SERIES vs PARALLEL EXECUTION:\n-----------------------------\n\nSERIES (Sequential):\n- One task at a time\n- Wait for each to complete before starting next\n- Total time = sum of all task times\n\nPARALLEL:\n- All tasks at once\n- Total time = longest task time\n\nCONCURRENT (with limit):\n- N tasks at a time\n- Balance between series and parallel\n\nUSE CASES FOR SERIES:\n---------------------\n1. Order-dependent operations (create then update)\n2. Rate limiting\n3. Resource constraints\n4. Transaction sequences\n5. Testing/debugging",
  beginnerApproach: "Beginner: Using async/await loop",
  beginnerImplementation:
    "async function runSeriesBeginner(tasks) {\n  const results = [];\n  \n  for (const task of tasks) {\n    const result = await task();\n    results.push(result);\n  }\n  \n  return results;\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst tasks = [\n  () => new Promise(r => setTimeout(() => { console.log('Task 1'); r(1); }, 100)),\n  () => new Promise(r => setTimeout(() => { console.log('Task 2'); r(2); }, 50)),\n  () => new Promise(r => setTimeout(() => { console.log('Task 3'); r(3); }, 75))\n];\n\nrunSeriesBeginner(tasks).then(results => {\n  console.log('Results:', results); // [1, 2, 3]\n});",
  intermediateApproach:
    "Intermediate: With error handling and callbacks\n\n\nIntermediate: Using reduce (functional style)",
  intermediateImplementation:
    "async function runSeriesIntermediate(tasks, options = {}) {\n  const {\n    continueOnError = false,\n    onProgress = null,\n    onError = null\n  } = options;\n  \n  const results = [];\n  const errors = [];\n  \n  for (let i = 0; i < tasks.length; i++) {\n    try {\n      const result = await tasks[i]();\n      results.push({ status: 'fulfilled', value: result, index: i });\n      \n      onProgress?.({\n        completed: i + 1,\n        total: tasks.length,\n        result,\n        progress: (i + 1) / tasks.length\n      });\n      \n    } catch (error) {\n      errors.push({ index: i, error });\n      results.push({ status: 'rejected', reason: error, index: i });\n      \n      onError?.({ index: i, error });\n      \n      if (!continueOnError) {\n        throw error;\n      }\n    }\n  }\n  \n  return { results, errors, hasErrors: errors.length > 0 };\n}\n\nfunction runSeriesReduce(tasks) {\n  return tasks.reduce(\n    (promiseChain, task) => promiseChain.then(results =>\n      task().then(result => [...results, result])\n    ),\n    Promise.resolve([])\n  );\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst mixedTasks = [\n  () => Promise.resolve(1),\n  () => Promise.reject(new Error('Task 2 failed')),\n  () => Promise.resolve(3)\n];\n\nrunSeriesIntermediate(mixedTasks, {\n  continueOnError: true,\n  onProgress: ({ completed, total }) => console.log(`Progress: ${completed}/${total}`),\n  onError: ({ index, error }) => console.log(`Error at ${index}: ${error.message}`)\n}).then(({ results, hasErrors }) => {\n  console.log('Results:', results);\n  console.log('Has errors:', hasErrors);\n});",
  expertApproach:
    "Expert: Waterfall - pass result of each task to next\n\n\nExpert: Series with timeout per task\n\n\nExpert: Series with retry\n\n\nExpert: Concurrent with limit (pool)\n\n\nExpert: Async iterator for streaming results",
  expertImplementation:
    "async function waterfall(tasks, initialValue) {\n  let result = initialValue;\n  \n  for (const task of tasks) {\n    result = await task(result);\n  }\n  \n  return result;\n}\n\nasync function runSeriesWithTimeout(tasks, timeoutMs) {\n  const results = [];\n  \n  for (let i = 0; i < tasks.length; i++) {\n    const result = await Promise.race([\n      tasks[i](),\n      new Promise((_, reject) => \n        setTimeout(() => reject(new Error(`Task ${i} timed out`)), timeoutMs)\n      )\n    ]);\n    results.push(result);\n  }\n  \n  return results;\n}\n\nasync function runSeriesWithRetry(tasks, options = {}) {\n  const { retries = 3, retryDelay = 1000 } = options;\n  const results = [];\n  \n  for (let i = 0; i < tasks.length; i++) {\n    let lastError;\n    let attempts = 0;\n    \n    while (attempts <= retries) {\n      try {\n        const result = await tasks[i]();\n        results.push(result);\n        break;\n      } catch (error) {\n        lastError = error;\n        attempts++;\n        \n        if (attempts > retries) {\n          throw new Error(`Task ${i} failed after ${retries} retries: ${error.message}`);\n        }\n        \n        await new Promise(r => setTimeout(r, retryDelay));\n      }\n    }\n  }\n  \n  return results;\n}\n\nasync function runConcurrent(tasks, limit = 3) {\n  const results = new Array(tasks.length);\n  let currentIndex = 0;\n  let completedCount = 0;\n  \n  return new Promise((resolve, reject) => {\n    function runNext() {\n      const index = currentIndex++;\n      \n      if (index >= tasks.length) {\n        if (completedCount === tasks.length) {\n          resolve(results);\n        }\n        return;\n      }\n      \n      tasks[index]()\n        .then(result => {\n          results[index] = result;\n          completedCount++;\n          runNext();\n        })\n        .catch(reject);\n    }\n    \n    // Start initial batch\n    const initialBatch = Math.min(limit, tasks.length);\n    for (let i = 0; i < initialBatch; i++) {\n      runNext();\n    }\n    \n    // Handle empty tasks\n    if (tasks.length === 0) {\n      resolve([]);\n    }\n  });\n}\n\nasync function* runSeriesIterator(tasks) {\n  for (let i = 0; i < tasks.length; i++) {\n    const result = await tasks[i]();\n    yield { index: i, result, done: i === tasks.length - 1 };\n  }\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Waterfall\nconst waterfallTasks = [\n  (x) => Promise.resolve(x + 1),\n  (x) => Promise.resolve(x * 2),\n  (x) => Promise.resolve(x + 10)\n];\n\nwaterfall(waterfallTasks, 5).then(result => {\n  console.log('Waterfall result:', result); // ((5 + 1) * 2) + 10 = 22\n});\n\n// Concurrent with limit\nconst concurrentTasks = Array(10).fill(null).map((_, i) => \n  () => new Promise(r => {\n    console.log(`Starting task ${i}`);\n    setTimeout(() => {\n      console.log(`Completing task ${i}`);\n      r(i);\n    }, Math.random() * 200);\n  })\n);\n\nrunConcurrent(concurrentTasks, 3).then(results => {\n  console.log('Concurrent results:', results);\n});\n\n// Iterator usage\nasync function useIterator() {\n  const tasks = [\n    () => Promise.resolve('a'),\n    () => Promise.resolve('b'),\n    () => Promise.resolve('c')\n  ];\n  \n  for await (const { index, result } of runSeriesIterator(tasks)) {\n    console.log(`Iterator - Task ${index}: ${result}`);\n  }\n}\n\nuseIterator();",
  interviewTraps: [
    "QUICK REFERENCE:",
    "Series: for await...of / reduce",
    "Waterfall: Pass result to next task",
    "Concurrent: Control parallelism with pool",
    "INTERVIEW TIPS:",
    "1. Show async/await approach first",
    "2. Explain difference from Promise.all",
    "3. Discuss error handling strategies",
  ],
  stepByStep: [
    "Accept an array of task functions that each return a Promise.",
    "Initialize a results accumulator (empty array).",
    "Iterate through tasks sequentially using reduce with Promise chain or async for...of loop.",
    "For each task, invoke it and await the resolved value.",
    "Push the resolved value into the results array.",
    "If any task rejects, propagation halts the chain / throws in the loop.",
    "After all tasks complete, return the accumulated results array.",
  ],

  timeComplexity:
    "O(n) where n is the number of tasks (each task is invoked exactly once).",
  spaceComplexity: "O(n) for storing the results array.",

  commonMistakes: [
    "Using forEach with async callbacks — forEach does not await, so all tasks fire concurrently",
    "Forgetting to invoke the task function — writing task instead of task() inside the loop",
    "Not handling the empty array case — some reduce implementations throw on empty arrays without an initial value",
    "Using Promise.all instead of sequential execution — Promise.all runs tasks in parallel",
  ],

  followUps: [
    "How would you implement asyncParallel that runs all tasks concurrently?",
    "How would you add a concurrency limit (e.g., run at most 3 tasks at a time)?",
    "How would you modify this to pass the result of each task as input to the next (waterfall pattern)?",
    "How would you implement asyncSeriesWithRetry that retries each failed task N times?",
  ],
};
