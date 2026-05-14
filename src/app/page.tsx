import {
  dashboardMetrics,
  internalLinkSuggestions,
  jobs,
  keywordClusters,
  ragPipeline,
  readinessItems,
  seoRules,
} from "@/lib/genseo-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.2),_transparent_30%),#020617]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-8 lg:px-8 lg:py-12">
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
              {["Dashboard", "Keyword Plan", "Articles", "RAG", "Settings"].map(
                (item) => (
                  <a
                    className="rounded-full border border-white/10 px-4 py-2 transition hover:border-emerald-300 hover:text-emerald-200"
                    href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                    key={item}
                  >
                    {item}
                  </a>
                ),
              )}
            </nav>
          </header>

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-7">
              <div className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
                GENSEO-inspired MVP blueprint
              </div>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
                  Automate SEO content from keyword strategy to WordPress draft.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  GenSEO combines Pillar–Cluster planning, RAG-grounded article
                  generation, on-page SEO checks, internal link suggestions, API
                  key rotation, and publishing workflows in one project
                  dashboard.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  className="rounded-full bg-emerald-300 px-6 py-3 text-center font-bold text-slate-950 shadow-xl shadow-emerald-950/30 transition hover:bg-emerald-200"
                  href="#keyword-plan"
                >
                  Build keyword plan
                </a>
                <a
                  className="rounded-full border border-white/15 px-6 py-3 text-center font-bold text-white transition hover:border-white/40"
                  href="#articles"
                >
                  Review SEO editor
                </a>
              </div>
            </div>

            <div
              className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur"
              id="dashboard"
            >
              <div className="rounded-[1.5rem] bg-slate-950/80 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Project readiness</p>
                    <h2 className="text-2xl font-bold">Organic Growth Hub</h2>
                  </div>
                  <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-sm font-semibold text-emerald-200">
                    86% ready
                  </span>
                </div>
                <div className="space-y-3">
                  {readinessItems.map((item) => (
                    <div
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      key={item.label}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {item.description}
                          </p>
                        </div>
                        <StatusPill status={item.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-8 lg:grid-cols-4 lg:px-8">
        {dashboardMetrics.map((metric) => (
          <div
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            key={metric.label}
          >
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className="mt-3 text-4xl font-black">{metric.value}</p>
            <p className="mt-2 text-sm text-emerald-200">{metric.change}</p>
          </div>
        ))}
      </section>

      <section
        className="mx-auto grid w-full max-w-7xl gap-6 px-6 pb-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8"
        id="keyword-plan"
      >
        <Panel eyebrow="Keyword Plan" title="Pillar–Cluster strategy board">
          <div className="space-y-4">
            {keywordClusters.map((cluster) => (
              <article
                className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-950"
                key={cluster.pillar}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
                      {cluster.intent}
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      {cluster.pillar}
                    </h3>
                    <p className="mt-2 text-slate-600">{cluster.angle}</p>
                  </div>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-white">
                    {cluster.articles} articles
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cluster.keywords.map((keyword) => (
                    <span
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                      key={keyword}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Knowledge Base" id="rag" title="RAG document pipeline">
          <div className="space-y-4">
            {ragPipeline.map((stage, index) => (
              <div className="flex gap-4" key={stage.title}>
                <div className="flex flex-col items-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-emerald-300 font-black text-slate-950">
                    {index + 1}
                  </div>
                  {index < ragPipeline.length - 1 ? (
                    <div className="h-full w-px bg-slate-700" />
                  ) : null}
                </div>
                <div className="pb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{stage.title}</h3>
                    <StatusPill status={stage.status} />
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section
        className="mx-auto grid w-full max-w-7xl gap-6 px-6 pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"
        id="articles"
      >
        <Panel eyebrow="Article Editor" title="SEO optimizer preview">
          <div className="rounded-3xl bg-white p-5 text-slate-950">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Draft article
            </p>
            <h3 className="mt-3 text-3xl font-black">
              How AI SEO Automation Builds Safer Content Pipelines
            </h3>
            <p className="mt-3 text-slate-600">
              Meta: Learn how AI SEO automation combines keyword clustering,
              RAG, SEO scoring, and WordPress publishing to scale content
              without losing factual accuracy.
            </p>
            <div className="mt-5 grid gap-3">
              {seoRules.map((rule) => (
                <div
                  className="rounded-2xl border border-slate-200 p-4"
                  key={rule.rule}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{rule.rule}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {rule.detail}
                      </p>
                    </div>
                    <RuleBadge result={rule.result} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Automation" title="Internal links and publishing jobs">
          <div className="grid gap-5">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-5">
              <h3 className="text-xl font-black">Internal link suggestions</h3>
              <div className="mt-4 space-y-3">
                {internalLinkSuggestions.map((suggestion) => (
                  <div
                    className="rounded-2xl bg-white/[0.04] p-4"
                    key={`${suggestion.source}-${suggestion.target}`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-semibold">{suggestion.anchor}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {suggestion.source} → {suggestion.target}
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-400/15 px-3 py-1 text-sm font-bold text-blue-200">
                        {suggestion.confidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-5">
              <h3 className="text-xl font-black">Background jobs</h3>
              <div className="mt-4 grid gap-3">
                {jobs.map((job) => (
                  <div
                    className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-4"
                    key={job.name}
                  >
                    <div>
                      <p className="font-semibold">{job.name}</p>
                      <p className="text-sm text-slate-400">{job.time}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-200">
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </section>

      <section
        className="mx-auto w-full max-w-7xl px-6 pb-12 lg:px-8"
        id="settings"
      >
        <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-200">
                MVP roadmap
              </p>
              <h2 className="mt-3 text-3xl font-black">
                Next step: connect real data services behind this product shell.
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                The first implementation establishes the product information
                architecture. The next phases should add authentication,
                PostgreSQL/pgvector storage, encrypted credentials, LLM gateway,
                background queues, and WordPress REST API publishing.
              </p>
            </div>
            <div className="grid gap-3 text-sm">
              {[
                "Phase 1: foundation dashboard and settings",
                "Phase 2: LLM keyword and article generation",
                "Phase 3: RAG ingestion and vector retrieval",
                "Phase 4: SEO scoring, internal links, WordPress sync",
              ].map((item) => (
                <div
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Panel({
  children,
  eyebrow,
  id,
  title,
}: Readonly<{
  children: React.ReactNode;
  eyebrow: string;
  id?: string;
  title: string;
}>) {
  return (
    <div
      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-slate-950/20"
      id={id}
    >
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-200">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-black">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function StatusPill({
  status,
}: Readonly<{
  status: "ready" | "warning" | "pending" | "done" | "running" | "queued";
}>) {
  const labels = {
    done: "Done",
    pending: "Pending",
    queued: "Queued",
    ready: "Ready",
    running: "Running",
    warning: "Review",
  };
  const styles = {
    done: "bg-emerald-300/15 text-emerald-200",
    pending: "bg-slate-500/20 text-slate-300",
    queued: "bg-slate-500/20 text-slate-300",
    ready: "bg-emerald-300/15 text-emerald-200",
    running: "bg-blue-400/15 text-blue-200",
    warning: "bg-amber-300/15 text-amber-200",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function RuleBadge({
  result,
}: Readonly<{
  result: "pass" | "review" | "fail";
}>) {
  const styles = {
    fail: "bg-rose-100 text-rose-700",
    pass: "bg-emerald-100 text-emerald-700",
    review: "bg-amber-100 text-amber-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${styles[result]}`}>
      {result.toUpperCase()}
    </span>
  );
}
