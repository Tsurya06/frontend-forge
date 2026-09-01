import type { CodingProblem } from "../../types";

export const curryingProblem: CodingProblem = {
  id: "coding-currying",
  title: "Implement Function Currying",
  difficulty: "Advanced",
  category: "Coding",
  tags: [
    "currying",
    "closures",
    "higher-order-functions",
    "functional-programming",
    "recursion",
  ],

  problem: `Implement a curry function that transforms a function so it can be called with any combination of arguments. For example, if the original function takes three arguments, the curried version can be called as f(1)(2)(3), f(1, 2)(3), f(1)(2, 3), or f(1, 2, 3) — all producing the same result.

The key challenge is handling variable-length argument lists. Unlike simple currying where each call provides exactly one argument, your implementation must accumulate arguments across multiple calls and invoke the original function only when enough arguments have been collected.

This is a frequently asked interview question that tests understanding of closures, the arguments object (or rest parameters), Function.length, and recursive higher-order function patterns.`,

  requirements: [
    "Accept a function and return a curried version",
    "Support partial application with any number of arguments per call",
    "Invoke the original function when sufficient arguments are collected",
    "Preserve the original function's behavior and return value",
    "Handle functions with zero arguments correctly",
    "Support chaining of arbitrary depth: curry(fn)(a)(b)(c) and curry(fn)(a, b, c)",
  ],

  examples: [
    {
      input: `const add = (a, b, c) => a + b + c;\nconst curriedAdd = curry(add);\ncurriedAdd(1)(2)(3)`,
      output: "6",
      explanation:
        "Each call provides one argument; the original function is called when all three are collected.",
    },
    {
      input: `const add = (a, b, c) => a + b + c;\nconst curriedAdd = curry(add);\ncurriedAdd(1, 2)(3)`,
      output: "6",
      explanation:
        "First call provides two arguments, second provides the remaining one.",
    },
    {
      input: `const multiply = (a, b, c, d) => a * b * c * d;\nconst cm = curry(multiply);\ncm(2)(3)(4)(5)`,
      output: "120",
      explanation:
        "Works with functions of any arity, collecting args until fn.length is reached.",
    },
  ],

  edgeCases: [
    "Function with zero parameters (should invoke immediately)",
    "Providing more arguments than the function expects",
    "Calling with no arguments (should return a function waiting for args)",
    "Functions that use default parameters (fn.length doesn't count defaults)",
  ],

  naiveApproach: `A naive approach might use a fixed number of nested closures matching the arity. For example, for a 3-argument function, you'd return a => b => c => fn(a, b, c). This fails for variable arity and doesn't support passing multiple arguments at once. You'd need a different wrapper for every function length, making it impractical.`,

  optimalApproach: `The optimal approach uses a recursive helper that accumulates arguments in a closure. The curry function reads fn.length to know how many arguments are needed. It returns a new function that collects arguments via rest parameters and concatenates them with previously accumulated args. If the total collected args meet or exceed fn.length, call the original function with all args. Otherwise, recursively return another curried function that remembers the accumulated args.

This recursive pattern naturally handles all calling styles because each returned function is itself a curry-wrapper that checks the accumulated count. The closure captures the accumulated args array, so no external state is needed. The recursion terminates when enough arguments are gathered, at which point the original function is invoked.`,

  implementation: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return function (...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

// Usage examples
const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3));       // 6
console.log(curriedSum(1, 2)(3));       // 6
console.log(curriedSum(1)(2, 3));       // 6
console.log(curriedSum(1, 2, 3));       // 6

const multiply = (a, b, c, d) => a * b * c * d;
const curriedMul = curry(multiply);

console.log(curriedMul(2)(3)(4)(5));    // 120
console.log(curriedMul(2, 3)(4, 5));    // 120

// Partial application reuse
const add10 = curriedSum(10);
console.log(add10(20)(30));             // 60
console.log(add10(5, 5));              // 20`,

  implementationTS: `function curry<T extends (...args: any[]) => any>(fn: T): Function {
  return function curried(this: unknown, ...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return function (this: unknown, ...nextArgs: unknown[]): unknown {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

const sum = (a: number, b: number, c: number): number => a + b + c;
const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3));       // 6
console.log(curriedSum(1, 2)(3));       // 6
console.log(curriedSum(1)(2, 3));       // 6`,

  theoryAndConcepts:
    "WHAT IS CURRYING?\n-----------------\nCurrying is a technique where a function with multiple arguments is transformed\ninto a sequence of functions, each taking a single argument.\n\nOriginal: f(a, b, c)\nCurried:  f(a)(b)(c)\n\nWHY USE CURRYING?\n-----------------\n1. Partial Application - Pre-fill some arguments\n2. Function Composition - Build complex functions from simple ones\n3. Reusability - Create specialized functions from general ones\n4. Lazy Evaluation - Delay computation until all arguments are provided\n\nCURRYING VS PARTIAL APPLICATION:\n---------------------------------\n- Currying: Always produces single-argument functions\n- Partial Application: Can fix any number of arguments\n\nREAL-WORLD EXAMPLES:\n--------------------\n1. Event handlers: onClick = curry(handleEvent)('click')\n2. API calls: fetchUser = curry(fetch)(baseUrl)\n3. Logging: logError = curry(log)('ERROR')",
  beginnerApproach:
    "Beginner: Basic curry for fixed number of arguments\nTransforms: add(a, b, c) => add(a)(b)(c)",
  beginnerImplementation:
    "// Simple 2-argument curry\nfunction curryTwo(fn) {\n  return function(a) {\n    return function(b) {\n      return fn(a, b);\n    };\n  };\n}\n\n// Simple 3-argument curry\nfunction curryThree(fn) {\n  return function(a) {\n    return function(b) {\n      return function(c) {\n        return fn(a, b, c);\n      };\n    };\n  };\n}\n\n// Test Beginner Level\nconsole.log('\\n=== BEGINNER LEVEL ===');\n\nconst add2 = (a, b) => a + b;\nconst curriedAdd2 = curryTwo(add2);\nconsole.log('curryTwo: add(2)(3) =', curriedAdd2(2)(3)); // 5\n\nconst add3 = (a, b, c) => a + b + c;\nconst curriedAdd3 = curryThree(add3);\nconsole.log('curryThree: add(1)(2)(3) =', curriedAdd3(1)(2)(3)); // 6",
  intermediateApproach:
    "Intermediate: Generic curry that works with any arity\nAlso supports partial application: curry(fn)(a, b)(c)",
  intermediateImplementation:
    "function curry(fn) {\n  // Return a curried version of the function\n  return function curried(...args) {\n    // If we have enough arguments, call the original function\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    \n    // Otherwise, return a function that collects more arguments\n    return function(...moreArgs) {\n      return curried.apply(this, args.concat(moreArgs));\n    };\n  };\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst sum3 = (a, b, c) => a + b + c;\nconst curriedSum = curry(sum3);\n\nconsole.log('curry(fn)(1)(2)(3) =', curriedSum(1)(2)(3));      // 6\nconsole.log('curry(fn)(1, 2)(3) =', curriedSum(1, 2)(3));      // 6\nconsole.log('curry(fn)(1)(2, 3) =', curriedSum(1)(2, 3));      // 6\nconsole.log('curry(fn)(1, 2, 3) =', curriedSum(1, 2, 3));      // 6\n\n// Real-world example: Creating specialized functions\nconst multiply = (a, b, c) => a * b * c;\nconst curriedMultiply = curry(multiply);\nconst double = curriedMultiply(2);\nconst quadruple = double(2);\nconsole.log('quadruple(5) =', quadruple(5)); // 20",
  expertApproach:
    "Expert Level 1: Infinite currying with valueOf/toString\nNo need for terminator - auto-converts when used in expression\n\n\nExpert Level 2: Curry with placeholder support\nAllows skipping arguments: curry(fn)(_, 2)(1) same as fn(1, 2)\n\n\nExpert Level 3: Curry that preserves `this` context\n\n\nExpert Level 4: Right curry (arguments from right to left)",
  expertImplementation:
    "function sum(...args) {\n  // Calculate total of all arguments\n  const total = args.reduce((acc, val) => acc + val, 0);\n  \n  // Create the next function\n  const fn = (...nextArgs) => {\n    // If no arguments, return total\n    if (nextArgs.length === 0) {\n      return total;\n    }\n    // Otherwise, add to total and return new function\n    return sum(total, ...nextArgs);\n  };\n  \n  // These methods are called when JS needs to convert to primitive\n  fn.valueOf = () => total;\n  fn.toString = () => String(total);\n  \n  // Allow accessing value directly\n  fn.value = total;\n  \n  return fn;\n}\n\nconsole.log('\\n=== EXPERT LEVEL: valueOf/toString ===');\nconsole.log('sum(1, 2)(3)(4, 5, 6) + 0 =', sum(1, 2)(3)(4, 5, 6) + 0);  // 21\nconsole.log('sum(1)(2)(3).value =', sum(1)(2)(3).value);                 // 6\nconsole.log('`Result: ${sum(1)(2)}`  =', `Result: ${sum(1)(2)}`);        // \"Result: 3\"\nconsole.log('sum(10)(20)() =', sum(10)(20)());                           // 30\n\n\n\nconst _ = Symbol('placeholder'); // Unique placeholder symbol\n\nfunction curryWithPlaceholder(fn) {\n  return function curried(...args) {\n    // Check if we have enough non-placeholder arguments in required positions\n    const complete = args.length >= fn.length && \n                     !args.slice(0, fn.length).includes(_);\n    \n    if (complete) {\n      return fn.apply(this, args);\n    }\n    \n    return function(...newArgs) {\n      // Replace placeholders with new arguments\n      const combined = args.map(arg => {\n        if (arg === _ && newArgs.length > 0) {\n          return newArgs.shift();\n        }\n        return arg;\n      });\n      \n      // Add any remaining new arguments\n      return curried.apply(this, combined.concat(newArgs));\n    };\n  };\n}\n\nconsole.log('\\n=== EXPERT LEVEL: Placeholder Curry ===');\n\nconst greet = (greeting, name, punctuation) => `${greeting}, ${name}${punctuation}`;\nconst curriedGreet = curryWithPlaceholder(greet);\n\nconsole.log('Normal:', curriedGreet('Hello')('World')('!'));           // Hello, World!\nconsole.log('With placeholder:', curriedGreet(_, 'World')('Hi')('?')); // Hi, World?\n\nconst sayHelloTo = curriedGreet('Hello', _, '!');\nconsole.log('Specialized:', sayHelloTo('Alice'));                       // Hello, Alice!\n\n\n\nfunction curryWithContext(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    \n    // Use arrow function to preserve outer `this`\n    const self = this;\n    return function(...moreArgs) {\n      return curried.apply(self, args.concat(moreArgs));\n    };\n  };\n}\n\nconsole.log('\\n=== EXPERT LEVEL: Context Preservation ===');\n\nconst obj = {\n  multiplier: 10,\n  multiply: curryWithContext(function(a, b) {\n    return (a + b) * this.multiplier;\n  })\n};\n\nconsole.log('With context:', obj.multiply(2)(3)); // 50 (2+3)*10\n\n\n\nfunction curryRight(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args.reverse());\n    }\n    \n    return function(...moreArgs) {\n      return curried.apply(this, [...moreArgs, ...args]);\n    };\n  };\n}\n\nconsole.log('\\n=== EXPERT LEVEL: Right Curry ===');\n\nconst divide = (a, b) => a / b;\nconst curriedDivideRight = curryRight(divide);\nconst divideBy2 = curriedDivideRight(2);\nconsole.log('10 / 2 =', divideBy2(10)); // 5 (10 / 2, not 2 / 10)",
  interviewTraps: [
    "console.log('\\n=== EDGE CASES ===');",
    "EDGE CASE 1: Functions with no arguments",
    "const noArgs = curry(() => 'no args');",
    "console.log('No args function:', noArgs()); // 'no args'",
    "EDGE CASE 2: Functions with rest parameters",
    "fn.length is 0 for (...args) => {}",
    "const withRest = (...args) => args.reduce((a, b) => a + b, 0);",
    "console.log('Rest params - fn.length:', withRest.length); // 0",
  ],
  practiceExercises: [
    "EXERCISE 1: Implement uncurry - reverse of curry",
    "uncurry(curriedFn)(a, b, c) === fn(a, b, c)",
    "EXERCISE 2: Implement pipe with currying",
    "pipe(fn1, fn2, fn3)(x) === fn3(fn2(fn1(x)))",
    "EXERCISE 3: Implement compose with currying",
    "compose(fn1, fn2, fn3)(x) === fn1(fn2(fn3(x)))",
    "EXERCISE 4: Implement a curried map function",
    "map(fn)(array) === array.map(fn)",
  ],
  stepByStep: [
    "Read fn.length to determine how many arguments the original function expects.",
    "Return a new function (curried) that collects arguments via rest parameters.",
    "Inside curried, check if collected args.length >= fn.length.",
    "If enough args are collected, call fn.apply(this, args) to invoke the original function.",
    "If not enough, return a new function that captures current args in its closure.",
    "The new function concatenates its own args with the previously accumulated args and calls curried recursively.",
    "This recursion continues until sufficient arguments are gathered.",
  ],

  timeComplexity:
    "O(n) where n is the number of arguments (each call concatenates and checks the array).",
  spaceComplexity:
    "O(n) for storing accumulated arguments in the closure chain.",

  commonMistakes: [
    "Using fn.length without understanding it doesn't count rest params or default params",
    "Not preserving the `this` context when invoking the original function",
    "Creating a new array copy each time instead of concatenating (leads to stale references)",
    "Forgetting to handle the case where all arguments are passed at once",
  ],

  followUps: [
    "How would you implement infinite currying where sum(1)(2)(3)() returns 6 (call with no args to finalize)?",
    "How would you implement a placeholder-based curry that allows skipping arguments?",
    "What is the difference between currying and partial application?",
  ],
};
