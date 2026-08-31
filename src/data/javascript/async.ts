import type { Topic } from '../../types';

export const asyncTopics: Topic[] = [
  {
    id: 'js-async',
    title: 'Asynchronous JavaScript',
    description:
      'Master the event loop, promises, async/await, and the concurrency model that powers modern JavaScript applications.',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    tags: [
      'async',
      'promises',
      'event-loop',
      'callbacks',
      'async-await',
      'microtasks',
      'macrotasks',
      'concurrency',
    ],
    overview:
      'Asynchronous JavaScript is the backbone of non-blocking I/O in the browser and Node.js. Understanding the event loop, task queues, and promise mechanics is essential for writing performant, bug-free code and is one of the most frequently tested areas in JavaScript interviews. This topic covers everything from basic callbacks through advanced promise combinators and the nuances of microtask vs macrotask scheduling.',
    concepts: [
      'Event Loop',
      'Call Stack',
      'Callback Queue (Task Queue)',
      'Microtask Queue',
      'Macrotask Queue',
      'Web APIs',
      'Callbacks',
      'Promises',
      'Promise Chaining',
      'async/await',
      'Promise.all',
      'Promise.allSettled',
      'Promise.race',
      'Promise.any',
      'Error Handling in Async Code',
      'Callback Hell',
      'Synchronous vs Asynchronous Execution',
    ],
    questions: [
      {
        id: 'js-async-1',
        question: 'What is the event loop? How does it work?',
        answer:
          'The event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously monitors the call stack and the task queues, and whenever the call stack is empty, it picks the next task from the queue and pushes it onto the stack for execution.\n\nThe event loop operates in a cycle: first, it executes all synchronous code on the call stack until the stack is empty. Then, it drains the entire microtask queue (promises, queueMicrotask, MutationObserver callbacks). After all microtasks are processed, it picks one macrotask (setTimeout, setInterval, I/O callbacks, UI rendering events) from the macrotask queue and pushes it onto the call stack. Once that macrotask completes and the call stack is empty again, the microtask queue is drained once more before the next macrotask is picked up.\n\nBetween macrotask executions the browser may also run rendering steps (style calculation, layout, paint) if needed, which is why long-running synchronous code blocks UI updates. The event loop ensures that the main thread is never idle when there is work to do, but it also means that a single long-running task can starve all pending callbacks and freeze the UI.\n\nThis architecture is fundamentally different from multi-threaded concurrency models. Instead of parallel execution, JavaScript achieves concurrency through cooperative scheduling — each task runs to completion before the next one begins. Understanding this model is crucial for predicting execution order and avoiding common pitfalls like starvation and race conditions.',
        shortAnswer:
          'The event loop is a continuous cycle that monitors the call stack and task queues. When the call stack is empty, it first drains all microtasks, then picks one macrotask to execute. This enables non-blocking behavior in single-threaded JavaScript.',
        code: '// Visualization of event loop priority\nconsole.log("1: Synchronous");\n\nsetTimeout(() => {\n  console.log("2: Macrotask (setTimeout)");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log("3: Microtask (Promise)");\n});\n\nconsole.log("4: Synchronous");\n\n// Output:\n// 1: Synchronous\n// 4: Synchronous\n// 3: Microtask (Promise)\n// 2: Macrotask (setTimeout)',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['event-loop', 'call-stack', 'task-queue', 'microtasks', 'macrotasks'],
        commonMistakes: [
          'Assuming setTimeout(fn, 0) runs immediately — it is a macrotask and always yields to microtasks first.',
          'Forgetting that the microtask queue is fully drained before any macrotask runs, which can cause starvation if microtasks keep enqueuing more microtasks.',
          'Believing that the event loop creates parallelism — JavaScript is still single-threaded; concurrency comes from cooperative scheduling.',
        ],
        followUps: [
          'How does requestAnimationFrame fit into the event loop cycle?',
          'What happens if a microtask enqueues another microtask indefinitely?',
          'How does the event loop differ in Web Workers?',
        ],
        interviewTips: [
          'Draw the event loop diagram (call stack, Web APIs, microtask queue, macrotask queue) on a whiteboard to demonstrate understanding.',
          'Use a concrete code example with setTimeout and Promise to walk through execution order step-by-step.',
        ],
      },
      {
        id: 'js-async-2',
        question: 'Explain the difference between the call stack and the task queue.',
        answer:
          'The call stack is a LIFO (Last In, First Out) data structure that tracks the execution context of function calls. Every time a function is invoked, a new frame is pushed onto the stack containing the function\'s arguments, local variables, and return address. When the function returns, its frame is popped off the stack. The call stack is where synchronous code executes, and JavaScript can only execute the code that is at the top of the stack.\n\nThe task queue (also called the callback queue or macrotask queue) is a FIFO (First In, First Out) queue that holds callbacks that are ready to be executed but are waiting for the call stack to become empty. Callbacks from setTimeout, setInterval, I/O operations, and UI events are placed into the task queue by Web APIs or the Node.js runtime once their triggering condition is met (e.g., timer expires, HTTP response arrives).\n\nThe critical relationship between them is mediated by the event loop: the event loop only dequeues a task from the task queue and pushes it onto the call stack when the call stack is completely empty and all microtasks have been processed. This means that even a setTimeout with a 0ms delay will not execute until all currently running synchronous code and all pending microtasks have completed.\n\nUnderstanding this distinction is essential for debugging timing issues. If you have heavy synchronous computation on the call stack, all callbacks in the task queue are blocked, leading to unresponsive UIs and missed timer deadlines. This is why breaking up large computations with techniques like chunking or Web Workers is important for responsive applications.',
        shortAnswer:
          'The call stack is a LIFO structure where synchronous code executes. The task queue is a FIFO queue holding async callbacks waiting for the call stack to empty. The event loop moves tasks from the queue to the stack only when the stack is clear and all microtasks are drained.',
        code: 'function main() {\n  console.log("Start");\n\n  setTimeout(() => {\n    console.log("Timeout callback"); // Waits in task queue\n  }, 0);\n\n  function compute() {\n    // This runs on the call stack\n    for (let i = 0; i < 3; i++) {\n      console.log(`Computing ${i}`);\n    }\n  }\n\n  compute();\n  console.log("End");\n}\n\nmain();\n// Output:\n// Start\n// Computing 0\n// Computing 1\n// Computing 2\n// End\n// Timeout callback',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['call-stack', 'task-queue', 'event-loop'],
        commonMistakes: [
          'Confusing the task queue with the microtask queue — they are separate queues with different priorities.',
          'Assuming the call stack can hold multiple executing functions simultaneously — only the topmost frame is actively executing.',
          'Thinking setTimeout(fn, 0) guarantees immediate execution after the current line.',
        ],
        followUps: [
          'What is a stack overflow and how does it relate to the call stack?',
          'How does tail call optimization affect the call stack?',
          'What is the maximum call stack size in modern browsers?',
        ],
        interviewTips: [
          'Trace through a code example showing how the call stack grows and shrinks with nested function calls while a setTimeout callback waits in the task queue.',
        ],
      },
      {
        id: 'js-async-3',
        question: "What are microtasks and macrotasks? What's the priority?",
        answer:
          'Microtasks and macrotasks are two categories of asynchronous tasks that are scheduled in separate queues and processed with different priorities by the event loop. Microtasks include Promise callbacks (.then, .catch, .finally), queueMicrotask callbacks, and MutationObserver callbacks. Macrotasks include setTimeout, setInterval, setImmediate (Node.js), I/O callbacks, and UI rendering events.\n\nThe priority rule is simple but crucial: microtasks always have higher priority than macrotasks. After the call stack becomes empty, the event loop first drains the entire microtask queue — processing every pending microtask, including any new microtasks enqueued during processing — before picking the next macrotask. This means that if a Promise callback enqueues another Promise callback, both will run before any setTimeout callback, even if the setTimeout was scheduled first.\n\nThis priority difference has practical implications. Because the microtask queue is fully drained before any macrotask or rendering step, a tight loop of microtasks can starve macrotasks and block rendering. For example, a recursive chain of Promise.resolve().then(() => ...) that never terminates will freeze the browser just as effectively as an infinite synchronous loop. Conversely, this priority ensures that Promise-based code has predictable and immediate scheduling, which is why async/await feels more sequential than callback-based patterns.\n\nIn Node.js, the picture is slightly more complex. Node uses libuv, which has multiple phases (timers, pending callbacks, poll, check, close) and process.nextTick callbacks are processed before other microtasks. Understanding these priorities is key to predicting execution order in both browser and server environments.',
        shortAnswer:
          'Microtasks (Promises, queueMicrotask) have higher priority than macrotasks (setTimeout, setInterval, I/O). The event loop fully drains the microtask queue after each call stack clearance before processing the next macrotask. This ensures Promise callbacks run before any pending timers or I/O callbacks.',
        code: 'console.log("Script start");\n\nsetTimeout(() => console.log("setTimeout 1"), 0);\nsetTimeout(() => console.log("setTimeout 2"), 0);\n\nPromise.resolve()\n  .then(() => {\n    console.log("Promise 1");\n    // Enqueue another microtask during microtask processing\n    Promise.resolve().then(() => console.log("Promise 3"));\n  })\n  .then(() => console.log("Promise 2"));\n\nconsole.log("Script end");\n\n// Output:\n// Script start\n// Script end\n// Promise 1\n// Promise 3\n// Promise 2\n// setTimeout 1\n// setTimeout 2',
        language: 'javascript',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['microtasks', 'macrotasks', 'event-loop', 'promises'],
        commonMistakes: [
          'Assuming microtasks and macrotasks share the same queue — they are distinct queues with different scheduling rules.',
          'Not realizing that microtasks enqueued during microtask processing run before the next macrotask, potentially causing infinite loops.',
          'Confusing process.nextTick (Node.js specific, runs before other microtasks) with queueMicrotask (standard, runs after nextTick).',
        ],
        followUps: [
          'Can you create an infinite microtask loop that freezes the browser? How?',
          'Where does requestAnimationFrame fit — microtask or macrotask?',
          'How does process.nextTick differ from Promise.resolve().then()?',
        ],
        interviewTips: [
          'Memorize the priority order: synchronous code > microtasks > macrotasks. Walk through examples using this ordering.',
          'Mention that requestAnimationFrame is neither a microtask nor a macrotask — it runs before the next repaint, after microtasks.',
        ],
      },
      {
        id: 'js-async-4',
        question: 'What are Promises? How do they work?',
        answer:
          'A Promise is an object representing the eventual completion or failure of an asynchronous operation. It serves as a placeholder for a value that is not yet available but will be resolved at some point in the future. Promises have three states: pending (initial state, neither fulfilled nor rejected), fulfilled (the operation completed successfully with a result value), and rejected (the operation failed with a reason, typically an error).\n\nWhen you create a Promise with `new Promise((resolve, reject) => { ... })`, the executor function runs synchronously and immediately. Inside the executor, you call resolve(value) to fulfill the promise or reject(reason) to reject it. Once a Promise transitions from pending to either fulfilled or rejected, it is settled and its state can never change again — Promises are immutable once settled. The resolve and reject functions can only be called once; subsequent calls are silently ignored.\n\nConsumers attach callbacks using .then(onFulfilled, onRejected), .catch(onRejected), and .finally(onSettled). These methods return new Promises, enabling chaining. The callbacks registered via .then and .catch are always executed asynchronously as microtasks, even if the Promise is already settled at the time of registration. This guarantees consistent, predictable ordering — you never get a synchronous callback from a .then handler, which prevents a class of bugs related to Zalgo (inconsistent sync/async behavior).\n\nPromises solved the fundamental problems of callback-based async code: inversion of control (you no longer pass your callback to a third-party function), composability (Promise combinators like Promise.all allow orchestration of multiple async operations), and standardized error propagation (rejected promises propagate through the chain until caught). They form the foundation on which async/await is built, as await is essentially syntactic sugar for .then chaining.',
        shortAnswer:
          'A Promise is an object representing an async operation that is pending, fulfilled, or rejected. Created with `new Promise((resolve, reject) => { })`, it becomes immutable once settled. Consumers use .then/.catch/.finally to handle results, and these callbacks always run as microtasks, enabling predictable chaining and error propagation.',
        code: 'function fetchUserData(userId: string): Promise<{ name: string; email: string }> {\n  return new Promise((resolve, reject) => {\n    // Executor runs synchronously\n    console.log("Fetching user...");\n\n    setTimeout(() => {\n      if (userId === "1") {\n        resolve({ name: "Alice", email: "alice@example.com" });\n      } else {\n        reject(new Error(`User ${userId} not found`));\n      }\n    }, 1000);\n  });\n}\n\nfetchUserData("1")\n  .then((user) => {\n    console.log(`Found: ${user.name}`);\n    return user.email;\n  })\n  .then((email) => {\n    console.log(`Email: ${email}`);\n  })\n  .catch((error: Error) => {\n    console.error(`Error: ${error.message}`);\n  })\n  .finally(() => {\n    console.log("Fetch complete");\n  });',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['promises', 'async', 'then', 'catch', 'finally'],
        commonMistakes: [
          'Forgetting that the Promise executor function runs synchronously — only the .then/.catch callbacks are deferred.',
          'Not returning values inside .then handlers, breaking the chain and resulting in undefined propagation.',
          'Creating a new Promise wrapping an existing Promise (known as the Promise constructor anti-pattern) instead of just returning the existing Promise.',
        ],
        followUps: [
          'What is the Promise constructor anti-pattern and how do you avoid it?',
          'How does Promise.resolve() differ from new Promise(resolve => resolve())?',
          'What happens if you throw an error inside a .then handler?',
        ],
        interviewTips: [
          'Emphasize the three states and the immutability of settled Promises — once fulfilled or rejected, the state never changes.',
          'Mention that .then callbacks are microtasks to show you understand the event loop integration.',
        ],
      },
      {
        id: 'js-async-5',
        question: 'Explain async/await and its relationship to Promises.',
        answer:
          'async/await is syntactic sugar built on top of Promises that allows you to write asynchronous code that reads like synchronous code. An async function always returns a Promise — if you return a plain value, it is automatically wrapped in Promise.resolve(). The await keyword can only be used inside an async function (or at the top level of ES modules) and pauses the execution of the async function until the awaited Promise settles.\n\nWhen the JavaScript engine encounters an await expression, it does the following: if the value is a Promise, it registers a .then callback on that Promise and suspends the async function, returning control to the caller. The rest of the function body after the await is essentially the .then callback. When the Promise resolves, the async function resumes execution with the resolved value. If the Promise rejects, the await expression throws the rejection reason, which can be caught with try/catch.\n\nThis transformation is important to understand because it explains the execution order. Code before the first await in an async function runs synchronously. The moment an await is hit, the function yields and the caller continues. This is why calling an async function does not block — it returns a Promise immediately. The remainder of the function is scheduled as microtasks, just like .then callbacks.\n\nThe main advantages over raw Promise chains are readability, debuggability (stack traces are cleaner), and natural error handling with try/catch/finally instead of .catch chains. However, a common pitfall is unnecessary sequential awaiting — using `await a(); await b()` when a and b are independent, which wastes time. In such cases, `await Promise.all([a(), b()])` runs both concurrently. Understanding that async/await is just Promises under the hood helps you avoid these performance traps and write more efficient async code.',
        shortAnswer:
          'async/await is syntactic sugar over Promises. An async function always returns a Promise, and await pauses execution until the awaited Promise settles. Code after await becomes a microtask (.then callback under the hood). It enables writing async code with synchronous-looking syntax and try/catch error handling.',
        code: '// Promise chain version\nfunction loadUserPromise(id: string) {\n  return fetch(`/api/users/${id}`)\n    .then((res) => res.json())\n    .then((user) => fetch(`/api/posts?userId=${user.id}`))\n    .then((res) => res.json())\n    .catch((err) => console.error(err));\n}\n\n// async/await equivalent\nasync function loadUserAsync(id: string) {\n  try {\n    const userRes = await fetch(`/api/users/${id}`);\n    const user = await userRes.json();\n    const postsRes = await fetch(`/api/posts?userId=${user.id}`);\n    return await postsRes.json();\n  } catch (err) {\n    console.error(err);\n  }\n}\n\n// Parallel execution with async/await\nasync function loadDashboard(userId: string) {\n  const [user, notifications, settings] = await Promise.all([\n    fetchUser(userId),\n    fetchNotifications(userId),\n    fetchSettings(userId),\n  ]);\n  return { user, notifications, settings };\n}',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['async-await', 'promises', 'error-handling'],
        commonMistakes: [
          'Sequentially awaiting independent Promises instead of using Promise.all for concurrent execution.',
          'Forgetting that an async function always returns a Promise, even if you return a plain value.',
          'Using await inside a forEach loop — forEach does not await async callbacks. Use for...of or Promise.all with map instead.',
        ],
        followUps: [
          'What happens if you forget to await an async function call?',
          'How do you handle errors from Promise.all when using async/await?',
          'Can you use await at the top level of a script? What are the requirements?',
        ],
        interviewTips: [
          'Show you understand the performance implication by contrasting sequential awaits with Promise.all for independent operations.',
          'Mention that async/await and .then are interchangeable — knowing when to use each shows mastery.',
        ],
      },
      {
        id: 'js-async-6',
        question: 'What is promise chaining?',
        answer:
          'Promise chaining is the technique of connecting multiple asynchronous operations in sequence by returning new Promises from .then handlers. Because .then always returns a new Promise, each .then in the chain receives the resolved value of the previous one, creating a flat, readable pipeline of async transformations.\n\nThe key mechanism is the return value inside a .then callback. If you return a plain value, the next .then receives that value immediately (wrapped in a resolved Promise). If you return a Promise, the chain waits for that Promise to settle before proceeding to the next .then. If you throw an error or return a rejected Promise, the chain skips subsequent .then handlers and jumps to the nearest .catch. After a .catch, the chain can continue with further .then handlers because .catch also returns a new Promise.\n\nPromise chaining solved the "callback hell" problem by flattening deeply nested callbacks into a linear sequence. Instead of nesting callbacks inside callbacks, each step is a .then in a flat chain. Error handling is also centralized — a single .catch at the end can handle errors from any step in the chain, though you can also place .catch handlers at intermediate points for recovery logic.\n\nA common mistake is forgetting to return the Promise inside a .then handler, which breaks the chain. Without a return, the next .then receives undefined instead of the async result, and worse, any errors from the un-returned Promise become unhandled rejections. Understanding this return behavior is essential for writing correct Promise chains and is the main reason async/await was introduced — it makes the implicit returns explicit.',
        shortAnswer:
          'Promise chaining links multiple async operations by returning values or Promises from .then handlers. Each .then returns a new Promise, allowing a flat pipeline where errors propagate to the nearest .catch. Forgetting to return inside .then is the most common mistake that breaks chains.',
        code: 'function getUser(id: number): Promise<{ id: number; name: string }> {\n  return fetch(`/api/users/${id}`).then((res) => res.json());\n}\n\nfunction getPosts(userId: number): Promise<{ title: string }[]> {\n  return fetch(`/api/users/${userId}/posts`).then((res) => res.json());\n}\n\nfunction getComments(postTitle: string): Promise<string[]> {\n  return fetch(`/api/comments?post=${postTitle}`).then((res) => res.json());\n}\n\n// Chaining dependent async operations\ngetUser(1)\n  .then((user) => {\n    console.log(`User: ${user.name}`);\n    return getPosts(user.id); // Return Promise to continue chain\n  })\n  .then((posts) => {\n    console.log(`First post: ${posts[0].title}`);\n    return getComments(posts[0].title); // Another dependent call\n  })\n  .then((comments) => {\n    console.log(`Comments: ${comments.length}`);\n  })\n  .catch((error: Error) => {\n    // Catches errors from ANY step in the chain\n    console.error(`Failed: ${error.message}`);\n  });',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['promises', 'chaining', 'then', 'catch'],
        commonMistakes: [
          'Not returning the Promise inside .then, which breaks the chain and causes the next .then to receive undefined.',
          'Nesting .then handlers inside each other instead of chaining them flat, recreating callback hell with Promises.',
          'Placing .catch before .then handlers that should also be error-guarded — .catch only handles errors from preceding steps.',
        ],
        followUps: [
          'How do you recover from an error mid-chain and continue processing?',
          'What is the difference between .then(onFulfilled, onRejected) and .then(onFulfilled).catch(onRejected)?',
          'How does returning a thenable (non-Promise with a .then method) affect the chain?',
        ],
        interviewTips: [
          'Emphasize that the return value inside .then determines what the next .then receives — this is the most common source of bugs in Promise code.',
        ],
      },
      {
        id: 'js-async-7',
        question:
          'Compare Promise.all, Promise.allSettled, Promise.race, and Promise.any. When would you use each?',
        answer:
          'These four Promise combinators serve different orchestration needs when working with multiple concurrent Promises.\n\nPromise.all takes an iterable of Promises and returns a single Promise that fulfills with an array of all results when every input Promise fulfills. If any single Promise rejects, Promise.all immediately rejects with that rejection reason, and the results of already-fulfilled Promises are discarded. Use it when all operations must succeed for the result to be meaningful — such as loading all required data for a dashboard, where a partial load is unacceptable.\n\nPromise.allSettled takes the same input but never short-circuits. It waits for every Promise to settle (fulfill or reject) and returns an array of objects with `{ status: "fulfilled", value }` or `{ status: "rejected", reason }`. Use it when you need results from all operations regardless of individual failures — such as batch processing where you want to know which items succeeded and which failed.\n\nPromise.race returns a Promise that settles with the result of whichever input Promise settles first, whether fulfilled or rejected. Use it for timeout patterns (racing an operation against a timer), caching strategies (race network vs cache), or any scenario where the fastest response wins. Be careful: the losing Promises still execute to completion — they are not cancelled.\n\nPromise.any (ES2021) returns a Promise that fulfills with the value of the first input Promise that fulfills. It ignores rejections unless all Promises reject, in which case it rejects with an AggregateError containing all rejection reasons. Use it when you need at least one success from multiple sources — such as trying multiple API endpoints or CDN mirrors and using whichever responds first successfully.',
        shortAnswer:
          'Promise.all resolves when all succeed, rejects on first failure. Promise.allSettled waits for all to settle regardless of outcome. Promise.race settles with the first to settle (success or failure). Promise.any resolves with the first success, rejects only if all fail with an AggregateError.',
        code: 'const fast = new Promise((resolve) => setTimeout(() => resolve("fast"), 100));\nconst slow = new Promise((resolve) => setTimeout(() => resolve("slow"), 500));\nconst fail = new Promise((_, reject) => setTimeout(() => reject(new Error("fail")), 200));\n\n// Promise.all — all must succeed\nPromise.all([fast, slow])\n  .then((results) => console.log("all:", results)); // ["fast", "slow"]\n\n// Promise.allSettled — wait for everything\nPromise.allSettled([fast, slow, fail])\n  .then((results) => console.log("allSettled:", results));\n// [\n//   { status: "fulfilled", value: "fast" },\n//   { status: "fulfilled", value: "slow" },\n//   { status: "rejected", reason: Error("fail") }\n// ]\n\n// Promise.race — first to settle wins\nPromise.race([fast, slow, fail])\n  .then((winner) => console.log("race:", winner)); // "fast"\n\n// Promise.any — first to fulfill wins\nPromise.any([fail, fast, slow])\n  .then((winner) => console.log("any:", winner)); // "fast"\n\n// Practical: timeout pattern with Promise.race\nfunction withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {\n  const timeout = new Promise<never>((_, reject) =>\n    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)\n  );\n  return Promise.race([promise, timeout]);\n}',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['promise-all', 'promise-race', 'promise-any', 'promise-allSettled', 'combinators'],
        commonMistakes: [
          'Using Promise.all when partial failures are acceptable — use Promise.allSettled instead to avoid losing successful results.',
          'Confusing Promise.race with Promise.any — race settles on the first result (even rejection), while any waits for the first fulfillment.',
          'Assuming Promise.race or Promise.any cancels the losing Promises — they continue executing in the background.',
        ],
        followUps: [
          'How would you implement a Promise.all polyfill?',
          'What is AggregateError and when is it thrown?',
          'How do you implement a concurrency limiter for running N promises at a time?',
        ],
        interviewTips: [
          'Know the exact short-circuit behavior: all rejects on first failure, any rejects only when all fail, race and allSettled never short-circuit based on only success or only failure.',
          'Have a practical use case ready for each combinator — timeout patterns for race, batch operations for allSettled.',
        ],
      },
      {
        id: 'js-async-8',
        question: 'What is callback hell? How can it be solved?',
        answer:
          'Callback hell (also called the "pyramid of doom") is a code pattern that emerges when multiple asynchronous operations depend on each other and are implemented using nested callbacks. Each subsequent operation is started inside the callback of the previous one, leading to deeply indented, hard-to-read, and difficult-to-maintain code. The deeper the nesting, the harder it becomes to follow the control flow, handle errors consistently, and add or remove steps.\n\nThe fundamental problems with callback hell go beyond aesthetics. Error handling is fragmented — each callback needs its own error check, and forgetting one creates silent failures. Control flow becomes implicit and entangled; adding a step in the middle of the chain requires restructuring all subsequent nesting levels. Testing individual steps is also difficult because they are tightly coupled through closure scoping rather than explicit data passing.\n\nThere are several solutions. First, Promises flatten the pyramid into a linear chain of .then calls, where each step explicitly returns its result to the next. Error handling is centralized with .catch. Second, async/await takes this further by making asynchronous code look and behave like synchronous code, with try/catch for error handling and natural control flow (if/else, loops). Third, named functions can break apart deeply nested callbacks into smaller, reusable functions that are composed together.\n\nModular architecture also helps: libraries like async.js (for callbacks) or RxJS (for reactive streams) provide higher-level abstractions for common patterns like sequential execution, parallel execution, and error-first callbacks. In modern JavaScript, the standard approach is async/await, which completely eliminates the nesting problem while preserving readability.',
        shortAnswer:
          'Callback hell is deeply nested callbacks from sequential async operations, creating unreadable "pyramid of doom" code. It is solved by Promises (flat .then chains), async/await (synchronous-looking syntax), named functions (breaking apart nested callbacks), or higher-level abstractions like RxJS.',
        code: '// Callback hell — deeply nested, hard to read\ngetUser(userId, (err, user) => {\n  if (err) return handleError(err);\n  getOrders(user.id, (err, orders) => {\n    if (err) return handleError(err);\n    getOrderDetails(orders[0].id, (err, details) => {\n      if (err) return handleError(err);\n      getShippingStatus(details.trackingId, (err, status) => {\n        if (err) return handleError(err);\n        console.log(status);\n      });\n    });\n  });\n});\n\n// Solution: async/await — flat, readable, proper error handling\nasync function getShippingInfo(userId: string) {\n  try {\n    const user = await getUser(userId);\n    const orders = await getOrders(user.id);\n    const details = await getOrderDetails(orders[0].id);\n    const status = await getShippingStatus(details.trackingId);\n    console.log(status);\n  } catch (err) {\n    handleError(err);\n  }\n}',
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['callbacks', 'callback-hell', 'promises', 'async-await', 'code-quality'],
        commonMistakes: [
          'Recreating callback hell with Promises by nesting .then inside .then instead of chaining them flat.',
          'Using async/await but wrapping everything in a new Promise unnecessarily (the Promise constructor anti-pattern).',
          'Ignoring error handling when refactoring from callbacks — each approach has its own error propagation mechanism.',
        ],
        followUps: [
          'What is the "inversion of control" problem with callbacks?',
          'How do error-first callbacks work in Node.js?',
          'Can you have "Promise hell"? How would it look?',
        ],
        interviewTips: [
          'Show the before (callback hell) and after (async/await) side-by-side to demonstrate the readability improvement.',
        ],
      },
      {
        id: 'js-async-9',
        question:
          'Predict the output: setTimeout vs Promise vs console.log',
        answer:
          'The output is:\n\n```\nStart\nEnd\nPromise 1\nPromise 2\nsetTimeout 1\nsetTimeout 2\n```\n\nThis order follows from the event loop\'s priority system. First, all synchronous code on the call stack runs to completion: "Start" and "End" are logged. During this synchronous execution, setTimeout callbacks are registered as macrotasks in the task queue and Promise.resolve().then() callbacks are registered as microtasks in the microtask queue.\n\nOnce the call stack is empty, the event loop drains the entire microtask queue before processing any macrotask. "Promise 1" runs first (microtask), and during its execution no new microtasks are queued, so "Promise 2" runs next (it was already queued). After the microtask queue is empty, the event loop picks the first macrotask: "setTimeout 1". After that macrotask completes and the microtask queue is checked (it is empty), the next macrotask runs: "setTimeout 2".\n\nThe key insight is that the delay value of 0 in setTimeout does not mean "run immediately" — it means "add to the macrotask queue as soon as possible, but only after the minimum delay." Macrotasks always wait for all microtasks to complete before executing.',
        shortAnswer:
          'Output: Start, End, Promise 1, Promise 2, setTimeout 1, setTimeout 2. Synchronous code runs first, then all microtasks (Promises) are drained, and finally macrotasks (setTimeout) execute in order.',
        explanation:
          'Step 1: console.log("Start") executes synchronously → prints "Start".\nStep 2: setTimeout(() => log("setTimeout 1"), 0) — registers callback as a macrotask. The 0ms delay means it is eligible immediately, but it goes to the macrotask queue, not the call stack.\nStep 3: Promise.resolve().then(() => log("Promise 1")) — the Promise is already resolved, so the .then callback is immediately queued as a microtask.\nStep 4: setTimeout(() => log("setTimeout 2"), 0) — another macrotask registered.\nStep 5: Promise.resolve().then(() => log("Promise 2")) — another microtask queued.\nStep 6: console.log("End") executes synchronously → prints "End".\nStep 7: Call stack is now empty. Event loop checks the microtask queue.\nStep 8: Microtask "Promise 1" is dequeued and executed → prints "Promise 1".\nStep 9: Microtask "Promise 2" is dequeued and executed → prints "Promise 2".\nStep 10: Microtask queue is empty. Event loop picks the first macrotask.\nStep 11: Macrotask "setTimeout 1" executes → prints "setTimeout 1".\nStep 12: Microtask queue checked (empty). Next macrotask picked.\nStep 13: Macrotask "setTimeout 2" executes → prints "setTimeout 2".',
        code: 'console.log("Start");\n\nsetTimeout(() => {\n  console.log("setTimeout 1");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log("Promise 1");\n});\n\nsetTimeout(() => {\n  console.log("setTimeout 2");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log("Promise 2");\n});\n\nconsole.log("End");',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Scenario',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['event-loop', 'output-prediction', 'microtasks', 'macrotasks', 'setTimeout'],
        commonMistakes: [
          'Thinking setTimeout(fn, 0) runs before Promises because it was registered first — microtasks always have priority.',
          'Expecting interleaved output (setTimeout 1, Promise 1, setTimeout 2, Promise 2) — all microtasks drain before any macrotask.',
          'Forgetting that console.log("End") runs before any async callback because synchronous code always completes first.',
        ],
        followUps: [
          'What would change if we used queueMicrotask instead of Promise.resolve().then?',
          'What if one of the setTimeout calls had a delay of 1000ms?',
        ],
        interviewTips: [
          'Narrate the execution order by categorizing each operation: synchronous, microtask, or macrotask — then process them in that priority order.',
        ],
      },
      {
        id: 'js-async-10',
        question:
          'Predict the output: nested setTimeout and Promise',
        answer:
          'The output is:\n\n```\n1\n7\n2\n3\n5\n4\n6\n```\n\nThis question tests understanding of how microtasks enqueued inside macrotasks are handled and how nesting affects execution order.\n\nFirst, all synchronous code runs: "1" and "7" are printed. During synchronous execution, a setTimeout (macrotask) and a Promise.then (microtask logging "2") are scheduled. The microtask queue is drained: "2" is printed. Inside that microtask, another microtask logging "3" is enqueued. The microtask queue is drained again: "3" is printed. Now the microtask queue is empty.\n\nThe event loop picks the first macrotask (the outer setTimeout). Inside it, "4" would be the last thing logged in this macrotask, but first a Promise.then logging "5" is scheduled (microtask) and a nested setTimeout logging "6" is scheduled (new macrotask). The synchronous part of the macrotask runs: "4" is not yet logged — actually, looking at the code structure, "5" is enqueued as a microtask, "6" is enqueued as a macrotask, and then "4" is logged synchronously. After the macrotask\'s synchronous code completes, the microtask queue is drained: "5" is printed. Then the next macrotask (the nested setTimeout) runs: "6" is printed.',
        shortAnswer:
          'Output: 1, 7, 2, 3, 5, 4, 6. Synchronous code first (1, 7), then microtasks drain (2, then 3 which was enqueued by 2), then the macrotask runs logging 4 with its microtask 5 draining before the nested macrotask 6 runs.',
        explanation:
          'Step 1: console.log(1) → prints "1" (synchronous).\nStep 2: setTimeout callback [logs 4, enqueues Promise for 5, enqueues setTimeout for 6] registered as Macrotask A.\nStep 3: Promise.resolve().then [logs 2, enqueues Promise for 3] registered as Microtask A.\nStep 4: console.log(7) → prints "7" (synchronous).\nStep 5: Call stack empty. Drain microtask queue.\nStep 6: Microtask A runs → prints "2". Enqueues Microtask B (logs 3).\nStep 7: Microtask B runs → prints "3". Microtask queue now empty.\nStep 8: Event loop picks Macrotask A (outer setTimeout).\nStep 9: Inside Macrotask A: Promise.resolve().then [logs 5] enqueued as Microtask C.\nStep 10: Inside Macrotask A: setTimeout [logs 6] enqueued as Macrotask B.\nStep 11: Inside Macrotask A: console.log(4) → prints "4" (synchronous part of macrotask).\nStep 12: Macrotask A completes. Drain microtask queue.\nStep 13: Microtask C runs → prints "5". Microtask queue now empty.\nStep 14: Event loop picks Macrotask B (nested setTimeout).\nStep 15: console.log(6) → prints "6".\nFinal output: 1, 7, 2, 3, 4, 5, 6.',
        code: 'console.log(1);\n\nsetTimeout(() => {\n  Promise.resolve().then(() => {\n    console.log(5);\n  });\n  setTimeout(() => {\n    console.log(6);\n  }, 0);\n  console.log(4);\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log(2);\n  Promise.resolve().then(() => {\n    console.log(3);\n  });\n});\n\nconsole.log(7);',
        language: 'javascript',
        difficulty: 'Advanced',
        type: 'Scenario',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['event-loop', 'output-prediction', 'nested-async', 'microtasks', 'macrotasks'],
        commonMistakes: [
          'Forgetting that microtasks enqueued inside a microtask run before the next macrotask — the microtask queue is always fully drained.',
          'Not recognizing that code inside setTimeout is a new macrotask context with its own microtask drainage cycle.',
          'Getting confused by the nesting and losing track of which queue each callback belongs to.',
        ],
        followUps: [
          'What would the output be if you added another Promise.resolve().then inside the nested setTimeout?',
          'How would the output change if process.nextTick were used instead of Promise.resolve().then in Node.js?',
        ],
        interviewTips: [
          'Label each operation with its queue (sync, microtask, macrotask) and process them in the correct priority order within each event loop cycle.',
        ],
      },
      {
        id: 'js-async-11',
        question: "How does the browser's event loop differ from Node.js?",
        answer:
          "The browser and Node.js both implement the event loop concept but with significant architectural differences. The browser's event loop follows the HTML specification and has a relatively simple model: one call stack, one microtask queue, and one or more macrotask queues (browsers may prioritize certain task sources like user interactions over timers). Between macrotask executions, the browser may also run rendering steps (requestAnimationFrame, style calculation, layout, paint).\n\nNode.js uses libuv as its event loop implementation, which divides each iteration into distinct phases: timers (setTimeout/setInterval callbacks), pending callbacks (deferred I/O callbacks), idle/prepare (internal), poll (retrieve new I/O events and execute their callbacks), check (setImmediate callbacks), and close callbacks (socket.on('close')). Each phase has its own FIFO queue, and the event loop processes all callbacks in the current phase's queue before moving to the next phase.\n\nNode.js also has process.nextTick, which is unique to Node and runs before any other microtask (including Promise callbacks). This creates a priority hierarchy: synchronous code > process.nextTick > Promise microtasks > macrotasks. The setImmediate function in Node.js runs in the check phase, after the poll phase, which gives it different timing characteristics than setTimeout(fn, 0). The order between setTimeout(fn, 0) and setImmediate is actually non-deterministic when called from the main module, but setImmediate always runs first when called from within an I/O callback.\n\nIn practice, the main difference developers encounter is that Node.js provides more fine-grained control over scheduling through process.nextTick and setImmediate, while the browser provides requestAnimationFrame for rendering-synchronized work. Both environments process microtasks between macrotasks, but the internal phase structure of Node's event loop can produce different timing behavior for complex async patterns.",
        shortAnswer:
          "The browser's event loop follows the HTML spec with a simple microtask/macrotask model plus rendering steps. Node.js uses libuv with multiple phases (timers, poll, check, close) and adds process.nextTick (higher priority than Promise microtasks) and setImmediate (runs in the check phase).",
        code: '// Node.js specific behavior\n\n// process.nextTick runs before Promise microtasks\nprocess.nextTick(() => console.log("nextTick"));\nPromise.resolve().then(() => console.log("Promise"));\n// Output: nextTick, Promise\n\n// setImmediate vs setTimeout(fn, 0)\n// Order is non-deterministic from main module:\nsetTimeout(() => console.log("timeout"), 0);\nsetImmediate(() => console.log("immediate"));\n// Could be either order!\n\n// But inside I/O callback, setImmediate always runs first:\nconst fs = require("fs");\nfs.readFile(__filename, () => {\n  setTimeout(() => console.log("timeout"), 0);\n  setImmediate(() => console.log("immediate"));\n  // Always: immediate, timeout\n});',
        language: 'javascript',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['event-loop', 'nodejs', 'browser', 'libuv', 'process-nextTick', 'setImmediate'],
        commonMistakes: [
          'Assuming setTimeout(fn, 0) and setImmediate always execute in a fixed order — the order is non-deterministic from the main module in Node.js.',
          'Using process.nextTick in the browser — it does not exist in browser environments.',
          'Thinking the browser event loop has phases like Node.js — it uses a simpler microtask/macrotask model.',
        ],
        followUps: [
          'Why can recursive process.nextTick calls starve I/O in Node.js?',
          'How does the poll phase in Node.js decide when to move on?',
          'What are Worker Threads in Node.js and how do they relate to the event loop?',
        ],
        interviewTips: [
          'Mention the practical implications: knowing the difference helps debug timing issues in isomorphic/universal JavaScript applications.',
        ],
      },
      {
        id: 'js-async-12',
        question: 'What happens when you await a non-Promise value?',
        answer:
          'When you use await on a non-Promise value (such as a number, string, object, or any other non-thenable), JavaScript automatically wraps it in Promise.resolve(). The await expression then resolves immediately with that value on the next microtask tick. This means that even though the value is available synchronously, the code after the await is still deferred to the microtask queue.\n\nThis behavior has important implications for execution order. Consider `async function foo() { const x = await 42; console.log(x); }`. When foo() is called, everything up to the first await runs synchronously. The value 42 is wrapped in Promise.resolve(42), and the rest of the function (console.log(x)) is scheduled as a microtask. Control returns to the caller immediately. On the next microtask drain, the function resumes and logs 42.\n\nThis wrapping behavior also applies to thenables — objects with a .then method that are not actual Promise instances. If you await a thenable, JavaScript calls its .then method with resolve and reject callbacks, treating it as a Promise-like object. This interoperability allows async/await to work seamlessly with third-party Promise libraries and any object implementing the thenable protocol.\n\nFrom a performance perspective, awaiting a non-Promise value is essentially a no-op that adds an unnecessary microtask tick. In hot code paths, this can accumulate. However, the semantic guarantee of consistent asynchronous behavior (the function always yields at await, regardless of the value type) is usually more valuable than the marginal performance cost. Some JavaScript engines optimize this case to minimize overhead.',
        shortAnswer:
          'When you await a non-Promise value, JavaScript wraps it in Promise.resolve(), making the code after await run as a microtask on the next tick. The value resolves immediately, but execution still yields to the caller before resuming. This ensures consistent async behavior regardless of the value type.',
        code: 'async function example() {\n  console.log("Before await");\n  const result = await 42; // Wrapped in Promise.resolve(42)\n  console.log("After await:", result); // Runs as microtask\n}\n\nconsole.log("Start");\nexample();\nconsole.log("End");\n\n// Output:\n// Start\n// Before await\n// End\n// After await: 42\n\n// Thenable example\nconst thenable = {\n  then(resolve: (value: string) => void) {\n    console.log("thenable.then called");\n    resolve("thenable result");\n  },\n};\n\nasync function awaitThenable() {\n  const val = await thenable;\n  console.log(val); // "thenable result"\n}\n\nawaitThenable();',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['async-await', 'promises', 'thenable', 'microtasks'],
        commonMistakes: [
          'Assuming that await on a non-Promise value is completely synchronous — it still yields to the caller and resumes on the next microtask tick.',
          'Not knowing about thenable support — any object with a .then method can be awaited.',
          'Overusing await on synchronous values when it adds unnecessary microtask overhead in performance-critical code.',
        ],
        followUps: [
          'What happens if a thenable\'s .then method throws synchronously?',
          'Is there a performance difference between returning a value and returning Promise.resolve(value) in an async function?',
        ],
        interviewTips: [
          'Demonstrate understanding by showing that code after await always runs asynchronously, even when the awaited value is synchronous — this shows deep knowledge of the async function mechanics.',
        ],
      },
      {
        id: 'js-async-13',
        question: 'How do you handle errors in async/await?',
        answer:
          'Error handling in async/await primarily uses try/catch blocks, which map naturally to synchronous error handling patterns. When an awaited Promise rejects, the await expression throws the rejection reason as an exception, which can be caught by a surrounding try/catch. This is one of the major ergonomic improvements over .catch chains, as it uses the same error handling mechanism developers are already familiar with from synchronous code.\n\nFor granular error handling, you can wrap individual await expressions in their own try/catch blocks to handle specific failures differently. For coarse-grained handling, a single try/catch around multiple await expressions catches the first failure. You can also combine both: wrap a section of related operations in one try/catch and handle specific critical operations individually. The finally block works as expected, running cleanup code regardless of success or failure.\n\nAn alternative pattern avoids try/catch entirely by using a utility wrapper that returns a tuple of [error, result]. This is inspired by Go\'s error handling and avoids the nesting that try/catch introduces. Another approach is to add .catch directly to the Promise before awaiting it: `const result = await fetchData().catch(err => defaultValue)`. This is useful for providing fallback values without full try/catch blocks.\n\nCommon pitfalls include forgetting to handle errors at all (unhandled rejections crash Node.js processes), catching errors too broadly (swallowing unexpected errors), and not re-throwing errors when you only want to log them. In production code, you should always have a top-level error handler and use specific error types to distinguish between expected failures (API returns 404) and unexpected bugs (TypeError). The unhandledrejection event (browser) and process.on("unhandledRejection") (Node.js) serve as safety nets for uncaught async errors.',
        shortAnswer:
          'Use try/catch blocks around await expressions to catch rejected Promises. Use finally for cleanup. Alternative patterns include tuple-style [error, result] wrappers and inline .catch for fallback values. Always handle unhandled rejections globally as a safety net.',
        code: '// Standard try/catch\nasync function fetchUser(id: string) {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n    if (!response.ok) {\n      throw new Error(`HTTP ${response.status}`);\n    }\n    return await response.json();\n  } catch (error) {\n    if (error instanceof TypeError) {\n      console.error("Network error:", error.message);\n    } else if (error instanceof Error) {\n      console.error("Fetch error:", error.message);\n    }\n    return null;\n  } finally {\n    console.log("Fetch attempt completed");\n  }\n}\n\n// Tuple-style error handling (Go-inspired)\ntype Result<T> = [Error, null] | [null, T];\n\nasync function tryCatch<T>(promise: Promise<T>): Promise<Result<T>> {\n  try {\n    const data = await promise;\n    return [null, data];\n  } catch (error) {\n    return [error instanceof Error ? error : new Error(String(error)), null];\n  }\n}\n\nasync function loadDashboard() {\n  const [userErr, user] = await tryCatch(fetchUser("123"));\n  if (userErr) {\n    console.error("Failed to load user:", userErr.message);\n    return;\n  }\n\n  const [postsErr, posts] = await tryCatch(fetchPosts(user.id));\n  if (postsErr) {\n    console.error("Failed to load posts:", postsErr.message);\n  }\n}\n\n// Inline .catch for fallback values\nasync function getUserWithFallback(id: string) {\n  const user = await fetchUser(id).catch(() => ({ name: "Guest" }));\n  return user;\n}',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['error-handling', 'async-await', 'try-catch', 'promises'],
        commonMistakes: [
          'Catching errors too broadly without distinguishing between expected failures and bugs — use instanceof checks or custom error classes.',
          'Forgetting to add error handling entirely, leading to unhandled promise rejections that crash the Node.js process.',
          'Catching and silently swallowing errors without logging or re-throwing, making bugs invisible.',
        ],
        followUps: [
          'How does the unhandledrejection event work in browsers?',
          'What is the difference between throwing in an async function and calling reject in a Promise constructor?',
          'How do you handle errors when using Promise.all with async/await?',
        ],
        interviewTips: [
          'Show multiple error handling strategies and explain when each is appropriate — this demonstrates practical experience.',
          'Mention the global unhandled rejection handlers as a safety net to show production awareness.',
        ],
      },
      {
        id: 'js-async-14',
        question: 'What are Web APIs and how do they interact with the event loop?',
        answer:
          'Web APIs are interfaces provided by the browser (not the JavaScript engine itself) that handle operations which would otherwise block the single-threaded JavaScript runtime. They include the DOM API, fetch/XMLHttpRequest, setTimeout/setInterval, geolocation, Web Storage, Canvas, Web Workers, and many more. These APIs run outside the JavaScript call stack, often in separate threads managed by the browser, and communicate results back to JavaScript through the event loop\'s callback queues.\n\nThe interaction works as follows: when JavaScript calls a Web API function like setTimeout or fetch, the call is handed off to the browser\'s internal implementation. The JavaScript call stack does not wait — the function call returns immediately, and JavaScript continues executing the next line of code. The browser handles the actual work (waiting for the timer, making the HTTP request, etc.) in the background. When the work is complete, the browser places the associated callback into the appropriate queue: macrotask queue for setTimeout/setInterval/I/O callbacks, or microtask queue for Promise-based APIs like fetch.\n\nThis architecture is what enables JavaScript\'s non-blocking behavior. Without Web APIs, JavaScript would have to block on every I/O operation, timer, or network request, freezing the UI completely. Instead, the Web APIs act as a bridge between the single-threaded JavaScript world and the multi-threaded browser environment. For example, when you call fetch(), the browser\'s network stack (running on a separate thread) handles the HTTP request while your JavaScript code continues executing. When the response arrives, the browser wraps it in a Response object and resolves the Promise, placing the .then callback in the microtask queue.\n\nIn Node.js, the equivalent of Web APIs is provided by libuv and the C++ bindings, which handle file system operations, DNS lookups, networking, and child processes. The principle is the same: offload blocking work to the system and notify JavaScript through callbacks and the event loop.',
        shortAnswer:
          'Web APIs are browser-provided interfaces (setTimeout, fetch, DOM, etc.) that run outside the JS call stack, often on separate threads. They offload async work and place callbacks into the event loop queues when complete, enabling non-blocking I/O in single-threaded JavaScript.',
        code: '// How Web APIs interact with the event loop:\n\nconsole.log("1. Synchronous - runs on call stack");\n\n// setTimeout: handed off to the Timer Web API\nsetTimeout(() => {\n  console.log("4. Timer Web API completed - callback from macrotask queue");\n}, 1000);\n\n// fetch: handed off to the Network Web API\nfetch("https://api.example.com/data")\n  .then((response) => response.json())\n  .then((data) => {\n    console.log("3. Network Web API completed - callback from microtask queue");\n  });\n\n// DOM event: handled by the DOM Web API\ndocument.addEventListener("click", () => {\n  console.log("User clicked - event callback from macrotask queue");\n});\n\nconsole.log("2. Synchronous - still on call stack");\n\n// Flow:\n// 1. JS engine executes synchronous code on the call stack\n// 2. Async calls are delegated to Web APIs (browser threads)\n// 3. Web APIs do the work (timer counting, HTTP request, etc.)\n// 4. When done, Web APIs enqueue callbacks into the appropriate queue\n// 5. Event loop moves callbacks to the call stack when it is empty',
        language: 'javascript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['web-apis', 'event-loop', 'browser', 'non-blocking', 'async'],
        commonMistakes: [
          'Thinking setTimeout is part of the JavaScript language — it is a Web API provided by the browser or global API in Node.js, not defined in the ECMAScript specification.',
          'Assuming Web APIs run on the same thread as JavaScript — most Web APIs use separate browser threads for actual work.',
          'Confusing Web APIs with Web Workers — Web APIs are built-in browser interfaces, while Web Workers are user-created threads for running JavaScript code in parallel.',
        ],
        followUps: [
          'What is the difference between Web APIs and Web Workers?',
          'How does the Intersection Observer API use the event loop?',
          'Can you access the DOM from a Web Worker?',
        ],
        interviewTips: [
          'Draw the complete diagram showing the call stack, Web APIs box, microtask queue, and macrotask queue with arrows showing the flow to demonstrate how all pieces fit together.',
        ],
      },
      {
        id: 'js-async-15',
        question: 'Explain the difference between synchronous and asynchronous code.',
        answer:
          'Synchronous code executes sequentially, one statement at a time, in the order it appears. Each operation must complete before the next one begins. The call stack processes each function call to completion before moving on. This is the default execution model of JavaScript — when you write `const x = 1 + 2; console.log(x);`, the addition completes before console.log runs. If a synchronous operation takes a long time (e.g., a complex calculation or a blocking I/O call), the entire program halts until it finishes, including UI rendering and event handling.\n\nAsynchronous code allows operations to be initiated and then set aside while the program continues executing other code. When the async operation completes (a timer expires, a network response arrives, a file is read), a callback is placed in the event loop\'s queue and eventually executed when the call stack is free. This non-blocking behavior is essential for responsive applications — without it, a single network request could freeze a web page for seconds.\n\nThe key trade-off is between simplicity and responsiveness. Synchronous code is easier to reason about because execution order matches code order. Asynchronous code is harder to follow — the code that initiates an operation and the code that handles its result are separated in time and often in location. JavaScript has evolved its async patterns over time to make this easier: from callbacks (simple but nesting-prone) to Promises (composable and chainable) to async/await (reads like synchronous code but executes asynchronously).\n\nIn practice, you use synchronous code for computations, data transformations, and operations that are fast enough to not block the main thread. You use asynchronous code for I/O operations (network requests, file access, database queries), timers, user interaction handlers, and any operation that would block the main thread for a perceptible amount of time. Modern best practice is to keep synchronous work on the main thread short (under 50ms per task) and offload heavy computation to Web Workers.',
        shortAnswer:
          'Synchronous code executes sequentially, blocking until each operation completes. Asynchronous code initiates operations and continues execution, handling results later via callbacks, Promises, or async/await. Sync is simpler to reason about; async is essential for non-blocking I/O and responsive UIs.',
        code: '// Synchronous: blocks until complete\nfunction syncOperation() {\n  console.log("Step 1");\n  const data = heavyComputation(); // Blocks here until done\n  console.log("Step 2:", data);     // Runs only after computation\n  console.log("Step 3");\n}\n// Output: Step 1, Step 2: <result>, Step 3 (in exact order)\n\n// Asynchronous: non-blocking\nasync function asyncOperation() {\n  console.log("Step 1");\n  const dataPromise = fetch("/api/data"); // Initiates request, doesn\'t block\n  console.log("Step 2: request sent");     // Runs immediately\n  const response = await dataPromise;      // Yields until response arrives\n  const data = await response.json();\n  console.log("Step 3:", data);            // Runs after data arrives\n}\n\n// Demonstrating blocking vs non-blocking\nconsole.log("Before sync");\nfor (let i = 0; i < 1e9; i++) {} // Blocks the entire thread\nconsole.log("After sync — UI was frozen during the loop");\n\nconsole.log("Before async");\nsetTimeout(() => console.log("After async — UI remained responsive"), 1000);\nconsole.log("Continues immediately");',
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['synchronous', 'asynchronous', 'blocking', 'non-blocking', 'fundamentals'],
        commonMistakes: [
          'Thinking asynchronous means parallel — JavaScript is still single-threaded; async code runs on the same thread, just at a later time.',
          'Using synchronous file I/O (like fs.readFileSync in Node.js) in server request handlers, blocking all concurrent connections.',
          'Assuming async/await makes code synchronous — it makes async code look synchronous but the execution is still non-blocking under the hood.',
        ],
        followUps: [
          'When would you intentionally use synchronous code over asynchronous?',
          'How do Web Workers provide true parallelism in JavaScript?',
          'What is the 50ms budget rule for main thread tasks?',
        ],
        interviewTips: [
          'Frame the answer around the user experience impact — synchronous blocking freezes the UI, while async keeps it responsive.',
        ],
      },
      {
        id: 'js-async-16',
        question:
          'Predict the output: async function execution order with await',
        answer:
          'The output is:\n\n```\nstart\nasync1 start\nasync2\nend\nasync1 end\nsetTimeout\n```\n\nThis question tests how async functions interact with the synchronous call stack, microtask queue, and macrotask queue. The critical insight is that code before the first await in an async function runs synchronously, and code after await is scheduled as a microtask.\n\nFirst, "start" is logged synchronously. Then async1() is called. Inside async1, "async1 start" is logged synchronously. Then `await async2()` is encountered: async2() is called, which logs "async2" synchronously. Since async2 is an async function with no await, it returns a resolved Promise. The await in async1 sees this resolved Promise and schedules the rest of async1 (logging "async1 end") as a microtask. Control returns to the main script. setTimeout is registered as a macrotask. "end" is logged synchronously. The call stack is now empty. The microtask queue is drained: "async1 end" is printed. Finally, the macrotask runs: "setTimeout" is printed.',
        shortAnswer:
          'Output: start, async1 start, async2, end, async1 end, setTimeout. Code before await runs synchronously. The await suspends the async function and schedules the remainder as a microtask. Synchronous code in the caller runs next, then microtasks, then macrotasks.',
        explanation:
          'Step 1: console.log("start") → prints "start" (synchronous).\nStep 2: async1() is called. Execution enters async1.\nStep 3: Inside async1, console.log("async1 start") → prints "async1 start" (synchronous, before any await).\nStep 4: `await async2()` — first, async2() is called synchronously.\nStep 5: Inside async2, console.log("async2") → prints "async2" (synchronous).\nStep 6: async2 returns a resolved Promise (async functions always return Promises).\nStep 7: The await in async1 receives the resolved Promise. It schedules the remainder of async1 (console.log("async1 end")) as a microtask. async1 suspends and returns its pending Promise to the caller.\nStep 8: Back in the main script, setTimeout is registered with the browser Timer API as a macrotask.\nStep 9: console.log("end") → prints "end" (synchronous).\nStep 10: Call stack is empty. Event loop drains the microtask queue.\nStep 11: The async1 continuation microtask runs → prints "async1 end".\nStep 12: Microtask queue is empty. Event loop picks the macrotask.\nStep 13: setTimeout callback runs → prints "setTimeout".',
        code: 'async function async1() {\n  console.log("async1 start");\n  await async2();\n  console.log("async1 end");\n}\n\nasync function async2() {\n  console.log("async2");\n}\n\nconsole.log("start");\n\nasync1();\n\nsetTimeout(() => {\n  console.log("setTimeout");\n}, 0);\n\nconsole.log("end");',
        language: 'javascript',
        difficulty: 'Advanced',
        type: 'Scenario',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['async-await', 'output-prediction', 'event-loop', 'microtasks'],
        commonMistakes: [
          'Thinking the entire async function body is asynchronous — code before the first await runs synchronously.',
          'Expecting "async1 end" to print immediately after "async2" — the await suspends the function and yields control.',
          'Placing "setTimeout" before "async1 end" in the output — microtasks (async function continuations) always run before macrotasks.',
        ],
        followUps: [
          'What would change if async2 had an await inside it?',
          'What if we called async1() without the outer function being async — does it still work?',
        ],
        interviewTips: [
          'Clearly state the rule: everything before the first await in an async function is synchronous; everything after is a microtask. This single rule resolves most async/await output prediction questions.',
        ],
      },
      {
        id: 'js-async-17',
        question:
          'How do you implement a retry mechanism with exponential backoff using async/await?',
        answer:
          'A retry mechanism with exponential backoff is a resilience pattern where failed async operations are retried with increasing delays between attempts. The delay typically doubles with each retry (exponential growth) and often includes random jitter to prevent multiple clients from retrying simultaneously (thundering herd problem). This pattern is essential for handling transient failures in network requests, API calls, and distributed systems.\n\nThe implementation combines async/await with a loop and a delay function. The core structure is a for loop that attempts the operation, catches failures, calculates the next delay using the formula `baseDelay * 2^attempt + randomJitter`, waits for that duration, and retries. After exhausting all retries, the function throws the last error. The delay is implemented with a simple Promise-wrapped setTimeout.\n\nKey design decisions include: maximum number of retries (typically 3-5), base delay (100ms-1000ms), maximum delay cap (to prevent extremely long waits), jitter strategy (full jitter, equal jitter, or decorrelated jitter), and which errors are retryable (network errors and 5xx responses are retryable; 4xx errors usually are not). A well-designed retry function accepts these parameters and includes a predicate function that determines whether a specific error should trigger a retry.\n\nIn production systems, this pattern is often combined with circuit breakers (stop retrying after too many failures across all calls, not just one), idempotency keys (ensure retried mutations don\'t create duplicates), and observability (log retry attempts with backoff durations for monitoring). Libraries like axios-retry, p-retry, and cockatiel provide battle-tested implementations with these features built in.',
        shortAnswer:
          'Implement a loop that catches errors, calculates delay as `baseDelay * 2^attempt + jitter`, waits using a Promise-wrapped setTimeout, and retries. Cap maximum delay, limit retry count, and use a predicate to determine which errors are retryable. Add jitter to prevent thundering herd problems.',
        code: 'function delay(ms: number): Promise<void> {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n}\n\ninterface RetryOptions {\n  maxRetries: number;\n  baseDelay: number;\n  maxDelay: number;\n  shouldRetry?: (error: Error) => boolean;\n}\n\nasync function withRetry<T>(\n  operation: () => Promise<T>,\n  options: RetryOptions\n): Promise<T> {\n  const {\n    maxRetries,\n    baseDelay,\n    maxDelay,\n    shouldRetry = () => true,\n  } = options;\n\n  let lastError: Error = new Error("No attempts made");\n\n  for (let attempt = 0; attempt <= maxRetries; attempt++) {\n    try {\n      return await operation();\n    } catch (error) {\n      lastError = error instanceof Error ? error : new Error(String(error));\n\n      if (attempt === maxRetries || !shouldRetry(lastError)) {\n        throw lastError;\n      }\n\n      const jitter = Math.random() * baseDelay;\n      const backoff = Math.min(\n        baseDelay * Math.pow(2, attempt) + jitter,\n        maxDelay\n      );\n\n      console.log(\n        `Attempt ${attempt + 1} failed. Retrying in ${Math.round(backoff)}ms...`\n      );\n      await delay(backoff);\n    }\n  }\n\n  throw lastError;\n}\n\n// Usage\nconst data = await withRetry(\n  () => fetch("/api/data").then((r) => {\n    if (!r.ok) throw new Error(`HTTP ${r.status}`);\n    return r.json();\n  }),\n  {\n    maxRetries: 3,\n    baseDelay: 1000,\n    maxDelay: 10000,\n    shouldRetry: (err) => !err.message.includes("HTTP 4"),\n  }\n);',
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Coding',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['async-await', 'retry', 'exponential-backoff', 'error-handling', 'resilience'],
        commonMistakes: [
          'Not including jitter in the backoff calculation, causing synchronized retry storms across multiple clients.',
          'Retrying non-retryable errors like authentication failures (401) or validation errors (400).',
          'Not capping the maximum delay, allowing exponential growth to produce extremely long waits.',
        ],
        followUps: [
          'What is the thundering herd problem and how does jitter solve it?',
          'How does a circuit breaker pattern complement retry logic?',
          'What is an idempotency key and why is it important for retried mutations?',
        ],
        interviewTips: [
          'Mention jitter unprompted to show awareness of distributed systems concerns — it signals senior-level thinking.',
        ],
      },
      {
        id: 'js-async-18',
        question:
          'Predict the output: Promise.resolve chains with mixed sync and async handlers',
        answer:
          'The output is:\n\n```\n1\n2\n5\n3\n4\n```\n\nThis demonstrates how Promise.resolve().then() chains interact with synchronous code and nested microtasks.\n\nFirst, all synchronous code executes: "1" is logged, the Promise chain and setTimeout are registered, and "5" is logged. The Promise.resolve() creates an already-resolved Promise. Its first .then (logging "2") is enqueued as Microtask A. During that registration, the second .then (logging "3") cannot be enqueued yet because it depends on the Promise returned by the first .then.\n\nAfter the call stack clears, the event loop drains the microtask queue. Microtask A runs, logging "2". This resolves the Promise returned by the first .then, which causes the second .then callback (logging "3") to be enqueued as Microtask B. Additionally, inside the first .then, a new Promise.resolve().then (logging "4") is enqueued as Microtask C, but "4" is from the nested chain which is a separate Promise from the outer chain.\n\nWait — looking at the code more carefully, the nested Promise.resolve().then(() => console.log(4)) is independent. So after "2" is logged, both the chained .then (logging "3") and the nested .then (logging "4") become microtasks. The chain\'s .then is Microtask B, and the nested .then is Microtask C. However, the chained .then("3") resolves from the previous .then in the chain, while the nested .then("4") is a new independent microtask. Since "3" is the continuation of the same chain that just resolved and "4" is from a new Promise.resolve inside the handler, both are enqueued in order. Microtask B ("3") runs, then Microtask C ("4") runs.',
        shortAnswer:
          'Output: 1, 5, 2, 3, 4. Synchronous code (1, 5) runs first. Then microtasks drain: "2" from the first .then, then "3" from the chained .then, and then "4" from the nested Promise.resolve inside the first .then handler.',
        explanation:
          'Step 1: console.log(1) → prints "1" (synchronous).\nStep 2: Promise.resolve().then(() => { log(2); Promise.resolve().then(() => log(4)); }).then(() => log(3)) — the first .then callback is enqueued as Microtask A. The second .then cannot enqueue yet (depends on Microtask A resolving).\nStep 3: console.log(5) → prints "5" (synchronous).\nStep 4: Call stack is empty. Drain microtask queue.\nStep 5: Microtask A runs → prints "2". Inside this handler, Promise.resolve().then(() => log(4)) enqueues Microtask C (log 4). Microtask A\'s handler returns undefined, resolving the Promise from the first .then, which enqueues Microtask B (log 3).\nStep 6: Continue draining microtasks. Microtask B (log 3) was enqueued before Microtask C? Actually both were enqueued during step 5. The .then("3") depends on Microtask A\'s return Promise resolving. The nested Promise.resolve().then("4") is independent. Both are enqueued during step 5. The order depends on implementation — in practice, the chained .then("3") resolves via an extra microtask tick for the implicit Promise wrapping of the return value. So "4" may print before "3".\nStep 7: Microtask C runs → prints "3" (chained .then callback). Wait, let me re-analyze: After logging "2", the return value (undefined) resolves the chained Promise, enqueuing the .then(() => log(3)) callback. But the nested Promise.resolve().then(() => log(4)) is also enqueued. The chain callback for "3" and the nested callback for "4" — "3" is enqueued as a result of the outer .then resolving, and "4" is from an already-resolved Promise. Both happen in the same microtask tick, so the order is: "3" then "4".\nFinal output: 1, 5, 2, 3, 4.',
        code: 'console.log(1);\n\nPromise.resolve()\n  .then(() => {\n    console.log(2);\n    Promise.resolve().then(() => {\n      console.log(4);\n    });\n  })\n  .then(() => {\n    console.log(3);\n  });\n\nconsole.log(5);\n\n// Output:\n// 1\n// 5\n// 2\n// 4\n// 3',
        language: 'javascript',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'JavaScript',
        topicId: 'js-async',
        tags: ['promises', 'output-prediction', 'microtasks', 'event-loop', 'chaining'],
        commonMistakes: [
          'Expecting "3" before "4" — the nested Promise.resolve().then enqueues its callback immediately, while the chained .then waits for an extra microtask tick to resolve the intermediate Promise.',
          'Forgetting that chained .then handlers depend on the previous .then\'s return Promise resolving, which adds an implicit microtask tick.',
          'Not distinguishing between nested (independent) and chained (dependent) .then handlers.',
        ],
        followUps: [
          'How would the output change if the inner handler returned the nested Promise instead of not returning it?',
          'What happens if you add an await before the nested Promise.resolve()?',
        ],
        interviewTips: [
          'For complex promise ordering questions, label each microtask and track when each is enqueued vs when it executes — this systematic approach prevents mistakes.',
        ],
      },
    ],
  },
];
