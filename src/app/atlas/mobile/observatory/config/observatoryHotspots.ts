import type { ObservatoryHotspotDefinition } from "../observatoryTypes";

/**
 * Portrait-authored interaction coordinates for the 390 × 844 mobile stage.
 *
 * The production background is wider than the viewport and is rendered with
 * object-fit: cover. These coordinates are authored against the centered
 * 390 × 844 crop.
 */
export const OBSERVATORY_HOTSPOTS: readonly ObservatoryHotspotDefinition[] = [
  {
    id: "journey",
    label: "JOURNEY",
    eyebrow: "Profile archive",
    description: "Trace the path from early exploration to Sovereign Design.",
    color: "#FFB14A",
    x: 78,
    y: 292,
    labelX: 28,
    labelY: 252,
    align: "left",
    camera: {
      translateX: 22,
      translateY: 18,
      scale: 1.09,
    },
  },
  {
    id: "contact",
    label: "FIRST CONTACT",
    eyebrow: "Communication console",
    description: "Open a channel and begin a conversation.",
    color: "#33D1A1",
    x: 116,
    y: 406,
    labelX: 136,
    labelY: 382,
    align: "left",
    camera: {
      translateX: 18,
      translateY: -8,
      scale: 1.085,
    },
  },
  {
    id: "about",
    label: "ABOUT WILSON",
    eyebrow: "Designer profile",
    description: "Identity, values, approach, and how I think and build.",
    color: "#6AA7FF",
    x: 195,
    y: 544,
    labelX: 195,
    labelY: 512,
    align: "center",
    camera: {
      translateX: 0,
      translateY: -32,
      scale: 1.075,
    },
  },
  {
    id: "philosophy",
    label: "PHILOSOPHY",
    eyebrow: "Reference library",
    description: "The principles, influences, and beliefs that shape the work.",
    color: "#A879FF",
    x: 326,
    y: 410,
    labelX: 270,
    labelY: 386,
    align: "left",
    camera: {
      translateX: -20,
      translateY: -8,
      scale: 1.09,
    },
  },
  {
    id: "atlas",
    label: "ENTER ATLAS",
    eyebrow: "Knowledge system",
    description: "Explore case studies, experiments, and frameworks.",
    color: "#D4AF37",
    x: 350,
    y: 274,
    labelX: 275,
    labelY: 248,
    align: "left",
    camera: {
      translateX: -24,
      translateY: 14,
      scale: 1.10,
    },
  },
] as const;

export function observatoryHotspotFor(id: string | null) {
  return (
    OBSERVATORY_HOTSPOTS.find((hotspot) => hotspot.id === id) ??
    null
  );
}
