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



  theoryAndConcepts: "WHAT IS A TABLE OF CONTENTS (TOC)?\n----------------------------------\nA navigation structure that lists document sections with links.\nUsually built from heading elements (h1, h2, h3, h4, h5, h6).\n\nWHY IS IT USEFUL?\n-----------------\n1. Easy navigation in long documents\n2. SEO benefits (search engines understand structure)\n3. Accessibility (screen readers can navigate)\n4. User experience (quick overview of content)\n\nKEY CONCEPTS:\n-------------\n1. Heading hierarchy: h1 > h2 > h3 > h4 > h5 > h6\n2. Nested structure: h2 items under h1, h3 under h2, etc.\n3. IDs for linking: Each heading needs an id attribute\n4. Anchor links: <a href=\"#section-id\">\n\n\n\nDOM METHODS TO KNOW:\n--------------------\n- document.querySelectorAll('h1, h2, h3') - Get all headings\n- element.textContent - Get text inside element\n- element.id - Get/set id attribute\n- element.tagName - Get tag name (H1, H2, etc.)",
  beginnerApproach: "Beginner: Flat list of all headings (no nesting)\nReturns simple array of heading info",
  beginnerImplementation: "function tocBeginner(htmlString) {\n  // Create a temporary container to parse HTML\n  const container = document.createElement('div');\n  container.innerHTML = htmlString;\n  \n  // Get all heading elements\n  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');\n  \n  // Build flat list\n  const toc = [];\n  \n  headings.forEach((heading, index) => {\n    // Get or generate ID\n    const id = heading.id || `heading-${index}`;\n    heading.id = id;\n    \n    toc.push({\n      level: parseInt(heading.tagName[1]), // H1 -> 1, H2 -> 2, etc.\n      text: heading.textContent.trim(),\n      id: id\n    });\n  });\n  \n  return toc;\n}\n\n// Generate simple HTML list\nfunction tocToHtmlBeginner(toc) {\n  const items = toc.map(item => \n    `<li><a href=\"#${item.id}\">${item.text}</a></li>`\n  ).join('');\n  \n  return `<ul>${items}</ul>`;\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst sampleHtml = `\n  <h1>Introduction</h1>\n  <p>Some text...</p>\n  <h2>Getting Started</h2>\n  <h3>Installation</h3>\n  <h3>Configuration</h3>\n  <h2>Advanced Topics</h2>\n  <h3>Performance</h3>\n  <h1>Conclusion</h1>\n`;\n\n// Note: In Node.js, we need to simulate DOM\n// In browser, this would work directly\nif (typeof document !== 'undefined') {\n  const flatToc = tocBeginner(sampleHtml);\n  console.log('Flat TOC:', flatToc);\n  console.log('HTML:', tocToHtmlBeginner(flatToc));\n}",
  intermediateApproach: "Intermediate: Nested structure based on heading levels\nProduces proper hierarchy",
  intermediateImplementation: "function tocIntermediate(htmlString) {\n  const container = document.createElement('div');\n  container.innerHTML = htmlString;\n  \n  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');\n  \n  // Root of our tree\n  const root = { items: [], level: 0 };\n  \n  // Stack to track current path\n  const stack = [root];\n  \n  headings.forEach((heading, index) => {\n    const level = parseInt(heading.tagName[1]);\n    const text = heading.textContent.trim();\n    const id = heading.id || generateSlug(text, index);\n    heading.id = id;\n    \n    const item = {\n      level,\n      text,\n      id,\n      items: [] // Children\n    };\n    \n    // Find the correct parent\n    // Pop until we find a parent with lower level\n    while (stack.length > 1 && stack[stack.length - 1].level >= level) {\n      stack.pop();\n    }\n    \n    // Add to parent's items\n    stack[stack.length - 1].items.push(item);\n    \n    // Push current item to stack (it can be parent of next items)\n    stack.push(item);\n  });\n  \n  return root.items;\n}\n\n// Helper: Generate URL-friendly slug from text\nfunction generateSlug(text, index) {\n  const slug = text\n    .toLowerCase()\n    .replace(/[^\\w\\s-]/g, '') // Remove special chars\n    .replace(/\\s+/g, '-')      // Replace spaces with hyphens\n    .replace(/-+/g, '-')       // Replace multiple hyphens\n    .trim();\n  \n  return slug || `heading-${index}`;\n}\n\n// Generate nested HTML list\nfunction tocToHtmlIntermediate(items) {\n  if (!items || items.length === 0) return '';\n  \n  const listItems = items.map(item => {\n    const children = tocToHtmlIntermediate(item.items);\n    return `<li><a href=\"#${item.id}\">${item.text}</a>${children}</li>`;\n  }).join('');\n  \n  return `<ul>${listItems}</ul>`;\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\nconsole.log('Nested structure (see implementation)');",
  expertApproach: "Expert: Full-featured TOC generator\n- Configurable heading levels\n- Unique ID generation\n- Numbering support\n- Active state tracking\n- Smooth scroll support",
  expertImplementation: "class TableOfContents {\n  constructor(options = {}) {\n    this.options = {\n      container: options.container || document.body,\n      headings: options.headings || ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],\n      listType: options.listType || 'ul',  // 'ul' or 'ol'\n      numbered: options.numbered || false,\n      smoothScroll: options.smoothScroll ?? true,\n      activeClass: options.activeClass || 'active',\n      generateIds: options.generateIds ?? true,\n      minLevel: options.minLevel || 1,\n      maxLevel: options.maxLevel || 6,\n      ...options\n    };\n    \n    this.usedIds = new Set();\n    this.tocElement = null;\n    this.headingElements = [];\n  }\n  \n  // Generate unique ID\n  generateUniqueId(text) {\n    let baseId = text\n      .toLowerCase()\n      .replace(/[^\\w\\s-]/g, '')\n      .replace(/\\s+/g, '-')\n      .replace(/-+/g, '-')\n      .trim() || 'section';\n    \n    let id = baseId;\n    let counter = 1;\n    \n    while (this.usedIds.has(id)) {\n      id = `${baseId}-${counter++}`;\n    }\n    \n    this.usedIds.add(id);\n    return id;\n  }\n  \n  // Parse headings from container\n  parse() {\n    const { container, headings, minLevel, maxLevel, generateIds } = this.options;\n    \n    const selector = headings\n      .filter(h => {\n        const level = parseInt(h[1]);\n        return level >= minLevel && level <= maxLevel;\n      })\n      .join(', ');\n    \n    const elements = container.querySelectorAll(selector);\n    \n    const root = { items: [], level: 0 };\n    const stack = [root];\n    \n    this.headingElements = [];\n    \n    elements.forEach(el => {\n      const level = parseInt(el.tagName[1]);\n      const text = el.textContent.trim();\n      \n      // Generate or get ID\n      let id = el.id;\n      if (!id && generateIds) {\n        id = this.generateUniqueId(text);\n        el.id = id;\n      }\n      \n      this.headingElements.push({ el, id, level });\n      \n      const item = {\n        level,\n        text,\n        id,\n        element: el,\n        items: []\n      };\n      \n      // Find correct parent\n      while (stack.length > 1 && stack[stack.length - 1].level >= level) {\n        stack.pop();\n      }\n      \n      stack[stack.length - 1].items.push(item);\n      stack.push(item);\n    });\n    \n    return root.items;\n  }\n  \n  // Build HTML\n  render(items = null, parentNumber = '') {\n    items = items || this.parse();\n    \n    if (!items || items.length === 0) return '';\n    \n    const { listType, numbered, smoothScroll } = this.options;\n    \n    const listItems = items.map((item, index) => {\n      const number = parentNumber \n        ? `${parentNumber}.${index + 1}` \n        : `${index + 1}`;\n      \n      const prefix = numbered ? `<span class=\"toc-number\">${number}</span> ` : '';\n      \n      const link = smoothScroll\n        ? `<a href=\"#${item.id}\" data-scroll-to=\"${item.id}\">${prefix}${item.text}</a>`\n        : `<a href=\"#${item.id}\">${prefix}${item.text}</a>`;\n      \n      const children = this.render(item.items, numbered ? number : '');\n      \n      return `<li data-level=\"${item.level}\" data-id=\"${item.id}\">${link}${children}</li>`;\n    }).join('');\n    \n    return `<${listType} class=\"toc-list\">${listItems}</${listType}>`;\n  }\n  \n  // Mount to DOM\n  mount(targetElement) {\n    const html = this.render();\n    \n    if (typeof targetElement === 'string') {\n      targetElement = document.querySelector(targetElement);\n    }\n    \n    targetElement.innerHTML = html;\n    this.tocElement = targetElement;\n    \n    // Add click handlers for smooth scroll\n    if (this.options.smoothScroll) {\n      this.setupSmoothScroll();\n    }\n    \n    // Setup intersection observer for active state\n    this.setupActiveTracking();\n    \n    return this;\n  }\n  \n  // Smooth scroll handler\n  setupSmoothScroll() {\n    this.tocElement.addEventListener('click', (e) => {\n      const link = e.target.closest('a[data-scroll-to]');\n      if (!link) return;\n      \n      e.preventDefault();\n      const targetId = link.dataset.scrollTo;\n      const target = document.getElementById(targetId);\n      \n      if (target) {\n        target.scrollIntoView({ behavior: 'smooth', block: 'start' });\n        \n        // Update URL without jumping\n        history.pushState(null, '', `#${targetId}`);\n      }\n    });\n  }\n  \n  // Track active section\n  setupActiveTracking() {\n    if (typeof IntersectionObserver === 'undefined') return;\n    \n    const { activeClass } = this.options;\n    \n    const observer = new IntersectionObserver(\n      (entries) => {\n        entries.forEach(entry => {\n          const id = entry.target.id;\n          const link = this.tocElement.querySelector(`[data-id=\"${id}\"]`);\n          \n          if (link) {\n            if (entry.isIntersecting) {\n              // Remove active from all\n              this.tocElement.querySelectorAll(`.${activeClass}`)\n                .forEach(el => el.classList.remove(activeClass));\n              \n              // Add active to current\n              link.classList.add(activeClass);\n            }\n          }\n        });\n      },\n      {\n        rootMargin: '-20% 0px -70% 0px', // Trigger when heading is in top 30%\n        threshold: 0\n      }\n    );\n    \n    this.headingElements.forEach(({ el }) => {\n      observer.observe(el);\n    });\n    \n    this.observer = observer;\n  }\n  \n  // Cleanup\n  destroy() {\n    if (this.observer) {\n      this.observer.disconnect();\n    }\n    if (this.tocElement) {\n      this.tocElement.innerHTML = '';\n    }\n  }\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\nconsole.log('Full TableOfContents class with:');\nconsole.log('- Configurable heading levels');\nconsole.log('- Unique ID generation');\nconsole.log('- Numbering support');\nconsole.log('- Smooth scroll');\nconsole.log('- Active state tracking');",
  interviewTraps: [
      "console.log('\\n=== EDGE CASES ===');",
      "EDGE CASE 1: Skipped heading levels",
      "h1 -> h3 (skipping h2)",
      "Solution: Still nest under nearest lower level",
      "const skippedLevels = `<h1>Title</h1><h3>Subsection</h3>`;",
      "console.log('Skipped levels:', tocFromString(skippedLevels));",
      "EDGE CASE 2: Headings with HTML inside",
      "<h2><strong>Bold</strong> Title</h2>"
  ],
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
