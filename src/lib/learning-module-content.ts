/** Demo lesson outlines — Microsoft Learn–style units per programme module. */

export type UnitType = "reading" | "scenario" | "quiz";

export interface LearningUnit {
  id: string;
  type: UnitType;
  title: string;
  durationMin: number;
}

export interface LearningModuleOutline {
  index: number;
  title: string;
  units: LearningUnit[];
}

export interface ReadingBlock {
  kind: "heading" | "paragraph" | "list" | "callout";
  text: string;
  calloutVariant?: "note" | "tip" | "important";
}

export interface QuizOption {
  id: string;
  text: string;
  correct?: boolean;
}

export interface QuizQuestion {
  prompt: string;
  options: QuizOption[];
  explanation: string;
}

export interface ScenarioStep {
  title: string;
  body: string;
  choice?: string;
}

const FPS_L1_MODULES = [
  "Welcome & programme overview",
  "Ecobank advisory standards",
  "SMART goals — specific & measurable",
  "SMART goals — achievable & relevant",
  "Suitability foundations",
  "Risk profiling in practice",
  "Household & joint mandates",
  "Goal pathways & simulations",
  "Regional policy addendum",
  "FPS Level I assessment prep",
];

const GENERIC_MODULES = (total: number, programme: string) =>
  Array.from({ length: total }, (_, i) => `${programme} — module ${i + 1}`);

export function getModuleOutlines(certId: string, modulesTotal: number): LearningModuleOutline[] {
  const titles =
    certId === "fps-l1"
      ? FPS_L1_MODULES.slice(0, modulesTotal)
      : GENERIC_MODULES(modulesTotal, "Programme module");

  return titles.map((title, index) => ({
    index: index + 1,
    title,
    units: [
      {
        id: `m${index + 1}-read`,
        type: "reading",
        title: "Introduction",
        durationMin: 8,
      },
      {
        id: `m${index + 1}-scenario`,
        type: "scenario",
        title: "Apply in context",
        durationMin: 6,
      },
      {
        id: `m${index + 1}-quiz`,
        type: "quiz",
        title: "Check your knowledge",
        durationMin: 4,
      },
    ],
  }));
}

export function getReadingContent(
  certId: string,
  moduleIndex: number,
  certTitle: string,
): { objectives: string[]; blocks: ReadingBlock[] } {
  const moduleTitle =
    certId === "fps-l1"
      ? FPS_L1_MODULES[moduleIndex - 1] ?? `Module ${moduleIndex}`
      : `Module ${moduleIndex}`;

  const objectives =
    certId === "fps-l1" && moduleIndex === 8
      ? [
          "Link goal pathways to suitability documentation before product discussion.",
          "Explain glidepath adjustments after what-if simulations to clients.",
          "Apply regional disclosure requirements for Ghana cluster advisors.",
        ]
      : [
          `Understand the core concepts in ${moduleTitle}.`,
          "Apply learning to the next client planning session.",
          "Meet group competency requirements for your career path.",
        ];

  const blocks: ReadingBlock[] =
    certId === "fps-l1" && moduleIndex === 8
      ? [
          {
            kind: "paragraph",
            text: "Goal pathways connect SMART objectives to funded sleeves and suitability records. After a what-if simulation (early retirement, education stress, or FX shock), advisors must document whether the glidepath still matches the client's risk persona.",
          },
          {
            kind: "callout",
            calloutVariant: "important",
            text: "Before recommending a product change post-simulation, re-open suitability prompts in meeting mode. The compliance rail must show appropriateness, affordability, and regional disclosures as complete.",
          },
          {
            kind: "heading",
            text: "Workflow in eProcess",
          },
          {
            kind: "list",
            text: "Open Client 360 → confirm goals and holdings are synced from CRM.|Start meeting mode → run what-if on the priority goal.|If drift exceeds policy threshold, open rebalance preview and attach rationale.|Complete suitability attestation before ending the session.",
          },
          {
            kind: "callout",
            calloutVariant: "tip",
            text: "Use presenter mode for branch walkthroughs; the client mobile handoff banner keeps continuity when the client continues on their device.",
          },
        ]
      : [
          {
            kind: "paragraph",
            text: `This unit covers ${moduleTitle} as part of ${certTitle}. Content is aligned with group wealth advisory standards and your cluster's assigned plan.`,
          },
          {
            kind: "callout",
            calloutVariant: "note",
            text: "Regional policy addenda may apply for Francophone and Lusophone markets — check Markets & tax if the household has cross-border reporting.",
          },
          {
            kind: "heading",
            text: "Key takeaways",
          },
          {
            kind: "list",
            text: "Document client outcomes in CRM after each planning session.|Sync completions to HR Learning — progress updates within 15 minutes.|Mandatory programmes must be finished before the due date on your assignments list.",
          },
        ];

  return { objectives, blocks };
}

export function getScenarioContent(certId: string, moduleIndex: number): ScenarioStep[] {
  if (certId === "fps-l1" && moduleIndex === 8) {
    return [
      {
        title: "Client context",
        body: "The Mensah household completed an early-retirement what-if. Retirement sleeve drift is 14% above glidepath. They want to reduce equity exposure but keep education funding on track.",
      },
      {
        title: "Your decision",
        body: "You open rebalance preview, adjust the retirement sleeve toward policy weights, and document the rationale in meeting recap. Suitability prompts were completed before product discussion.",
        choice: "Appropriate — simulation linked to goal, disclosures refreshed",
      },
      {
        title: "Outcome",
        body: "CPD credit applies when you complete this module and the attestation. HR Learning receives the completion event; competency domain Planning moves toward your Senior RM gate.",
      },
    ];
  }

  return [
    {
      title: "Situation",
      body: "A client asks to proceed with a structured note after a goal review. CRM shows balanced growth persona; last suitability was 11 months ago.",
    },
    {
      title: "Best practice",
      body: "Re-run appropriateness and complex-product prompts in the compliance center before proceeding. Attach disclosure PDF to the household record.",
      choice: "Follow embedded compliance workflow",
    },
    {
      title: "Result",
      body: "Session is auditable; module progress saves to your transcript when you finish the knowledge check below.",
    },
  ];
}

export function getQuizQuestion(certId: string, moduleIndex: number): QuizQuestion {
  if (certId === "fps-l1" && moduleIndex === 8) {
    return {
      prompt:
        "After a what-if simulation shows sleeve drift above policy threshold, what must happen before product recommendations?",
      options: [
        { id: "a", text: "Email marketing a new fund list to the client" },
        {
          id: "b",
          text: "Re-open suitability / appropriateness prompts and document rationale",
          correct: true,
        },
        { id: "c", text: "Archive the goal and create a new household" },
        { id: "d", text: "Skip compliance if the client is sophisticated" },
      ],
      explanation:
        "Simulations inform the plan but do not replace suitability. Embedded prompts and sealed artefacts maintain the audit trail required by group compliance.",
    };
  }

  return {
    prompt: "Where should advisor session outcomes be recorded for audit and CRM continuity?",
    options: [
      { id: "a", text: "Personal notes only" },
      { id: "b", text: "Client 360 / meeting recap with compliance artefacts", correct: true },
      { id: "c", text: "External spreadsheet" },
      { id: "d", text: "No record needed for goal-only discussions" },
    ],
    explanation:
      "eProcess is designed for omnichannel continuity — CRM, compliance centre, and HR Learning sync from documented session outcomes.",
  };
}
