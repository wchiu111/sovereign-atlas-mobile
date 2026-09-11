/**
 * Frameworks overview motion contract.
 *
 * Selection timings intentionally mirror the Case Studies interaction grammar
 * so both systems acknowledge, swap, and settle with the same rhythm.
 */

export const FRAMEWORK_POSITION_TRANSITION =
  "transform 0.52s cubic-bezier(0.16,1,0.3,1)";

export const FRAMEWORK_FADE_TRANSITION = "opacity 0.32s ease";

export const FRAMEWORK_SELECTION_PULSE_DURATION = 420;
export const FRAMEWORK_DRAWER_CLOSE_DURATION = 240;
export const FRAMEWORK_DRAWER_OPEN_DURATION = 320;
export const FRAMEWORK_LABEL_REVEAL_DELAY = 110;
export const FRAMEWORK_CHROME_REVEAL_DELAY = 170;
export const FRAMEWORK_REDUCED_MOTION_DRAWER_DURATION = 140;

export const FRAMEWORK_BREATH_DELAYS = [0, 0.8, 1.5, 2.2, 2.9] as const;
