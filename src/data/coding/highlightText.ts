import type { CodingProblem } from '../../types';

export const highlightTextProblem: CodingProblem = {
  id: 'coding-highlight',
  title: 'Highlight Search Term in Text',
  difficulty: 'Beginner',
  category: 'Coding',
  tags: ['string-manipulation', 'regex', 'DOM', 'search', 'text-processing'],

  problem: `Implement a function that takes a text string and a search term, and returns a new string where every occurrence of the search term is wrapped in <mark> tags for highlighting. The search should be case-insensitive, meaning searching for "hello" should also highlight "Hello" and "HELLO", but the original casing in the text must be preserved in the output.

This is a common feature in search-as-you-type UIs, documentation viewers, and text editors. The implementation must handle special regex characters in the search term (e.g., searching for "C++" should not break), empty search terms, and overlapping or adjacent matches.

For a React context, the function might return an array of React elements (strings and <mark> elements) instead of an HTML string, to avoid using dangerouslySetInnerHTML. Both approaches are valuable to discuss.`,

  requirements: [
    'Wrap all occurrences of the search term in <mark></mark> tags',
    'Perform case-insensitive matching',
    'Preserve the original casing of the matched text in the output',
    'Escape special regex characters in the search term',
    'Return the original text unchanged if the search term is empty',
    'Handle multiple occurrences in the same string',
  ],

  examples: [
    {
      input: `highlightText("The quick brown fox jumps over the lazy dog", "the")`,
      output: `"<mark>The</mark> quick brown fox jumps over <mark>the</mark> lazy dog"`,
      explanation: 'Both "The" and "the" are matched case-insensitively and wrapped in mark tags with original casing.',
    },
    {
      input: `highlightText("Hello World, hello!", "hello")`,
      output: `"<mark>Hello</mark> World, <mark>hello</mark>!"`,
      explanation: 'All occurrences highlighted regardless of case.',
    },
    {
      input: `highlightText("Price is $100.00 (USD)", "$100.00")`,
      output: `"Price is <mark>$100.00</mark> (USD)"`,
      explanation: 'Special regex characters ($ and .) in the search term are properly escaped.',
    },
  ],

  edgeCases: [
    'Empty search term (return text unchanged)',
    'Search term not found in text (return text unchanged)',
    'Search term with special regex characters ($, ., *, +, etc.)',
    'Entire text matches the search term',
    'Adjacent occurrences of the search term',
  ],

  naiveApproach: `A naive approach uses string.replace() with a simple string argument. However, replace with a string only replaces the first occurrence. Using string.replaceAll() fixes that but doesn't support case-insensitive matching. Manually splitting and joining is another approach, but it's harder to get right with case-insensitive matching while preserving original casing.`,

  optimalApproach: `The optimal approach uses a RegExp with the 'gi' flags (global, case-insensitive) and string.replace(). The key detail is escaping the search term first so that special regex characters are treated as literals. Use a regex-escape helper that prepends a backslash before each special character.

The replace method with the 'gi' regex finds all matches case-insensitively. The replacement function receives the matched substring (with its original casing), wraps it in <mark> tags, and returns it. This single-pass approach is clean, efficient, and handles all edge cases.

For React applications, you can use string.split(regex) to split the text around matches, then map the resulting array to alternate between plain text and <mark> elements, preserving React's virtual DOM model without dangerouslySetInnerHTML.`,

  implementation: `function escapeRegExp(string) {
  return string.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
}

function highlightText(text, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) {
    return text;
  }

  const escaped = escapeRegExp(searchTerm);
  const regex = new RegExp(\`(\${escaped})\`, 'gi');

  return text.replace(regex, '<mark>$1</mark>');
}

// React-friendly version returning an array of string/JSX elements
function highlightTextReact(text, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) {
    return [text];
  }

  const escaped = escapeRegExp(searchTerm);
  const regex = new RegExp(\`(\${escaped})\`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return { type: 'mark', key: index, text: part };
    }
    return part;
  });
}

// Usage
console.log(highlightText(
  'The quick brown fox jumps over the lazy dog',
  'the'
));
// '<mark>The</mark> quick brown fox jumps over <mark>the</mark> lazy dog'

console.log(highlightText('Hello World, hello!', 'hello'));
// '<mark>Hello</mark> World, <mark>hello</mark>!'

console.log(highlightText('Price is $100.00', '$100.00'));
// 'Price is <mark>$100.00</mark>'

console.log(highlightText('No match here', 'xyz'));
// 'No match here'`,

  implementationTS: `function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
}

function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm || !searchTerm.trim()) {
    return text;
  }

  const escaped = escapeRegExp(searchTerm);
  const regex = new RegExp(\`(\${escaped})\`, 'gi');

  return text.replace(regex, '<mark>$1</mark>');
}

interface HighlightPart {
  type: 'text' | 'mark';
  text: string;
}

function highlightTextParts(text: string, searchTerm: string): HighlightPart[] {
  if (!searchTerm || !searchTerm.trim()) {
    return [{ type: 'text', text }];
  }

  const escaped = escapeRegExp(searchTerm);
  const regex = new RegExp(\`(\${escaped})\`, 'gi');
  const parts = text.split(regex);

  return parts
    .filter(part => part !== '')
    .map(part => ({
      type: part.toLowerCase() === searchTerm.toLowerCase() ? 'mark' : 'text' as const,
      text: part,
    }));
}`,



  theoryAndConcepts: "WHAT IS TEXT HIGHLIGHTING?\n--------------------------\nFinding search terms in text and wrapping them with markup\n(usually <mark> or <span>) for visual emphasis.\n\nUSE CASES:\n----------\n1. Search result highlighting\n2. Code syntax highlighting\n3. Find and replace preview\n4. Keyword emphasis\n\nKEY CONSIDERATIONS:\n-------------------\n1. Case sensitivity\n2. Whole word matching\n3. Multiple terms\n4. HTML safety (XSS prevention)\n5. Overlapping matches\n6. Preserving original HTML structure",
  beginnerApproach: "Beginner: Simple string replacement",
  beginnerImplementation: "function highlightBeginner(text, searchTerm) {\n  if (!searchTerm || !text) return text;\n  \n  // Case-insensitive search using regex\n  // Escape special regex characters in search term\n  const escaped = searchTerm.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');\n  const regex = new RegExp(`(${escaped})`, 'gi');\n  \n  return text.replace(regex, '<mark>$1</mark>');\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst text = 'The quick brown fox jumps over the lazy dog';\nconsole.log(highlightBeginner(text, 'fox'));\n// The quick brown <mark>fox</mark> jumps over the lazy dog\n\nconsole.log(highlightBeginner(text, 'the'));\n// <mark>The</mark> quick brown fox jumps over <mark>the</mark> lazy dog\n\nconsole.log(highlightBeginner('Hello World', 'o'));\n// Hell<mark>o</mark> W<mark>o</mark>rld",
  intermediateApproach: "Intermediate: With options (case sensitivity, whole word, custom tag)\n\n\nIntermediate: Highlight multiple terms",
  intermediateImplementation: "function highlightIntermediate(text, searchTerm, options = {}) {\n  const {\n    caseSensitive = false,\n    wholeWord = false,\n    tag = 'mark',\n    className = 'highlight'\n  } = options;\n  \n  if (!searchTerm || !text) return text;\n  \n  // Escape special regex characters\n  let escaped = searchTerm.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');\n  \n  // Whole word matching\n  if (wholeWord) {\n    escaped = `\\\\b${escaped}\\\\b`;\n  }\n  \n  // Build regex with appropriate flags\n  const flags = caseSensitive ? 'g' : 'gi';\n  const regex = new RegExp(`(${escaped})`, flags);\n  \n  // Replace with highlighted version\n  return text.replace(regex, `<${tag} class=\"${className}\">$1</${tag}>`);\n}\n\nfunction highlightMultiple(text, terms, options = {}) {\n  if (!terms || terms.length === 0) return text;\n  \n  // Sort by length (longest first) to match longer terms before shorter\n  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);\n  \n  // Escape and join terms\n  const escaped = sortedTerms.map(term =>\n    term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')\n  );\n  \n  const pattern = escaped.join('|');\n  const flags = options.caseSensitive ? 'g' : 'gi';\n  const regex = new RegExp(`(${pattern})`, flags);\n  \n  const tag = options.tag || 'mark';\n  const className = options.className || 'highlight';\n  \n  return text.replace(regex, `<${tag} class=\"${className}\">$1</${tag}>`);\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\n// Case sensitive\nconsole.log('Case sensitive:', highlightIntermediate('The THE the', 'the', { caseSensitive: true }));\n// The THE <mark class=\"highlight\">the</mark>\n\n// Whole word\nconsole.log('Whole word:', highlightIntermediate('theater the theft', 'the', { wholeWord: true }));\n// theater <mark class=\"highlight\">the</mark> theft\n\n// Multiple terms\nconsole.log('Multiple:', highlightMultiple('The quick brown fox', ['the', 'fox', 'brown']));",
  expertApproach: "Expert: DOM-based highlighter (preserves HTML structure)\n\n\nExpert: String-based with HTML safety\n\n\nExpert: Fuzzy highlight (with typo tolerance)",
  expertImplementation: "class TextHighlighter {\n  constructor(options = {}) {\n    this.options = {\n      tag: 'mark',\n      className: 'highlight',\n      caseSensitive: false,\n      wholeWord: false,\n      ...options\n    };\n    this.highlights = [];\n  }\n  \n  // Highlight in a DOM element\n  highlight(element, searchTerm) {\n    if (!searchTerm) return;\n    \n    // Build regex\n    let pattern = searchTerm.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');\n    if (this.options.wholeWord) {\n      pattern = `\\\\b${pattern}\\\\b`;\n    }\n    const flags = this.options.caseSensitive ? 'g' : 'gi';\n    const regex = new RegExp(pattern, flags);\n    \n    // Walk through text nodes\n    const walker = document.createTreeWalker(\n      element,\n      NodeFilter.SHOW_TEXT,\n      null,\n      false\n    );\n    \n    const textNodes = [];\n    let node;\n    while (node = walker.nextNode()) {\n      if (regex.test(node.textContent)) {\n        textNodes.push(node);\n      }\n      regex.lastIndex = 0; // Reset regex state\n    }\n    \n    // Process each text node\n    textNodes.forEach(textNode => {\n      this.highlightTextNode(textNode, regex);\n    });\n  }\n  \n  highlightTextNode(textNode, regex) {\n    const text = textNode.textContent;\n    const fragment = document.createDocumentFragment();\n    let lastIndex = 0;\n    let match;\n    \n    regex.lastIndex = 0;\n    \n    while ((match = regex.exec(text)) !== null) {\n      // Add text before match\n      if (match.index > lastIndex) {\n        fragment.appendChild(\n          document.createTextNode(text.slice(lastIndex, match.index))\n        );\n      }\n      \n      // Add highlighted match\n      const mark = document.createElement(this.options.tag);\n      mark.className = this.options.className;\n      mark.textContent = match[0];\n      fragment.appendChild(mark);\n      \n      this.highlights.push(mark);\n      lastIndex = match.index + match[0].length;\n    }\n    \n    // Add remaining text\n    if (lastIndex < text.length) {\n      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));\n    }\n    \n    // Replace original node\n    textNode.parentNode.replaceChild(fragment, textNode);\n  }\n  \n  // Remove all highlights\n  removeHighlights(element) {\n    const marks = element.querySelectorAll(`${this.options.tag}.${this.options.className}`);\n    \n    marks.forEach(mark => {\n      const parent = mark.parentNode;\n      parent.replaceChild(document.createTextNode(mark.textContent), mark);\n      parent.normalize(); // Merge adjacent text nodes\n    });\n    \n    this.highlights = [];\n  }\n  \n  // Get highlight count\n  count() {\n    return this.highlights.length;\n  }\n  \n  // Navigate to next/previous highlight\n  scrollToHighlight(index) {\n    if (index >= 0 && index < this.highlights.length) {\n      this.highlights[index].scrollIntoView({\n        behavior: 'smooth',\n        block: 'center'\n      });\n      return true;\n    }\n    return false;\n  }\n}\n\nfunction highlightSafe(text, searchTerm, options = {}) {\n  const {\n    caseSensitive = false,\n    wholeWord = false,\n    tag = 'mark',\n    className = 'highlight',\n    escapeHtml = true\n  } = options;\n  \n  if (!searchTerm || !text) return text;\n  \n  // Escape HTML if needed\n  let safeText = escapeHtml ? escapeHTML(text) : text;\n  let safeTerm = escapeHtml ? escapeHTML(searchTerm) : searchTerm;\n  \n  // Build pattern\n  let pattern = safeTerm.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');\n  if (wholeWord) {\n    pattern = `\\\\b${pattern}\\\\b`;\n  }\n  \n  const flags = caseSensitive ? 'g' : 'gi';\n  const regex = new RegExp(`(${pattern})`, flags);\n  \n  return safeText.replace(regex, `<${tag} class=\"${className}\">$1</${tag}>`);\n}\n\nfunction escapeHTML(str) {\n  const escapeMap = {\n    '&': '&amp;',\n    '<': '&lt;',\n    '>': '&gt;',\n    '\"': '&quot;',\n    \"'\": '&#39;'\n  };\n  return str.replace(/[&<>\"']/g, char => escapeMap[char]);\n}\n\nfunction highlightFuzzy(text, searchTerm, maxDistance = 1) {\n  if (!searchTerm || !text) return text;\n  \n  const words = text.split(/(\\s+)/);\n  const searchLower = searchTerm.toLowerCase();\n  \n  return words.map(word => {\n    // Skip whitespace\n    if (/^\\s+$/.test(word)) return word;\n    \n    // Check if word is close enough to search term\n    if (levenshteinDistance(word.toLowerCase(), searchLower) <= maxDistance) {\n      return `<mark class=\"highlight-fuzzy\">${word}</mark>`;\n    }\n    return word;\n  }).join('');\n}\n\n// Levenshtein distance for fuzzy matching\nfunction levenshteinDistance(a, b) {\n  const matrix = [];\n  \n  for (let i = 0; i <= b.length; i++) {\n    matrix[i] = [i];\n  }\n  for (let j = 0; j <= a.length; j++) {\n    matrix[0][j] = j;\n  }\n  \n  for (let i = 1; i <= b.length; i++) {\n    for (let j = 1; j <= a.length; j++) {\n      if (b[i - 1] === a[j - 1]) {\n        matrix[i][j] = matrix[i - 1][j - 1];\n      } else {\n        matrix[i][j] = Math.min(\n          matrix[i - 1][j - 1] + 1,\n          matrix[i][j - 1] + 1,\n          matrix[i - 1][j] + 1\n        );\n      }\n    }\n  }\n  \n  return matrix[b.length][a.length];\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\n// Safe highlighting (XSS prevention)\nconsole.log('Safe:', highlightSafe('<script>alert(\"xss\")</script> test', 'test'));\n\n// Fuzzy highlighting\nconsole.log('Fuzzy:', highlightFuzzy('The quik brown foks', 'quick', 2));",
  interviewTraps: [
      "QUICK REFERENCE:",
      "1. Escape regex special characters in search term",
      "2. Use (capturing group) to preserve case in replacement",
      "3. Use TreeWalker for DOM traversal",
      "4. Escape HTML to prevent XSS",
      "5. Use \\b for whole word matching",
      "INTERVIEW TIPS:",
      "1. Start with simple regex replacement"
  ],
  stepByStep: [
    'Check if the search term is empty or whitespace-only — return the original text if so.',
    'Escape special regex characters in the search term using a helper function.',
    'Create a RegExp with the escaped term, using "gi" flags for global and case-insensitive matching.',
    'Use the capturing group version in the regex so replace can reference the matched text.',
    'Call text.replace(regex, "<mark>$1</mark>") to wrap all matches.',
    'The $1 backreference preserves the original casing of each match.',
  ],

  timeComplexity: 'O(n) where n is the length of the text string (single pass with regex).',
  spaceComplexity: 'O(n) for the resulting string with mark tags.',

  commonMistakes: [
    'Not escaping special regex characters in the search term, causing regex syntax errors',
    'Using string.replace instead of regex with "g" flag, which only replaces the first match',
    'Losing original casing by replacing with the search term instead of the matched text',
    'Not handling empty search terms, which creates a regex matching empty string at every position',
  ],

  followUps: [
    'How would you highlight multiple different search terms with different colors?',
    'How would you implement this in React without dangerouslySetInnerHTML?',
    'How would you support fuzzy matching or highlighting partial word matches?',
  ],
};
