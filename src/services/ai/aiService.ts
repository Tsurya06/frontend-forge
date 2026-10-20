import type {
  AiConfig,
  ActiveContext,
  ChatMessage,
  AiStreamHandlers,
} from "./types";

export const OFF_TOPIC_REFUSAL_MESSAGE =
  "⚠️ **Off-Topic Question**\n\nI am strictly dedicated to frontend engineering, code debugging, and the FrontendForge platform. I cannot answer general trivia, political, or off-topic questions.\n\nPlease ask a coding, architecture, or web development question!";

export function isOffTopicQuery(prompt: string): boolean {
  const trimmed = prompt.trim().toLowerCase();

  // If prompt explicitly mentions coding concepts, data structures, or web tech, it is NEVER off-topic
  const codingKeywords = [
    "array", "object", "string", "number", "boolean", "function", "variable",
    "loop", "react", "component", "hook", "state", "props", "typescript",
    "javascript", "html", "css", "dom", "node", "api", "fetch", "promise",
    "async", "await", "closure", "prototype", "class", "algorithm", "data structure",
    "frontend", "backend", "web", "code", "debug", "error", "bug", "syntax",
    "compiler", "bundle", "webpack", "vite", "git", "event", "redux", "next",
    "stack", "queue", "tree", "graph", "map", "set", "json", "rest", "graphql"
  ];
  if (codingKeywords.some((kw) => trimmed.includes(kw))) {
    return false;
  }

  const offTopicPatterns = [
    /\b(who is (the )?(pm|prime minister|president|king|queen|chief minister|governor|mayor))\b/i,
    /\bpm of\b/i,
    /\bprime minister\b/i,
    /\bpresident of\b/i,
    /\bcapital of\b/i,
    /\bwho won (the )?(match|world cup|election|super bowl|game|ipl|oscar)\b/i,
    /\bweather (in|today|tomorrow)\b/i,
    /\bhow to (cook|bake|make) (cake|tea|coffee|pizza|curry|food)\b/i,
    /\btell me a joke (about )?(animals|dogs|cats|marriage)\b/i,
    /\bmovie recommendation\b/i,
    /\bwho is (salman|shahrukh|elon musk|modi|trump|biden|putin|ronaldo|messi)\b/i,
  ];

  for (const pattern of offTopicPatterns) {
    if (pattern.test(trimmed)) {
      return true;
    }
  }

  return false;
}

export function buildSystemPrompt(context: ActiveContext): string {
  const parts: string[] = [
    "You are FrontendForge AI Tutor, an expert senior frontend architect and software engineering mentor.",
    "Your mission is to help developers master frontend engineering, computer science, programming mechanics, and technical architecture.",
    "",
    "=== SCOPE & TECHNICAL EXPERTISE ===",
    "1. FULL TECHNICAL FREEDOM: You answer ANY and ALL questions regarding programming, computer science, software engineering, and web development.",
    "   - This includes: JavaScript, TypeScript, React, HTML/CSS, Web APIs, data structures (arrays, objects, trees, graphs, maps, sets), algorithms, system design, performance, and software architecture.",
    "   - Fundamental computer science and programming questions (e.g. 'what is an array', 'how does async/await work', 'what is a closure', 'how to filter an array') are 100% VALID and CORE to your role. ALWAYS answer them enthusiastically with accurate code snippets, mental models, and best practices, regardless of what page the user is currently on.",
    "",
    "2. TRULY OFF-TOPIC NON-TECHNICAL QUESTIONS:",
    "   - ONLY decline questions that have ZERO relation to coding, technology, or computer science (e.g. national politics, political leaders, sports scores, cooking recipes, celebrity gossip).",
    "   - If a user asks an unrelated non-technical question, politely remind them: 'I specialize in programming and frontend engineering. Please ask a coding, architecture, or web development question!'",
    "",
    "--- USER'S ACTIVE PAGE CONTEXT ---",
    `Page / Topic: ${context.title}`,
  ];

  if (context.subtitle) {
    parts.push(`Subtitle: ${context.subtitle}`);
  }
  if (context.summary) {
    parts.push(`Overview: ${context.summary}`);
  }
  if (context.details) {
    parts.push(`Detailed Syllabus / Specifications:\n${context.details}`);
  }
  if (context.selectedText) {
    parts.push(`User Currently Highlighted Text:\n"${context.selectedText}"`);
  }
  if (context.codeSnippet) {
    parts.push(`User's Current Code in Editor:\n\`\`\`typescript\n${context.codeSnippet}\n\`\`\``);
  }

  parts.push(
    "--- GUIDANCE FOR YOUR RESPONSES ---",
    "1. Be direct, concise, and technically accurate for modern React 19, TypeScript, and web standards. NEVER start responses with introductory greetings, self-introductions (like '👋 FrontendForge Code Tutor', 'I am your mentor', etc.), or lists of what you can do. Directly answer the question or provide code immediately.",
    "2. When explaining complex concepts, use intuitive mental models and contrast them with real-world failure modes.",
    "3. When the user asks for hints or why code failed, guide them toward the bug or missing edge case rather than immediately dumping the entire final solution, unless they explicitly ask for the solution.",
    "4. Use markdown formatting with clear code blocks and bullet points.",
    "5. Do NOT mention other interview platforms or unrelated company brands."
  );

  return parts.join("\n");
}

export async function sendAiMessage(
  userPrompt: string,
  context: ActiveContext,
  history: ChatMessage[],
  config: AiConfig,
  handlers: AiStreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  // 1. Instant deterministic rejection of off-topic queries
  if (isOffTopicQuery(userPrompt)) {
    await streamFallbackResponse(OFF_TOPIC_REFUSAL_MESSAGE, handlers, signal);
    return;
  }

  const systemPrompt = buildSystemPrompt(context);

  const isLocalDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  const hasKeyOrLocalProxy = Boolean(config.apiKey) || Boolean(config.proxyUrl) || isLocalDev;

  if (!hasKeyOrLocalProxy) {
    const fallbackReply = generateSmartContextualResponse(userPrompt, context);
    await streamFallbackResponse(fallbackReply, handlers, signal);
    return;
  }

  try {
    const model = config.model || "nvidia/nemotron-3.5-lightning-30b-a3b";

    // Clean prior history: strip any prior canned greetings or CORS notices so the LLM never mirrors them
    const cleanedHistory = history
      .filter((m) => {
        if (!m.content || m.isStreaming) return false;
        // Strip out prior off-topic refusals from assistant so the LLM doesn't lock into refusing subsequent technical queries
        if (
          m.role === "assistant" &&
          (m.content.includes("strictly dedicated to frontend engineering") ||
            m.content.includes("general trivia, political, or off-topic") ||
            m.content.includes("Off-Topic Question"))
        ) {
          return false;
        }
        return true;
      })
      .map((m) => {
        if (m.role === "assistant") {
          const stripped = m.content
            .replace(/^⚠️[\s\S]*?---\s*\n*/, "")
            .replace(/^👋\s*\*\*FrontendForge Code Tutor\*\*[\s\S]*?\*Tip:[\s\S]*?\*\s*\n*/, "")
            .trim();
          return { ...m, content: stripped || m.content };
        }
        return m;
      });

    // Deduplicate if the last item in history is already the current user message
    const priorHistory =
      cleanedHistory.length > 0 &&
      cleanedHistory[cleanedHistory.length - 1]?.role === "user" &&
      cleanedHistory[cleanedHistory.length - 1]?.content === userPrompt
        ? cleanedHistory.slice(0, -1)
        : cleanedHistory;

    const messages = [
      { role: "system", content: systemPrompt },
      ...priorHistory.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: userPrompt },
    ];

    // Route through Vite proxy locally to eliminate browser CORS blocks
    const endpoint = isLocalDev
      ? "/api/nvidia/v1/chat/completions"
      : (config.proxyUrl || "https://integrate.api.nvidia.com/v1/chat/completions");

    // If on a static production host (GitHub Pages) with no proxy configured,
    // direct browser fetch to NVIDIA will be blocked by browser CORS policy.
    if (!isLocalDev && !config.proxyUrl) {
      const corsNotice = [
        `⚠️ **CORS Notice: Live AI on GitHub Pages requires a free Edge Proxy**`,
        ``,
        `Because **FrontendForge** is hosted on static GitHub Pages (\`tsurya06.github.io\`), direct browser calls to NVIDIA NIM API are blocked by the browser's **CORS policy** (AI providers do not allow direct cross-origin browser requests).`,
        ``,
        `### How to enable live NVIDIA Nemotron streaming:`,
        `Configure \`VITE_AI_PROXY_URL=https://feeq-ai-proxy.pages.dev\` in your \`.env\` environment file.`,
      ].join("\n");

      await streamFallbackResponse(corsNotice, handlers, signal);
      return;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 4096,
        stream: true,
        chat_template_kwargs: { enable_thinking: false },
      }),
      signal,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg = errJson?.error?.message || `NVIDIA API error (HTTP ${response.status})`;
      throw new Error(errMsg);
    }

    if (!response.body) {
      throw new Error("No response body received from NVIDIA API.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data: ")) {
          const dataStr = trimmed.slice(6);
          if (dataStr === "[DONE]") continue;
          try {
            const data = JSON.parse(dataStr);
            const delta = data.choices?.[0]?.delta;
            const chunk = delta?.content || delta?.reasoning_content || "";
            if (chunk) {
              fullText += chunk;
              handlers.onChunk(fullText);
            }
          } catch {
            // Ignore partial chunk
          }
        }
      }
    }

    handlers.onDone(fullText);
  } catch (err: unknown) {
    const isCorsOrNetwork =
      err instanceof TypeError ||
      (err instanceof Error &&
        (err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError") ||
          err.message.includes("CORS")));

    let prefix = "";
    if (isCorsOrNetwork && !isLocalDev) {
      prefix = `⚠️ **Network / CORS Error**: The request was blocked by the browser. If deploying on GitHub Pages, please configure your Cloudflare Worker URL in **AI Settings ⚙️**.\n\n---\n\n`;
    }

    const fallbackReply = prefix + generateSmartContextualResponse(userPrompt, context);
    await streamFallbackResponse(fallbackReply, handlers, signal);
    return;
  }
}

export function generateSmartContextualResponse(
  userPrompt: string,
  context: ActiveContext
): string {
  const lower = userPrompt.toLowerCase().trim();

  // 1. Greetings (hi, hello, hey)
  if (
    lower === "hi" ||
    lower === "hello" ||
    lower === "hey" ||
    lower.startsWith("hi ") ||
    lower.startsWith("hello ")
  ) {
    return [
      `👋 **Hello! I'm your FrontendForge Architecture & Code Tutor.**`,
      ``,
      `I have real-time context of what you're learning on **${context.title}**${
        context.subtitle ? ` (${context.subtitle})` : ""
      }.`,
      ``,
      `### Core Focus of this Module:`,
      `${context.summary}`,
      ``,
      `### Quick actions you can ask me:`,
      `• Click **👶 Explain simply** for an intuitive mental model.`,
      `• Click **💡 Hint** to get guidance on the active challenge.`,
      `• Click **⚡ Trade-offs** to see production architectural compromises.`,
      `*(Powered by NVIDIA Nemotron 3.5 Lightning. Ask any question or use the quick chips below!)*`,
    ].join("\n");
  }

  // 2. Render vs Commit Phases
  if (
    lower.includes("render vs commit") ||
    lower.includes("commit phase") ||
    lower.includes("render phase")
  ) {
    return [
      `⚙️ **React Internals: Render Phase vs. Commit Phase**`,
      ``,
      `React splits every update into two distinct phases to keep the UI fluid and interruptible:`,
      ``,
      `1. **The Render Phase (Pure Calculation / Asynchronous)**:`,
      `   • React invokes component functions, runs diffing reconciliation, and computes what changed in the Virtual DOM (Fiber tree).`,
      `   • **Key Characteristic**: Pure, side-effect-free, and **can be paused, restarted, or aborted** by React's Concurrent Scheduler when higher-priority events (user input) arrive.`,
      `   • *Rule*: Never trigger side-effects (like DOM mutations, network requests, or subscriptions) here.`,
      ``,
      `2. **The Commit Phase (DOM Mutation / Synchronous)**:`,
      `   • React applies computed DOM changes in a single synchronous pass (\`placement\`, \`update\`, \`deletion\`).`,
      `   • Runs layout effects (\`useLayoutEffect\`), updates ref attachments, and schedules passive effects (\`useEffect\`).`,
      `   • **Key Characteristic**: Never interrupted, ensuring the user never sees a partially updated or broken UI.`,
    ].join("\n");
  }

  // 3. Fiber Reconciliation & Work Loop
  if (
    lower.includes("fiber") ||
    lower.includes("reconciliation") ||
    lower.includes("work loop") ||
    lower.includes("diffing")
  ) {
    return [
      `🌲 **React Internals: Fiber Architecture & Reconciliation**`,
      ``,
      `Before React 16, the "Stack Reconciler" walked component trees recursively on the JavaScript call stack, freezing the main thread on heavy renders.`,
      ``,
      `**How the Fiber Reconciler solves this:**`,
      `• **Fibers are Virtual Call Stack Frames**: Each Fiber node represents an element, its state, props, and pointers:`,
      `  - \`child\`: Points to the first immediate child.`,
      `  - \`sibling\`: Points to the adjacent sibling.`,
      `  - \`return\`: Points back to the parent.`,
      `• **Double Buffering (\`current\` vs \`workInProgress\`)**: React creates a clone of the current tree called \`workInProgress\`. All diffing happens on this clone off-screen. Once complete, React swaps one pointer (\`current = workInProgress\`) in the Commit phase!`,
      `• **Time Slicing (\`workLoopConcurrent\`)**: React checks \`shouldYield()\` during rendering. If 5ms elapse, it pauses work, lets the browser paint user input/animations, and resumes where it left off.`,
    ].join("\n");
  }

  // 4. State Batching & Snapshots
  if (
    lower.includes("batching") ||
    lower.includes("snapshot") ||
    lower.includes("stale closure") ||
    lower.includes("automatic batching")
  ) {
    return [
      `📸 **React Internals: State Batching & Snapshots**`,
      ``,
      `### 1. State as a Snapshot:`,
      `Inside a single render pass, state variables are immutable constants captured by JavaScript closures. Calling \`setCount(count + 1)\` three times in one event handler does **not** update \`count\` immediately—each call sees the exact same snapshot value!`,
      `\`\`\`tsx`,
      `// Resolving stale snapshot closures: use functional updates!`,
      `setCount((prev) => prev + 1);`,
      `setCount((prev) => prev + 1);`,
      `\`\`\``,
      ``,
      `### 2. Automatic Batching (React 18 & 19):`,
      `React batches multiple state updates into a single re-render. In React 18+, automatic batching works everywhere: inside \`setTimeout\`, \`fetch\` callbacks, Promises, and native event handlers.`,
      `If you need an immediate synchronous DOM flush, React provides \`flushSync(() => { ... })\`.`,
    ].join("\n");
  }

  // 5. Hooks Internals & Rules of Hooks
  if (
    lower.includes("hook") ||
    lower.includes("rules of hook") ||
    lower.includes("dispatcher") ||
    lower.includes("memoizedstate")
  ) {
    return [
      `🪝 **React Internals: Hook Execution & Why Rules of Hooks Exist**`,
      ``,
      `### How React Tracks Hooks Internally:`,
      `React does **not** identify hooks by name or key. Instead, every Fiber node has a \`memoizedState\` property that points to a **singly-linked list of hook objects**:`,
      `\`\`\``,
      `Fiber.memoizedState -> Hook1 -> Hook2 -> Hook3 -> null`,
      `\`\`\``,
      `Each hook node stores:`,
      `• \`memoizedState\`: The saved value (state, reducer state, or memoized value).`,
      `• \`queue\`: Pending dispatch actions.`,
      `• \`next\`: Pointer to the subsequent hook in the component.`,
      ``,
      `### Why "No Conditionals / Loops":`,
      `On re-renders, React resets a pointer (\`workInProgressHook = fiber.memoizedState\`) and traverses the list in sequential order. If a hook is placed inside an \`if\` statement that skips on one render, **the linked-list indices misalign**, causing \`useState\` to read \`useEffect\`'s state and crashing your app!`,
    ].join("\n");
  }

  // 6. Explain simply / EL5
  if (
    lower.includes("simply") ||
    lower.includes("el5") ||
    lower.includes("mental model") ||
    lower.includes("explain this")
  ) {
    return [
      `🧠 **Intuitive Mental Model for: ${context.title}**`,
      ``,
      `${context.summary}`,
      ``,
      `### Key Takeaway:`,
      `${
        context.details ||
        "Break down the problem into small, predictable steps. Verify each assumption before applying optimizations."
      }`,
      ``,
      `Want to dive deeper into any specific sub-topic or inspect the code? Just ask!`,
    ].join("\n");
  }

  // 7. Hints
  if (lower.includes("hint") || lower.includes("clue") || lower.includes("stuck")) {
    return [
      `💡 **Guiding Hint for: ${context.title}**`,
      ``,
      `1. **Clarify Inputs & Outputs**: Check what types and edge cases are expected before writing logic.`,
      `2. **Avoid Common Traps**: Make sure you aren't mutating state directly or relying on stale closures.`,
      `3. **Step-by-Step Approach**: Build the basic working path first, then add cleanup and edge-case handling.`,
      ``,
      context.codeSnippet
        ? `Your current workspace has active code. Check if the function returns early on empty inputs!`
        : `Check the exercise specifications in the lesson card below!`,
    ].join("\n");
  }

  // 8. Trade-offs
  if (
    lower.includes("trade-off") ||
    lower.includes("tradeoff") ||
    lower.includes("pros and cons")
  ) {
    return [
      `⚡ **Production Architectural Trade-offs for: ${context.title}**`,
      ``,
      `• **Performance vs. Complexity**: Aggressive memoization or caching introduces memory overhead and invalidation bugs. Only optimize when profiler data shows real bottlenecks.`,
      `• **Developer Ergonomics vs. Strict Contracts**: Looser abstractions allow fast iteration but accumulate technical debt. Strict types and clear component boundaries scale better across teams.`,
      `• **Client vs. Server Responsibility**: Moving work to the client saves server resources but increases bundle size and INP (Interaction to Next Paint).`,
    ].join("\n");
  }

  // 9. Edge cases
  if (
    lower.includes("edge case") ||
    lower.includes("test case") ||
    lower.includes("pitfall")
  ) {
    return [
      `🧪 **Critical Edge Cases to Test for: ${context.title}**`,
      ``,
      `• **Empty / Null / Undefined Inputs**: Verify components and functions render graceful empty states without throwing errors.`,
      `• **Rapid Sequential Invocations**: Watch out for race conditions and asynchronous out-of-order responses.`,
      `• **Component Unmounting**: Ensure intervals, event listeners, and pending fetch requests are properly cleaned up with \`AbortController\`.`,
      `• **Accessibility & Keyboard Navigation**: Verify Tab, Enter, Escape, and arrow keys behave properly.`,
    ].join("\n");
  }

  // 10. General Frontend Question / Contextual Guidance
  return [
    `💡 **Topic Overview: ${context.title}**`,
    ``,
    `${context.summary}`,
    ``,
    context.details ? `${context.details}\n` : "",
    `Ask any specific question about React 19, TypeScript, algorithms, or architecture!`,
  ].filter(Boolean).join("\n");
}

async function streamFallbackResponse(
  text: string,
  handlers: AiStreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  const words = text.split(" ");
  let accumulated = "";
  for (let i = 0; i < words.length; i++) {
    if (signal?.aborted) return;
    accumulated += (i > 0 ? " " : "") + words[i];
    handlers.onChunk(accumulated);
    await new Promise((r) => setTimeout(r, 16));
  }
  handlers.onDone(accumulated);
}

