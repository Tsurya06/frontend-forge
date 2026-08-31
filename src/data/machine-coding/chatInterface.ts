import type { MachineCodingProblem } from '../../types';

export const chatInterfaceProblem: MachineCodingProblem = {
  id: 'mc-chat-interface',
  title: 'Chat Interface',
  difficulty: 'Intermediate',
  category: 'Machine Coding',
  tags: ['chat', 'messages', 'auto-scroll', 'timestamps', 'loading', 'real-time', 'input'],
  problemStatement: `Build a Chat Interface component in React that simulates a messaging application. The interface should have a message list displaying sent and received messages with timestamps, a text input for composing new messages, and a send button. Messages should auto-scroll to the bottom when new ones arrive.

The component should simulate incoming messages (from a "bot" or mock API) after the user sends a message. Each message should display the sender name, message text, and a formatted timestamp. The message input should support multi-line text (Shift+Enter for new line, Enter to send) and show a typing indicator when the bot is "typing" a response.

This problem tests scroll management, list rendering, keyboard event handling, timestamps formatting, and creating a polished interactive UI.`,
  functionalRequirements: [
    'Display a scrollable message list with sender avatar/name, text, and timestamp',
    'Text input at the bottom for composing messages',
    'Send button and Enter key to send messages',
    'Shift+Enter inserts a new line without sending',
    'Auto-scroll to the bottom when new messages arrive',
    'Show a "typing" indicator when the bot is composing a response',
    'Simulate bot responses after a short delay',
    'Format timestamps (e.g., "2:30 PM" for today, "Yesterday 2:30 PM" for older)',
  ],
  nonFunctionalRequirements: [
    'Auto-scroll should not force scroll if the user has scrolled up to read older messages',
    'Efficient rendering — only new messages should cause minimal DOM updates',
    'Accessible: messages have proper semantics, input has label, focus management',
    'Responsive layout that fills available height',
  ],
  componentHierarchy: `ChatInterface
├── ChatHeader (title, status)
├── MessageList (scrollable)
│   ├── MessageGroup (per sender cluster)
│   │   └── Message (per message)
│   │       ├── Avatar
│   │       ├── Bubble (text content)
│   │       └── Timestamp
│   └── TypingIndicator
├── ChatInput
│   ├── TextArea (auto-resizing)
│   └── SendButton`,
  stateDesign: `interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const [messages, setMessages] = useState<ChatMessage[]>([]);
const [input, setInput] = useState('');
const [isTyping, setIsTyping] = useState(false);
const messageListRef = useRef<HTMLDivElement>(null);
const shouldAutoScrollRef = useRef(true);`,
  architecture: `The ChatInterface maintains an array of messages and the current input text. When the user sends a message, it's appended to the array and the input is cleared. A simulated bot response starts after a delay: a typing indicator appears, then the bot message is added.

Auto-scroll uses a ref on the message list container. Before adding a new message, the component checks if the user is at or near the bottom (scrollTop + clientHeight ≈ scrollHeight). If so, it auto-scrolls after the new message renders. If the user has scrolled up to read history, auto-scroll is suppressed. This "sticky scroll" behavior is critical for good chat UX.`,
  implementation: `import React, { useState, useRef, useCallback, useEffect, memo } from 'react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatTime(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (isToday) return time;
  if (isYesterday) return \`Yesterday \${time}\`;
  return \`\${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} \${time}\`;
}

const BOT_RESPONSES = [
  "That's interesting! Tell me more.",
  'I see what you mean. Have you considered trying a different approach?',
  'Great question! Let me think about that for a moment.',
  "Thanks for sharing. Here's what I think...",
  "I'm here to help! What else would you like to know?",
  'That makes sense. Anything else on your mind?',
];

function getBotResponse(): string {
  return BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
}

const MessageBubble = memo(function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4, paddingLeft: isUser ? 0 : 4, paddingRight: isUser ? 4 : 0 }}>
        {isUser ? 'You' : 'Assistant'}
      </div>
      <div
        style={{
          maxWidth: '75%',
          padding: '10px 14px',
          borderRadius: 16,
          borderBottomRightRadius: isUser ? 4 : 16,
          borderBottomLeftRadius: isUser ? 16 : 4,
          background: isUser ? '#3b82f6' : '#f1f5f9',
          color: isUser ? '#fff' : '#1e293b',
          fontSize: 14,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.text}
      </div>
      <time
        dateTime={message.timestamp.toISOString()}
        style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, paddingLeft: isUser ? 0 : 4, paddingRight: isUser ? 4 : 0 }}
      >
        {formatTime(message.timestamp)}
      </time>
    </div>
  );
});

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: '#94a3b8' }}>Assistant</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8, height: 8, borderRadius: '50%', background: '#94a3b8',
              animation: \`chat-bounce 1.4s ease-in-out \${i * 0.2}s infinite\`,
            }}
          />
        ))}
      </div>
      <style>{\`@keyframes chat-bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
      }\`}</style>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', sender: 'bot', text: 'Hello! How can I help you today?', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScrollRef.current && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    shouldAutoScrollRef.current = scrollHeight - scrollTop - clientHeight < 50;
  }, []);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    shouldAutoScrollRef.current = true;

    setIsTyping(true);
    const delay = 1000 + Math.random() * 1500;
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: generateId(), sender: 'bot', text: getBotResponse(), timestamp: new Date() },
      ]);
    }, delay);
  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  }, [input]);

  return (
    <div
      style={{
        maxWidth: 480, margin: '0 auto', height: 600, display: 'flex', flexDirection: 'column',
        border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#fff',
      }}
    >
      <header style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>Chat</h3>
        <span style={{ fontSize: 12, color: isTyping ? '#22c55e' : '#94a3b8' }}>
          {isTyping ? 'typing…' : 'online'}
        </span>
      </header>

      <div
        ref={listRef}
        onScroll={handleScroll}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        style={{ flex: 1, overflowY: 'auto', padding: 16 }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <div style={{ padding: '8px 12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          aria-label="Message input"
          rows={1}
          style={{
            flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8,
            outline: 'none', resize: 'none', fontSize: 14, fontFamily: 'system-ui',
            lineHeight: 1.4, maxHeight: 120, overflow: 'auto',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          aria-label="Send message"
          style={{
            padding: '8px 16px', background: input.trim() ? '#3b82f6' : '#cbd5e1',
            color: '#fff', border: 'none', borderRadius: 8,
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 600, fontSize: 14, transition: 'background 0.15s',
            flexShrink: 0,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}`,
  accessibility: `The message list has role="log" and aria-live="polite" so screen readers announce new messages. Each timestamp uses a <time> element with a machine-readable dateTime attribute. The textarea has an aria-label. The send button has an aria-label and is disabled when input is empty. Message bubbles use semantic structuring. The typing indicator is visual but also indicated by the header status text.`,
  performance: `MessageBubble is memoized with React.memo to avoid re-rendering unchanged messages when new ones are added. Auto-scroll detection (shouldAutoScrollRef) prevents forced scrolling when the user is reading history. The textarea auto-resizes using scrollHeight with a max height cap. Bot response setTimeout is cleaned up implicitly by React's component lifecycle. For very long chat histories, consider virtualization.`,
  edgeCases: [
    'User scrolled up reading history — auto-scroll suppressed until they scroll back to bottom',
    'Very long message — word-break: break-word prevents horizontal overflow',
    'Shift+Enter creates multi-line message — pre-wrap preserves line breaks in bubble',
    'Rapid message sending — each triggers an independent bot response timer',
    'Empty or whitespace-only input — send is disabled and Enter is a no-op',
    'Component unmount during bot response timer — could cause state update; use cleanup in production',
    'Hundreds of messages — performance degrades; add virtualization for production',
  ],
  testingStrategy: [
    'Unit test: formatTime returns correct relative time strings',
    'Unit test: generateId produces unique IDs',
    'Integration test: typing and pressing Enter adds a user message',
    'Integration test: Shift+Enter inserts a newline without sending',
    'Integration test: bot response appears after typing indicator',
    'Integration test: auto-scroll activates on new message when at bottom',
    'Integration test: auto-scroll suppressed when user scrolls up',
    'Accessibility test: message list has role="log" and aria-live',
  ],
  improvements: [
    'Add WebSocket integration for real-time message delivery',
    'Implement message status indicators (sent, delivered, read)',
    'Add file/image attachment support',
    'Implement message reactions (emoji picker on hover)',
    'Add search functionality to find messages in chat history',
    'Persist chat history in localStorage or IndexedDB',
  ],
  followUpQuestions: [
    'How would you implement the "sticky scroll" behavior for a production chat app?',
    'How would you integrate WebSocket for real-time messaging?',
    'How would you handle message ordering with unreliable network (out-of-order delivery)?',
    'How would you implement virtualized rendering for chat histories with 100K+ messages?',
  ],
};
