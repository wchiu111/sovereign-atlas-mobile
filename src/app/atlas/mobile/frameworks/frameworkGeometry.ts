import type { MobileFrameworkId } from "./mobileFrameworkTypes";

/**
 * Authored geometry for the mobile Frameworks overview.
 *
 * Pass 1 intentionally preserves the current visual coordinates. Pass 2 will
 * revise this authored map into the Case Studies-style stable constellation.
 * Keeping geometry outside FrameworksScene lets that visual pass happen
 * without touching reading/evidence behavior.
 */

export interface FrameworkOverviewGeometry {
  id: MobileFrameworkId;
  x: number;
  y: number;
}

export const FRAMEWORK_OVERVIEW_LAYOUT: readonly FrameworkOverviewGeometry[] = [
  { id: "authority-gradient", x: 90, y: 192 },
  { id: "behavioral-architecture", x: 293, y: 220 },
  { id: "relational-ai-literacy", x: 90, y: 360 },
  { id: "presence-navigation", x: 292, y: 372 },
  { id: "regenerative-systems", x: 150, y: 518 },
];

/**
 * Current parent/core coordinate.
 * Pass 2 will promote this into the dominant stable overview parent.
 */
export const FRAMEWORK_PARENT_CORE = { x: 192, y: 358 } as const;

/**
 * Transitional coordinate used by the existing prototype when a framework is
 * selected. It is named explicitly as legacy so Pass 2 can remove relocation
 * without hunting through the scene implementation.
 */
export const FRAMEWORK_LEGACY_SELECTED_CENTER = { x: 195, y: 236 } as const;

export const FRAMEWORK_RADIAL_GUIDES = [0, 60, 120, 180, 240, 300] as const;

export const FRAMEWORK_SECTION_STAR_GEOMETRY = {
  radius: 94,
  startDegrees: -160,
  endDegrees: -30,
} as const;

/**
 * Authored label wrapping contract for the stable overview constellation.
 * Pass 1 does not change rendering yet; Pass 2 will consume these lines.
 */
export const FRAMEWORK_LABEL_LINES: Record<
  MobileFrameworkId,
  readonly string[]
> = {
  "authority-gradient": ["AUTHORITY", "GRADIENT"],
  "behavioral-architecture": ["BEHAVIORAL", "ARCHITECTURE"],
  "relational-ai-literacy": ["RELATIONAL AI", "LITERACY"],
  "presence-navigation": ["PRESENCE", "NAVIGATION"],
  "regenerative-systems": ["REGENERATIVE", "SYSTEMS"],
};

export function frameworkGeometryFor(
  id: MobileFrameworkId,
): FrameworkOverviewGeometry {
  return (
    FRAMEWORK_OVERVIEW_LAYOUT.find((item) => item.id === id) ??
    FRAMEWORK_OVERVIEW_LAYOUT[1]
  );
}
