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
