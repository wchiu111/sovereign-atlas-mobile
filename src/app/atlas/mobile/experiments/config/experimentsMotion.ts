import {
  ATLAS_OVERVIEW_CHROME_REVEAL_DELAY,
  ATLAS_OVERVIEW_DRAWER_CLOSE_DURATION,
  ATLAS_OVERVIEW_DRAWER_OPEN_DURATION,
  ATLAS_OVERVIEW_LABEL_REVEAL_DELAY,
  ATLAS_OVERVIEW_REDUCED_DRAWER_DURATION,
  ATLAS_OVERVIEW_REDUCED_HANDOFF_DURATION,
  ATLAS_OVERVIEW_REDUCED_RETURN_DURATION,
  ATLAS_OVERVIEW_RETURN_DURATION,
  ATLAS_OVERVIEW_SELECTION_EASE,
  ATLAS_OVERVIEW_SELECTION_PULSE_DURATION,
} from "../../overview/atlasOverviewMotion";
import type { ConstellationMotionConfig } from "../template/constellationTypes";

/**
 * Experiments is the first intentionally templated constellation.
 *
 * Shared overview timings remain sourced from the Atlas interaction vocabulary.
 * The longer focused-reading handoff mirrors the motion polish validated on
 * Frameworks without changing the shared default used by existing systems.
 */
export const EXPERIMENTS_MOTION: ConstellationMotionConfig = {
  selectionPulseMs: ATLAS_OVERVIEW_SELECTION_PULSE_DURATION,
  drawerCloseMs: ATLAS_OVERVIEW_DRAWER_CLOSE_DURATION,
  drawerOpenMs: ATLAS_OVERVIEW_DRAWER_OPEN_DURATION,
  drawerReducedMs: ATLAS_OVERVIEW_REDUCED_DRAWER_DURATION,
  labelRevealDelayMs: ATLAS_OVERVIEW_LABEL_REVEAL_DELAY,
  chromeRevealDelayMs: ATLAS_OVERVIEW_CHROME_REVEAL_DELAY,
  readingHandoffMs: 660,
  readingReducedHandoffMs: ATLAS_OVERVIEW_REDUCED_HANDOFF_DURATION,
  returnMs: ATLAS_OVERVIEW_RETURN_DURATION,
  returnReducedMs: ATLAS_OVERVIEW_REDUCED_RETURN_DURATION,
  positionTransition: `transform 0.52s ${ATLAS_OVERVIEW_SELECTION_EASE}`,
} as const;
