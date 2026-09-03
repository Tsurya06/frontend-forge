import { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/common/Modal";
import {
  Zap,
  RotateCcw,
  StepBack,
  Play,
  Pause,
  StepForward,
  BookOpen,
  Terminal,
  Lightbulb,
  Code2,
  Layers,
} from "lucide-react";
import {
  VISUALIZER_PRESETS,
  traceCustomCode,
  type VisualizerPreset,
  type ExecutionStep,
} from "@/utils/runtimeVisualizerEngine";
import { CodePanel } from "@/components/visualizer/CodePanel";
import { CallStackView } from "@/components/visualizer/CallStackView";
import { MemoryHeapView } from "@/components/visualizer/MemoryHeapView";
import { EventLoopRotor } from "@/components/visualizer/EventLoopRotor";
import { TaskQueuesView } from "@/components/visualizer/TaskQueuesView";
import { ConsoleOutputView } from "@/components/visualizer/ConsoleOutputView";
import styles from "./Visualizer.module.css";

interface InfoModalState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
}

export default function Visualizer() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("event-loop");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [highlightHeapAddr, setHighlightHeapAddr] = useState<string | undefined>(
    undefined,
  );

  // Left dock tab: "console" vs "takeaway"
  const [leftDockTab, setLeftDockTab] = useState<"console" | "takeaway">("console");

  // Customizable Resizable Layout State
  const [splitX, setSplitX] = useState<number>(() => {
    const saved = localStorage.getItem("feeq-viz-split-x");
    if (saved) {
      const num = parseFloat(saved);
      if (!isNaN(num) && num >= 25 && num <= 75) return num;
    }
    return 48; // default 48% left, 52% right
  });

  const [splitY, setSplitY] = useState<number>(() => {
    const saved = localStorage.getItem("feeq-viz-split-y");
    if (saved) {
      const num = parseFloat(saved);
      if (!isNaN(num) && num >= 25 && num <= 80) return num;
    }
    return 58; // default 58% code, 42% dock
  });

  const [isDraggingX, setIsDraggingX] = useState<boolean>(false);
  const [isDraggingY, setIsDraggingY] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<"code" | "runtime" | "all">("code");
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth > 960 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 960);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const leftPaneRef = useRef<HTMLDivElement>(null);

  // Vertical Splitter drag listeners
  useEffect(() => {
    if (!isDraggingX) return;

    const handleMove = (clientX: number) => {
      if (!workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();
      const rawPercent = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(Math.max(rawPercent, 25), 75);
      setSplitX(clamped);
      localStorage.setItem("feeq-viz-split-x", clamped.toFixed(1));
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        handleMove(touch.clientX);
      }
    };

    const handleEnd = () => {
      setIsDraggingX(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDraggingX]);

  // Horizontal Splitter drag listeners
  useEffect(() => {
    if (!isDraggingY) return;

    const handleMove = (clientY: number) => {
      if (!leftPaneRef.current) return;
      const rect = leftPaneRef.current.getBoundingClientRect();
      const rawPercent = ((clientY - rect.top) / rect.height) * 100;
      const clamped = Math.min(Math.max(rawPercent, 25), 80);
      setSplitY(clamped);
      localStorage.setItem("feeq-viz-split-y", clamped.toFixed(1));
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        handleMove(touch.clientY);
      }
    };

    const handleEnd = () => {
      setIsDraggingY(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDraggingY]);

  const initialPreset =
    VISUALIZER_PRESETS.find((p) => p.id === "event-loop") ??
    VISUALIZER_PRESETS[0]!;

  // Live Editable Code & Custom Steps
  const [code, setCode] = useState<string>(initialPreset.code);
  const [customSteps, setCustomSteps] = useState<ExecutionStep[] | null>(null);

  // Info modal state
  const [infoModal, setInfoModal] = useState<InfoModalState>({
    isOpen: false,
    title: "",
    content: null,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePreset: VisualizerPreset =
    VISUALIZER_PRESETS.find((p) => p.id === selectedPresetId) ??
    VISUALIZER_PRESETS[0]!;

  // If user edited code, use custom traced steps; otherwise use preset steps
  const activeSteps: ExecutionStep[] = customSteps ?? activePreset.steps;

  const totalSteps = activeSteps.length;
  const currentStep: ExecutionStep =
    activeSteps[currentStepIndex] ?? activeSteps[0]!;

  // Handle preset selection
  const handlePresetSelect = (id: string) => {
    setIsPlaying(false);
    setSelectedPresetId(id);
    const p = VISUALIZER_PRESETS.find((preset) => preset.id === id);
    if (p) {
      setCode(p.code);
      setCustomSteps(null); // Reset to preset's curated steps
    }
    setCurrentStepIndex(0);
    setHighlightHeapAddr(undefined);
  };

  // Live code edit handler: instantly traces without requiring any extra button
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsPlaying(false);
    const generated = traceCustomCode(newCode);
    setCustomSteps(generated);
    setCurrentStepIndex(0);
    setHighlightHeapAddr(undefined);
  };

  // Step controls
  const handleStepForward = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setHighlightHeapAddr(undefined);
  };

  const togglePlay = () => {
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  // Auto-play timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const intervalMs = Math.round(1800 / speed);

    timerRef.current = setTimeout(() => {
      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, totalSteps, speed]);

  // Sync highlighted address from step
  useEffect(() => {
    if (currentStep?.highlightAddress) {
      setHighlightHeapAddr(currentStep.highlightAddress);
    }
  }, [currentStep]);

  // Modal open helpers
  const openInfo = (title: string, content: React.ReactNode) => {
    setInfoModal({
      isOpen: true,
      title,
      content,
    });
  };

  return (
    <div className={styles.workbenchViewport}>
      <div className={styles.workbenchArea}>
        {/* ── 1. Fluid Top Toolbar Bar ── */}
        <header className={styles.workbenchTopBar}>
          <div className={styles.topBarMainRow}>
            <div className={styles.barLeftGroup}>
              <div className={styles.brandTitle}>
                <Zap size={16} className={styles.titleIcon} />
                <span className={styles.titleText}>JS Visualizer</span>
              </div>

              <div className={styles.presetDropdownWrap}>
                <select
                  className={styles.presetSelect}
                  value={customSteps ? "custom" : selectedPresetId}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      handleCodeChange(code);
                    } else {
                      handlePresetSelect(e.target.value);
                    }
                  }}
                  aria-label="Select Runtime Preset"
                >
                  {VISUALIZER_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                  {customSteps && <option value="custom">My Custom Code</option>}
                </select>
              </div>
            </div>

            {/* Right: Guide Button */}
            <div className={styles.barRightGroup}>
              {customSteps && (
                <span className={styles.customCodeTag}>Live Code</span>
              )}
              <button
                type="button"
                className={styles.guideHeaderBtn}
                onClick={() =>
                  openInfo(
                    "📖 How to Use the JavaScript Runtime Visualizer",
                    <div className={styles.modalContent}>
                      <p>
                        Welcome to the <strong>FrontendForge JavaScript Runtime &amp; Event Loop Visualizer</strong>!
                        This simulator gives you an X-ray view into how JavaScript executes code in the browser and Node.js.
                      </p>
                      <h4>🎮 How to Interact:</h4>
                      <ul>
                        <li><strong>✏️ Live Code Editor:</strong> The code panel is directly editable! Edit any line or paste your own code — then simply click <strong>Play</strong> or <strong>Next</strong>.</li>
                        <li><strong>▶ Moving Arrow:</strong> Watch the animated arrow and glowing strip follow execution line by line in the code gutter.</li>
                        <li><strong>Play / Pause:</strong> Starts automatic continuous execution at 0.5x, 1x, or 2x speeds.</li>
                        <li><strong>Prev / Next:</strong> Step through line-by-line to observe state transitions at your own pace.</li>
                        <li><strong>Slider Track:</strong> Scrub to any point in the timeline immediately.</li>
                        <li><strong>Info Buttons:</strong> Click the small icon on any panel to inspect that engine component's theory.</li>
                      </ul>
                      <h4>🧱 What You Are Watching:</h4>
                      <ul>
                        <li><strong>Call Stack (LIFO):</strong> Where functions execute synchronously.</li>
                        <li><strong>Memory Heap:</strong> Hex addresses (e.g. <code>0x10A</code>) where objects and arrays live.</li>
                        <li><strong>Event Loop Coordinator:</strong> The engine that monitors Call Stack emptiness and coordinates task execution.</li>
                        <li><strong>Microtask Queue (VIP):</strong> High-priority callbacks (Promises, <code>queueMicrotask</code>) that drain before any Macrotask.</li>
                        <li><strong>Macrotask Queue:</strong> Callback timers (<code>setTimeout</code>, <code>setInterval</code>) and I/O tasks.</li>
                      </ul>
                    </div>
                  )
                }
              >
                <BookOpen size={13} />
                <span>Guide</span>
              </button>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className={styles.barCenterControls}>
            <div className={styles.playButtonsGroup}>
              <button
                type="button"
                className={styles.controlIconBtn}
                onClick={handleReset}
                title="Reset to beginning"
                aria-label="Reset to beginning"
              >
                <RotateCcw size={12} />
              </button>
              <button
                type="button"
                className={styles.controlIconBtn}
                onClick={handleStepBackward}
                disabled={currentStepIndex === 0}
                title="Previous step"
                aria-label="Previous step"
              >
                <StepBack size={12} />
              </button>
              <button
                type="button"
                className={styles.playActionBtn}
                onClick={togglePlay}
                title={isPlaying ? "Pause execution" : "Play automatically"}
              >
                {isPlaying ? (
                  <>
                    <Pause size={12} />
                    <span>Pause</span>
                  </>
                ) : currentStepIndex >= totalSteps - 1 ? (
                  <>
                    <RotateCcw size={12} />
                    <span>Replay</span>
                  </>
                ) : (
                  <>
                    <Play size={12} />
                    <span>Play</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className={styles.controlIconBtn}
                onClick={handleStepForward}
                disabled={currentStepIndex >= totalSteps - 1}
                title="Next step"
                aria-label="Next step"
              >
                <StepForward size={12} />
              </button>
            </div>

            {/* Step Track Slider */}
            <div className={styles.headerSliderGroup}>
              <span className={styles.stepCounterText}>
                Step {currentStepIndex + 1}/{totalSteps}
              </span>
              <input
                type="range"
                min={0}
                max={Math.max(0, totalSteps - 1)}
                value={currentStepIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentStepIndex(Number(e.target.value));
                }}
                className={styles.stepSlider}
                aria-label="Execution step slider"
              />
            </div>

            {/* Speed Selector */}
            <div className={styles.speedPills}>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`${styles.speedPill} ${
                    speed === s ? styles.speedPillActive : ""
                  }`}
                  onClick={() => setSpeed(s)}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ── 2. Slim Integrated Explanation Status Bar ── */}
        <div className={styles.slimExplanationBar}>
          <div className={styles.explanationBadges}>
            <span className={styles.stepBadge}>
              Step {currentStepIndex + 1}/{totalSteps}
            </span>
            <span className={styles.lineBadge}>
              Line {currentStep?.line ?? 1}
            </span>
            <span className={styles.phaseBadge}>
              {(currentStep?.phase ?? "executing").toUpperCase()}
            </span>
          </div>
          <p className={styles.explanationMessage}>
            {currentStep?.explanation ?? "Ready to execute"}
          </p>
        </div>

        {/* Mobile View Switcher (< 960px) */}
        <div
          className={styles.mobileViewSwitcher}
          role="tablist"
          aria-label="Visualizer mobile view modes"
        >
          <button
            type="button"
            className={`${styles.mobileViewBtn} ${
              mobileView === "code" ? styles.mobileViewBtnActive : ""
            }`}
            onClick={() => setMobileView("code")}
            role="tab"
            aria-selected={mobileView === "code"}
          >
            <Code2 size={13} />
            <span>Code &amp; Console</span>
          </button>
          <button
            type="button"
            className={`${styles.mobileViewBtn} ${
              mobileView === "runtime" ? styles.mobileViewBtnActive : ""
            }`}
            onClick={() => setMobileView("runtime")}
            role="tab"
            aria-selected={mobileView === "runtime"}
          >
            <Zap size={13} />
            <span>Runtime Engine</span>
          </button>
          <button
            type="button"
            className={`${styles.mobileViewBtn} ${
              mobileView === "all" ? styles.mobileViewBtnActive : ""
            }`}
            onClick={() => setMobileView("all")}
            role="tab"
            aria-selected={mobileView === "all"}
          >
            <Layers size={13} />
            <span>All-in-One (Scroll)</span>
          </button>
        </div>

        {/* ── Main Split Workspace ── */}
        <div
          ref={workspaceRef}
          className={`${styles.workspaceSplit} ${
            isDraggingX ? styles.isDraggingWorkspace : ""
          } ${mobileView === "all" ? styles.workspaceSplitAllMode : ""}`}
          style={isDesktop ? { gridTemplateColumns: `${splitX}% 8px 1fr` } : undefined}
        >
          {/* Left Pane: Code Editor + Tabbed Bottom Dock */}
          <section
            ref={leftPaneRef}
            className={`${styles.leftPane} ${
              !isDesktop && mobileView === "runtime" ? styles.hiddenOnMobileView : ""
            }`}
          >
            {/* Code Editor Panel */}
            <div
              className={styles.codeWrapper}
              style={{ flex: `0 0 calc(${splitY}% - 5px)` }}
            >
              <CodePanel
                code={code}
                activeLine={currentStep?.line ?? 1}
                title={customSteps ? "Custom JavaScript (Live)" : activePreset.title}
                onCodeChange={handleCodeChange}
              />
            </div>

            {/* Horizontal Splitter Drag Handle */}
            <div
              className={`${styles.horizontalSplitter} ${
                isDraggingY ? styles.splitterActive : ""
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDraggingY(true);
              }}
              onTouchStart={() => setIsDraggingY(true)}
              title="Drag up/down to resize Editor and Console"
              role="separator"
              aria-orientation="horizontal"
            >
              <div className={styles.horizontalGrip} />
            </div>

            {/* Bottom Tabbed Dock: Console vs Takeaway */}
            <div
              className={styles.bottomDock}
              style={{ flex: `0 0 calc(${100 - splitY}% - 5px)` }}
            >
              <div className={styles.dockHeader}>
                <div className={styles.terminalDots}>
                  <span className={`${styles.dot} ${styles.dotRed}`} />
                  <span className={`${styles.dot} ${styles.dotYellow}`} />
                  <span className={`${styles.dot} ${styles.dotGreen}`} />
                </div>
                <div className={styles.dockTabs}>
                  <button
                    type="button"
                    className={`${styles.dockTab} ${
                      leftDockTab === "console" ? styles.dockTabActive : ""
                    }`}
                    onClick={() => setLeftDockTab("console")}
                  >
                    <Terminal size={12} />
                    <span>Console ({currentStep?.consoleLogs.length ?? 0})</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.dockTab} ${
                      leftDockTab === "takeaway" ? styles.dockTabActive : ""
                    }`}
                    onClick={() => setLeftDockTab("takeaway")}
                  >
                    <Lightbulb size={12} />
                    <span>Key Takeaway</span>
                  </button>
                </div>
              </div>

              <div className={styles.dockContent}>
                {leftDockTab === "console" ? (
                  <ConsoleOutputView logs={currentStep?.consoleLogs ?? []} hideHeader />
                ) : (
                  <div className={styles.takeawayCard}>
                    <p className={styles.takeawayText}>
                      {customSteps
                        ? "In JavaScript, synchronous statements execute first on the Call Stack. Any setTimeout timers offload to browser Web APIs. Any Promises or queueMicrotasks enter the VIP Microtask Queue, draining completely before Macrotasks!"
                        : activePreset.takeaway}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Vertical Splitter Drag Handle (Desktop only) */}
          <div
            className={`${styles.verticalSplitter} ${
              isDraggingX ? styles.splitterActive : ""
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDraggingX(true);
            }}
            onTouchStart={() => setIsDraggingX(true)}
            title="Drag left/right to resize Code Panel and Runtime Engine"
            role="separator"
            aria-orientation="vertical"
          >
            <div className={styles.verticalGrip} />
          </div>

          {/* Right Pane: Runtime Engine Workbench */}
          <section
            className={`${styles.rightPane} ${
              !isDesktop && mobileView === "code" ? styles.hiddenOnMobileView : ""
            }`}
          >
            {/* Event Loop Coordinator */}
            <div className={styles.rotorRow}>
              <EventLoopRotor
                status={currentStep?.eventLoopStatus ?? "idle"}
                onInfoClick={() =>
                  openInfo(
                    "🔄 The Event Loop Coordinator",
                    <div className={styles.modalContent}>
                      <p>
                        The <strong>Event Loop</strong> is a single-threaded infinite coordinator that decides what runs when:
                      </p>
                      <ol>
                        <li><strong>Step 1:</strong> Checks if the <strong>Call Stack</strong> is empty. If frames are still running, it waits.</li>
                        <li><strong>Step 2:</strong> Once empty, it drains <em>ALL</em> pending tasks in the <strong>Microtask Queue</strong> (Promises, <code>queueMicrotask</code>) to completion.</li>
                        <li><strong>Step 3:</strong> Allows a browser rendering opportunity to update layout and paint.</li>
                        <li><strong>Step 4:</strong> Pulls <strong>exactly ONE task</strong> from the <strong>Macrotask Queue</strong> (<code>setTimeout</code>, <code>setInterval</code>) and pushes it to the Call Stack.</li>
                        <li><strong>Step 5:</strong> Repeats!</li>
                      </ol>
                    </div>
                  )
                }
              />
            </div>

            {/* Stack & Heap (Side by Side) */}
            <div className={styles.stackHeapGrid}>
              <CallStackView
                stack={currentStep?.callStack ?? []}
                onSelectHeapRef={(ref) => setHighlightHeapAddr(ref)}
                onInfoClick={() =>
                  openInfo(
                    "🥞 Call Stack (Execution Frames)",
                    <div className={styles.modalContent}>
                      <p>
                        The <strong>Call Stack</strong> is a LIFO (Last-In, First-Out) data structure that tracks active execution contexts:
                      </p>
                      <ul>
                        <li>Whenever a function is invoked, a new frame is <strong>pushed</strong> onto the stack.</li>
                        <li>When it returns, its frame is <strong>popped</strong>.</li>
                        <li>Primitives are stored directly by value in the frame.</li>
                        <li>Objects and arrays live on the Heap — only their 64-bit reference address is kept in the frame!</li>
                        <li>Exceeding stack capacity triggers a <code>RangeError: Maximum call stack size exceeded</code>.</li>
                      </ul>
                    </div>
                  )
                }
              />

              <MemoryHeapView
                heap={currentStep?.heap ?? []}
                highlightAddress={highlightHeapAddr}
                onSelectAddress={(addr) => setHighlightHeapAddr(addr)}
                onInfoClick={() =>
                  openInfo(
                    "📦 Memory Heap (Dynamic Allocations)",
                    <div className={styles.modalContent}>
                      <p>
                        The <strong>Memory Heap</strong> is an unstructured memory pool where objects, arrays, and closures are allocated:
                      </p>
                      <ul>
                        <li>Each object has a unique hexadecimal address (e.g. <code>0x10A</code>).</li>
                        <li>Writing <code>let b = a</code> copies the <strong>memory pointer</strong>, creating an alias to the same object.</li>
                        <li><strong>Garbage Collection (Mark &amp; Sweep):</strong> Unreachable objects disconnected from the root set are swept away.</li>
                      </ul>
                    </div>
                  )
                }
              />
            </div>

            {/* Task Queues (3-Column Row: Web APIs, Microtasks, Macrotasks) */}
            <div className={styles.queuesRow}>
              <TaskQueuesView
                webApis={currentStep?.webApis ?? []}
                microtasks={currentStep?.microtasks ?? []}
                macrotasks={currentStep?.macrotasks ?? []}
                onInfoClick={(area) => {
                  if (area === "webapis") {
                    openInfo(
                      "🌐 Web APIs (Browser Worker Threads)",
                      <div className={styles.modalContent}>
                        <p>
                          JavaScript is single-threaded, but browser APIs run on multi-threaded C++ background threads:
                        </p>
                        <ul>
                          <li><code>setTimeout</code> and <code>setInterval</code> timers tick down in background threads.</li>
                          <li><code>fetch()</code> network requests transfer packets without blocking JS.</li>
                          <li>On completion, their callbacks are pushed into the Macrotask Queue.</li>
                        </ul>
                      </div>
                    );
                  } else if (area === "microtasks") {
                    openInfo(
                      "⚡ Microtask Queue (VIP Priority)",
                      <div className={styles.modalContent}>
                        <p>
                          The <strong>Microtask Queue</strong> has strict VIP priority:
                        </p>
                        <ul>
                          <li>Holds callbacks from <code>Promise.then()</code>, <code>async/await</code>, and <code>queueMicrotask()</code>.</li>
                          <li>The Event Loop drains this queue to completion before touching any Macrotask!</li>
                        </ul>
                      </div>
                    );
                  } else {
                    openInfo(
                      "⏳ Macrotask Queue (Callback Queue)",
                      <div className={styles.modalContent}>
                        <p>
                          The <strong>Macrotask Queue</strong> holds standard deferred callbacks:
                        </p>
                        <ul>
                          <li>Callbacks from <code>setTimeout</code> and <code>setInterval</code>.</li>
                          <li>The Event Loop processes only <strong>ONE task per cycle</strong>, then yields to microtasks and rendering.</li>
                        </ul>
                      </div>
                    );
                  }
                }}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Interactive Explanatory Info Modal */}
      <Modal
        isOpen={infoModal.isOpen}
        onClose={() => setInfoModal((prev) => ({ ...prev, isOpen: false }))}
        title={infoModal.title}
      >
        {infoModal.content}
      </Modal>
    </div>
  );
}
