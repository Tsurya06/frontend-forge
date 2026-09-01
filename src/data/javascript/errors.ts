import type { Topic } from "../../types";

export const errorsTopics: Topic[] = [
  {
    id: "js-errors",
    title: "Error Handling",
    description:
      "Master JavaScript error handling including try/catch/finally, custom errors, built-in error types, async error handling, and production-grade error handling patterns.",
    category: "JavaScript",
    difficulty: "Intermediate",
    tags: [
      "error handling",
      "try catch",
      "finally",
      "throw",
      "custom errors",
      "Error",
      "TypeError",
      "ReferenceError",
      "RangeError",
      "async errors",
      "error propagation",
    ],
    overview:
      "Error handling is a critical aspect of writing robust JavaScript applications. JavaScript provides the try/catch/finally construct for synchronous error handling, the throw statement for raising exceptions, and a hierarchy of built-in Error types for categorising failures. Modern JavaScript extends these fundamentals with Promise rejection handling and async/await patterns. Understanding error propagation, custom error classes, and defensive coding patterns is essential for building reliable, debuggable software—and is a frequent topic in technical interviews.",
    concepts: [
      "try / catch / finally control flow",
      "The throw statement and throwable values",
      "Built-in Error types: Error, TypeError, ReferenceError, RangeError, SyntaxError, URIError, EvalError",
      "Creating custom error classes by extending Error",
      "Error propagation and the call stack",
      "Handling errors in Promises and async/await",
      'Global error handlers: window.onerror and process.on("uncaughtException")',
      "Error handling best practices and patterns",
    ],
    relatedTopicIds: ["js-promises", "js-async-await", "js-classes"],
    questions: [
      {
        id: "js-errors-1",
        question: "Explain try, catch, finally and how they work together.",
        answer:
          "The try/catch/finally statement is JavaScript's primary mechanism for handling runtime errors. The `try` block wraps code that might throw an exception. If an exception occurs, execution immediately jumps to the `catch` block, skipping any remaining code in the `try` block. The `catch` block receives the thrown value as its parameter, which is typically an Error object but can technically be any value. The `finally` block, if present, executes unconditionally—whether the try block completes normally, the catch block runs, or even if a return statement is encountered in try or catch.\n\nThe execution order is important to understand. When no error occurs, the try block runs to completion, the catch block is skipped, and the finally block runs. When an error is thrown, execution halts at the throw point in try, the catch block runs with the error value, and then the finally block runs. The finally block is guaranteed to execute regardless of what happens, which makes it ideal for cleanup operations like closing connections, releasing resources, or restoring state.\n\nOne subtle behaviour is how finally interacts with return statements. If both try (or catch) and finally contain return statements, the return value from finally wins. This is because finally runs after try/catch but before the function actually returns. This can lead to surprising bugs if you accidentally return from a finally block, since it silently overrides the value returned by try or catch.\n\nThe catch block is optional when a finally block is present (try/finally without catch), though this is less common. In this pattern, errors still propagate up the call stack after the finally block runs. Modern JavaScript also introduced optional catch binding (ES2019), so you can write `catch { }` without naming the error parameter if you do not need to inspect the thrown value.",
        shortAnswer:
          "try wraps code that may throw; catch handles the error if one occurs; finally always executes regardless of outcome. If an error is thrown inside try, execution jumps to catch. The finally block runs after try and catch, even when return statements are present, making it ideal for cleanup logic.",
        code: `// Basic try/catch/finally
function parseJSON(jsonString: string): unknown {
  try {
    const result = JSON.parse(jsonString);
    console.log('Parsing succeeded');
    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON:', error.message);
    }
    return null;
  } finally {
    console.log('Parse attempt completed');
  }
}

parseJSON('{"valid": true}');
// "Parsing succeeded"
// "Parse attempt completed"

parseJSON('not json');
// "Invalid JSON: Unexpected token..."
// "Parse attempt completed"

// finally overrides return values
function demo(): string {
  try {
    return 'from try';
  } finally {
    return 'from finally'; // This wins!
  }
}
console.log(demo()); // "from finally"

// try/finally without catch — error still propagates
function riskyOperation(): void {
  try {
    throw new Error('something broke');
  } finally {
    console.log('cleanup runs even though error propagates');
  }
}

// Optional catch binding (ES2019)
try {
  JSON.parse('bad');
} catch {
  console.log('parse failed, error details not needed');
}`,
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-errors",
        tags: ["try", "catch", "finally", "error handling"],
        commonMistakes: [
          "Returning from a finally block, which silently overrides the return value from try or catch",
          "Using a bare catch without checking the error type, leading to swallowed or misidentified errors",
          "Forgetting that finally runs even when a return statement is in try or catch",
        ],
        followUps: [
          "What happens if both catch and finally throw errors?",
          "How does try/catch interact with async code like setTimeout?",
          "Can you nest try/catch blocks, and when would you want to?",
        ],
        interviewTips: [
          "Demonstrate knowledge of the execution order: try → catch (only on error) → finally (always)",
          "Mention the finally-overrides-return gotcha—it shows deeper understanding",
        ],
        relatedTopics: ["control flow", "error propagation", "async/await"],
      },
      {
        id: "js-errors-2",
        question: "What are the different built-in Error types in JavaScript?",
        answer:
          'JavaScript defines a base `Error` constructor and several specialised subtypes, each representing a different category of runtime failure. The base `Error` is the generic error type and can be used directly for custom error messages. All error objects share three key properties: `message` (the human-readable description), `name` (the error type name, e.g. "TypeError"), and `stack` (a non-standard but universally supported string containing the call stack trace at the point the error was created).\n\n`TypeError` is thrown when a value is not of the expected type—for example, calling a non-function, accessing a property on null or undefined, or passing an argument of the wrong type to a built-in method. `ReferenceError` occurs when code references a variable that has not been declared in the current scope. `SyntaxError` is raised during parsing when the engine encounters invalid JavaScript syntax, though at runtime you mostly encounter it through `eval()` or `JSON.parse()`. `RangeError` indicates that a numeric value is outside its allowed range, such as creating an Array with a negative length or calling `toFixed()` with a precision greater than 100.\n\n`URIError` is thrown by URI-handling functions like `decodeURIComponent()` when given a malformed URI string. `EvalError` historically related to the `eval()` function but is effectively unused in modern engines; it exists mainly for backward compatibility. There is also `AggregateError` (introduced in ES2021) which holds multiple errors in its `errors` property and is used by `Promise.any()` when all promises reject.\n\nUnderstanding these types matters because you can use `instanceof` checks in catch blocks to handle different error categories differently. This enables precise, targeted error recovery rather than a single catch-all handler. In production code, distinguishing between a `TypeError` (likely a bug) and a network error (likely transient) allows you to choose between logging and retrying, respectively.',
        shortAnswer:
          "JavaScript provides Error (generic), TypeError (wrong type), ReferenceError (undeclared variable), SyntaxError (invalid syntax), RangeError (value out of range), URIError (malformed URI), EvalError (legacy), and AggregateError (multiple errors). Each has name, message, and stack properties, and you can use instanceof to differentiate them in catch blocks.",
        code: `// TypeError — operating on wrong type
try {
  const obj = null;
  obj.property; // Cannot read properties of null
} catch (e) {
  console.log(e instanceof TypeError); // true
  console.log(e.name);    // "TypeError"
  console.log(e.message); // "Cannot read properties of null (reading 'property')"
}

// ReferenceError — undeclared variable
try {
  console.log(undeclaredVar);
} catch (e) {
  console.log(e instanceof ReferenceError); // true
}

// SyntaxError — invalid JSON
try {
  JSON.parse('{invalid}');
} catch (e) {
  console.log(e instanceof SyntaxError); // true
}

// RangeError — value out of bounds
try {
  const arr = new Array(-1);
} catch (e) {
  console.log(e instanceof RangeError); // true
}

// URIError — malformed URI
try {
  decodeURIComponent('%');
} catch (e) {
  console.log(e instanceof URIError); // true
}

// AggregateError — multiple errors (ES2021)
const promises = [
  Promise.reject(new Error('first')),
  Promise.reject(new Error('second')),
];

Promise.any(promises).catch((e) => {
  console.log(e instanceof AggregateError); // true
  console.log(e.errors.length); // 2
});

// Targeted error handling with instanceof
function safeDivide(a: number, b: number): number {
  try {
    if (typeof a !== 'number') throw new TypeError('a must be a number');
    if (b === 0) throw new RangeError('Division by zero');
    return a / b;
  } catch (error) {
    if (error instanceof RangeError) {
      console.warn('Math error:', error.message);
      return Infinity;
    }
    throw error; // Re-throw unexpected errors
  }
}`,
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-errors",
        tags: [
          "Error",
          "TypeError",
          "ReferenceError",
          "RangeError",
          "SyntaxError",
        ],
        commonMistakes: [
          "Assuming all thrown values are Error instances—any value can be thrown, including strings and plain objects",
          "Confusing SyntaxError (parse-time) with TypeError (runtime)—SyntaxError at runtime mostly comes from eval or JSON.parse",
          "Forgetting that the stack property is non-standard and its format differs between engines",
        ],
        followUps: [
          "How does AggregateError work with Promise.any()?",
          "Can you create your own error types that extend built-in ones?",
        ],
        interviewTips: [
          "Knowing the specific built-in error types and when each occurs signals strong fundamentals",
          "Mention the instanceof approach for targeted catch handling to show you write production-quality code",
        ],
        relatedTopics: ["custom errors", "instanceof", "prototype chain"],
      },
      {
        id: "js-errors-3",
        question: "How do you create custom error classes in JavaScript?",
        answer:
          "Custom error classes are created by extending the built-in `Error` class (or one of its subtypes). This is the standard approach in modern JavaScript using ES6 class syntax. A custom error class lets you attach domain-specific data to errors, distinguish application errors from generic runtime errors using `instanceof`, and build hierarchies of error types that mirror your application's failure modes.\n\nThe basic pattern involves extending `Error`, calling `super(message)` in the constructor, and setting `this.name` to the class name. Setting the name property is important because it affects how the error appears in stack traces and console output. You can also add custom properties—such as an HTTP status code, an error code, or contextual metadata—that help callers decide how to handle the error. For example, a `ValidationError` might carry a `fields` property listing which form fields failed validation.\n\nThere is a historical gotcha: in transpiled environments (e.g., TypeScript targeting ES5 or Babel), extending built-in classes like Error can break `instanceof` checks because the prototype chain is not correctly set up. The workaround is to explicitly restore the prototype using `Object.setPrototypeOf(this, new.target.prototype)` in the constructor. Modern environments targeting ES6+ do not have this issue, but it is worth knowing for compatibility.\n\nYou can build error hierarchies by extending your own custom error classes. For instance, a base `AppError` class might be extended by `HttpError`, `DatabaseError`, and `ValidationError`. This allows catch blocks to handle broad categories (catch all `AppError` instances) or be specific (catch only `HttpError`). This pattern aligns with how mature backend frameworks and libraries structure their error types and is highly valued in senior-level interviews.",
        shortAnswer:
          "Extend the built-in Error class using ES6 class syntax, call super(message) in the constructor, and set this.name to your class name. You can add custom properties like status codes or field lists. This enables instanceof checks for targeted error handling and lets you build error hierarchies for your application.",
        code: `// Basic custom error
class ValidationError extends Error {
  readonly fields: string[];

  constructor(message: string, fields: string[]) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
    // Fix prototype chain for transpiled environments
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Error hierarchy
class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class HttpError extends AppError {
  readonly url: string;

  constructor(message: string, statusCode: number, url: string) {
    super(message, statusCode);
    this.name = 'HttpError';
    this.url = url;
  }
}

class NotFoundError extends HttpError {
  constructor(resource: string) {
    super(\`\${resource} not found\`, 404, '');
    this.name = 'NotFoundError';
  }
}

// Usage with instanceof
function handleRequest(userId: string): void {
  try {
    if (!userId) {
      throw new ValidationError('Invalid input', ['userId']);
    }
    // Simulated lookup
    throw new NotFoundError(\`User \${userId}\`);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation failed on fields:', error.fields);
    } else if (error instanceof NotFoundError) {
      console.error('Resource missing:', error.message);
    } else if (error instanceof AppError) {
      console.error(\`App error [\${error.statusCode}]: \${error.message}\`);
    } else {
      throw error; // Unknown error, re-throw
    }
  }
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "JavaScript",
        topicId: "js-errors",
        tags: ["custom errors", "class", "extends", "Error"],
        commonMistakes: [
          "Forgetting to call super(message) in the constructor, resulting in missing message and stack properties",
          'Not setting this.name, which causes stack traces to show "Error" instead of the custom class name',
          "Ignoring the prototype chain issue in transpiled code, which breaks instanceof checks",
        ],
        followUps: [
          "How do you serialise custom error objects for logging or API responses?",
          "What is the difference between operational errors and programmer errors?",
          "How does TypeScript's type narrowing work with custom error classes in catch blocks?",
        ],
        interviewTips: [
          "Demonstrate a multi-level error hierarchy—it signals production experience and architectural thinking",
        ],
        relatedTopics: ["ES6 classes", "prototype chain", "instanceof"],
      },
      {
        id: "js-errors-4",
        question: "What happens if you throw inside a finally block?",
        answer:
          "Throwing inside a `finally` block replaces any error that was already being propagated from the `try` or `catch` block. This is one of the most surprising and dangerous behaviours in JavaScript's error handling model. When an error is thrown in `try`, the runtime holds that error while executing `finally`. If `finally` then throws its own error (or executes a return statement), the original error is silently discarded and the new error from finally becomes the one that propagates up the call stack.\n\nThis means the original error—which is usually the one you actually care about—is completely lost. There is no built-in mechanism to recover it. The original error is not attached to the new error, it does not appear in the stack trace, and there is no way to access it after the fact. This is a well-known pitfall and one reason why many style guides and linters discourage complex logic inside finally blocks.\n\nThe same issue applies to return statements in finally. If try throws an error but finally contains a `return`, the error is swallowed entirely and the function returns the value from finally as if no error occurred. This can mask critical failures in your application and make bugs extremely difficult to diagnose, since the caller has no indication that anything went wrong.\n\nTo avoid these problems, keep finally blocks simple and limited to cleanup operations. If cleanup code in finally might itself fail, wrap it in its own try/catch so that any secondary failure is handled without interfering with the primary error. Some advanced patterns capture the original error in a variable before entering finally, so it can be preserved and logged even if finally encounters its own issues.",
        shortAnswer:
          "Throwing inside a finally block replaces any error already being propagated from try or catch—the original error is silently lost. Similarly, a return in finally swallows the pending error entirely. This is why finally blocks should contain only simple cleanup logic and any risky cleanup code should be wrapped in its own try/catch.",
        code: `// Original error gets replaced by the finally error
function dangerousFinally(): void {
  try {
    throw new Error('original error');
  } catch (error) {
    console.log('Caught:', (error as Error).message);
    throw error; // Re-throw original
  } finally {
    throw new Error('finally error'); // Replaces original!
  }
}

try {
  dangerousFinally();
} catch (error) {
  // Only "finally error" is caught — "original error" is lost
  console.log((error as Error).message); // "finally error"
}

// Return in finally swallows the error entirely
function returnInFinally(): string {
  try {
    throw new Error('this error disappears');
  } finally {
    return 'no error seen by caller'; // Error is swallowed
  }
}
console.log(returnInFinally()); // "no error seen by caller"

// Safe pattern: protect cleanup in its own try/catch
function safeCleanup(): void {
  let originalError: Error | null = null;

  try {
    throw new Error('operation failed');
  } catch (error) {
    originalError = error as Error;
    throw error;
  } finally {
    try {
      // Cleanup that might fail
      console.log('attempting cleanup...');
      throw new Error('cleanup also failed');
    } catch (cleanupError) {
      console.error('Cleanup error (suppressed):', (cleanupError as Error).message);
      if (originalError) {
        console.error('Original error preserved:', originalError.message);
      }
    }
  }
}`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-errors",
        tags: ["finally", "throw", "error handling", "gotchas"],
        commonMistakes: [
          "Performing risky operations in finally without wrapping them in try/catch, which can silently replace the original error",
          "Using return inside finally without realising it swallows any pending exception",
        ],
        followUps: [
          "How do languages like Java handle this situation differently (e.g., suppressed exceptions)?",
          "How can you log both the original and the finally error in production code?",
        ],
        interviewTips: [
          'This is a classic "gotcha" question—walk through the execution order step by step to show methodical reasoning',
          "Mention the safe cleanup pattern with a nested try/catch inside finally",
        ],
        relatedTopics: [
          "try/catch/finally",
          "error propagation",
          "resource cleanup",
        ],
      },
      {
        id: "js-errors-5",
        question: "How do you handle errors in async/await code?",
        answer:
          'Async/await error handling builds on the same try/catch mechanism used for synchronous code, which is one of its primary advantages over raw Promise chains. When an awaited Promise rejects, the rejection is converted into a thrown exception that can be caught with a surrounding try/catch block. This makes async error handling read almost identically to synchronous error handling, significantly improving code clarity compared to nested `.catch()` callbacks.\n\nThe basic pattern wraps `await` calls in a try/catch block. The catch block receives the rejection reason—typically an Error object. You can use multiple await statements inside a single try block, and the first one to reject will cause execution to jump to catch, just like synchronous throws. For more granular control, you can wrap individual await statements in separate try/catch blocks, or use the `.catch()` method inline on specific promises (e.g., `const result = await riskyCall().catch(handleError)`) to handle errors for that specific operation without interrupting the broader flow.\n\nA critical pitfall is forgetting to handle errors in async functions. If an async function throws and the returned Promise is never caught (no `.catch()` and no `await` inside a try/catch), the rejection becomes an unhandled promise rejection. In Node.js, unhandled rejections can crash the process by default (since Node 15+). In browsers, they trigger the `unhandledrejection` event. Always ensure that every async call chain has error handling at some level.\n\nFor parallel async operations, `Promise.all()` rejects as soon as any constituent Promise rejects, discarding the results of others. If you need all results regardless of individual failures, use `Promise.allSettled()`, which returns an array of `{ status, value/reason }` objects. This lets you inspect each outcome and handle failures individually without losing successful results. You can also combine async/await with the "go-style" tuple pattern—wrapping each await in a helper that returns `[error, result]`—to avoid deeply nested try/catch blocks in functions with many sequential async operations.',
        shortAnswer:
          "Wrap await calls in try/catch blocks—rejected Promises become thrown exceptions that catch handles. For parallel operations, use Promise.allSettled() to handle individual failures without losing other results. Always ensure async call chains have error handling to avoid unhandled promise rejections, which can crash Node.js processes.",
        code: `// Basic async/await error handling
async function fetchUserData(userId: string): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    return await response.json() as Record<string, unknown>;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Network failure:', error.message);
    } else {
      console.error('Request failed:', (error as Error).message);
    }
    throw error; // Re-throw for caller to handle
  }
}

// Inline .catch() for non-critical operations
async function loadDashboard(userId: string): Promise<void> {
  const user = await fetchUserData(userId);
  const preferences = await fetchPreferences(userId)
    .catch(() => ({ theme: 'default', language: 'en' })); // Fallback on failure

  console.log('Dashboard loaded for', user, 'with prefs', preferences);
}

// Promise.allSettled for parallel operations
async function fetchMultipleUsers(
  ids: string[]
): Promise<Record<string, unknown>[]> {
  const results = await Promise.allSettled(
    ids.map((id) => fetchUserData(id))
  );

  const users: Record<string, unknown>[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      users.push(result.value);
    } else {
      console.warn('Failed to fetch user:', result.reason);
    }
  }
  return users;
}

// Go-style tuple pattern to avoid nested try/catch
type Result<T> = [Error, null] | [null, T];

async function to<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error as Error, null];
  }
}

async function processOrder(orderId: string): Promise<void> {
  const [orderErr, order] = await to(fetchOrder(orderId));
  if (orderErr) {
    console.error('Order fetch failed:', orderErr.message);
    return;
  }

  const [paymentErr] = await to(processPayment(order));
  if (paymentErr) {
    console.error('Payment failed:', paymentErr.message);
    await rollbackOrder(orderId);
    return;
  }

  console.log('Order processed successfully');
}

// Stub declarations for the example
declare function fetchPreferences(id: string): Promise<Record<string, unknown>>;
declare function fetchOrder(id: string): Promise<Record<string, unknown>>;
declare function processPayment(order: Record<string, unknown>): Promise<void>;
declare function rollbackOrder(id: string): Promise<void>;`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "JavaScript",
        topicId: "js-errors",
        tags: ["async/await", "promises", "error handling", "try/catch"],
        commonMistakes: [
          "Forgetting to await a Promise inside a try block—the rejection goes unhandled because try/catch only catches synchronous throws and awaited rejections",
          "Using Promise.all() when individual failures should not abort the entire operation—use Promise.allSettled() instead",
          "Not re-throwing errors when the current function cannot fully handle them, causing silent failures upstream",
        ],
        followUps: [
          "How do you implement retry logic for transient async errors?",
          "What is the difference between unhandled rejection in Node.js vs browsers?",
          "How would you implement a timeout wrapper for async operations?",
        ],
        interviewTips: [
          "Show that you know multiple patterns: try/catch, inline .catch(), and the tuple/go-style helper",
          "Mention Promise.allSettled() proactively—it is a common interview follow-up",
        ],
        relatedTopics: [
          "promises",
          "async/await",
          "Promise.allSettled",
          "event loop",
        ],
      },
      {
        id: "js-errors-6",
        question:
          "What is error propagation and how does it work in JavaScript?",
        answer:
          'Error propagation (also called "unwinding the call stack") is the process by which a thrown exception travels up through the chain of function calls until it is caught by a try/catch block or reaches the top level of the program. When a function throws an error and does not catch it internally, the error propagates to the calling function. If that caller also lacks a try/catch, the error continues to the next caller, and so on. This continues until either a catch block is found or the error reaches the global scope.\n\nIn synchronous code, this propagation follows the call stack directly. Each function on the stack is exited in reverse order (most recent first), and any finally blocks encountered along the way are executed. This stack unwinding is what produces the stack trace you see in error.stack—it records the path the error took from where it was thrown to where it was caught (or where it terminated the program). Understanding this mechanism helps you place try/catch blocks strategically: usually at boundaries where you can meaningfully handle or report the error, rather than wrapping every single function call.\n\nFor asynchronous code, propagation works differently. Errors thrown inside callbacks passed to setTimeout or event listeners do not propagate to the code that scheduled them, because the original call stack has already unwound by the time the callback executes. This is why Node.js provides process-level handlers like `process.on("uncaughtException")` and browsers provide `window.onerror` and `window.addEventListener("unhandledrejection")`. Promise rejections propagate through the Promise chain—an unhandled rejection in one `.then()` callback travels to the next `.catch()` in the chain, or becomes an unhandled rejection if no `.catch()` exists.\n\nEffective error propagation strategy means catching errors at the right level. Low-level utility functions should typically throw (or reject) and let callers decide how to handle the error. Mid-level service functions might catch, enrich the error with context (wrapping it in a more descriptive custom error), and re-throw. Top-level entry points (route handlers, event listeners, main functions) should catch and handle errors definitively—by logging, returning error responses, or displaying error UI. This layered approach keeps error handling clean and avoids both swallowed errors and redundant catch blocks.',
        shortAnswer:
          "Error propagation is the process of a thrown exception traveling up the call stack until caught. Each uncaught throw exits the current function and moves to the caller. In async code, propagation works through Promise chains rather than the call stack. Best practice is to catch at boundaries where you can meaningfully handle the error, and let lower-level code throw freely.",
        code: `// Synchronous propagation up the call stack
function innerFunction(): void {
  throw new Error('thrown in innerFunction');
}

function middleFunction(): void {
  innerFunction(); // Does not catch — error propagates
}

function outerFunction(): void {
  try {
    middleFunction();
  } catch (error) {
    // Error caught here after unwinding through middle → inner
    console.log((error as Error).message); // "thrown in innerFunction"
    console.log((error as Error).stack);   // Shows full call path
  }
}

outerFunction();

// Error enrichment pattern: catch, wrap, re-throw
class ServiceError extends Error {
  readonly cause: Error;
  constructor(message: string, cause: Error) {
    super(message);
    this.name = 'ServiceError';
    this.cause = cause;
  }
}

function fetchFromDatabase(id: string): Record<string, unknown> {
  throw new Error(\`Record \${id} not found in database\`);
}

function getUserProfile(userId: string): Record<string, unknown> {
  try {
    return fetchFromDatabase(userId);
  } catch (error) {
    // Enrich with context, then re-throw
    throw new ServiceError(
      \`Failed to load profile for user \${userId}\`,
      error as Error
    );
  }
}

// Async propagation through Promise chains
function step1(): Promise<string> {
  return Promise.resolve('data');
}

function step2(data: string): Promise<string> {
  throw new Error(\`step2 failed with: \${data}\`);
}

step1()
  .then(step2)           // Error thrown here
  .then((result) => {    // Skipped
    console.log(result);
  })
  .catch((error: Error) => {
    // Error propagated through the chain
    console.error('Caught in chain:', error.message);
  });

// Global handlers as a safety net
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
    event.preventDefault();
  });
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-errors",
        tags: ["error propagation", "call stack", "async", "promise chain"],
        commonMistakes: [
          "Catching errors too early (in low-level utilities) and swallowing them, preventing callers from knowing about the failure",
          "Expecting try/catch to capture errors from asynchronous callbacks like setTimeout—those run on a separate call stack",
          "Forgetting to attach the original error as a cause when wrapping and re-throwing, losing the root cause in logs",
        ],
        followUps: [
          "How does the ES2022 Error cause property improve error chaining?",
          "How do you design an error boundary strategy for a large application?",
          "What is the difference between error propagation in Promises and in async/await?",
        ],
        interviewTips: [
          "Draw the call stack or describe the unwinding order to show clear mental model",
          "Discuss the catch-enrich-rethrow pattern to demonstrate production experience",
        ],
        relatedTopics: [
          "call stack",
          "promises",
          "Error cause",
          "global error handlers",
        ],
      },
      {
        id: "js-errors-7",
        question: "What are common error handling patterns and best practices?",
        answer:
          'Production JavaScript applications benefit from a structured approach to error handling that goes beyond basic try/catch. One foundational pattern is the distinction between **operational errors** and **programmer errors**. Operational errors are expected runtime problems—network failures, invalid user input, file not found—that your code should anticipate and recover from. Programmer errors are bugs—type errors, null dereferences, logic mistakes—that indicate broken code and usually require a fix rather than runtime recovery. Handling these differently (graceful recovery vs. crash-and-fix) is key to building reliable systems.\n\nThe **error boundary** pattern isolates failures so they do not cascade. In React, Error Boundaries are class components that catch rendering errors in their subtree and display fallback UI. On the backend, each request handler or message processor acts as a boundary: errors within one request should not crash the server or affect other requests. Centralised error-handling middleware (in Express, for example) catches errors from all routes and formats consistent error responses. This pattern keeps error handling DRY and ensures uniform error reporting.\n\n**Fail-fast** is another critical principle: validate inputs and preconditions at the start of a function and throw immediately if they are not met, rather than letting invalid data flow deeper into the system where failures become harder to diagnose. Combine this with **defensive programming**—using type guards, null checks, and assertion functions to surface problems as close to their source as possible. For async code, always ensure Promises have rejection handlers, and use `Promise.allSettled()` when you need results from multiple operations regardless of individual failures.\n\nFor large applications, implement a **centralised error logging and monitoring** strategy. Use a global error handler (`window.onerror`, `process.on("uncaughtException")`, or framework-specific hooks) as a safety net to capture and report errors that slip past local handlers. Attach contextual information (user ID, request ID, operation name) to errors before logging them. Consider using the ES2022 `Error.cause` property or custom error classes with a `cause` field to chain errors and preserve the original failure context. Finally, never expose internal error details (stack traces, database queries) to end users—return user-friendly messages and log the details server-side.',
        shortAnswer:
          "Key patterns include distinguishing operational vs programmer errors, using error boundaries to isolate failures, fail-fast validation at function entry points, centralised error logging with context, and using custom error classes with cause chaining. Always ensure async code has rejection handlers, never expose internal details to users, and use global handlers as a safety net.",
        code: `// Fail-fast: validate inputs early
function createUser(name: string, age: number): { name: string; age: number } {
  if (!name || typeof name !== 'string') {
    throw new TypeError('name must be a non-empty string');
  }
  if (!Number.isFinite(age) || age < 0 || age > 150) {
    throw new RangeError('age must be between 0 and 150');
  }
  return { name, age };
}

// Centralised error handler (Express-style middleware)
interface AppRequest { path: string; }
interface AppResponse {
  status(code: number): AppResponse;
  json(body: Record<string, unknown>): void;
}

class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
  }
}

function errorHandler(
  err: Error,
  _req: AppRequest,
  res: AppResponse
): void {
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    // Programmer error — log and return generic message
    console.error('Unexpected error:', err);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
    });
  }
}

// Error cause chaining (ES2022)
async function loadConfig(path: string): Promise<Record<string, unknown>> {
  try {
    const raw = await readFile(path);
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (error) {
    throw new Error(\`Failed to load config from \${path}\`, {
      cause: error,
    });
  }
}

// Retry pattern for transient failures
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const backoff = delayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  throw new Error(\`Failed after \${maxRetries} retries\`, {
    cause: lastError,
  });
}

// Usage
async function fetchWithRetry(url: string): Promise<Record<string, unknown>> {
  return withRetry(async () => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return res.json() as Promise<Record<string, unknown>>;
  });
}

declare function readFile(path: string): Promise<string>;`,
        language: "typescript",
        difficulty: "Senior",
        type: "Scenario",
        category: "JavaScript",
        topicId: "js-errors",
        tags: [
          "best practices",
          "error boundary",
          "fail fast",
          "retry",
          "Error.cause",
          "operational errors",
        ],
        commonMistakes: [
          "Using a single catch-all handler that swallows all errors identically, making it impossible to distinguish recoverable failures from bugs",
          "Exposing internal error details (stack traces, SQL queries) in API responses sent to end users",
          "Implementing retry logic without exponential backoff, which can overwhelm a struggling downstream service",
        ],
        followUps: [
          "How do React Error Boundaries work and what are their limitations?",
          "How would you design error monitoring and alerting for a production application?",
          "What is the circuit breaker pattern and when would you use it?",
        ],
        interviewTips: [
          "Discussing operational vs programmer errors shows system-design maturity—interviewers love this distinction at senior levels",
          "Mention centralised logging, error cause chaining, and retry with backoff to demonstrate production readiness",
        ],
        relatedTopics: [
          "Express middleware",
          "React Error Boundaries",
          "circuit breaker",
          "observability",
        ],
      },
    ],
  },
];
