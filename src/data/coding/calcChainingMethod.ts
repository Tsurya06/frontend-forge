import type { CodingProblem } from '../../types';

export const calcChainingMethodProblem: CodingProblem = {
  id: 'coding-calc-chaining-method',
  title: 'Implement Calculator Method Chaining (Fluent API)',
  difficulty: 'Beginner',
  category: 'Coding',
  tags: ['javascript', 'method-chaining', 'closures', 'oop', 'fluent-interface', 'calculator'],

  problem: `Implement a calculator function \`calc(initialValue = 0)\` that supports continuous method chaining:
\`\`\`js
calc(0).add(10).subtract(5).multiply(20).divide(2).getResult(); // returns 45
\`\`\`

Requirements:
1. \`calc(initialValue)\`: Initializes the calculator with an optional initial number (defaulting to 0).
2. Supports mathematical operations:
   - \`.add(n)\`
   - \`.subtract(n)\`
   - \`.multiply(n)\`
   - \`.divide(n)\` (handling division by zero by throwing an Error or returning NaN/Infinity gracefully)
   - \`.power(n)\`
   - \`.reset()\` (resets accumulator to 0 or initial value)
3. \`.getResult()\` (or \`.value\` / \`.valueOf()\` / \`.toString()\`) returns the final computed numerical value.
4. The calculation must support both immutable (returning new instances on each step) and stateful/builder patterns.`,

  requirements: [
    'Support chaining of add, subtract, multiply, divide, power, reset',
    'Terminate chain with getResult() to extract numeric value',
    'Support valueOf() and toString() for implicit type coercion',
    'Handle division by zero gracefully with descriptive Error',
    'Preserve numerical precision where possible',
  ],

  examples: [
    {
      input: `calc().add(10).subtract(5).multiply(20).divide(2).getResult()`,
      output: '50',
      explanation: '(0 + 10 - 5) * 20 / 2 = 5 * 20 / 2 = 100 / 2 = 50',
    },
    {
      input: `calc(5).multiply(4).add(10).divide(5).getResult()`,
      output: '6',
      explanation: '(5 * 4 + 10) / 5 = (20 + 10) / 5 = 30 / 5 = 6',
    },
  ],

  edgeCases: [
    'Division by zero (throw Error: "Division by zero is undefined")',
    'Chaining without initial value (defaults to 0)',
    'Floating point precision (e.g. 0.1 + 0.2 handling)',
    'Calling getResult multiple times or continuing chain after getResult',
  ],

  naiveApproach: `A naive approach modifies a global variable, which breaks if multiple calculator instances run concurrently in the application.`,

  optimalApproach: `The optimal approach encapsulates the accumulator in an object with methods that each return \`this\` (or return a new calculator instance for immutability):
1. Inside \`calc(initialValue = 0)\`, define an internal object holding \`currentValue\`.
2. Each method performs the arithmetic and returns \`this\` (fluent interface).
3. Implement \`getResult()\` returning \`currentValue\`.
4. Add \`valueOf()\` and \`[Symbol.toPrimitive]()\` so \`+calc(10).add(5)\` automatically coerces to \`15\`.`,

  implementation: `function calc(initialValue = 0) {
  let value = Number(initialValue) || 0;

  const calculator = {
    add(n) {
      value += Number(n) || 0;
      return this;
    },
    subtract(n) {
      value -= Number(n) || 0;
      return this;
    },
    multiply(n) {
      value *= Number(n) || 0;
      return this;
    },
    divide(n) {
      const divisor = Number(n);
      if (divisor === 0) {
        throw new Error('Division by zero is undefined');
      }
      value /= divisor;
      return this;
    },
    power(n) {
      value = Math.pow(value, Number(n) || 0);
      return this;
    },
    reset(newVal = 0) {
      value = newVal;
      return this;
    },
    getResult() {
      return value;
    },
    valueOf() {
      return value;
    },
    toString() {
      return String(value);
    }
  };

  return calculator;
}`,

  implementationTS: `export interface Calculator {
  add(n: number): this;
  subtract(n: number): this;
  multiply(n: number): this;
  divide(n: number): this;
  power(n: number): this;
  reset(newVal?: number): this;
  getResult(): number;
  valueOf(): number;
  toString(): string;
}

export function calc(initialValue: number = 0): Calculator {
  let value = Number(initialValue) || 0;

  const calculator: Calculator = {
    add(n: number) {
      value += Number(n) || 0;
      return this;
    },
    subtract(n: number) {
      value -= Number(n) || 0;
      return this;
    },
    multiply(n: number) {
      value *= Number(n) || 0;
      return this;
    },
    divide(n: number) {
      const divisor = Number(n);
      if (divisor === 0) {
        throw new Error('Division by zero is undefined');
      }
      value /= divisor;
      return this;
    },
    power(n: number) {
      value = Math.pow(value, Number(n) || 0);
      return this;
    },
    reset(newVal: number = 0) {
      value = newVal;
      return this;
    },
    getResult(): number {
      return value;
    },
    valueOf(): number {
      return value;
    },
    toString(): string {
      return String(value);
    }
  };

  return calculator;
}`,

  stepByStep: [
    'Initialize value variable scoped inside calc function closure.',
    'Create calculator object containing operational methods.',
    'In each operation method (add, subtract, etc.), update value and return this.',
    'Implement divide checking for zero divisor.',
    'Implement getResult() returning the current value.',
    'Return calculator instance.',
  ],

  timeComplexity: 'O(1) per chained operation.',
  spaceComplexity: 'O(1) memory allocation.',

  alternativeSolutions: [
    'ES6 Class implementation with fluent methods',
    'Immutable Functional approach where each method returns new calc(newValue)',
  ],

  commonMistakes: [
    'Forgetting to return this from chained methods, breaking subsequent calls with TypeError.',
    'Not handling division by zero.',
    'Mutating a global or shared prototype variable instead of instance-scoped state.',
  ],

  followUps: [
    'How would you implement an immutable calculator where every operation returns a new instance?',
    'How would you implement an undo() / redo() method in the chain?',
    'How does JavaScript Symbol.toPrimitive allow implicit arithmetic like `calc(5).add(10) + 5` to equal 20?',
  ],
};
