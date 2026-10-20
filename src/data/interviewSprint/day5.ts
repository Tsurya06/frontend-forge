import type { SprintDayLesson } from "./types";

export const day5Lesson: SprintDayLesson = {
  day: 5,
  id: "architecture-apis-security-a11y",
  title: "Frontend Architecture, APIs, Security & Accessibility",
  tagline: "Feature slicing, AbortController race condition elimination, JWT rotation, XSS/CSRF defenses, and WCAG AA accessibility",
  estimatedMinutes: 85,
  objectives: [
    "Structure enterprise frontends using Feature-Sliced Design instead of flat layer-based folders",
    "Eliminate network race conditions using AbortController and resilient retry interceptors",
    "Secure single-page applications against XSS, CSRF, and prototype pollution attacks",
    "Store auth tokens safely: httpOnly SameSite cookies vs ephemeral in-memory access tokens",
    "Comply with WCAG 2.1 AA standards: roving tabindex, focus restoration, and ARIA live announcements",
  ],
  beginnerOverview:
    "Building real-world applications requires more than just making components look nice. A robust frontend system handles network failures, prevents race conditions, resists malicious security attacks, and is accessible to all users including those using screen readers and keyboards.",
  deepDiveExplanation:
    "Modern frontend architecture relies on vertical feature-based organization where related components, hooks, API services, and types live together inside self-contained domain boundaries. For networking, an API client must implement standard interceptors for token refresh, exponential backoff retries, and request cancellation via `AbortController` to eliminate race conditions when search inputs change rapidly. On the security front, cross-site scripting (XSS) is mitigated by avoiding unsanitized HTML injection, utilizing Content Security Policy (CSP) headers, and storing sensitive JWT refresh tokens in `httpOnly`, `Secure`, `SameSite=Strict` cookies. For accessibility (a11y), full keyboard operability, visible focus rings, explicit form label associations, and semantic ARIA announcements ensure compliance with legal and ethical WCAG AA standards.",
  sections: [
    {
      id: "feature-based-architecture",
      heading: "1. Architecture: Feature-Sliced vs. Layer-Based Organization",
      content:
        "Layer-based organization groups by file type (`/components`, `/hooks`, `/services`, `/types`). When a developer modifies the 'Billing' feature, they must jump across 5 different folders, leading to high cognitive load and loose cohesion.\n\nFeature-based organization (Vertical Slicing) groups code by business domain:\n```\nsrc/\n  features/\n    auth/          -> components/, hooks/, api/, types/\n    billing/       -> components/, hooks/, api/, types/\n    dashboard/     -> components/, hooks/, api/, types/\n  shared/          -> ui/ (Button, Modal), utils/, hooks/\n```\nBenefits: High cohesion, clear ownership boundaries, easy dead-code deletion, and simpler code reviews.",
      keyTakeaway:
        "Group by feature domain first; group by technical file type only within the feature. Shared low-level primitives belong in `shared/`.",
    },
    {
      id: "abort-controller-race-conditions",
      heading: "2. API Layer: Eliminating Race Conditions with AbortController",
      content:
        "When a user types 'Re' then quickly types 'React', two asynchronous network requests are dispatched. If Request 1 ('Re') is delayed by network lag and resolves *after* Request 2 ('React'), the UI displays outdated results for 'Re' despite the input saying 'React'. This is a Network Race Condition.\n\nFix: Cancel the preceding pending request using `AbortController` whenever a new request is initiated or the component unmounts.",
      codeExample: {
        language: "typescript",
        caption: "Canceling pending search requests with AbortController in useEffect",
        code: `useEffect(() => {
  // 1. Create a fresh AbortController for this effect run
  const controller = new AbortController();

  async function searchUsers() {
    try {
      setLoading(true);
      const res = await fetch(\`/api/users?q=\${encodeURIComponent(query)}\`, {
        signal: controller.signal // Bind fetch to abort signal
      });
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      // Don't set error state if request was intentionally aborted
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (query.trim()) {
    searchUsers();
  }

  // 2. Abort running request if query changes or component unmounts!
  return () => {
    controller.abort();
  };
}, [query]);`,
      },
      keyTakeaway:
        "Always pass `controller.signal` to fetch calls and abort in effect cleanup to guarantee only the latest request updates state.",
    },
    {
      id: "auth-security-tokens",
      heading: "3. Security: JWT Storage, XSS & CSRF Defenses",
      content:
        "Where should you store JWTs in a Single Page App?\n\n- ❌ **localStorage**: Extremely vulnerable to Cross-Site Scripting (XSS). Any third-party script or npm supply chain attack can execute `localStorage.getItem('token')` and exfiltrate credentials instantly.\n- ✅ **Recommended (Dual-Token Pattern)**:\n  1. **Access Token (Short-lived, e.g. 10 mins)**: Stored strictly in memory (JavaScript variable / React Context). If XSS occurs, the token expires quickly.\n  2. **Refresh Token (Long-lived, e.g. 7 days)**: Stored in an `httpOnly`, `Secure`, `SameSite=Strict` cookie. JavaScript cannot read `httpOnly` cookies, preventing token theft even in the event of XSS!\n\nWhen the memory access token expires, an API interceptor transparently calls `/auth/refresh` using the cookie to obtain a fresh access token without user disruption.",
      keyTakeaway:
        "Never store long-lived tokens in localStorage. Store refresh tokens in httpOnly cookies and access tokens in memory.",
    },
    {
      id: "xss-csrf-defense-mechanics",
      heading: "4. Defending Against XSS and CSRF",
      content:
        "- **XSS (Cross-Site Scripting)**: Occurs when untrusted user input is rendered into the DOM as executable HTML/JS. React automatically escapes variables in JSX (`<div>{userInput}</div>`), protecting against most injection. The vulnerability arises when developers use `dangerouslySetInnerHTML`. If rendering rich text, always sanitize using `DOMPurify.sanitize(input)`.\n\n- **CSRF (Cross-Site Request Forgery)**: Occurs when an attacker trick's a user's browser into submitting unauthorized requests to a site they are authenticated with. Mitigated by:\n  1. Cookie attribute `SameSite=Lax` or `SameSite=Strict` (prevents cross-origin requests from sending the cookie).\n  2. Custom request headers (e.g. `X-CSRF-Token` or `X-Requested-With`), which browsers forbid cross-origin forms from setting without explicit CORS preflight permission.",
      codeExample: {
        language: "typescript",
        caption: "Safe HTML sanitization with DOMPurify",
        code: `import DOMPurify from "dompurify";

function SafeRichText({ untrustedHtml }: { untrustedHtml: string }) {
  // Sanitize strips malicious <script>, onerror=, and iframe vectors
  const cleanHtml = DOMPurify.sanitize(untrustedHtml);

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}`,
      },
      keyTakeaway:
        "Never bypass React's escaping without DOMPurify sanitization. Use SameSite cookies and custom headers for CSRF protection.",
    },
    {
      id: "accessibility-wcag-patterns",
      heading: "5. Accessibility (A11y) & WCAG AA Compliance",
      content:
        "Accessibility is a legal and engineering imperative. Core patterns for production web applications:\n\n1. **Semantic HTML**: Use `<button>` instead of `<div onClick>`. Native buttons come with built-in Enter/Space keyboard handlers, focus management, and screen reader roles.\n2. **Accessible Forms**: Explicitly link inputs to labels using `id` and `htmlFor`. Link error messages using `aria-describedby` and set `aria-invalid={hasError}`.\n3. **Screen Reader Announcements**: Use `aria-live=\"polite\"` on notification banners or search result count containers so screen readers announce dynamic changes without interrupting speech.\n4. **Focus Rings**: Never set `outline: none` without providing an alternative `:focus-visible` styling.",
      codeExample: {
        language: "tsx",
        caption: "WCAG-compliant Accessible Form Field",
        code: `interface InputProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (val: string) => void;
}

export function AccessibleInput({ id, label, value, error, onChange }: InputProps) {
  const errorId = \`\${id}-error\`;

  return (
    <div className="field-group">
      <label htmlFor={id} className="field-label">{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={error ? "input-error" : "input-normal"}
      />
      {error && (
        <span id={errorId} role="alert" className="error-message">
          {error}
        </span>
      )}
    </div>
  );
}`,
      },
      keyTakeaway:
        "Tie labels to inputs with htmlFor/id; link error descriptions with aria-describedby and role=\"alert\".",
    },
  ],
  misconceptions: [
    {
      myth: "localStorage is safe for auth tokens as long as you encrypt the token string.",
      reality:
        "Any encryption key stored in client-side JavaScript is accessible to any XSS payload running in the same origin. Storing tokens in localStorage remains inherently vulnerable to script extraction.",
    },
    {
      myth: "Adding aria-label to every element improves accessibility.",
      reality:
        "Overusing ARIA often overrides semantic HTML and creates confusing experiences for screen readers ('No ARIA is better than Bad ARIA'). Use semantic HTML first.",
    },
  ],
  realWorldScenario: {
    title: "Typeahead Autocomplete Race Condition Bug",
    problem:
      "A flight booking engine experienced complaints where users searching for 'Tokyo' saw search results for 'New York'. The user had previously typed 'New York', backspaced, and typed 'Tokyo', but the 'New York' API response arrived 1.2 seconds late over high-latency cellular networks, overwriting Tokyo.",
    solution:
      "Refactored the API search hook to instantiate an AbortController. Every new keystroke immediately aborted the prior pending flight search. Added optimistic state clearing and result validation, completely eliminating stale response overrides.",
  },
  questions: [
    {
      id: "d5-q1",
      question: "How do you store JWT tokens securely in a modern Single Page Application (SPA)?",
      difficulty: "hard",
      answer:
        "The recommended enterprise pattern is Dual-Token Rotation: 1) Store the short-lived Access Token (5-15 mins) strictly in JavaScript memory (React Context or a closure variable). Because it is not in localStorage or sessionStorage, it cannot be stolen via simple XSS storage scraping. 2) Store the long-lived Refresh Token (7-30 days) in an `httpOnly`, `Secure`, `SameSite=Strict` HTTP cookie. Because `httpOnly` cookies cannot be accessed by client JavaScript, attackers cannot steal the refresh token. An Axios/fetch response interceptor intercepts 401 Unauthorized responses, transparently posts to `/api/auth/refresh` with the cookie to obtain a new in-memory access token, and retries the original request.",
      explanation:
        "This is the definitive answer top engineering teams look for on authentication security.",
      interviewTrap:
        "Saying 'I store it in localStorage because it's convenient.' That immediately flags security gaps.",
    },
    {
      id: "d5-q2",
      question: "What is an asynchronous network race condition, and how do you resolve it in React?",
      difficulty: "medium",
      answer:
        "A network race condition occurs when multiple asynchronous requests are initiated in sequence (e.g. typing query 'a' then query 'ab'), but the earlier request takes longer to resolve over the network than the later request. If the earlier response arrives last, it overwrites the state with stale data. In React, you resolve it by: 1) Using `AbortController` in the `useEffect` cleanup function to actively cancel the prior HTTP request when dependencies change, or 2) Using a boolean flag (`let isCurrent = true; return () => { isCurrent = false; };`) and ignoring responses if `isCurrent` is false when the promise resolves.",
      explanation:
        "Essential for building any search, autocomplete, or tabbed data-fetching UI.",
      interviewTrap:
        "Only mentioning debouncing. Debouncing reduces request frequency, but does not guarantee responses arrive in chronological order.",
    },
    {
      id: "d5-q3",
      question: "What is the difference between XSS and CSRF? What defenses prevent each?",
      difficulty: "medium",
      answer:
        "XSS (Cross-Site Scripting) is an attack where malicious JavaScript is injected into the victim's browser and executed in the context of the vulnerable origin. Defenses include React JSX auto-escaping, sanitizing HTML with DOMPurify, Content Security Policy (CSP) headers, and storing sensitive tokens outside localStorage.\n\nCSRF (Cross-Site Request Forgery) is an attack where an attacker tricks an authenticated user's browser into submitting unauthorized requests to another site where the user is logged in. Defenses include `SameSite=Lax` or `Strict` cookie attributes, custom anti-CSRF request headers (`X-CSRF-Token`), and verifying Origin/Referer headers on the backend.",
      explanation:
        "Core web security knowledge required for mid to senior frontend roles.",
      interviewTrap:
        "Confusing the two: XSS steals data or executes arbitrary code; CSRF performs unauthorized actions on behalf of a logged-in user.",
    },
    {
      id: "d5-q4",
      question: "What are the key requirements for an accessible modal dialog according to WAI-ARIA?",
      difficulty: "medium",
      answer:
        "1. Markup: Container must have `role=\"dialog\"`, `aria-modal=\"true\"`, and `aria-labelledby=\"modal-title-id\"`.\n2. Focus Trapping: When Tab or Shift+Tab is pressed, focus must cycle exclusively through interactive elements inside the modal, never escaping to the underlying page.\n3. Initial Focus: Focus must be placed on the first interactive element or close button when opened.\n4. Escape Key: Pressing Escape must close the modal.\n5. Focus Restoration: When closed, keyboard focus must be restored back to the trigger button that originally opened the modal.\n6. Background Inert: The background page must be made inert or have `aria-hidden=\"true\"` while open.",
      explanation:
        "Modal accessibility is the standard benchmark test for a11y knowledge in technical interviews.",
      interviewTrap:
        "Forgetting to restore focus to the trigger button when the modal closes.",
    },
  ],
  quiz: [
    {
      id: "d5-qz1",
      question: "Why should an application avoid storing authentication JWT refresh tokens in localStorage?",
      options: [
        {
          id: "a",
          text: "Because any Cross-Site Scripting (XSS) vulnerability allows malicious scripts to read and steal the token.",
          isCorrect: true,
          explanation: "localStorage is accessible to any script running on the origin.",
        },
        {
          id: "b",
          text: "Because localStorage is cleared automatically every 15 minutes by modern browsers.",
          isCorrect: false,
          explanation: "localStorage persists indefinitely until cleared manually.",
        },
        {
          id: "c",
          text: "Because localStorage cannot store strings longer than 16 characters.",
          isCorrect: false,
          explanation: "localStorage typically supports 5-10MB of string data.",
        },
      ],
      explanation: "httpOnly cookies protect against script-based token exfiltration; localStorage provides zero protection against XSS.",
    },
    {
      id: "d5-qz2",
      question: "How does AbortController prevent UI race conditions when fetching search queries?",
      options: [
        {
          id: "a",
          text: "It forces the backend database to execute queries synchronously.",
          isCorrect: false,
          explanation: "AbortController operates in the browser network layer, not the database.",
        },
        {
          id: "b",
          text: "It aborts earlier pending HTTP requests when a new search query is typed, ensuring obsolete responses are discarded.",
          isCorrect: true,
          explanation: "controller.abort() terminates the HTTP stream and rejects the fetch with an AbortError.",
        },
        {
          id: "c",
          text: "It compresses the JSON response with gzip.",
          isCorrect: false,
          explanation: "AbortController does not compress responses.",
        },
      ],
      explanation: "Aborting pending requests ensures that late-arriving stale data cannot overwrite newer search results.",
    },
    {
      id: "d5-qz3",
      question: "Which HTML attribute links an error description message to an input field for assistive screen readers?",
      options: [
        {
          id: "a",
          text: "aria-describedby=\"error-element-id\"",
          isCorrect: true,
          explanation: "aria-describedby references the id of the error text element so screen readers announce it.",
        },
        {
          id: "b",
          text: "alt=\"error message\"",
          isCorrect: false,
          explanation: "alt is for images, not form inputs.",
        },
        {
          id: "c",
          text: "title=\"error message\"",
          isCorrect: false,
          explanation: "title creates a browser tooltip and is not reliably announced by all screen readers.",
        },
      ],
      explanation: "aria-describedby links descriptive or error text directly to form control inputs.",
    },
  ],
  exercise: {
    id: "coding-fetch-with-retries",
    title: "Resilient API Client with Exponential Backoff Retries",
    track: "coding",
    url: "/coding/coding-fetch-with-retries",
    description:
      "Implement a production-grade async API wrapper `fetchWithRetries(fn, retries, delay)` that handles transient network errors with exponential backoff delays, success resolution, and terminal failure rejection.",
    expectedOutcome:
      "Pass all test cases verifying exponential backoff timing, max retry limits, and clean error forwarding on terminal failure.",
    complexityTip:
      "Calculate retry delays using `delay * Math.pow(2, attempt)` and ensure errors are thrown when retries are exhausted.",
    starterSnippet: `// Exercise: Fetch With Exponential Retries
export async function fetchWithRetries(fn, retries = 3, delay = 100) {
  let attempts = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempts++;
      if (attempts > retries) {
        throw err;
      }
      const backoffDelay = delay * Math.pow(2, attempts - 1);
      await new Promise(res => setTimeout(res, backoffDelay));
    }
  }
}`,
    hints: [
      "Ensure you wait for the backoff timeout before re-invoking fn.",
      "Check that attempts strictly does not exceed the retries parameter.",
      "Preserve the original error instance when throwing on final failure.",
    ],
  },
};
