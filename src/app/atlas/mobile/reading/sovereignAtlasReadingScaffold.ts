export type SovereignAtlasSectionId =
  | "context"
  | "problem"
  | "approach"
  | "outcomes"
  | "lessons";

export interface SovereignAtlasReadingSection {
  id: SovereignAtlasSectionId;
  number: string;
  label: string;
  subtitle: string;
  readingTime: number;
  previewParagraphs: string[];
}

export const SOVEREIGN_ATLAS_READING = {
  title: "SOVEREIGN ATLAS",
  subtitle:
    "A navigable knowledge system that began as a search feature and evolved through curiosity, constraint, and continuous building.",
  sections: [
    {
      id: "context",
      number: "01",
      label: "THE BEGINNING",
      subtitle: "It Started with Echo",
      readingTime: 3,
      previewParagraphs: [
        "Atlas did not begin as a portfolio. It began as a document.",
        "For months I had been writing the Sovereign UX Codex—a growing collection of frameworks, observations, experiments, and unfinished thoughts about UX, AI, and systems thinking.",
        "As the Codex continued to grow, finding Echo became increasingly difficult. The obvious solution seemed straightforward: add search.",
      ],
    },
    {
      id: "problem",
      number: "02",
      label: "THE PIVOT",
      subtitle: "When Search Stopped Being Enough",
      readingTime: 3,
      previewParagraphs: [
        "Search could retrieve Echo instantly, but search assumes something important: you already know what you are looking for.",
        "Reflection rarely works that way. Many ideas emerged because I encountered something unexpected nearby rather than because I searched for it.",
        "The challenge was no longer finding information. It was preserving discovery.",
      ],
    },
    {
      id: "approach",
      number: "03",
      label: "EMERGENCE",
      subtitle: "One Question Led to Another",
      readingTime: 6,
      previewParagraphs: [
        "Atlas was never designed through a conventional roadmap. Every version answered the question I had at that moment, and every answer exposed a more interesting problem underneath.",
        "The constellation led to the drawer. The drawer led to Focus Mode. Search returned as one navigation method inside a larger exploratory system.",
        "The project became a design-engineering system because each new question eventually exceeded the tools and skills I started with.",
      ],
    },
    {
      id: "outcomes",
      number: "04",
      label: "TRANSFORMATION",
      subtitle: "A Portfolio Became a Knowledge System",
      readingTime: 4,
      previewParagraphs: [
        "Atlas transformed far beyond its original purpose. What began as a search feature became an application for exploring relationships between ideas, projects, experiments, and frameworks.",
        "The project also changed how I work. Learning component architecture, state, performance, and design engineering changed the questions I was able to ask.",
        "The interface does not only claim that I think in systems. It lets people experience one.",
      ],
    },
    {
      id: "lessons",
      number: "05",
      label: "REFLECTION",
      subtitle: "The Project Changed Me More Than I Changed It",
      readingTime: 4,
      previewParagraphs: [
        "Atlas taught me that exploration is not the opposite of structure. Structure can emerge through exploration when the work is continuously reflected on, tested, and reorganized.",
        "Technical decisions are design decisions. Component boundaries, state architecture, performance, and system rules all change what the experience can become.",
        "There is no final version—only the current state of understanding.",
      ],
    },
  ] satisfies SovereignAtlasReadingSection[],
} as const;
