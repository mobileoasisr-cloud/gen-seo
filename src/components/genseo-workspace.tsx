"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type {
  ApiKey,
  Article,
  GenseoAction,
  GenSeoSnapshot,
  Job,
  KeywordCluster,
  KnowledgeDocument,
  SeoRuleResult,
} from "@/lib/genseo-types";

export type WorkspacePage =
  | "dashboard"
  | "projects"
  | "api-keys"
  | "knowledge-base"
  | "keyword-plan"
  | "articles"
  | "internal-links"
  | "wordpress"
  | "jobs";

const navItems: {
  description: string;
  label: string;
  page: WorkspacePage;
  path: string;
}[] = [
  {
    description: "Workspace readiness, KPIs, and latest workflow status.",
    label: "Dashboard",
    page: "dashboard",
    path: "/",
  },
  {
    description: "Project profile, domain, WordPress endpoint, and checklist.",
    label: "Projects",
    page: "projects",
    path: "/projects",
  },
  {
    description: "Provider priority, quota fallback, and active key rotation.",
    label: "API Keys",
    page: "api-keys",
    path: "/api-keys",
  },
  {
    description: "Import source material and inspect retrieved RAG context.",
    label: "Knowledge Base",
    page: "knowledge-base",
    path: "/knowledge-base",
  },
  {
    description: "Generate Pillar-Cluster plans from a seed keyword.",
    label: "Keyword Plan",
    page: "keyword-plan",
    path: "/keyword-plan",
  },
  {
    description: "Generate RAG-grounded drafts and review SEO checks.",
    label: "Articles",
    page: "articles",
    path: "/articles",
  },
  {
    description: "Scan contextual anchors and internal link suggestions.",
    label: "Internal Links",
    page: "internal-links",
    path: "/internal-links",
  },
  {
    description: "Push reviewed drafts to the simulated WordPress endpoint.",
    label: "WordPress",
    page: "wordpress",
    path: "/wordpress",
  },
  {
    description: "Monitor workflow jobs created by each automation step.",
    label: "Jobs",
    page: "jobs",
    path: "/jobs",
  },
];

let workspaceSnapshotCache: GenSeoSnapshot | null = null;

export function GenSeoWorkspace({
  initialSnapshot,
  page = "dashboard",
}: {
  initialSnapshot: GenSeoSnapshot;
  page?: WorkspacePage;
}) {
  const [snapshot, setSnapshot] = useState<GenSeoSnapshot>(
    workspaceSnapshotCache ?? initialSnapshot,
  );
  const [seedKeyword, setSeedKeyword] = useState("AI SEO automation");
  const [fileName, setFileName] = useState("brand-guidelines.txt");
  const [knowledgeContent, setKnowledgeContent] = useState(
    "GenSEO should generate factual SEO content with RAG context, clear keyword intent, SEO scoring, internal links, and WordPress draft sync.",
  );
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectId = snapshot.activeProject.id;
  const activeDocuments = useMemo(
    () =>
      snapshot.documents.filter((document) => document.projectId === projectId),
    [snapshot, projectId],
  );
  const activeArticles = useMemo(
    () =>
      snapshot.articles.filter((article) => article.projectId === projectId),
    [snapshot, projectId],
  );
  const latestReadyCluster = snapshot.latestKeywordPlan?.clusters[0];
  const latestArticle = snapshot.latestArticle;
  const currentPage = navItems.find((item) => item.page === page) ?? navItems[0];

  async function run(action: GenseoAction) {
    setIsMutating(true);
    setError(null);
    try {
      const response = await fetch("/api/genseo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action),
      });
      if (!response.ok) {
        setError("Action failed. Check the API route and try again.");
        return;
      }
      const data = (await response.json()) as GenSeoSnapshot;
      workspaceSnapshotCache = data;
      setSnapshot(data);
    } catch {
      setError("Action failed. Check the API route and try again.");
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.2),_transparent_30%),#020617]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 lg:px-8 lg:py-12">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-400 font-black text-slate-950">
                GS
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-emerald-200">
                  GenSEO
                </p>
                <p className="text-sm text-slate-400">
                  AI content operations for organic growth
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2 text-sm text-slate-300">
              {navItems.map((item) => (
                <Link
                  className={`rounded-full border px-4 py-2 transition ${
                    item.page === page
                      ? "border-emerald-300 bg-emerald-300/10 text-emerald-100"
                      : "border-white/10 hover:border-emerald-300 hover:text-emerald-200"
                  }`}
                  href={item.path}
                  key={item.page}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
                Full-stack GenSEO MVP workspace
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  {currentPage.label}
                </p>
                <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                  {currentPage.description}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Each core module now has its own route so the workflow is easier
                  to scan, test, and expand into production features.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className="rounded-full bg-emerald-300 px-6 py-3 text-center font-bold text-slate-950 shadow-xl shadow-emerald-950/30 transition hover:bg-emerald-200"
                  href="/keyword-plan"
                >
                  Build keyword plan
                </Link>
                <Link
                  className="rounded-full border border-white/15 px-6 py-3 text-center font-bold text-white transition hover:border-white/40"
                  href="/articles"
                >
                  Review SEO editor
                </Link>
              </div>
              {error ? (
                <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100">
                  {error}
                </p>
              ) : null}
            </div>

            <ProjectReadiness snapshot={snapshot} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 lg:px-8">
        <Metrics snapshot={snapshot} />
        {page === "dashboard" ? (
          <DashboardPage snapshot={snapshot} />
        ) : null}
        {page === "projects" ? <ProjectsPage snapshot={snapshot} /> : null}
        {page === "api-keys" ? (
          <ApiKeysPage
            isMutating={isMutating}
            onRotate={() => run({ type: "rotateApiKey", projectId })}
            snapshot={snapshot}
          />
        ) : null}
        {page === "knowledge-base" ? (
          <KnowledgeBasePage
            activeDocuments={activeDocuments}
            fileName={fileName}
            isMutating={isMutating}
            knowledgeContent={knowledgeContent}
            onFileNameChange={setFileName}
            onImport={() =>
              run({
                type: "ingestDocument",
                projectId,
                fileName,
                content: knowledgeContent,
              })
            }
            onKnowledgeContentChange={setKnowledgeContent}
            projectId={projectId}
            snapshot={snapshot}
          />
        ) : null}
        {page === "keyword-plan" ? (
          <KeywordPlanPage
            isMutating={isMutating}
            onGenerate={() =>
              run({
                type: "generateKeywordPlan",
                projectId,
                seedKeyword,
              })
            }
            seedKeyword={seedKeyword}
            setSeedKeyword={setSeedKeyword}
            snapshot={snapshot}
          />
        ) : null}
        {page === "articles" ? (
          <ArticlesPage
            activeArticles={activeArticles}
            isMutating={isMutating}
            latestReadyCluster={latestReadyCluster}
            onGenerate={() =>
              latestReadyCluster
                ? run({
                    type: "generateArticle",
                    projectId,
                    clusterId: latestReadyCluster.id,
                  })
                : undefined
            }
            onScore={(articleId) =>
              run({
                type: "scoreArticle",
                projectId,
                articleId,
              })
            }
            onSync={(articleId) =>
              run({
                type: "syncWordPress",
                projectId,
                articleId,
              })
            }
          />
        ) : null}
        {page === "internal-links" ? (
          <InternalLinksPage
            isMutating={isMutating}
            onScan={() => run({ type: "scanInternalLinks", projectId })}
            snapshot={snapshot}
          />
        ) : null}
        {page === "wordpress" ? (
          <WordPressPage
            isMutating={isMutating}
            latestArticle={latestArticle}
            onSync={(articleId) =>
              run({
                type: "syncWordPress",
                projectId,
                articleId,
              })
            }
          />
        ) : null}
        {page === "jobs" ? <JobsPage snapshot={snapshot} /> : null}
      </section>
    </main>
  );
}

function ProjectReadiness({ snapshot }: { snapshot: GenSeoSnapshot | null }) {
  return (
    <div
      className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur"
      id="dashboard"
    >
      <div className="rounded-[1.5rem] bg-slate-950/80 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Project readiness</p>
            <h2 className="text-2xl font-bold">
              {snapshot?.activeProject.name ?? "Loading workspace"}
            </h2>
          </div>
          <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-sm font-semibold text-emerald-200">
            {snapshot?.activeProject.readinessScore ?? 0}% ready
          </span>
        </div>
        {snapshot ? <ReadinessChecklist snapshot={snapshot} /> : <LoadingBlock />}
      </div>
    </div>
  );
}

function ReadinessChecklist({ snapshot }: { snapshot: GenSeoSnapshot }) {
  const projectId = snapshot.activeProject.id;
  const items = [
    {
      label: "API provider",
      description: snapshot.activeApiKey
        ? `${snapshot.activeApiKey.provider} key active`
        : "Add an AI provider key",
      status: snapshot.activeApiKey ? "ready" : "needs_attention",
    },
    {
      label: "Knowledge Base",
      description: `${snapshot.documents.filter((document) => document.projectId === projectId).length} documents indexed`,
      status: "ready",
    },
    {
      label: "Keyword Plan",
      description: `${snapshot.latestKeywordPlan?.clusters.length ?? 0} active clusters`,
      status: snapshot.latestKeywordPlan ? "ready" : "needs_attention",
    },
    {
      label: "WordPress sync",
      description: snapshot.articles.some(
        (article) => article.syncStatus === "synced",
      )
        ? "Draft sync completed"
        : "Ready to sync reviewed drafts",
      status: snapshot.articles.some((article) => article.syncStatus === "synced")
        ? "ready"
        : "processing",
    },
  ];

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          key={item.label}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-white">{item.label}</p>
              <p className="mt-1 text-sm text-slate-400">{item.description}</p>
            </div>
            <StatusPill status={item.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Metrics({ snapshot }: { snapshot: GenSeoSnapshot | null }) {
  const metrics = [
    {
      label: "Provider keys",
      value: String(snapshot?.apiKeys.length ?? 0),
      detail: "with rotation fallback",
    },
    {
      label: "KB chunks",
      value: String(snapshot?.chunks.length ?? 0),
      detail: "available for RAG",
    },
    {
      label: "Keyword clusters",
      value: String(snapshot?.latestKeywordPlan?.clusters.length ?? 0),
      detail: "latest strategy",
    },
    {
      label: "SEO score",
      value: `${snapshot?.latestArticle?.seoScore ?? 0}%`,
      detail: "latest article",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {metrics.map((metric) => (
        <div
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
          key={metric.label}
        >
          <p className="text-sm text-slate-400">{metric.label}</p>
          <p className="mt-3 text-4xl font-black text-white">{metric.value}</p>
          <p className="mt-2 text-sm text-emerald-200">{metric.detail}</p>
        </div>
      ))}
    </div>
  );
}

function DashboardPage({ snapshot }: { snapshot: GenSeoSnapshot | null }) {
  const latestJobs = snapshot?.jobs.slice(0, 4) ?? [];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Panel eyebrow="Dashboard" id="dashboard-overview" title="Command overview">
        <div className="space-y-4">
          <p className="text-sm leading-6 text-slate-300">
            Start from a focused module instead of scrolling through every
            feature on one screen.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {navItems
              .filter((item) => item.page !== "dashboard")
              .map((item) => (
                <Link
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-300/50 hover:bg-emerald-300/5"
                  href={item.path}
                  key={item.page}
                >
                  <p className="font-semibold text-white">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </Panel>

      <Panel eyebrow="Latest status" id="dashboard-status" title="Workflow health">
        <div className="space-y-5">
          {snapshot ? <ReadinessChecklist snapshot={snapshot} /> : <LoadingBlock />}
          <div className="space-y-3">
            {latestJobs.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

function ProjectsPage({ snapshot }: { snapshot: GenSeoSnapshot | null }) {
  return (
    <Panel eyebrow="Project" id="projects" title="Project command center">
      {snapshot ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-2xl font-bold">
                  {snapshot.activeProject.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Domain: {snapshot.activeProject.domain}
                </p>
                <p className="text-sm text-slate-400">
                  WordPress: {snapshot.activeProject.wordpressUrl}
                </p>
              </div>
              <StatusPill status={snapshot.activeProject.status} />
            </div>
          </div>
          <ReadinessChecklist snapshot={snapshot} />
        </div>
      ) : (
        <LoadingBlock />
      )}
    </Panel>
  );
}

function ApiKeysPage({
  isMutating,
  onRotate,
  snapshot,
}: {
  isMutating: boolean;
  onRotate: () => void;
  snapshot: GenSeoSnapshot | null;
}) {
  return (
    <Panel eyebrow="Settings" id="api-keys" title="API key rotation">
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          {snapshot?.apiKeys.map((apiKey) => (
            <ApiKeyCard apiKey={apiKey} key={apiKey.id} />
          )) ?? <LoadingBlock />}
        </div>
        <ActionButton disabled={!snapshot || isMutating} onClick={onRotate}>
          Rotate active provider key
        </ActionButton>
      </div>
    </Panel>
  );
}

function KnowledgeBasePage({
  activeDocuments,
  fileName,
  isMutating,
  knowledgeContent,
  onFileNameChange,
  onImport,
  onKnowledgeContentChange,
  projectId,
  snapshot,
}: {
  activeDocuments: KnowledgeDocument[];
  fileName: string;
  isMutating: boolean;
  knowledgeContent: string;
  onFileNameChange: (fileName: string) => void;
  onImport: () => void;
  onKnowledgeContentChange: (content: string) => void;
  projectId: string;
  snapshot: GenSeoSnapshot | null;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Panel
        eyebrow="Knowledge Base"
        id="knowledge-base"
        title="RAG ingestion pipeline"
      >
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[0.7fr_1.3fr]">
            <label className="space-y-2 text-sm text-slate-300">
              File name
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-300"
                onChange={(event) => onFileNameChange(event.target.value)}
                value={fileName}
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Source content
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-300"
                onChange={(event) =>
                  onKnowledgeContentChange(event.target.value)
                }
                value={knowledgeContent}
              />
            </label>
          </div>
          <ActionButton
            disabled={!snapshot || isMutating}
            onClick={onImport}
          >
            Import and chunk document
          </ActionButton>
          <div className="grid gap-3">
            {activeDocuments.map((document) => (
              <DocumentCard document={document} key={document.id} />
            ))}
          </div>
        </div>
      </Panel>

      <Panel eyebrow="RAG" id="rag" title="Retrieved context">
        <div className="space-y-3">
          {snapshot?.chunks
            .filter((chunk) => chunk.projectId === projectId)
            .slice(-4)
            .map((chunk) => (
              <div
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                key={chunk.id}
              >
                <p className="text-sm leading-6 text-slate-300">
                  {chunk.text}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-emerald-200">
                  {chunk.keywords.join(" · ")}
                </p>
              </div>
            )) ?? <LoadingBlock />}
        </div>
      </Panel>
    </div>
  );
}

function KeywordPlanPage({
  isMutating,
  onGenerate,
  seedKeyword,
  setSeedKeyword,
  snapshot,
}: {
  isMutating: boolean;
  onGenerate: () => void;
  seedKeyword: string;
  setSeedKeyword: (seedKeyword: string) => void;
  snapshot: GenSeoSnapshot | null;
}) {
  return (
    <Panel eyebrow="Keyword Plan" id="keyword-plan" title="Pillar-Cluster planner">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-300"
            onChange={(event) => setSeedKeyword(event.target.value)}
            value={seedKeyword}
          />
          <ActionButton disabled={!snapshot || isMutating} onClick={onGenerate}>
            Generate clusters
          </ActionButton>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {snapshot?.latestKeywordPlan?.clusters.map((cluster) => (
            <ClusterCard cluster={cluster} key={cluster.id} />
          )) ?? <LoadingBlock />}
        </div>
      </div>
    </Panel>
  );
}

function ArticlesPage({
  activeArticles,
  isMutating,
  latestReadyCluster,
  onGenerate,
  onScore,
  onSync,
}: {
  activeArticles: Article[];
  isMutating: boolean;
  latestReadyCluster: KeywordCluster | undefined;
  onGenerate: () => void;
  onScore: (articleId: string) => void;
  onSync: (articleId: string) => void;
}) {
  return (
    <Panel eyebrow="AI writer" id="articles" title="Article generation and SEO">
      <div className="space-y-5">
        <ActionButton disabled={!latestReadyCluster || isMutating} onClick={onGenerate}>
          Generate article from top cluster
        </ActionButton>
        <div className="grid gap-4">
          {activeArticles.map((article) => (
            <ArticleCard
              article={article}
              isMutating={isMutating}
              key={article.id}
              onScore={() => onScore(article.id)}
              onSync={() => onSync(article.id)}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
}

function InternalLinksPage({
  isMutating,
  onScan,
  snapshot,
}: {
  isMutating: boolean;
  onScan: () => void;
  snapshot: GenSeoSnapshot | null;
}) {
  return (
    <Panel eyebrow="Automation" id="internal-links" title="Internal linking">
      <div className="space-y-4">
        <ActionButton disabled={!snapshot || isMutating} onClick={onScan}>
          Scan internal links
        </ActionButton>
        <div className="space-y-3">
          {snapshot?.internalLinks.map((link) => (
            <div
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              key={link.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{link.anchorText}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Target: {link.targetTitle}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-sm font-bold text-emerald-200">
                  {link.confidence}%
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{link.context}</p>
            </div>
          )) ?? <LoadingBlock />}
        </div>
      </div>
    </Panel>
  );
}

function WordPressPage({
  isMutating,
  latestArticle,
  onSync,
}: {
  isMutating: boolean;
  latestArticle: Article | undefined;
  onSync: (articleId: string) => void;
}) {
  return (
    <Panel eyebrow="Publishing" id="wordpress" title="WordPress sync">
      {latestArticle ? (
        <div className="space-y-4">
          <p className="text-sm leading-6 text-slate-300">
            Latest article:{" "}
            <span className="font-semibold text-white">
              {latestArticle.title}
            </span>
          </p>
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
            <p>Status: {latestArticle.status}</p>
            <p>Sync: {latestArticle.syncStatus}</p>
            <p>Post ID: {latestArticle.wordpressPostId ?? "Not synced"}</p>
          </div>
          <ActionButton
            disabled={isMutating}
            onClick={() => onSync(latestArticle.id)}
          >
            Sync latest article as draft
          </ActionButton>
        </div>
      ) : (
        <LoadingBlock />
      )}
    </Panel>
  );
}

function JobsPage({ snapshot }: { snapshot: GenSeoSnapshot | null }) {
  return (
    <Panel eyebrow="Background jobs" id="jobs" title="Processing timeline">
      <div className="space-y-3">
        {snapshot?.jobs.slice(0, 12).map((job) => (
          <JobCard job={job} key={job.id} />
        )) ?? <LoadingBlock />}
      </div>
    </Panel>
  );
}

function Panel({
  children,
  eyebrow,
  id,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <section
      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20"
      id={id}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-200">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ActionButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-300"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ApiKeyCard({ apiKey }: { apiKey: ApiKey }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{apiKey.provider}</p>
          <p className="mt-1 font-mono text-sm text-slate-400">
            {apiKey.maskedKey}
          </p>
        </div>
        <StatusPill status={apiKey.status} />
      </div>
      <p className="mt-3 text-sm text-slate-400">
        Priority {apiKey.priority} · {apiKey.requestsToday} requests today
      </p>
      {apiKey.lastError ? (
        <p className="mt-2 text-sm text-amber-200">{apiKey.lastError}</p>
      ) : null}
    </div>
  );
}

function DocumentCard({ document }: { document: KnowledgeDocument }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{document.fileName}</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            {document.summary}
          </p>
        </div>
        <StatusPill status={document.status} />
      </div>
      <p className="mt-3 text-sm text-emerald-200">
        {document.chunkCount} chunks indexed
      </p>
    </div>
  );
}

function ClusterCard({ cluster }: { cluster: KeywordCluster }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xl font-bold text-white">{cluster.pillarKeyword}</p>
          <p className="mt-2 text-sm text-emerald-200">{cluster.intent}</p>
        </div>
        <StatusPill status={cluster.approved ? "ready" : "processing"} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">
        {cluster.contentAngle}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {cluster.keywords.map((keyword) => (
          <span
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
            key={keyword}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  isMutating,
  onScore,
  onSync,
}: {
  article: Article;
  isMutating: boolean;
  onScore: () => void;
  onSync: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{article.title}</p>
          <p className="mt-2 text-sm text-slate-400">/{article.slug}</p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {article.metaDescription}
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-300/15 p-4 text-center">
          <p className="text-sm text-emerald-100">SEO score</p>
          <p className="text-4xl font-black text-emerald-200">
            {article.seoScore}%
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {article.seoRules.map((rule) => (
          <div
            className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
            key={rule.id}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-white">{rule.label}</p>
              <RuleBadge result={rule.result} />
            </div>
            <p className="mt-2 text-sm text-slate-400">{rule.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <ActionButton disabled={isMutating} onClick={onScore}>
          Re-run SEO score
        </ActionButton>
        <ActionButton disabled={isMutating} onClick={onSync}>
          Sync to WordPress
        </ActionButton>
      </div>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold capitalize text-white">
            {job.type.replaceAll("_", " ")}
          </p>
          <p className="mt-1 text-sm text-slate-400">{job.message}</p>
        </div>
        <StatusPill status={job.status} />
      </div>
    </div>
  );
}

function RuleBadge({ result }: { result: SeoRuleResult }) {
  const classes = {
    pass: "bg-emerald-300/15 text-emerald-200",
    review: "bg-amber-300/15 text-amber-200",
    fail: "bg-red-300/15 text-red-200",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${classes[result]}`}
    >
      {result}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const normalized = status.replaceAll("_", " ");
  const isReady =
    status === "ready" ||
    status === "active" ||
    status === "processed" ||
    status === "completed" ||
    status === "synced";
  const isWarning =
    status === "processing" ||
    status === "running" ||
    status === "queued" ||
    status === "seo_review" ||
    status === "rate_limited" ||
    status === "needs_attention";
  const className = isReady
    ? "bg-emerald-300/15 text-emerald-200"
    : isWarning
      ? "bg-amber-300/15 text-amber-200"
      : "bg-red-300/15 text-red-200";

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase ${className}`}
    >
      {normalized}
    </span>
  );
}

function LoadingBlock() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
      Loading GenSEO workspace...
    </div>
  );
}
