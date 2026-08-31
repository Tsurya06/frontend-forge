import type { CodingProblem } from '../../types';

export const mergeUserRowsProblem: CodingProblem = {
  id: 'coding-merge-rows',
  title: 'Merge Data Rows by User ID',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['data-processing', 'Map', 'reduce', 'grouping', 'real-world'],

  problem: `Given an array of data rows where each row has a userId and various other properties, merge all rows belonging to the same user into a single consolidated object. When the same property appears in multiple rows for the same user, later values should overwrite earlier ones (last-write-wins). Array properties should be concatenated rather than overwritten.

This is an extremely common data processing task in real-world applications: combining API responses from multiple endpoints, merging data from different database tables, consolidating event logs, or aggregating user activity across sessions. The challenge is handling the merge strategy correctly for different data types.

Your solution should be efficient (single pass using a Map for O(n) performance), handle missing or null fields gracefully, and produce clean output without duplicate array entries when specified.`,

  requirements: [
    'Group rows by userId into single consolidated objects',
    'Scalar properties: last-write-wins (later rows overwrite earlier)',
    'Array properties: concatenate arrays from all rows for the same user',
    'Handle rows with missing or null/undefined fields (skip them)',
    'Maintain the order of first appearance for users',
    'Remove duplicate entries in concatenated arrays (optional, configurable)',
    'Return an array of merged user objects',
  ],

  examples: [
    {
      input: `mergeUserRows([
  { userId: 1, name: "Alice", roles: ["admin"] },
  { userId: 2, name: "Bob", roles: ["user"] },
  { userId: 1, email: "alice@example.com", roles: ["editor"] }
])`,
      output: `[
  { userId: 1, name: "Alice", email: "alice@example.com", roles: ["admin", "editor"] },
  { userId: 2, name: "Bob", roles: ["user"] }
]`,
      explanation: 'Alice\'s rows are merged: name from first row, email from third, roles concatenated.',
    },
    {
      input: `mergeUserRows([
  { userId: 1, score: 10 },
  { userId: 1, score: 25 },
  { userId: 1, score: 15 }
])`,
      output: `[{ userId: 1, score: 15 }]`,
      explanation: 'Scalar values use last-write-wins: the final score of 15 overwrites 10 and 25.',
    },
    {
      input: `mergeUserRows([
  { userId: "a", tags: ["js"], level: 1 },
  { userId: "a", tags: ["ts", "js"], level: 2 }
], { deduplicateArrays: true })`,
      output: `[{ userId: "a", tags: ["js", "ts"], level: 2 }]`,
      explanation: 'With deduplication enabled, duplicate "js" in tags is removed.',
    },
  ],

  edgeCases: [
    'Empty input array (return empty array)',
    'All rows have unique userIds (no merging needed)',
    'Rows with null or undefined field values',
    'Nested objects within rows (shallow merge vs deep merge)',
    'Mixed types for the same field across rows (e.g., string in one, array in another)',
  ],

  naiveApproach: `A naive approach uses nested loops: for each row, search through a result array to find an existing entry with the same userId, then merge. This is O(n^2) because searching the result array is O(n) for each of the n rows. It also tends to have messy merge logic with lots of if/else branches for different types.`,

  optimalApproach: `The optimal approach uses a Map keyed by userId for O(1) lookups. Iterate through rows once. For each row, check if the userId exists in the Map. If not, create a new entry (clone the row). If it does, merge the row into the existing entry: for each property, check if both the existing value and the new value are arrays — if so, concatenate them. Otherwise, overwrite with the new value (last-write-wins).

After processing all rows, convert the Map values to an array. The Map preserves insertion order, so users appear in the order of their first row. Optional deduplication of arrays uses a Set. This runs in O(n * k) where n is the number of rows and k is the average number of properties per row — essentially linear.`,

  implementation: `function mergeUserRows(rows, options = {}) {
  const { deduplicateArrays = false } = options;
  const userMap = new Map();

  for (const row of rows) {
    const { userId, ...rest } = row;

    if (!userMap.has(userId)) {
      const entry = { userId };
      for (const [key, value] of Object.entries(rest)) {
        if (value === null || value === undefined) continue;
        entry[key] = Array.isArray(value) ? [...value] : value;
      }
      userMap.set(userId, entry);
      continue;
    }

    const existing = userMap.get(userId);

    for (const [key, value] of Object.entries(rest)) {
      if (value === null || value === undefined) continue;

      if (Array.isArray(value) && Array.isArray(existing[key])) {
        existing[key] = [...existing[key], ...value];
      } else if (Array.isArray(value)) {
        existing[key] = [...value];
      } else {
        existing[key] = value;
      }
    }
  }

  if (deduplicateArrays) {
    for (const entry of userMap.values()) {
      for (const [key, value] of Object.entries(entry)) {
        if (Array.isArray(value)) {
          entry[key] = [...new Set(value)];
        }
      }
    }
  }

  return Array.from(userMap.values());
}

// Usage
const rows = [
  { userId: 1, name: 'Alice', roles: ['admin'], department: 'Engineering' },
  { userId: 2, name: 'Bob', roles: ['user'], department: 'Marketing' },
  { userId: 1, email: 'alice@co.com', roles: ['editor'], level: 3 },
  { userId: 2, phone: '555-1234' },
  { userId: 1, level: 5, roles: ['viewer'] },
];

const merged = mergeUserRows(rows);
console.log(JSON.stringify(merged, null, 2));
// [
//   {
//     userId: 1,
//     name: "Alice",
//     roles: ["admin", "editor", "viewer"],
//     department: "Engineering",
//     email: "alice@co.com",
//     level: 5
//   },
//   {
//     userId: 2,
//     name: "Bob",
//     roles: ["user"],
//     department: "Marketing",
//     phone: "555-1234"
//   }
// ]`,

  implementationTS: `interface Row {
  userId: string | number;
  [key: string]: unknown;
}

interface MergeOptions {
  deduplicateArrays?: boolean;
}

function mergeUserRows(rows: Row[], options: MergeOptions = {}): Row[] {
  const { deduplicateArrays = false } = options;
  const userMap = new Map<string | number, Row>();

  for (const row of rows) {
    const { userId, ...rest } = row;

    if (!userMap.has(userId)) {
      const entry: Row = { userId };
      for (const [key, value] of Object.entries(rest)) {
        if (value === null || value === undefined) continue;
        entry[key] = Array.isArray(value) ? [...value] : value;
      }
      userMap.set(userId, entry);
      continue;
    }

    const existing = userMap.get(userId)!;

    for (const [key, value] of Object.entries(rest)) {
      if (value === null || value === undefined) continue;

      const existingVal = existing[key];
      if (Array.isArray(value) && Array.isArray(existingVal)) {
        existing[key] = [...existingVal, ...value];
      } else if (Array.isArray(value)) {
        existing[key] = [...value];
      } else {
        existing[key] = value;
      }
    }
  }

  if (deduplicateArrays) {
    for (const entry of userMap.values()) {
      for (const [key, value] of Object.entries(entry)) {
        if (Array.isArray(value)) {
          entry[key] = [...new Set(value)];
        }
      }
    }
  }

  return Array.from(userMap.values());
}`,

  stepByStep: [
    'Create a Map keyed by userId to store the merged entries.',
    'Iterate through each row in the input array.',
    'Destructure the row into userId and the remaining properties.',
    'If the userId is new (not in Map), create a fresh entry cloning all non-null values.',
    'If the userId exists, merge properties: concatenate arrays, overwrite scalars.',
    'Skip null/undefined values to avoid polluting the merged entry.',
    'After processing all rows, optionally deduplicate array values using Set.',
    'Convert the Map values to an array and return.',
  ],

  timeComplexity: 'O(n * k) where n is the number of rows and k is the average number of properties per row.',
  spaceComplexity: 'O(u * k) where u is the number of unique users and k is the total number of unique properties.',

  commonMistakes: [
    'Using an array scan instead of Map for lookups, resulting in O(n^2) complexity',
    'Not cloning arrays when creating the initial entry, causing shared references',
    'Overwriting arrays instead of concatenating them',
    'Not handling the case where a field is an array in one row but a scalar in another',
  ],

  followUps: [
    'How would you handle deep-nested objects within the rows (recursive merge)?',
    'How would you implement a custom merge strategy per field (e.g., sum for numeric fields)?',
    'How would you handle this as a streaming operation for very large datasets?',
  ],
};
