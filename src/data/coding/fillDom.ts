import type { CodingProblem } from "../../types";

export const fillDomProblem: CodingProblem = {
  id: "coding-fill-dom",
  title: "Fill DOM Tree from an Array of Objects",
  difficulty: "Intermediate",
  category: "Coding",
  tags: ["javascript", "dom", "recursion", "virtual-dom", "html-generation"],

  problem: `Implement a function \`renderDOMTree(vnode, container)\` (or \`createDOMFromObject(schema)\`) that takes a structured JSON/object tree description of a DOM subtree and dynamically constructs and attaches real HTML DOM nodes.

The object descriptor format represents:
- \`tag\`: string tag name (e.g. 'div', 'span', 'ul', 'li', 'button', 'input')
- \`attrs\` / \`props\`: object containing HTML attributes (e.g. \`id\`, \`className\` or \`class\`, \`style\`, \`href\`, \`data-*\`, boolean attributes like \`disabled\`)
- \`events\`: object containing event listeners (e.g. \`{ click: fn, input: fn }\`)
- \`children\`: array of strings (text nodes) or nested node descriptor objects.

The implementation must handle:
1. Creating elements with \`document.createElement\` and text nodes with \`document.createTextNode\`.
2. Setting standard attributes, dataset properties, inline styles (both as strings or style objects), and event listeners.
3. Safe XSS prevention (never using raw \`innerHTML\` without sanitization).
4. Efficient batch attachment using \`DocumentFragment\`.`,

  requirements: [
    "Construct real DOM nodes from nested descriptor objects",
    "Handle strings and numbers as text nodes",
    "Handle className / class, inline styles, and standard HTML attributes",
    "Attach event listeners safely using addEventListener",
    "Recursively process children arrays and append to parent",
    "Use DocumentFragment when mounting multiple children to minimize reflows",
  ],

  examples: [
    {
      input: `const schema = {\n  tag: 'div',\n  props: { className: 'card', id: 'card-1' },\n  children: [\n    { tag: 'h2', children: ['Hello World'] },\n    { tag: 'p', props: { style: { color: 'blue' } }, children: ['Dynamic DOM tree'] },\n    { tag: 'button', events: { click: () => alert('clicked') }, children: ['Click Me'] }\n  ]\n};\nconst root = document.getElementById('app');\nrenderDOMTree(schema, root);`,
      output:
        '<div class="card" id="card-1"><h2>Hello World</h2><p style="color: blue;">Dynamic DOM tree</p><button>Click Me</button></div> mounted inside root',
      explanation: "Constructs the full interactive DOM hierarchy.",
    },
  ],

  edgeCases: [
    "Null or undefined children: ignore gracefully",
    "Plain string or number as root or child: convert to TextNode",
    "Boolean attributes (disabled, checked, hidden): set attribute or property correctly",
    "Event listener cleanup: support returning a cleanup function or unmount handler",
  ],

  naiveApproach: `A naive approach builds a raw HTML string using string concatenation (e.g. \`<div class="\${props.className}">...\`) and sets \`container.innerHTML = html\`. This is extremely dangerous (high XSS vulnerability risk), cannot attach real JavaScript event listener functions directly, and causes expensive re-parsing of the entire DOM string.`,

  optimalApproach: `The optimal approach uses the native DOM API recursively:
1. If the node is a string or number, return \`document.createTextNode(String(node))\`.
2. Create the element using \`document.createElement(node.tag)\`.
3. Set attributes:
   - If key is \`style\` and value is an object, iterate properties with \`el.style[prop] = value\`.
   - If key is \`className\` or \`class\`, set \`el.className = value\`.
   - Otherwise, set with \`el.setAttribute(key, value)\`.
4. Attach event listeners from \`node.events\` using \`el.addEventListener(event, handler)\`.
5. For \`node.children\`, create a \`DocumentFragment\`, recursively render each child, append to fragment, and then append fragment to the element.
6. Return the constructed element.`,

  implementation: `function createDOMFromObject(node) {
  // 1. Primitive text nodes
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(String(node));
  }

  if (!node || typeof node !== 'object') {
    return document.createTextNode('');
  }

  // 2. Create Element
  const el = document.createElement(node.tag || 'div');

  // 3. Set Props & Attributes
  const props = node.props || node.attrs || {};
  for (const [key, val] of Object.entries(props)) {
    if (val == null) continue;

    if (key === 'className' || key === 'class') {
      el.className = val;
    } else if (key === 'style') {
      if (typeof val === 'string') {
        el.style.cssText = val;
      } else if (typeof val === 'object') {
        Object.assign(el.style, val);
      }
    } else if (typeof val === 'boolean') {
      if (val) el.setAttribute(key, '');
      else el.removeAttribute(key);
    } else {
      el.setAttribute(key, String(val));
    }
  }

  // 4. Attach Event Listeners
  if (node.events && typeof node.events === 'object') {
    for (const [event, handler] of Object.entries(node.events)) {
      if (typeof handler === 'function') {
        el.addEventListener(event, handler);
      }
    }
  }

  // 5. Recursively append children via DocumentFragment
  if (Array.isArray(node.children)) {
    const fragment = document.createDocumentFragment();
    for (const child of node.children) {
      if (child != null) {
        fragment.appendChild(createDOMFromObject(child));
      }
    }
    el.appendChild(fragment);
  }

  return el;
}

function renderDOMTree(vnode, container) {
  const domNode = createDOMFromObject(vnode);
  if (container) {
    container.innerHTML = '';
    container.appendChild(domNode);
  }
  return domNode;
}`,

  implementationTS: `export interface VNode {
  tag?: string;
  props?: Record<string, any>;
  attrs?: Record<string, any>;
  events?: Record<string, (e: Event) => void>;
  children?: Array<VNode | string | number | null | undefined>;
}

export function createDOMFromObject(node: VNode | string | number): Node {
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(String(node));
  }

  if (!node || typeof node !== 'object') {
    return document.createTextNode('');
  }

  const el = document.createElement(node.tag || 'div');

  const props = node.props || node.attrs || {};
  for (const [key, val] of Object.entries(props)) {
    if (val == null) continue;

    if (key === 'className' || key === 'class') {
      el.className = val;
    } else if (key === 'style') {
      if (typeof val === 'string') {
        el.style.cssText = val;
      } else if (typeof val === 'object') {
        Object.assign(el.style, val);
      }
    } else if (typeof val === 'boolean') {
      if (val) el.setAttribute(key, '');
      else el.removeAttribute(key);
    } else {
      el.setAttribute(key, String(val));
    }
  }

  if (node.events) {
    for (const [event, handler] of Object.entries(node.events)) {
      if (typeof handler === 'function') {
        el.addEventListener(event, handler);
      }
    }
  }

  if (Array.isArray(node.children)) {
    const fragment = document.createDocumentFragment();
    for (const child of node.children) {
      if (child != null) {
        fragment.appendChild(createDOMFromObject(child));
      }
    }
    el.appendChild(fragment);
  }

  return el;
}

export function renderDOMTree(vnode: VNode | string | number, container: HTMLElement): Node {
  const domNode = createDOMFromObject(vnode);
  container.innerHTML = '';
  container.appendChild(domNode);
  return domNode;
}`,

  theoryAndConcepts:
    "PROBLEM STATEMENT:\n------------------\nGiven an array of objects where each object describes a DOM element,\ncreate and render those elements to the DOM.\n\nOBJECT STRUCTURE (typical):\n---------------------------\n{\n  tag: 'div',           // Element type\n  id: 'myId',           // ID attribute\n  className: 'my-class', // CSS classes\n  textContent: 'Hello', // Text content\n  children: [...],      // Nested elements\n  attributes: {},       // Custom attributes\n  events: {},           // Event listeners\n  styles: {}            // Inline styles\n}\n\nKEY DOM METHODS:\n----------------\n- document.createElement(tag)\n- element.setAttribute(name, value)\n- element.appendChild(child)\n- element.textContent = text\n- element.innerHTML = html (use carefully - XSS risk)",
  beginnerApproach:
    "Beginner: Simple element creation\n\n\nBeginner: Create multiple elements and append to container",
  beginnerImplementation:
    "function createElementBeginner(config) {\n  // Create the element\n  const element = document.createElement(config.tag || 'div');\n  \n  // Set ID\n  if (config.id) {\n    element.id = config.id;\n  }\n  \n  // Set class\n  if (config.className) {\n    element.className = config.className;\n  }\n  \n  // Set text content\n  if (config.textContent) {\n    element.textContent = config.textContent;\n  }\n  \n  return element;\n}\n\nfunction fillDOMBeginner(container, elements) {\n  elements.forEach(config => {\n    const element = createElementBeginner(config);\n    container.appendChild(element);\n  });\n}\n\n// Test Beginner Level\nconsole.log('=== BEGINNER LEVEL ===');\n\nconst simpleElements = [\n  { tag: 'h1', textContent: 'Hello World', id: 'title' },\n  { tag: 'p', textContent: 'This is a paragraph', className: 'content' },\n  { tag: 'button', textContent: 'Click Me', className: 'btn' }\n];\n\n// Usage:\n// const container = document.getElementById('app');\n// fillDOMBeginner(container, simpleElements);\n\nconsole.log('Simple element configs:', simpleElements);",
  intermediateApproach:
    "Intermediate: Handle nested children and attributes\n\n\nIntermediate: Fill DOM with fragment (better performance)",
  intermediateImplementation:
    "function createElementIntermediate(config) {\n  const { \n    tag = 'div', \n    id, \n    className, \n    textContent, \n    children = [], \n    attributes = {},\n    styles = {},\n    events = {}\n  } = config;\n  \n  const element = document.createElement(tag);\n  \n  // ID\n  if (id) element.id = id;\n  \n  // Classes\n  if (className) {\n    if (Array.isArray(className)) {\n      element.className = className.join(' ');\n    } else {\n      element.className = className;\n    }\n  }\n  \n  // Text content\n  if (textContent) element.textContent = textContent;\n  \n  // Custom attributes\n  Object.entries(attributes).forEach(([key, value]) => {\n    element.setAttribute(key, value);\n  });\n  \n  // Styles\n  Object.entries(styles).forEach(([property, value]) => {\n    element.style[property] = value;\n  });\n  \n  // Event listeners\n  Object.entries(events).forEach(([event, handler]) => {\n    element.addEventListener(event, handler);\n  });\n  \n  // Recursively create children\n  children.forEach(childConfig => {\n    if (typeof childConfig === 'string') {\n      element.appendChild(document.createTextNode(childConfig));\n    } else {\n      element.appendChild(createElementIntermediate(childConfig));\n    }\n  });\n  \n  return element;\n}\n\nfunction fillDOMIntermediate(container, elements) {\n  const fragment = document.createDocumentFragment();\n  \n  elements.forEach(config => {\n    fragment.appendChild(createElementIntermediate(config));\n  });\n  \n  container.appendChild(fragment);\n}\n\n// Test Intermediate Level\nconsole.log('\\n=== INTERMEDIATE LEVEL ===');\n\nconst nestedElements = [\n  {\n    tag: 'div',\n    className: 'card',\n    children: [\n      { tag: 'h2', textContent: 'Card Title', className: 'card-title' },\n      { \n        tag: 'p', \n        textContent: 'Card description',\n        styles: { color: 'gray', fontSize: '14px' }\n      },\n      {\n        tag: 'button',\n        textContent: 'Learn More',\n        className: 'btn btn-primary',\n        attributes: { 'data-id': '123' },\n        events: {\n          click: (e) => console.log('Clicked!', e.target)\n        }\n      }\n    ]\n  }\n];\n\nconsole.log('Nested config:', JSON.stringify(nestedElements, null, 2));",
  expertApproach:
    "Expert: Full-featured DOM builder\n\n\nExpert: JSX-like helper (hyperscript style)",
  expertImplementation:
    "class DOMBuilder {\n  constructor(options = {}) {\n    this.options = {\n      sanitize: true,      // XSS protection\n      namespace: null,     // SVG namespace support\n      ...options\n    };\n  }\n  \n  // Sanitize text to prevent XSS\n  sanitize(text) {\n    if (!this.options.sanitize || typeof text !== 'string') return text;\n    \n    const div = document.createElement('div');\n    div.textContent = text;\n    return div.innerHTML;\n  }\n  \n  // Create single element\n  createElement(config) {\n    if (typeof config === 'string') {\n      return document.createTextNode(config);\n    }\n    \n    const {\n      tag = 'div',\n      id,\n      className,\n      classList = [],\n      textContent,\n      innerHTML,\n      children = [],\n      attributes = {},\n      dataset = {},\n      styles = {},\n      events = {},\n      ref,\n      namespace\n    } = config;\n    \n    // Create element (with namespace for SVG)\n    const ns = namespace || this.options.namespace;\n    const element = ns\n      ? document.createElementNS(ns, tag)\n      : document.createElement(tag);\n    \n    // ID\n    if (id) element.id = id;\n    \n    // Classes\n    if (className) {\n      const classes = Array.isArray(className) ? className : className.split(' ');\n      element.classList.add(...classes.filter(Boolean));\n    }\n    if (classList.length) {\n      element.classList.add(...classList);\n    }\n    \n    // Text content (sanitized)\n    if (textContent !== undefined) {\n      element.textContent = this.sanitize(textContent);\n    }\n    \n    // innerHTML (only if explicitly allowed and sanitize is false)\n    if (innerHTML && !this.options.sanitize) {\n      element.innerHTML = innerHTML;\n    }\n    \n    // Attributes\n    for (const [key, value] of Object.entries(attributes)) {\n      if (value === true) {\n        element.setAttribute(key, '');\n      } else if (value !== false && value !== null && value !== undefined) {\n        element.setAttribute(key, String(value));\n      }\n    }\n    \n    // Dataset (data-* attributes)\n    for (const [key, value] of Object.entries(dataset)) {\n      element.dataset[key] = value;\n    }\n    \n    // Styles\n    for (const [property, value] of Object.entries(styles)) {\n      if (value !== null && value !== undefined) {\n        // Handle camelCase to kebab-case\n        const kebabProp = property.replace(/([A-Z])/g, '-$1').toLowerCase();\n        element.style.setProperty(kebabProp, value);\n      }\n    }\n    \n    // Events\n    for (const [event, handler] of Object.entries(events)) {\n      if (typeof handler === 'function') {\n        element.addEventListener(event, handler);\n      } else if (typeof handler === 'object') {\n        // Advanced: { handler, options }\n        element.addEventListener(event, handler.handler, handler.options);\n      }\n    }\n    \n    // Ref callback\n    if (typeof ref === 'function') {\n      ref(element);\n    }\n    \n    // Children\n    this.appendChildren(element, children);\n    \n    return element;\n  }\n  \n  appendChildren(parent, children) {\n    if (!Array.isArray(children)) {\n      children = [children];\n    }\n    \n    children.forEach(child => {\n      if (child === null || child === undefined) return;\n      parent.appendChild(this.createElement(child));\n    });\n  }\n  \n  // Build from array\n  buildFromArray(configs) {\n    const fragment = document.createDocumentFragment();\n    \n    configs.forEach(config => {\n      fragment.appendChild(this.createElement(config));\n    });\n    \n    return fragment;\n  }\n  \n  // Render to container\n  render(container, configs) {\n    const fragment = this.buildFromArray(Array.isArray(configs) ? configs : [configs]);\n    container.appendChild(fragment);\n    return container;\n  }\n  \n  // Replace container content\n  renderAndReplace(container, configs) {\n    container.innerHTML = '';\n    return this.render(container, configs);\n  }\n}\n\nfunction h(tag, props = {}, ...children) {\n  return {\n    tag,\n    ...props,\n    children: children.flat()\n  };\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\nconst builder = new DOMBuilder({ sanitize: true });\n\n// Complex configuration\nconst complexUI = [\n  h('header', { className: 'header' },\n    h('nav', { className: 'nav' },\n      h('ul', { className: 'nav-list' },\n        h('li', {}, h('a', { attributes: { href: '/' } }, 'Home')),\n        h('li', {}, h('a', { attributes: { href: '/about' } }, 'About')),\n        h('li', {}, h('a', { attributes: { href: '/contact' } }, 'Contact'))\n      )\n    )\n  ),\n  h('main', { className: 'main' },\n    h('article', { className: 'article' },\n      h('h1', {}, 'Welcome'),\n      h('p', { styles: { lineHeight: '1.6' } }, 'This is the content.')\n    )\n  ),\n  h('footer', { className: 'footer' },\n    'Copyright 2024'\n  )\n];\n\nconsole.log('Complex UI config:', JSON.stringify(complexUI, null, 2));",
  interviewTraps: [
    "QUICK REFERENCE:",
    "createElement(tag) - Create element",
    "setAttribute(name, value) - Set attribute",
    "appendChild(child) - Add child",
    "textContent - Safe text",
    "innerHTML - Unsafe HTML (XSS risk)",
    "DocumentFragment - Batch operations",
    "INTERVIEW TIPS:",
  ],
  stepByStep: [
    "Check if node is primitive (string or number); create TextNode and return.",
    "Create element using document.createElement(tag).",
    "Iterate props object to assign classes, styles, and attributes.",
    "Attach event handlers with addEventListener.",
    "Create DocumentFragment to batch render children.",
    "Recursively call createDOMFromObject for each child and append to fragment.",
    "Append fragment to parent element.",
    "Attach generated root element to container.",
  ],

  timeComplexity:
    "O(N) where N is the total count of nodes and attributes in the tree.",
  spaceComplexity:
    "O(D) call stack depth where D is the maximum depth of the tree, plus O(N) DOM nodes created in memory.",

  alternativeSolutions: [
    "Iterative stack/queue-based tree generation",
    "JSX compiler transform target (custom h / createElement factory)",
  ],

  commonMistakes: [
    "Using innerHTML with interpolated strings, creating security holes.",
    "Not checking for null/undefined child nodes in arrays.",
    "Appending children one-by-one directly to container triggering multiple DOM reflows instead of using DocumentFragment.",
  ],

  followUps: [
    "How does this relate to React.createElement and the Virtual DOM diffing process?",
    "How would you add diff and patch capabilities to update an existing DOM tree rather than replacing it?",
    "How would you support SVG element creation with document.createElementNS?",
  ],
};
