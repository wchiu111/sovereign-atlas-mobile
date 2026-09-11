/**
 * Frameworks overview motion contract.
 *
 * These values are identical to the generic prototype transitions used before
 * this refactor. Pass 1 only gives Frameworks its own named motion layer.
 * Selection/drawer/reading choreography will be authored in later passes.
 */

export const FRAMEWORK_POSITION_TRANSITION =
  "transform 0.52s cubic-bezier(0.16,1,0.3,1)";

export const FRAMEWORK_FADE_TRANSITION = "opacity 0.32s ease";
