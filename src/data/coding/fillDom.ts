import type { CodingProblem } from '../../types';

export const fillDomProblem: CodingProblem = {
  id: 'coding-fill-dom',
  title: 'Fill DOM Tree from an Array of Objects',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['javascript', 'dom', 'recursion', 'virtual-dom', 'html-generation'],

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
    'Construct real DOM nodes from nested descriptor objects',
    'Handle strings and numbers as text nodes',
    'Handle className / class, inline styles, and standard HTML attributes',
    'Attach event listeners safely using addEventListener',
    'Recursively process children arrays and append to parent',
    'Use DocumentFragment when mounting multiple children to minimize reflows',
  ],

  examples: [
    {
      input: `const schema = {\n  tag: 'div',\n  props: { className: 'card', id: 'card-1' },\n  children: [\n    { tag: 'h2', children: ['Hello World'] },\n    { tag: 'p', props: { style: { color: 'blue' } }, children: ['Dynamic DOM tree'] },\n    { tag: 'button', events: { click: () => alert('clicked') }, children: ['Click Me'] }\n  ]\n};\nconst root = document.getElementById('app');\nrenderDOMTree(schema, root);`,
      output: '<div class="card" id="card-1"><h2>Hello World</h2><p style="color: blue;">Dynamic DOM tree</p><button>Click Me</button></div> mounted inside root',
      explanation: 'Constructs the full interactive DOM hierarchy.',
    },
  ],

  edgeCases: [
    'Null or undefined children: ignore gracefully',
    'Plain string or number as root or child: convert to TextNode',
    'Boolean attributes (disabled, checked, hidden): set attribute or property correctly',
    'Event listener cleanup: support returning a cleanup function or unmount handler',
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

  stepByStep: [
    'Check if node is primitive (string or number); create TextNode and return.',
    'Create element using document.createElement(tag).',
    'Iterate props object to assign classes, styles, and attributes.',
    'Attach event handlers with addEventListener.',
    'Create DocumentFragment to batch render children.',
    'Recursively call createDOMFromObject for each child and append to fragment.',
    'Append fragment to parent element.',
    'Attach generated root element to container.',
  ],

  timeComplexity: 'O(N) where N is the total count of nodes and attributes in the tree.',
  spaceComplexity: 'O(D) call stack depth where D is the maximum depth of the tree, plus O(N) DOM nodes created in memory.',

  alternativeSolutions: [
    'Iterative stack/queue-based tree generation',
    'JSX compiler transform target (custom h / createElement factory)',
  ],

  commonMistakes: [
    'Using innerHTML with interpolated strings, creating security holes.',
    'Not checking for null/undefined child nodes in arrays.',
    'Appending children one-by-one directly to container triggering multiple DOM reflows instead of using DocumentFragment.',
  ],

  followUps: [
    'How does this relate to React.createElement and the Virtual DOM diffing process?',
    'How would you add diff and patch capabilities to update an existing DOM tree rather than replacing it?',
    'How would you support SVG element creation with document.createElementNS?',
  ],
};
