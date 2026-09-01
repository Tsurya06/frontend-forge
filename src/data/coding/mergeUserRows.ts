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



  theoryAndConcepts: "WHAT IS ROW MERGING?\n--------------------\nCombining multiple data rows that share a common identifier (like userId)\ninto a single consolidated record.\n\nUSE CASES:\n----------\n1. Combining user activity logs\n2. Aggregating metrics from multiple sources\n3. De-duplicating records with latest data\n4. Merging partial data from different API calls\n\nMERGE STRATEGIES:\n-----------------\n- Last wins: Latest value overwrites\n- First wins: Keep original value\n- Concat: Combine arrays\n- Sum: Add numeric values\n- Max/Min: Keep highest/lowest\n- Custom: User-defined merge logic",
  beginnerApproach: "Beginner: Simple merge (last wins)",
  beginnerImplementation: "function mergeUserRowsBeginner(rows, idKey = 'userId') {\n  const merged = {};\n  \n  for (const row of rows) {\n    const id = row[idKey];\n    \n    if (!merged[id]) {\n      // First occurrence - copy the row\n      merged[id] = { ...row };\n    } else {\n      // Merge with existing (later values overwrite)\n      merged[id] = { ...merged[id], ...row };\n    }\n  }\n  \n  // Convert back to array\n  return Object.values(merged);\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst userActivities = [\n  { userId: 1, name: 'John', visits: 5 },\n  { userId: 2, name: 'Jane', visits: 3 },\n  { userId: 1, name: 'John Doe', visits: 10, email: 'john@example.com' },\n  { userId: 2, visits: 7 }\n];\n\nconsole.log('Merged (last wins):', mergeUserRowsBeginner(userActivities));\n// [\n//   { userId: 1, name: 'John Doe', visits: 10, email: 'john@example.com' },\n//   { userId: 2, name: 'Jane', visits: 7 }\n// ]",
  intermediateApproach: "Intermediate: Merge with strategy per field",
  intermediateImplementation: "function mergeUserRowsIntermediate(rows, options = {}) {\n  const {\n    idKey = 'userId',\n    strategies = {}  // { fieldName: 'lastWins' | 'firstWins' | 'sum' | 'concat' | 'max' | 'min' }\n  } = options;\n  \n  const merged = new Map();\n  \n  for (const row of rows) {\n    const id = row[idKey];\n    \n    if (!merged.has(id)) {\n      merged.set(id, { ...row });\n      continue;\n    }\n    \n    const existing = merged.get(id);\n    \n    for (const key of Object.keys(row)) {\n      if (key === idKey) continue;\n      \n      const strategy = strategies[key] || 'lastWins';\n      const existingValue = existing[key];\n      const newValue = row[key];\n      \n      // Skip if new value is undefined\n      if (newValue === undefined) continue;\n      \n      // If no existing value, just use new value\n      if (existingValue === undefined) {\n        existing[key] = newValue;\n        continue;\n      }\n      \n      // Apply strategy\n      switch (strategy) {\n        case 'firstWins':\n          // Keep existing value\n          break;\n          \n        case 'lastWins':\n          existing[key] = newValue;\n          break;\n          \n        case 'sum':\n          if (typeof existingValue === 'number' && typeof newValue === 'number') {\n            existing[key] = existingValue + newValue;\n          } else {\n            existing[key] = newValue;\n          }\n          break;\n          \n        case 'concat':\n          if (Array.isArray(existingValue) && Array.isArray(newValue)) {\n            existing[key] = [...existingValue, ...newValue];\n          } else if (Array.isArray(existingValue)) {\n            existing[key] = [...existingValue, newValue];\n          } else if (Array.isArray(newValue)) {\n            existing[key] = [existingValue, ...newValue];\n          } else {\n            existing[key] = [existingValue, newValue];\n          }\n          break;\n          \n        case 'unique':\n          if (Array.isArray(existingValue) && Array.isArray(newValue)) {\n            existing[key] = [...new Set([...existingValue, ...newValue])];\n          } else {\n            existing[key] = newValue;\n          }\n          break;\n          \n        case 'max':\n          if (typeof existingValue === 'number' && typeof newValue === 'number') {\n            existing[key] = Math.max(existingValue, newValue);\n          } else {\n            existing[key] = newValue;\n          }\n          break;\n          \n        case 'min':\n          if (typeof existingValue === 'number' && typeof newValue === 'number') {\n            existing[key] = Math.min(existingValue, newValue);\n          } else {\n            existing[key] = newValue;\n          }\n          break;\n          \n        default:\n          existing[key] = newValue;\n      }\n    }\n  }\n  \n  return Array.from(merged.values());\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst userData = [\n  { userId: 1, name: 'John', visits: 5, tags: ['admin'], score: 80 },\n  { userId: 2, name: 'Jane', visits: 3, tags: ['user'], score: 90 },\n  { userId: 1, visits: 10, tags: ['vip'], score: 95 },\n  { userId: 2, visits: 7, tags: ['premium'], score: 85 }\n];\n\nconst merged = mergeUserRowsIntermediate(userData, {\n  strategies: {\n    name: 'firstWins',     // Keep original name\n    visits: 'sum',         // Add up visits\n    tags: 'unique',        // Combine unique tags\n    score: 'max'           // Keep highest score\n  }\n});\n\nconsole.log('Merged with strategies:', JSON.stringify(merged, null, 2));",
  expertApproach: "Expert: Full-featured merger with custom functions",
  expertImplementation: "class RowMerger {\n  constructor(options = {}) {\n    this.idKey = options.idKey || 'id';\n    this.strategies = options.strategies || {};\n    this.defaultStrategy = options.defaultStrategy || 'lastWins';\n    this.customMergers = options.customMergers || {};\n    this.validators = options.validators || {};\n    this.transformers = options.transformers || {};\n  }\n  \n  // Built-in strategies\n  static strategies = {\n    lastWins: (existing, incoming) => incoming,\n    firstWins: (existing, incoming) => existing,\n    sum: (a, b) => (typeof a === 'number' && typeof b === 'number') ? a + b : b,\n    max: (a, b) => (typeof a === 'number' && typeof b === 'number') ? Math.max(a, b) : b,\n    min: (a, b) => (typeof a === 'number' && typeof b === 'number') ? Math.min(a, b) : b,\n    concat: (a, b) => [...(Array.isArray(a) ? a : [a]), ...(Array.isArray(b) ? b : [b])],\n    unique: (a, b) => [...new Set([...(Array.isArray(a) ? a : [a]), ...(Array.isArray(b) ? b : [b])])],\n    average: (a, b, context) => {\n      const count = context.mergeCount || 1;\n      return (a * count + b) / (count + 1);\n    },\n    latest: (a, b, context) => {\n      const aTime = context.existingRow?.timestamp || 0;\n      const bTime = context.incomingRow?.timestamp || 0;\n      return bTime >= aTime ? b : a;\n    },\n    deepMerge: (a, b) => {\n      if (typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {\n        return { ...a, ...b };\n      }\n      return b;\n    }\n  };\n  \n  merge(rows) {\n    const merged = new Map();\n    const mergeCounts = new Map();\n    \n    for (const row of rows) {\n      // Validate row\n      if (!this.validateRow(row)) continue;\n      \n      // Transform row\n      const transformedRow = this.transformRow(row);\n      const id = transformedRow[this.idKey];\n      \n      if (id === undefined) {\n        console.warn('Row missing id key:', row);\n        continue;\n      }\n      \n      if (!merged.has(id)) {\n        merged.set(id, { ...transformedRow });\n        mergeCounts.set(id, 1);\n        continue;\n      }\n      \n      const existing = merged.get(id);\n      const mergeCount = mergeCounts.get(id);\n      \n      // Merge each field\n      for (const key of Object.keys(transformedRow)) {\n        if (key === this.idKey) continue;\n        \n        const incomingValue = transformedRow[key];\n        if (incomingValue === undefined) continue;\n        \n        const existingValue = existing[key];\n        \n        if (existingValue === undefined) {\n          existing[key] = incomingValue;\n          continue;\n        }\n        \n        // Context for custom mergers\n        const context = {\n          existingRow: existing,\n          incomingRow: transformedRow,\n          mergeCount,\n          key,\n          id\n        };\n        \n        // Check for custom merger\n        if (this.customMergers[key]) {\n          existing[key] = this.customMergers[key](existingValue, incomingValue, context);\n          continue;\n        }\n        \n        // Get strategy\n        const strategyName = this.strategies[key] || this.defaultStrategy;\n        const strategy = RowMerger.strategies[strategyName];\n        \n        if (strategy) {\n          existing[key] = strategy(existingValue, incomingValue, context);\n        } else {\n          existing[key] = incomingValue;\n        }\n      }\n      \n      mergeCounts.set(id, mergeCount + 1);\n    }\n    \n    return Array.from(merged.values());\n  }\n  \n  validateRow(row) {\n    if (!row || typeof row !== 'object') return false;\n    \n    for (const [key, validator] of Object.entries(this.validators)) {\n      if (row[key] !== undefined && !validator(row[key])) {\n        console.warn(`Validation failed for ${key}:`, row[key]);\n        return false;\n      }\n    }\n    \n    return true;\n  }\n  \n  transformRow(row) {\n    const transformed = { ...row };\n    \n    for (const [key, transformer] of Object.entries(this.transformers)) {\n      if (transformed[key] !== undefined) {\n        transformed[key] = transformer(transformed[key]);\n      }\n    }\n    \n    return transformed;\n  }\n  \n  // Fluent API for configuration\n  setIdKey(key) {\n    this.idKey = key;\n    return this;\n  }\n  \n  setStrategy(field, strategy) {\n    this.strategies[field] = strategy;\n    return this;\n  }\n  \n  setCustomMerger(field, mergerFn) {\n    this.customMergers[field] = mergerFn;\n    return this;\n  }\n  \n  setValidator(field, validatorFn) {\n    this.validators[field] = validatorFn;\n    return this;\n  }\n  \n  setTransformer(field, transformerFn) {\n    this.transformers[field] = transformerFn;\n    return this;\n  }\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\nconst merger = new RowMerger({\n  idKey: 'userId',\n  strategies: {\n    visits: 'sum',\n    score: 'max',\n    tags: 'unique',\n    name: 'firstWins'\n  },\n  customMergers: {\n    // Custom: Keep last non-empty email\n    email: (existing, incoming) => \n      incoming && incoming.trim() ? incoming : existing\n  },\n  transformers: {\n    // Trim all names\n    name: (name) => name?.trim()\n  },\n  validators: {\n    // Score must be between 0-100\n    score: (score) => score >= 0 && score <= 100\n  }\n});\n\nconst data = [\n  { userId: 1, name: ' John ', visits: 5, score: 80, email: '' },\n  { userId: 1, name: 'Johnny', visits: 3, score: 95, email: 'john@example.com' },\n  { userId: 1, visits: 2, score: 150 }, // Invalid score - will be skipped\n  { userId: 2, name: 'Jane', visits: 10, score: 88 }\n];\n\nconsole.log('Expert merged:', merger.merge(data));",
  interviewTraps: [
      "QUICK REFERENCE:",
      "1. Use Map for O(1) lookups by id",
      "2. Handle undefined values explicitly",
      "3. Consider array fields (concat vs replace)",
      "4. Maintain original order if needed",
      "INTERVIEW TIPS:",
      "1. Ask about merge strategy requirements",
      "2. Start with simple \"last wins\" approach"
  ],
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
