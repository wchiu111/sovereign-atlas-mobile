import { useEffect, useMemo, useRef, useState } from "react";

import { FRAMEWORK_FOCUS_ITEMS } from "../frameworkOverviewData";
import type { FrameworkOverviewId } from "../frameworkGeometry";
import type { MobileFrameworkId } from "../mobileFrameworkTypes";
import {
  FRAMEWORK_CHROME_REVEAL_DELAY,
  FRAMEWORK_DRAWER_CLOSE_DURATION,
  FRAMEWORK_DRAWER_OPEN_DURATION,
  FRAMEWORK_LABEL_REVEAL_DELAY,
  FRAMEWORK_REDUCED_MOTION_DRAWER_DURATION,
  FRAMEWORK_SELECTION_PULSE_DURATION,
} from "../frameworkMotion";

export type FrameworkDrawerPhase = "open" | "closing" | "opening";

type FrameworkOverviewState =
  | "frameworks-focus"
  | "framework-awakened"
  | "framework-overview"
  | "framework-reading"
  | "framework-evidence";

interface UseFrameworksChoreographyArgs {
  state: FrameworkOverviewState;
  activeFrameworkId: MobileFrameworkId;
  onSelectFramework: (id: MobileFrameworkId) => void;
  onSelectParent: () => void;
  onExplore: () => void;
}

export default function useFrameworksChoreography({
  state,
  activeFrameworkId,
  onSelectFramework,
  onSelectParent,
  onExplore,
}: UseFrameworksChoreographyArgs) {
  const overviewActive =
    state === "frameworks-focus" ||
    state === "framework-awakened" ||
    state === "framework-overview";

  const initialOverviewId: FrameworkOverviewId =
    state === "frameworks-focus" ? "frameworks" : activeFrameworkId;

  const [drawerItemId, setDrawerItemId] =
    useState<FrameworkOverviewId>(initialOverviewId);
  const [drawerPhase, setDrawerPhase] =
    useState<FrameworkDrawerPhase>("open");
  const [selectionPulseId, setSelectionPulseId] =
    useState<FrameworkOverviewId | null>(null);
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const drawerTimersRef = useRef<number[]>([]);
  const revealTimersRef = useRef<number[]>([]);
  const pulseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    return () => {
      drawerTimersRef.current.forEach(window.clearTimeout);
      revealTimersRef.current.forEach(window.clearTimeout);
      drawerTimersRef.current = [];
      revealTimersRef.current = [];
      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!overviewActive) return;

    revealTimersRef.current.forEach(window.clearTimeout);
    revealTimersRef.current = [];

    setLabelsVisible(false);
    setChromeVisible(false);
    setDrawerVisible(false);

    const labelDelay = prefersReducedMotion ? 0 : FRAMEWORK_LABEL_REVEAL_DELAY;
    const chromeDelay = prefersReducedMotion ? 0 : FRAMEWORK_CHROME_REVEAL_DELAY;

    revealTimersRef.current.push(
      window.setTimeout(() => setLabelsVisible(true), labelDelay),
      window.setTimeout(() => {
        setChromeVisible(true);
        setDrawerVisible(true);
      }, chromeDelay),
    );

    return () => {
      revealTimersRef.current.forEach(window.clearTimeout);
      revealTimersRef.current = [];
    };
  }, [overviewActive, prefersReducedMotion]);

  // A fresh non-reading scene mounts after returning from reading. Align its
  // drawer identity with the outer state immediately; Pass 5 will replace this
  // simple restore with an authored reverse handoff.
  useEffect(() => {
    if (!overviewActive) return;
    const expected: FrameworkOverviewId =
      state === "frameworks-focus" ? "frameworks" : activeFrameworkId;

    if (drawerPhase === "open") setDrawerItemId(expected);
  }, [overviewActive, state, activeFrameworkId, drawerPhase]);

  const selectedId: FrameworkOverviewId =
    state === "frameworks-focus" ? "frameworks" : activeFrameworkId;

  const drawerItem = useMemo(() => {
    if (drawerItemId === "frameworks") return null;
    return (
      FRAMEWORK_FOCUS_ITEMS.find((item) => item.id === drawerItemId) ?? null
    );
  }, [drawerItemId]);

  const clearSelectionPulse = () => {
    if (pulseTimerRef.current !== null) {
      window.clearTimeout(pulseTimerRef.current);
      pulseTimerRef.current = null;
    }
    setSelectionPulseId(null);
  };

  const selectOverviewItem = (id: FrameworkOverviewId) => {
    if (!overviewActive || drawerPhase === "closing") return;

    // Same second-tap contract as Case Studies: the first tap establishes
    // context; tapping the already-selected destination commits to reading.
    if (id === selectedId) {
      if (id !== "frameworks") onExplore();
      return;
    }

    clearSelectionPulse();
    drawerTimersRef.current.forEach(window.clearTimeout);
    drawerTimersRef.current = [];

    if (!prefersReducedMotion) {
      setSelectionPulseId(id);
      pulseTimerRef.current = window.setTimeout(() => {
        setSelectionPulseId(null);
        pulseTimerRef.current = null;
      }, FRAMEWORK_SELECTION_PULSE_DURATION);
    }

    setDrawerPhase("closing");

    // Change spatial selection immediately. Drawer identity intentionally lags
    // until the current surface has closed.
    if (id === "frameworks") onSelectParent();
    else onSelectFramework(id);

    const phaseDuration = prefersReducedMotion
      ? FRAMEWORK_REDUCED_MOTION_DRAWER_DURATION
      : FRAMEWORK_DRAWER_CLOSE_DURATION;

    drawerTimersRef.current.push(
      window.setTimeout(() => {
        setDrawerItemId(id);
        setDrawerPhase("opening");

        const openDuration = prefersReducedMotion
          ? FRAMEWORK_REDUCED_MOTION_DRAWER_DURATION
          : FRAMEWORK_DRAWER_OPEN_DURATION;

        drawerTimersRef.current.push(
          window.setTimeout(() => setDrawerPhase("open"), openDuration),
        );
      }, phaseDuration),
    );
  };

  const ambientPaused =
    drawerPhase !== "open" || selectionPulseId !== null;

  return {
    selectedId,
    drawerItem,
    drawerPhase,
    selectionPulseId,
    labelsVisible,
    chromeVisible,
    drawerVisible,
    prefersReducedMotion,
    ambientPaused,
    selectOverviewItem,
  };
}
