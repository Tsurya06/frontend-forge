/**
 * ============================================
 * EXECUTE ASYNC TASKS IN SERIES - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function to execute N async tasks in series
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * SERIES vs PARALLEL EXECUTION:
 * -----------------------------
 * 
 * SERIES (Sequential):
 * - One task at a time
 * - Wait for each to complete before starting next
 * - Total time = sum of all task times
 * 
 * PARALLEL:
 * - All tasks at once
 * - Total time = longest task time
 * 
 * CONCURRENT (with limit):
 * - N tasks at a time
 * - Balance between series and parallel
 * 
 * USE CASES FOR SERIES:
 * ---------------------
 * 1. Order-dependent operations (create then update)
 * 2. Rate limiting
 * 3. Resource constraints
 * 4. Transaction sequences
 * 5. Testing/debugging
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Using async/await loop
 */
async function runSeriesBeginner(tasks) {
  const results = [];
  
  for (const task of tasks) {
    const result = await task();
    results.push(result);
  }
  
  return results;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const tasks = [
  () => new Promise(r => setTimeout(() => { console.log('Task 1'); r(1); }, 100)),
  () => new Promise(r => setTimeout(() => { console.log('Task 2'); r(2); }, 50)),
  () => new Promise(r => setTimeout(() => { console.log('Task 3'); r(3); }, 75))
];

runSeriesBeginner(tasks).then(results => {
  console.log('Results:', results); // [1, 2, 3]
});


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: With error handling and callbacks
 */
async function runSeriesIntermediate(tasks, options = {}) {
  const {
    continueOnError = false,
    onProgress = null,
    onError = null
  } = options;
  
  const results = [];
  const errors = [];
  
  for (let i = 0; i < tasks.length; i++) {
    try {
      const result = await tasks[i]();
      results.push({ status: 'fulfilled', value: result, index: i });
      
      onProgress?.({
        completed: i + 1,
        total: tasks.length,
        result,
        progress: (i + 1) / tasks.length
      });
      
    } catch (error) {
      errors.push({ index: i, error });
      results.push({ status: 'rejected', reason: error, index: i });
      
      onError?.({ index: i, error });
      
      if (!continueOnError) {
        throw error;
      }
    }
  }
  
  return { results, errors, hasErrors: errors.length > 0 };
}

/**
 * Intermediate: Using reduce (functional style)
 */
function runSeriesReduce(tasks) {
  return tasks.reduce(
    (promiseChain, task) => promiseChain.then(results =>
      task().then(result => [...results, result])
    ),
    Promise.resolve([])
  );
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const mixedTasks = [
  () => Promise.resolve(1),
  () => Promise.reject(new Error('Task 2 failed')),
  () => Promise.resolve(3)
];

runSeriesIntermediate(mixedTasks, {
  continueOnError: true,
  onProgress: ({ completed, total }) => console.log(`Progress: ${completed}/${total}`),
  onError: ({ index, error }) => console.log(`Error at ${index}: ${error.message}`)
}).then(({ results, hasErrors }) => {
  console.log('Results:', results);
  console.log('Has errors:', hasErrors);
});


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Waterfall - pass result of each task to next
 */
async function waterfall(tasks, initialValue) {
  let result = initialValue;
  
  for (const task of tasks) {
    result = await task(result);
  }
  
  return result;
}

/**
 * Expert: Series with timeout per task
 */
async function runSeriesWithTimeout(tasks, timeoutMs) {
  const results = [];
  
  for (let i = 0; i < tasks.length; i++) {
    const result = await Promise.race([
      tasks[i](),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Task ${i} timed out`)), timeoutMs)
      )
    ]);
    results.push(result);
  }
  
  return results;
}

/**
 * Expert: Series with retry
 */
async function runSeriesWithRetry(tasks, options = {}) {
  const { retries = 3, retryDelay = 1000 } = options;
  const results = [];
  
  for (let i = 0; i < tasks.length; i++) {
    let lastError;
    let attempts = 0;
    
    while (attempts <= retries) {
      try {
        const result = await tasks[i]();
        results.push(result);
        break;
      } catch (error) {
        lastError = error;
        attempts++;
        
        if (attempts > retries) {
          throw new Error(`Task ${i} failed after ${retries} retries: ${error.message}`);
        }
        
        await new Promise(r => setTimeout(r, retryDelay));
      }
    }
  }
  
  return results;
}

/**
 * Expert: Concurrent with limit (pool)
 */
async function runConcurrent(tasks, limit = 3) {
  const results = new Array(tasks.length);
  let currentIndex = 0;
  let completedCount = 0;
  
  return new Promise((resolve, reject) => {
    function runNext() {
      const index = currentIndex++;
      
      if (index >= tasks.length) {
        if (completedCount === tasks.length) {
          resolve(results);
        }
        return;
      }
      
      tasks[index]()
        .then(result => {
          results[index] = result;
          completedCount++;
          runNext();
        })
        .catch(reject);
    }
    
    // Start initial batch
    const initialBatch = Math.min(limit, tasks.length);
    for (let i = 0; i < initialBatch; i++) {
      runNext();
    }
    
    // Handle empty tasks
    if (tasks.length === 0) {
      resolve([]);
    }
  });
}

/**
 * Expert: Async iterator for streaming results
 */
async function* runSeriesIterator(tasks) {
  for (let i = 0; i < tasks.length; i++) {
    const result = await tasks[i]();
    yield { index: i, result, done: i === tasks.length - 1 };
  }
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Waterfall
const waterfallTasks = [
  (x) => Promise.resolve(x + 1),
  (x) => Promise.resolve(x * 2),
  (x) => Promise.resolve(x + 10)
];

waterfall(waterfallTasks, 5).then(result => {
  console.log('Waterfall result:', result); // ((5 + 1) * 2) + 10 = 22
});

// Concurrent with limit
const concurrentTasks = Array(10).fill(null).map((_, i) => 
  () => new Promise(r => {
    console.log(`Starting task ${i}`);
    setTimeout(() => {
      console.log(`Completing task ${i}`);
      r(i);
    }, Math.random() * 200);
  })
);

runConcurrent(concurrentTasks, 3).then(results => {
  console.log('Concurrent results:', results);
});

// Iterator usage
async function runDemoIterator() {
  const tasks = [
    () => Promise.resolve('a'),
    () => Promise.resolve('b'),
    () => Promise.resolve('c')
  ];
  
  for await (const { index, result } of runSeriesIterator(tasks)) {
    console.log(`Iterator - Task ${index}: ${result}`);
  }
}

runDemoIterator();


// ============================================
// ADVANCED PATTERNS
// ============================================

console.log('\n=== ADVANCED PATTERNS ===');

/**
 * Task Queue class
 */
class TaskQueue {
  constructor(options = {}) {
    this.concurrency = options.concurrency || 1;
    this.tasks = [];
    this.running = 0;
    this.paused = false;
    this.results = [];
    this.onComplete = null;
  }
  
  add(...tasks) {
    this.tasks.push(...tasks.map((task, i) => ({
      fn: task,
      index: this.results.length + i
    })));
    this.results.push(...tasks.map(() => null));
    this._process();
    return this;
  }
  
  async _process() {
    if (this.paused) return;
    
    while (this.running < this.concurrency && this.tasks.length > 0) {
      const task = this.tasks.shift();
      this.running++;
      
      try {
        const result = await task.fn();
        this.results[task.index] = { status: 'fulfilled', value: result };
      } catch (error) {
        this.results[task.index] = { status: 'rejected', reason: error };
      }
      
      this.running--;
      
      if (this.tasks.length > 0) {
        this._process();
      } else if (this.running === 0) {
        this.onComplete?.(this.results);
      }
    }
  }
  
  pause() {
    this.paused = true;
    return this;
  }
  
  resume() {
    this.paused = false;
    this._process();
    return this;
  }
  
  wait() {
    return new Promise(resolve => {
      if (this.tasks.length === 0 && this.running === 0) {
        resolve(this.results);
      } else {
        this.onComplete = resolve;
      }
    });
  }
}

// Usage
const queue = new TaskQueue({ concurrency: 2 });
queue.add(
  () => Promise.resolve(1),
  () => Promise.resolve(2),
  () => Promise.resolve(3)
);

queue.wait().then(results => {
  console.log('Queue results:', results);
});


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * Series: for await...of / reduce
 * Waterfall: Pass result to next task
 * Concurrent: Control parallelism with pool
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Show async/await approach first
 * 2. Explain difference from Promise.all
 * 3. Discuss error handling strategies
 * 4. Mention waterfall pattern
 * 
 * PATTERNS:
 * ---------
 * - for...of with await: Simple series
 * - reduce: Functional series
 * - Worker pool: Controlled concurrency
 * - Iterator: Streaming results
 */


module.exports = {
  runSeriesBeginner,
  runSeriesIntermediate,
  runSeriesReduce,
  waterfall,
  runSeriesWithTimeout,
  runSeriesWithRetry,
  runConcurrent,
  runSeriesIterator,
  TaskQueue
};
