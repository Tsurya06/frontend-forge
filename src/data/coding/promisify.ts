import type { CodingProblem } from '../../types';

export const promisifyProblem: CodingProblem = {
  id: 'coding-promisify',
  title: 'Implement Promisify',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['promises', 'callbacks', 'node-style', 'async', 'utility'],

  problem: `Implement a \`promisify\` function that converts a Node-style callback-based function into a function that returns a Promise. Node-style callbacks follow the convention where the callback is the last argument and is invoked as \`callback(error, result)\` — the first argument is an error (null if success) and the second is the result.

This pattern is essential when working with legacy Node.js APIs (fs.readFile, dns.lookup, etc.) or any library that uses the error-first callback convention. Before util.promisify was added to Node.js, developers had to write this utility themselves. Understanding how it works reveals deep knowledge of higher-order functions, closures, and the relationship between callbacks and Promises.

Your promisify function should accept a function that expects a Node-style callback as its last parameter, and return a new function with the same parameters (minus the callback) that returns a Promise. The Promise should resolve with the result on success or reject with the error on failure.`,

  requirements: [
    'Accept a function that uses a Node-style error-first callback as its last parameter',
    'Return a new function that returns a Promise instead of accepting a callback',
    'The returned function must forward all arguments to the original function',
    'Resolve the Promise with the callback result value on success',
    'Reject the Promise with the callback error on failure',
    'Preserve the correct `this` context when the original function is invoked',
    'Handle functions with any number of parameters before the callback',
  ],

  examples: [
    {
      input: `function readFile(path, callback) {\n  setTimeout(() => callback(null, 'file contents'), 100);\n}\nconst readFileAsync = promisify(readFile);\nreadFileAsync('/path/to/file');`,
      output: `Promise resolves with 'file contents'`,
      explanation: 'The callback-based readFile is converted to return a Promise. Success calls callback(null, result), so the Promise resolves with result.',
    },
    {
      input: `function failingOp(callback) {\n  setTimeout(() => callback(new Error('disk error')), 50);\n}\nconst failingOpAsync = promisify(failingOp);\nfailingOpAsync();`,
      output: `Promise rejects with Error('disk error')`,
      explanation: 'When the callback receives an error as the first argument, the Promise rejects with that error.',
    },
    {
      input: `function add(a, b, callback) {\n  callback(null, a + b);\n}\nconst addAsync = promisify(add);\naddAsync(3, 4);`,
      output: `Promise resolves with 7`,
      explanation: 'Multiple arguments before the callback are correctly forwarded.',
    },
  ],

  edgeCases: [
    'Original function with zero parameters before the callback',
    'Original function with multiple parameters before the callback',
    'Callback invoked synchronously vs asynchronously',
    'Original function that relies on `this` context',
    'Error is a falsy non-null value (e.g., empty string or 0)',
  ],

  naiveApproach: `A naive approach hardcodes the number of arguments or doesn't preserve the \`this\` context. For example, wrapping the function with a fixed number of parameters and creating a new Promise inside, but not using the rest/spread pattern to handle arbitrary argument counts. Another mistake is using an arrow function for the returned function, which prevents proper \`this\` binding.`,

  optimalApproach: `The optimal solution returns a regular function (not arrow, to preserve \`this\`) that collects all arguments using the rest operator. Inside this wrapper, create and return a new Promise. Within the Promise executor, call the original function with the spread arguments plus a callback appended at the end. The callback checks if the error argument is truthy — if so, reject the Promise; otherwise, resolve with the result.

Using a regular function expression instead of an arrow function ensures that if the promisified function is later called as a method on an object, the \`this\` context is correctly passed through to the original function via \`.call(this, ...)\`. The rest/spread pattern handles any number of leading arguments generically, making the solution work for functions with 0, 1, or N parameters before the callback.`,

  implementation: `function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Usage with a Node-style function
function fetchData(url, callback) {
  setTimeout(() => {
    if (url.startsWith('http')) {
      callback(null, { status: 200, data: 'response from ' + url });
    } else {
      callback(new Error('Invalid URL: ' + url));
    }
  }, 100);
}

const fetchDataAsync = promisify(fetchData);

fetchDataAsync('http://example.com')
  .then((result) => console.log(result))
  .catch((err) => console.error(err.message));
// { status: 200, data: 'response from http://example.com' }

fetchDataAsync('ftp://bad')
  .catch((err) => console.error(err.message));
// 'Invalid URL: ftp://bad'

// Works with this context
const db = {
  connection: 'active',
  query(sql, callback) {
    callback(null, { sql, connection: this.connection });
  },
};

db.queryAsync = promisify(db.query);
db.queryAsync('SELECT * FROM users')
  .then((result) => console.log(result));
// { sql: 'SELECT * FROM users', connection: 'active' }`,

  stepByStep: [
    'Accept the original callback-based function as a parameter.',
    'Return a new regular function (not arrow) to preserve `this` context.',
    'Collect all arguments to the new function using the rest operator (...args).',
    'Inside the returned function, create and return a new Promise.',
    'In the Promise executor, call the original function with fn.call(this, ...args, callback).',
    'Append a callback as the last argument that checks the error parameter.',
    'If error is truthy, reject the Promise with the error.',
    'If error is falsy, resolve the Promise with the result.',
  ],

  timeComplexity: 'O(1) for the promisify wrapper creation. Runtime depends on the original function.',
  spaceComplexity: 'O(1) additional space — one closure per promisified call.',

  commonMistakes: [
    'Using an arrow function for the returned function, which breaks `this` context propagation',
    'Forgetting to use the rest/spread pattern, hardcoding a fixed number of arguments',
    'Not appending the callback as the last argument via fn.call or fn.apply',
    'Checking err !== null instead of just truthiness — some callbacks pass undefined for no error',
  ],

  followUps: [
    'How would you handle functions whose callbacks receive multiple success values (e.g., callback(err, bytesRead, buffer))?',
    'How does Node.js util.promisify handle custom promisify symbols?',
    'How would you implement callbackify — the reverse of promisify?',
    'How would you promisify an entire object of methods at once?',
  ],
};
