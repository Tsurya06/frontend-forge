import type { MachineCodingProblem } from '../../types';

export const todoListProblem: MachineCodingProblem = {
  id: 'mc-todo-list',
  title: 'Todo List',
  difficulty: 'Beginner',
  category: 'Machine Coding',
  tags: ['todo', 'crud', 'local-storage', 'filter', 'state-management', 'forms'],
  problemStatement: `Build a fully functional Todo List application in React that supports creating, editing, deleting, and completing todo items. The app should include filter tabs to view all, active, or completed todos, along with a count of remaining items.

Todo data must persist across page refreshes using localStorage. Users should be able to inline-edit a todo by double-clicking on it, toggle completion with a checkbox, and delete with a button. A "Clear Completed" button should remove all finished todos at once. The input field should auto-focus on mount and the app should handle edge cases like empty strings, duplicate todos, and very long text gracefully.

This is a classic interview problem that tests CRUD operations, controlled forms, derived state, and local storage integration.`,
  functionalRequirements: [
    'Add a new todo by typing in an input and pressing Enter',
    'Toggle a todo between completed and active by clicking its checkbox',
    'Delete a single todo with a delete button',
    'Double-click a todo to enter inline edit mode; press Enter to save, Escape to cancel',
    'Filter todos by All, Active, or Completed tabs',
    'Display count of remaining (active) todos',
    'Clear all completed todos with a single button',
    'Persist todos to localStorage and restore on mount',
  ],
  nonFunctionalRequirements: [
    'Accessible: proper label associations, keyboard navigation for all actions, focus management during editing',
    'Responsive layout adapting to small screens',
    'Optimized renders — only re-render changed todo items',
    'Graceful handling of localStorage quota errors',
  ],
  componentHierarchy: `TodoApp
├── TodoInput
├── FilterBar
│   ├── FilterButton ("All")
│   ├── FilterButton ("Active")
│   └── FilterButton ("Completed")
├── TodoList
│   └── TodoItem (per todo)
│       ├── Checkbox
│       ├── TodoLabel / EditInput
│       └── DeleteButton
└── TodoFooter
    ├── ItemCount
    └── ClearCompletedButton`,
  stateDesign: `interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type Filter = 'all' | 'active' | 'completed';

const [todos, setTodos] = useState<Todo[]>(() => {
  const saved = localStorage.getItem('todos');
  return saved ? JSON.parse(saved) : [];
});
const [filter, setFilter] = useState<Filter>('all');
const [editingId, setEditingId] = useState<string | null>(null);

// Derived state
const filteredTodos = todos.filter(t =>
  filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed
);
const activeCount = todos.filter(t => !t.completed).length;`,
  architecture: `The TodoApp owns the canonical todo array and the active filter. State is initialized lazily from localStorage. A useEffect syncs state to localStorage on every change. Filtering is derived state computed on each render (cheap for typical list sizes).

TodoItem is memoized with React.memo to skip re-renders for unchanged items. Editing state is lifted to the parent (editingId) so only one item can be edited at a time. The input field auto-focuses when editingId changes. All mutations (add, toggle, delete, edit, clear) are pure functions over the todos array using setTodos with functional updates.`,
  implementation: `import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type Filter = 'all' | 'active' | 'completed';

const STORAGE_KEY = 'todos-app';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const TodoItem = memo(function TodoItem({
  todo,
  isEditing,
  onToggle,
  onDelete,
  onEdit,
  onSave,
  onCancelEdit,
}: {
  todo: Todo;
  isEditing: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancelEdit: () => void;
}) {
  const [editText, setEditText] = useState(todo.text);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus();
      setEditText(todo.text);
    }
  }, [isEditing, todo.text]);

  const handleSubmit = () => {
    const trimmed = editText.trim();
    if (trimmed) {
      onSave(trimmed);
    } else {
      onDelete();
    }
  };

  return (
    <li
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px', borderBottom: '1px solid #f1f5f9',
        background: isEditing ? '#f8fafc' : '#fff',
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        aria-label={\`Mark "\${todo.text}" as \${todo.completed ? 'active' : 'completed'}\`}
        style={{ width: 18, height: 18, cursor: 'pointer' }}
      />
      {isEditing ? (
        <input
          ref={editRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') onCancelEdit();
          }}
          style={{
            flex: 1, padding: '4px 8px', fontSize: 14,
            border: '1px solid #3b82f6', borderRadius: 4, outline: 'none',
          }}
          aria-label="Edit todo"
        />
      ) : (
        <span
          onDoubleClick={onEdit}
          style={{
            flex: 1, cursor: 'pointer', fontSize: 14,
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#94a3b8' : '#1e293b',
          }}
        >
          {todo.text}
        </span>
      )}
      <button
        onClick={onDelete}
        aria-label={\`Delete "\${todo.text}"\`}
        style={{
          background: 'none', border: 'none', color: '#ef4444',
          cursor: 'pointer', fontSize: 18, padding: '0 4px', lineHeight: 1,
        }}
      >
        ×
      </button>
    </li>
  );
});

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState<Filter>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch { /* quota exceeded — silently fail */ }
  }, [todos]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const addTodo = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      { id: generateId(), text, completed: false, createdAt: Date.now() },
    ]);
    setInput('');
  }, [input]);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  }, [editingId]);

  const saveTodo = useCallback((id: string, text: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
    setEditingId(null);
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;
  const filters: Filter[] = ['all', 'active', 'completed'];

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 16 }}>
      <h1 style={{ textAlign: 'center', color: '#e11d48', fontWeight: 300, fontSize: 48, margin: '0 0 16px' }}>
        todos
      </h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addTodo(); }}
          placeholder="What needs to be done?"
          aria-label="New todo"
          style={{
            flex: 1, padding: '10px 12px', fontSize: 14,
            border: '1px solid #cbd5e1', borderRadius: 6, outline: 'none',
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '10px 16px', background: '#3b82f6', color: '#fff',
            border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
          }}
        >
          Add
        </button>
      </div>

      <div role="tablist" style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', border: '1px solid',
              borderColor: filter === f ? '#3b82f6' : '#e2e8f0',
              background: filter === f ? '#eff6ff' : '#fff',
              color: filter === f ? '#2563eb' : '#64748b',
              borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 13,
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
        {filteredTodos.length === 0 && (
          <li style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
            {filter === 'all' ? 'No todos yet. Add one above!' : \`No \${filter} todos.\`}
          </li>
        )}
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editingId === todo.id}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
            onEdit={() => setEditingId(todo.id)}
            onSave={(text) => saveTodo(todo.id, text)}
            onCancelEdit={() => setEditingId(null)}
          />
        ))}
      </ul>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 13, color: '#64748b' }}>
        <span>{activeCount} item{activeCount !== 1 ? 's' : ''} left</span>
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 13 }}
          >
            Clear completed ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
}`,
  accessibility: `Checkboxes have descriptive aria-labels including the todo text. The filter buttons use role="tab" and aria-selected. The edit input gets focus automatically and has an aria-label. Delete buttons have aria-labels identifying which todo they remove. Keyboard support: Enter adds a todo, Enter/Escape saves/cancels editing. All interactive elements are natively focusable.`,
  performance: `TodoItem is wrapped in React.memo to prevent re-renders when sibling todos change. All handlers use useCallback to maintain stable references. localStorage sync runs in a useEffect to avoid blocking renders. Filtering is computed inline — for hundreds of items this is negligible; for thousands, useMemo could be added. IDs are generated with a combination of timestamp and random string for uniqueness without UUID overhead.`,
  edgeCases: [
    'Empty or whitespace-only input — trim and reject',
    'Editing a todo to empty string — treat as delete',
    'localStorage is full — catch QuotaExceededError and continue without persistence',
    'localStorage contains corrupted JSON — catch parse error and start fresh',
    'Rapid toggling — functional state updates prevent lost updates',
    'Very long todo text — CSS should truncate or wrap gracefully',
  ],
  testingStrategy: [
    'Unit test: addTodo creates a new item with correct fields',
    'Unit test: toggleTodo flips completed status',
    'Unit test: filtering returns correct subsets',
    'Integration test: type text, press Enter, verify item appears in list',
    'Integration test: double-click to edit, change text, press Enter, verify update',
    'Integration test: filter tabs show correct items',
    'Integration test: clear completed removes only completed items',
    'E2E test: refresh page and verify todos persist from localStorage',
  ],
  improvements: [
    'Add drag-and-drop reordering of todos',
    'Support categories or tags for todos',
    'Add due dates and sort by priority or date',
    'Implement undo/redo for delete and edit operations',
    'Sync todos with a backend API instead of localStorage only',
  ],
  followUpQuestions: [
    'How would you implement undo for the delete action?',
    'What are the trade-offs of useState vs useReducer for this state?',
    'How would you sync this todo list with a remote API and handle conflicts?',
    'How would you add drag-and-drop reordering?',
  ],
};
