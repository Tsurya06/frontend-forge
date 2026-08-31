import type { CodingProblem } from '../../types';

export const curryingProblem: CodingProblem = {
  id: 'coding-currying',
  title: 'Implement Function Currying',
  difficulty: 'Advanced',
  category: 'Coding',
  tags: ['currying', 'closures', 'higher-order-functions', 'functional-programming', 'recursion'],

  problem: `Implement a curry function that transforms a function so it can be called with any combination of arguments. For example, if the original function takes three arguments, the curried version can be called as f(1)(2)(3), f(1, 2)(3), f(1)(2, 3), or f(1, 2, 3) — all producing the same result.

The key challenge is handling variable-length argument lists. Unlike simple currying where each call provides exactly one argument, your implementation must accumulate arguments across multiple calls and invoke the original function only when enough arguments have been collected.

This is a frequently asked interview question that tests understanding of closures, the arguments object (or rest parameters), Function.length, and recursive higher-order function patterns.`,

  requirements: [
    'Accept a function and return a curried version',
    'Support partial application with any number of arguments per call',
    'Invoke the original function when sufficient arguments are collected',
    'Preserve the original function\'s behavior and return value',
    'Handle functions with zero arguments correctly',
    'Support chaining of arbitrary depth: curry(fn)(a)(b)(c) and curry(fn)(a, b, c)',
  ],

  examples: [
    {
      input: `const add = (a, b, c) => a + b + c;\nconst curriedAdd = curry(add);\ncurriedAdd(1)(2)(3)`,
      output: '6',
      explanation: 'Each call provides one argument; the original function is called when all three are collected.',
    },
    {
      input: `const add = (a, b, c) => a + b + c;\nconst curriedAdd = curry(add);\ncurriedAdd(1, 2)(3)`,
      output: '6',
      explanation: 'First call provides two arguments, second provides the remaining one.',
    },
    {
      input: `const multiply = (a, b, c, d) => a * b * c * d;\nconst cm = curry(multiply);\ncm(2)(3)(4)(5)`,
      output: '120',
      explanation: 'Works with functions of any arity, collecting args until fn.length is reached.',
    },
  ],

  edgeCases: [
    'Function with zero parameters (should invoke immediately)',
    'Providing more arguments than the function expects',
    'Calling with no arguments (should return a function waiting for args)',
    'Functions that use default parameters (fn.length doesn\'t count defaults)',
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

  stepByStep: [
    'Read fn.length to determine how many arguments the original function expects.',
    'Return a new function (curried) that collects arguments via rest parameters.',
    'Inside curried, check if collected args.length >= fn.length.',
    'If enough args are collected, call fn.apply(this, args) to invoke the original function.',
    'If not enough, return a new function that captures current args in its closure.',
    'The new function concatenates its own args with the previously accumulated args and calls curried recursively.',
    'This recursion continues until sufficient arguments are gathered.',
  ],

  timeComplexity: 'O(n) where n is the number of arguments (each call concatenates and checks the array).',
  spaceComplexity: 'O(n) for storing accumulated arguments in the closure chain.',

  commonMistakes: [
    'Using fn.length without understanding it doesn\'t count rest params or default params',
    'Not preserving the `this` context when invoking the original function',
    'Creating a new array copy each time instead of concatenating (leads to stale references)',
    'Forgetting to handle the case where all arguments are passed at once',
  ],

  followUps: [
    'How would you implement infinite currying where sum(1)(2)(3)() returns 6 (call with no args to finalize)?',
    'How would you implement a placeholder-based curry that allows skipping arguments?',
    'What is the difference between currying and partial application?',
  ],
};
