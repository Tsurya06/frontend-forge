/**
 * ============================================
 * CURRYING - Complete Guide
 * ============================================
 * 
 * Topic: Implement currying with all variants
 * Example: sum(1,2)(3)(4,5,6)
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS CURRYING?
 * -----------------
 * Currying is a technique where a function with multiple arguments is transformed
 * into a sequence of functions, each taking a single argument.
 * 
 * Original: f(a, b, c)
 * Curried:  f(a)(b)(c)
 * 
 * WHY USE CURRYING?
 * -----------------
 * 1. Partial Application - Pre-fill some arguments
 * 2. Function Composition - Build complex functions from simple ones
 * 3. Reusability - Create specialized functions from general ones
 * 4. Lazy Evaluation - Delay computation until all arguments are provided
 * 
 * CURRYING VS PARTIAL APPLICATION:
 * ---------------------------------
 * - Currying: Always produces single-argument functions
 * - Partial Application: Can fix any number of arguments
 * 
 * REAL-WORLD EXAMPLES:
 * --------------------
 * 1. Event handlers: onClick = curry(handleEvent)('click')
 * 2. API calls: fetchUser = curry(fetch)(baseUrl)
 * 3. Logging: logError = curry(log)('ERROR')
 */

// ============================================
// KEY CONCEPTS TO UNDERSTAND
// ============================================

/**
 * FUNCTION LENGTH (ARITY):
 * ------------------------
 * fn.length returns the number of expected parameters
 * 
 * IMPORTANT NOTES:
 * - Rest parameters (...args) don't count in length
 * - Default parameters stop the count
 * - This is key for knowing when to execute the function
 */

console.log('=== FUNCTION LENGTH EXAMPLES ===');
console.log('(a, b, c) => {} length:', ((a, b, c) => {}).length);        // 3
console.log('(a, b = 1) => {} length:', ((a, b = 1) => {}).length);      // 1 (stops at default)
console.log('(...args) => {} length:', ((...args) => {}).length);        // 0 (rest doesn't count)
console.log('(a, ...rest) => {} length:', ((a, ...rest) => {}).length);  // 1


// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Basic curry for fixed number of arguments
 * Transforms: add(a, b, c) => add(a)(b)(c)
 */

// Simple 2-argument curry
function curryTwo(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    };
  };
}

// Simple 3-argument curry
function curryThree(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return fn(a, b, c);
      };
    };
  };
}

// Test Beginner Level
console.log('\n=== BEGINNER LEVEL ===');

const add2 = (a, b) => a + b;
const curriedAdd2 = curryTwo(add2);
console.log('curryTwo: add(2)(3) =', curriedAdd2(2)(3)); // 5

const add3 = (a, b, c) => a + b + c;
const curriedAdd3 = curryThree(add3);
console.log('curryThree: add(1)(2)(3) =', curriedAdd3(1)(2)(3)); // 6


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Generic curry that works with any arity
 * Also supports partial application: curry(fn)(a, b)(c)
 */

function curry(fn) {
  // Return a curried version of the function
  return function curried(...args) {
    // If we have enough arguments, call the original function
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    
    // Otherwise, return a function that collects more arguments
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const sum3 = (a, b, c) => a + b + c;
const curriedSum = curry(sum3);

console.log('curry(fn)(1)(2)(3) =', curriedSum(1)(2)(3));      // 6
console.log('curry(fn)(1, 2)(3) =', curriedSum(1, 2)(3));      // 6
console.log('curry(fn)(1)(2, 3) =', curriedSum(1)(2, 3));      // 6
console.log('curry(fn)(1, 2, 3) =', curriedSum(1, 2, 3));      // 6

// Real-world example: Creating specialized functions
const multiply = (a, b, c) => a * b * c;
const curriedMultiply = curry(multiply);
const double = curriedMultiply(2);
const quadruple = double(2);
console.log('quadruple(5) =', quadruple(5)); // 20


// ============================================
// INTERMEDIATE LEVEL - INFINITE CURRYING
// ============================================

/**
 * Infinite Currying: sum(1)(2)(3)...() 
 * Returns result when called with no arguments
 */

function sumInfinite(a) {
  return function(b) {
    // If no argument, return the accumulated sum
    if (b === undefined) {
      return a;
    }
    // Otherwise, continue currying
    return sumInfinite(a + b);
  };
}

console.log('\n=== INFINITE CURRYING (with terminator) ===');
console.log('sum(1)(2)() =', sumInfinite(1)(2)());               // 3
console.log('sum(1)(2)(3)() =', sumInfinite(1)(2)(3)());         // 6
console.log('sum(1)(2)(3)(4)(5)() =', sumInfinite(1)(2)(3)(4)(5)()); // 15


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert Level 1: Infinite currying with valueOf/toString
 * No need for terminator - auto-converts when used in expression
 */

function sum(...args) {
  // Calculate total of all arguments
  const total = args.reduce((acc, val) => acc + val, 0);
  
  // Create the next function
  const fn = (...nextArgs) => {
    // If no arguments, return total
    if (nextArgs.length === 0) {
      return total;
    }
    // Otherwise, add to total and return new function
    return sum(total, ...nextArgs);
  };
  
  // These methods are called when JS needs to convert to primitive
  fn.valueOf = () => total;
  fn.toString = () => String(total);
  
  // Allow accessing value directly
  fn.value = total;
  
  return fn;
}

console.log('\n=== EXPERT LEVEL: valueOf/toString ===');
console.log('sum(1, 2)(3)(4, 5, 6) + 0 =', sum(1, 2)(3)(4, 5, 6) + 0);  // 21
console.log('sum(1)(2)(3).value =', sum(1)(2)(3).value);                 // 6
console.log('`Result: ${sum(1)(2)}`  =', `Result: ${sum(1)(2)}`);        // "Result: 3"
console.log('sum(10)(20)() =', sum(10)(20)());                           // 30


/**
 * Expert Level 2: Curry with placeholder support
 * Allows skipping arguments: curry(fn)(_, 2)(1) same as fn(1, 2)
 */

const _ = Symbol('placeholder'); // Unique placeholder symbol

function curryWithPlaceholder(fn) {
  return function curried(...args) {
    // Check if we have enough non-placeholder arguments in required positions
    const complete = args.length >= fn.length && 
                     !args.slice(0, fn.length).includes(_);
    
    if (complete) {
      return fn.apply(this, args);
    }
    
    return function(...newArgs) {
      // Replace placeholders with new arguments
      const combined = args.map(arg => {
        if (arg === _ && newArgs.length > 0) {
          return newArgs.shift();
        }
        return arg;
      });
      
      // Add any remaining new arguments
      return curried.apply(this, combined.concat(newArgs));
    };
  };
}

console.log('\n=== EXPERT LEVEL: Placeholder Curry ===');

const greet = (greeting, name, punctuation) => `${greeting}, ${name}${punctuation}`;
const curriedGreet = curryWithPlaceholder(greet);

console.log('Normal:', curriedGreet('Hello')('World')('!'));           // Hello, World!
console.log('With placeholder:', curriedGreet(_, 'World')('Hi')('?')); // Hi, World?

const sayHelloTo = curriedGreet('Hello', _, '!');
console.log('Specialized:', sayHelloTo('Alice'));                       // Hello, Alice!


/**
 * Expert Level 3: Curry that preserves `this` context
 */

function curryWithContext(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    
    // Use arrow function to preserve outer `this`
    const self = this;
    return function(...moreArgs) {
      return curried.apply(self, args.concat(moreArgs));
    };
  };
}

console.log('\n=== EXPERT LEVEL: Context Preservation ===');

const obj = {
  multiplier: 10,
  multiply: curryWithContext(function(a, b) {
    return (a + b) * this.multiplier;
  })
};

console.log('With context:', obj.multiply(2)(3)); // 50 (2+3)*10


/**
 * Expert Level 4: Right curry (arguments from right to left)
 */

function curryRight(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args.reverse());
    }
    
    return function(...moreArgs) {
      return curried.apply(this, [...moreArgs, ...args]);
    };
  };
}

console.log('\n=== EXPERT LEVEL: Right Curry ===');

const divide = (a, b) => a / b;
const curriedDivideRight = curryRight(divide);
const divideBy2 = curriedDivideRight(2);
console.log('10 / 2 =', divideBy2(10)); // 5 (10 / 2, not 2 / 10)


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: Functions with no arguments
 */
const noArgs = curry(() => 'no args');
console.log('No args function:', noArgs()); // 'no args'

/**
 * EDGE CASE 2: Functions with rest parameters
 * fn.length is 0 for (...args) => {}
 */
const withRest = (...args) => args.reduce((a, b) => a + b, 0);
console.log('Rest params - fn.length:', withRest.length); // 0
// curry won't work well here - use infinite curry instead

/**
 * EDGE CASE 3: Functions with default parameters
 */
const withDefault = (a, b = 10) => a + b;
console.log('Default params - fn.length:', withDefault.length); // 1
const curriedDefault = curry(withDefault);
console.log('Curried with default:', curriedDefault(5)); // 15

/**
 * EDGE CASE 4: Extra arguments
 */
const addTwo = (a, b) => a + b;
const curriedAddTwo = curry(addTwo);
console.log('Extra args:', curriedAddTwo(1, 2, 3, 4)); // 3 (extras ignored)

/**
 * EDGE CASE 5: Async functions
 */
const asyncFn = async (a, b) => a + b;
const curriedAsync = curry(asyncFn);
curriedAsync(1)(2).then(result => console.log('Async result:', result)); // 3


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Not preserving `this` context
 * Solution: Use .apply(this, args) or arrow functions carefully
 * 
 * MISTAKE 2: Forgetting fn.length doesn't count rest/default params
 * Solution: For variadic functions, use infinite curry
 * 
 * MISTAKE 3: Mutating arguments array
 * Solution: Always use .concat() or spread to create new arrays
 * 
 * MISTAKE 4: Not handling 0-arity functions
 * Solution: Check args.length >= fn.length (>= not just >)
 * 
 * MISTAKE 5: Confusing curry with partial application
 * - Curry: Each call takes one argument
 * - Partial: Fix any number of arguments
 */


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. fn.length gives expected parameter count
 * 2. Rest params and defaults affect fn.length
 * 3. Use .apply(this, args) to preserve context
 * 4. Use .concat() to combine arguments (immutable)
 * 5. valueOf/toString enable auto-conversion
 * 6. Placeholder curry uses Symbol for uniqueness
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with basic 2-arg curry, then generalize
 * 2. Explain difference between curry and partial application
 * 3. Mention real-world use cases
 * 4. Discuss fn.length limitations
 * 5. For infinite curry, explain valueOf/toString trick
 * 
 * TIME COMPLEXITY: O(n) where n is number of curry calls
 * SPACE COMPLEXITY: O(n) for stored arguments
 */


// ============================================
// PRACTICE EXERCISES
// ============================================

/**
 * EXERCISE 1: Implement uncurry - reverse of curry
 * uncurry(curriedFn)(a, b, c) === fn(a, b, c)
 * 
 * EXERCISE 2: Implement pipe with currying
 * pipe(fn1, fn2, fn3)(x) === fn3(fn2(fn1(x)))
 * 
 * EXERCISE 3: Implement compose with currying
 * compose(fn1, fn2, fn3)(x) === fn1(fn2(fn3(x)))
 * 
 * EXERCISE 4: Implement a curried map function
 * map(fn)(array) === array.map(fn)
 * 
 * EXERCISE 5: Create a curried event handler
 * handleEvent(eventType)(handler)(element)
 */

// Exercise solutions
function uncurry(fn) {
  return function(...args) {
    return args.reduce((acc, arg) => acc(arg), fn);
  };
}

const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x);
const compose = (...fns) => (x) => fns.reduceRight((v, fn) => fn(v), x);
const map = curry((fn, arr) => arr.map(fn));

console.log('\n=== EXERCISE SOLUTIONS ===');
console.log('pipe(x+1, x*2)(5) =', pipe(x => x + 1, x => x * 2)(5)); // 12
console.log('compose(x+1, x*2)(5) =', compose(x => x + 1, x => x * 2)(5)); // 11
console.log('map(x*2)([1,2,3]) =', map(x => x * 2)([1, 2, 3])); // [2, 4, 6]


// ============================================
// REAL-WORLD APPLICATIONS
// ============================================

console.log('\n=== REAL-WORLD EXAMPLES ===');

// 1. API URL Builder
const buildUrl = curry((base, endpoint, params) => {
  const query = new URLSearchParams(params).toString();
  return `${base}${endpoint}?${query}`;
});

const apiUrl = buildUrl('https://api.example.com');
const usersEndpoint = apiUrl('/users');
console.log('API URL:', usersEndpoint({ page: 1, limit: 10 }));

// 2. Logger with levels
const log = curry((level, message, data) => {
  console.log(`[${level}] ${message}`, data || '');
});

const logError = log('ERROR');
const logInfo = log('INFO');
logError('Something went wrong', { code: 500 });
logInfo('User logged in', { userId: 123 });

// 3. Validation
const validate = curry((validator, errorMsg, value) => {
  return validator(value) ? { valid: true, value } : { valid: false, error: errorMsg };
});

const isNotEmpty = validate(v => v && v.length > 0, 'Field is required');
const isEmail = validate(v => /\S+@\S+/.test(v), 'Invalid email');

console.log('Validation:', isNotEmpty('hello')); // { valid: true, value: 'hello' }
console.log('Validation:', isEmail('test@test.com')); // { valid: true }


module.exports = {
  curry,
  curryWithPlaceholder,
  curryWithContext,
  curryRight,
  sum,
  sumInfinite,
  _
};
