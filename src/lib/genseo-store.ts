import type {
  ApiKey,
  Article,
  GenseoAction,
  GenSeoSnapshot,
  GenSeoState,
  Job,
  KeywordPlan,
} from "./genseo-types";
import {
  createKnowledgeDocument,
  generateArticleDraft,
  generateClusters,
  scanInternalLinks,
  scoreArticle,
  syncArticleToWordPress,
} from "./genseo-services";

const now = () => new Date().toISOString();

const initialState: GenSeoState = {
  activeProjectId: "project-demo",
  projects: [
    {
      id: "project-demo",
      name: "GenSEO Growth Hub",
      domain: "genseo.example",
      wordpressUrl: "https://wp.genseo.example",
      status: "processing",
      readinessScore: 86,
      createdAt: "2026-05-14T00:00:00.000Z",
    },
  ],
  apiKeys: [
    {
      id: "key-openai-1",
      projectId: "project-demo",
      provider: "OpenAI",
      maskedKey: "sk-••••••••••••A1",
      status: "active",
      priority: 1,
      requestsToday: 184,
    },
    {
      id: "key-gemini-1",
      projectId: "project-demo",
      provider: "Gemini",
      maskedKey: "gm-••••••••••••B7",
      status: "rate_limited",
      priority: 2,
      lastError: "Daily quota reached",
      requestsToday: 512,
    },
  ],
  documents: [
    {
      id: "doc-seed",
      projectId: "project-demo",
      fileName: "seo-operating-system.txt",
      fileType: "txt",
      status: "processed",
      chunkCount: 3,
      summary:
        "GenSEO combines keyword clustering, RAG content generation, SEO scoring, internal linking, and WordPress publishing.",
      createdAt: "2026-05-14T00:03:00.000Z",
    },
  ],
  chunks: [
    {
      id: "chunk-seed-1",
      projectId: "project-demo",
      documentId: "doc-seed",
      text: "GenSEO uses a Pillar-Cluster workflow to group related keywords around durable SEO topics.",
      keywords: ["genseo", "pillar", "cluster", "keywords", "topics"],
    },
    {
      id: "chunk-seed-2",
      projectId: "project-demo",
      documentId: "doc-seed",
      text: "RAG grounding keeps AI-generated articles aligned with approved business knowledge and reduces hallucination risk.",
      keywords: ["grounding", "generated", "articles", "knowledge", "hallucination"],
    },
    {
      id: "chunk-seed-3",
      projectId: "project-demo",
      documentId: "doc-seed",
      text: "WordPress sync publishes reviewed drafts through the REST API after SEO checks and internal link insertion.",
      keywords: ["wordpress", "publishes", "drafts", "checks", "internal"],
    },
  ],
  keywordPlans: [
    {
      id: "plan-seed",
      projectId: "project-demo",
      seedKeyword: "AI SEO automation",
      status: "completed",
      createdAt: "2026-05-14T00:05:00.000Z",
      clusters: [
        {
          id: "cluster-seed",
          planId: "plan-seed",
          pillarKeyword: "AI SEO automation",
          intent: "Commercial",
          contentAngle:
            "Compare AI workflows that reduce manual SEO production time.",
          keywords: [
            "ai seo automation",
            "seo content automation tool",
            "automated seo workflow",
          ],
          approved: true,
        },
      ],
    },
  ],
  articles: [
    {
      id: "article-seed",
      projectId: "project-demo",
      clusterId: "cluster-seed",
      title: "AI SEO Automation Workflow for Content Teams",
      slug: "ai-seo-automation-workflow-content-teams",
      metaDescription:
        "Build an AI SEO automation workflow with keyword planning, RAG article generation, SEO checks, internal links, and WordPress publishing.",
      outline: [
        "Workflow overview",
        "Inputs and API key rotation",
        "RAG drafting process",
        "Optimization and publishing",
      ],
      content:
        "AI SEO automation combines keyword planning, RAG context, SEO checks, internal link suggestions, and WordPress draft publishing.",
      seoScore: 82,
      seoRules: [
        {
          id: "seed-title",
          label: "SEO title length",
          result: "pass",
          detail: "Title is inside target range.",
        },
        {
          id: "seed-meta",
          label: "Meta description",
          result: "pass",
          detail: "Meta description includes the primary workflow concept.",
        },
        {
          id: "seed-links",
          label: "Internal linking",
          result: "review",
          detail: "Add contextual links after scan.",
        },
      ],
      status: "ready",
      syncStatus: "not_synced",
      updatedAt: "2026-05-14T00:08:00.000Z",
    },
  ],
  internalLinks: [
    {
      id: "link-seed",
      projectId: "project-demo",
      sourceArticleId: "article-seed",
      targetTitle: "Pillar-Cluster Keyword Planning",
      anchorText: "Pillar-Cluster keyword workflow",
      context: "Add near the keyword planning paragraph.",
      confidence: 92,
      approved: true,
    },
  ],
  jobs: [
    {
      id: "job-seed",
      projectId: "project-demo",
      type: "knowledge_ingestion",
      status: "completed",
      message: "Seed Knowledge Base processed into chunks.",
      createdAt: "2026-05-14T00:03:30.000Z",
    },
  ],
};

const state: GenSeoState = structuredClone(initialState);

export function getSnapshot(): GenSeoSnapshot {
  const activeProject =
    state.projects.find((project) => project.id === state.activeProjectId) ??
    state.projects[0];
  const activeApiKey = state.apiKeys
    .filter(
      (apiKey) =>
        apiKey.projectId === activeProject.id && apiKey.status === "active",
    )
    .sort((a, b) => a.priority - b.priority)[0];
  const latestKeywordPlan = state.keywordPlans
    .filter((plan) => plan.projectId === activeProject.id)
    .at(-1);
  const latestArticle = state.articles
    .filter((article) => article.projectId === activeProject.id)
    .at(-1);

  return {
    ...structuredClone(state),
    activeProject,
    activeApiKey,
    latestKeywordPlan,
    latestArticle,
  };
}

export function runAction(action: GenseoAction): GenSeoSnapshot {
  switch (action.type) {
    case "rotateApiKey":
      rotateApiKey(action.projectId);
      break;
    case "ingestDocument":
      ingestDocument(action.projectId, action.fileName, action.content);
      break;
    case "generateKeywordPlan":
      generateKeywordPlan(action.projectId, action.seedKeyword);
      break;
    case "generateArticle":
      generateArticle(action.projectId, action.clusterId);
      break;
    case "scoreArticle":
      updateArticle(action.articleId, (article) => scoreArticle(article));
      addJob(action.projectId, "seo_score", "completed", "SEO score refreshed.");
      break;
    case "scanInternalLinks":
      state.internalLinks = [
        ...state.internalLinks.filter(
          (link) => link.projectId !== action.projectId,
        ),
        ...scanInternalLinks(
          action.projectId,
          state.articles.filter(
            (article) => article.projectId === action.projectId,
          ),
        ),
      ];
      addJob(
        action.projectId,
        "internal_link_scan",
        "completed",
        "Internal link opportunities scanned.",
      );
      break;
    case "syncWordPress":
      updateArticle(action.articleId, (article) => syncArticleToWordPress(article));
      addJob(
        action.projectId,
        "wordpress_sync",
        "completed",
        "Article synced as a WordPress draft.",
      );
      break;
  }

  refreshProjectReadiness(action.projectId);
  return getSnapshot();
}

function rotateApiKey(projectId: string) {
  const keys = state.apiKeys
    .filter((apiKey) => apiKey.projectId === projectId)
    .sort((a, b) => a.priority - b.priority);
  if (keys.length === 0) {
    return;
  }

  const [current, ...fallbacks] = keys;
  const fallback = fallbacks[0] ?? current;
  state.apiKeys = state.apiKeys.map((apiKey): ApiKey => {
    if (apiKey.id === current.id && fallback.id !== current.id) {
      return {
        ...apiKey,
        status: "rate_limited",
        priority: keys.length,
        lastError: "Rotated after simulated quota guard.",
      };
    }
    if (apiKey.id === fallback.id) {
      return {
        ...apiKey,
        status: "active",
        priority: 1,
        lastError: undefined,
      };
    }
    return apiKey;
  });

  addJob(projectId, "api_key_rotation", "completed", "Active AI key rotated.");
}

function ingestDocument(projectId: string, fileName: string, content: string) {
  const { document, chunks } = createKnowledgeDocument(
    projectId,
    fileName,
    content,
  );
  state.documents.push(document);
  state.chunks.push(...chunks);
  addJob(
    projectId,
    "knowledge_ingestion",
    "completed",
    `${document.fileName} processed into ${document.chunkCount} chunks.`,
  );
}

function generateKeywordPlan(projectId: string, seedKeyword: string) {
  const planId = `plan-${Date.now()}`;
  const clusters = generateClusters(seedKeyword).map((cluster) => ({
    ...cluster,
    planId,
  }));
  const plan: KeywordPlan = {
    id: planId,
    projectId,
    seedKeyword,
    status: "completed",
    clusters,
    createdAt: now(),
  };

  state.keywordPlans.push(plan);
  addJob(
    projectId,
    "keyword_plan",
    "completed",
    `Generated ${clusters.length} clusters for "${seedKeyword}".`,
  );
}

function generateArticle(projectId: string, clusterId: string) {
  const cluster = state.keywordPlans
    .flatMap((plan) => plan.clusters)
    .find((item) => item.id === clusterId);
  if (!cluster) {
    addJob(projectId, "article_generation", "failed", "Cluster not found.");
    return;
  }

  const article = generateArticleDraft(
    projectId,
    cluster,
    state.chunks.filter((chunk) => chunk.projectId === projectId),
  );
  state.articles.push(scoreArticle(article));
  addJob(
    projectId,
    "article_generation",
    "completed",
    `Generated draft for "${cluster.pillarKeyword}".`,
  );
}

function updateArticle(
  articleId: string,
  update: (article: Article) => Article,
) {
  state.articles = state.articles.map((article) =>
    article.id === articleId ? update(article) : article,
  );
}

function addJob(
  projectId: string,
  type: Job["type"],
  status: Job["status"],
  message: string,
) {
  state.jobs.unshift({
    id: `job-${Date.now()}-${state.jobs.length + 1}`,
    projectId,
    type,
    status,
    message,
    createdAt: now(),
  });
}

function refreshProjectReadiness(projectId: string) {
  const hasActiveKey = state.apiKeys.some(
    (apiKey) => apiKey.projectId === projectId && apiKey.status === "active",
  );
  const hasKnowledge = state.documents.some(
    (document) => document.projectId === projectId,
  );
  const hasPlan = state.keywordPlans.some((plan) => plan.projectId === projectId);
  const hasReadyArticle = state.articles.some(
    (article) => article.projectId === projectId && article.seoScore >= 80,
  );
  const hasLinkScan = state.internalLinks.some(
    (link) => link.projectId === projectId,
  );
  const hasSync = state.articles.some(
    (article) => article.projectId === projectId && article.syncStatus === "synced",
  );
  const readinessCriteria = [
    hasActiveKey,
    hasKnowledge,
    hasPlan,
    hasReadyArticle,
    hasLinkScan,
    hasSync,
  ];
  const readinessScore = Math.round(
    (readinessCriteria.filter(Boolean).length / readinessCriteria.length) * 100,
  );

  state.projects = state.projects.map((project) =>
    project.id === projectId
      ? {
          ...project,
          readinessScore,
          status: readinessScore === 100 ? "ready" : "processing",
        }
      : project,
  );
}
