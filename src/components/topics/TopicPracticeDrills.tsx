import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Terminal,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { OutputPredictionDrill } from "@/components/common/OutputPredictionDrill";
import { codingProblems } from "@/data/coding";
import type { Topic } from "@/types";
import styles from "./TopicPracticeDrills.module.css";

interface TopicPracticeDrillsProps {
  readonly topic: Topic;
}

// Curated high-yield SDE2 Output Prediction Drills categorized by topic domain
const DRILLS_BY_KEYWORD: Record<
  string,
  {
    title: string;
    description: string;
    code: string;
    expectedOutput: string[];
    explanation: string;
    hint: string;
  }
> = {
  closure: {
    title: "Closure & Loop Variable Scoping (var vs let)",
    description: "Predict the exact timing and logged values of async callbacks inside loops.",
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var:', i), 0);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let:', j), 0);
}`,
    expectedOutput: [
      '"var:" 3',
      '"var:" 3',
      '"var:" 3',
      '"let:" 0',
      '"let:" 1',
      '"let:" 2',
    ],
    explanation:
      "var is function-scoped (or globally scoped here), so all 3 setTimeout callbacks close over the same mutated variable i (which is 3 when the event loop runs the timers). let is block-scoped, creating a fresh binding per loop iteration, preserving j (0, 1, 2).",
    hint: "Think about whether 'var' creates a new binding per iteration or shares one.",
  },
  async: {
    title: "Event Loop: Microtasks (Promise) vs Macrotasks (setTimeout)",
    description: "Trace synchronous code, microtask queue, and macrotask queue execution order.",
    code: `console.log(1);

setTimeout(() => console.log(2), 0);

Promise.resolve()
  .then(() => {
    console.log(3);
    return Promise.resolve(4);
  })
  .then((res) => console.log(res));

console.log(5);`,
    expectedOutput: ["1", "5", "3", "4", "2"],
    explanation:
      "1 and 5 execute synchronously in the Call Stack. setTimeout is queued to the Macrotask (Task) queue. The Promise chain enters the Microtask queue. Before the event loop pulls the next macrotask (2), it completely drains the microtask queue (logging 3 and then 4). Finally, macrotask 2 runs.",
    hint: "Microtasks are always drained immediately after current synchronous execution before any macrotask runs.",
  },
  promise: {
    title: "Promise Chaining & Error Fallthrough",
    description: "Predict execution flow across resolve, catch, and finally.",
    code: `Promise.resolve('start')
  .then((val) => {
    console.log(val);
    throw new Error('boom');
  })
  .catch((err) => {
    console.log('caught:', err.message);
    return 'recovered';
  })
  .then((val) => {
    console.log('after catch:', val);
  });`,
    expectedOutput: [
      '"start"',
      '"caught:" "boom"',
      '"after catch:" "recovered"',
    ],
    explanation:
      ".catch() handles the thrown error and returns a new resolved promise wrapping 'recovered'. The subsequent .then() executes normally with the recovered value.",
    hint: "A .catch() returns a resolved promise unless it explicitly throws or returns a rejected promise.",
  },
  hoisting: {
    title: "Function Declaration vs Var Hoisting",
    description: "Determine variable shadowing and function precedence during compilation.",
    code: `console.log(typeof foo);

var foo = 'hello';

function foo() {
  return 'bar';
}

console.log(typeof foo);`,
    expectedOutput: ['"function"', '"string"'],
    explanation:
      "Function declarations are hoisted before variable declarations. During creation phase, foo is assigned the function. Then at runtime, foo = 'hello' reassigns foo to a string primitive.",
    hint: "Function declarations hoist with their definition; var declarations hoist as undefined.",
  },
  this: {
    title: "This Binding: Arrow Functions vs Object Methods",
    description: "Trace lexical this vs dynamic invocation context.",
    code: `const obj = {
  name: 'frontend',
  regular() {
    return this.name;
  },
  arrow: () => {
    return typeof this;
  },
};

const fn = obj.regular;
console.log(obj.regular());
console.log(obj.arrow());
console.log(typeof fn());`,
    expectedOutput: ['"frontend"', '"object"', '"undefined"'],
    explanation:
      "obj.regular() has dynamic context obj (logs 'frontend'). obj.arrow() has lexical context (window/global in non-strict, or module object). Calling fn() detached loses context, so this is undefined in strict mode.",
    hint: "Arrow functions never have their own 'this'; detached regular functions lose their calling object.",
  },
};

// SDE2 Production Scenario Writing Prompts
const SCENARIOS_BY_CATEGORY: Record<
  string,
  {
    question: string;
    modelAnswer: string;
    rubricPoints: string[];
  }
> = {
  javascript: {
    question:
      "Scenario: You are tasked with migrating an analytics SDK that is causing main-thread jank and dropping frames (high Total Blocking Time / INP). How would you architect this to ensure zero UI freezing?",
    modelAnswer:
      "1. Offload non-DOM parsing and compression to a Dedicated Web Worker using Comlink/postMessage.\n2. Batch analytics events in memory and dispatch using navigator.sendBeacon or requestIdleCallback with a fallback timeout.\n3. Implement a circular buffer with a maximum capacity to prevent unbounded memory leaks if the network is offline.\n4. Use performance.mark() and measure() to profile Long Tasks (>50ms) in the Chrome Performance tab.",
    rubricPoints: [
      "Mentions Web Workers or requestIdleCallback for non-critical work",
      "Mentions navigator.sendBeacon for non-blocking payload delivery",
      "Addresses memory bounds / memory leak prevention",
      "Specifies Core Web Vitals (TBT / INP / Long Tasks)",
    ],
  },
  react: {
    question:
      "Scenario: An infinite-scroll feed in React with 5,000 cards is causing high memory usage and lagging during user interaction. Walk through your optimization strategy.",
    modelAnswer:
      "1. Implement DOM Virtualization (Windowing) using react-window or IntersectionObserver to only render visible nodes + a small overscan buffer (e.g. 20 items instead of 5,000).\n2. Memoize list items using React.memo with custom arePropsEqual if items contain complex children.\n3. Clean up image decodes and detached event listeners when cards leave the DOM.\n4. Defer non-critical UI updates using useTransition or useDeferredValue to keep the input thread responsive (optimizing INP).",
    rubricPoints: [
      "Proposes Virtualized List (rendering only viewport nodes)",
      "Discusses memory cleanup (detached DOM, images, event listeners)",
      "Leverages React Concurrent features (useTransition / useDeferredValue)",
      "Considers image decoding & lazy loading (loading='lazy', decoding='async')",
    ],
  },
  performance: {
    question:
      "Scenario: A critical landing page has an unacceptable Largest Contentful Paint (LCP of 4.8s). How would you systematically diagnose and fix it?",
    modelAnswer:
      "1. Audit the 4 LCP sub-parts: TTFB (Server response), Resource Load Delay, Resource Load Duration, and Element Render Delay.\n2. Preload the LCP hero image in HTML head via <link rel='preload' as='image' fetchpriority='high'>.\n3. Optimize the image: modern formats (AVIF/WebP), responsive srcset, serve via edge CDN with Brotli/gzip compression.\n4. Eliminate render-blocking CSS/JS by inlining critical CSS and adding defer/async to scripts.",
    rubricPoints: [
      "Breaks LCP into TTFB, Load Delay, Load Duration, and Render Delay",
      "Uses fetchpriority='high' and <link rel='preload'>",
      "Compresses and serves responsive images from CDN (AVIF/WebP)",
      "Removes render-blocking critical path resources",
    ],
  },
};

export function TopicPracticeDrills({ topic }: Readonly<TopicPracticeDrillsProps>) {
  const [userScenarioText, setUserScenarioText] = useState("");
  const [showRubric, setShowRubric] = useState(false);

  // 1. Find matching Output Prediction Drill
  const drill = useMemo(() => {
    const text = `${topic.id} ${topic.title} ${topic.tags.join(" ")}`.toLowerCase();
    for (const [key, d] of Object.entries(DRILLS_BY_KEYWORD)) {
      if (text.includes(key)) return d;
    }
    // Fallback drill
    return DRILLS_BY_KEYWORD["closure"]!;
  }, [topic]);

  // 2. Find matching coding problems from 32 core challenges
  const matchedCodingProblems = useMemo(() => {
    return codingProblems
      .filter((p) => {
        const pText = `${p.id} ${p.title} ${p.tags.join(" ")} ${p.category}`.toLowerCase();
        return (
          p.tags.some((t) => topic.tags.includes(t)) ||
          pText.includes(topic.id.toLowerCase()) ||
          topic.title.toLowerCase().split(" ").some((w) => w.length > 3 && pText.includes(w))
        );
      })
      .slice(0, 2);
  }, [topic]);

  // 3. Find matching scenario
  const scenario = useMemo(() => {
    const cat = topic.category.toLowerCase();
    return (
      SCENARIOS_BY_CATEGORY[cat] ||
      SCENARIOS_BY_CATEGORY["javascript"]!
    );
  }, [topic]);

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.bannerIcon}>⚡</div>
        <div className={styles.bannerContent}>
          <h3 className={styles.bannerTitle}>Active Practice & SDE2 Drills</h3>
          <p className={styles.bannerText}>
            Do not just read passive theory. SDE2 interviewers evaluate your ability to predict runtime behaviors, code polyfills from scratch, and architect real-world production solutions.
          </p>
        </div>
      </div>

      {/* Part 1: Output Prediction Drill */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>
            <Terminal size={18} color="#818cf8" />
            1. Output Prediction Drill (Live JS Engine)
          </h4>
          <span className={styles.sectionBadge}>Interactive</span>
        </div>
        <OutputPredictionDrill
          title={drill.title}
          description={drill.description}
          code={drill.code}
          expectedOutput={drill.expectedOutput}
          explanation={drill.explanation}
          hint={drill.hint}
        />
      </section>

      {/* Part 2: Coding Challenges */}
      {matchedCodingProblems.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>
              <Code2 size={18} color="#34d399" />
              2. Polyfill & Coding Challenges for this Topic
            </h4>
            <span className={styles.sectionBadge}>Monaco IDE + Unit Tests</span>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            {matchedCodingProblems.map((p) => (
              <div key={p.id} className={styles.challengeCard}>
                <div className={styles.challengeHeader}>
                  <div>
                    <h5 className={styles.challengeTitle}>{p.title}</h5>
                    <div className={styles.challengeMeta}>
                      <Badge variant="beginner" size="small">
                        {p.difficulty}
                      </Badge>
                      {p.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="tag" size="small">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <p className={styles.challengeDesc}>{p.problem}</p>

                <div className={styles.challengeFooter}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {p.examples.length} test assertions and examples
                  </span>
                  <Link to={`/coding/${p.id}`} className={styles.launchBtn}>
                    <span>Solve in Code Studio</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Part 3: SDE2 Scenario Writing Prompt */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>
            <Sparkles size={18} color="#f59e0b" />
            3. SDE2 Production Scenario (Written Formulation)
          </h4>
          <span className={styles.sectionBadge}>System & Engineering Depth</span>
        </div>

        <div className={styles.scenarioCard}>
          <p className={styles.scenarioQuestion}>{scenario.question}</p>

          <textarea
            className={styles.scenarioTextarea}
            placeholder="Write out your architectural diagnosis, profiling steps, and mitigation strategy..."
            value={userScenarioText}
            onChange={(e) => setUserScenarioText(e.target.value)}
          />

          <button
            type="button"
            className={styles.rubricToggleBtn}
            onClick={() => setShowRubric((prev) => !prev)}
          >
            {showRubric ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{showRubric ? "Hide SDE2 Rubric" : "Reveal SDE2 Assessment Rubric & Model Answer"}</span>
          </button>

          {showRubric && (
            <div className={styles.modelAnswerBox}>
              <div className={styles.modelAnswerTitle}>SDE2 Key Grading Rubric:</div>
              <ul className={styles.rubricList}>
                {scenario.rubricPoints.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>

              <div className={styles.modelAnswerTitle} style={{ marginTop: "1rem" }}>
                Reference Architecture Breakdown:
              </div>
              <p className={styles.modelAnswerText} style={{ whiteSpace: "pre-line" }}>
                {scenario.modelAnswer}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
