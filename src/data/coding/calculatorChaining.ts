import type { CodingProblem } from "../../types";

export const calculatorChainingProblem: CodingProblem = {
  id: "coding-calculator",
  title: "Calculator with Method Chaining",
  difficulty: "Intermediate",
  category: "Coding",
  tags: ["method-chaining", "fluent-api", "oop", "design-patterns", "this"],

  problem: `Implement a calculator function/class that supports method chaining for arithmetic operations. The API should allow expressions like \`calc().add(10).subtract(5).multiply(20).divide(2).getResult()\` which evaluates to 50. Each arithmetic method should return the calculator instance to enable chaining, and a final \`getResult()\` method should return the computed value.

Method chaining (also called a fluent interface) is a common design pattern used in libraries like jQuery, Lodash, and builder patterns throughout JavaScript. Understanding how to implement it requires knowledge of \`this\` binding, object-oriented design, and how returning the instance from methods enables chainable APIs.

Your solution should handle division by zero gracefully, support an optional initial value, and provide a reset mechanism. The implementation can use either a class, a factory function with closures, or a constructor function — each approach demonstrates different JavaScript fundamentals.`,

  requirements: [
    "Support add(n), subtract(n), multiply(n), divide(n) operations",
    "Each arithmetic method returns the instance for chaining",
    "getResult() returns the current computed value",
    "Support optional initial value: calc(10).add(5) starts from 10",
    "Default initial value is 0 if not provided",
    "Handle division by zero gracefully (throw Error or return Infinity)",
    "Provide a reset() method that returns the value to the initial state",
  ],

  examples: [
    {
      input: `calc().add(10).subtract(5).multiply(20).divide(2).getResult()`,
      output: `50`,
      explanation: "Starting from 0: +10=10, -5=5, *20=100, /2=50.",
    },
    {
      input: `calc(100).divide(10).subtract(5).getResult()`,
      output: `5`,
      explanation: "Starting from 100: /10=10, -5=5.",
    },
    {
      input: `const c = calc(10);\nc.add(5).getResult(); // 15\nc.reset().getResult(); // 10`,
      output: `15 then 10 after reset`,
      explanation:
        "The calculator maintains state across operations and can be reset to its initial value.",
    },
  ],

  edgeCases: [
    "Division by zero should throw an Error with a descriptive message",
    "Chaining many operations in sequence",
    "Using the same calculator instance multiple times",
    "Calling getResult() without any operations returns the initial value",
    "Operations with negative numbers",
    "Operations with floating point numbers (precision considerations)",
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

  theoryAndConcepts:
    "WHAT IS METHOD CHAINING?\n------------------------\nMethod chaining (fluent interface) allows calling multiple methods\nin a single statement by returning `this` from each method.\n\nEXAMPLE:\nInstead of:\n  calc.add(10);\n  calc.subtract(5);\n  calc.multiply(2);\n  const result = calc.getResult();\n\nWe can write:\n  calc.add(10).subtract(5).multiply(2).getResult();\n\nCOMMON EXAMPLES:\n----------------\n- jQuery: $('div').addClass('active').css('color', 'red')\n- Array methods: arr.filter().map().reduce()\n- Builders: new QueryBuilder().select('*').from('users').where('id = 1')\n\nKEY PRINCIPLE:\n--------------\nReturn `this` from methods to enable chaining.\nException: Terminal methods like getResult() return the value.",
  beginnerApproach: "Beginner: Simple chainable calculator function",
  beginnerImplementation:
    "function calcBeginner(initialValue = 0) {\n  let value = initialValue;\n  \n  return {\n    add(n) {\n      value += n;\n      return this; // Enable chaining\n    },\n    \n    subtract(n) {\n      value -= n;\n      return this;\n    },\n    \n    multiply(n) {\n      value *= n;\n      return this;\n    },\n    \n    divide(n) {\n      if (n === 0) throw new Error('Cannot divide by zero');\n      value /= n;\n      return this;\n    },\n    \n    getResult() {\n      return value; // Terminal method - returns value, not this\n    }\n  };\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst result1 = calcBeginner()\n  .add(10)\n  .subtract(5)\n  .multiply(20)\n  .divide(2)\n  .getResult();\n\nconsole.log('Result:', result1); // 50: ((0 + 10 - 5) * 20) / 2 = 50\n\n// With initial value\nconst result2 = calcBeginner(100)\n  .divide(2)\n  .subtract(30)\n  .getResult();\n\nconsole.log('With initial:', result2); // 20: (100 / 2) - 30 = 20",
  intermediateApproach: "Intermediate: Class-based with more features",
  intermediateImplementation:
    "class Calculator {\n  constructor(initialValue = 0) {\n    this.value = initialValue;\n    this.history = [];\n  }\n  \n  // Record operation in history\n  _record(operation, operand) {\n    this.history.push({\n      operation,\n      operand,\n      result: this.value\n    });\n  }\n  \n  add(n) {\n    this.value += n;\n    this._record('add', n);\n    return this;\n  }\n  \n  subtract(n) {\n    this.value -= n;\n    this._record('subtract', n);\n    return this;\n  }\n  \n  multiply(n) {\n    this.value *= n;\n    this._record('multiply', n);\n    return this;\n  }\n  \n  divide(n) {\n    if (n === 0) throw new Error('Cannot divide by zero');\n    this.value /= n;\n    this._record('divide', n);\n    return this;\n  }\n  \n  // Additional operations\n  mod(n) {\n    this.value %= n;\n    this._record('mod', n);\n    return this;\n  }\n  \n  pow(n) {\n    this.value = Math.pow(this.value, n);\n    this._record('pow', n);\n    return this;\n  }\n  \n  sqrt() {\n    this.value = Math.sqrt(this.value);\n    this._record('sqrt', null);\n    return this;\n  }\n  \n  abs() {\n    this.value = Math.abs(this.value);\n    this._record('abs', null);\n    return this;\n  }\n  \n  negate() {\n    this.value = -this.value;\n    this._record('negate', null);\n    return this;\n  }\n  \n  // Reset\n  reset(n = 0) {\n    this.value = n;\n    this.history = [];\n    return this;\n  }\n  \n  // Undo last operation\n  undo() {\n    if (this.history.length > 0) {\n      this.history.pop();\n      // Recalculate from initial value\n      const initial = this.history.length > 0 \n        ? this.history[0].result - this._getOperationResult(this.history[0])\n        : 0;\n      \n      this.value = initial;\n      const historySnapshot = [...this.history];\n      this.history = [];\n      \n      // Replay operations\n      historySnapshot.forEach(op => {\n        this._applyOperation(op.operation, op.operand);\n      });\n    }\n    return this;\n  }\n  \n  _getOperationResult(op) {\n    switch (op.operation) {\n      case 'add': return op.operand;\n      case 'subtract': return -op.operand;\n      case 'multiply': return op.result / op.operand;\n      case 'divide': return op.result * op.operand;\n      default: return 0;\n    }\n  }\n  \n  _applyOperation(operation, operand) {\n    switch (operation) {\n      case 'add': return this.add(operand);\n      case 'subtract': return this.subtract(operand);\n      case 'multiply': return this.multiply(operand);\n      case 'divide': return this.divide(operand);\n      case 'mod': return this.mod(operand);\n      case 'pow': return this.pow(operand);\n      case 'sqrt': return this.sqrt();\n      case 'abs': return this.abs();\n      case 'negate': return this.negate();\n    }\n    return this;\n  }\n  \n  // Terminal methods\n  getResult() {\n    return this.value;\n  }\n  \n  getHistory() {\n    return [...this.history];\n  }\n  \n  // Enable use in expressions via valueOf\n  valueOf() {\n    return this.value;\n  }\n  \n  toString() {\n    return String(this.value);\n  }\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst calc = new Calculator(0)\n  .add(10)\n  .subtract(5)\n  .multiply(20)\n  .divide(2);\n\nconsole.log('Result:', calc.getResult()); // 50\nconsole.log('History:', calc.getHistory());\n\n// With undo\ncalc.add(100);\nconsole.log('After add 100:', calc.getResult()); // 150\ncalc.undo();\nconsole.log('After undo:', calc.getResult()); // 50\n\n// valueOf allows use in expressions\nconsole.log('In expression:', calc + 10); // 60",
  expertApproach:
    "Expert: Immutable calculator (returns new instance)\n\n\nExpert: Lazy calculator (stores operations, computes on getResult)\n\n\nExpert: Calculator with expression parsing",
  expertImplementation:
    "class ImmutableCalculator {\n  constructor(value = 0, history = []) {\n    this._value = value;\n    this._history = Object.freeze([...history]);\n    Object.freeze(this);\n  }\n  \n  _next(value, operation, operand) {\n    return new ImmutableCalculator(value, [\n      ...this._history,\n      { operation, operand, result: value }\n    ]);\n  }\n  \n  add(n) {\n    return this._next(this._value + n, 'add', n);\n  }\n  \n  subtract(n) {\n    return this._next(this._value - n, 'subtract', n);\n  }\n  \n  multiply(n) {\n    return this._next(this._value * n, 'multiply', n);\n  }\n  \n  divide(n) {\n    if (n === 0) throw new Error('Cannot divide by zero');\n    return this._next(this._value / n, 'divide', n);\n  }\n  \n  getResult() {\n    return this._value;\n  }\n  \n  getHistory() {\n    return [...this._history];\n  }\n  \n  // Static factory\n  static of(value) {\n    return new ImmutableCalculator(value);\n  }\n}\n\nclass LazyCalculator {\n  constructor() {\n    this.operations = [];\n  }\n  \n  add(n) {\n    this.operations.push(v => v + n);\n    return this;\n  }\n  \n  subtract(n) {\n    this.operations.push(v => v - n);\n    return this;\n  }\n  \n  multiply(n) {\n    this.operations.push(v => v * n);\n    return this;\n  }\n  \n  divide(n) {\n    if (n === 0) throw new Error('Cannot divide by zero');\n    this.operations.push(v => v / n);\n    return this;\n  }\n  \n  // Execute all operations\n  getResult(initialValue = 0) {\n    return this.operations.reduce((value, op) => op(value), initialValue);\n  }\n  \n  // Clear operations\n  clear() {\n    this.operations = [];\n    return this;\n  }\n  \n  // Clone the calculator\n  clone() {\n    const clone = new LazyCalculator();\n    clone.operations = [...this.operations];\n    return clone;\n  }\n}\n\nclass ExpressionCalculator {\n  constructor(initialValue = 0) {\n    this.value = initialValue;\n  }\n  \n  // Parse and evaluate expression\n  evaluate(expression) {\n    // Simple expression parser: \"10 + 5 * 2\"\n    // Uses basic operator precedence\n    const tokens = expression.match(/(\\d+\\.?\\d*|[+\\-*/()])/g);\n    if (!tokens) return this;\n    \n    // Convert to postfix (Shunting-yard algorithm simplified)\n    const output = [];\n    const operators = [];\n    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };\n    \n    for (const token of tokens) {\n      if (!isNaN(token)) {\n        output.push(parseFloat(token));\n      } else if ('+-*/'.includes(token)) {\n        while (\n          operators.length &&\n          precedence[operators[operators.length - 1]] >= precedence[token]\n        ) {\n          output.push(operators.pop());\n        }\n        operators.push(token);\n      }\n    }\n    \n    while (operators.length) {\n      output.push(operators.pop());\n    }\n    \n    // Evaluate postfix\n    const stack = [];\n    for (const token of output) {\n      if (typeof token === 'number') {\n        stack.push(token);\n      } else {\n        const b = stack.pop();\n        const a = stack.pop();\n        switch (token) {\n          case '+': stack.push(a + b); break;\n          case '-': stack.push(a - b); break;\n          case '*': stack.push(a * b); break;\n          case '/': stack.push(a / b); break;\n        }\n      }\n    }\n    \n    this.value = stack[0];\n    return this;\n  }\n  \n  // Chain with existing value\n  then(expression) {\n    return this.evaluate(String(this.value) + expression);\n  }\n  \n  getResult() {\n    return this.value;\n  }\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Immutable\nconst imm1 = ImmutableCalculator.of(10);\nconst imm2 = imm1.add(5);\nconst imm3 = imm2.multiply(2);\n\nconsole.log('Immutable - Original:', imm1.getResult()); // 10 (unchanged)\nconsole.log('Immutable - After ops:', imm3.getResult()); // 30\n\n// Lazy\nconst lazy = new LazyCalculator()\n  .add(10)\n  .multiply(2)\n  .subtract(5);\n\nconsole.log('Lazy from 0:', lazy.getResult(0));   // 15\nconsole.log('Lazy from 100:', lazy.getResult(100)); // 205\n\n// Expression\nconst expr = new ExpressionCalculator();\nconsole.log('Expression \"10 + 5 * 2\":', expr.evaluate('10 + 5 * 2').getResult()); // 20",
  interviewTraps: [
    "console.log('\\n=== EDGE CASES ===');",
    "EDGE CASE 1: Division by zero",
    "calcBeginner().divide(0);",
    "} catch (e) {",
    "console.log('Division by zero:', e.message);",
    "EDGE CASE 2: Floating point precision",
    "const floatCalc = calcBeginner().add(0.1).add(0.2);",
    "console.log('0.1 + 0.2:', floatCalc.getResult()); // 0.30000000000000004",
  ],
  stepByStep: [
    "Create a factory function (or class) that accepts an optional initial value (default 0).",
    "Store the current value in a closure variable (or instance property).",
    "Implement add(n): add n to value, return the calculator object/this.",
    "Implement subtract(n): subtract n from value, return the calculator object/this.",
    "Implement multiply(n): multiply value by n, return the calculator object/this.",
    "Implement divide(n): check for zero, divide value by n, return the calculator object/this.",
    "Implement reset(): restore value to the initial value, return the calculator object/this.",
    "Implement getResult(): return the current value (terminal operation, breaks the chain).",
  ],

  timeComplexity:
    "O(1) per operation — each method performs a single arithmetic operation.",
  spaceComplexity: "O(1) — only stores the current value and initial value.",

  commonMistakes: [
    "Forgetting to return `this` (or the object) from arithmetic methods, breaking the chain",
    "Not handling division by zero — silently producing Infinity or NaN",
    "Using arrow functions in the class approach — arrow methods don't bind `this` to the instance",
    "Not storing the initial value separately for the reset() functionality",
  ],

  followUps: [
    "How would you add an undo() method that reverts the last operation?",
    "How would you implement lazy evaluation — storing operations and computing only at getResult()?",
    "How is method chaining used in popular libraries like jQuery, Lodash, and D3?",
    "How would you make the calculator immutable, returning a new instance from each operation?",
  ],
};
