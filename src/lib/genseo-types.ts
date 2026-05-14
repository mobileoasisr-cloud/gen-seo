export type ProjectStatus = "ready" | "needs_attention" | "processing";

export type Provider = "OpenAI" | "Gemini";

export type ApiKeyStatus = "active" | "rate_limited" | "disabled";

export type DocumentStatus = "queued" | "processing" | "processed" | "failed";

export type SearchIntent = "Informational" | "Commercial" | "Transactional";

export type JobStatus = "queued" | "running" | "completed" | "failed";

export type ArticleStatus = "draft" | "seo_review" | "ready" | "synced";

export type SyncStatus = "not_synced" | "queued" | "synced" | "failed";

export type SeoRuleResult = "pass" | "review" | "fail";

export type Project = {
  id: string;
  name: string;
  domain: string;
  wordpressUrl: string;
  status: ProjectStatus;
  readinessScore: number;
  createdAt: string;
};

export type ApiKey = {
  id: string;
  projectId: string;
  provider: Provider;
  maskedKey: string;
  status: ApiKeyStatus;
  priority: number;
  lastError?: string;
  requestsToday: number;
};

export type KnowledgeDocument = {
  id: string;
  projectId: string;
  fileName: string;
  fileType: "pdf" | "txt" | "csv";
  status: DocumentStatus;
  chunkCount: number;
  summary: string;
  createdAt: string;
};

export type KnowledgeChunk = {
  id: string;
  projectId: string;
  documentId: string;
  text: string;
  keywords: string[];
};

export type KeywordCluster = {
  id: string;
  planId: string;
  pillarKeyword: string;
  intent: SearchIntent;
  contentAngle: string;
  keywords: string[];
  approved: boolean;
};

export type KeywordPlan = {
  id: string;
  projectId: string;
  seedKeyword: string;
  status: JobStatus;
  clusters: KeywordCluster[];
  createdAt: string;
};

export type SeoRule = {
  id: string;
  label: string;
  result: SeoRuleResult;
  detail: string;
};

export type Article = {
  id: string;
  projectId: string;
  clusterId: string;
  title: string;
  slug: string;
  metaDescription: string;
  outline: string[];
  content: string;
  seoScore: number;
  seoRules: SeoRule[];
  status: ArticleStatus;
  syncStatus: SyncStatus;
  wordpressPostId?: string;
  updatedAt: string;
};

export type InternalLinkSuggestion = {
  id: string;
  projectId: string;
  sourceArticleId: string;
  targetTitle: string;
  anchorText: string;
  context: string;
  confidence: number;
  approved: boolean;
};

export type Job = {
  id: string;
  projectId: string;
  type:
    | "api_key_rotation"
    | "knowledge_ingestion"
    | "keyword_plan"
    | "article_generation"
    | "seo_score"
    | "internal_link_scan"
    | "wordpress_sync";
  status: JobStatus;
  message: string;
  createdAt: string;
};

export type GenSeoState = {
  activeProjectId: string;
  projects: Project[];
  apiKeys: ApiKey[];
  documents: KnowledgeDocument[];
  chunks: KnowledgeChunk[];
  keywordPlans: KeywordPlan[];
  articles: Article[];
  internalLinks: InternalLinkSuggestion[];
  jobs: Job[];
};

export type GenSeoSnapshot = GenSeoState & {
  activeProject: Project;
  activeApiKey?: ApiKey;
  latestKeywordPlan?: KeywordPlan;
  latestArticle?: Article;
};

export type GenseoAction =
  | {
      type: "rotateApiKey";
      projectId: string;
    }
  | {
      type: "ingestDocument";
      projectId: string;
      fileName: string;
      content: string;
    }
  | {
      type: "generateKeywordPlan";
      projectId: string;
      seedKeyword: string;
    }
  | {
      type: "generateArticle";
      projectId: string;
      clusterId: string;
    }
  | {
      type: "scoreArticle";
      projectId: string;
      articleId: string;
    }
  | {
      type: "scanInternalLinks";
      projectId: string;
    }
  | {
      type: "syncWordPress";
      projectId: string;
      articleId: string;
    };
