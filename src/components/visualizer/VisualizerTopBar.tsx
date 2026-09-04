import {
  Zap,
  RotateCcw,
  StepBack,
  Play,
  Pause,
  StepForward,
  BookOpen,
} from "lucide-react";
import styles from "@/pages/visualizer/Visualizer.module.css";
import type { VisualizerTopBarProps } from "./types";

export function VisualizerTopBar({
  presets,
  selectedPresetId,
  isCustom,
  isPlaying,
  currentStepIndex,
  totalSteps,
  speed,
  onSelectPreset,
  onOpenGuide,
  onReset,
  onStepBackward,
  onStepForward,
  onTogglePlay,
  onSeekStep,
  onSelectSpeed,
}: Readonly<VisualizerTopBarProps>) {
  return (
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
              value={isCustom ? "custom" : selectedPresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              aria-label="Select Runtime Preset"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
              {isCustom && <option value="custom">My Custom Code</option>}
            </select>
          </div>
        </div>

        {/* Right: Guide Button */}
        <div className={styles.barRightGroup}>
          {isCustom && (
            <span className={styles.customCodeTag}>Live Code</span>
          )}
          <button
            type="button"
            className={styles.guideHeaderBtn}
            onClick={onOpenGuide}
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
            onClick={onReset}
            title="Reset to beginning"
            aria-label="Reset to beginning"
          >
            <RotateCcw size={12} />
          </button>
          <button
            type="button"
            className={styles.controlIconBtn}
            onClick={onStepBackward}
            disabled={currentStepIndex === 0}
            title="Previous step"
            aria-label="Previous step"
          >
            <StepBack size={12} />
          </button>
          <button
            type="button"
            className={styles.playActionBtn}
            onClick={onTogglePlay}
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
            onClick={onStepForward}
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
            onChange={(e) => onSeekStep(Number(e.target.value))}
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
              onClick={() => onSelectSpeed(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
