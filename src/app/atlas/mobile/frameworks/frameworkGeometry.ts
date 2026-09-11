import type { MobileFrameworkId } from "./mobileFrameworkTypes";

export type FrameworkOverviewId = "frameworks" | MobileFrameworkId;
export type FrameworkLabelAnchor = "start" | "middle" | "end";

export interface FrameworkOverviewGeometry {
  id: MobileFrameworkId;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  anchor: FrameworkLabelAnchor;
}

/**
 * Stable authored Frameworks overview.
 *
 * The composition deliberately mirrors the Case Studies grammar:
 * a dominant parent core, authored child positions, and all destinations kept
 * above the narrative drawer boundary. Selection changes emphasis, not place.
 */
export const FRAMEWORK_OVERVIEW_LAYOUT: readonly FrameworkOverviewGeometry[] = [
  {
    id: "authority-gradient",
    x: 96,
    y: 176,
    labelX: 96,
    labelY: 203,
    anchor: "middle",
  },
  {
    id: "behavioral-architecture",
    x: 294,
    y: 192,
    labelX: 294,
    labelY: 219,
    anchor: "middle",
  },
  {
    id: "relational-ai-literacy",
    x: 86,
    y: 334,
    labelX: 86,
    labelY: 361,
    anchor: "middle",
  },
  {
    id: "presence-navigation",
    x: 304,
    y: 340,
    labelX: 304,
    labelY: 367,
    anchor: "middle",
  },
  {
    id: "regenerative-systems",
    x: 195,
    y: 414,
    labelX: 195,
    labelY: 441,
    anchor: "middle",
  },
];

/**
 * Parent placement intentionally aligns with the Case Studies overview's
 * visual center rather than the old tall Frameworks prototype.
 */
export const FRAMEWORK_PARENT_CORE = { x: 195, y: 270 } as const;

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

/**
 * Relationship paths are authored rather than generated as a perfect radial
 * graph. They keep the system spatial and slightly asymmetric.
 */
export const FRAMEWORK_RELATION_PATHS = [
  "M195 270 C160 232 126 198 96 176",
  "M195 270 C226 236 260 207 294 192",
  "M195 270 C155 286 118 310 86 334",
  "M195 270 C236 288 273 314 304 340",
  "M195 270 C195 318 195 365 195 414",
  "M96 176 C155 150 235 154 294 192",
  "M86 334 C149 302 239 305 304 340",
] as const;

export function frameworkGeometryFor(
  id: MobileFrameworkId,
): FrameworkOverviewGeometry {
  return (
    FRAMEWORK_OVERVIEW_LAYOUT.find((item) => item.id === id) ??
    FRAMEWORK_OVERVIEW_LAYOUT[1]
  );
}
