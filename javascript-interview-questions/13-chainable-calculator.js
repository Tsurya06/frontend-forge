/**
 * ============================================
 * CHAINABLE CALCULATOR - Complete Guide
 * ============================================
 * 
 * Topic: calc().add(10).subtract(5).multiply(20).divide(2).getResult() = 50
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS METHOD CHAINING?
 * ------------------------
 * Method chaining (fluent interface) allows calling multiple methods
 * in a single statement by returning `this` from each method.
 * 
 * EXAMPLE:
 * Instead of:
 *   calc.add(10);
 *   calc.subtract(5);
 *   calc.multiply(2);
 *   const result = calc.getResult();
 * 
 * We can write:
 *   calc.add(10).subtract(5).multiply(2).getResult();
 * 
 * COMMON EXAMPLES:
 * ----------------
 * - jQuery: $('div').addClass('active').css('color', 'red')
 * - Array methods: arr.filter().map().reduce()
 * - Builders: new QueryBuilder().select('*').from('users').where('id = 1')
 * 
 * KEY PRINCIPLE:
 * --------------
 * Return `this` from methods to enable chaining.
 * Exception: Terminal methods like getResult() return the value.
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple chainable calculator function
 */
function calcBeginner(initialValue = 0) {
  let value = initialValue;
  
  return {
    add(n) {
      value += n;
      return this; // Enable chaining
    },
    
    subtract(n) {
      value -= n;
      return this;
    },
    
    multiply(n) {
      value *= n;
      return this;
    },
    
    divide(n) {
      if (n === 0) throw new Error('Cannot divide by zero');
      value /= n;
      return this;
    },
    
    getResult() {
      return value; // Terminal method - returns value, not this
    }
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const result1 = calcBeginner()
  .add(10)
  .subtract(5)
  .multiply(20)
  .divide(2)
  .getResult();

console.log('Result:', result1); // 50: ((0 + 10 - 5) * 20) / 2 = 50

// With initial value
const result2 = calcBeginner(100)
  .divide(2)
  .subtract(30)
  .getResult();

console.log('With initial:', result2); // 20: (100 / 2) - 30 = 20


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Class-based with more features
 */
class Calculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
    this.history = [];
  }
  
  // Record operation in history
  _record(operation, operand) {
    this.history.push({
      operation,
      operand,
      result: this.value
    });
  }
  
  add(n) {
    this.value += n;
    this._record('add', n);
    return this;
  }
  
  subtract(n) {
    this.value -= n;
    this._record('subtract', n);
    return this;
  }
  
  multiply(n) {
    this.value *= n;
    this._record('multiply', n);
    return this;
  }
  
  divide(n) {
    if (n === 0) throw new Error('Cannot divide by zero');
    this.value /= n;
    this._record('divide', n);
    return this;
  }
  
  // Additional operations
  mod(n) {
    this.value %= n;
    this._record('mod', n);
    return this;
  }
  
  pow(n) {
    this.value = Math.pow(this.value, n);
    this._record('pow', n);
    return this;
  }
  
  sqrt() {
    this.value = Math.sqrt(this.value);
    this._record('sqrt', null);
    return this;
  }
  
  abs() {
    this.value = Math.abs(this.value);
    this._record('abs', null);
    return this;
  }
  
  negate() {
    this.value = -this.value;
    this._record('negate', null);
    return this;
  }
  
  // Reset
  reset(n = 0) {
    this.value = n;
    this.history = [];
    return this;
  }
  
  // Undo last operation
  undo() {
    if (this.history.length > 0) {
      this.history.pop();
      // Recalculate from initial value
      const initial = this.history.length > 0 
        ? this.history[0].result - this._getOperationResult(this.history[0])
        : 0;
      
      this.value = initial;
      const historySnapshot = [...this.history];
      this.history = [];
      
      // Replay operations
      historySnapshot.forEach(op => {
        this._applyOperation(op.operation, op.operand);
      });
    }
    return this;
  }
  
  _getOperationResult(op) {
    switch (op.operation) {
      case 'add': return op.operand;
      case 'subtract': return -op.operand;
      case 'multiply': return op.result / op.operand;
      case 'divide': return op.result * op.operand;
      default: return 0;
    }
  }
  
  _applyOperation(operation, operand) {
    switch (operation) {
      case 'add': return this.add(operand);
      case 'subtract': return this.subtract(operand);
      case 'multiply': return this.multiply(operand);
      case 'divide': return this.divide(operand);
      case 'mod': return this.mod(operand);
      case 'pow': return this.pow(operand);
      case 'sqrt': return this.sqrt();
      case 'abs': return this.abs();
      case 'negate': return this.negate();
    }
    return this;
  }
  
  // Terminal methods
  getResult() {
    return this.value;
  }
  
  getHistory() {
    return [...this.history];
  }
  
  // Enable use in expressions via valueOf
  valueOf() {
    return this.value;
  }
  
  toString() {
    return String(this.value);
  }
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const calc = new Calculator(0)
  .add(10)
  .subtract(5)
  .multiply(20)
  .divide(2);

console.log('Result:', calc.getResult()); // 50
console.log('History:', calc.getHistory());

// With undo
calc.add(100);
console.log('After add 100:', calc.getResult()); // 150
calc.undo();
console.log('After undo:', calc.getResult()); // 50

// valueOf allows use in expressions
console.log('In expression:', calc + 10); // 60


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Immutable calculator (returns new instance)
 */
class ImmutableCalculator {
  constructor(value = 0, history = []) {
    this._value = value;
    this._history = Object.freeze([...history]);
    Object.freeze(this);
  }
  
  _next(value, operation, operand) {
    return new ImmutableCalculator(value, [
      ...this._history,
      { operation, operand, result: value }
    ]);
  }
  
  add(n) {
    return this._next(this._value + n, 'add', n);
  }
  
  subtract(n) {
    return this._next(this._value - n, 'subtract', n);
  }
  
  multiply(n) {
    return this._next(this._value * n, 'multiply', n);
  }
  
  divide(n) {
    if (n === 0) throw new Error('Cannot divide by zero');
    return this._next(this._value / n, 'divide', n);
  }
  
  getResult() {
    return this._value;
  }
  
  getHistory() {
    return [...this._history];
  }
  
  // Static factory
  static of(value) {
    return new ImmutableCalculator(value);
  }
}

/**
 * Expert: Lazy calculator (stores operations, computes on getResult)
 */
class LazyCalculator {
  constructor() {
    this.operations = [];
  }
  
  add(n) {
    this.operations.push(v => v + n);
    return this;
  }
  
  subtract(n) {
    this.operations.push(v => v - n);
    return this;
  }
  
  multiply(n) {
    this.operations.push(v => v * n);
    return this;
  }
  
  divide(n) {
    if (n === 0) throw new Error('Cannot divide by zero');
    this.operations.push(v => v / n);
    return this;
  }
  
  // Execute all operations
  getResult(initialValue = 0) {
    return this.operations.reduce((value, op) => op(value), initialValue);
  }
  
  // Clear operations
  clear() {
    this.operations = [];
    return this;
  }
  
  // Clone the calculator
  clone() {
    const clone = new LazyCalculator();
    clone.operations = [...this.operations];
    return clone;
  }
}

/**
 * Expert: Calculator with expression parsing
 */
class ExpressionCalculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }
  
  // Parse and evaluate expression
  evaluate(expression) {
    // Simple expression parser: "10 + 5 * 2"
    // Uses basic operator precedence
    const tokens = expression.match(/(\d+\.?\d*|[+\-*/()])/g);
    if (!tokens) return this;
    
    // Convert to postfix (Shunting-yard algorithm simplified)
    const output = [];
    const operators = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
    
    for (const token of tokens) {
      if (!isNaN(token)) {
        output.push(parseFloat(token));
      } else if ('+-*/'.includes(token)) {
        while (
          operators.length &&
          precedence[operators[operators.length - 1]] >= precedence[token]
        ) {
          output.push(operators.pop());
        }
        operators.push(token);
      }
    }
    
    while (operators.length) {
      output.push(operators.pop());
    }
    
    // Evaluate postfix
    const stack = [];
    for (const token of output) {
      if (typeof token === 'number') {
        stack.push(token);
      } else {
        const b = stack.pop();
        const a = stack.pop();
        switch (token) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': stack.push(a / b); break;
        }
      }
    }
    
    this.value = stack[0];
    return this;
  }
  
  // Chain with existing value
  then(expression) {
    return this.evaluate(String(this.value) + expression);
  }
  
  getResult() {
    return this.value;
  }
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Immutable
const imm1 = ImmutableCalculator.of(10);
const imm2 = imm1.add(5);
const imm3 = imm2.multiply(2);

console.log('Immutable - Original:', imm1.getResult()); // 10 (unchanged)
console.log('Immutable - After ops:', imm3.getResult()); // 30

// Lazy
const lazy = new LazyCalculator()
  .add(10)
  .multiply(2)
  .subtract(5);

console.log('Lazy from 0:', lazy.getResult(0));   // 15
console.log('Lazy from 100:', lazy.getResult(100)); // 205

// Expression
const expr = new ExpressionCalculator();
console.log('Expression "10 + 5 * 2":', expr.evaluate('10 + 5 * 2').getResult()); // 20


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: Division by zero
 */
try {
  calcBeginner().divide(0);
} catch (e) {
  console.log('Division by zero:', e.message);
}

/**
 * EDGE CASE 2: Floating point precision
 */
const floatCalc = calcBeginner().add(0.1).add(0.2);
console.log('0.1 + 0.2:', floatCalc.getResult()); // 0.30000000000000004

/**
 * EDGE CASE 3: Chaining after getResult
 */
// getResult() returns number, can't chain further
// const bad = calcBeginner().add(1).getResult().add(1); // Error!

/**
 * EDGE CASE 4: NaN propagation
 */
const nanCalc = calcBeginner().add(NaN);
console.log('With NaN:', nanCalc.getResult()); // NaN

/**
 * EDGE CASE 5: Very large numbers
 */
const bigCalc = calcBeginner().add(Number.MAX_SAFE_INTEGER).add(1);
console.log('Large number safe?', Number.isSafeInteger(bigCalc.getResult())); // false


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Return `this` for chainable methods
 * 2. Terminal methods return values
 * 3. Consider immutability for functional style
 * 4. valueOf/toString for expression use
 * 5. Handle division by zero
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with basic function returning object
 * 2. Explain fluent interface pattern
 * 3. Mention history/undo feature
 * 4. Discuss immutable vs mutable
 * 5. Consider lazy evaluation
 * 
 * PATTERNS:
 * ---------
 * - Builder pattern: construct complex objects
 * - Fluent interface: chain method calls
 * - Command pattern: store operations for replay
 */


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Forgetting to return `this`
 * Methods won't be chainable
 * 
 * MISTAKE 2: Returning `this` from terminal methods
 * getResult() should return the value
 * 
 * MISTAKE 3: Not handling edge cases
 * Division by zero, NaN, etc.
 * 
 * MISTAKE 4: Mutating shared state
 * Multiple chains can interfere if sharing state
 * 
 * MISTAKE 5: Breaking the chain on error
 * Consider error handling strategy
 */


module.exports = {
  calcBeginner,
  Calculator,
  ImmutableCalculator,
  LazyCalculator,
  ExpressionCalculator
};
