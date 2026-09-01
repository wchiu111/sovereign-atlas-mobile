/**
 * Shared Case Studies motion constants.
 *
 * This module owns timing/easing values only. It must remain independent of
 * React state, viewport dimensions, and rendering components.
 */

export const CASE_STUDIES_ENTRY_DURATION = 900;
export const CASE_STUDIES_EXIT_DURATION = 820;
export const CASE_STUDIES_PULL_EASE = "cubic-bezier(0.22,1,0.36,1)";
export const SELECTION_PULSE_DURATION = 420;
export const DRAWER_CLOSE_DURATION = 240;
export const DRAWER_OPEN_DURATION = 320;
export const OVERVIEW_LABEL_REVEAL_DELAY = 110;
export const OVERVIEW_CHROME_REVEAL_DELAY = 170;
export const REDUCED_MOTION_TRANSITION_DURATION = 160;
export const REDUCED_MOTION_DRAWER_DURATION = 140;
export const PROJECT_READING_HANDOFF_DURATION = 520;
export const PROJECT_READING_REDUCED_HANDOFF_DURATION = 160;
export const PROJECT_RETURN_DURATION = 480;
export const PROJECT_RETURN_REDUCED_DURATION = 160;
export const PROJECT_BREATH_DELAYS = [0, 0.8, 1.5, 2.2] as const;
