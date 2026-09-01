/**
 * ============================================
 * CONVERT KEYS TO CAMELCASE - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function to convert all keys in an object to camelCase
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * NAMING CONVENTIONS:
 * -------------------
 * 
 * camelCase:   myVariableName   (lowercase first, capitalize words)
 * PascalCase:  MyVariableName   (capitalize all words including first)
 * snake_case:  my_variable_name (lowercase with underscores)
 * kebab-case:  my-variable-name (lowercase with hyphens)
 * SCREAMING_SNAKE_CASE: MY_VARIABLE_NAME (uppercase with underscores)
 * 
 * WHY CONVERT?
 * ------------
 * - APIs often use snake_case (Python, Ruby backends)
 * - JavaScript convention is camelCase
 * - Database columns often snake_case
 * - CSS uses kebab-case
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Convert string to camelCase
 */
function toCamelCaseBeginner(str) {
  return str
    // Replace underscores and hyphens with spaces
    .replace(/[-_]+/g, ' ')
    // Capitalize first letter of each word (except first)
    .replace(/\s+(.)/g, (match, char) => char.toUpperCase())
    // Remove remaining spaces and lowercase first char
    .replace(/\s/g, '')
    .replace(/^./, char => char.toLowerCase());
}

/**
 * Beginner: Convert object keys (shallow)
 */
function camelCaseKeysBeginner(obj) {
  const result = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = toCamelCaseBeginner(key);
      result[camelKey] = obj[key];
    }
  }
  
  return result;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

console.log('String conversions:');
console.log('snake_case:', toCamelCaseBeginner('hello_world'));      // helloWorld
console.log('kebab-case:', toCamelCaseBeginner('hello-world'));      // helloWorld
console.log('mixed:', toCamelCaseBeginner('hello_world-test'));      // helloWorldTest

const snakeObj = {
  user_id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email_address: 'john@example.com'
};

console.log('Object:', camelCaseKeysBeginner(snakeObj));


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Deep conversion with better regex
 */
function toCamelCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (match, char) => char ? char.toUpperCase() : '')
    .replace(/^[A-Z]/, char => char.toLowerCase());
}

function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[-\s]+/g, '_')
    .replace(/^_/, '')
    .toLowerCase();
}

function toKebabCase(str) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[_\s]+/g, '-')
    .replace(/^-/, '')
    .toLowerCase();
}

function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toScreamingSnakeCase(str) {
  return toSnakeCase(str).toUpperCase();
}

/**
 * Intermediate: Deep key transformation
 */
function transformKeysDeep(obj, transformer, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle circular references
  if (seen.has(obj)) {
    return seen.get(obj);
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    const result = [];
    seen.set(obj, result);
    
    for (let i = 0; i < obj.length; i++) {
      result[i] = transformKeysDeep(obj[i], transformer, seen);
    }
    return result;
  }
  
  // Handle objects
  const result = {};
  seen.set(obj, result);
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = transformer(key);
      result[newKey] = transformKeysDeep(obj[key], transformer, seen);
    }
  }
  
  return result;
}

// Convenience functions
const camelCaseKeysDeep = (obj) => transformKeysDeep(obj, toCamelCase);
const snakeCaseKeysDeep = (obj) => transformKeysDeep(obj, toSnakeCase);
const kebabCaseKeysDeep = (obj) => transformKeysDeep(obj, toKebabCase);

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const apiResponse = {
  user_id: 1,
  first_name: 'John',
  last_name: 'Doe',
  contact_info: {
    email_address: 'john@example.com',
    phone_number: '123-456-7890',
    mailing_address: {
      street_name: '123 Main St',
      zip_code: '12345'
    }
  },
  user_roles: ['admin_user', 'power_user']  // Array values NOT changed
};

console.log('Deep camelCase:');
console.log(JSON.stringify(camelCaseKeysDeep(apiResponse), null, 2));

// Reverse: camelCase to snake_case
const jsObject = {
  userId: 1,
  firstName: 'John',
  contactInfo: {
    emailAddress: 'john@example.com'
  }
};

console.log('\nDeep snake_case:');
console.log(JSON.stringify(snakeCaseKeysDeep(jsObject), null, 2));


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Highly configurable key transformer
 */
class KeyTransformer {
  static converters = {
    camel: toCamelCase,
    snake: toSnakeCase,
    kebab: toKebabCase,
    pascal: toPascalCase,
    screaming: toScreamingSnakeCase
  };
  
  constructor(options = {}) {
    this.options = {
      case: 'camel',           // Target case
      deep: true,              // Transform nested objects
      preserveKeys: [],        // Keys to not transform
      transformValues: false,  // Also transform string values
      maxDepth: Infinity,
      ...options
    };
    
    this.converter = KeyTransformer.converters[this.options.case] || toCamelCase;
  }
  
  shouldTransformKey(key) {
    return !this.options.preserveKeys.includes(key);
  }
  
  transform(obj, depth = 0) {
    if (obj === null || typeof obj !== 'object') {
      // Optionally transform string values
      if (this.options.transformValues && typeof obj === 'string') {
        return this.converter(obj);
      }
      return obj;
    }
    
    if (depth > this.options.maxDepth) {
      return obj;
    }
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => this.transform(item, depth + 1));
    }
    
    // Handle objects
    const result = {};
    
    for (const key of Object.keys(obj)) {
      const newKey = this.shouldTransformKey(key) ? this.converter(key) : key;
      
      if (this.options.deep) {
        result[newKey] = this.transform(obj[key], depth + 1);
      } else {
        result[newKey] = obj[key];
      }
    }
    
    return result;
  }
}

/**
 * Expert: Bidirectional transformer (for API communication)
 */
function createApiTransformer(options = {}) {
  const {
    requestCase = 'snake',  // JS -> API
    responseCase = 'camel'  // API -> JS
  } = options;
  
  const toRequest = new KeyTransformer({ case: requestCase });
  const fromResponse = new KeyTransformer({ case: responseCase });
  
  return {
    // Transform JS object for API request
    toApi(obj) {
      return toRequest.transform(obj);
    },
    
    // Transform API response to JS
    fromApi(obj) {
      return fromResponse.transform(obj);
    },
    
    // Wrap fetch with automatic transformation
    async fetch(url, options = {}) {
      const transformedOptions = { ...options };
      
      if (options.body && typeof options.body === 'object') {
        transformedOptions.body = JSON.stringify(this.toApi(options.body));
        transformedOptions.headers = {
          'Content-Type': 'application/json',
          ...options.headers
        };
      }
      
      const response = await fetch(url, transformedOptions);
      const data = await response.json();
      
      return this.fromApi(data);
    }
  };
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Preserve certain keys
const transformer = new KeyTransformer({
  case: 'camel',
  preserveKeys: ['_id', '__v']  // MongoDB special keys
});

const mongoDoc = {
  _id: '507f1f77bcf86cd799439011',
  __v: 0,
  user_name: 'john',
  created_at: new Date()
};

console.log('Preserve keys:', transformer.transform(mongoDoc));

// API transformer
const apiTransformer = createApiTransformer();

const jsData = {
  userId: 1,
  firstName: 'John',
  isActive: true
};

console.log('To API (snake_case):', apiTransformer.toApi(jsData));
console.log('From API (camelCase):', apiTransformer.fromApi({
  user_id: 1,
  first_name: 'John',
  is_active: true
}));


// ============================================
// EDGE CASES
// ============================================

console.log('\n=== EDGE CASES ===');

// Acronyms
console.log('XMLParser:', toCamelCase('XML_parser'));        // xmlParser
console.log('parseJSON:', toSnakeCase('parseJSON'));         // parse_j_s_o_n (might not be desired)

// Better acronym handling
function toCamelCasePreserveAcronyms(str) {
  return str
    .replace(/[-_\s]+(.)/g, (match, char) => char.toUpperCase())
    .replace(/^[A-Z]+/, match => match.toLowerCase());
}

console.log('Better acronyms:', toCamelCasePreserveAcronyms('XML_HTTP_request')); // xmlHTTPRequest

// Empty string
console.log('Empty:', toCamelCase('')); // ''

// Already camelCase
console.log('Already camel:', toCamelCase('alreadyCamelCase')); // alreadycamelcase (may lowercase)

// Numbers
console.log('With numbers:', toCamelCase('user_123_name')); // user123Name


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * camelCase:  str.replace(/[-_]+(.)?/g, (_, c) => c?.toUpperCase() || '')
 * snake_case: str.replace(/[A-Z]/g, '_$1').toLowerCase()
 * kebab-case: str.replace(/[A-Z]/g, '-$1').toLowerCase()
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with string converter
 * 2. Then wrap for object keys
 * 3. Add deep/recursive support
 * 4. Discuss circular reference handling
 * 
 * REGEX PATTERNS:
 * ---------------
 * /[-_]+(.)?/g  - Match separator + optional char
 * /[A-Z]/g      - Match uppercase letters
 * /^[A-Z]/      - Match first char if uppercase
 */


module.exports = {
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  toPascalCase,
  toScreamingSnakeCase,
  camelCaseKeysBeginner,
  camelCaseKeysDeep,
  snakeCaseKeysDeep,
  kebabCaseKeysDeep,
  transformKeysDeep,
  KeyTransformer,
  createApiTransformer
};
