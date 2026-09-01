import type { MachineCodingProblem } from "../../types";

export const pollWidgetProblem: MachineCodingProblem = {
  id: "mc-poll-widget",
  title: "Poll Widget",
  difficulty: "Beginner",
  category: "Machine Coding",
  tags: [
    "poll",
    "voting",
    "percentages",
    "localStorage",
    "accessibility",
    "animation",
  ],
  problemStatement: `Build a Poll Widget component in React that displays a question with multiple options, allows the user to vote for one option, and then shows the results as a percentage bar chart. The widget must prevent duplicate voting by the same user and animate the result bars when they appear.

Before voting, each option is displayed as a selectable button. After the user votes, the UI transitions to a results view showing each option's vote count and percentage, with a colored bar proportional to the percentage. The selected option should be visually highlighted. Voting state should persist in localStorage so refreshing the page retains the user's vote.

This problem tests conditional rendering, percentage calculation, CSS transitions, and state persistence.`,
  functionalRequirements: [
    "Display a poll question with multiple option buttons",
    "Allow the user to select and submit a vote for one option",
    "After voting, display results with vote counts and percentages",
    "Show a horizontal bar for each option proportional to its percentage",
    "Highlight the option the user voted for",
    "Prevent duplicate voting (persist vote in localStorage)",
    "Animate the result bars from 0% to their final width",
  ],
  nonFunctionalRequirements: [
    "Accessible: radio-button semantics for option selection, live region for results announcement",
    "Smooth CSS transitions for bar animations",
    "Handle edge cases: zero total votes, equal percentages that don't sum to 100%",
  ],
  componentHierarchy: `PollWidget
├── PollQuestion
├── VotingView (before vote)
│   └── OptionButton (per option, radio-like)
├── ResultsView (after vote)
│   └── ResultBar (per option)
│       ├── BarFill (animated width)
│       ├── OptionLabel
│       └── VoteCount / Percentage
└── TotalVotes`,
  stateDesign: `interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface PollData {
  id: string;
  question: string;
  options: PollOption[];
}

const [poll, setPoll] = useState<PollData>(initialPoll);
const [userVote, setUserVote] = useState<string | null>(() => {
  return localStorage.getItem(\`poll-\${initialPoll.id}\`);
});
const [selectedOption, setSelectedOption] = useState<string | null>(null);
const [showResults, setShowResults] = useState(userVote !== null);
const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);`,
  architecture: `The PollWidget manages poll data (options with vote counts) and the user's vote. On mount, it checks localStorage for a previously cast vote. If found, it renders the results view directly. The voting view uses radio-like buttons; on submission, the selected option's vote count is incremented, the vote ID is saved to localStorage, and the UI transitions to results. Percentages are calculated as (votes / totalVotes * 100), clamped to one decimal. Bar widths animate from 0% via CSS transitions triggered after initial render with a brief delay.`,
  implementation: `import React, { useState, useEffect, useCallback } from 'react';

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface PollData {
  id: string;
  question: string;
  options: PollOption[];
}

const defaultPoll: PollData = {
  id: 'favorite-framework',
  question: 'What is your favorite frontend framework?',
  options: [
    { id: 'react', label: 'React', votes: 142 },
    { id: 'vue', label: 'Vue', votes: 87 },
    { id: 'angular', label: 'Angular', votes: 53 },
    { id: 'svelte', label: 'Svelte', votes: 64 },
    { id: 'solid', label: 'SolidJS', votes: 31 },
  ],
};

function getPercentage(votes: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((votes / total) * 1000) / 10;
}

export default function PollWidget({ initialPoll = defaultPoll }: { initialPoll?: PollData }) {
  const storageKey = \`poll-\${initialPoll.id}\`;

  const [poll, setPoll] = useState<PollData>(initialPoll);
  const [userVote, setUserVote] = useState<string | null>(() => {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);

  const hasVoted = userVote !== null;
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  useEffect(() => {
    if (hasVoted) {
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    }
  }, [hasVoted]);

  const submitVote = useCallback(() => {
    if (!selectedOption || hasVoted) return;

    setPoll((prev) => ({
      ...prev,
      options: prev.options.map((o) =>
        o.id === selectedOption ? { ...o, votes: o.votes + 1 } : o
      ),
    }));

    setUserVote(selectedOption);
    try { localStorage.setItem(storageKey, selectedOption); } catch { /* ignore */ }
  }, [selectedOption, hasVoted, storageKey]);

  const maxVotes = Math.max(...poll.options.map((o) => o.votes));

  return (
    <div
      style={{
        maxWidth: 420, margin: '0 auto', padding: 24, border: '1px solid #e2e8f0',
        borderRadius: 12, background: '#fff', fontFamily: 'system-ui',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#1e293b' }}>{poll.question}</h3>

      {!hasVoted ? (
        <div role="radiogroup" aria-label={poll.question}>
          {poll.options.map((option) => (
            <label
              key={option.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                marginBottom: 8, border: '2px solid',
                borderColor: selectedOption === option.id ? '#3b82f6' : '#e2e8f0',
                borderRadius: 8, cursor: 'pointer', transition: 'border-color 0.15s',
                background: selectedOption === option.id ? '#eff6ff' : '#fff',
              }}
            >
              <input
                type="radio"
                name={poll.id}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>{option.label}</span>
            </label>
          ))}

          <button
            onClick={submitVote}
            disabled={!selectedOption}
            style={{
              width: '100%', padding: '10px 0', marginTop: 8, border: 'none',
              borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: selectedOption ? 'pointer' : 'not-allowed',
              background: selectedOption ? '#3b82f6' : '#cbd5e1', color: '#fff',
              transition: 'background 0.15s',
            }}
          >
            Vote
          </button>
        </div>
      ) : (
        <div aria-live="polite">
          {poll.options.map((option) => {
            const pct = getPercentage(option.votes, totalVotes);
            const isUserChoice = option.id === userVote;
            const isMax = option.votes === maxVotes;

            return (
              <div key={option.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: isUserChoice ? 600 : 400, color: '#1e293b' }}>
                    {option.label}
                    {isUserChoice && <span style={{ marginLeft: 6, color: '#3b82f6', fontSize: 12 }}>✓ Your vote</span>}
                  </span>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                    {pct}% ({option.votes})
                  </span>
                </div>
                <div
                  style={{
                    height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: animate ? \`\${pct}%\` : '0%',
                      background: isMax ? '#3b82f6' : '#93c5fd',
                      borderRadius: 4,
                      transition: 'width 0.6s ease-out',
                    }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={\`\${option.label}: \${pct}%\`}
                  />
                </div>
              </div>
            );
          })}

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 12, marginBottom: 0 }}>
            {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}`,
  accessibility: `The voting view uses a proper radiogroup with role and <label> elements wrapping each radio input. The results view uses aria-live="polite" to announce changes. Each result bar has role="progressbar" with aria-valuenow and aria-label. The vote button is disabled until an option is selected, preventing accidental empty submissions. Focus management ensures keyboard users can navigate all options.`,
  performance: `Bar animations use CSS transitions triggered by a state flag set after a 50ms delay (ensuring the initial 0% width is painted before the transition starts). Percentage calculations are done inline per render — trivial for typical option counts. localStorage writes are synchronous but fast for small values. The component avoids unnecessary re-renders by keeping state minimal and using functional updates.`,
  edgeCases: [
    "Zero total votes — getPercentage returns 0% for all options",
    "Percentages that don't sum to exactly 100 due to rounding — acceptable for display purposes",
    "localStorage is unavailable (private browsing) — catch and allow voting without persistence",
    "User clears localStorage and refreshes — they can vote again (acceptable tradeoff)",
    "Multiple polls on the same page — each uses a unique storage key based on poll ID",
    "Extremely long option text — should truncate or wrap without breaking layout",
  ],
  testingStrategy: [
    "Unit test: getPercentage calculates correctly including edge case of 0 total",
    "Unit test: voting increments the correct option count",
    "Integration test: selecting an option and clicking Vote shows results",
    "Integration test: results bars animate from 0% to correct width",
    "Integration test: refreshing page after voting shows results directly",
    "Integration test: user's voted option is highlighted with checkmark",
    "Accessibility test: radiogroup semantics and progressbar roles are correct",
  ],
  improvements: [
    "Add real-time vote updates via WebSocket for live poll results",
    "Support multiple poll types: single choice, multiple choice, ranked",
    "Add a countdown timer for time-limited polls",
    "Implement vote verification via unique tokens instead of localStorage",
    "Add share functionality to post poll results on social media",
  ],
  followUpQuestions: [
    "How would you prevent vote manipulation beyond localStorage?",
    "How would you implement real-time vote updates across multiple clients?",
    "How would you handle a poll with 50+ options in the UI?",
    "What rounding strategy would you use to ensure percentages sum to 100%?",
  ],
};
