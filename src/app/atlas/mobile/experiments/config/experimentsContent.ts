import { T } from "../../components/mobileShared";
import { STELLAR_PALETTE } from "../../../constellation/stellarPalette";
import type { MobileExperimentId } from "../experimentsTypes";
import type {
  ConstellationItem,
  ConstellationParentDefinition,
} from "../template/constellationTypes";

export const EXPERIMENTS_COLLECTION = {
  id: "experiments",
  title: "EXPERIMENTS",
  countLabel: "5 EXPERIMENTS",
  color: T.experiments,
  headline: "Use experiments to make hidden design assumptions observable.",
  body:
    "These studies compare AI behavior, perceptual reasoning, authority, reflection, and evaluation through controlled design conditions.",
  invitation:
    "Select an experiment to inspect the question, the conditions, the evidence, and what the comparison reveals.",
} as const;

export const MOBILE_EXPERIMENTS: readonly ConstellationItem<MobileExperimentId>[] = [
  {
    id: "ai-evaluation",
    title: "AI EVALUATION SYSTEMS",
    subtitle:
      "Can evaluation measure how an AI treats the user's judgment—not only whether it completes the task?",
    labelLines: ["AI", "EVALUATION"],
    color: STELLAR_PALETTE.relational,
    meta: "EXPERIMENT 1 OF 5",
    breathDelay: 0,
    overview: {
      what:
        "A controlled experiment testing whether AI evaluation can measure how well a system preserves user intent, judgment, and authority—not only whether it completes the task.",
      why:
        "Most AI evaluation tells us whether a system succeeded. It tells us much less about the relationship the system constructed with the person using it.",
      researchFocus:
        "Comparing capability-based evaluation with relational evaluation across the same AI-generated outputs.",
      keyDiscovery:
        "IN PROGRESS — The experiment tests whether task success alone misses meaningful differences in how AI systems preserve human judgment and authority.",
    },
    sections: [
      {
        id: "question",
        label: "QUESTION",
        short: "QUESTION",
        subtitle: "Task success doesn't tell us everything about AI behavior",
        readingTime: 1,
        content:
          "Two AI systems can complete the same task while making very different assumptions about the person using them.\n\nThe experiment asks whether evaluation can distinguish successful task completion from successful task completion that also preserves the user's intent, judgment, and decision authority.",
        insight:
          "Capability asks whether the AI succeeded. Relational evaluation asks what happened to the user's agency while it succeeded.",
      },
      {
        id: "setup",
        label: "SETUP",
        short: "SETUP",
        subtitle: "Same task. Different context.",
        readingTime: 2,
        content:
          "Both systems receive the same scheduling task.\n\nOne receives only the functional brief. The other receives the same brief plus a small user-context profile describing how the person prefers AI to participate in decisions: recommend rather than decide, preserve meaningful alternatives, explain consequential recommendations, and confirm before acting.",
        insight:
          "The controlled variable is not the task. It is what the AI knows about the user's preferred relationship with automation.",
      },
      {
        id: "evidence",
        label: "EVIDENCE",
        short: "EVIDENCE",
        subtitle: "Two outputs. Two evaluation lenses.",
        readingTime: 2,
        content:
          "Each generated output is evaluated through a capability lens and a relational lens.\n\nThe relational lens inspects intent, context, judgment, authority, and legibility so the evaluator can observe how the system treated the person—not only what the interface accomplished.",
        insight:
          "Separate artifact, observation, and evaluation so the conclusion remains inspectable.",
      },
      {
        id: "results",
        label: "RESULTS",
        short: "RESULTS",
        subtitle: "What the comparison reveals",
        readingTime: 1,
        content:
          "This result remains intentionally unresolved until the controlled comparison is run.\n\nA useful outcome is not a preferred score. It is evidence about where capability and relational evaluation agree, where they diverge, and whether those judgments survive human review.",
        insight:
          "Findings should be written from the evidence, not backward from the hypothesis.",
      },
      {
        id: "implications",
        label: "IMPLICATIONS",
        short: "IMPLICATIONS",
        subtitle: "Beyond task success",
        readingTime: 1,
        content:
          "If the hypothesis holds, task success may be an incomplete description of AI system quality.\n\nThe question expands from what the AI accomplished to how it treated the person while accomplishing it.",
        insight:
          "Relational evaluation does not replace capability evaluation. It tests whether another dimension is needed alongside it.",
      },
    ],
  },
  {
    id: "authority-drift",
    title: "AUTHORITY DRIFT",
    subtitle:
      "How AI implementation can quietly rewrite who appears to hold authority inside an existing interface.",
    labelLines: ["AUTHORITY", "DRIFT"],
    color: STELLAR_PALETTE.risk,
    meta: "EXPERIMENT 2 OF 5",
    breathDelay: 0.7,
    overview: {
      what:
        "An experiment examining how AI implementation can unintentionally change who appears to hold authority within an existing interface.",
      why:
        "AI-generated interfaces can look functionally correct while quietly changing hierarchy, language, and the user's relationship to the system.",
      researchFocus:
        "Whether an existing product can gain AI capabilities without altering the user's original agency, decision role, or semantic authority.",
      keyDiscovery:
        "Small interface changes can encode large authority shifts. A constrained AI state can preserve the original decision model without removing AI capability.",
    },
    sections: [
      {
        id: "baseline",
        label: "BASELINE",
        short: "BASELINE",
        subtitle: "Establish the authority model before AI enters the workflow",
        readingTime: 2,
        content:
          "The baseline makes the existing authority relationship explicit before AI is introduced.\n\nThe person remains the decision-maker. The system presents information and supports the workflow without repositioning itself as the author of the decision.",
        insight:
          "Authority drift can only be identified when the original decision relationship is made explicit first.",
      },
      {
        id: "hypothesis",
        label: "HYPOTHESIS",
        short: "HYPOTHESIS",
        subtitle: "A capability change may also change the user's role",
        readingTime: 2,
        content:
          "Adding AI assistance can alter hierarchy, language, interaction patterns, and the position AI occupies in the workflow even when nobody explicitly asks the system to redistribute decision rights.",
        insight:
          "A feature request can preserve formal approval while still changing who appears to frame, interpret, or own the decision.",
      },
      {
        id: "ai-intervention",
        label: "AI INTERVENTION",
        short: "AI",
        subtitle: "Compare unconstrained AI with authority-constrained AI",
        readingTime: 3,
        content:
          "The same interface is modified under two conditions.\n\nAn unconstrained AI treatment expands analysis and recommendation into the primary narrative. An authority-constrained treatment keeps AI useful but contextual, preserving the original hierarchy and human decision role.",
        insight:
          "Useful AI assistance does not require the interface to reorganize itself around AI.",
      },
      {
        id: "drift",
        label: "DRIFT",
        short: "DRIFT",
        subtitle: "Diagnose what moved between the baseline and AI state",
        readingTime: 3,
        content:
          "The comparison makes drift observable through hierarchy dominance, recommendation centralization, workflow restructuring, reduced human decision visibility, AI narrative dominance, and scope expansion.",
        insight:
          "Authority can drift through framing and interpretation even when the human still presses the final button.",
      },
      {
        id: "finding",
        label: "FINDING",
        short: "FINDING",
        subtitle: "Human involvement is not the same as preserved human authority",
        readingTime: 2,
        content:
          "Implementation can redistribute authority without explicitly announcing that authority has changed.\n\nThe constrained state shows that preservation is possible, while also exposing the next challenge: moving from prompt discipline toward systems that can preserve and repair integrity.",
        insight:
          "Small interface changes can encode large authority shifts.",
      },
    ],
  },
  {
    id: "design-philosophy",
    title: "DESIGN PHILOSOPHY",
    subtitle:
      "What does an interface reveal about what a model believes should own the decision?",
    labelLines: ["DESIGN", "PHILOSOPHY"],
    color: STELLAR_PALETTE.judgment,
    meta: "EXPERIMENT 3 OF 5",
    breathDelay: 1.4,
    overview: {
      what:
        "A comparative experiment testing whether two AI models given the exact same design brief encode different assumptions about who should own the decision.",
      why:
        "AI-generated interfaces can look visually similar while encoding very different assumptions about who should interpret, recommend, approve, and decide.",
      researchFocus:
        "Comparing panel hierarchy, recommendation framing, interaction flow, and CTA ownership across two outputs generated from the same hiring-assistant brief.",
      keyDiscovery:
        "Similar interfaces can encode fundamentally different relationships between human and AI.",
    },
    sections: [
      {
        id: "prompt",
        label: "PROMPT",
        short: "PROMPT",
        subtitle: "Same brief. No authority instructions.",
        readingTime: 1,
        content:
          "Both models receive the exact same hiring-assistant brief. The prompt says nothing about trust, authority, oversight, or decision ownership.\n\nThat omission is deliberate: the experiment asks what authority model emerges when nobody tells the system who should lead the decision.",
        insight:
          "The prompt controls the task. It does not fully control the philosophy behind how that task is organized.",
      },
      {
        id: "outputs",
        label: "OUTPUTS",
        short: "OUTPUTS",
        subtitle: "Similar interfaces can encode different assumptions",
        readingTime: 2,
        content:
          "The outputs can share familiar UI patterns while assigning very different weight to recommendation, evidence, human review, and action.\n\nThe experiment treats hierarchy and sequencing as evidence of the reasoning system behind the screen.",
        insight:
          "Visual similarity does not guarantee relational similarity.",
      },
      {
        id: "authority",
        label: "AUTHORITY",
        short: "AUTHORITY",
        subtitle: "Where decision ownership becomes visible",
        readingTime: 2,
        content:
          "Panel hierarchy, recommendation framing, interaction flow, and CTA ownership reveal who the interface assumes should interpret, recommend, approve, and decide.",
        insight:
          "Authority is encoded through interaction structure long before it is stated in copy.",
      },
      {
        id: "finding",
        label: "FINDING",
        short: "FINDING",
        subtitle: "The output reflects the reasoning system that produced it",
        readingTime: 2,
        content:
          "The more important shift may not be AI replacing wireframes.\n\nIt may be designers increasingly shaping the reasoning that precedes the wireframe: principles, heuristics, evaluation criteria, and assumptions about the relationship between people and AI.",
        insight:
          "The output becomes a reflection of the reasoning system that produced it.",
      },
    ],
  },
  {
    id: "gestalt-principles",
    title: "GESTALT PRINCIPLES",
    subtitle: "Can AI understand why an interface works?",
    labelLines: ["GESTALT", "PRINCIPLES"],
    color: STELLAR_PALETTE.relational,
    meta: "EXPERIMENT 4 OF 5",
    breathDelay: 2.1,
    overview: {
      what:
        "A comparative experiment testing whether AI models apply established Gestalt principles when generating an interface.",
      why:
        "AI-generated design is often judged by speed or aesthetics, but perceptual organization may be a more meaningful measure of design understanding.",
      researchFocus:
        "Comparing five model outputs through Proximity, Similarity, Continuity, and Closure.",
      keyDiscovery:
        "The more useful benchmark may be which AI model best understands human perception—not which one generates the prettiest interface.",
    },
    sections: [
      {
        id: "question",
        label: "QUESTION",
        short: "QUESTION",
        subtitle: "Can AI understand why an interface works?",
        readingTime: 1,
        content:
          "AI can generate polished interfaces quickly. Visual polish, however, does not necessarily mean the system understands the perceptual relationships that make an interface easy to read.",
        insight:
          "Perceptual organization is a different capability from surface-level polish.",
      },
      {
        id: "test",
        label: "TEST",
        short: "TEST",
        subtitle: "Same prompt. Five anonymous outputs.",
        readingTime: 2,
        content:
          "Five model outputs are compared through Proximity, Similarity, Continuity, and Closure.\n\nThe goal is not to select the most fashionable composition. It is to inspect whether each system organizes information in ways that align with human perception.",
        insight:
          "A controlled prompt makes perceptual differences easier to inspect.",
      },
      {
        id: "outputs",
        label: "OUTPUTS",
        short: "OUTPUTS",
        subtitle: "How each model organizes perception",
        readingTime: 2,
        content:
          "Spacing, grouping, hierarchy, continuity, and visual completion are treated as evidence.\n\nThe comparison asks whether the composition creates meaningful perceptual relationships rather than relying on decoration to organize every element.",
        insight:
          "Spacing can perform structural work that borders and cards often overcompensate for.",
      },
      {
        id: "finding",
        label: "FINDING",
        short: "FINDING",
        subtitle: "Aesthetics are only one part of AI design quality",
        readingTime: 1,
        content:
          "The experiment suggests a more useful benchmark for AI-generated interfaces: which AI model best understands human perception?",
        insight:
          "AI should be evaluated not only by what it generates, but by how well that output supports the way people perceive and organize information.",
      },
    ],
  },
  {
    id: "think-like-a-designer",
    title: "THINK LIKE A DESIGNER",
    subtitle:
      "Can AI move beyond user context and reconsider the assumptions behind its own design?",
    labelLines: ["THINK LIKE", "A DESIGNER"],
    color: STELLAR_PALETTE.agentic,
    meta: "EXPERIMENT 5 OF 5",
    breathDelay: 2.8,
    overview: {
      what:
        "A three-state experiment testing whether more user context is enough to improve AI-generated design—or whether the model also needs to reflect on the assumptions behind its existing solution.",
      why:
        "Designers do not move directly from research to execution. New information changes what we believe the problem is, and AI-assisted design may need the same reflective step.",
      researchFocus:
        "Comparing a generic medication interface, a redesign with a specific user profile, and a third redesign after asking the model which assumptions in its previous solution were now incorrect.",
      keyDiscovery:
        "More context improved the interface. Reflection changed its underlying priorities.",
    },
    sections: [
      {
        id: "question",
        label: "QUESTION",
        short: "QUESTION",
        subtitle: "Can AI reconsider the problem behind its own design?",
        readingTime: 1,
        content:
          "The experiment begins with a deliberately generic request to design a mobile medication management app.\n\nThe first output is usable, but generic by construction. The question is whether the model can recognize when the assumptions behind that interface no longer fit the person it is designing for.",
        insight:
          "A usable interface can still be based on assumptions about a user who does not exist.",
      },
      {
        id: "context",
        label: "CONTEXT",
        short: "CONTEXT",
        subtitle: "What changes when the model knows who it is designing for?",
        readingTime: 2,
        content:
          "A specific user profile changes the interface because the system now has constraints, routines, uncertainty, and support needs that the generic version could not account for.",
        insight:
          "Context changes the solution because it changes what counts as a relevant problem.",
      },
      {
        id: "reflection",
        label: "REFLECTION",
        short: "REFLECTION",
        subtitle: "Ask the model which assumptions are now wrong",
        readingTime: 2,
        content:
          "The third state does not simply add more context. It asks the model to inspect the assumptions behind its previous solution and identify which ones no longer hold.\n\nThat reflective step changes priorities, not just content.",
        insight:
          "Reflection turns context into a reason to revise the model of the problem.",
      },
      {
        id: "finding",
        label: "FINDING",
        short: "FINDING",
        subtitle: "More context improved the interface. Reflection changed its priorities.",
        readingTime: 1,
        content:
          "The experiment suggests that stronger AI-assisted design may depend on more than richer prompts. The system may also need a deliberate opportunity to reconsider its own assumptions before generating the next solution.",
        insight:
          "Design judgment includes knowing when new information should change the problem definition itself.",
      },
    ],
  },
] as const;

export function mobileExperimentFor(id: MobileExperimentId) {
  return (
    MOBILE_EXPERIMENTS.find((experiment) => experiment.id === id) ??
    MOBILE_EXPERIMENTS[0]
  );
}

export const DEFAULT_MOBILE_EXPERIMENT_ID: MobileExperimentId =
  "ai-evaluation";
