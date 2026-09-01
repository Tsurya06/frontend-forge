import type { CodingProblem } from '../../types';

export const jsonSerializerProblem: CodingProblem = {
  id: 'coding-json-serializer',
  title: 'Implement JSON.stringify',
  difficulty: 'Advanced',
  category: 'Coding',
  tags: ['serialization', 'recursion', 'type-checking', 'edge-cases', 'json'],

  problem: `Implement a custom version of JSON.stringify that converts a JavaScript value into a JSON-formatted string. Your implementation must handle all primitive types (strings, numbers, booleans, null), as well as complex types like nested objects and arrays.

The function should correctly handle edge cases such as undefined values (omitted from objects, converted to null in arrays), function values (treated the same as undefined), special number values like NaN and Infinity (converted to null), and Date objects (converted via toISOString). The behavior should match the native JSON.stringify as closely as possible.

This is a classic interview problem that tests your understanding of JavaScript type coercion, recursion, and the JSON specification. A production-quality solution should also handle circular references gracefully rather than throwing a stack overflow.`,

  requirements: [
    'Handle primitive types: string, number, boolean, null',
    'Handle arrays with recursive serialization of elements',
    'Handle plain objects with recursive serialization of values',
    'Convert undefined and function values to null inside arrays',
    'Omit keys with undefined or function values in objects',
    'Convert NaN and Infinity to null',
    'Handle Date objects by calling toISOString()',
    'Properly escape special characters in strings',
    'Handle nested structures of arbitrary depth',
  ],

  examples: [
    {
      input: 'jsonStringify({ a: 1, b: "hello", c: true })',
      output: '\'{"a":1,"b":"hello","c":true}\'',
      explanation:
        'Object with primitives is serialized with quoted keys and appropriate value formatting.',
    },
    {
      input: 'jsonStringify([1, "two", null, undefined, true])',
      output: '\'[1,"two",null,null,true]\'',
      explanation:
        'Arrays serialize each element; undefined becomes null in array context.',
    },
    {
      input: 'jsonStringify({ a: undefined, b: function(){}, c: 42 })',
      output: '\'{"c":42}\'',
      explanation:
        'Keys with undefined or function values are omitted from the output.',
    },
  ],

  edgeCases: [
    'NaN and Infinity should serialize as null',
    'Nested objects and arrays of arbitrary depth',
    'Empty objects {} and empty arrays []',
    'Strings containing quotes, backslashes, and control characters',
    'Date objects should use toISOString()',
  ],

  naiveApproach: `A naive approach is to use typeof checks and simple string concatenation. You start by checking the type of the input, handle primitives directly, then iterate over arrays and objects. The main issue with the naive approach is forgetting edge cases like NaN, Infinity, undefined in different contexts (array vs object), and special characters in strings. Without careful handling, the output will diverge from the real JSON.stringify behavior.`,

  optimalApproach: `The optimal approach uses a single recursive function with a clear type-dispatch pattern. First, handle the null case (since typeof null === 'object'). Then dispatch on typeof: strings get wrapped in quotes with special-character escaping, numbers check for NaN/Infinity and convert to 'null', booleans convert directly to string.

For objects, check if the value is a Date (use toISOString), an Array (map elements recursively, converting undefined/function to null), or a plain object (iterate keys, skip undefined/function values, recursively serialize the rest). This clean dispatch avoids bugs and handles all edge cases in a maintainable way. Each branch is independent and easy to test.`,

  implementation: `function jsonStringify(value) {
  if (value === null) {
    return 'null';
  }

  const type = typeof value;

  if (type === 'undefined' || type === 'function' || type === 'symbol') {
    return undefined;
  }

  if (type === 'boolean') {
    return value.toString();
  }

  if (type === 'number') {
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return 'null';
    }
    return value.toString();
  }

  if (type === 'string') {
    return '"' + value
      .replace(/\\\\/g, '\\\\\\\\')
      .replace(/"/g, '\\\\"')
      .replace(/\\n/g, '\\\\n')
      .replace(/\\r/g, '\\\\r')
      .replace(/\\t/g, '\\\\t') + '"';
  }

  if (type === 'bigint') {
    throw new TypeError('BigInt value can\\'t be serialized in JSON');
  }

  if (value instanceof Date) {
    return '"' + value.toISOString() + '"';
  }

  if (Array.isArray(value)) {
    const items = value.map(item => {
      const serialized = jsonStringify(item);
      return serialized === undefined ? 'null' : serialized;
    });
    return '[' + items.join(',') + ']';
  }

  if (type === 'object') {
    const pairs = [];
    const keys = Object.keys(value);
    for (const key of keys) {
      const serialized = jsonStringify(value[key]);
      if (serialized !== undefined) {
        pairs.push('"' + key + '":' + serialized);
      }
    }
    return '{' + pairs.join(',') + '}';
  }

  return undefined;
}

// Usage
console.log(jsonStringify({ a: 1, b: "hello" }));
// '{"a":1,"b":"hello"}'

console.log(jsonStringify([1, null, undefined, true]));
// '[1,null,null,true]'

console.log(jsonStringify({ fn: function(){}, val: 42 }));
// '{"val":42}'`,

  implementationTS: `function jsonStringify(value: unknown): string | undefined {
  if (value === null) {
    return 'null';
  }

  const type = typeof value;

  if (type === 'undefined' || type === 'function' || type === 'symbol') {
    return undefined;
  }

  if (type === 'boolean') {
    return (value as boolean).toString();
  }

  if (type === 'number') {
    const num = value as number;
    if (Number.isNaN(num) || !Number.isFinite(num)) {
      return 'null';
    }
    return num.toString();
  }

  if (type === 'string') {
    return '"' + (value as string)
      .replace(/\\\\/g, '\\\\\\\\')
      .replace(/"/g, '\\\\"')
      .replace(/\\n/g, '\\\\n')
      .replace(/\\r/g, '\\\\r')
      .replace(/\\t/g, '\\\\t') + '"';
  }

  if (type === 'bigint') {
    throw new TypeError('BigInt value can\\'t be serialized in JSON');
  }

  if (value instanceof Date) {
    return '"' + value.toISOString() + '"';
  }

  if (Array.isArray(value)) {
    const items: string[] = value.map((item: unknown) => {
      const serialized = jsonStringify(item);
      return serialized === undefined ? 'null' : serialized;
    });
    return '[' + items.join(',') + ']';
  }

  if (type === 'object') {
    const pairs: string[] = [];
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    for (const key of keys) {
      const serialized = jsonStringify(obj[key]);
      if (serialized !== undefined) {
        pairs.push('"' + key + '":' + serialized);
      }
    }
    return '{' + pairs.join(',') + '}';
  }

  return undefined;
}`,



  theoryAndConcepts: "WHAT IS JSON SERIALIZATION?\n---------------------------\nJSON (JavaScript Object Notation) serialization is the process of converting\na JavaScript value (object, array, primitive) into a JSON-formatted string.\n\nWHY IS IT IMPORTANT?\n--------------------\n1. Sending data over network (APIs)\n2. Storing data in localStorage/sessionStorage\n3. Deep cloning objects (simple cases)\n4. Logging complex objects\n\nNATIVE METHOD: JSON.stringify()\n--------------------------------\nJavaScript has built-in JSON.stringify(), but understanding how it works\ninternally is crucial for interviews and edge case handling.",
  beginnerApproach: "Beginner: Handle basic types only\n- strings, numbers, booleans, null, arrays, simple objects",
  beginnerImplementation: "function jsonStringifyBeginner(value) {\n  // Handle null\n  if (value === null) {\n    return 'null';\n  }\n  \n  // Handle boolean\n  if (typeof value === 'boolean') {\n    return value ? 'true' : 'false';\n  }\n  \n  // Handle number\n  if (typeof value === 'number') {\n    return String(value);\n  }\n  \n  // Handle string - wrap in quotes\n  if (typeof value === 'string') {\n    return '\"' + value + '\"';\n  }\n  \n  // Handle array\n  if (Array.isArray(value)) {\n    const items = value.map(item => jsonStringifyBeginner(item));\n    return '[' + items.join(',') + ']';\n  }\n  \n  // Handle object\n  if (typeof value === 'object') {\n    const pairs = [];\n    for (const key in value) {\n      if (value.hasOwnProperty(key)) {\n        pairs.push('\"' + key + '\":' + jsonStringifyBeginner(value[key]));\n      }\n    }\n    return '{' + pairs.join(',') + '}';\n  }\n  \n  return undefined;\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL TESTS ===');\nconsole.log(jsonStringifyBeginner(null));              // null\nconsole.log(jsonStringifyBeginner(true));              // true\nconsole.log(jsonStringifyBeginner(42));                // 42\nconsole.log(jsonStringifyBeginner('hello'));           // \"hello\"\nconsole.log(jsonStringifyBeginner([1, 2, 3]));         // [1,2,3]\nconsole.log(jsonStringifyBeginner({ a: 1, b: 2 }));    // {\"a\":1,\"b\":2}",
  intermediateApproach: "Intermediate: Handle special cases\n- undefined, functions, NaN, Infinity\n- String escaping\n- Date objects",
  intermediateImplementation: "function jsonStringifyIntermediate(value) {\n  // Handle null\n  if (value === null) {\n    return 'null';\n  }\n  \n  // Handle undefined - returns undefined (will be omitted)\n  if (value === undefined) {\n    return undefined;\n  }\n  \n  // Handle boolean\n  if (typeof value === 'boolean') {\n    return value ? 'true' : 'false';\n  }\n  \n  // Handle number - special cases for NaN and Infinity\n  if (typeof value === 'number') {\n    // NaN and Infinity become null in JSON\n    if (Number.isNaN(value) || !Number.isFinite(value)) {\n      return 'null';\n    }\n    return String(value);\n  }\n  \n  // Handle string with escape characters\n  if (typeof value === 'string') {\n    return '\"' + escapeString(value) + '\"';\n  }\n  \n  // Handle function - returns undefined\n  if (typeof value === 'function') {\n    return undefined;\n  }\n  \n  // Handle Symbol - returns undefined\n  if (typeof value === 'symbol') {\n    return undefined;\n  }\n  \n  // Handle Date\n  if (value instanceof Date) {\n    return '\"' + value.toISOString() + '\"';\n  }\n  \n  // Handle array\n  if (Array.isArray(value)) {\n    const items = value.map(item => {\n      const result = jsonStringifyIntermediate(item);\n      // undefined, function, symbol in arrays become null\n      return result === undefined ? 'null' : result;\n    });\n    return '[' + items.join(',') + ']';\n  }\n  \n  // Handle object\n  if (typeof value === 'object') {\n    const pairs = [];\n    for (const key in value) {\n      if (value.hasOwnProperty(key)) {\n        const serializedValue = jsonStringifyIntermediate(value[key]);\n        // Skip undefined, function, symbol values in objects\n        if (serializedValue !== undefined) {\n          pairs.push('\"' + escapeString(key) + '\":' + serializedValue);\n        }\n      }\n    }\n    return '{' + pairs.join(',') + '}';\n  }\n  \n  return undefined;\n}\n\n// Helper: Escape special characters in strings\nfunction escapeString(str) {\n  const escapeMap = {\n    '\"': '\\\\\"',      // Quote\n    '\\\\': '\\\\\\\\',    // Backslash\n    '\\n': '\\\\n',     // Newline\n    '\\r': '\\\\r',     // Carriage return\n    '\\t': '\\\\t',     // Tab\n    '\\b': '\\\\b',     // Backspace\n    '\\f': '\\\\f'      // Form feed\n  };\n  \n  let result = '';\n  for (const char of str) {\n    result += escapeMap[char] || char;\n  }\n  return result;\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL TESTS ===');\nconsole.log(jsonStringifyIntermediate(undefined));           // undefined\nconsole.log(jsonStringifyIntermediate(NaN));                 // null\nconsole.log(jsonStringifyIntermediate(Infinity));            // null\nconsole.log(jsonStringifyIntermediate(new Date('2024-01-01'))); // \"2024-01-01T00:00:00.000Z\"\nconsole.log(jsonStringifyIntermediate('hello\\nworld'));      // \"hello\\nworld\"\nconsole.log(jsonStringifyIntermediate({ a: undefined, b: 1 })); // {\"b\":1}\nconsole.log(jsonStringifyIntermediate([1, undefined, 3]));   // [1,null,3]\nconsole.log(jsonStringifyIntermediate({ fn: () => {} }));    // {}",
  expertApproach: "Expert: Full implementation with all edge cases\n- BigInt handling\n- toJSON() method support\n- Replacer function (like JSON.stringify)\n- Space parameter for formatting\n- Circular reference detection",
  expertImplementation: "function jsonStringifyExpert(value, replacer = null, space = 0) {\n  // Track seen objects for circular reference detection\n  const seen = new WeakSet();\n  \n  // Normalize space parameter\n  const indent = typeof space === 'number' \n    ? ' '.repeat(Math.min(space, 10)) \n    : (typeof space === 'string' ? space.slice(0, 10) : '');\n  \n  function serialize(val, currentIndent = '') {\n    // Handle toJSON method\n    if (val !== null && typeof val === 'object' && typeof val.toJSON === 'function') {\n      val = val.toJSON();\n    }\n    \n    // Handle null\n    if (val === null) {\n      return 'null';\n    }\n    \n    // Handle undefined\n    if (val === undefined) {\n      return undefined;\n    }\n    \n    // Handle boolean\n    if (typeof val === 'boolean') {\n      return val ? 'true' : 'false';\n    }\n    \n    // Handle number\n    if (typeof val === 'number') {\n      if (Number.isNaN(val) || !Number.isFinite(val)) {\n        return 'null';\n      }\n      return String(val);\n    }\n    \n    // Handle BigInt - throws error like native JSON.stringify\n    if (typeof val === 'bigint') {\n      throw new TypeError('Do not know how to serialize a BigInt');\n    }\n    \n    // Handle string\n    if (typeof val === 'string') {\n      return '\"' + escapeStringExpert(val) + '\"';\n    }\n    \n    // Handle function and symbol\n    if (typeof val === 'function' || typeof val === 'symbol') {\n      return undefined;\n    }\n    \n    // Handle Date (after toJSON check, but Date has toJSON)\n    if (val instanceof Date) {\n      return '\"' + val.toISOString() + '\"';\n    }\n    \n    // Handle circular reference\n    if (seen.has(val)) {\n      throw new TypeError('Converting circular structure to JSON');\n    }\n    seen.add(val);\n    \n    // Handle array\n    if (Array.isArray(val)) {\n      if (val.length === 0) {\n        seen.delete(val);\n        return '[]';\n      }\n      \n      const nextIndent = currentIndent + indent;\n      const items = val.map(item => {\n        const result = serialize(item, nextIndent);\n        return result === undefined ? 'null' : result;\n      });\n      \n      seen.delete(val);\n      \n      if (indent) {\n        return '[\\n' + nextIndent + items.join(',\\n' + nextIndent) + '\\n' + currentIndent + ']';\n      }\n      return '[' + items.join(',') + ']';\n    }\n    \n    // Handle object\n    if (typeof val === 'object') {\n      const keys = Object.keys(val);\n      \n      // Apply replacer if it's an array (filter keys)\n      const filteredKeys = Array.isArray(replacer) \n        ? keys.filter(k => replacer.includes(k))\n        : keys;\n      \n      if (filteredKeys.length === 0) {\n        seen.delete(val);\n        return '{}';\n      }\n      \n      const nextIndent = currentIndent + indent;\n      const pairs = [];\n      \n      for (const key of filteredKeys) {\n        let serializedValue;\n        \n        // Apply replacer function\n        if (typeof replacer === 'function') {\n          const replaced = replacer(key, val[key]);\n          serializedValue = serialize(replaced, nextIndent);\n        } else {\n          serializedValue = serialize(val[key], nextIndent);\n        }\n        \n        if (serializedValue !== undefined) {\n          const serializedKey = '\"' + escapeStringExpert(key) + '\"';\n          if (indent) {\n            pairs.push(serializedKey + ': ' + serializedValue);\n          } else {\n            pairs.push(serializedKey + ':' + serializedValue);\n          }\n        }\n      }\n      \n      seen.delete(val);\n      \n      if (pairs.length === 0) {\n        return '{}';\n      }\n      \n      if (indent) {\n        return '{\\n' + nextIndent + pairs.join(',\\n' + nextIndent) + '\\n' + currentIndent + '}';\n      }\n      return '{' + pairs.join(',') + '}';\n    }\n    \n    return undefined;\n  }\n  \n  // Apply replacer to root value if function\n  let rootValue = value;\n  if (typeof replacer === 'function') {\n    rootValue = replacer('', value);\n  }\n  \n  return serialize(rootValue);\n}\n\n// Expert string escaping with unicode support\nfunction escapeStringExpert(str) {\n  let result = '';\n  \n  for (let i = 0; i < str.length; i++) {\n    const char = str[i];\n    const code = str.charCodeAt(i);\n    \n    switch (char) {\n      case '\"':  result += '\\\\\"'; break;\n      case '\\\\': result += '\\\\\\\\'; break;\n      case '\\n': result += '\\\\n'; break;\n      case '\\r': result += '\\\\r'; break;\n      case '\\t': result += '\\\\t'; break;\n      case '\\b': result += '\\\\b'; break;\n      case '\\f': result += '\\\\f'; break;\n      default:\n        // Escape control characters (0x00-0x1F)\n        if (code < 0x20) {\n          result += '\\\\u' + code.toString(16).padStart(4, '0');\n        } else {\n          result += char;\n        }\n    }\n  }\n  \n  return result;\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL TESTS ===');\n\n// Basic test\nconsole.log(jsonStringifyExpert({ a: 1, b: 'hello' }));\n\n// With formatting (space = 2)\nconsole.log(jsonStringifyExpert({ a: 1, b: { c: 2 } }, null, 2));\n\n// With replacer function\nconsole.log(jsonStringifyExpert(\n  { a: 1, b: 2, c: 3 },\n  (key, value) => typeof value === 'number' ? value * 2 : value\n));\n\n// With replacer array (filter keys)\nconsole.log(jsonStringifyExpert({ a: 1, b: 2, c: 3 }, ['a', 'c']));\n\n// toJSON support\nconst objWithToJSON = {\n  data: 'secret',\n  toJSON() {\n    return { data: 'redacted' };\n  }\n};\nconsole.log(jsonStringifyExpert(objWithToJSON));\n\n// Circular reference detection\ntry {\n  const circular = { a: 1 };\n  circular.self = circular;\n  jsonStringifyExpert(circular);\n} catch (e) {\n  console.log('Circular reference error:', e.message);\n}\n\n// BigInt error\ntry {\n  jsonStringifyExpert({ big: BigInt(123) });\n} catch (e) {\n  console.log('BigInt error:', e.message);\n}",
  interviewTraps: [
      "console.log('\\n=== EDGE CASES ===');",
      "EDGE CASE 1: Empty values",
      "console.log('Empty object:', jsonStringifyExpert({}));           // {}",
      "console.log('Empty array:', jsonStringifyExpert([]));            // []",
      "console.log('Empty string:', jsonStringifyExpert(''));           // \"\"",
      "EDGE CASE 2: Nested structures",
      "console.log('Deeply nested:', jsonStringifyExpert({ a: { b: { c: { d: 1 } } } }));",
      "EDGE CASE 3: Mixed array types"
  ],
  practiceExercises: [
      "EXERCISE 1: Implement JSON.parse (reverse of stringify)",
      "EXERCISE 2: Add support for Map and Set (convert to array)",
      "EXERCISE 3: Implement pretty-print with custom indentation",
      "EXERCISE 4: Add support for comments in JSON (non-standard)",
      "EXERCISE 5: Handle very deep nesting without stack overflow"
  ],
  stepByStep: [
    'Check if the value is null — return the string "null" immediately.',
    'Use typeof to dispatch: handle undefined, function, symbol by returning undefined.',
    'For booleans, return the string representation directly.',
    'For numbers, check for NaN and Infinity, returning "null" for those; otherwise return the string form.',
    'For strings, wrap in quotes and escape special characters (backslash, quotes, newlines, tabs).',
    'For Date instances, return the quoted ISO string.',
    'For arrays, map each element through the function recursively, replacing undefined results with "null", and join with commas.',
    'For plain objects, iterate keys, skip those whose serialized value is undefined, and build key-value pairs.',
    'Return the composed string for objects/arrays wrapped in the appropriate brackets.',
  ],

  timeComplexity: 'O(n) where n is the total number of values in the structure (each value is visited exactly once).',
  spaceComplexity: 'O(d) where d is the maximum nesting depth (recursion stack), plus O(n) for the output string.',

  commonMistakes: [
    'Forgetting that typeof null === "object" and not handling null before the object branch',
    'Not converting undefined/functions to null inside arrays while omitting them in objects',
    'Missing string escaping for backslashes, quotes, and control characters',
    'Not handling NaN and Infinity as special number cases',
  ],

  followUps: [
    'How would you add circular reference detection? (Hint: use a Set or WeakSet)',
    'How would you implement the replacer parameter that JSON.stringify accepts?',
    'How would you implement the space/indentation parameter for pretty-printing?',
  ],
};
