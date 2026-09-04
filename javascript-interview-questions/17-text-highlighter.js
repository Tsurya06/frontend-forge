/**
 * ============================================
 * TEXT HIGHLIGHTER - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function to highlight text if searched term appears
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS TEXT HIGHLIGHTING?
 * --------------------------
 * Finding search terms in text and wrapping them with markup
 * (usually <mark> or <span>) for visual emphasis.
 * 
 * USE CASES:
 * ----------
 * 1. Search result highlighting
 * 2. Code syntax highlighting
 * 3. Find and replace preview
 * 4. Keyword emphasis
 * 
 * KEY CONSIDERATIONS:
 * -------------------
 * 1. Case sensitivity
 * 2. Whole word matching
 * 3. Multiple terms
 * 4. HTML safety (XSS prevention)
 * 5. Overlapping matches
 * 6. Preserving original HTML structure
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple string replacement
 */
function highlightBeginner(text, searchTerm) {
  if (!searchTerm || !text) return text;
  
  // Case-insensitive search using regex
  // Escape special regex characters in search term
  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  
  return text.replace(regex, '<mark>$1</mark>');
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const text = 'The quick brown fox jumps over the lazy dog';
console.log(highlightBeginner(text, 'fox'));
// The quick brown <mark>fox</mark> jumps over the lazy dog

console.log(highlightBeginner(text, 'the'));
// <mark>The</mark> quick brown fox jumps over <mark>the</mark> lazy dog

console.log(highlightBeginner('Hello World', 'o'));
// Hell<mark>o</mark> W<mark>o</mark>rld


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: With options (case sensitivity, whole word, custom tag)
 */
function highlightIntermediate(text, searchTerm, options = {}) {
  const {
    caseSensitive = false,
    wholeWord = false,
    tag = 'mark',
    className = 'highlight'
  } = options;
  
  if (!searchTerm || !text) return text;
  
  // Escape special regex characters
  let escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Whole word matching
  if (wholeWord) {
    escaped = `\\b${escaped}\\b`;
  }
  
  // Build regex with appropriate flags
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(`(${escaped})`, flags);
  
  // Replace with highlighted version
  return text.replace(regex, `<${tag} class="${className}">$1</${tag}>`);
}

/**
 * Intermediate: Highlight multiple terms
 */
function highlightMultiple(text, terms, options = {}) {
  if (!terms || terms.length === 0) return text;
  
  // Sort by length (longest first) to match longer terms before shorter
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  
  // Escape and join terms
  const escaped = sortedTerms.map(term =>
    term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  
  const pattern = escaped.join('|');
  const flags = options.caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(`(${pattern})`, flags);
  
  const tag = options.tag || 'mark';
  const className = options.className || 'highlight';
  
  return text.replace(regex, `<${tag} class="${className}">$1</${tag}>`);
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

// Case sensitive
console.log('Case sensitive:', highlightIntermediate('The THE the', 'the', { caseSensitive: true }));
// The THE <mark class="highlight">the</mark>

// Whole word
console.log('Whole word:', highlightIntermediate('theater the theft', 'the', { wholeWord: true }));
// theater <mark class="highlight">the</mark> theft

// Multiple terms
console.log('Multiple:', highlightMultiple('The quick brown fox', ['the', 'fox', 'brown']));


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: DOM-based highlighter (preserves HTML structure)
 */
class TextHighlighter {
  constructor(options = {}) {
    this.options = {
      tag: 'mark',
      className: 'highlight',
      caseSensitive: false,
      wholeWord: false,
      ...options
    };
    this.highlights = [];
  }
  
  // Highlight in a DOM element
  highlight(element, searchTerm) {
    if (!searchTerm) return;
    
    // Build regex
    let pattern = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (this.options.wholeWord) {
      pattern = `\\b${pattern}\\b`;
    }
    const flags = this.options.caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);
    
    // Walk through text nodes
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    while ((node = walker.nextNode()) !== null) {
      if (regex.test(node.textContent)) {
        textNodes.push(node);
      }
      regex.lastIndex = 0; // Reset regex state
    }
    
    // Process each text node
    textNodes.forEach(textNode => {
      this.highlightTextNode(textNode, regex);
    });
  }
  
  highlightTextNode(textNode, regex) {
    const text = textNode.textContent;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    
    regex.lastIndex = 0;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index))
        );
      }
      
      // Add highlighted match
      const mark = document.createElement(this.options.tag);
      mark.className = this.options.className;
      mark.textContent = match[0];
      fragment.appendChild(mark);
      
      this.highlights.push(mark);
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
    
    // Replace original node
    textNode.parentNode.replaceChild(fragment, textNode);
  }
  
  // Remove all highlights
  removeHighlights(element) {
    const marks = element.querySelectorAll(`${this.options.tag}.${this.options.className}`);
    
    marks.forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize(); // Merge adjacent text nodes
    });
    
    this.highlights = [];
  }
  
  // Get highlight count
  count() {
    return this.highlights.length;
  }
  
  // Navigate to next/previous highlight
  scrollToHighlight(index) {
    if (index >= 0 && index < this.highlights.length) {
      this.highlights[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return true;
    }
    return false;
  }
}

/**
 * Expert: String-based with HTML safety
 */
function highlightSafe(text, searchTerm, options = {}) {
  const {
    caseSensitive = false,
    wholeWord = false,
    tag = 'mark',
    className = 'highlight',
    escapeHtml = true
  } = options;
  
  if (!searchTerm || !text) return text;
  
  // Escape HTML if needed
  let safeText = escapeHtml ? escapeHTML(text) : text;
  let safeTerm = escapeHtml ? escapeHTML(searchTerm) : searchTerm;
  
  // Build pattern
  let pattern = safeTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (wholeWord) {
    pattern = `\\b${pattern}\\b`;
  }
  
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(`(${pattern})`, flags);
  
  return safeText.replace(regex, `<${tag} class="${className}">$1</${tag}>`);
}

function escapeHTML(str) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => escapeMap[char]);
}

/**
 * Expert: Fuzzy highlight (with typo tolerance)
 */
function highlightFuzzy(text, searchTerm, maxDistance = 1) {
  if (!searchTerm || !text) return text;
  
  const words = text.split(/(\s+)/);
  const searchLower = searchTerm.toLowerCase();
  
  return words.map(word => {
    // Skip whitespace
    if (/^\s+$/.test(word)) return word;
    
    // Check if word is close enough to search term
    if (levenshteinDistance(word.toLowerCase(), searchLower) <= maxDistance) {
      return `<mark class="highlight-fuzzy">${word}</mark>`;
    }
    return word;
  }).join('');
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a, b) {
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

// Safe highlighting (XSS prevention)
console.log('Safe:', highlightSafe('<script>alert("xss")</script> test', 'test'));

// Fuzzy highlighting
console.log('Fuzzy:', highlightFuzzy('The quik brown foks', 'quick', 2));


// ============================================
// EDGE CASES
// ============================================

console.log('\n=== EDGE CASES ===');

// Empty search term
console.log('Empty term:', highlightBeginner('Hello', ''));

// No match
console.log('No match:', highlightBeginner('Hello', 'xyz'));

// Special regex characters
console.log('Special chars:', highlightBeginner('Price: $100 (50% off)', '$100'));

// Unicode
console.log('Unicode:', highlightBeginner('Hello 世界', '世界'));

// Overlapping patterns
console.log('Multiple same:', highlightBeginner('aaa', 'aa'));


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Escape regex special characters in search term
 * 2. Use (capturing group) to preserve case in replacement
 * 3. Use TreeWalker for DOM traversal
 * 4. Escape HTML to prevent XSS
 * 5. Use \b for whole word matching
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with simple regex replacement
 * 2. Mention case sensitivity handling
 * 3. Discuss XSS prevention
 * 4. Explain DOM vs string approach
 * 
 * ACCESSIBILITY:
 * --------------
 * - Use <mark> element (semantic)
 * - Add aria-label for screen readers
 * - Ensure sufficient color contrast
 */


module.exports = {
  highlightBeginner,
  highlightIntermediate,
  highlightMultiple,
  highlightSafe,
  highlightFuzzy,
  TextHighlighter,
  escapeHTML
};
