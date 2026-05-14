import type {
  Article,
  InternalLinkSuggestion,
  KeywordCluster,
  KnowledgeChunk,
  KnowledgeDocument,
  SeoRule,
} from "./genseo-types";

const now = () => new Date().toISOString();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function createKnowledgeDocument(
  projectId: string,
  fileName: string,
  content: string,
): {
  document: KnowledgeDocument;
  chunks: KnowledgeChunk[];
} {
  const documentId = `doc-${Date.now()}`;
  const rawChunks = content
    .split(/\n{2,}|(?<=\.)\s+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .slice(0, 8);

  const chunks = rawChunks.map((text, index) => ({
    id: `${documentId}-chunk-${index + 1}`,
    projectId,
    documentId,
    text,
    keywords: extractKeywords(text).slice(0, 5),
  }));

  return {
    document: {
      id: documentId,
      projectId,
      fileName,
      fileType: fileName.endsWith(".csv")
        ? "csv"
        : fileName.endsWith(".pdf")
          ? "pdf"
          : "txt",
      status: "processed",
      chunkCount: chunks.length,
      summary:
        chunks[0]?.text.slice(0, 140) ||
        "Knowledge source imported and ready for RAG grounding.",
      createdAt: now(),
    },
    chunks,
  };
}

export function generateClusters(seedKeyword: string): KeywordCluster[] {
  const normalizedSeed = seedKeyword.trim() || "AI SEO automation";
  const base = normalizedSeed.toLowerCase();

  return [
    {
      id: `cluster-${Date.now()}-1`,
      planId: "",
      pillarKeyword: normalizedSeed,
      intent: "Commercial",
      contentAngle: `Compare workflows, cost savings, and automation depth for ${base}.`,
      keywords: [
        base,
        `${base} platform`,
        `${base} workflow`,
        `best ${base} tool`,
      ],
      approved: true,
    },
    {
      id: `cluster-${Date.now()}-2`,
      planId: "",
      pillarKeyword: `${normalizedSeed} strategy`,
      intent: "Informational",
      contentAngle: `Explain the Pillar-Cluster strategy behind ${base} for SEO teams.`,
      keywords: [
        `${base} strategy`,
        `${base} pillar cluster`,
        `${base} keyword planning`,
      ],
      approved: false,
    },
    {
      id: `cluster-${Date.now()}-3`,
      planId: "",
      pillarKeyword: `${normalizedSeed} implementation`,
      intent: "Transactional",
      contentAngle: `Show implementation steps from API keys to WordPress publishing.`,
      keywords: [
        `${base} implementation`,
        `${base} wordpress`,
        `${base} rag setup`,
      ],
      approved: false,
    },
  ];
}

export function generateArticleDraft(
  projectId: string,
  cluster: KeywordCluster,
  chunks: KnowledgeChunk[],
): Article {
  const retrievedChunks = retrieveRelevantChunks(cluster, chunks);
  const supportingFacts = retrievedChunks.length
    ? retrievedChunks.map((chunk) => chunk.text).join(" ")
    : "Use API key rotation, RAG grounding, SEO scoring, internal links, and WordPress sync as the core production workflow.";
  const title = `How to Build a ${cluster.pillarKeyword} Workflow`;

  return {
    id: `article-${Date.now()}`,
    projectId,
    clusterId: cluster.id,
    title,
    slug: slugify(title),
    metaDescription: `${title} with RAG grounding, SEO optimization, internal links, and publishing automation.`,
    outline: [
      `What ${cluster.pillarKeyword} solves`,
      "Required inputs: API keys, WordPress, and Knowledge Base",
      "Pillar-Cluster generation workflow",
      "SEO scoring and internal linking",
      "Publishing checklist",
    ],
    content: [
      `# ${title}`,
      "",
      `${cluster.contentAngle} The workflow starts by collecting business knowledge, clustering related keywords, and using retrieval to keep every generated draft aligned with approved source material.`,
      "",
      `RAG context: ${supportingFacts}`,
      "",
      "After drafting, the system checks title, meta description, heading structure, keyword coverage, readability, and internal linking opportunities before syncing a reviewed draft to WordPress.",
    ].join("\n"),
    seoScore: 0,
    seoRules: [],
    status: "draft",
    syncStatus: "not_synced",
    updatedAt: now(),
  };
}

export function scoreArticle(article: Article): Article {
  const rules: SeoRule[] = [
    {
      id: "title-length",
      label: "SEO title length",
      result:
        article.title.length >= 35 && article.title.length <= 65
          ? "pass"
          : "review",
      detail: "Target 35-65 characters.",
    },
    {
      id: "meta-description",
      label: "Meta description",
      result:
        article.metaDescription.length >= 120 &&
        article.metaDescription.length <= 160
          ? "pass"
          : "review",
      detail: "Target 120-160 characters with the primary keyword.",
    },
    {
      id: "heading-structure",
      label: "Heading structure",
      result: article.outline.length >= 4 ? "pass" : "fail",
      detail: "Use a complete H2/H3 outline before generation.",
    },
    {
      id: "rag-grounding",
      label: "RAG grounding",
      result: article.content.includes("RAG context") ? "pass" : "fail",
      detail: "Draft should include retrieved business knowledge.",
    },
    {
      id: "internal-links",
      label: "Internal linking",
      result: article.content.toLowerCase().includes("internal link")
        ? "pass"
        : "review",
      detail: "Add contextual links to related articles.",
    },
  ];

  const score = Math.round(
    (rules.reduce(
      (total, rule) =>
        total + (rule.result === "pass" ? 20 : rule.result === "review" ? 10 : 0),
      0,
    ) /
      100) *
      100,
  );

  return {
    ...article,
    seoRules: rules,
    seoScore: score,
    status: score >= 80 ? "ready" : "seo_review",
    updatedAt: now(),
  };
}

export function scanInternalLinks(
  projectId: string,
  articles: Article[],
): InternalLinkSuggestion[] {
  return articles.slice(0, 3).map((article, index) => ({
    id: `link-${Date.now()}-${index + 1}`,
    projectId,
    sourceArticleId: article.id,
    targetTitle: "AI SEO automation operating system",
    anchorText: "AI SEO automation workflow",
    context:
      "Mention this anchor near the RAG and publishing checklist section.",
    confidence: 92 - index * 4,
    approved: index === 0,
  }));
}

export function syncArticleToWordPress(article: Article): Article {
  return {
    ...article,
    status: "synced",
    syncStatus: "synced",
    wordpressPostId: `wp-${Math.floor(10000 + Math.random() * 89999)}`,
    updatedAt: now(),
  };
}

function retrieveRelevantChunks(
  cluster: KeywordCluster,
  chunks: KnowledgeChunk[],
): KnowledgeChunk[] {
  const keywordSet = new Set(
    [cluster.pillarKeyword, ...cluster.keywords]
      .flatMap((keyword) => keyword.toLowerCase().split(/\s+/))
      .filter((word) => word.length > 3),
  );

  return chunks
    .map((chunk) => ({
      chunk,
      score: chunk.keywords.filter((keyword) =>
        keywordSet.has(keyword.toLowerCase()),
      ).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ chunk }) => chunk)
    .slice(0, 3);
}

function extractKeywords(text: string) {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 4),
    ),
  );
}
