import type { MachineCodingProblem } from '../../types';

export const markdownEditorProblem: MachineCodingProblem = {
  id: 'mc-markdown-editor',
  title: 'Markdown Editor',
  difficulty: 'Intermediate',
  category: 'Machine Coding',
  tags: ['markdown', 'editor', 'preview', 'sanitization', 'xss', 'split-view', 'real-time'],
  problemStatement: `Build a Markdown Editor component in React that provides a split-pane interface with a text editor on the left and a live HTML preview on the right. As the user types Markdown syntax in the editor, the preview should update in real-time to show the rendered HTML output.

The editor should support common Markdown features: headings (#), bold (**text**), italic (*text*), links, inline code, code blocks, unordered and ordered lists, and blockquotes. The HTML rendering must be secure against XSS attacks — any user-generated content containing <script> tags or event handlers should be sanitized before rendering.

The component should include a toolbar with buttons for common formatting actions (bold, italic, heading, link, code) that insert the appropriate Markdown syntax at the cursor position. Consider debouncing the markdown-to-HTML conversion for very large documents.`,
  functionalRequirements: [
    'Split-pane layout: editor (left) and preview (right)',
    'Real-time Markdown-to-HTML conversion as the user types',
    'Support headings (h1-h6), bold, italic, strikethrough, links, images',
    'Support inline code, fenced code blocks, unordered lists, ordered lists, blockquotes',
    'Toolbar buttons that insert Markdown syntax at the cursor position',
    'XSS protection: sanitize rendered HTML to remove script tags and event handlers',
    'Line count display in the editor gutter',
    'Support tab key for indentation in the editor',
  ],
  nonFunctionalRequirements: [
    'Debounce conversion for documents over a certain length to avoid lag',
    'Preview scrolls in sync with the editor (approximate scroll synchronization)',
    'Accessible toolbar buttons with aria-labels',
    'Responsive: stack editor and preview vertically on mobile',
  ],
  componentHierarchy: `MarkdownEditor
├── Toolbar
│   ├── FormatButton (bold, italic, heading, link, code, list, quote)
│   └── ViewToggle (edit / preview / split)
├── EditorPane
│   ├── LineNumbers
│   └── TextArea
└── PreviewPane
    └── RenderedHTML`,
  stateDesign: `const [markdown, setMarkdown] = useState(initialContent);
const [html, setHtml] = useState('');
const textareaRef = useRef<HTMLTextAreaElement>(null);
const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');

// Debounced conversion
const debouncedMd = useDebounce(markdown, 150);

useEffect(() => {
  setHtml(sanitize(parseMarkdown(debouncedMd)));
}, [debouncedMd]);`,
  architecture: `The MarkdownEditor maintains the raw Markdown string in state. A custom Markdown parser (or a library like marked/remark) converts the Markdown to HTML. The conversion is debounced for large documents. Before rendering, the HTML is sanitized to remove any XSS vectors (script tags, on* event handlers, javascript: URLs).

The toolbar intercepts clicks and uses the textarea ref to read selectionStart/selectionEnd, wraps the selected text in Markdown syntax, and updates both the state and the cursor position. The preview pane renders sanitized HTML via dangerouslySetInnerHTML. A view toggle allows switching between split, editor-only, and preview-only views.`,
  implementation: `import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function parseMarkdown(md: string): string {
  let html = md;

  html = html.replace(/^######\\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\\s+(.+)$/gm, '<h1>$1</h1>');

  html = html.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>');
  html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');

  html = html.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
  html = html.replace(/\\*(.+?)\\*/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  html = html.replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<img alt="$1" src="$2" style="max-width:100%"/>');
  html = html.replace(/\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<a href="$2" rel="noopener">$1</a>');

  html = html.replace(/^>\\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^[-*]\\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\\/li>)/s, '<ul>$1</ul>');
  html = html.replace(/^\\d+\\.\\s+(.+)$/gm, '<li>$1</li>');

  html = html.replace(/^---$/gm, '<hr/>');
  html = html.replace(/\\n/g, '<br/>');

  return html;
}

function sanitizeHtml(html: string): string {
  let clean = html;
  clean = clean.replace(/<script[^>]*>[\\s\\S]*?<\\/script>/gi, '');
  clean = clean.replace(/<iframe[^>]*>[\\s\\S]*?<\\/iframe>/gi, '');
  clean = clean.replace(/\\son\\w+\\s*=\\s*"[^"]*"/gi, '');
  clean = clean.replace(/\\son\\w+\\s*=\\s*'[^']*'/gi, '');
  clean = clean.replace(/javascript\\s*:/gi, '');
  return clean;
}

const DEFAULT_CONTENT = \`# Hello, Markdown!

This is a **live preview** editor. Type on the left and see results on the right.

## Features

- **Bold** text with \\*\\*double asterisks\\*\\*
- *Italic* text with \\*single asterisks\\*
- ~~Strikethrough~~ with \\~\\~tildes\\~\\~
- \\\`Inline code\\\` with backticks

## Code Block

\\\`\\\`\\\`
function greet(name) {
  return 'Hello, ' + name;
}
\\\`\\\`\\\`

## Links

[Visit React](https://react.dev)

> This is a blockquote

---

*Happy editing!*
\`;

type ViewMode = 'split' | 'edit' | 'preview';

interface ToolbarAction {
  label: string;
  icon: string;
  prefix: string;
  suffix: string;
  placeholder: string;
}

const toolbarActions: ToolbarAction[] = [
  { label: 'Bold', icon: 'B', prefix: '**', suffix: '**', placeholder: 'bold text' },
  { label: 'Italic', icon: 'I', prefix: '*', suffix: '*', placeholder: 'italic text' },
  { label: 'Heading', icon: 'H', prefix: '## ', suffix: '', placeholder: 'heading' },
  { label: 'Link', icon: '🔗', prefix: '[', suffix: '](url)', placeholder: 'link text' },
  { label: 'Code', icon: '<>', prefix: '\`', suffix: '\`', placeholder: 'code' },
  { label: 'Quote', icon: '❝', prefix: '> ', suffix: '', placeholder: 'quote' },
];

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(DEFAULT_CONTENT);
  const [view, setView] = useState<ViewMode>('split');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debouncedMd = useDebounce(markdown, 150);

  const html = useMemo(() => sanitizeHtml(parseMarkdown(debouncedMd)), [debouncedMd]);

  const insertAtCursor = useCallback((action: ToolbarAction) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = markdown.slice(start, end) || action.placeholder;
    const insertion = action.prefix + selected + action.suffix;

    const newMd = markdown.slice(0, start) + insertion + markdown.slice(end);
    setMarkdown(newMd);

    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + action.prefix.length + selected.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    });
  }, [markdown]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newMd = markdown.slice(0, start) + '  ' + markdown.slice(end);
      setMarkdown(newMd);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  }, [markdown]);

  const lineCount = markdown.split('\\n').length;
  const views: ViewMode[] = ['edit', 'split', 'preview'];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {toolbarActions.map((action) => (
            <button
              key={action.label}
              onClick={() => insertAtCursor(action)}
              aria-label={action.label}
              title={action.label}
              style={{
                padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: 4,
                background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                minWidth: 28, color: '#475569',
              }}
            >
              {action.icon}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 2 }}>
          {views.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '4px 10px', border: '1px solid',
                borderColor: view === v ? '#3b82f6' : '#e2e8f0',
                background: view === v ? '#eff6ff' : '#fff',
                color: view === v ? '#2563eb' : '#64748b',
                borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 500,
                textTransform: 'capitalize',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', height: 480 }}>
        {view !== 'preview' && (
          <div style={{ flex: 1, display: 'flex', borderRight: view === 'split' ? '1px solid #e2e8f0' : 'none' }}>
            <div style={{ width: 36, padding: '12px 4px', background: '#f8fafc', textAlign: 'right', fontSize: 12, color: '#94a3b8', lineHeight: '20px', userSelect: 'none', overflow: 'hidden' }}>
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              aria-label="Markdown editor"
              style={{
                flex: 1, padding: 12, border: 'none', outline: 'none', resize: 'none',
                fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
                fontSize: 14, lineHeight: '20px', background: '#fff', color: '#1e293b',
              }}
            />
          </div>
        )}

        {view !== 'edit' && (
          <div
            style={{
              flex: 1, padding: 16, overflowY: 'auto', background: '#fff',
              fontFamily: 'system-ui', fontSize: 14, lineHeight: 1.7, color: '#334155',
            }}
            aria-label="Markdown preview"
            aria-live="polite"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}`,
  accessibility: `The editor textarea has an aria-label. The preview pane has aria-label and aria-live="polite" for content changes. Each toolbar button has an aria-label and title for tooltip. Tab key is intercepted for indentation — users can exit the textarea with other means (e.g., clicking outside). The preview renders semantic HTML (h1-h6, ul, blockquote) which screen readers can navigate.`,
  performance: `Markdown-to-HTML conversion is debounced at 150ms to avoid re-parsing on every keystroke. The result is memoized with useMemo. The sanitization is a string operation (regex-based) which is fast for typical document sizes. For very large documents (10K+ lines), consider a Web Worker for parsing. Line numbers are rendered as simple divs; for thousands of lines, virtualize them.`,
  edgeCases: [
    'Nested Markdown syntax — simple regex parser may not handle complex nesting (e.g., bold inside links)',
    'XSS attempts in user input — sanitizer strips script tags, event handlers, and javascript: URLs',
    'Very large document — debounced parsing prevents UI freeze; consider Web Worker for 100K+ chars',
    'Pasting rich text — textarea receives plain text only, which is desired',
    'Empty document — preview shows nothing, line count shows 1',
    'Special characters in Markdown (e.g., HTML entities) — need proper escaping before parsing',
  ],
  testingStrategy: [
    'Unit test: parseMarkdown converts headings, bold, italic, links correctly',
    'Unit test: sanitizeHtml removes script tags and on* event handlers',
    'Unit test: sanitizeHtml removes javascript: URLs',
    'Integration test: typing in editor updates preview in real-time',
    'Integration test: toolbar buttons insert correct syntax at cursor position',
    'Integration test: Tab key inserts indentation instead of moving focus',
    'Integration test: view toggle switches between edit/split/preview modes',
    'Security test: injecting <script> in editor does not execute in preview',
  ],
  improvements: [
    'Use a proper Markdown parser library (marked, remark) for full spec compliance',
    'Use DOMPurify for production-grade HTML sanitization',
    'Add syntax highlighting in the editor using a library like CodeMirror',
    'Implement synchronized scrolling between editor and preview',
    'Add export functionality (download as .md, copy HTML, print)',
  ],
  followUpQuestions: [
    'Why is regex-based HTML sanitization insufficient for production? What would you use instead?',
    'How would you implement synchronized scrolling between editor and preview?',
    'What are the security implications of dangerouslySetInnerHTML?',
    'How would you move Markdown parsing to a Web Worker for large documents?',
  ],
};
