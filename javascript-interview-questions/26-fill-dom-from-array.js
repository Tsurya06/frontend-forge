/**
 * ============================================
 * FILL DOM FROM ARRAY - Complete Guide
 * ============================================
 * 
 * Topic: Fill DOM from given array of objects to create DOM elements
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * PROBLEM STATEMENT:
 * ------------------
 * Given an array of objects where each object describes a DOM element,
 * create and render those elements to the DOM.
 * 
 * OBJECT STRUCTURE (typical):
 * ---------------------------
 * {
 *   tag: 'div',           // Element type
 *   id: 'myId',           // ID attribute
 *   className: 'my-class', // CSS classes
 *   textContent: 'Hello', // Text content
 *   children: [...],      // Nested elements
 *   attributes: {},       // Custom attributes
 *   events: {},           // Event listeners
 *   styles: {}            // Inline styles
 * }
 * 
 * KEY DOM METHODS:
 * ----------------
 * - document.createElement(tag)
 * - element.setAttribute(name, value)
 * - element.appendChild(child)
 * - element.textContent = text
 * - element.innerHTML = html (use carefully - XSS risk)
 */

// ============================================
// BEGINNER LEVEL
// ============================================

/**
 * Beginner: Simple element creation
 */
function createElementBeginner(config) {
  // Create the element
  const element = document.createElement(config.tag || 'div');
  
  // Set ID
  if (config.id) {
    element.id = config.id;
  }
  
  // Set class
  if (config.className) {
    element.className = config.className;
  }
  
  // Set text content
  if (config.textContent) {
    element.textContent = config.textContent;
  }
  
  return element;
}

/**
 * Beginner: Create multiple elements and append to container
 */
function fillDOMBeginner(container, elements) {
  elements.forEach(config => {
    const element = createElementBeginner(config);
    container.appendChild(element);
  });
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const simpleElements = [
  { tag: 'h1', textContent: 'Hello World', id: 'title' },
  { tag: 'p', textContent: 'This is a paragraph', className: 'content' },
  { tag: 'button', textContent: 'Click Me', className: 'btn' }
];

// Usage:
// const container = document.getElementById('app');
// fillDOMBeginner(container, simpleElements);

console.log('Simple element configs:', simpleElements);


// ============================================
// INTERMEDIATE LEVEL
// ============================================

/**
 * Intermediate: Handle nested children and attributes
 */
function createElementIntermediate(config) {
  const { 
    tag = 'div', 
    id, 
    className, 
    textContent, 
    children = [], 
    attributes = {},
    styles = {},
    events = {}
  } = config;
  
  const element = document.createElement(tag);
  
  // ID
  if (id) element.id = id;
  
  // Classes
  if (className) {
    if (Array.isArray(className)) {
      element.className = className.join(' ');
    } else {
      element.className = className;
    }
  }
  
  // Text content
  if (textContent) element.textContent = textContent;
  
  // Custom attributes
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  // Styles
  Object.entries(styles).forEach(([property, value]) => {
    element.style[property] = value;
  });
  
  // Event listeners
  Object.entries(events).forEach(([event, handler]) => {
    element.addEventListener(event, handler);
  });
  
  // Recursively create children
  children.forEach(childConfig => {
    if (typeof childConfig === 'string') {
      element.appendChild(document.createTextNode(childConfig));
    } else {
      element.appendChild(createElementIntermediate(childConfig));
    }
  });
  
  return element;
}

/**
 * Intermediate: Fill DOM with fragment (better performance)
 */
function fillDOMIntermediate(container, elements) {
  const fragment = document.createDocumentFragment();
  
  elements.forEach(config => {
    fragment.appendChild(createElementIntermediate(config));
  });
  
  container.appendChild(fragment);
}

// Test Intermediate Level
console.log('\n=== INTERMEDIATE LEVEL ===');

const nestedElements = [
  {
    tag: 'div',
    className: 'card',
    children: [
      { tag: 'h2', textContent: 'Card Title', className: 'card-title' },
      { 
        tag: 'p', 
        textContent: 'Card description',
        styles: { color: 'gray', fontSize: '14px' }
      },
      {
        tag: 'button',
        textContent: 'Learn More',
        className: 'btn btn-primary',
        attributes: { 'data-id': '123' },
        events: {
          click: (e) => console.log('Clicked!', e.target)
        }
      }
    ]
  }
];

console.log('Nested config:', JSON.stringify(nestedElements, null, 2));


// ============================================
// EXPERT LEVEL
// ============================================

/**
 * Expert: Full-featured DOM builder
 */
class DOMBuilder {
  constructor(options = {}) {
    this.options = {
      sanitize: true,      // XSS protection
      namespace: null,     // SVG namespace support
      ...options
    };
  }
  
  // Sanitize text to prevent XSS
  sanitize(text) {
    if (!this.options.sanitize || typeof text !== 'string') return text;
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Create single element
  createElement(config) {
    if (typeof config === 'string') {
      return document.createTextNode(config);
    }
    
    const {
      tag = 'div',
      id,
      className,
      classList = [],
      textContent,
      innerHTML,
      children = [],
      attributes = {},
      dataset = {},
      styles = {},
      events = {},
      ref,
      namespace
    } = config;
    
    // Create element (with namespace for SVG)
    const ns = namespace || this.options.namespace;
    const element = ns
      ? document.createElementNS(ns, tag)
      : document.createElement(tag);
    
    // ID
    if (id) element.id = id;
    
    // Classes
    if (className) {
      const classes = Array.isArray(className) ? className : className.split(' ');
      element.classList.add(...classes.filter(Boolean));
    }
    if (classList.length) {
      element.classList.add(...classList);
    }
    
    // Text content (sanitized)
    if (textContent !== undefined) {
      element.textContent = this.sanitize(textContent);
    }
    
    // innerHTML (only if explicitly allowed and sanitize is false)
    if (innerHTML && !this.options.sanitize) {
      element.innerHTML = innerHTML;
    }
    
    // Attributes
    for (const [key, value] of Object.entries(attributes)) {
      if (value === true) {
        element.setAttribute(key, '');
      } else if (value !== false && value !== null && value !== undefined) {
        element.setAttribute(key, String(value));
      }
    }
    
    // Dataset (data-* attributes)
    for (const [key, value] of Object.entries(dataset)) {
      element.dataset[key] = value;
    }
    
    // Styles
    for (const [property, value] of Object.entries(styles)) {
      if (value !== null && value !== undefined) {
        // Handle camelCase to kebab-case
        const kebabProp = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        element.style.setProperty(kebabProp, value);
      }
    }
    
    // Events
    for (const [event, handler] of Object.entries(events)) {
      if (typeof handler === 'function') {
        element.addEventListener(event, handler);
      } else if (typeof handler === 'object') {
        // Advanced: { handler, options }
        element.addEventListener(event, handler.handler, handler.options);
      }
    }
    
    // Ref callback
    if (typeof ref === 'function') {
      ref(element);
    }
    
    // Children
    this.appendChildren(element, children);
    
    return element;
  }
  
  appendChildren(parent, children) {
    if (!Array.isArray(children)) {
      children = [children];
    }
    
    children.forEach(child => {
      if (child === null || child === undefined) return;
      parent.appendChild(this.createElement(child));
    });
  }
  
  // Build from array
  buildFromArray(configs) {
    const fragment = document.createDocumentFragment();
    
    configs.forEach(config => {
      fragment.appendChild(this.createElement(config));
    });
    
    return fragment;
  }
  
  // Render to container
  render(container, configs) {
    const fragment = this.buildFromArray(Array.isArray(configs) ? configs : [configs]);
    container.appendChild(fragment);
    return container;
  }
  
  // Replace container content
  renderAndReplace(container, configs) {
    container.innerHTML = '';
    return this.render(container, configs);
  }
}

/**
 * Expert: JSX-like helper (hyperscript style)
 */
function h(tag, props = {}, ...children) {
  return {
    tag,
    ...props,
    children: children.flat()
  };
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

const builder = new DOMBuilder({ sanitize: true });

// Complex configuration
const complexUI = [
  h('header', { className: 'header' },
    h('nav', { className: 'nav' },
      h('ul', { className: 'nav-list' },
        h('li', {}, h('a', { attributes: { href: '/' } }, 'Home')),
        h('li', {}, h('a', { attributes: { href: '/about' } }, 'About')),
        h('li', {}, h('a', { attributes: { href: '/contact' } }, 'Contact'))
      )
    )
  ),
  h('main', { className: 'main' },
    h('article', { className: 'article' },
      h('h1', {}, 'Welcome'),
      h('p', { styles: { lineHeight: '1.6' } }, 'This is the content.')
    )
  ),
  h('footer', { className: 'footer' },
    'Copyright 2024'
  )
];

console.log('Complex UI config:', JSON.stringify(complexUI, null, 2));


// ============================================
// PRACTICAL EXAMPLES
// ============================================

console.log('\n=== PRACTICAL EXAMPLES ===');

// 1. Create a table from data
function createTable(data, columns) {
  const builder = new DOMBuilder();
  
  return builder.createElement({
    tag: 'table',
    className: 'data-table',
    children: [
      // Header
      {
        tag: 'thead',
        children: [{
          tag: 'tr',
          children: columns.map(col => ({
            tag: 'th',
            textContent: col.header
          }))
        }]
      },
      // Body
      {
        tag: 'tbody',
        children: data.map(row => ({
          tag: 'tr',
          children: columns.map(col => ({
            tag: 'td',
            textContent: row[col.key]
          }))
        }))
      }
    ]
  });
}

// 2. Create a list from array
function createList(items, ordered = false) {
  const builder = new DOMBuilder();
  
  return builder.createElement({
    tag: ordered ? 'ol' : 'ul',
    children: items.map(item => ({
      tag: 'li',
      textContent: item
    }))
  });
}

// 3. Create form from schema
function createForm(fields) {
  const builder = new DOMBuilder();
  
  return builder.createElement({
    tag: 'form',
    children: fields.map(field => ({
      tag: 'div',
      className: 'form-group',
      children: [
        { tag: 'label', textContent: field.label, attributes: { for: field.name } },
        { 
          tag: 'input', 
          attributes: { 
            type: field.type || 'text',
            name: field.name,
            id: field.name,
            placeholder: field.placeholder || ''
          }
        }
      ]
    }))
  });
}

console.log('Table helper:', typeof createTable);
console.log('List helper:', typeof createList);
console.log('Form helper:', typeof createForm);


// ============================================
// PERFORMANCE TIPS
// ============================================

/**
 * PERFORMANCE OPTIMIZATIONS:
 * --------------------------
 * 
 * 1. Use DocumentFragment
 *    - Batch DOM operations
 *    - Single reflow/repaint
 * 
 * 2. Clone templates
 *    const template = document.getElementById('template');
 *    const clone = template.content.cloneNode(true);
 * 
 * 3. Virtual DOM concept
 *    - Compare old vs new config
 *    - Only update what changed
 * 
 * 4. Avoid innerHTML for user content
 *    - XSS vulnerability
 *    - Use textContent instead
 * 
 * 5. Event delegation
 *    - Single listener on parent
 *    - Check event.target
 */


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * createElement(tag) - Create element
 * setAttribute(name, value) - Set attribute
 * appendChild(child) - Add child
 * textContent - Safe text
 * innerHTML - Unsafe HTML (XSS risk)
 * DocumentFragment - Batch operations
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with simple createElement
 * 2. Show recursive for children
 * 3. Mention DocumentFragment
 * 4. Discuss XSS prevention
 * 5. Talk about event delegation
 */


module.exports = {
  createElementBeginner,
  fillDOMBeginner,
  createElementIntermediate,
  fillDOMIntermediate,
  DOMBuilder,
  h,
  createTable,
  createList,
  createForm
};
