/**
 * ============================================
 * REMOVE CIRCULAR REFERENCES - Complete Guide
 * ============================================
 * 
 * Topic: Remove circular links in JavaScript objects
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS A CIRCULAR REFERENCE?
 * -----------------------------
 * When an object references itself, directly or indirectly.
 * 
 * DIRECT: obj.self = obj
 * INDIRECT: a.b = b; b.a = a (cycle: a → b → a)
 * 
 * WHY IS IT A PROBLEM?
 * --------------------
 * 1. JSON.stringify() throws error
 * 2. Deep copy fails (infinite loop)
 * 3. Memory leaks possible
 * 4. Serialization fails
 * 
 * DETECTION STRATEGY:
 * -------------------
 * Keep track of visited objects using WeakSet/WeakMap
 * If we encounter an object we've seen, it's circular
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Detect circular references
 */
function hasCircularReference(obj) {
  const seen = new WeakSet();
  
  function detect(value) {
    if (value === null || typeof value !== 'object') {
      return false;
    }
    
    if (seen.has(value)) {
      return true; // Found circular!
    }
    
    seen.add(value);
    
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (detect(value[key])) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  return detect(obj);
}

/**
 * Beginner: Simple circular removal (replace with null)
 */
function removeCircularBeginner(obj) {
  const seen = new WeakSet();
  
  function process(value) {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    
    if (seen.has(value)) {
      return null; // Replace circular with null
    }
    
    seen.add(value);
    
    if (Array.isArray(value)) {
      return value.map(process);
    }
    
    const result = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        result[key] = process(value[key]);
      }
    }
    
    return result;
  }
  
  return process(obj);
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

// Direct circular reference
const direct = { name: 'obj' };
direct.self = direct;

console.log('Has circular (direct):', hasCircularReference(direct)); // true

// Indirect circular reference
const a = { name: 'a' };
const b = { name: 'b' };
a.ref = b;
b.ref = a;

console.log('Has circular (indirect):', hasCircularReference(a)); // true

// No circular
const normal = { a: 1, b: { c: 2 } };
console.log('Has circular (normal):', hasCircularReference(normal)); // false

// Remove circular
const cleaned = removeCircularBeginner(direct);
console.log('Cleaned:', cleaned); // { name: 'obj', self: null }
console.log('Can stringify:', JSON.stringify(cleaned));


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Remove with path information
 */
function removeCircularIntermediate(obj, options = {}) {
  const {
    replacement = '[Circular]',  // What to replace with
    keepPath = false             // Include path to circular ref
  } = options;
  
  const seen = new WeakMap();
  
  function process(value, path = 'root') {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    
    if (seen.has(value)) {
      const originalPath = seen.get(value);
      return keepPath ? `${replacement}: ${originalPath}` : replacement;
    }
    
    seen.set(value, path);
    
    if (Array.isArray(value)) {
      return value.map((item, index) => process(item, `${path}[${index}]`));
    }
    
    const result = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        result[key] = process(value[key], `${path}.${key}`);
      }
    }
    
    return result;
  }
  
  return process(obj);
}

/**
 * Intermediate: JSON.stringify replacer for circular references
 */
function getCircularReplacer(replacement = '[Circular]') {
  const seen = new WeakSet();
  
  return function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return replacement;
      }
      seen.add(value);
    }
    return value;
  };
}

// Safe JSON stringify
function safeStringify(obj, space = 2) {
  return JSON.stringify(obj, getCircularReplacer(), space);
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const complex = {
  name: 'root',
  child: {
    name: 'child',
    parent: null // will be circular
  }
};
complex.child.parent = complex;

console.log('With path:', removeCircularIntermediate(complex, { 
  keepPath: true,
  replacement: '[Circular Reference]'
}));

console.log('Safe stringify:', safeStringify(complex));


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured circular handler
 */
class CircularHandler {
  constructor(options = {}) {
    this.options = {
      replacement: '[Circular]',
      keepPath: false,
      detectOnly: false,
      onCircular: null,        // Callback when circular found
      maxDepth: Infinity,
      handleSpecialTypes: true, // Handle Map, Set, etc.
      ...options
    };
  }
  
  // Find all circular references
  findCirculars(obj) {
    const circulars = [];
    const seen = new WeakMap();
    
    const find = (value, path = []) => {
      if (value === null || typeof value !== 'object') {
        return;
      }
      
      if (seen.has(value)) {
        circulars.push({
          path: path.join('.'),
          referencesPath: seen.get(value).join('.')
        });
        return;
      }
      
      seen.set(value, [...path]);
      
      if (Array.isArray(value)) {
        value.forEach((item, index) => find(item, [...path, `[${index}]`]));
      } else if (value instanceof Map) {
        value.forEach((v, k) => find(v, [...path, `Map(${k})`]));
      } else if (value instanceof Set) {
        let i = 0;
        value.forEach(v => find(v, [...path, `Set[${i++}]`]));
      } else {
        for (const key of Object.keys(value)) {
          find(value[key], [...path, key]);
        }
      }
    };
    
    find(obj, ['root']);
    return circulars;
  }
  
  // Remove circular references
  remove(obj) {
    const seen = new WeakMap();
    const { replacement, keepPath, onCircular, maxDepth, handleSpecialTypes } = this.options;
    
    const process = (value, path = [], depth = 0) => {
      // Primitive or null
      if (value === null || typeof value !== 'object') {
        return value;
      }
      
      // Max depth
      if (depth > maxDepth) {
        return '[Max Depth]';
      }
      
      // Circular detection
      if (seen.has(value)) {
        const originalPath = seen.get(value);
        onCircular?.(path.join('.'), originalPath.join('.'));
        return keepPath ? `${replacement}: ${originalPath.join('.')}` : replacement;
      }
      
      seen.set(value, [...path]);
      
      // Date
      if (value instanceof Date) {
        return new Date(value.getTime());
      }
      
      // RegExp
      if (value instanceof RegExp) {
        return new RegExp(value.source, value.flags);
      }
      
      // Map
      if (handleSpecialTypes && value instanceof Map) {
        const result = new Map();
        value.forEach((v, k) => {
          result.set(k, process(v, [...path, `Map(${k})`], depth + 1));
        });
        return result;
      }
      
      // Set
      if (handleSpecialTypes && value instanceof Set) {
        const result = new Set();
        let i = 0;
        value.forEach(v => {
          result.add(process(v, [...path, `Set[${i++}]`], depth + 1));
        });
        return result;
      }
      
      // Array
      if (Array.isArray(value)) {
        return value.map((item, index) => 
          process(item, [...path, `[${index}]`], depth + 1)
        );
      }
      
      // Object
      const result = {};
      
      // Handle Symbol keys
      const keys = [
        ...Object.keys(value),
        ...Object.getOwnPropertySymbols(value)
      ];
      
      for (const key of keys) {
        const keyStr = typeof key === 'symbol' ? key.toString() : key;
        result[key] = process(value[key], [...path, keyStr], depth + 1);
      }
      
      return result;
    };
    
    return process(obj, ['root']);
  }
  
  // Check if has circular (faster than findCirculars)
  hasCircular(obj) {
    const seen = new WeakSet();
    
    const check = (value) => {
      if (value === null || typeof value !== 'object') return false;
      if (seen.has(value)) return true;
      seen.add(value);
      
      if (Array.isArray(value)) {
        return value.some(check);
      }
      
      return Object.values(value).some(check);
    };
    
    return check(obj);
  }
  
  // Safe stringify
  stringify(obj, space) {
    return JSON.stringify(this.remove(obj), null, space);
  }
}

/**
 * Expert: Break circular by replacing with reference IDs
 */
function serializeWithRefs(obj) {
  const seen = new Map();
  let idCounter = 0;
  
  // First pass: assign IDs to all objects
  function assignIds(value) {
    if (value === null || typeof value !== 'object') return;
    if (seen.has(value)) return;
    
    seen.set(value, idCounter++);
    
    if (Array.isArray(value)) {
      value.forEach(assignIds);
    } else {
      Object.values(value).forEach(assignIds);
    }
  }
  
  assignIds(obj);
  
  // Second pass: serialize with refs
  const serialized = new Map();
  
  function serialize(value) {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    
    const id = seen.get(value);
    
    if (serialized.has(id)) {
      return { $ref: id };
    }
    
    if (Array.isArray(value)) {
      const arr = [];
      serialized.set(id, arr);
      value.forEach((item, i) => arr[i] = serialize(item));
      return arr;
    }
    
    const result = { $id: id };
    serialized.set(id, result);
    
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        result[key] = serialize(value[key]);
      }
    }
    
    return result;
  }
  
  return serialize(obj);
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

const handler = new CircularHandler({
  keepPath: true,
  onCircular: (path, refPath) => {
    console.log(`Circular at "${path}" referencing "${refPath}"`);
  }
});

// Complex structure with multiple circulars
const root = {
  a: { name: 'a' },
  b: { name: 'b' },
  deep: {
    nested: {
      back: null
    }
  }
};
root.a.toB = root.b;
root.b.toA = root.a;
root.deep.nested.back = root;

console.log('Find all circulars:', handler.findCirculars(root));
console.log('Removed:', handler.remove(root));

// With reference IDs
console.log('\nWith refs:', JSON.stringify(serializeWithRefs(root), null, 2));


// ============================================
// PRACTICAL APPLICATIONS
// ============================================

console.log('\n=== PRACTICAL APPLICATIONS ===');

// 1. Safe logging (console.log with circular objects)
function safeLog(obj) {
  console.log(safeStringify(obj, 2));
}

// 2. Clone with circular handling
function cloneWithCirculars(obj) {
  const handler = new CircularHandler({ detectOnly: false });
  return handler.remove(obj);
}

// 3. Deep freeze with circular detection
function deepFreeze(obj, seen = new WeakSet()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return obj;
  
  seen.add(obj);
  Object.freeze(obj);
  
  Object.values(obj).forEach(value => deepFreeze(value, seen));
  return obj;
}


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * - Use WeakSet/WeakMap to track seen objects
 * - WeakSet for detection only
 * - WeakMap to store path/info
 * - JSON.stringify throws on circular
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Explain what circular reference is
 * 2. Show WeakSet for detection
 * 3. Demonstrate replacer function for JSON
 * 4. Discuss WeakSet vs Set (GC implications)
 * 
 * WHY WeakSet?
 * - Doesn't prevent garbage collection
 * - Only objects as keys
 * - Perfect for tracking seen objects
 */


module.exports = {
  hasCircularReference,
  removeCircularBeginner,
  removeCircularIntermediate,
  getCircularReplacer,
  safeStringify,
  CircularHandler,
  serializeWithRefs,
  safeLog,
  cloneWithCirculars,
  deepFreeze
};
