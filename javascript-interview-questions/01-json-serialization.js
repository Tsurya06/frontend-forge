/**
 * ============================================
 * JSON SERIALIZATION - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function that serializes a JavaScript value into a JSON string
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS JSON SERIALIZATION?
 * ---------------------------
 * JSON (JavaScript Object Notation) serialization is the process of converting
 * a JavaScript value (object, array, primitive) into a JSON-formatted string.
 * 
 * WHY IS IT IMPORTANT?
 * --------------------
 * 1. Sending data over network (APIs)
 * 2. Storing data in localStorage/sessionStorage
 * 3. Deep cloning objects (simple cases)
 * 4. Logging complex objects
 * 
 * NATIVE METHOD: JSON.stringify()
 * --------------------------------
 * JavaScript has built-in JSON.stringify(), but understanding how it works
 * internally is crucial for interviews and edge case handling.
 */

// ============================================
// KEY RULES TO REMEMBER
// ============================================

/**
 * DATA TYPE HANDLING:
 * -------------------
 * | JavaScript Type    | JSON Result          |
 * |--------------------|----------------------|
 * | string             | "string"             |
 * | number             | number               |
 * | boolean            | true/false           |
 * | null               | null                 |
 * | undefined          | OMITTED in objects   |
 * | undefined (array)  | null                 |
 * | function           | OMITTED in objects   |
 * | function (array)   | null                 |
 * | Symbol             | OMITTED              |
 * | BigInt             | THROWS ERROR         |
 * | NaN                | null                 |
 * | Infinity           | null                 |
 * | -Infinity          | null                 |
 * | Date               | ISO string           |
 * | RegExp             | {} (empty object)    |
 * | Map/Set            | {} (empty object)    |
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Handle basic types only
 * - strings, numbers, booleans, null, arrays, simple objects
 */
function jsonStringifyBeginner(value) {
  // Handle null
  if (value === null) {
    return 'null';
  }
  
  // Handle boolean
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  
  // Handle number
  if (typeof value === 'number') {
    return String(value);
  }
  
  // Handle string - wrap in quotes
  if (typeof value === 'string') {
    return '"' + value + '"';
  }
  
  // Handle array
  if (Array.isArray(value)) {
    const items = value.map(item => jsonStringifyBeginner(item));
    return '[' + items.join(',') + ']';
  }
  
  // Handle object
  if (typeof value === 'object') {
    const pairs = [];
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        pairs.push('"' + key + '":' + jsonStringifyBeginner(value[key]));
      }
    }
    return '{' + pairs.join(',') + '}';
  }
  
  return undefined;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL TESTS ===');
console.log(jsonStringifyBeginner(null));              // null
console.log(jsonStringifyBeginner(true));              // true
console.log(jsonStringifyBeginner(42));                // 42
console.log(jsonStringifyBeginner('hello'));           // "hello"
console.log(jsonStringifyBeginner([1, 2, 3]));         // [1,2,3]
console.log(jsonStringifyBeginner({ a: 1, b: 2 }));    // {"a":1,"b":2}


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Handle special cases
 * - undefined, functions, NaN, Infinity
 * - String escaping
 * - Date objects
 */
function jsonStringifyIntermediate(value) {
  // Handle null
  if (value === null) {
    return 'null';
  }
  
  // Handle undefined - returns undefined (will be omitted)
  if (value === undefined) {
    return undefined;
  }
  
  // Handle boolean
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  
  // Handle number - special cases for NaN and Infinity
  if (typeof value === 'number') {
    // NaN and Infinity become null in JSON
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return 'null';
    }
    return String(value);
  }
  
  // Handle string with escape characters
  if (typeof value === 'string') {
    return '"' + escapeString(value) + '"';
  }
  
  // Handle function - returns undefined
  if (typeof value === 'function') {
    return undefined;
  }
  
  // Handle Symbol - returns undefined
  if (typeof value === 'symbol') {
    return undefined;
  }
  
  // Handle Date
  if (value instanceof Date) {
    return '"' + value.toISOString() + '"';
  }
  
  // Handle array
  if (Array.isArray(value)) {
    const items = value.map(item => {
      const result = jsonStringifyIntermediate(item);
      // undefined, function, symbol in arrays become null
      return result === undefined ? 'null' : result;
    });
    return '[' + items.join(',') + ']';
  }
  
  // Handle object
  if (typeof value === 'object') {
    const pairs = [];
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        const serializedValue = jsonStringifyIntermediate(value[key]);
        // Skip undefined, function, symbol values in objects
        if (serializedValue !== undefined) {
          pairs.push('"' + escapeString(key) + '":' + serializedValue);
        }
      }
    }
    return '{' + pairs.join(',') + '}';
  }
  
  return undefined;
}

// Helper: Escape special characters in strings
function escapeString(str) {
  const escapeMap = {
    '"': '\\"',      // Quote
    '\\': '\\\\',    // Backslash
    '\n': '\\n',     // Newline
    '\r': '\\r',     // Carriage return
    '\t': '\\t',     // Tab
    '\b': '\\b',     // Backspace
    '\f': '\\f'      // Form feed
  };
  
  let result = '';
  for (const char of str) {
    result += escapeMap[char] || char;
  }
  return result;
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL TESTS ===');
console.log(jsonStringifyIntermediate(undefined));           // undefined
console.log(jsonStringifyIntermediate(NaN));                 // null
console.log(jsonStringifyIntermediate(Infinity));            // null
console.log(jsonStringifyIntermediate(new Date('2024-01-01'))); // "2024-01-01T00:00:00.000Z"
console.log(jsonStringifyIntermediate('hello\nworld'));      // "hello\nworld"
console.log(jsonStringifyIntermediate({ a: undefined, b: 1 })); // {"b":1}
console.log(jsonStringifyIntermediate([1, undefined, 3]));   // [1,null,3]
console.log(jsonStringifyIntermediate({ fn: () => {} }));    // {}


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full implementation with all edge cases
 * - BigInt handling
 * - toJSON() method support
 * - Replacer function (like JSON.stringify)
 * - Space parameter for formatting
 * - Circular reference detection
 */
function jsonStringifyExpert(value, replacer = null, space = 0) {
  // Track seen objects for circular reference detection
  const seen = new WeakSet();
  
  // Normalize space parameter
  const indent = typeof space === 'number' 
    ? ' '.repeat(Math.min(space, 10)) 
    : (typeof space === 'string' ? space.slice(0, 10) : '');
  
  function serialize(val, currentIndent = '') {
    // Handle toJSON method
    if (val !== null && typeof val === 'object' && typeof val.toJSON === 'function') {
      val = val.toJSON();
    }
    
    // Handle null
    if (val === null) {
      return 'null';
    }
    
    // Handle undefined
    if (val === undefined) {
      return undefined;
    }
    
    // Handle boolean
    if (typeof val === 'boolean') {
      return val ? 'true' : 'false';
    }
    
    // Handle number
    if (typeof val === 'number') {
      if (Number.isNaN(val) || !Number.isFinite(val)) {
        return 'null';
      }
      return String(val);
    }
    
    // Handle BigInt - throws error like native JSON.stringify
    if (typeof val === 'bigint') {
      throw new TypeError('Do not know how to serialize a BigInt');
    }
    
    // Handle string
    if (typeof val === 'string') {
      return '"' + escapeStringExpert(val) + '"';
    }
    
    // Handle function and symbol
    if (typeof val === 'function' || typeof val === 'symbol') {
      return undefined;
    }
    
    // Handle Date (after toJSON check, but Date has toJSON)
    if (val instanceof Date) {
      return '"' + val.toISOString() + '"';
    }
    
    // Handle circular reference
    if (seen.has(val)) {
      throw new TypeError('Converting circular structure to JSON');
    }
    seen.add(val);
    
    // Handle array
    if (Array.isArray(val)) {
      if (val.length === 0) {
        seen.delete(val);
        return '[]';
      }
      
      const nextIndent = currentIndent + indent;
      const items = val.map(item => {
        const result = serialize(item, nextIndent);
        return result === undefined ? 'null' : result;
      });
      
      seen.delete(val);
      
      if (indent) {
        return '[\n' + nextIndent + items.join(',\n' + nextIndent) + '\n' + currentIndent + ']';
      }
      return '[' + items.join(',') + ']';
    }
    
    // Handle object
    if (typeof val === 'object') {
      const keys = Object.keys(val);
      
      // Apply replacer if it's an array (filter keys)
      const filteredKeys = Array.isArray(replacer) 
        ? keys.filter(k => replacer.includes(k))
        : keys;
      
      if (filteredKeys.length === 0) {
        seen.delete(val);
        return '{}';
      }
      
      const nextIndent = currentIndent + indent;
      const pairs = [];
      
      for (const key of filteredKeys) {
        let serializedValue;
        
        // Apply replacer function
        if (typeof replacer === 'function') {
          const replaced = replacer(key, val[key]);
          serializedValue = serialize(replaced, nextIndent);
        } else {
          serializedValue = serialize(val[key], nextIndent);
        }
        
        if (serializedValue !== undefined) {
          const serializedKey = '"' + escapeStringExpert(key) + '"';
          if (indent) {
            pairs.push(serializedKey + ': ' + serializedValue);
          } else {
            pairs.push(serializedKey + ':' + serializedValue);
          }
        }
      }
      
      seen.delete(val);
      
      if (pairs.length === 0) {
        return '{}';
      }
      
      if (indent) {
        return '{\n' + nextIndent + pairs.join(',\n' + nextIndent) + '\n' + currentIndent + '}';
      }
      return '{' + pairs.join(',') + '}';
    }
    
    return undefined;
  }
  
  // Apply replacer to root value if function
  let rootValue = value;
  if (typeof replacer === 'function') {
    rootValue = replacer('', value);
  }
  
  return serialize(rootValue);
}

// Expert string escaping with unicode support
function escapeStringExpert(str) {
  let result = '';
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const code = str.charCodeAt(i);
    
    switch (char) {
      case '"':  result += '\\"'; break;
      case '\\': result += '\\\\'; break;
      case '\n': result += '\\n'; break;
      case '\r': result += '\\r'; break;
      case '\t': result += '\\t'; break;
      case '\b': result += '\\b'; break;
      case '\f': result += '\\f'; break;
      default:
        // Escape control characters (0x00-0x1F)
        if (code < 0x20) {
          result += '\\u' + code.toString(16).padStart(4, '0');
        } else {
          result += char;
        }
    }
  }
  
  return result;
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL TESTS ===');

// Basic test
console.log(jsonStringifyExpert({ a: 1, b: 'hello' }));

// With formatting (space = 2)
console.log(jsonStringifyExpert({ a: 1, b: { c: 2 } }, null, 2));

// With replacer function
console.log(jsonStringifyExpert(
  { a: 1, b: 2, c: 3 },
  (key, value) => typeof value === 'number' ? value * 2 : value
));

// With replacer array (filter keys)
console.log(jsonStringifyExpert({ a: 1, b: 2, c: 3 }, ['a', 'c']));

// toJSON support
const objWithToJSON = {
  data: 'secret',
  toJSON() {
    return { data: 'redacted' };
  }
};
console.log(jsonStringifyExpert(objWithToJSON));

// Circular reference detection
try {
  const circular = { a: 1 };
  circular.self = circular;
  jsonStringifyExpert(circular);
} catch (e) {
  console.log('Circular reference error:', e.message);
}

// BigInt error
try {
  jsonStringifyExpert({ big: BigInt(123) });
} catch (e) {
  console.log('BigInt error:', e.message);
}


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: Empty values
 */
console.log('Empty object:', jsonStringifyExpert({}));           // {}
console.log('Empty array:', jsonStringifyExpert([]));            // []
console.log('Empty string:', jsonStringifyExpert(''));           // ""

/**
 * EDGE CASE 2: Nested structures
 */
console.log('Deeply nested:', jsonStringifyExpert({ a: { b: { c: { d: 1 } } } }));

/**
 * EDGE CASE 3: Mixed array types
 */
console.log('Mixed array:', jsonStringifyExpert([1, 'two', true, null, { a: 1 }]));

/**
 * EDGE CASE 4: Special number values
 */
console.log('Special numbers:', jsonStringifyExpert([0, -0, 1e10, 1.5e-10]));

/**
 * EDGE CASE 5: Unicode in strings
 */
console.log('Unicode:', jsonStringifyExpert({ emoji: '😀', chinese: '中文' }));

/**
 * EDGE CASE 6: Keys with special characters
 */
console.log('Special keys:', jsonStringifyExpert({ 'key with spaces': 1, 'key"with"quotes': 2 }));

/**
 * EDGE CASE 7: Array with holes (sparse array)
 */
const sparseArray = [1, , , 4]; // Note: holes become null
console.log('Sparse array:', JSON.stringify(sparseArray)); // [1,null,null,4]


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Not handling undefined in objects vs arrays
 * - In objects: undefined values are OMITTED
 * - In arrays: undefined becomes null
 * 
 * MISTAKE 2: Forgetting to escape strings
 * - Quotes, backslashes, and control characters must be escaped
 * 
 * MISTAKE 3: Not handling circular references
 * - Will cause infinite recursion
 * 
 * MISTAKE 4: Not handling BigInt
 * - Should throw TypeError, not return undefined
 * 
 * MISTAKE 5: Forgetting toJSON() method
 * - Objects can define custom serialization
 * 
 * MISTAKE 6: Treating all objects the same
 * - Date, RegExp, Map, Set need special handling
 */


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. JSON supports: string, number, boolean, null, object, array
 * 2. JSON does NOT support: undefined, function, Symbol, BigInt
 * 3. Special numbers (NaN, Infinity) become null
 * 4. Date.toJSON() returns ISO string
 * 5. Object keys must be strings (in quotes)
 * 6. Always escape special characters in strings
 * 7. Check for circular references to avoid infinite loops
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with basic types, then add complexity
 * 2. Mention edge cases even if you don't implement them
 * 3. Discuss time complexity: O(n) where n is total characters
 * 4. Discuss space complexity: O(n) for the output string + O(d) for recursion depth
 */


// ============================================
// PRACTICE EXERCISES
// ============================================

/**
 * EXERCISE 1: Implement JSON.parse (reverse of stringify)
 * EXERCISE 2: Add support for Map and Set (convert to array)
 * EXERCISE 3: Implement pretty-print with custom indentation
 * EXERCISE 4: Add support for comments in JSON (non-standard)
 * EXERCISE 5: Handle very deep nesting without stack overflow
 */


// ============================================
// COMPARISON WITH NATIVE JSON.stringify
// ============================================

console.log('\n=== COMPARISON WITH NATIVE ===');

const testCases = [
  null,
  undefined,
  true,
  42,
  'hello',
  NaN,
  Infinity,
  new Date('2024-01-01'),
  [1, undefined, 3],
  { a: 1, b: undefined },
  { fn: function() {} },
];

testCases.forEach((testCase, index) => {
  const native = JSON.stringify(testCase);
  const custom = jsonStringifyExpert(testCase);
  const match = native === custom;
  console.log(`Test ${index + 1}: ${match ? '✓' : '✗'} | Native: ${native} | Custom: ${custom}`);
});


module.exports = {
  jsonStringifyBeginner,
  jsonStringifyIntermediate,
  jsonStringifyExpert
};
