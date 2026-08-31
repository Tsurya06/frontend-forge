import type { CodingProblem } from '../../types';

export const calculatorChainingProblem: CodingProblem = {
  id: 'coding-calculator',
  title: 'Calculator with Method Chaining',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['method-chaining', 'fluent-api', 'oop', 'design-patterns', 'this'],

  problem: `Implement a calculator function/class that supports method chaining for arithmetic operations. The API should allow expressions like \`calc().add(10).subtract(5).multiply(20).divide(2).getResult()\` which evaluates to 50. Each arithmetic method should return the calculator instance to enable chaining, and a final \`getResult()\` method should return the computed value.

Method chaining (also called a fluent interface) is a common design pattern used in libraries like jQuery, Lodash, and builder patterns throughout JavaScript. Understanding how to implement it requires knowledge of \`this\` binding, object-oriented design, and how returning the instance from methods enables chainable APIs.

Your solution should handle division by zero gracefully, support an optional initial value, and provide a reset mechanism. The implementation can use either a class, a factory function with closures, or a constructor function — each approach demonstrates different JavaScript fundamentals.`,

  requirements: [
    'Support add(n), subtract(n), multiply(n), divide(n) operations',
    'Each arithmetic method returns the instance for chaining',
    'getResult() returns the current computed value',
    'Support optional initial value: calc(10).add(5) starts from 10',
    'Default initial value is 0 if not provided',
    'Handle division by zero gracefully (throw Error or return Infinity)',
    'Provide a reset() method that returns the value to the initial state',
  ],

  examples: [
    {
      input: `calc().add(10).subtract(5).multiply(20).divide(2).getResult()`,
      output: `50`,
      explanation: 'Starting from 0: +10=10, -5=5, *20=100, /2=50.',
    },
    {
      input: `calc(100).divide(10).subtract(5).getResult()`,
      output: `5`,
      explanation: 'Starting from 100: /10=10, -5=5.',
    },
    {
      input: `const c = calc(10);\nc.add(5).getResult(); // 15\nc.reset().getResult(); // 10`,
      output: `15 then 10 after reset`,
      explanation: 'The calculator maintains state across operations and can be reset to its initial value.',
    },
  ],

  edgeCases: [
    'Division by zero should throw an Error with a descriptive message',
    'Chaining many operations in sequence',
    'Using the same calculator instance multiple times',
    'Calling getResult() without any operations returns the initial value',
    'Operations with negative numbers',
    'Operations with floating point numbers (precision considerations)',
  ],

  naiveApproach: `A naive approach stores the value in a global or closure variable and has standalone functions that modify it. This doesn't support multiple independent calculator instances and isn't chainable. Another common mistake is forgetting to return \`this\` from arithmetic methods, breaking the chain. Some developers try returning the value directly from each method instead of the instance, which makes the API non-chainable.`,

  optimalApproach: `The optimal approach creates a factory function that returns an object with a private value (via closure) and methods that mutate the value and return the object itself. Alternatively, a class-based approach defines methods on the prototype that modify \`this.value\` and return \`this\`.

The factory function approach is preferred in interviews because it demonstrates closures and encapsulation without the \`new\` keyword. The key insight is that every arithmetic method must end with \`return this\` (or return the object in the factory pattern). The \`getResult()\` method is the terminal operation that breaks the chain by returning a primitive value. The \`reset()\` method restores the value to the initial parameter and returns \`this\` so more operations can follow a reset.`,

  implementation: `function calc(initialValue = 0) {
  let value = initialValue;

  const calculator = {
    add(n) {
      value += n;
      return calculator;
    },
    subtract(n) {
      value -= n;
      return calculator;
    },
    multiply(n) {
      value *= n;
      return calculator;
    },
    divide(n) {
      if (n === 0) {
        throw new Error('Division by zero');
      }
      value /= n;
      return calculator;
    },
    reset() {
      value = initialValue;
      return calculator;
    },
    getResult() {
      return value;
    },
  };

  return calculator;
}

// Class-based alternative
class Calculator {
  constructor(initialValue = 0) {
    this.initialValue = initialValue;
    this.value = initialValue;
  }

  add(n) {
    this.value += n;
    return this;
  }

  subtract(n) {
    this.value -= n;
    return this;
  }

  multiply(n) {
    this.value *= n;
    return this;
  }

  divide(n) {
    if (n === 0) throw new Error('Division by zero');
    this.value /= n;
    return this;
  }

  reset() {
    this.value = this.initialValue;
    return this;
  }

  getResult() {
    return this.value;
  }
}

// Usage — factory function
console.log(calc().add(10).subtract(5).multiply(20).divide(2).getResult());
// 50

console.log(calc(100).divide(10).subtract(5).getResult());
// 5

const myCalc = calc(10);
console.log(myCalc.add(5).multiply(2).getResult());
// 30
console.log(myCalc.reset().getResult());
// 10

// Usage — class
const classCalc = new Calculator(10);
console.log(classCalc.add(5).subtract(3).multiply(4).getResult());
// 48
console.log(classCalc.reset().add(1).getResult());
// 11

// Division by zero
try {
  calc(10).divide(0);
} catch (e) {
  console.log(e.message); // 'Division by zero'
}`,

  stepByStep: [
    'Create a factory function (or class) that accepts an optional initial value (default 0).',
    'Store the current value in a closure variable (or instance property).',
    'Implement add(n): add n to value, return the calculator object/this.',
    'Implement subtract(n): subtract n from value, return the calculator object/this.',
    'Implement multiply(n): multiply value by n, return the calculator object/this.',
    'Implement divide(n): check for zero, divide value by n, return the calculator object/this.',
    'Implement reset(): restore value to the initial value, return the calculator object/this.',
    'Implement getResult(): return the current value (terminal operation, breaks the chain).',
  ],

  timeComplexity: 'O(1) per operation — each method performs a single arithmetic operation.',
  spaceComplexity: 'O(1) — only stores the current value and initial value.',

  commonMistakes: [
    'Forgetting to return `this` (or the object) from arithmetic methods, breaking the chain',
    'Not handling division by zero — silently producing Infinity or NaN',
    'Using arrow functions in the class approach — arrow methods don\'t bind `this` to the instance',
    'Not storing the initial value separately for the reset() functionality',
  ],

  followUps: [
    'How would you add an undo() method that reverts the last operation?',
    'How would you implement lazy evaluation — storing operations and computing only at getResult()?',
    'How is method chaining used in popular libraries like jQuery, Lodash, and D3?',
    'How would you make the calculator immutable, returning a new instance from each operation?',
  ],
};
