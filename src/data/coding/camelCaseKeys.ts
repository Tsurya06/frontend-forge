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
