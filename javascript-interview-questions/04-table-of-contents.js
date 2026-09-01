/**
 * ============================================
 * TABLE OF CONTENTS FROM HTML - Complete Guide
 * ============================================
 * 
 * Topic: Implement a function to construct a table of contents from an HTML document
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHAT IS A TABLE OF CONTENTS (TOC)?
 * ----------------------------------
 * A navigation structure that lists document sections with links.
 * Usually built from heading elements (h1, h2, h3, h4, h5, h6).
 * 
 * WHY IS IT USEFUL?
 * -----------------
 * 1. Easy navigation in long documents
 * 2. SEO benefits (search engines understand structure)
 * 3. Accessibility (screen readers can navigate)
 * 4. User experience (quick overview of content)
 * 
 * KEY CONCEPTS:
 * -------------
 * 1. Heading hierarchy: h1 > h2 > h3 > h4 > h5 > h6
 * 2. Nested structure: h2 items under h1, h3 under h2, etc.
 * 3. IDs for linking: Each heading needs an id attribute
 * 4. Anchor links: <a href="#section-id">
 */

/**
 * DOM METHODS TO KNOW:
 * --------------------
 * - document.querySelectorAll('h1, h2, h3') - Get all headings
 * - element.textContent - Get text inside element
 * - element.id - Get/set id attribute
 * - element.tagName - Get tag name (H1, H2, etc.)
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Flat list of all headings (no nesting)
 * Returns simple array of heading info
 */
function tocBeginner(htmlString) {
  // Create a temporary container to parse HTML
  const container = document.createElement('div');
  container.innerHTML = htmlString;
  
  // Get all heading elements
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  // Build flat list
  const toc = [];
  
  headings.forEach((heading, index) => {
    // Get or generate ID
    const id = heading.id || `heading-${index}`;
    heading.id = id;
    
    toc.push({
      level: parseInt(heading.tagName[1]), // H1 -> 1, H2 -> 2, etc.
      text: heading.textContent.trim(),
      id: id
    });
  });
  
  return toc;
}

// Generate simple HTML list
function tocToHtmlBeginner(toc) {
  const items = toc.map(item => 
    `<li><a href="#${item.id}">${item.text}</a></li>`
  ).join('');
  
  return `<ul>${items}</ul>`;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const sampleHtml = `
  <h1>Introduction</h1>
  <p>Some text...</p>
  <h2>Getting Started</h2>
  <h3>Installation</h3>
  <h3>Configuration</h3>
  <h2>Advanced Topics</h2>
  <h3>Performance</h3>
  <h1>Conclusion</h1>
`;

// Note: In Node.js, we need to simulate DOM
// In browser, this would work directly
if (typeof document !== 'undefined') {
  const flatToc = tocBeginner(sampleHtml);
  console.log('Flat TOC:', flatToc);
  console.log('HTML:', tocToHtmlBeginner(flatToc));
}


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Nested structure based on heading levels
 * Produces proper hierarchy
 */
function tocIntermediate(htmlString) {
  const container = document.createElement('div');
  container.innerHTML = htmlString;
  
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  // Root of our tree
  const root = { items: [], level: 0 };
  
  // Stack to track current path
  const stack = [root];
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName[1]);
    const text = heading.textContent.trim();
    const id = heading.id || generateSlug(text, index);
    heading.id = id;
    
    const item = {
      level,
      text,
      id,
      items: [] // Children
    };
    
    // Find the correct parent
    // Pop until we find a parent with lower level
    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    
    // Add to parent's items
    stack[stack.length - 1].items.push(item);
    
    // Push current item to stack (it can be parent of next items)
    stack.push(item);
  });
  
  return root.items;
}

// Helper: Generate URL-friendly slug from text
function generateSlug(text, index) {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens
    .trim();
  
  return slug || `heading-${index}`;
}

// Generate nested HTML list
function tocToHtmlIntermediate(items) {
  if (!items || items.length === 0) return '';
  
  const listItems = items.map(item => {
    const children = tocToHtmlIntermediate(item.items);
    return `<li><a href="#${item.id}">${item.text}</a>${children}</li>`;
  }).join('');
  
  return `<ul>${listItems}</ul>`;
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');
console.log('Nested structure (see implementation)');


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured TOC generator
 * - Configurable heading levels
 * - Unique ID generation
 * - Numbering support
 * - Active state tracking
 * - Smooth scroll support
 */
class TableOfContents {
  constructor(options = {}) {
    this.options = {
      container: options.container || document.body,
      headings: options.headings || ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      listType: options.listType || 'ul',  // 'ul' or 'ol'
      numbered: options.numbered || false,
      smoothScroll: options.smoothScroll ?? true,
      activeClass: options.activeClass || 'active',
      generateIds: options.generateIds ?? true,
      minLevel: options.minLevel || 1,
      maxLevel: options.maxLevel || 6,
      ...options
    };
    
    this.usedIds = new Set();
    this.tocElement = null;
    this.headingElements = [];
  }
  
  // Generate unique ID
  generateUniqueId(text) {
    let baseId = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() || 'section';
    
    let id = baseId;
    let counter = 1;
    
    while (this.usedIds.has(id)) {
      id = `${baseId}-${counter++}`;
    }
    
    this.usedIds.add(id);
    return id;
  }
  
  // Parse headings from container
  parse() {
    const { container, headings, minLevel, maxLevel, generateIds } = this.options;
    
    const selector = headings
      .filter(h => {
        const level = parseInt(h[1]);
        return level >= minLevel && level <= maxLevel;
      })
      .join(', ');
    
    const elements = container.querySelectorAll(selector);
    
    const root = { items: [], level: 0 };
    const stack = [root];
    
    this.headingElements = [];
    
    elements.forEach(el => {
      const level = parseInt(el.tagName[1]);
      const text = el.textContent.trim();
      
      // Generate or get ID
      let id = el.id;
      if (!id && generateIds) {
        id = this.generateUniqueId(text);
        el.id = id;
      }
      
      this.headingElements.push({ el, id, level });
      
      const item = {
        level,
        text,
        id,
        element: el,
        items: []
      };
      
      // Find correct parent
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      
      stack[stack.length - 1].items.push(item);
      stack.push(item);
    });
    
    return root.items;
  }
  
  // Build HTML
  render(items = null, parentNumber = '') {
    items = items || this.parse();
    
    if (!items || items.length === 0) return '';
    
    const { listType, numbered, smoothScroll } = this.options;
    
    const listItems = items.map((item, index) => {
      const number = parentNumber 
        ? `${parentNumber}.${index + 1}` 
        : `${index + 1}`;
      
      const prefix = numbered ? `<span class="toc-number">${number}</span> ` : '';
      
      const link = smoothScroll
        ? `<a href="#${item.id}" data-scroll-to="${item.id}">${prefix}${item.text}</a>`
        : `<a href="#${item.id}">${prefix}${item.text}</a>`;
      
      const children = this.render(item.items, numbered ? number : '');
      
      return `<li data-level="${item.level}" data-id="${item.id}">${link}${children}</li>`;
    }).join('');
    
    return `<${listType} class="toc-list">${listItems}</${listType}>`;
  }
  
  // Mount to DOM
  mount(targetElement) {
    const html = this.render();
    
    if (typeof targetElement === 'string') {
      targetElement = document.querySelector(targetElement);
    }
    
    targetElement.innerHTML = html;
    this.tocElement = targetElement;
    
    // Add click handlers for smooth scroll
    if (this.options.smoothScroll) {
      this.setupSmoothScroll();
    }
    
    // Setup intersection observer for active state
    this.setupActiveTracking();
    
    return this;
  }
  
  // Smooth scroll handler
  setupSmoothScroll() {
    this.tocElement.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-scroll-to]');
      if (!link) return;
      
      e.preventDefault();
      const targetId = link.dataset.scrollTo;
      const target = document.getElementById(targetId);
      
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update URL without jumping
        history.pushState(null, '', `#${targetId}`);
      }
    });
  }
  
  // Track active section
  setupActiveTracking() {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const { activeClass } = this.options;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          const link = this.tocElement.querySelector(`[data-id="${id}"]`);
          
          if (link) {
            if (entry.isIntersecting) {
              // Remove active from all
              this.tocElement.querySelectorAll(`.${activeClass}`)
                .forEach(el => el.classList.remove(activeClass));
              
              // Add active to current
              link.classList.add(activeClass);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px', // Trigger when heading is in top 30%
        threshold: 0
      }
    );
    
    this.headingElements.forEach(({ el }) => {
      observer.observe(el);
    });
    
    this.observer = observer;
  }
  
  // Cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.tocElement) {
      this.tocElement.innerHTML = '';
    }
  }
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');
console.log('Full TableOfContents class with:');
console.log('- Configurable heading levels');
console.log('- Unique ID generation');
console.log('- Numbering support');
console.log('- Smooth scroll');
console.log('- Active state tracking');


// ============================================
// PURE JAVASCRIPT IMPLEMENTATION (NO DOM)
// ============================================

/**
 * For Node.js or when you have HTML as a string
 * Uses regex instead of DOM
 */
function tocFromString(htmlString, options = {}) {
  const { 
    minLevel = 1, 
    maxLevel = 6,
    generateIds = true 
  } = options;
  
  // Regex to match heading tags
  const headingRegex = /<h([1-6])([^>]*)>(.*?)<\/h\1>/gi;
  const idRegex = /id\s*=\s*["']([^"']+)["']/i;
  
  const usedIds = new Set();
  const root = { items: [], level: 0 };
  const stack = [root];
  let index = 0;
  
  let match;
  while ((match = headingRegex.exec(htmlString)) !== null) {
    const level = parseInt(match[1]);
    
    if (level < minLevel || level > maxLevel) continue;
    
    const attrs = match[2];
    const content = match[3].replace(/<[^>]+>/g, '').trim(); // Strip inner HTML
    
    // Extract or generate ID
    let id;
    const idMatch = attrs.match(idRegex);
    if (idMatch) {
      id = idMatch[1];
    } else if (generateIds) {
      let baseId = content
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') || `heading-${index}`;
      
      id = baseId;
      let counter = 1;
      while (usedIds.has(id)) {
        id = `${baseId}-${counter++}`;
      }
    }
    
    usedIds.add(id);
    index++;
    
    const item = { level, text: content, id, items: [] };
    
    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    
    stack[stack.length - 1].items.push(item);
    stack.push(item);
  }
  
  return root.items;
}

// Test Pure JS
console.log('\n=== PURE JS (NO DOM) ===');

const htmlContent = `
<h1>Main Title</h1>
<p>Introduction paragraph...</p>
<h2 id="getting-started">Getting Started</h2>
<h3>Prerequisites</h3>
<h3>Installation</h3>
<h2>Configuration</h2>
<h3>Basic Setup</h3>
<h4>Environment Variables</h4>
<h3>Advanced Options</h3>
<h1>API Reference</h1>
<h2>Methods</h2>
`;

const toc = tocFromString(htmlContent);
console.log('Generated TOC:', JSON.stringify(toc, null, 2));

// Convert to HTML
function tocTreeToHtml(items, listType = 'ul') {
  if (!items.length) return '';
  
  const li = items.map(item => {
    const children = tocTreeToHtml(item.items, listType);
    return `<li><a href="#${item.id}">${item.text}</a>${children}</li>`;
  }).join('');
  
  return `<${listType}>${li}</${listType}>`;
}

console.log('\nAs HTML:');
console.log(tocTreeToHtml(toc));


// ============================================
// EDGE CASES & GOTCHAS
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * EDGE CASE 1: Skipped heading levels
 * h1 -> h3 (skipping h2)
 * Solution: Still nest under nearest lower level
 */
const skippedLevels = `<h1>Title</h1><h3>Subsection</h3>`;
console.log('Skipped levels:', tocFromString(skippedLevels));

/**
 * EDGE CASE 2: Headings with HTML inside
 * <h2><strong>Bold</strong> Title</h2>
 * Solution: Strip HTML tags, keep text
 */
const htmlInHeading = `<h2><strong>Bold</strong> <em>Title</em></h2>`;
console.log('HTML in heading:', tocFromString(htmlInHeading));

/**
 * EDGE CASE 3: Duplicate heading text
 * Multiple h2 with same text
 * Solution: Generate unique IDs with counter
 */
const duplicates = `<h2>Section</h2><h2>Section</h2><h2>Section</h2>`;
console.log('Duplicates:', tocFromString(duplicates));

/**
 * EDGE CASE 4: Empty headings
 * <h2></h2>
 * Solution: Use index-based ID
 */
const emptyHeading = `<h2></h2><h2>Real Title</h2>`;
console.log('Empty heading:', tocFromString(emptyHeading));

/**
 * EDGE CASE 5: Special characters in headings
 * <h2>What's New? (2024)</h2>
 * Solution: Sanitize for ID, keep original for display
 */
const specialChars = `<h2>What's New? (2024 Edition)</h2>`;
console.log('Special chars:', tocFromString(specialChars));


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * 1. Headings: h1-h6, lower number = higher importance
 * 2. Each heading should have unique ID for linking
 * 3. Use stack-based approach for nesting
 * 4. sanitize text for IDs (lowercase, no special chars)
 * 5. Handle duplicate headings with counters
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Ask about input format (DOM element vs HTML string)
 * 2. Clarify heading level range (h1-h6 or subset)
 * 3. Discuss edge cases (skipped levels, duplicates)
 * 4. Mention accessibility considerations
 * 5. Consider performance for large documents
 * 
 * ACCESSIBILITY:
 * --------------
 * - Add role="navigation" to TOC container
 * - Add aria-label="Table of Contents"
 * - Use proper list semantics (ul/ol > li)
 * - Support keyboard navigation
 */


// ============================================
// COMMON MISTAKES TO AVOID
// ============================================

/**
 * MISTAKE 1: Not handling skipped heading levels
 * h1 directly to h3 should still create proper nesting
 * 
 * MISTAKE 2: Not generating unique IDs
 * Duplicate IDs cause link problems
 * 
 * MISTAKE 3: Including heading content HTML in text
 * <h2><code>foo</code></h2> should show "foo" not "<code>foo</code>"
 * 
 * MISTAKE 4: Forgetting to URL-encode special characters in href
 * #my section -> #my%20section
 * 
 * MISTAKE 5: Not handling empty containers
 * Should return empty array, not error
 */


module.exports = {
  tocBeginner,
  tocIntermediate,
  tocFromString,
  tocTreeToHtml,
  TableOfContents,
  generateSlug
};
