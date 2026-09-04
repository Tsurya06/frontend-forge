import type React from "react";
import type { VisualizerPreset } from "@/utils/runtimeVisualizerEngine";

export interface VisualizerTopBarProps {
  readonly presets: readonly VisualizerPreset[];
  readonly selectedPresetId: string;
  readonly isCustom: boolean;
  readonly isPlaying: boolean;
  readonly currentStepIndex: number;
  readonly totalSteps: number;
  readonly speed: number;
  readonly onSelectPreset: (id: string) => void;
  readonly onOpenGuide: () => void;
  readonly onReset: () => void;
  readonly onStepBackward: () => void;
  readonly onStepForward: () => void;
  readonly onTogglePlay: () => void;
  readonly onSeekStep: (stepIndex: number) => void;
  readonly onSelectSpeed: (speed: number) => void;
}

export interface VisualizerMobileNavProps {
  readonly mobileView: "code" | "runtime" | "all";
  readonly onSelectView: (view: "code" | "runtime" | "all") => void;
}

export interface InfoModalState {
  readonly isOpen: boolean;
  readonly title: string;
  readonly content: React.ReactNode;
}
