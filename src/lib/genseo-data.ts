export type ReadinessItem = {
  label: string;
  description: string;
  status: "ready" | "warning" | "pending";
};

export type Metric = {
  label: string;
  value: string;
  change: string;
};

export type KeywordCluster = {
  pillar: string;
  intent: "Informational" | "Commercial" | "Transactional";
  angle: string;
  keywords: string[];
  articles: number;
};

export type PipelineStage = {
  title: string;
  description: string;
  status: "done" | "running" | "queued";
};

export type SeoRule = {
  rule: string;
  result: "pass" | "review" | "fail";
  detail: string;
};

export type InternalLinkSuggestion = {
  source: string;
  target: string;
  anchor: string;
  confidence: string;
};

export const readinessItems: ReadinessItem[] = [
  {
    label: "AI API Keys",
    description: "3 keys active, rotation enabled for OpenAI and Gemini.",
    status: "ready",
  },
  {
    label: "WordPress Connection",
    description: "Draft sync configured for gen-seo-demo.com.",
    status: "ready",
  },
  {
    label: "Knowledge Base",
    description: "12 documents processed, 1 CSV waiting for review.",
    status: "warning",
  },
  {
    label: "Internal Linking",
    description: "Run a full crawl before auto-inserting contextual links.",
    status: "pending",
  },
];

export const dashboardMetrics: Metric[] = [
  {
    label: "Projects",
    value: "8",
    change: "+2 this month",
  },
  {
    label: "Keyword Clusters",
    value: "124",
    change: "36 approved",
  },
  {
    label: "Articles Generated",
    value: "418",
    change: "91% SEO-ready",
  },
  {
    label: "WP Sync Success",
    value: "97.4%",
    change: "last 7 days",
  },
];

export const keywordClusters: KeywordCluster[] = [
  {
    pillar: "AI SEO automation",
    intent: "Commercial",
    angle: "Compare AI workflows that reduce manual SEO production time.",
    keywords: [
      "ai seo automation",
      "seo content automation tool",
      "automated seo workflow",
    ],
    articles: 12,
  },
  {
    pillar: "Knowledge base RAG",
    intent: "Informational",
    angle: "Explain how private documents improve factual SEO content.",
    keywords: ["rag knowledge base", "ai content with company data", "seo rag"],
    articles: 8,
  },
  {
    pillar: "WordPress auto posting",
    intent: "Transactional",
    angle: "Show how scheduled drafts move from editor to WordPress safely.",
    keywords: [
      "wordpress auto post seo",
      "publish ai article wordpress",
      "wordpress content automation",
    ],
    articles: 6,
  },
];

export const ragPipeline: PipelineStage[] = [
  {
    title: "Import",
    description: "PDF, TXT, and CSV assets are attached to the active project.",
    status: "done",
  },
  {
    title: "Extract & Chunk",
    description: "Documents are normalized, split, and enriched with metadata.",
    status: "done",
  },
  {
    title: "Embed",
    description: "Chunks are embedded for semantic retrieval during generation.",
    status: "running",
  },
  {
    title: "Ground Article",
    description: "Relevant chunks are injected into outline and article prompts.",
    status: "queued",
  },
];

export const seoRules: SeoRule[] = [
  {
    rule: "Primary keyword in title",
    result: "pass",
    detail: "Keyword appears near the beginning of the SEO title.",
  },
  {
    rule: "Meta description length",
    result: "pass",
    detail: "154 characters with a clear benefit statement.",
  },
  {
    rule: "Heading structure",
    result: "review",
    detail: "Add one H2 for implementation risks before publishing.",
  },
  {
    rule: "Internal link coverage",
    result: "fail",
    detail: "Only one contextual link found; target is three or more.",
  },
];

export const internalLinkSuggestions: InternalLinkSuggestion[] = [
  {
    source: "How RAG improves SEO accuracy",
    target: "AI SEO automation platform guide",
    anchor: "AI SEO automation platform",
    confidence: "92%",
  },
  {
    source: "WordPress draft publishing workflow",
    target: "Internal linking automation checklist",
    anchor: "internal linking automation",
    confidence: "87%",
  },
  {
    source: "Keyword cluster approval process",
    target: "Pillar cluster SEO strategy",
    anchor: "pillar cluster SEO strategy",
    confidence: "84%",
  },
];

export const jobs = [
  {
    name: "Generate cluster plan",
    status: "Completed",
    time: "2m 18s",
  },
  {
    name: "Embed knowledge chunks",
    status: "Running",
    time: "642/980 chunks",
  },
  {
    name: "Sync article draft",
    status: "Queued",
    time: "WordPress",
  },
];
