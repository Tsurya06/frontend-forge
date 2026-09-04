import { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/common/Modal";
import {
  Terminal,
  Lightbulb,
  Code2,
  Zap,
  Layers,
} from "lucide-react";
import {
  VISUALIZER_PRESETS,
  traceCustomCode,
  type VisualizerPreset,
  type ExecutionStep,
} from "@/utils/runtimeVisualizerEngine";
import {
  VisualizerTopBar,
  CodePanel,
  CallStackView,
  MemoryHeapView,
  EventLoopRotor,
  TaskQueuesView,
  ConsoleOutputView,
  getGuideModalContent,
  getEventLoopModalContent,
  getCallStackModalContent,
  getHeapModalContent,
  getQueueModalContent,
  type InfoModalState,
} from "@/components/visualizer";
import { STORAGE_KEYS, SPLIT_BOUNDS } from "@/constants";
import styles from "./Visualizer.module.css";

export default function Visualizer() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("event-loop");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [userSelectedAddr, setHighlightHeapAddr] = useState<string | undefined>(
    undefined,
  );

  const [leftDockTab, setLeftDockTab] = useState<"console" | "takeaway">("console");

  const [splitX, setSplitX] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIZ_SPLIT_X);
    if (saved) {
      const num = parseFloat(saved);
      if (
        !isNaN(num) &&
        num >= SPLIT_BOUNDS.VIZ_X_MIN &&
        num <= SPLIT_BOUNDS.VIZ_X_MAX
      )
        return num;
    }
    return SPLIT_BOUNDS.VIZ_DEFAULT_X;
  });

  const [splitY, setSplitY] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIZ_SPLIT_Y);
    if (saved) {
      const num = parseFloat(saved);
      if (
        !isNaN(num) &&
        num >= SPLIT_BOUNDS.VIZ_Y_MIN &&
        num <= SPLIT_BOUNDS.VIZ_Y_MAX
      )
        return num;
    }
    return SPLIT_BOUNDS.VIZ_DEFAULT_Y;
  });

  const [isDraggingX, setIsDraggingX] = useState<boolean>(false);
  const [isDraggingY, setIsDraggingY] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<"code" | "runtime" | "all">("code");
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth > 960 : true,
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

  useEffect(() => {
    if (!isDraggingX) return;

    const handleMove = (clientX: number) => {
      if (!workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();
      const rawPercent = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(
        Math.max(rawPercent, SPLIT_BOUNDS.VIZ_X_MIN),
        SPLIT_BOUNDS.VIZ_X_MAX,
      );
      setSplitX(clamped);
      localStorage.setItem(STORAGE_KEYS.VIZ_SPLIT_X, clamped.toFixed(1));
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) handleMove(touch.clientX);
    };

    const handleEnd = () => setIsDraggingX(false);

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

  useEffect(() => {
    if (!isDraggingY) return;

    const handleMove = (clientY: number) => {
      if (!leftPaneRef.current) return;
      const rect = leftPaneRef.current.getBoundingClientRect();
      const rawPercent = ((clientY - rect.top) / rect.height) * 100;
      const clamped = Math.min(
        Math.max(rawPercent, SPLIT_BOUNDS.VIZ_Y_MIN),
        SPLIT_BOUNDS.VIZ_Y_MAX,
      );
      setSplitY(clamped);
      localStorage.setItem(STORAGE_KEYS.VIZ_SPLIT_Y, clamped.toFixed(1));
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) handleMove(touch.clientY);
    };

    const handleEnd = () => setIsDraggingY(false);

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

  const [code, setCode] = useState<string>(initialPreset.code);
  const [customSteps, setCustomSteps] = useState<ExecutionStep[] | null>(null);

  const [infoModal, setInfoModal] = useState<InfoModalState>({
    isOpen: false,
    title: "",
    content: null,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePreset: VisualizerPreset =
    VISUALIZER_PRESETS.find((p) => p.id === selectedPresetId) ??
    VISUALIZER_PRESETS[0]!;

  const activeSteps: ExecutionStep[] = customSteps ?? activePreset.steps;
  const totalSteps = activeSteps.length;
  const currentStep: ExecutionStep =
    activeSteps[currentStepIndex] ?? activeSteps[0]!;

  const handlePresetSelect = (id: string) => {
    setIsPlaying(false);
    setSelectedPresetId(id);
    const p = VISUALIZER_PRESETS.find((preset) => preset.id === id);
    if (p) {
      setCode(p.code);
      setCustomSteps(null);
    }
    setCurrentStepIndex(0);
    setHighlightHeapAddr(undefined);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsPlaying(false);
    const generated = traceCustomCode(newCode);
    setCustomSteps(generated);
    setCurrentStepIndex(0);
    setHighlightHeapAddr(undefined);
  };

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

  const highlightHeapAddr = userSelectedAddr ?? currentStep?.highlightAddress;

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
        {/* Top Control Bar */}
        <VisualizerTopBar
          presets={VISUALIZER_PRESETS}
          selectedPresetId={selectedPresetId}
          isCustom={Boolean(customSteps)}
          isPlaying={isPlaying}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          speed={speed}
          onSelectPreset={(val) => {
            if (val === "custom") {
              handleCodeChange(code);
            } else {
              handlePresetSelect(val);
            }
          }}
          onOpenGuide={() =>
            openInfo(
              "📖 How to Use the JavaScript Runtime Visualizer",
              getGuideModalContent(),
            )
          }
          onReset={handleReset}
          onStepBackward={handleStepBackward}
          onStepForward={handleStepForward}
          onTogglePlay={togglePlay}
          onSeekStep={(idx) => {
            setIsPlaying(false);
            setCurrentStepIndex(idx);
          }}
          onSelectSpeed={setSpeed}
        />

        {/* Slim Integrated Explanation Status Bar */}
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

        {/* Mobile View Switcher */}
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

        {/* Main Split Workspace */}
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

          {/* Vertical Splitter Drag Handle */}
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
            <div className={styles.rotorRow}>
              <EventLoopRotor
                status={currentStep?.eventLoopStatus ?? "idle"}
                onInfoClick={() =>
                  openInfo(
                    "🔄 The Event Loop Coordinator",
                    getEventLoopModalContent(),
                  )
                }
              />
            </div>

            <div className={styles.stackHeapGrid}>
              <CallStackView
                stack={currentStep?.callStack ?? []}
                onSelectHeapRef={(ref) => setHighlightHeapAddr(ref)}
                onInfoClick={() =>
                  openInfo(
                    "🥞 Call Stack (Execution Frames)",
                    getCallStackModalContent(),
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
                    getHeapModalContent(),
                  )
                }
              />
            </div>

            <div className={styles.queuesRow}>
              <TaskQueuesView
                webApis={currentStep?.webApis ?? []}
                microtasks={currentStep?.microtasks ?? []}
                macrotasks={currentStep?.macrotasks ?? []}
                onInfoClick={(area) => {
                  const modalData = getQueueModalContent(area);
                  openInfo(modalData.title, modalData.content);
                }}
              />
            </div>
          </section>
        </div>
      </div>

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
