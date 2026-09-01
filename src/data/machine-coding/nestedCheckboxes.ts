import type { MachineCodingProblem } from "../../types";

export const nestedCheckboxesProblem: MachineCodingProblem = {
  id: "mc-nested-checkboxes",
  title: "Nested Checkboxes",
  difficulty: "Intermediate",
  category: "Machine Coding",
  tags: [
    "checkbox",
    "tree",
    "recursive",
    "indeterminate",
    "parent-child-sync",
    "accessibility",
  ],
  problemStatement: `Build a nested checkbox tree component in React where parent and child checkboxes are synchronized. When a parent checkbox is toggled, all its children should update to the same state (checked or unchecked). When a child is toggled, the parent should update to reflect the aggregate state: checked if all children are checked, unchecked if none are checked, or indeterminate if some are checked.

The tree structure is arbitrary — it can be deeply nested with multiple levels. The component must handle the indeterminate state correctly, which is a visual-only state on the HTML checkbox that must be set via the DOM ref (it cannot be set via an attribute). The tree should be collapsible, allowing users to expand/collapse branches.

This problem tests recursive data structure traversal, derived state computation, ref manipulation for indeterminate state, and building recursive components.`,
  functionalRequirements: [
    "Render a tree of checkboxes from a nested data structure",
    "Toggling a parent checks/unchecks all descendant checkboxes",
    "Toggling a child updates all ancestor checkboxes: checked, unchecked, or indeterminate",
    "Support the HTML indeterminate checkbox state when some (but not all) children are checked",
    "Expand/collapse tree branches by clicking a toggle arrow",
    "Support arbitrary nesting depth",
  ],
  nonFunctionalRequirements: [
    "Indeterminate state set via ref (checkbox.indeterminate = true)",
    "Efficient state propagation — avoid full tree traversal when possible",
    "Accessible: checkboxes have labels, tree uses appropriate ARIA roles",
    "Support hundreds of nodes without performance degradation",
  ],
  componentHierarchy: `CheckboxTree
└── TreeNode (recursive)
    ├── ExpandToggle (arrow icon)
    ├── Checkbox (with ref for indeterminate)
    ├── Label
    └── ChildrenContainer
        └── TreeNode (recursive children)`,
  stateDesign: `interface TreeNodeData {
  id: string;
  label: string;
  children?: TreeNodeData[];
}

// Flat checked set for O(1) lookups
const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(initialExpanded));

// Helper: get all descendant IDs for a node
function getAllDescendantIds(node: TreeNodeData): string[] { ... }

// Helper: determine node state from checkedIds
function getNodeState(node: TreeNodeData, checked: Set<string>): 'checked' | 'unchecked' | 'indeterminate' { ... }`,
  architecture: `The tree data is a nested structure (TreeNodeData[]) but the checked state is stored as a flat Set<string> of checked leaf/node IDs. When a parent is toggled ON, all its descendant IDs are added to the set. When toggled OFF, all are removed. When a child changes, the parent's state is derived by checking whether all, some, or no children are in the set.

The TreeNode component is recursive. It receives the node data and the checked set, computes its own display state (checked/unchecked/indeterminate), and uses a ref callback to set checkbox.indeterminate when appropriate. Expand/collapse state is managed in a separate Set.`,
  implementation: `import React, { useState, useCallback, useRef, useEffect } from 'react';

interface TreeNodeData {
  id: string;
  label: string;
  children?: TreeNodeData[];
}

const sampleTree: TreeNodeData[] = [
  {
    id: 'fruits', label: 'Fruits',
    children: [
      { id: 'apple', label: 'Apple' },
      { id: 'banana', label: 'Banana' },
      {
        id: 'citrus', label: 'Citrus',
        children: [
          { id: 'orange', label: 'Orange' },
          { id: 'lemon', label: 'Lemon' },
          { id: 'grapefruit', label: 'Grapefruit' },
        ],
      },
    ],
  },
  {
    id: 'vegetables', label: 'Vegetables',
    children: [
      { id: 'carrot', label: 'Carrot' },
      { id: 'broccoli', label: 'Broccoli' },
      {
        id: 'leafy', label: 'Leafy Greens',
        children: [
          { id: 'spinach', label: 'Spinach' },
          { id: 'kale', label: 'Kale' },
        ],
      },
    ],
  },
];

function getAllDescendantIds(node: TreeNodeData): string[] {
  const ids: string[] = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...getAllDescendantIds(child));
    }
  }
  return ids;
}

function getNodeState(
  node: TreeNodeData,
  checked: Set<string>
): 'checked' | 'unchecked' | 'indeterminate' {
  if (!node.children || node.children.length === 0) {
    return checked.has(node.id) ? 'checked' : 'unchecked';
  }
  const childStates = node.children.map((c) => getNodeState(c, checked));
  if (childStates.every((s) => s === 'checked')) return 'checked';
  if (childStates.every((s) => s === 'unchecked')) return 'unchecked';
  return 'indeterminate';
}

function TreeNode({
  node,
  checkedIds,
  expandedIds,
  onToggleCheck,
  onToggleExpand,
  level,
}: {
  node: TreeNodeData;
  checkedIds: Set<string>;
  expandedIds: Set<string>;
  onToggleCheck: (node: TreeNodeData) => void;
  onToggleExpand: (id: string) => void;
  level: number;
}) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const state = getNodeState(node, checkedIds);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = state === 'indeterminate';
    }
  }, [state]);

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} style={{ listStyle: 'none' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          paddingLeft: level * 20, paddingTop: 4, paddingBottom: 4,
        }}
      >
        {hasChildren ? (
          <button
            onClick={() => onToggleExpand(node.id)}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
              fontSize: 12, color: '#64748b', width: 20, textAlign: 'center',
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        ) : (
          <span style={{ width: 20 }} />
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14 }}>
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={state === 'checked'}
            onChange={() => onToggleCheck(node)}
            style={{ width: 16, height: 16, cursor: 'pointer' }}
          />
          {node.label}
        </label>
      </div>

      {hasChildren && isExpanded && (
        <ul role="group" style={{ padding: 0, margin: 0 }}>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              checkedIds={checkedIds}
              expandedIds={expandedIds}
              onToggleCheck={onToggleCheck}
              onToggleExpand={onToggleExpand}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CheckboxTree() {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(['fruits', 'vegetables', 'citrus', 'leafy'])
  );

  const toggleCheck = useCallback((node: TreeNodeData) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      const allIds = getAllDescendantIds(node);
      const currentState = getNodeState(node, prev);

      if (currentState === 'checked') {
        allIds.forEach((id) => next.delete(id));
      } else {
        allIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const checkedCount = checkedIds.size;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 16 }}>
      <h2 style={{ margin: '0 0 4px' }}>Category Selection</h2>
      <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px' }}>
        {checkedCount} item{checkedCount !== 1 ? 's' : ''} selected
      </p>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', background: '#fff' }}>
        <ul role="tree" aria-label="Category tree" style={{ padding: 0, margin: 0 }}>
          {sampleTree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              checkedIds={checkedIds}
              expandedIds={expandedIds}
              onToggleCheck={toggleCheck}
              onToggleExpand={toggleExpand}
              level={0}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}`,
  accessibility: `The tree uses role="tree", role="treeitem", and role="group" for proper ARIA tree semantics. Each treeitem has aria-expanded when it has children. Checkboxes are wrapped in <label> elements for click-target association. The indeterminate state is visible on the native checkbox. Expand/collapse buttons have aria-labels. Keyboard users can tab to checkboxes and toggle with Space.`,
  performance: `The checked state is stored as a flat Set<string> for O(1) lookups. getNodeState is called per node per render — for trees with hundreds of nodes, this can be memoized per subtree. The expand/collapse state avoids re-rendering collapsed subtrees since they're conditionally rendered. For very large trees (1000+ nodes), consider virtualization or lazy-loading children.`,
  edgeCases: [
    "Deeply nested tree (10+ levels) — indentation may overflow; add max-indent or horizontal scroll",
    "Leaf-only toggle — toggling a leaf with no children just toggles itself",
    "All children already checked, click parent — should uncheck all",
    "Indeterminate parent clicked — should check all children (common UX pattern)",
    "Empty children array vs undefined — both should be treated as leaf nodes",
    "Dynamic tree data changes — checked IDs may reference removed nodes; filter stale IDs",
  ],
  testingStrategy: [
    "Unit test: getAllDescendantIds returns all nested IDs including the root",
    "Unit test: getNodeState returns checked/unchecked/indeterminate correctly",
    "Integration test: checking a parent checks all visible children",
    "Integration test: unchecking one child sets parent to indeterminate",
    "Integration test: checkbox.indeterminate property is set via ref",
    "Integration test: collapse/expand toggles child visibility",
    "Accessibility test: tree roles and aria-expanded are correct",
  ],
  improvements: [
    "Add search/filter to quickly find nodes in a large tree",
    "Support async loading of children (lazy tree)",
    'Add "Select All / Deselect All" buttons at the root level',
    "Implement keyboard navigation with ArrowUp/Down/Left/Right per ARIA tree pattern",
    "Add drag-and-drop to rearrange tree nodes",
  ],
  followUpQuestions: [
    "How would you handle a tree with thousands of nodes efficiently?",
    "How would you implement async/lazy loading of child nodes?",
    "What ARIA keyboard interaction pattern is expected for a tree widget?",
    "How would you persist the checked state and synchronize it with a server?",
  ],
};
