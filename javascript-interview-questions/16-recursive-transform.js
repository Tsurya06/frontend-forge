/**
 * ============================================
 * RECURSIVE VALUE TRANSFORMER - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function to recursively transform values
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS RECURSIVE TRANSFORMATION?
 * ---------------------------------
 * Walking through an object/array structure and applying a
 * transformation function to each value.
 * 
 * USE CASES:
 * ----------
 * 1. Converting all strings to lowercase/uppercase
 * 2. Transforming dates to ISO strings
 * 3. Sanitizing user input
 * 4. Converting types (string numbers to actual numbers)
 * 5. Redacting sensitive data
 * 
 * KEY CONSIDERATIONS:
 * -------------------
 * - Handle circular references
 * - Transform keys vs values
 * - Maintain object structure
 * - Handle special types (Date, RegExp, etc.)
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple recursive transformer for values
 */
function transformValuesBeginner(obj, transformer) {
  // Handle primitives
  if (obj === null || typeof obj !== 'object') {
    return transformer(obj);
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => transformValuesBeginner(item, transformer));
  }
  
  // Handle objects
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = transformValuesBeginner(obj[key], transformer);
    }
  }
  return result;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const data = {
  name: 'JOHN',
  details: {
    email: 'JOHN@EXAMPLE.COM',
    tags: ['ADMIN', 'USER']
  }
};

// Transform all strings to lowercase
const lowercased = transformValuesBeginner(data, value =>
  typeof value === 'string' ? value.toLowerCase() : value
);
console.log('Lowercased:', lowercased);

// Double all numbers
const numbers = { a: 1, b: { c: 2, d: [3, 4] } };
const doubled = transformValuesBeginner(numbers, value =>
  typeof value === 'number' ? value * 2 : value
);
console.log('Doubled:', doubled);


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Transform with path context and circular handling
 */
function transformValuesIntermediate(obj, transformer, options = {}) {
  const { transformKeys = false, seen = new WeakMap() } = options;
  
  function transform(value, path = []) {
    // Handle primitives
    if (value === null || typeof value !== 'object') {
      return transformer(value, path);
    }
    
    // Handle circular references
    if (seen.has(value)) {
      return seen.get(value);
    }
    
    // Handle Date
    if (value instanceof Date) {
      return transformer(value, path);
    }
    
    // Handle RegExp
    if (value instanceof RegExp) {
      return transformer(value, path);
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      const result = [];
      seen.set(value, result);
      
      for (let i = 0; i < value.length; i++) {
        result[i] = transform(value[i], [...path, i]);
      }
      return result;
    }
    
    // Handle objects
    const result = {};
    seen.set(value, result);
    
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        const newKey = transformKeys ? transformer(key, [...path, key]) : key;
        result[newKey] = transform(value[key], [...path, key]);
      }
    }
    
    return result;
  }
  
  return transform(obj);
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

// Transform with path context
const withPaths = transformValuesIntermediate(
  { user: { name: 'John', age: 30 } },
  (value, path) => {
    console.log(`Path: ${path.join('.')} = ${value}`);
    return value;
  }
);

// Transform keys
const snakeCase = {
  firstName: 'John',
  lastName: 'Doe',
  contactInfo: { phoneNumber: '123' }
};

const transformedKeys = transformValuesIntermediate(
  snakeCase,
  (value, path) => {
    if (typeof value === 'string' && path.length > 0) {
      // This transforms keys
      return value;
    }
    return value;
  },
  { transformKeys: false }
);

// Handle circular reference
const circular = { a: 1 };
circular.self = circular;
const transformedCircular = transformValuesIntermediate(circular, v => v);
console.log('Circular handled:', transformedCircular.self === transformedCircular);


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured transformer with type-specific handlers
 */
function transformDeep(obj, options = {}) {
  const {
    transformers = {},      // Type-specific transformers
    defaultTransformer = v => v,
    transformKeys = false,
    keyTransformer = k => k,
    maxDepth = Infinity,
    skipTypes = [],         // Types to skip
    seen = new WeakMap()
  } = options;
  
  function getType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Date) return 'date';
    if (value instanceof RegExp) return 'regexp';
    if (value instanceof Map) return 'map';
    if (value instanceof Set) return 'set';
    return typeof value;
  }
  
  function transform(value, path = [], depth = 0) {
    const type = getType(value);
    
    // Skip certain types
    if (skipTypes.includes(type)) {
      return value;
    }
    
    // Max depth reached
    if (depth > maxDepth) {
      return value;
    }
    
    // Apply type-specific transformer or default
    const transformer = transformers[type] || defaultTransformer;
    
    // Handle primitives and special types
    if (['null', 'undefined', 'boolean', 'number', 'string', 'symbol', 'bigint'].includes(type)) {
      return transformer(value, path, depth);
    }
    
    // Handle Date
    if (type === 'date') {
      return transformer(value, path, depth);
    }
    
    // Handle RegExp
    if (type === 'regexp') {
      return transformer(value, path, depth);
    }
    
    // Handle circular references
    if (seen.has(value)) {
      return seen.get(value);
    }
    
    // Handle Map
    if (type === 'map') {
      const result = new Map();
      seen.set(value, result);
      
      value.forEach((v, k) => {
        const newKey = transformKeys ? transform(k, [...path, k], depth + 1) : k;
        result.set(newKey, transform(v, [...path, k], depth + 1));
      });
      
      return transformer(result, path, depth);
    }
    
    // Handle Set
    if (type === 'set') {
      const result = new Set();
      seen.set(value, result);
      
      value.forEach(v => {
        result.add(transform(v, path, depth + 1));
      });
      
      return transformer(result, path, depth);
    }
    
    // Handle Array
    if (type === 'array') {
      const result = [];
      seen.set(value, result);
      
      for (let i = 0; i < value.length; i++) {
        result[i] = transform(value[i], [...path, i], depth + 1);
      }
      
      return transformer(result, path, depth);
    }
    
    // Handle Object
    const result = {};
    seen.set(value, result);
    
    for (const key of [...Object.keys(value), ...Object.getOwnPropertySymbols(value)]) {
      const newKey = transformKeys ? keyTransformer(key, path) : key;
      result[newKey] = transform(value[key], [...path, key], depth + 1);
    }
    
    return transformer(result, path, depth);
  }
  
  return transform(obj);
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Type-specific transformers
const complexData = {
  name: 'John',
  age: 30,
  active: true,
  created: new Date('2024-01-01'),
  pattern: /test/gi,
  scores: [85, 90, 95],
  metadata: new Map([['key', 'value']]),
  tags: new Set(['a', 'b'])
};

const transformed = transformDeep(complexData, {
  transformers: {
    string: (v) => v.toUpperCase(),
    number: (v) => v * 2,
    date: (v) => v.toISOString(),
    array: (v) => v.reverse()
  }
});

console.log('Transformed:', transformed);

// Redact sensitive data based on path
const userData = {
  user: {
    name: 'John',
    password: 'secret123',
    email: 'john@example.com',
    profile: {
      ssn: '123-45-6789'
    }
  }
};

const sensitiveFields = ['password', 'ssn'];

const redacted = transformDeep(userData, {
  defaultTransformer: (value, path) => {
    const lastKey = path[path.length - 1];
    if (sensitiveFields.includes(lastKey)) {
      return '[REDACTED]';
    }
    return value;
  }
});

console.log('Redacted:', JSON.stringify(redacted, null, 2));


// ============================================
// COMMON USE CASES
// ============================================

console.log('\n=== COMMON USE CASES ===');

// 1. Convert all dates to ISO strings (for JSON)
function serializeDates(obj) {
  return transformValuesBeginner(obj, value =>
    value instanceof Date ? value.toISOString() : value
  );
}

// 2. Parse all date strings back to Date objects
function parseDates(obj) {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  return transformValuesBeginner(obj, value =>
    typeof value === 'string' && isoDateRegex.test(value) ? new Date(value) : value
  );
}

// 3. Trim all strings
function trimStrings(obj) {
  return transformValuesBeginner(obj, value =>
    typeof value === 'string' ? value.trim() : value
  );
}

// 4. Convert empty strings to null
function emptyToNull(obj) {
  return transformValuesBeginner(obj, value =>
    value === '' ? null : value
  );
}

// 5. Round all numbers
function roundNumbers(obj, decimals = 2) {
  return transformValuesBeginner(obj, value =>
    typeof value === 'number' ? Number(value.toFixed(decimals)) : value
  );
}

console.log('Trim:', trimStrings({ a: '  hello  ', b: { c: '  world  ' } }));
console.log('Empty to null:', emptyToNull({ a: '', b: 'value' }));
console.log('Round:', roundNumbers({ a: 1.23456, b: { c: 7.89012 } }));


// ============================================
// EDGE CASES & THINGS TO REMEMBER
// ============================================

/**
 * EDGE CASES:
 * -----------
 * 1. Circular references - use WeakMap
 * 2. Special objects (Date, RegExp) - handle separately
 * 3. Symbol keys - use getOwnPropertySymbols
 * 4. Very deep nesting - consider maxDepth
 * 5. Sparse arrays - handle holes
 * 
 * THINGS TO REMEMBER:
 * -------------------
 * 1. Always return new objects (immutability)
 * 2. Check for null before typeof (null is 'object')
 * 3. Use WeakMap for seen objects (allows GC)
 * 4. Path context is useful for conditional transforms
 * 
 * TIME COMPLEXITY: O(n) where n is total values
 * SPACE COMPLEXITY: O(n) for result + O(d) for recursion depth
 */


module.exports = {
  transformValuesBeginner,
  transformValuesIntermediate,
  transformDeep,
  serializeDates,
  parseDates,
  trimStrings,
  emptyToNull,
  roundNumbers
};
