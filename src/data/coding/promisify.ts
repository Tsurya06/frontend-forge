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



  theoryAndConcepts: "WHAT IS PROMISIFY?\n------------------\nConverts callback-based async functions to Promise-based ones.\n\nCALLBACK PATTERN (Node.js style):\nfn(arg1, arg2, (error, result) => { ... })\n\nPROMISE PATTERN:\nfn(arg1, arg2).then(result => { ... }).catch(error => { ... })\n\nWHY PROMISIFY?\n--------------\n1. Cleaner async/await syntax\n2. Better error handling\n3. Easier composition\n4. Modern API design\n\nNODE.JS:\n--------\nBuilt-in: const { promisify } = require('util');",
  beginnerApproach: "Beginner: Basic promisify\nAssumes callback is last argument with (error, result) signature",
  beginnerImplementation: "function promisifyBeginner(fn) {\n  return function(...args) {\n    return new Promise((resolve, reject) => {\n      // Add callback as last argument\n      fn(...args, (error, result) => {\n        if (error) {\n          reject(error);\n        } else {\n          resolve(result);\n        }\n      });\n    });\n  };\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\n// Simulate callback-based function\nfunction readFileCallback(path, callback) {\n  setTimeout(() => {\n    if (path === 'error') {\n      callback(new Error('File not found'));\n    } else {\n      callback(null, `Contents of ${path}`);\n    }\n  }, 100);\n}\n\nconst readFilePromise = promisifyBeginner(readFileCallback);\n\nreadFilePromise('test.txt')\n  .then(contents => console.log('Success:', contents))\n  .catch(error => console.log('Error:', error.message));",
  intermediateApproach: "Intermediate: Handle multiple callback arguments\nSome callbacks return (error, result1, result2, ...)\n\n\nIntermediate: Promisify with context binding",
  intermediateImplementation: "function promisifyIntermediate(fn, options = {}) {\n  const { multiArgs = false } = options;\n  \n  return function(...args) {\n    return new Promise((resolve, reject) => {\n      fn.call(this, ...args, (error, ...results) => {\n        if (error) {\n          reject(error);\n        } else if (multiArgs) {\n          // Return array of all results\n          resolve(results);\n        } else {\n          // Return just the first result\n          resolve(results[0]);\n        }\n      });\n    });\n  };\n}\n\nfunction promisifyWithContext(fn, context) {\n  return function(...args) {\n    return new Promise((resolve, reject) => {\n      fn.call(context, ...args, (error, result) => {\n        if (error) {\n          reject(error);\n        } else {\n          resolve(result);\n        }\n      });\n    });\n  };\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\n// Function that returns multiple values\nfunction getCoordinates(address, callback) {\n  setTimeout(() => {\n    callback(null, 40.7128, -74.0060); // lat, lng\n  }, 100);\n}\n\nconst getCoordsPromise = promisifyIntermediate(getCoordinates, { multiArgs: true });\n\ngetCoordsPromise('New York')\n  .then(([lat, lng]) => console.log('Coordinates:', lat, lng));\n\n// With context\nconst database = {\n  connection: 'DB_CONNECTION',\n  query(sql, callback) {\n    setTimeout(() => {\n      callback(null, `Result from ${this.connection}: ${sql}`);\n    }, 100);\n  }\n};\n\nconst queryPromise = promisifyWithContext(database.query, database);\nqueryPromise('SELECT * FROM users')\n  .then(result => console.log('Query result:', result));",
  expertApproach: "Expert: Full-featured promisify with custom resolver\n\n\nExpert: Promisify all methods of an object\n\n\nExpert: Callbackify (reverse of promisify)",
  expertImplementation: "function promisifyExpert(fn, options = {}) {\n  const {\n    multiArgs = false,\n    errorFirst = true,     // Error-first callback convention\n    thisArg = undefined,   // Context binding\n    customResolver = null  // Custom (error, ...results) => value\n  } = options;\n  \n  // Allow promisify.custom symbol (like Node.js)\n  if (fn[promisifyExpert.custom]) {\n    return fn[promisifyExpert.custom];\n  }\n  \n  return function promisified(...args) {\n    const context = thisArg !== undefined ? thisArg : this;\n    \n    return new Promise((resolve, reject) => {\n      const callback = (...callbackArgs) => {\n        // Custom resolver\n        if (customResolver) {\n          try {\n            const result = customResolver(...callbackArgs);\n            resolve(result);\n          } catch (error) {\n            reject(error);\n          }\n          return;\n        }\n        \n        if (errorFirst) {\n          const [error, ...results] = callbackArgs;\n          \n          if (error) {\n            reject(error);\n          } else {\n            resolve(multiArgs ? results : results[0]);\n          }\n        } else {\n          // Non-error-first callback\n          resolve(multiArgs ? callbackArgs : callbackArgs[0]);\n        }\n      };\n      \n      // Check for synchronous return that might indicate override\n      const returnValue = fn.call(context, ...args, callback);\n      \n      // If function returns a promise directly, use that\n      if (returnValue && typeof returnValue.then === 'function') {\n        returnValue.then(resolve, reject);\n      }\n    });\n  };\n}\n\n// Custom promisify symbol\npromisifyExpert.custom = Symbol('util.promisify.custom');\n\nfunction promisifyAll(obj, options = {}) {\n  const {\n    suffix = 'Async',\n    filter = (key) => typeof obj[key] === 'function',\n    promisifier = promisifyExpert\n  } = options;\n  \n  const promisified = {};\n  \n  // Copy all properties\n  Object.keys(obj).forEach(key => {\n    promisified[key] = obj[key];\n  });\n  \n  // Add promisified versions\n  Object.keys(obj).forEach(key => {\n    if (filter(key)) {\n      promisified[key + suffix] = promisifier(obj[key].bind(obj), options);\n    }\n  });\n  \n  return promisified;\n}\n\nfunction callbackify(fn) {\n  return function(...args) {\n    const callback = args.pop();\n    \n    if (typeof callback !== 'function') {\n      throw new TypeError('Last argument must be a callback function');\n    }\n    \n    fn.apply(this, args)\n      .then(result => callback(null, result))\n      .catch(error => callback(error));\n  };\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Custom resolver\nfunction weirdCallback(value, callback) {\n  setTimeout(() => {\n    callback({ success: true, data: value * 2 }, null); // Data first, error second!\n  }, 100);\n}\n\nconst weirdPromise = promisifyExpert(weirdCallback, {\n  customResolver: (response, error) => {\n    if (error) throw error;\n    return response.data;\n  }\n});\n\nweirdPromise(21).then(result => console.log('Custom resolver:', result)); // 42\n\n// Promisify all\nconst fs = {\n  readFile(path, cb) { setTimeout(() => cb(null, 'contents'), 50); },\n  writeFile(path, data, cb) { setTimeout(() => cb(null), 50); },\n  unlink(path, cb) { setTimeout(() => cb(null), 50); }\n};\n\nconst fsPromises = promisifyAll(fs);\nconsole.log('Promisified methods:', Object.keys(fsPromises).filter(k => k.endsWith('Async')));\n\nfsPromises.readFileAsync('test.txt')\n  .then(contents => console.log('Read result:', contents));\n\n// Custom promisify symbol usage\nfunction specialFn(callback) {\n  callback(null, 'default');\n}\nspecialFn[promisifyExpert.custom] = () => Promise.resolve('custom implementation');\n\nconst specialPromise = promisifyExpert(specialFn);\nspecialPromise().then(result => console.log('Custom symbol:', result)); // 'custom implementation'\n\n// Callbackify\nasync function asyncFn(x) {\n  return x * 2;\n}\n\nconst callbackFn = callbackify(asyncFn);\ncallbackFn(21, (err, result) => {\n  console.log('Callbackified:', result); // 42\n});",
  interviewTraps: [
      "QUICK REFERENCE:",
      "1. Error-first callback: (error, result) => {}",
      "2. Add callback as last argument",
      "3. Preserve `this` context with .call()",
      "4. Handle multiple results with array",
      "INTERVIEW TIPS:",
      "1. Explain callback convention",
      "2. Show basic implementation first"
  ],
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
