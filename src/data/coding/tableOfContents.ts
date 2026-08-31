import type { CodingProblem } from '../../types';

export const tableOfContentsProblem: CodingProblem = {
  id: 'coding-toc',
  title: 'Build Table of Contents from Headings',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['DOM', 'tree', 'recursion', 'html-parsing', 'nested-structure'],

  problem: `Given a flat list of HTML heading elements (h1 through h6), build a nested tree structure representing a table of contents. Each heading has a level (1-6) and text content. The output should be a hierarchical tree where lower-level headings are nested as children of the nearest preceding higher-level heading.

For example, an h2 following an h1 should become a child of that h1. An h3 following an h2 should become a child of that h2. If heading levels are skipped (e.g., h1 followed directly by h3), the h3 still nests under the h1. The result should be an array of top-level nodes, each with an optional children array.

This problem tests your ability to convert a flat sequential structure into a tree — a common task in document processors, CMS platforms, and markdown renderers.`,

  requirements: [
    'Accept an array of heading objects with level (1-6) and text properties',
    'Return a nested tree structure with children arrays',
    'Properly nest headings based on their level hierarchy',
    'Handle non-sequential heading levels (e.g., h1 directly to h3)',
    'Support multiple top-level headings',
    'Preserve the original order of headings',
    'Handle empty input (return empty array)',
  ],

  examples: [
    {
      input: `[{ level: 1, text: "Intro" }, { level: 2, text: "Background" }, { level: 2, text: "Goals" }, { level: 1, text: "Main" }]`,
      output: `[{ level: 1, text: "Intro", children: [{ level: 2, text: "Background", children: [] }, { level: 2, text: "Goals", children: [] }] }, { level: 1, text: "Main", children: [] }]`,
      explanation: 'Two h2s nest under the first h1. The second h1 starts a new top-level section.',
    },
    {
      input: `[{ level: 1, text: "A" }, { level: 3, text: "B" }, { level: 2, text: "C" }]`,
      output: `[{ level: 1, text: "A", children: [{ level: 3, text: "B", children: [] }, { level: 2, text: "C", children: [] }] }]`,
      explanation: 'Skipped level (h1 -> h3) still nests under h1. The h2 also nests under h1 since it has a higher level number.',
    },
    {
      input: `[]`,
      output: `[]`,
      explanation: 'Empty input returns empty output.',
    },
  ],

  edgeCases: [
    'All headings at the same level (flat list, no nesting)',
    'Deeply nested headings (h1 > h2 > h3 > h4 > h5 > h6)',
    'Skipped heading levels (h1 directly to h4)',
    'Document starting with h3 instead of h1',
    'Single heading in the array',
  ],

  naiveApproach: `A naive approach might try to process headings in multiple passes — first finding all h1s, then for each h1 finding h2s between it and the next h1, and so on for each level. This is fragile, hard to maintain, and doesn't handle edge cases like skipped levels well. The code becomes deeply nested with level-specific logic that's hard to generalize.`,

  optimalApproach: `The optimal approach uses a stack-based algorithm in a single pass. Maintain a stack that tracks the current nesting path. For each heading, pop items from the stack until the top item has a smaller level number than the current heading (meaning the current heading should be a child of the stack top). Push the current heading as a child of the new stack top and add it to the stack.

A sentinel root node with level 0 simplifies the logic — it acts as a universal parent so you never have an empty stack. After processing all headings, the root's children array is the final tree. This runs in O(n) time since each heading is pushed and popped at most once, and handles all edge cases including skipped levels and non-h1 starting headings naturally.`,

  implementation: `function buildTableOfContents(headings) {
  const root = { level: 0, text: '', children: [] };
  const stack = [root];

  for (const heading of headings) {
    const node = {
      level: heading.level,
      text: heading.text,
      children: [],
    };

    while (stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }

  return root.children;
}

// Usage
const headings = [
  { level: 1, text: 'Introduction' },
  { level: 2, text: 'Background' },
  { level: 3, text: 'History' },
  { level: 3, text: 'Current State' },
  { level: 2, text: 'Objectives' },
  { level: 1, text: 'Methodology' },
  { level: 2, text: 'Data Collection' },
];

const toc = buildTableOfContents(headings);
console.log(JSON.stringify(toc, null, 2));
// [
//   { level: 1, text: "Introduction", children: [
//     { level: 2, text: "Background", children: [
//       { level: 3, text: "History", children: [] },
//       { level: 3, text: "Current State", children: [] }
//     ]},
//     { level: 2, text: "Objectives", children: [] }
//   ]},
//   { level: 1, text: "Methodology", children: [
//     { level: 2, text: "Data Collection", children: [] }
//   ]}
// ]`,

  implementationTS: `interface Heading {
  level: number;
  text: string;
}

interface TocNode {
  level: number;
  text: string;
  children: TocNode[];
}

function buildTableOfContents(headings: Heading[]): TocNode[] {
  const root: TocNode = { level: 0, text: '', children: [] };
  const stack: TocNode[] = [root];

  for (const heading of headings) {
    const node: TocNode = {
      level: heading.level,
      text: heading.text,
      children: [],
    };

    while (stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }

  return root.children;
}`,

  stepByStep: [
    'Create a sentinel root node with level 0 and an empty children array.',
    'Initialize a stack containing only the root node.',
    'For each heading in the input array, create a new tree node with an empty children array.',
    'Pop elements from the stack while the top element\'s level is >= the current heading\'s level.',
    'Append the new node to the children of the current stack top (which has a lower level).',
    'Push the new node onto the stack so it can be a parent for subsequent deeper headings.',
    'After processing all headings, return root.children as the final tree.',
  ],

  timeComplexity: 'O(n) — each heading is pushed and popped from the stack at most once.',
  spaceComplexity: 'O(n) for the output tree nodes, plus O(d) for the stack where d is the maximum heading depth (at most 6).',

  commonMistakes: [
    'Not using a sentinel root node, leading to complex empty-stack handling',
    'Using >= instead of > (or vice versa) in the stack-pop condition, causing incorrect nesting',
    'Mutating the input heading objects instead of creating new tree nodes',
    'Not handling skipped levels (e.g., assuming h2 always follows h1)',
  ],

  followUps: [
    'How would you generate HTML (nested <ul><li>) from the resulting tree?',
    'How would you extract headings from an actual HTML document string?',
    'How would you add id anchors and scroll-to-heading functionality?',
  ],
};
