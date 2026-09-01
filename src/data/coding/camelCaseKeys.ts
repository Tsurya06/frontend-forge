import type { CodingProblem } from '../../types';

export const camelCaseKeysProblem: CodingProblem = {
  id: 'coding-camel-case',
  title: 'Convert Object Keys to camelCase Recursively',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['recursion', 'objects', 'string-manipulation', 'data-transformation', 'api'],

  problem: `Implement a function \`camelCaseKeys\` that takes an object (or array) and recursively converts all of its keys from snake_case (or kebab-case, PascalCase, etc.) to camelCase. This is an extremely common real-world task when consuming REST APIs that return snake_case JSON but your frontend code uses camelCase conventions.

The function must handle deeply nested structures: objects within objects, arrays of objects, mixed arrays containing both primitives and objects, and any combination thereof. Primitives (strings, numbers, booleans, null) should pass through unchanged. Array elements should each be processed recursively, but array indices should not be treated as keys to convert.

The string conversion must handle multiple common patterns: \`user_name\` → \`userName\`, \`first-name\` → \`firstName\`, \`Content-Type\` → \`contentType\`, and \`__private_field__\` → \`privateField\`. Leading/trailing delimiters should be stripped, and consecutive delimiters should be treated as a single separator.`,

  requirements: [
    'Convert snake_case keys to camelCase (user_name → userName)',
    'Convert kebab-case keys to camelCase (content-type → contentType)',
    'Handle deeply nested objects recursively',
    'Process arrays by recursively converting each element',
    'Preserve primitive values (string, number, boolean, null, undefined) unchanged',
    'Handle edge cases like empty objects, empty arrays, and null input',
    'Strip leading and trailing underscores/hyphens from keys',
  ],

  examples: [
    {
      input: `camelCaseKeys({ user_name: 'Alice', user_age: 30 })`,
      output: `{ userName: 'Alice', userAge: 30 }`,
      explanation: 'Top-level snake_case keys are converted to camelCase. Primitive values are unchanged.',
    },
    {
      input: `camelCaseKeys({\n  user_profile: {\n    first_name: 'Bob',\n    address_info: { street_name: '123 Main' }\n  }\n})`,
      output: `{ userProfile: { firstName: 'Bob', addressInfo: { streetName: '123 Main' } } }`,
      explanation: 'Nested object keys are recursively converted at all levels.',
    },
    {
      input: `camelCaseKeys([\n  { item_id: 1, item_name: 'Apple' },\n  { item_id: 2, item_name: 'Banana' },\n])`,
      output: `[{ itemId: 1, itemName: 'Apple' }, { itemId: 2, itemName: 'Banana' }]`,
      explanation: 'Array elements that are objects have their keys converted; the array structure is preserved.',
    },
  ],

  edgeCases: [
    'Null or undefined input should return null/undefined',
    'Primitive values (string, number) should be returned as-is',
    'Already-camelCase keys should remain unchanged',
    'Keys with consecutive underscores (e.g., __proto__) should be handled',
    'Mixed arrays containing both objects and primitives',
    'Empty objects and empty arrays should return empty equivalents',
  ],

  naiveApproach: `A naive approach only handles the top level — iterating over Object.keys and converting each key without recursing into nested objects. This breaks on real-world API responses that have nested structures. Another common mistake is using a regex replace that only handles the first delimiter occurrence instead of all of them.`,

  optimalApproach: `The optimal approach separates the key conversion logic from the recursive traversal. First, write a toCamelCase helper that splits a string by underscores, hyphens, or word boundaries (using a regex like /[_\\-\\s]+/ or splitting on non-alphanumeric characters), lowercases the first segment, and capitalizes the first letter of each subsequent segment.

Then write the recursive camelCaseKeys function. Check the type of the input: if it's null or a primitive, return it directly. If it's an array, map over each element and recurse. If it's an object, iterate over its keys, convert each key with toCamelCase, and set the value to the recursively processed original value. This separation of concerns makes the code clean and testable — you can unit test the string conversion independently from the recursion logic.`,

  implementation: `function toCamelCase(str) {
  return str
    .replace(/^[_\\-]+|[_\\-]+$/g, '')
    .split(/[_\\-\\s]+/)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

function camelCaseKeys(input) {
  if (input === null || input === undefined) return input;
  if (typeof input !== 'object') return input;

  if (Array.isArray(input)) {
    return input.map((item) => camelCaseKeys(item));
  }

  const result = {};
  for (const key of Object.keys(input)) {
    const camelKey = toCamelCase(key);
    result[camelKey] = camelCaseKeys(input[key]);
  }
  return result;
}

// Usage
const apiResponse = {
  user_id: 42,
  user_name: 'alice_wonder',
  account_details: {
    created_at: '2024-01-15',
    last_login: '2024-06-01',
    billing_address: {
      street_name: '123 Main St',
      zip_code: '10001',
    },
  },
  order_history: [
    { order_id: 1, total_amount: 29.99, line_items: [{ item_name: 'Widget' }] },
    { order_id: 2, total_amount: 49.99, line_items: [{ item_name: 'Gadget' }] },
  ],
};

const result = camelCaseKeys(apiResponse);
console.log(result.userName);                        // 'alice_wonder'
console.log(result.accountDetails.billingAddress);   // { streetName: '123 Main St', zipCode: '10001' }
console.log(result.orderHistory[0].lineItems[0]);    // { itemName: 'Widget' }

// Edge cases
console.log(camelCaseKeys(null));                    // null
console.log(camelCaseKeys('hello'));                  // 'hello'
console.log(camelCaseKeys([]));                       // []
console.log(camelCaseKeys({ already_camel: 'ok' })); // { alreadyCamel: 'ok' }`,



  theoryAndConcepts: "NAMING CONVENTIONS:\n-------------------\n\ncamelCase:   myVariableName   (lowercase first, capitalize words)\nPascalCase:  MyVariableName   (capitalize all words including first)\nsnake_case:  my_variable_name (lowercase with underscores)\nkebab-case:  my-variable-name (lowercase with hyphens)\nSCREAMING_SNAKE_CASE: MY_VARIABLE_NAME (uppercase with underscores)\n\nWHY CONVERT?\n------------\n- APIs often use snake_case (Python, Ruby backends)\n- JavaScript convention is camelCase\n- Database columns often snake_case\n- CSS uses kebab-case",
  beginnerApproach: "Beginner: Convert string to camelCase\n\n\nBeginner: Convert object keys (shallow)",
  beginnerImplementation: "function toCamelCaseBeginner(str) {\n  return str\n    // Replace underscores and hyphens with spaces\n    .replace(/[-_]+/g, ' ')\n    // Capitalize first letter of each word (except first)\n    .replace(/\\s+(.)/g, (match, char) => char.toUpperCase())\n    // Remove remaining spaces and lowercase first char\n    .replace(/\\s/g, '')\n    .replace(/^./, char => char.toLowerCase());\n}\n\nfunction camelCaseKeysBeginner(obj) {\n  const result = {};\n  \n  for (const key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      const camelKey = toCamelCaseBeginner(key);\n      result[camelKey] = obj[key];\n    }\n  }\n  \n  return result;\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconsole.log('String conversions:');\nconsole.log('snake_case:', toCamelCaseBeginner('hello_world'));      // helloWorld\nconsole.log('kebab-case:', toCamelCaseBeginner('hello-world'));      // helloWorld\nconsole.log('mixed:', toCamelCaseBeginner('hello_world-test'));      // helloWorldTest\n\nconst snakeObj = {\n  user_id: 1,\n  first_name: 'John',\n  last_name: 'Doe',\n  email_address: 'john@example.com'\n};\n\nconsole.log('Object:', camelCaseKeysBeginner(snakeObj));",
  intermediateApproach: "Intermediate: Deep conversion with better regex\n\n\nIntermediate: Deep key transformation",
  intermediateImplementation: "function toCamelCase(str) {\n  return str\n    .replace(/[-_\\s]+(.)?/g, (match, char) => char ? char.toUpperCase() : '')\n    .replace(/^[A-Z]/, char => char.toLowerCase());\n}\n\nfunction toSnakeCase(str) {\n  return str\n    .replace(/([A-Z])/g, '_$1')\n    .replace(/[-\\s]+/g, '_')\n    .replace(/^_/, '')\n    .toLowerCase();\n}\n\nfunction toKebabCase(str) {\n  return str\n    .replace(/([A-Z])/g, '-$1')\n    .replace(/[_\\s]+/g, '-')\n    .replace(/^-/, '')\n    .toLowerCase();\n}\n\nfunction toPascalCase(str) {\n  const camel = toCamelCase(str);\n  return camel.charAt(0).toUpperCase() + camel.slice(1);\n}\n\nfunction toScreamingSnakeCase(str) {\n  return toSnakeCase(str).toUpperCase();\n}\n\nfunction transformKeysDeep(obj, transformer, seen = new WeakMap()) {\n  if (obj === null || typeof obj !== 'object') {\n    return obj;\n  }\n  \n  // Handle circular references\n  if (seen.has(obj)) {\n    return seen.get(obj);\n  }\n  \n  // Handle arrays\n  if (Array.isArray(obj)) {\n    const result = [];\n    seen.set(obj, result);\n    \n    for (let i = 0; i < obj.length; i++) {\n      result[i] = transformKeysDeep(obj[i], transformer, seen);\n    }\n    return result;\n  }\n  \n  // Handle objects\n  const result = {};\n  seen.set(obj, result);\n  \n  for (const key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      const newKey = transformer(key);\n      result[newKey] = transformKeysDeep(obj[key], transformer, seen);\n    }\n  }\n  \n  return result;\n}\n\n// Convenience functions\nconst camelCaseKeysDeep = (obj) => transformKeysDeep(obj, toCamelCase);\nconst snakeCaseKeysDeep = (obj) => transformKeysDeep(obj, toSnakeCase);\nconst kebabCaseKeysDeep = (obj) => transformKeysDeep(obj, toKebabCase);\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst apiResponse = {\n  user_id: 1,\n  first_name: 'John',\n  last_name: 'Doe',\n  contact_info: {\n    email_address: 'john@example.com',\n    phone_number: '123-456-7890',\n    mailing_address: {\n      street_name: '123 Main St',\n      zip_code: '12345'\n    }\n  },\n  user_roles: ['admin_user', 'power_user']  // Array values NOT changed\n};\n\nconsole.log('Deep camelCase:');\nconsole.log(JSON.stringify(camelCaseKeysDeep(apiResponse), null, 2));\n\n// Reverse: camelCase to snake_case\nconst jsObject = {\n  userId: 1,\n  firstName: 'John',\n  contactInfo: {\n    emailAddress: 'john@example.com'\n  }\n};\n\nconsole.log('\\nDeep snake_case:');\nconsole.log(JSON.stringify(snakeCaseKeysDeep(jsObject), null, 2));",
  expertApproach: "Expert: Highly configurable key transformer\n\n\nExpert: Bidirectional transformer (for API communication)",
  expertImplementation: "class KeyTransformer {\n  static converters = {\n    camel: toCamelCase,\n    snake: toSnakeCase,\n    kebab: toKebabCase,\n    pascal: toPascalCase,\n    screaming: toScreamingSnakeCase\n  };\n  \n  constructor(options = {}) {\n    this.options = {\n      case: 'camel',           // Target case\n      deep: true,              // Transform nested objects\n      preserveKeys: [],        // Keys to not transform\n      transformValues: false,  // Also transform string values\n      maxDepth: Infinity,\n      ...options\n    };\n    \n    this.converter = KeyTransformer.converters[this.options.case] || toCamelCase;\n  }\n  \n  shouldTransformKey(key) {\n    return !this.options.preserveKeys.includes(key);\n  }\n  \n  transform(obj, depth = 0) {\n    if (obj === null || typeof obj !== 'object') {\n      // Optionally transform string values\n      if (this.options.transformValues && typeof obj === 'string') {\n        return this.converter(obj);\n      }\n      return obj;\n    }\n    \n    if (depth > this.options.maxDepth) {\n      return obj;\n    }\n    \n    // Handle arrays\n    if (Array.isArray(obj)) {\n      return obj.map(item => this.transform(item, depth + 1));\n    }\n    \n    // Handle objects\n    const result = {};\n    \n    for (const key of Object.keys(obj)) {\n      const newKey = this.shouldTransformKey(key) ? this.converter(key) : key;\n      \n      if (this.options.deep) {\n        result[newKey] = this.transform(obj[key], depth + 1);\n      } else {\n        result[newKey] = obj[key];\n      }\n    }\n    \n    return result;\n  }\n}\n\nfunction createApiTransformer(options = {}) {\n  const {\n    requestCase = 'snake',  // JS -> API\n    responseCase = 'camel'  // API -> JS\n  } = options;\n  \n  const toRequest = new KeyTransformer({ case: requestCase });\n  const fromResponse = new KeyTransformer({ case: responseCase });\n  \n  return {\n    // Transform JS object for API request\n    toApi(obj) {\n      return toRequest.transform(obj);\n    },\n    \n    // Transform API response to JS\n    fromApi(obj) {\n      return fromResponse.transform(obj);\n    },\n    \n    // Wrap fetch with automatic transformation\n    async fetch(url, options = {}) {\n      const transformedOptions = { ...options };\n      \n      if (options.body && typeof options.body === 'object') {\n        transformedOptions.body = JSON.stringify(this.toApi(options.body));\n        transformedOptions.headers = {\n          'Content-Type': 'application/json',\n          ...options.headers\n        };\n      }\n      \n      const response = await fetch(url, transformedOptions);\n      const data = await response.json();\n      \n      return this.fromApi(data);\n    }\n  };\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Preserve certain keys\nconst transformer = new KeyTransformer({\n  case: 'camel',\n  preserveKeys: ['_id', '__v']  // MongoDB special keys\n});\n\nconst mongoDoc = {\n  _id: '507f1f77bcf86cd799439011',\n  __v: 0,\n  user_name: 'john',\n  created_at: new Date()\n};\n\nconsole.log('Preserve keys:', transformer.transform(mongoDoc));\n\n// API transformer\nconst apiTransformer = createApiTransformer();\n\nconst jsData = {\n  userId: 1,\n  firstName: 'John',\n  isActive: true\n};\n\nconsole.log('To API (snake_case):', apiTransformer.toApi(jsData));\nconsole.log('From API (camelCase):', apiTransformer.fromApi({\n  user_id: 1,\n  first_name: 'John',\n  is_active: true\n}));",
  interviewTraps: [
      "QUICK REFERENCE:",
      "camelCase:  str.replace(/[-_]+(.)?/g, (_, c) => c?.toUpperCase() || '')",
      "snake_case: str.replace(/[A-Z]/g, '_$1').toLowerCase()",
      "kebab-case: str.replace(/[A-Z]/g, '-$1').toLowerCase()",
      "INTERVIEW TIPS:",
      "1. Start with string converter",
      "2. Then wrap for object keys",
      "3. Add deep/recursive support"
  ],
  stepByStep: [
    'Create a toCamelCase helper: strip leading/trailing delimiters, split on underscores/hyphens/spaces.',
    'Lowercase the first word, capitalize the first letter of subsequent words, and join them.',
    'In camelCaseKeys, return null/undefined/primitives unchanged.',
    'If the input is an array, map each element through camelCaseKeys recursively.',
    'If the input is an object, iterate over Object.keys.',
    'For each key, compute the camelCase version and set the result property to the recursively processed value.',
    'Return the new object with all keys converted.',
  ],

  timeComplexity: 'O(n * k) where n is the total number of key-value pairs across all levels and k is the average key length.',
  spaceComplexity: 'O(n) for the new transformed object (full copy), plus O(d) recursion stack depth for nesting depth d.',

  commonMistakes: [
    'Only converting top-level keys and not recursing into nested objects or array elements',
    'Using a regex that only replaces the first underscore/hyphen instead of all occurrences',
    'Not handling arrays — array elements that are objects also need key conversion',
    'Mutating the original input object instead of creating a new one',
  ],

  followUps: [
    'How would you implement the reverse — camelCase to snake_case?',
    'How would you make this configurable to support multiple target conventions?',
    'How would you handle keys that are already in camelCase (avoid double-converting)?',
    'How would you implement this using a generic recursive object transformer pattern?',
  ],
};
