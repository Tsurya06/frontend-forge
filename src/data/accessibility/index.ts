import type { Topic } from '../../types';

export const accessibilityTopics: Topic[] = [
  {
    id: 'web-accessibility',
    title: 'Web Accessibility (A11y)',
    description: 'Comprehensive guide to building accessible web applications including ARIA roles, semantic HTML, keyboard navigation, focus management, screen readers, accessible forms, color contrast, and WCAG compliance.',
    category: 'Accessibility',
    difficulty: 'Intermediate',
    tags: ['accessibility', 'a11y', 'ARIA', 'semantic-HTML', 'keyboard', 'screen-reader', 'WCAG', 'focus-management'],
    overview: 'Web accessibility ensures that websites and applications are usable by everyone, including people with disabilities. This includes visual impairments (blindness, low vision, color blindness), motor impairments (inability to use a mouse), hearing impairments, and cognitive disabilities. Accessibility is not just a legal requirement (ADA, WCAG) — it improves usability for all users and is a critical aspect of frontend engineering.',
    concepts: [
      'Semantic HTML provides meaning and structure for assistive technologies',
      'ARIA roles, states, and properties enhance accessibility where HTML falls short',
      'Keyboard navigation ensures all functionality is accessible without a mouse',
      'Focus management guides users through dynamic content changes',
      'Screen readers announce content based on semantics and ARIA attributes',
      'Color contrast ensures text is readable for users with visual impairments',
      'WCAG provides testable guidelines at three conformance levels (A, AA, AAA)'
    ],
    codeExamples: [
      {
        title: 'Accessible Button and Form',
        code: `// Accessible button with loading state
function SubmitButton({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      aria-busy={isLoading}
      aria-label={isLoading ? 'Submitting...' : undefined}
    >
      {isLoading ? <Spinner aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

// Accessible form field with error
function FormField({ label, error, id, ...inputProps }: FormFieldProps) {
  const errorId = \`\${id}-error\`;
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && <p id={errorId} role="alert">{error}</p>}
    </div>
  );
}`,
        language: 'typescript',
        explanation: 'Accessible components use proper labeling, ARIA attributes for state, and role="alert" for error announcements.'
      }
    ],
    relatedTopicIds: [],
    questions: [
      {
        id: 'a11y-1',
        question: 'What is semantic HTML and why is it critical for accessibility? Give examples of semantic vs. non-semantic markup.',
        answer: `Semantic HTML uses HTML elements that carry meaning about the structure and content of a web page, rather than just defining visual presentation. Elements like <nav>, <main>, <article>, <header>, <footer>, <button>, <h1>-<h6>, and <form> communicate the purpose and role of content to browsers, search engines, and assistive technologies. This built-in meaning is the foundation of web accessibility — without it, assistive technologies have no reliable way to understand the page structure.

Screen readers depend heavily on semantic HTML to help users navigate and understand web pages. A screen reader user can jump between headings to scan page structure (like a sighted user scans visual headings), navigate by landmarks (<nav>, <main>, <aside>, <footer>), tab through interactive elements (<button>, <a>, <input>), and understand form structure (<label>, <fieldset>, <legend>). When developers use <div> and <span> for everything, screen readers see a flat, meaningless wall of text with no navigable structure. The user must listen to the entire page linearly, which is extremely slow and frustrating.

The critical distinctions between semantic and non-semantic markup are: <button> vs. <div onclick> — a real button is focusable, activatable with Enter/Space, and announced as "button" by screen readers. A div with an onClick handler has none of these capabilities without extensive ARIA attributes and keyboard handling. <a href="..."> vs. <span onclick> — a real link can be opened in new tabs, bookmarked, and is announced as "link" with its destination. <h1>-<h6> vs. styled divs — real headings create a navigable document outline. <nav> vs. <div class="navigation"> — a real nav landmark appears in the screen reader's landmarks list.

The first rule of ARIA is "don't use ARIA if you can use native HTML." Semantic HTML elements come with built-in accessibility: keyboard handling, focus management, screen reader announcements, and appropriate ARIA roles. When you use <button>, you get focusability, Enter/Space activation, and "button" role for free. Recreating this with ARIA on a <div> requires: role="button", tabindex="0", onKeyDown for Enter and Space, and careful focus management. This is error-prone, harder to maintain, and often incomplete. Reserve ARIA for enhancing native semantics or for complex widgets (tabs, accordions, comboboxes) that have no native HTML equivalent.`,
        shortAnswer: 'Semantic HTML uses meaningful elements (nav, main, button, heading) that convey structure and purpose to assistive technologies. Screen readers use semantics for navigation (heading jumps, landmark navigation). Non-semantic markup (divs with onClick) lacks keyboard support, focus management, and screen reader announcements. The first rule of ARIA: use native HTML elements before reaching for ARIA.',
        code: `<!-- NON-SEMANTIC: inaccessible -->
<div class="header">
  <div class="nav">
    <div class="link" onclick="goHome()">Home</div>
    <div class="link" onclick="goAbout()">About</div>
  </div>
</div>
<div class="main">
  <div class="title">Welcome</div>
  <div class="text">Content here...</div>
  <div class="btn" onclick="submit()">Submit</div>
</div>
<div class="footer">Copyright 2024</div>

<!-- SEMANTIC: accessible -->
<header>
  <nav aria-label="Main navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
<main>
  <h1>Welcome</h1>
  <p>Content here...</p>
  <button type="submit">Submit</button>
</main>
<footer>
  <p>Copyright 2024</p>
</footer>

<!-- React: semantic component design -->
function Navigation({ items }: { items: NavItem[] }) {
  return (
    <nav aria-label="Main navigation">
      <ul role="list">
        {items.map(item => (
          <li key={item.href}>
            <a href={item.href} aria-current={item.isActive ? 'page' : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function PageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <header>
        <h1>{title}</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2024 Company</p>
      </footer>
    </>
  );
}`,
        language: 'html',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'Accessibility',
        topicId: 'web-accessibility',
        tags: ['semantic-HTML', 'landmarks', 'screen-reader', 'HTML5', 'structure'],
        commonMistakes: [
          'Using <div> with onClick instead of <button> for interactive elements',
          'Using <div> for page sections instead of <header>, <main>, <nav>, <footer>',
          'Skipping heading levels (h1 → h3) which breaks the document outline',
          'Using <a> without href (or with href="#") for buttons — use <button> instead'
        ],
        followUps: [
          'What is the document outline and why do heading levels matter?',
          'How do screen reader users navigate a page?',
          'What are ARIA landmarks and how do they complement semantic HTML?'
        ],
        interviewTips: [
          'Show clear before/after: div-based → semantic HTML',
          'Mention the first rule of ARIA: use native HTML before ARIA',
          'Explain how screen readers use semantic structure (heading jumps, landmarks)'
        ]
      },
      {
        id: 'a11y-2',
        question: 'What are ARIA roles, states, and properties? When should and shouldn\'t you use ARIA?',
        answer: `ARIA (Accessible Rich Internet Applications) is a set of HTML attributes that provide additional semantics to assistive technologies when native HTML elements alone can't convey the full meaning or state of a widget. ARIA attributes fall into three categories: roles define what an element is (role="dialog", role="tabpanel"), states describe the current condition of an element (aria-expanded="true", aria-selected="false"), and properties provide additional information (aria-label="Close menu", aria-describedby="error-msg").

ARIA roles communicate the purpose of an element to assistive technologies. Landmark roles (banner, navigation, main, complementary, contentinfo) define page regions. Widget roles (button, checkbox, dialog, tab, menuitem) identify interactive elements. Document structure roles (heading, list, listitem, article) define content organization. Live region roles (alert, status, log) announce dynamic content changes. When you assign a role, you're telling assistive technologies to treat the element as that type, regardless of its native HTML type — role="button" on a <div> tells screen readers it's a button (but you must also add keyboard handling).

ARIA states and properties provide dynamic information. aria-expanded indicates whether a collapsible section is open or closed. aria-selected marks the currently selected item in a list. aria-hidden="true" hides an element from assistive technologies (but it remains visible). aria-live="polite" makes a region announce updates without interrupting the user. aria-label provides an accessible name when visible text isn't available. aria-describedby links an element to another element that provides a description. aria-invalid and aria-errormessage communicate form validation state.

The five rules of ARIA use are essential: (1) Don't use ARIA if you can use native HTML — <button> is always better than <div role="button">. (2) Don't change native semantics unnecessarily — don't add role="heading" to a <h2>. (3) All interactive ARIA controls must be keyboard-operable. (4) Don't use role="presentation" or aria-hidden="true" on focusable elements. (5) All interactive elements must have an accessible name. ARIA is powerful but dangerous — incorrect ARIA is worse than no ARIA because it creates false expectations for assistive technology users. A screen reader announcing "button" for an element that isn't keyboard-operable is worse than announcing nothing.`,
        shortAnswer: 'ARIA provides roles (what an element is), states (its current condition), and properties (additional info) for assistive technologies. Use ARIA only when native HTML is insufficient (custom widgets, dynamic content). The first rule: prefer native HTML elements. Incorrect ARIA is worse than no ARIA — it creates false expectations. All ARIA interactive elements must be keyboard-accessible.',
        code: `// ARIA Roles for custom widgets
// Tabs widget (no native HTML equivalent)
function Tabs({ tabs }: { tabs: TabData[] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div role="tablist" aria-label="Settings sections">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={\`tab-\${tab.id}\`}
            aria-selected={index === activeTab}
            aria-controls={\`panel-\${tab.id}\`}
            tabIndex={index === activeTab ? 0 : -1}
            onClick={() => setActiveTab(index)}
            onKeyDown={(e) => handleTabKeyboard(e, index, tabs.length)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={\`panel-\${tab.id}\`}
          aria-labelledby={\`tab-\${tab.id}\`}
          hidden={index !== activeTab}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

// ARIA States for dynamic content
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div>
      <button
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      <div id={contentId} role="region" aria-labelledby={title} hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
}

// ARIA Live Regions for dynamic announcements
function SearchResults({ results, query }: { results: Item[]; query: string }) {
  return (
    <div>
      <p aria-live="polite" aria-atomic="true">
        {results.length} results found for "{query}"
      </p>
      <ul>
        {results.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}

// aria-hidden: hide decorative elements from screen readers
function Rating({ score }: { score: number }) {
  return (
    <div>
      <span aria-hidden="true">{'★'.repeat(score)}{'☆'.repeat(5 - score)}</span>
      <span className="sr-only">{score} out of 5 stars</span>
    </div>
  );
}`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'Accessibility',
        topicId: 'web-accessibility',
        tags: ['ARIA', 'roles', 'states', 'properties', 'widgets', 'live-regions'],
        commonMistakes: [
          'Adding ARIA roles to elements that already have them natively (role="button" on <button>)',
          'Using aria-hidden="true" on elements that are still focusable',
          'Forgetting keyboard handling when using ARIA roles — the role alone doesn\'t add behavior',
          'Using aria-live="assertive" for non-urgent updates, interrupting screen reader users'
        ],
        followUps: [
          'What is the difference between aria-live="polite" and "assertive"?',
          'How do you create an accessible combobox/autocomplete?',
          'What are the WAI-ARIA authoring practices?'
        ],
        interviewTips: [
          'State the five rules of ARIA, especially "prefer native HTML"',
          'Show a complete widget example (tabs or accordion) with proper ARIA',
          'Mention that incorrect ARIA is worse than no ARIA — it misleads users'
        ]
      },
      {
        id: 'a11y-3',
        question: 'How do you implement keyboard navigation in web applications? What are common keyboard interaction patterns?',
        answer: `Keyboard navigation is a fundamental accessibility requirement because many users cannot use a mouse — people with motor disabilities, power users who prefer keyboard efficiency, and screen reader users who navigate entirely by keyboard. All interactive functionality must be operable with keyboard alone. This means every button, link, form control, menu, dialog, and custom widget must be reachable and activatable using standard keyboard patterns.

The basic keyboard interactions are Tab (move focus to the next focusable element), Shift+Tab (move focus to the previous element), Enter (activate buttons and links), Space (activate buttons, toggle checkboxes, select options), and Escape (close dialogs, menus, popups). Native HTML interactive elements (<button>, <a href>, <input>, <select>) are automatically focusable and handle these keyboard events. Custom elements built from <div> and <span> require tabindex="0" to make them focusable and explicit keyboard event handlers for Enter and Space activation.

Complex widgets follow the WAI-ARIA authoring practices patterns. Tabs use arrow keys to move between tabs (left/right for horizontal, up/down for vertical), with only the active tab in the tab order (other tabs use tabindex="-1"). Menus use arrow keys for navigation and Enter/Space for selection. Comboboxes use arrow keys to navigate options and Enter to select. Modal dialogs trap focus — Tab cycles within the dialog without escaping to the page behind it, and Escape closes the dialog. These patterns are standardized so that keyboard users have consistent expectations across applications.

Focus management is closely tied to keyboard navigation. When content changes dynamically (a modal opens, a new page section loads, search results update), focus must be managed deliberately. Opening a dialog should move focus to it. Closing a dialog should return focus to the trigger element. Deleting an item from a list should move focus to the next item. Without focus management, keyboard users become lost — their focus remains on an element that may no longer be relevant or visible. React's useRef and the focusable element APIs (.focus()) are the primary tools for programmatic focus management.`,
        shortAnswer: 'All interactive elements must be keyboard-operable. Tab/Shift+Tab for navigation, Enter/Space for activation, Escape to dismiss. Complex widgets (tabs, menus, dialogs) follow WAI-ARIA patterns using arrow keys and roving tabindex. Focus management moves focus when content changes (dialog open/close, item deletion). Native HTML elements handle keyboard by default; custom widgets need explicit handling.',
        code: `// Keyboard-accessible custom widget: roving tabindex for tabs
function TabList({ tabs, activeIndex, onSelect }: TabListProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        newIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    onSelect(newIndex);
    tabRefs.current[newIndex]?.focus();
  };

  return (
    <div role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={el => { tabRefs.current[index] = el; }}
          role="tab"
          aria-selected={index === activeIndex}
          tabIndex={index === activeIndex ? 0 : -1}
          onClick={() => onSelect(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Focus trap for modal dialogs
function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return; // handled by dialog
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus(); // restore focus on close
    };
  }, [isOpen]);

  return containerRef;
}

// Skip navigation link
function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}
// CSS: .skip-link { position: absolute; left: -9999px; }
// .skip-link:focus { position: static; }`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Coding',
        category: 'Accessibility',
        topicId: 'web-accessibility',
        tags: ['keyboard', 'navigation', 'focus-management', 'focus-trap', 'roving-tabindex'],
        commonMistakes: [
          'Removing the focus outline (outline: none) without providing a visible alternative',
          'Not trapping focus in modal dialogs, allowing keyboard users to tab behind the modal',
          'Forgetting to return focus to the trigger element when a dialog closes',
          'Making non-interactive elements focusable with tabindex="0" without a reason'
        ],
        followUps: [
          'What is the difference between tabindex="0", tabindex="-1", and tabindex="1"?',
          'How do you implement a skip navigation link?',
          'What is roving tabindex and when do you use it?'
        ],
        interviewTips: [
          'Show you know standard keyboard patterns: Tab, Enter, Space, Escape, Arrow keys',
          'Implement focus trapping for dialogs — it\'s a common interview exercise',
          'Mention focus restoration (returning focus to trigger on dialog close)'
        ]
      },
      {
        id: 'a11y-4',
        question: 'How do you build accessible forms? Cover labels, error handling, required fields, and form validation.',
        answer: `Accessible forms are critical because forms are the primary way users interact with web applications — signing up, logging in, searching, checking out, filling profiles. An inaccessible form can completely block a user from completing essential tasks. Every form input must be properly labeled, validation errors must be communicated to assistive technologies, and the form must be navigable and operable by keyboard alone.

Labels are the foundation of form accessibility. Every form input must have an associated label that identifies its purpose. The <label> element with a for/htmlFor attribute matching the input's id creates a programmatic association that screen readers announce when the input is focused. This also makes the label clickable to focus the input — a usability improvement for all users. Placeholder text is NOT a substitute for labels — it disappears when the user starts typing and has insufficient contrast in most browsers. For inputs where a visible label isn't desired (search boxes), use aria-label or aria-labelledby to provide an accessible name.

Error handling must be announced to assistive technologies. When validation fails, each error message should be associated with its field using aria-describedby — the screen reader reads both the label and the error when the field is focused. Set aria-invalid="true" on invalid fields so screen readers announce the invalid state. For form-level error summaries (listing all errors at the top), use role="alert" or aria-live="assertive" to ensure the summary is announced immediately. Move focus to the first error field or to the error summary so users know something went wrong and can easily fix it.

Required fields should be indicated both visually and programmatically. The required attribute on inputs enforces browser-native validation and is announced by screen readers as "required." If you use custom validation instead of browser-native, add aria-required="true". Group related fields (like address fields or radio button sets) using <fieldset> and <legend> — the legend is announced as context for every field within the fieldset, so a screen reader user focusing on the "Street" input in a "Shipping Address" fieldset hears "Shipping Address, Street" rather than just "Street."

Form structure should guide the user through the process. Use <fieldset>/<legend> for logical groups. Provide instructions before the form (not just at the end). Keep tab order logical — form fields should be navigable in the visual order. Use autocomplete attributes (autocomplete="email", autocomplete="street-address") to help browsers and password managers auto-fill correctly. After successful submission, announce the success state to screen readers and either redirect or clearly indicate the form is complete.`,
        shortAnswer: 'Accessible forms require: labels associated via for/htmlFor on every input, aria-describedby linking error messages to fields, aria-invalid on invalid fields, role="alert" for error announcements, required or aria-required for mandatory fields, fieldset/legend for grouped fields, and autocomplete attributes for auto-fill support.',
        code: `// Fully accessible form
function RegistrationForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    if (!formData.get('name')) newErrors.name = 'Name is required';
    if (!formData.get('email')) newErrors.email = 'Email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      errorSummaryRef.current?.focus(); // move focus to error summary
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return <p role="status">Registration successful! Check your email.</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Create Account</h2>

      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div ref={errorSummaryRef} role="alert" tabIndex={-1}>
          <h3>Please fix the following errors:</h3>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a href={\`#\${field}\`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Labeled input with error */}
      <div>
        <label htmlFor="name">
          Full Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          autoComplete="name"
        />
        {errors.name && (
          <p id="name-error" role="alert">{errors.name}</p>
        )}
      </div>

      {/* Email with hint text */}
      <div>
        <label htmlFor="email">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={\`email-hint \${errors.email ? 'email-error' : ''}\`.trim()}
          autoComplete="email"
        />
        <p id="email-hint" className="hint">We'll send a confirmation link</p>
        {errors.email && (
          <p id="email-error" role="alert">{errors.email}</p>
        )}
      </div>

      {/* Grouped fields with fieldset */}
      <fieldset>
        <legend>Notification Preferences</legend>
        <label>
          <input type="checkbox" name="emailNotify" defaultChecked />
          Email notifications
        </label>
        <label>
          <input type="checkbox" name="smsNotify" />
          SMS notifications
        </label>
      </fieldset>

      <button type="submit">Create Account</button>
    </form>
  );
}`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'Accessibility',
        topicId: 'web-accessibility',
        tags: ['forms', 'labels', 'validation', 'aria-invalid', 'fieldset', 'accessible-forms'],
        commonMistakes: [
          'Using placeholder as the only label — it disappears and has poor contrast',
          'Not programmatically associating error messages with their inputs via aria-describedby',
          'Relying only on color to indicate errors — colorblind users can\'t distinguish red from green',
          'Not moving focus to the error summary or first error field on validation failure'
        ],
        followUps: [
          'How do you handle inline validation accessibly (validate on blur)?',
          'What autocomplete values should you use for common form fields?',
          'How do screen readers announce form field errors?'
        ],
        interviewTips: [
          'Show the complete pattern: label + input + error + aria-describedby + aria-invalid',
          'Mention focus management to the error summary on validation failure',
          'Discuss the form structure: fieldset/legend for groups, autocomplete for auto-fill'
        ]
      },
      {
        id: 'a11y-5',
        question: 'What is color contrast and why does it matter? How do you ensure your UI meets WCAG contrast requirements?',
        answer: `Color contrast is the difference in luminance between foreground (text, icons) and background colors. Sufficient contrast ensures that content is readable for users with low vision, color blindness, and those using screens in bright environments. WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios that serve as the standard for accessible design. Insufficient contrast is one of the most common accessibility failures and affects a significant portion of the population — approximately 8% of males have some form of color vision deficiency.

WCAG defines two conformance levels for contrast. Level AA (the standard compliance target) requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18px bold or 24px regular). Level AAA (enhanced) requires 7:1 for normal text and 4.5:1 for large text. UI components and graphical objects that are essential for understanding content need a minimum 3:1 contrast ratio against adjacent colors. These ratios are calculated using the relative luminance formula, comparing the lighter and darker color values on a scale from 0 (black) to 1 (white).

Beyond contrast ratios, accessible color usage follows the principle that color should never be the sole means of conveying information. Error states shouldn't rely only on red text — add an icon, border, or text label. Chart data shouldn't be distinguished only by color — add patterns, labels, or other visual differentiators. Links within text should be distinguishable from surrounding text without relying solely on color — underlines or other visual indicators help colorblind users identify links. Form validation should use icons, text, or border changes in addition to color changes.

Implementing accessible contrast requires integrating it into the design system. Define a color palette with contrast ratios documented for each color combination. Use CSS custom properties (variables) for colors to ensure consistency. Use automated tools (axe-core, Lighthouse) in CI to catch contrast violations. Browser DevTools include contrast checkers in the color picker. Design tools like Figma have contrast-checking plugins. For dark mode, re-verify all contrast ratios — colors that pass in light mode may fail in dark mode and vice versa. Test with real users who have visual impairments when possible.`,
        shortAnswer: 'Color contrast is the luminance difference between foreground and background. WCAG AA requires 4.5:1 for normal text, 3:1 for large text. Never use color as the only indicator (add icons, text, patterns). Use automated tools (axe-core, Lighthouse) to check. Define contrast-verified color palettes in design systems. Test both light and dark modes.',
        code: `/* Design system colors with documented contrast ratios */
:root {
  /* Text colors verified against backgrounds */
  --color-text-primary: #1a1a2e;     /* 15.4:1 on white — AAA */
  --color-text-secondary: #4a4a6a;   /* 7.1:1 on white — AAA */
  --color-text-muted: #6b7280;       /* 4.6:1 on white — AA */

  /* Interactive colors */
  --color-link: #0055cc;             /* 7.2:1 on white — AAA */
  --color-link-visited: #6b21a8;     /* 5.5:1 on white — AA */

  /* Status colors — never used alone */
  --color-error: #dc2626;            /* 4.6:1 on white — AA */
  --color-success: #15803d;          /* 4.5:1 on white — AA */
  --color-warning: #854d0e;          /* 4.8:1 on white — AA */
}

/* Don't rely on color alone for states */
.input-error {
  border-color: var(--color-error);
  border-width: 2px;                 /* thicker border as visual cue */
}

.error-message {
  color: var(--color-error);
}

.error-message::before {
  content: '⚠ ';                    /* icon in addition to color */
}

/* Ensure focus indicators have sufficient contrast */
:focus-visible {
  outline: 3px solid var(--color-link);
  outline-offset: 2px;
}

/* React: accessible status indicator */
function StatusBadge({ status }: { status: 'active' | 'inactive' | 'pending' }) {
  const config = {
    active: { label: 'Active', icon: '●', className: 'status-active' },
    inactive: { label: 'Inactive', icon: '○', className: 'status-inactive' },
    pending: { label: 'Pending', icon: '◐', className: 'status-pending' },
  };

  const { label, icon, className } = config[status];

  return (
    <span className={className}>
      <span aria-hidden="true">{icon}</span> {/* icon + color */}
      {label}                                  {/* text label always visible */}
    </span>
  );
}`,
        language: 'css',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Accessibility',
        topicId: 'web-accessibility',
        tags: ['color-contrast', 'WCAG', 'visual-design', 'color-blindness', 'CSS'],
        commonMistakes: [
          'Using light gray text on white backgrounds — often fails the 4.5:1 minimum',
          'Relying solely on red/green to distinguish error/success states',
          'Not re-checking contrast when implementing dark mode',
          'Assuming designer-approved colors meet contrast requirements without verification'
        ],
        followUps: [
          'What tools do you use to check color contrast?',
          'How do you handle contrast in dark mode?',
          'What is the difference between WCAG AA and AAA compliance?'
        ],
        interviewTips: [
          'Know the numbers: 4.5:1 for normal text, 3:1 for large text (WCAG AA)',
          'Emphasize the "not color alone" principle with examples',
          'Mention tooling: DevTools contrast checker, axe-core, Lighthouse'
        ]
      },
      {
        id: 'a11y-6',
        question: 'How do you build an accessible modal dialog? Cover focus management, keyboard interaction, and screen reader announcements.',
        answer: `Modal dialogs are one of the most complex accessibility challenges in frontend development because they require coordination of focus management, keyboard interaction, screen reader announcements, and visual presentation. An accessible dialog must trap focus within itself, return focus when closed, be announced properly to screen readers, and be dismissible via keyboard. The native HTML <dialog> element handles many of these requirements automatically and should be your first choice.

When a dialog opens, focus must move into the dialog and be trapped there. The user should not be able to Tab out of the dialog to elements behind it. Focus should move to the first focusable element inside the dialog (or the dialog container itself if it has tabindex="-1"). The content behind the dialog should be marked with aria-hidden="true" or inert to prevent screen readers from accessing it. When the dialog closes, focus must return to the element that triggered the dialog — without this, keyboard users become lost on the page.

The dialog must have proper ARIA attributes. role="dialog" (or role="alertdialog" for urgent, action-required dialogs) identifies the element as a dialog. aria-modal="true" tells assistive technologies that the content behind is inert. aria-labelledby should point to the dialog's heading for a descriptive title. aria-describedby can point to the dialog's main content for a longer description. These attributes ensure screen readers announce "dialog" with the title when focus enters, providing context.

Keyboard interaction must follow the WAI-ARIA dialog pattern. Escape closes the dialog. Tab cycles through focusable elements within the dialog without escaping. The dialog should have a visible close button. Clicking outside the dialog (on the backdrop) should close it. The backdrop should prevent interaction with content behind the dialog. The native <dialog> element with .showModal() handles focus trapping, backdrop rendering, and Escape key closing automatically — it's significantly less code and more reliable than custom implementations.`,
        shortAnswer: 'Accessible dialogs require: focus trap (Tab stays inside), focus on open (move to first element), focus restoration on close (return to trigger), role="dialog" with aria-labelledby, aria-modal="true", Escape to close, and aria-hidden on background content. Prefer the native <dialog> element with .showModal() which handles focus trapping and Escape automatically.',
        code: `// Native <dialog> element (recommended approach)
function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      dialog.showModal(); // handles focus trap + Escape + backdrop
    } else {
      dialog.close();
      triggerRef.current?.focus(); // restore focus to trigger
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      onClose={onClose} // fires on Escape key too
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="dialog-content">
        <header>
          <h2 id="dialog-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="close-button"
          >
            ×
          </button>
        </header>
        <div>{children}</div>
      </div>
    </dialog>
  );
}

// Custom dialog with manual focus management (when <dialog> isn't suitable)
function CustomDialog({ isOpen, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialogRef.current?.focus();

      // Inert the rest of the page
      const mainContent = document.getElementById('root');
      mainContent?.setAttribute('aria-hidden', 'true');
      mainContent?.setAttribute('inert', '');

      return () => {
        mainContent?.removeAttribute('aria-hidden');
        mainContent?.removeAttribute('inert');
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-dialog-title"
        tabIndex={-1}
        className="dialog"
      >
        <h2 id="custom-dialog-title">{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </>
  );
}

// Usage
function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsDialogOpen(true)}>
        Open Settings
      </button>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Settings"
      >
        <p>Configure your preferences here.</p>
        <button onClick={() => setIsDialogOpen(false)}>Save</button>
      </Dialog>
    </div>
  );
}`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Coding',
        category: 'Accessibility',
        topicId: 'web-accessibility',
        tags: ['dialog', 'modal', 'focus-trap', 'focus-management', 'ARIA', 'keyboard'],
        commonMistakes: [
          'Not trapping focus inside the dialog — keyboard users can tab to hidden content',
          'Not returning focus to the trigger element when the dialog closes',
          'Forgetting to add aria-hidden to background content for screen readers',
          'Not implementing Escape key to close — essential for keyboard accessibility'
        ],
        followUps: [
          'What is the difference between role="dialog" and role="alertdialog"?',
          'How does the native <dialog> element simplify accessibility?',
          'What is the inert attribute and how does it help with dialogs?'
        ],
        interviewTips: [
          'Recommend the native <dialog> element first — shows modern HTML knowledge',
          'Cover all three focus management steps: trap → manage → restore',
          'Mention aria-modal and aria-hidden for background content'
        ]
      },
      {
        id: 'a11y-7',
        question: 'What is WCAG and what are its four principles? How do you achieve compliance?',
        answer: `WCAG (Web Content Accessibility Guidelines) is the international standard for web accessibility, published by the W3C's Web Accessibility Initiative (WAI). WCAG provides specific, testable criteria for making web content accessible to people with disabilities. It's organized into three conformance levels: A (minimum), AA (standard target for most regulations), and AAA (enhanced). Most accessibility laws and regulations (ADA, Section 508, EN 301 549) reference WCAG 2.1 AA as the compliance standard.

WCAG is built on four foundational principles, known as POUR. **Perceivable** means users must be able to perceive the information presented — it can't be invisible to all their senses. This includes text alternatives for images (alt text), captions for videos, sufficient color contrast, resizable text, and content that doesn't rely solely on color. **Operable** means users must be able to operate the interface — navigation and interaction can't require actions a user can't perform. This includes keyboard accessibility, sufficient time to read and interact, no content that causes seizures, and navigable page structure with headings and landmarks.

**Understandable** means users must be able to understand both the content and how the interface works. This includes readable text (appropriate language level), predictable behavior (no unexpected context changes), and input assistance (labels, error messages, suggestions). **Robust** means content must be robust enough to be interpreted by a variety of user agents, including assistive technologies. This means valid HTML, proper use of ARIA, and compatibility with current and future tools.

Achieving compliance requires a systematic approach. Start with automated testing — tools like axe-core (built into Chrome DevTools), Lighthouse, and jest-axe catch approximately 30-40% of accessibility issues automatically (contrast, missing alt text, missing labels, invalid ARIA). Add manual testing — keyboard navigation testing (can you reach and use everything without a mouse?), screen reader testing (does content make sense when read aloud?), and zoom testing (does the layout work at 200% zoom?). Include users with disabilities in testing for the most authentic feedback.

Integrate accessibility into the development lifecycle rather than treating it as an afterthought. Include axe-core checks in unit tests with jest-axe. Add Lighthouse accessibility audits to CI/CD pipelines. Create accessible component libraries that enforce patterns (every Input requires a label). Train developers on WCAG criteria. Conduct periodic accessibility audits. Document accessibility patterns and requirements in your design system. The goal is to make inaccessible code as unusual as untested code — prevented by tooling, caught in review, and fixed before deployment.`,
        shortAnswer: 'WCAG provides testable accessibility criteria at three levels (A, AA, AAA). Four principles (POUR): Perceivable (content detectable by senses), Operable (navigable and interactive), Understandable (readable and predictable), Robust (compatible with assistive tech). Achieve compliance with automated testing (axe-core, 30-40% of issues), manual testing (keyboard, screen reader), and integrating a11y into CI/CD.',
        code: `// Automated accessibility testing with jest-axe
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('LoginForm has no accessibility violations', async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Cypress accessibility testing
describe('Homepage accessibility', () => {
  it('has no a11y violations', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true },
        'heading-order': { enabled: true },
      },
    });
  });
});

// CI/CD: Lighthouse accessibility audit
// .github/workflows/a11y.yml
// - name: Lighthouse CI
//   run: |
//     npx lhci autorun --config=lighthouserc.json
// lighthouserc.json:
// {
//   "ci": {
//     "assert": {
//       "assertions": {
//         "categories:accessibility": ["error", { "minScore": 0.9 }]
//       }
//     }
//   }
// }

// Accessible component library pattern
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;  // REQUIRED — enforces labeling at the type level
  error?: string;
  hint?: string;
}

function Input({ label, error, hint, id: providedId, ...props }: InputProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const errorId = \`\${id}-error\`;
  const hintId = \`\${id}-hint\`;

  const describedBy = [
    hint ? hintId : null,
    error ? errorId : null,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {hint && <p id={hintId} className="hint">{hint}</p>}
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...props}
      />
      {error && <p id={errorId} role="alert" className="error">{error}</p>}
    </div>
  );
}

// WCAG CHECKLIST (key items for AA compliance):
// Perceivable:
//   ✓ Alt text on all meaningful images
//   ✓ Captions on videos
//   ✓ 4.5:1 contrast for normal text, 3:1 for large text
//   ✓ Content works at 200% zoom
//   ✓ No information conveyed by color alone
//
// Operable:
//   ✓ All functionality available via keyboard
//   ✓ No keyboard traps (except dialogs)
//   ✓ Skip navigation link
//   ✓ Descriptive page titles
//   ✓ Logical heading hierarchy
//
// Understandable:
//   ✓ Language attribute on <html>
//   ✓ Labels on all form inputs
//   ✓ Error messages with suggestions
//   ✓ Consistent navigation
//
// Robust:
//   ✓ Valid HTML
//   ✓ Correct ARIA usage
//   ✓ Name, role, value for custom widgets`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Accessibility',
        topicId: 'web-accessibility',
        tags: ['WCAG', 'compliance', 'POUR', 'axe-core', 'automated-testing', 'audit'],
        commonMistakes: [
          'Relying only on automated testing — it catches only 30-40% of issues',
          'Treating accessibility as a one-time audit instead of an ongoing practice',
          'Aiming for AAA compliance when AA is the practical standard target',
          'Testing only with automated tools and never with a real screen reader'
        ],
        followUps: [
          'What is the difference between WCAG 2.1 and WCAG 2.2?',
          'What are the most common WCAG AA violations found in web applications?',
          'How do you integrate accessibility testing into a CI/CD pipeline?'
        ],
        interviewTips: [
          'Know the four POUR principles and give one example for each',
          'Mention both automated (axe-core) and manual (keyboard, screen reader) testing',
          'Show you understand that AA is the standard compliance target'
        ]
      },
      {
        id: 'a11y-8',
        question: 'How do you make interactive components like tabs, menus, and buttons accessible?',
        answer: `Making interactive components accessible requires combining semantic HTML, ARIA attributes, keyboard interaction patterns, and focus management. Each component type has established patterns defined in the WAI-ARIA Authoring Practices, providing specific guidance on roles, states, keyboard behavior, and focus management. Following these patterns ensures consistency for assistive technology users who rely on predictable interaction models.

Accessible buttons must have a clear accessible name — either from their text content, an aria-label attribute, or aria-labelledby pointing to a naming element. Icon-only buttons are common accessibility failures: a button with only an SVG icon has no accessible name unless you add aria-label="Close" or visually hidden text. Buttons must be implemented with <button> (not <div>), respond to both Enter and Space keys (automatic with <button>), and indicate their state (aria-pressed for toggle buttons, aria-expanded for buttons that control expandable content, disabled for inactive buttons).

Accessible tab interfaces follow a specific pattern. The tab list container has role="tablist". Each tab has role="tab" with aria-selected indicating the active tab. Tab panels have role="tabpanel" with aria-labelledby linking to their corresponding tab. Only the active tab is in the tab order (tabindex="0"); inactive tabs have tabindex="-1". Arrow keys move between tabs (roving tabindex), Enter/Space activate a tab if using manual activation, and Home/End move to the first/last tab. This pattern ensures screen reader users understand the interface structure and keyboard users can navigate efficiently.

Accessible navigation menus use <nav> with a descriptive aria-label ("Main navigation", "User menu"). Dropdown menus use role="menu" with role="menuitem" children. Arrow keys navigate between items, Enter activates, Escape closes. The menu button uses aria-haspopup="true" and aria-expanded to indicate state. Mega menus need careful focus management to be keyboard-navigable without being tedious. For complex menus, consider disclosure widgets (expandable sections) over hover-triggered dropdowns, as hover-based menus are inherently problematic for keyboard and touch users.

The best approach for complex widgets is to use established accessible component libraries (Radix UI, React Aria, Headless UI, Reach UI) that implement WAI-ARIA patterns correctly. These libraries handle the ARIA attributes, keyboard interactions, and focus management automatically, letting you focus on styling and business logic. Building accessible custom widgets from scratch is time-consuming and error-prone — leveraging proven implementations is both more efficient and more reliable.`,
        shortAnswer: 'Accessible interactive components follow WAI-ARIA authoring practices: buttons need accessible names (aria-label for icon buttons), tabs use roving tabindex with arrow key navigation, menus use role="menu" with role="menuitem". Use established libraries (Radix UI, React Aria) for complex widgets. Every component needs semantic HTML, keyboard handling, ARIA states, and focus management.',
        code: `// Accessible icon button
function IconButton({ icon, label, ...props }: {
  icon: React.ReactNode;
  label: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button aria-label={label} {...props}>
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}

// Accessible toggle button
function ToggleButton({ pressed, onToggle, children }: {
  pressed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-pressed={pressed}
      onClick={onToggle}
      className={pressed ? 'toggle-active' : 'toggle-inactive'}
    >
      {children}
    </button>
  );
}

// Accessible dropdown menu
function DropdownMenu({ trigger, items }: {
  trigger: string;
  items: MenuItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const menuItems = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (!menuItems) return;

    const currentIndex = Array.from(menuItems).indexOf(
      document.activeElement as HTMLElement
    );

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        menuItems[Math.min(currentIndex + 1, menuItems.length - 1)]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        menuItems[Math.max(currentIndex - 1, 0)]?.focus();
        break;
      case 'Escape':
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case 'Home':
        e.preventDefault();
        menuItems[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      const firstItem = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
      firstItem?.focus();
    }
  }, [isOpen]);

  return (
    <div className="dropdown">
      <button
        ref={triggerRef}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </button>
      {isOpen && (
        <ul ref={menuRef} role="menu" onKeyDown={handleKeyDown}>
          {items.map(item => (
            <li key={item.id} role="none">
              <button
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// RECOMMENDED: Use established accessible libraries
// import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
// import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// These handle ARIA, keyboard, focus automatically`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Coding',
        category: 'Accessibility',
        topicId: 'web-accessibility',
        tags: ['buttons', 'tabs', 'menus', 'WAI-ARIA', 'interactive', 'Radix-UI'],
        commonMistakes: [
          'Icon-only buttons without aria-label — screen readers announce nothing useful',
          'Menu items that don\'t respond to arrow keys — keyboard users expect standard patterns',
          'Not closing menus on Escape key press',
          'Building custom widgets from scratch instead of using accessible component libraries'
        ],
        followUps: [
          'What accessible component libraries do you recommend?',
          'How do you test keyboard accessibility of custom widgets?',
          'What is the WAI-ARIA Authoring Practices guide?'
        ],
        interviewTips: [
          'Know the keyboard pattern for at least one complex widget (tabs or menus)',
          'Recommend accessible libraries (Radix, React Aria) to show practical wisdom',
          'Demonstrate that you test with keyboard — not just implement ARIA attributes'
        ]
      }
    ]
  }
];
