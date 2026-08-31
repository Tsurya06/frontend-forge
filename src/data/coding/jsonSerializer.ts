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
