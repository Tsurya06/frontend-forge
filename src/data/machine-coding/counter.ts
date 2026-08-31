import type { MachineCodingProblem } from '../../types';

export const counterProblem: MachineCodingProblem = {
  id: 'mc-counter',
  title: 'Counter Component',
  difficulty: 'Beginner',
  category: 'Machine Coding',
  tags: ['react', 'state-management', 'hooks', 'useReducer', 'beginner'],

  problemStatement: `Build a Counter component in React with increment, decrement, and reset functionality. While this may seem trivially simple, a well-implemented counter demonstrates understanding of state management patterns, controlled vs uncontrolled components, and proper component API design. Interviewers use this as a warm-up question to assess coding style and attention to detail.

Extend the basic counter with additional features: configurable step size, min/max boundaries, custom increment/decrement amounts, and an undo/redo history. Support both a simple useState approach and a useReducer approach to demonstrate when each pattern is appropriate. The component should handle edge cases like exceeding boundaries and rapid clicking gracefully.`,

  functionalRequirements: [
    'Increment button increases count by step size',
    'Decrement button decreases count by step size',
    'Reset button returns count to initial value',
    'Configurable min and max boundaries',
    'Configurable step size (default 1)',
    'Display current count prominently',
    'Undo/redo functionality for count history',
  ],

  nonFunctionalRequirements: [
    'Buttons disabled at min/max boundaries',
    'Keyboard accessible: Enter/Space on focused buttons',
    'Visual feedback for boundary states',
    'Clean, readable component API',
  ],

  componentHierarchy: `Counter
├── Display (current count)
├── Controls
│   ├── DecrementButton
│   ├── ResetButton
│   └── IncrementButton
└── HistoryControls (optional)
    ├── UndoButton
    └── RedoButton`,

  stateDesign: `// useReducer approach for complex state
interface CounterState {
  count: number;
  history: number[];      // past count values for undo
  future: number[];       // undone values for redo
}

type CounterAction =
  | { type: 'INCREMENT'; step: number }
  | { type: 'DECREMENT'; step: number }
  | { type: 'RESET'; initial: number }
  | { type: 'SET'; value: number }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// The reducer pushes current count to history on each change,
// enabling undo by popping from history and pushing to future.`,

  architecture: `The Counter uses \`useReducer\` to manage count, history, and future arrays in a single state object. This pattern is chosen over multiple \`useState\` calls because the undo/redo operations need to atomically update multiple pieces of state. The reducer enforces min/max boundaries before applying any change.

The component exposes a clean props API with sensible defaults. Buttons are conditionally disabled when the count reaches min/max boundaries. The display component could be extended with animation for count changes. The undo/redo system stores a stack of previous values, with undo popping from history and pushing to future, and redo doing the reverse.`,

  implementation: `import React, { useReducer, useCallback } from 'react';

interface CounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  showHistory?: boolean;
  onChange?: (value: number) => void;
}

interface State {
  count: number;
  history: number[];
  future: number[];
}

type Action =
  | { type: 'INCREMENT'; step: number; max: number }
  | { type: 'DECREMENT'; step: number; min: number }
  | { type: 'RESET'; initial: number }
  | { type: 'UNDO' }
  | { type: 'REDO' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT': {
      const next = Math.min(state.count + action.step, action.max);
      if (next === state.count) return state;
      return { count: next, history: [...state.history, state.count], future: [] };
    }
    case 'DECREMENT': {
      const next = Math.max(state.count - action.step, action.min);
      if (next === state.count) return state;
      return { count: next, history: [...state.history, state.count], future: [] };
    }
    case 'RESET':
      if (state.count === action.initial) return state;
      return { count: action.initial, history: [...state.history, state.count], future: [] };
    case 'UNDO': {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return {
        count: prev,
        history: state.history.slice(0, -1),
        future: [state.count, ...state.future],
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        count: next,
        history: [...state.history, state.count],
        future: state.future.slice(1),
      };
    }
    default:
      return state;
  }
}

export default function Counter({
  initialValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  showHistory = true,
  onChange,
}: CounterProps) {
  const [state, dispatch] = useReducer(reducer, {
    count: Math.max(min, Math.min(max, initialValue)),
    history: [],
    future: [],
  });

  const handleIncrement = useCallback(() => {
    dispatch({ type: 'INCREMENT', step, max });
    onChange?.(Math.min(state.count + step, max));
  }, [step, max, state.count, onChange]);

  const handleDecrement = useCallback(() => {
    dispatch({ type: 'DECREMENT', step, min });
    onChange?.(Math.max(state.count - step, min));
  }, [step, min, state.count, onChange]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET', initial: initialValue });
    onChange?.(initialValue);
  }, [initialValue, onChange]);

  const atMin = state.count <= min;
  const atMax = state.count >= max;

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    padding: '10px 20px', fontSize: 18, fontWeight: 600,
    border: '2px solid #e5e7eb', borderRadius: 8,
    background: disabled ? '#f3f4f6' : '#fff',
    color: disabled ? '#9ca3af' : '#111827',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s',
    minWidth: 48,
  });

  return (
    <div style={{ textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{
        fontSize: 64, fontWeight: 700, margin: '24px 0',
        color: atMin || atMax ? '#ef4444' : '#111827',
        transition: 'color 0.2s',
      }}>
        {state.count}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={handleDecrement} disabled={atMin} style={btnStyle(atMin)} aria-label="Decrement">
          −{step > 1 ? step : ''}
        </button>
        <button onClick={handleReset} style={btnStyle(false)} aria-label="Reset counter">
          Reset
        </button>
        <button onClick={handleIncrement} disabled={atMax} style={btnStyle(atMax)} aria-label="Increment">
          +{step > 1 ? step : ''}
        </button>
      </div>

      {showHistory && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.history.length === 0}
            style={btnStyle(state.history.length === 0)}
            aria-label="Undo"
          >
            ↩ Undo
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={state.future.length === 0}
            style={btnStyle(state.future.length === 0)}
            aria-label="Redo"
          >
            Redo ↪
          </button>
        </div>
      )}

      {min !== -Infinity && max !== Infinity && (
        <div style={{ marginTop: 12, fontSize: 14, color: '#6b7280' }}>
          Range: {min} – {max} | Step: {step}
        </div>
      )}
    </div>
  );
}`,

  accessibility: `All buttons have descriptive \`aria-label\` attributes. Buttons at min/max boundaries are properly \`disabled\`, removing them from the interactive tab order and communicating their state to assistive technologies. The count display uses sufficient font size for readability. Color changes at boundaries are supplemented by the disabled button state, ensuring the boundary information is not conveyed by color alone. Keyboard users can interact with all buttons using Enter or Space.`,

  performance: `The \`useReducer\` pattern returns the same state reference when no change occurs (e.g., incrementing at max), preventing unnecessary re-renders. The undo/redo history grows linearly but is bounded by user interactions, making it practical for real use. \`useCallback\` memoizes event handlers to avoid recreating them on every render. For extremely long sessions, a maximum history length could cap memory usage. The component has zero external dependencies and minimal DOM complexity.`,

  edgeCases: [
    'Count at exactly min or max boundary should disable the correct button',
    'Step size larger than remaining range should clamp to boundary',
    'Undo when history is empty should be a no-op',
    'Reset when already at initial value should not add to history',
    'Floating point step sizes may cause precision issues (e.g., 0.1 + 0.2)',
  ],

  testingStrategy: [
    'Unit test: increment/decrement changes count by step value',
    'Unit test: count respects min and max boundaries',
    'Unit test: reset returns to initial value',
    'Unit test: undo reverts to previous value, redo re-applies',
    'Integration test: buttons are disabled at boundaries',
    'Snapshot test: component renders correctly with all props',
  ],

  improvements: [
    'Add animation on count change (e.g., number flip/slide)',
    'Support keyboard shortcuts (+ and - keys) for quick adjustment',
    'Add long-press to continuously increment/decrement',
    'Persist count to localStorage for page refresh survival',
  ],

  followUpQuestions: [
    'When would you choose useState over useReducer for this component?',
    'How would you implement a long-press auto-increment feature?',
    'How would you share counter state across multiple components without prop drilling?',
    'What are the implications of storing the entire history array in state?',
  ],
};
