/**
 * ============================================
 * PROMISIFY - Complete Guide
 * ============================================
 * 
 * Topic: Implement a promisify function that converts callback-based functions to promises
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS PROMISIFY?
 * ------------------
 * Converts callback-based async functions to Promise-based ones.
 * 
 * CALLBACK PATTERN (Node.js style):
 * fn(arg1, arg2, (error, result) => { ... })
 * 
 * PROMISE PATTERN:
 * fn(arg1, arg2).then(result => { ... }).catch(error => { ... })
 * 
 * WHY PROMISIFY?
 * --------------
 * 1. Cleaner async/await syntax
 * 2. Better error handling
 * 3. Easier composition
 * 4. Modern API design
 * 
 * NODE.JS:
 * --------
 * Built-in: const { promisify } = require('util');
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Basic promisify
 * Assumes callback is last argument with (error, result) signature
 */
function promisifyBeginner(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      // Add callback as last argument
      fn(...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

// Simulate callback-based function
function readFileCallback(path, callback) {
  setTimeout(() => {
    if (path === 'error') {
      callback(new Error('File not found'));
    } else {
      callback(null, `Contents of ${path}`);
    }
  }, 100);
}

const readFilePromise = promisifyBeginner(readFileCallback);

readFilePromise('test.txt')
  .then(contents => console.log('Success:', contents))
  .catch(error => console.log('Error:', error.message));


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Handle multiple callback arguments
 * Some callbacks return (error, result1, result2, ...)
 */
function promisifyIntermediate(fn, options = {}) {
  const { multiArgs = false } = options;
  
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (error, ...results) => {
        if (error) {
          reject(error);
        } else if (multiArgs) {
          // Return array of all results
          resolve(results);
        } else {
          // Return just the first result
          resolve(results[0]);
        }
      });
    });
  };
}

/**
 * Intermediate: Promisify with context binding
 */
function promisifyWithContext(fn, context) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn.call(context, ...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

// Function that returns multiple values
function getCoordinates(address, callback) {
  setTimeout(() => {
    callback(null, 40.7128, -74.0060); // lat, lng
  }, 100);
}

const getCoordsPromise = promisifyIntermediate(getCoordinates, { multiArgs: true });

getCoordsPromise('New York')
  .then(([lat, lng]) => console.log('Coordinates:', lat, lng));

// With context
const database = {
  connection: 'DB_CONNECTION',
  query(sql, callback) {
    setTimeout(() => {
      callback(null, `Result from ${this.connection}: ${sql}`);
    }, 100);
  }
};

const queryPromise = promisifyWithContext(database.query, database);
queryPromise('SELECT * FROM users')
  .then(result => console.log('Query result:', result));


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured promisify with custom resolver
 */
function promisifyExpert(fn, options = {}) {
  const {
    multiArgs = false,
    errorFirst = true,     // Error-first callback convention
    thisArg = undefined,   // Context binding
    customResolver = null  // Custom (error, ...results) => value
  } = options;
  
  // Allow promisify.custom symbol (like Node.js)
  if (fn[promisifyExpert.custom]) {
    return fn[promisifyExpert.custom];
  }
  
  return function promisified(...args) {
    const context = thisArg !== undefined ? thisArg : this;
    
    return new Promise((resolve, reject) => {
      const callback = (...callbackArgs) => {
        // Custom resolver
        if (customResolver) {
          try {
            const result = customResolver(...callbackArgs);
            resolve(result);
          } catch (error) {
            reject(error);
          }
          return;
        }
        
        if (errorFirst) {
          const [error, ...results] = callbackArgs;
          
          if (error) {
            reject(error);
          } else {
            resolve(multiArgs ? results : results[0]);
          }
        } else {
          // Non-error-first callback
          resolve(multiArgs ? callbackArgs : callbackArgs[0]);
        }
      };
      
      // Check for synchronous return that might indicate override
      const returnValue = fn.call(context, ...args, callback);
      
      // If function returns a promise directly, use that
      if (returnValue && typeof returnValue.then === 'function') {
        returnValue.then(resolve, reject);
      }
    });
  };
}

// Custom promisify symbol
promisifyExpert.custom = Symbol('util.promisify.custom');

/**
 * Expert: Promisify all methods of an object
 */
function promisifyAll(obj, options = {}) {
  const {
    suffix = 'Async',
    filter = (key) => typeof obj[key] === 'function',
    promisifier = promisifyExpert
  } = options;
  
  const promisified = {};
  
  // Copy all properties
  Object.keys(obj).forEach(key => {
    promisified[key] = obj[key];
  });
  
  // Add promisified versions
  Object.keys(obj).forEach(key => {
    if (filter(key)) {
      promisified[key + suffix] = promisifier(obj[key].bind(obj), options);
    }
  });
  
  return promisified;
}

/**
 * Expert: Callbackify (reverse of promisify)
 */
function callbackify(fn) {
  return function(...args) {
    const callback = args.pop();
    
    if (typeof callback !== 'function') {
      throw new TypeError('Last argument must be a callback function');
    }
    
    fn.apply(this, args)
      .then(result => callback(null, result))
      .catch(error => callback(error));
  };
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Custom resolver
function weirdCallback(value, callback) {
  setTimeout(() => {
    callback({ success: true, data: value * 2 }, null); // Data first, error second!
  }, 100);
}

const weirdPromise = promisifyExpert(weirdCallback, {
  customResolver: (response, error) => {
    if (error) throw error;
    return response.data;
  }
});

weirdPromise(21).then(result => console.log('Custom resolver:', result)); // 42

// Promisify all
const fs = {
  readFile(path, cb) { setTimeout(() => cb(null, 'contents'), 50); },
  writeFile(path, data, cb) { setTimeout(() => cb(null), 50); },
  unlink(path, cb) { setTimeout(() => cb(null), 50); }
};

const fsPromises = promisifyAll(fs);
console.log('Promisified methods:', Object.keys(fsPromises).filter(k => k.endsWith('Async')));

fsPromises.readFileAsync('test.txt')
  .then(contents => console.log('Read result:', contents));

// Custom promisify symbol usage
function specialFn(callback) {
  callback(null, 'default');
}
specialFn[promisifyExpert.custom] = () => Promise.resolve('custom implementation');

const specialPromise = promisifyExpert(specialFn);
specialPromise().then(result => console.log('Custom symbol:', result)); // 'custom implementation'

// Callbackify
async function asyncFn(x) {
  return x * 2;
}

const callbackFn = callbackify(asyncFn);
callbackFn(21, (err, result) => {
  console.log('Callbackified:', result); // 42
});


// ============================================
// PRACTICAL EXAMPLES
// ============================================

console.log('\n=== PRACTICAL EXAMPLES ===');

// 1. Promisify setTimeout
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 2. Promisify event listener (once)
function eventToPromise(emitter, eventName) {
  return new Promise((resolve, reject) => {
    const onSuccess = (data) => {
      emitter.removeListener('error', onError);
      resolve(data);
    };
    const onError = (error) => {
      emitter.removeListener(eventName, onSuccess);
      reject(error);
    };
    
    emitter.once(eventName, onSuccess);
    emitter.once('error', onError);
  });
}

// 3. Promisify XMLHttpRequest
function xhr(method, url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open(method, url);
    req.onload = () => {
      if (req.status >= 200 && req.status < 300) {
        resolve(req.response);
      } else {
        reject(new Error(`HTTP ${req.status}`));
      }
    };
    req.onerror = () => reject(new Error('Network error'));
    req.send();
  });
}

// 4. Promisify geolocation
function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Error-first callback: (error, result) => {}
 * 2. Add callback as last argument
 * 3. Preserve `this` context with .call()
 * 4. Handle multiple results with array
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Explain callback convention
 * 2. Show basic implementation first
 * 3. Discuss context preservation
 * 4. Mention Node.js util.promisify
 * 
 * NODE.JS BUILT-IN:
 * -----------------
 * const { promisify } = require('util');
 * const readFile = promisify(fs.readFile);
 */


module.exports = {
  promisifyBeginner,
  promisifyIntermediate,
  promisifyWithContext,
  promisifyExpert,
  promisifyAll,
  callbackify,
  delay
};
