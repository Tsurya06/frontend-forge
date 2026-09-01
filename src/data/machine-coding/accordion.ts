import type { MachineCodingProblem } from "../../types";

export const accordionProblem: MachineCodingProblem = {
  id: "mc-accordion",
  title: "Accordion Component",
  difficulty: "Intermediate",
  category: "Machine Coding",
  tags: [
    "react",
    "accordion",
    "accessibility",
    "aria",
    "keyboard-navigation",
    "animation",
  ],

  problemStatement: `Build an Accordion component in React that allows users to expand and collapse content sections. The accordion should support both single-panel mode (only one section open at a time, like a traditional accordion) and multi-panel mode (multiple sections can be open simultaneously). This is a frequently asked machine coding question that tests your understanding of compound components, ARIA patterns, and state management.

The component must be fully keyboard accessible, following the WAI-ARIA Accordion pattern. Users should be able to navigate between accordion headers using arrow keys, expand/collapse panels with Enter or Space, and jump to the first/last header with Home/End keys. Each panel's content should animate smoothly between open and closed states.`,

  functionalRequirements: [
    "Expand/collapse individual accordion panels on header click",
    "Support single-open mode (collapse others when one opens)",
    "Support multi-open mode (multiple panels open at once)",
    "Smooth height animation when opening/closing panels",
    "Support controlled and uncontrolled usage",
    "Allow default expanded panels on initial render",
    "Support disabled state for individual panels",
  ],

  nonFunctionalRequirements: [
    "Full keyboard navigation: Enter/Space to toggle, Arrow keys to navigate headers",
    "ARIA attributes: role, aria-expanded, aria-controls, aria-labelledby",
    "CSS transitions for smooth open/close animation",
    "Compound component API for flexible composition",
  ],

  componentHierarchy: `Accordion
├── AccordionItem (repeated)
│   ├── AccordionHeader (button)
│   │   ├── Title text
│   │   └── Expand/Collapse icon
│   └── AccordionPanel (collapsible content)
│       └── {children}`,

  stateDesign: `// State shape
interface AccordionState {
  expandedItems: Set<string>;  // set of expanded item IDs
}

// In single mode, the set has at most 1 entry.
// In multi mode, the set can have multiple entries.
// Each AccordionItem has a unique \`value\` identifier.

// For animation, each panel tracks its content height:
// - On open: set maxHeight to scrollHeight, then to 'none' after transition
// - On close: set maxHeight to scrollHeight, then to 0`,

  architecture: `The Accordion uses a compound component pattern with React Context. The parent \`Accordion\` component manages the expanded state and provides toggle/expand/collapse functions via context. Each \`AccordionItem\` reads the context to determine if it is expanded and calls the toggle function when the header is clicked.

In single mode, toggling an item first collapses all others. In multi mode, items toggle independently. The animation is handled by measuring the panel's \`scrollHeight\` and transitioning \`maxHeight\` between 0 and the measured height. A \`transitionend\` listener sets \`maxHeight\` to \`none\` after opening (to handle dynamic content) and cleans up after closing. Keyboard navigation follows the WAI-ARIA accordion pattern with roving tabindex on headers.`,

  implementation: `import React, { useState, useContext, createContext, useRef, useEffect, useCallback, KeyboardEvent } from 'react';

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue>({
  expandedItems: new Set(),
  toggle: () => {},
});

interface AccordionProps {
  children: React.ReactNode;
  multiple?: boolean;
  defaultExpanded?: string[];
}

export function Accordion({ children, multiple = false, defaultExpanded = [] }: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(defaultExpanded));
  const headersRef = useRef<HTMLButtonElement[]>([]);

  const toggle = useCallback((value: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        if (!multiple) next.clear();
        next.add(value);
      }
      return next;
    });
  }, [multiple]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const headers = headersRef.current;
    const idx = headers.indexOf(e.target as HTMLButtonElement);
    if (idx === -1) return;
    let nextIdx = idx;
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); nextIdx = (idx + 1) % headers.length; break;
      case 'ArrowUp': e.preventDefault(); nextIdx = (idx - 1 + headers.length) % headers.length; break;
      case 'Home': e.preventDefault(); nextIdx = 0; break;
      case 'End': e.preventDefault(); nextIdx = headers.length - 1; break;
      default: return;
    }
    headers[nextIdx]?.focus();
  }, []);

  return (
    <AccordionContext.Provider value={{ expandedItems, toggle }}>
      <div role="presentation" onKeyDown={handleKeyDown} ref={(el) => {
        if (el) headersRef.current = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-accordion-header]'));
      }}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function AccordionItem({ value, title, children, disabled = false }: AccordionItemProps) {
  const { expandedItems, toggle } = useContext(AccordionContext);
  const isExpanded = expandedItems.has(value);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>(isExpanded ? 'none' : '0px');

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isExpanded) {
      setMaxHeight(\`\${el.scrollHeight}px\`);
      const handler = () => setMaxHeight('none');
      el.addEventListener('transitionend', handler, { once: true });
      return () => el.removeEventListener('transitionend', handler);
    } else {
      setMaxHeight(\`\${el.scrollHeight}px\`);
      requestAnimationFrame(() => { requestAnimationFrame(() => setMaxHeight('0px')); });
    }
  }, [isExpanded]);

  const headerId = \`accordion-header-\${value}\`;
  const panelId = \`accordion-panel-\${value}\`;

  return (
    <div style={{ borderBottom: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: 0 }}>
        <button
          data-accordion-header
          id={headerId}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          disabled={disabled}
          onClick={() => !disabled && toggle(value)}
          style={{
            width: '100%', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '16px', background: 'none',
            border: 'none', fontSize: 16, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
            color: disabled ? '#9ca3af' : '#111827', textAlign: 'left',
          }}
        >
          {title}
          <span style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s', fontSize: 12,
          }}>
            ▼
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        ref={contentRef}
        role="region"
        aria-labelledby={headerId}
        hidden={!isExpanded && maxHeight === '0px'}
        style={{
          maxHeight, overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        <div style={{ padding: '0 16px 16px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AccordionDemo() {
  return (
    <Accordion defaultExpanded={['item-1']}>
      <AccordionItem value="item-1" title="What is React?">
        <p>React is a JavaScript library for building user interfaces, developed by Facebook.</p>
      </AccordionItem>
      <AccordionItem value="item-2" title="What are hooks?">
        <p>Hooks are functions that let you use state and lifecycle features in function components.</p>
      </AccordionItem>
      <AccordionItem value="item-3" title="What is JSX?">
        <p>JSX is a syntax extension that allows writing HTML-like code in JavaScript files.</p>
      </AccordionItem>
    </Accordion>
  );
}`,

  accessibility: `The accordion follows the WAI-ARIA Accordion pattern. Each header is a \`<button>\` inside an \`<h3>\`, with \`aria-expanded\` indicating the current state and \`aria-controls\` pointing to the associated panel's ID. Each panel has \`role="region"\` and \`aria-labelledby\` linking back to the header. Keyboard navigation supports Arrow Up/Down to move between headers, Home/End to jump to first/last header, and Enter/Space to toggle. The \`hidden\` attribute is applied to collapsed panels so they are removed from the accessibility tree. Disabled items are marked with the \`disabled\` attribute on the button.`,

  performance: `The accordion only re-renders items whose expanded state changes. The compound component pattern with context is efficient because each \`AccordionItem\` subscribes to the same context but only re-renders when \`expandedItems\` changes. Height animation uses CSS transitions on \`maxHeight\` rather than JavaScript animation, leveraging GPU-accelerated compositing. After the open transition completes, \`maxHeight\` is set to \`none\` to allow dynamic content changes without height constraints. The two-frame \`requestAnimationFrame\` trick ensures the browser processes the initial height before transitioning to 0.`,

  edgeCases: [
    "Accordion with dynamic content that changes height after opening",
    "Rapidly toggling panels before animation completes",
    "Accordion with zero items should render empty without errors",
    "Very long content should scroll within the panel if constrained",
    "Nested accordions should maintain independent state",
  ],

  testingStrategy: [
    "Unit test: clicking header toggles panel visibility",
    "Unit test: single mode collapses other panels when opening one",
    "Unit test: multi mode allows multiple panels open simultaneously",
    "Unit test: disabled items cannot be toggled",
    "Integration test: Arrow keys navigate between accordion headers",
    "Accessibility audit: verify ARIA attributes and roles",
  ],

  improvements: [
    "Add icon customization for expand/collapse indicator",
    "Support nested accordions with independent state management",
    "Add lazy rendering of panel content (only render when first opened)",
    "Implement drag-and-drop reordering of accordion items",
  ],

  followUpQuestions: [
    "How would you implement the compound component pattern with TypeScript generics?",
    "What are the pros and cons of CSS transitions vs JS animation for the accordion?",
    "How would you lazy-load heavy accordion panel content?",
    "How does the WAI-ARIA accordion pattern differ from the disclosure pattern?",
  ],
};
