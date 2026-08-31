import type { MachineCodingProblem } from '../../types';

export const tabsProblem: MachineCodingProblem = {
  id: 'mc-tabs',
  title: 'Tabs',
  difficulty: 'Beginner',
  category: 'Machine Coding',
  tags: ['tabs', 'aria', 'keyboard-navigation', 'active-state', 'controlled', 'focus-management'],
  problemStatement: `Build an accessible Tabs component in React that follows the WAI-ARIA Tabs pattern. The component should display a horizontal tab list where clicking a tab reveals its associated content panel. Only one panel is visible at a time. The component should support full keyboard navigation using arrow keys to move between tabs and Enter/Space to activate them.

The Tabs component should work in both controlled mode (active tab managed by parent) and uncontrolled mode (internal state). Each tab and panel pair must be linked via ARIA attributes (aria-controls, aria-labelledby, role="tablist", role="tab", role="tabpanel"). Focus management should follow the roving tabindex pattern: only the active tab has tabIndex=0 while others have tabIndex=-1.

This is a fundamental component building problem that tests ARIA authoring practices, keyboard interaction patterns, and the controlled vs uncontrolled component API design.`,
  functionalRequirements: [
    'Render a horizontal tab list with clickable tab buttons',
    'Clicking a tab reveals its content panel and hides others',
    'Active tab is visually highlighted with a bottom border or background change',
    'Arrow Left/Right keys move focus between tabs (wrapping at edges)',
    'Home key moves focus to the first tab, End key to the last',
    'Enter/Space on a focused tab activates it',
    'Support both controlled (activeTab prop) and uncontrolled (internal state) modes',
    'Lazy or eager rendering of panel content (configurable)',
  ],
  nonFunctionalRequirements: [
    'Full WAI-ARIA Tabs pattern: tablist, tab, tabpanel roles with proper linking attributes',
    'Roving tabindex: only active tab is in the tab order (tabIndex=0)',
    'Focus remains on tab list during keyboard navigation (focus doesn\'t jump to panel)',
    'Content is accessible: panel has aria-labelledby linking to its tab',
  ],
  componentHierarchy: `Tabs
├── TabList (role="tablist")
│   └── Tab (role="tab", per tab)
└── TabPanel (role="tabpanel", active only)`,
  stateDesign: `interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultActiveId?: string;
  activeId?: string;         // controlled
  onChange?: (id: string) => void;
}

// Internal state (uncontrolled mode)
const [internalActiveId, setInternalActiveId] = useState(defaultActiveId ?? tabs[0]?.id);
const activeId = controlledActiveId ?? internalActiveId;
const [focusedIndex, setFocusedIndex] = useState(0);`,
  architecture: `The Tabs component accepts an array of tab definitions (id, label, content). It supports both controlled and uncontrolled patterns: if activeId prop is provided, the parent owns the state; otherwise, internal useState manages it. Focus and activation are separate concerns — arrow keys move focus (focusedIndex) without changing the active tab, while Enter/Space activates the focused tab.

The tab list uses role="tablist" and each tab uses role="tab" with aria-selected and aria-controls pointing to the panel ID. The active panel has role="tabpanel" with aria-labelledby pointing back to the tab. Roving tabindex gives tabIndex=0 to the focused tab and -1 to others.`,
  implementation: `import React, { useState, useRef, useCallback, useEffect } from 'react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultActiveId?: string;
  activeId?: string;
  onChange?: (id: string) => void;
}

export default function Tabs({ tabs, defaultActiveId, activeId: controlledId, onChange }: TabsProps) {
  const isControlled = controlledId !== undefined;
  const [internalId, setInternalId] = useState(defaultActiveId ?? tabs[0]?.id ?? '');
  const activeId = isControlled ? controlledId : internalId;

  const enabledTabs = tabs.filter((t) => !t.disabled);
  const activeIndex = tabs.findIndex((t) => t.id === activeId);
  const [focusedIndex, setFocusedIndex] = useState(activeIndex >= 0 ? activeIndex : 0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activate = useCallback(
    (id: string) => {
      if (!isControlled) setInternalId(id);
      onChange?.(id);
    },
    [isControlled, onChange]
  );

  useEffect(() => {
    tabRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const enabledIndices = tabs.reduce<number[]>((acc, t, i) => {
        if (!t.disabled) acc.push(i);
        return acc;
      }, []);

      const currentPos = enabledIndices.indexOf(focusedIndex);
      let nextPos: number | null = null;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextPos = (currentPos + 1) % enabledIndices.length;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextPos = (currentPos - 1 + enabledIndices.length) % enabledIndices.length;
          break;
        case 'Home':
          e.preventDefault();
          nextPos = 0;
          break;
        case 'End':
          e.preventDefault();
          nextPos = enabledIndices.length - 1;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          activate(tabs[focusedIndex].id);
          return;
      }

      if (nextPos !== null) {
        const newIndex = enabledIndices[nextPos];
        setFocusedIndex(newIndex);
        activate(tabs[newIndex].id);
      }
    },
    [focusedIndex, tabs, activate]
  );

  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', fontFamily: 'system-ui' }}>
      <div
        role="tablist"
        aria-label="Tabs"
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex', borderBottom: '2px solid #e2e8f0', gap: 0,
        }}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeId;
          const isFocused = index === focusedIndex;

          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              id={\`tab-\${tab.id}\`}
              aria-selected={isActive}
              aria-controls={\`panel-\${tab.id}\`}
              aria-disabled={tab.disabled || undefined}
              tabIndex={isFocused ? 0 : -1}
              onClick={() => {
                if (!tab.disabled) {
                  setFocusedIndex(index);
                  activate(tab.id);
                }
              }}
              disabled={tab.disabled}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: \`2px solid \${isActive ? '#3b82f6' : 'transparent'}\`,
                background: 'none',
                color: tab.disabled ? '#cbd5e1' : isActive ? '#2563eb' : '#64748b',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                marginBottom: -2,
                transition: 'color 0.15s, border-color 0.15s',
                outline: 'none',
                position: 'relative',
              }}
            >
              {tab.label}
              {isFocused && (
                <span
                  style={{
                    position: 'absolute', inset: 2, border: '2px solid #93c5fd',
                    borderRadius: 4, pointerEvents: 'none',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {activeTab && (
        <div
          role="tabpanel"
          id={\`panel-\${activeTab.id}\`}
          aria-labelledby={\`tab-\${activeTab.id}\`}
          tabIndex={0}
          style={{ padding: '16px 4px', outline: 'none' }}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}

export function TabsDemo() {
  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px' }}>Project Overview</h3>
          <p style={{ color: '#475569', lineHeight: 1.6 }}>
            This section provides a high-level summary of the project including goals,
            timeline, and key stakeholders involved in the initiative.
          </p>
        </div>
      ),
    },
    {
      id: 'features',
      label: 'Features',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px' }}>Key Features</h3>
          <ul style={{ color: '#475569', lineHeight: 1.8 }}>
            <li>Responsive design for all screen sizes</li>
            <li>Dark mode support</li>
            <li>Real-time collaboration</li>
            <li>Export to multiple formats</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px' }}>Settings</h3>
          <p style={{ color: '#475569' }}>Configure your preferences, notifications, and account details here.</p>
        </div>
      ),
    },
    {
      id: 'disabled',
      label: 'Archived',
      disabled: true,
      content: <div>This tab is disabled.</div>,
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Tabs tabs={tabs} />
    </div>
  );
}`,
  accessibility: `Implements the WAI-ARIA Tabs pattern precisely: role="tablist" on the container, role="tab" on each button with aria-selected and aria-controls, role="tabpanel" with aria-labelledby and tabIndex=0 for panel focusability. Roving tabindex gives tabIndex=0 only to the focused tab. Arrow keys move focus within the tab list; Home/End jump to first/last. Disabled tabs have aria-disabled. A visible focus indicator ring is shown on the focused tab.`,
  performance: `Only the active tab's panel content is rendered (lazy by default). Tab switching is O(1) state update. The ref array for tabs avoids creating refs dynamically. Keyboard event handling is O(n) for filtering enabled tabs but n is small. For tabs with heavy content, consider keeping previously rendered panels in the DOM (hidden) to preserve scroll position and form state.`,
  edgeCases: [
    'All tabs disabled — no tab should be activatable or focusable',
    'Single tab — should still render with correct ARIA roles',
    'Controlled mode with stale activeId — component handles missing tab gracefully',
    'Dynamic tab addition/removal — focusedIndex should be clamped to valid range',
    'Very long tab labels — should truncate with ellipsis or scroll the tab list',
    'Tab content contains focusable elements — Tab key should move from tab list to panel content',
  ],
  testingStrategy: [
    'Unit test: clicking a tab activates it and shows its panel',
    'Unit test: ArrowRight moves focus to the next tab',
    'Unit test: ArrowRight on last tab wraps to first',
    'Unit test: disabled tabs are skipped during keyboard navigation',
    'Unit test: Enter/Space activates the focused tab',
    'Integration test: controlled mode respects external activeId',
    'Integration test: uncontrolled mode manages state internally',
    'Accessibility test: ARIA attributes are correctly set for each tab and panel',
  ],
  improvements: [
    'Add animated content transitions (slide or fade) when switching tabs',
    'Support vertical tab orientation with ArrowUp/Down',
    'Add closeable tabs with an X button on each tab',
    'Implement tab overflow scrolling for many tabs (scroll buttons on edges)',
    'Support drag-and-drop tab reordering',
  ],
  followUpQuestions: [
    'What is the roving tabindex pattern and why is it preferred for tab lists?',
    'How would you handle tab content that needs to persist state when switching away?',
    'What is the difference between automatic and manual activation in the ARIA Tabs pattern?',
    'How would you implement vertical tabs with the same component?',
  ],
};
