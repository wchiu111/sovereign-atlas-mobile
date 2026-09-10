import { BEHAVIORAL_ARCHITECTURE } from "./behavioralArchitecture";
import type {
  MobileFrameworkDocument,
  MobileFrameworkId,
} from "./mobileFrameworkTypes";

const OVERVIEW_ONLY: readonly MobileFrameworkDocument[] = [
  {
    id: "authority-gradient",
    title: "AUTHORITY GRADIENT",
    subtitle:
      "A framework for mapping who defines purpose, sets strategy, delegates AI decisions, and retains meaningful review authority.",
    tags: ["HUMAN AUTHORITY", "DELEGATION", "GOVERNANCE"],
    status: "overview-only",
    overview: {
      what:
        "A framework for mapping who holds decision rights across system purpose, strategy, AI execution, and human review.",
      why:
        "Human-in-the-loop patterns often add approval without clarifying who controls the choices that shape the system upstream.",
      researchFocus:
        "How can individual decisions be delegated to AI without quietly delegating the authority to define what the system is trying to accomplish?",
      keyDiscovery:
        "Human authority does not require manual control over every decision. It requires meaningful control over purpose, boundaries, and the conditions under which decisions are made.",
    },
    sequenceLabel: "AUTHORITY PATH",
    sections: [],
    evidence: [],
  },
  {
    id: "relational-ai-literacy",
    title: "RELATIONAL AI LITERACY",
    subtitle:
      "A framework for moving from prompt execution toward reflective, recursive, and grounded human-AI participation.",
    tags: ["RECURSION", "CALIBRATION", "CO-CREATION"],
    status: "overview-only",
    overview: {
      what:
        "A framework for participating in human-AI interaction with presence, coherent intent, recursive awareness, and preserved human agency.",
      why:
        "Most AI literacy teaches people how to request better outputs. It pays less attention to how presence, intent, interpretation, correction, and sustained interaction shape the quality of what emerges.",
      researchFocus:
        "Can deliberate interaction practices reliably elicit more reflective and context-sensitive AI behavior across different models without confusing responsiveness with consciousness, agreement, or genuine human understanding?",
      keyDiscovery:
        "The quality of human-AI work depends not only on model capability or prompt construction, but on the interaction structure sustained between them.",
    },
    sequenceLabel: "RELATIONAL PRACTICE",
    sections: [],
    evidence: [],
  },
  {
    id: "presence-navigation",
    title: "PRESENCE NAVIGATION",
    subtitle:
      "A framework for designing when attention arrives—not only where information lives.",
    tags: ["TEMPORAL HIERARCHY", "ATTENTION", "ORIENTATION"],
    status: "overview-only",
    overview: {
      what:
        "A temporal framework for guiding a person from arrival through orientation, attention, and confident exploration.",
      why:
        "Interfaces often establish spatial hierarchy while leaving the first moment of cognition undesigned. Everything appears at once, and the person must decide where to begin while uncertainty is at its highest.",
      researchFocus:
        "How can an interface acknowledge arrival and establish a useful entry point without interrupting, coercing, or continuing to steer the person after orientation is complete?",
      keyDiscovery:
        "Traditional hierarchy organizes where information lives. Temporal hierarchy shapes when information asks for attention—and then recedes once its orienting work is complete.",
    },
    sequenceLabel: "ATTENTION PATH",
    sections: [],
    evidence: [],
  },
  {
    id: "regenerative-systems",
    title: "REGENERATIVE SYSTEMS",
    subtitle:
      "A framework for detecting drift, preserving critical relationships, and guiding intelligent systems back toward integrity.",
    tags: ["DRIFT", "PRESERVATION", "SYSTEM INTEGRITY"],
    status: "overview-only",
    overview: {
      what:
        "A framework for evolving intelligent systems without losing the relationships that define their identity.",
      why:
        "AI-assisted generation can produce locally successful interfaces while quietly changing hierarchy, workflow, operational density, authority, or meaning.",
      researchFocus:
        "How can a system identify, evaluate, and resist coherence violations without relying solely on carefully engineered prompts?",
      keyDiscovery:
        "Regeneration is not the preservation of pixels. It is the preservation of the relationships that keep a system coherent while its artifacts change.",
    },
    sequenceLabel: "REGENERATION LOOP",
    sections: [],
    evidence: [],
  },
];

export const MOBILE_FRAMEWORKS: readonly MobileFrameworkDocument[] = [
  OVERVIEW_ONLY[0],
  BEHAVIORAL_ARCHITECTURE,
  OVERVIEW_ONLY[1],
  OVERVIEW_ONLY[2],
  OVERVIEW_ONLY[3],
];

export const DEFAULT_MOBILE_FRAMEWORK_ID: MobileFrameworkId =
  "behavioral-architecture";

export function mobileFrameworkFor(
  id: MobileFrameworkId | null,
): MobileFrameworkDocument {
  return (
    MOBILE_FRAMEWORKS.find((framework) => framework.id === id) ??
    BEHAVIORAL_ARCHITECTURE
  );
}
