# GenSEO

GenSEO is a GENSEO-inspired SEO content automation platform MVP. The app now
combines a Next.js dashboard, internal API route, local domain store, and
simulated service workflows for the main SEO operations loop.

## MVP scope

- Project readiness dashboard for API keys, WordPress, Knowledge Base, keyword
  planning, articles, internal linking, and sync status.
- API key rotation workflow with provider priority and quota states.
- Knowledge Base ingestion that chunks text and exposes retrieved RAG context.
- Pillar–Cluster keyword plan generation from a seed keyword.
- Article draft generation from the top cluster with RAG-grounded content.
- SEO score checks for title, meta description, outline, RAG grounding, and
  internal links.
- Internal linking scan and contextual anchor suggestions.
- WordPress draft sync simulation with generated post IDs.
- Background job timeline for each workflow action.

## Recommended architecture

- **Frontend:** Next.js App Router, Client Components for interactive controls,
  TypeScript, Tailwind CSS.
- **Backend-for-frontend:** `src/app/api/genseo/route.ts` with `GET` snapshots
  and `POST` workflow actions.
- **Domain store:** in-memory seeded data in `src/lib/genseo-store.ts`.
- **Application services:** mockable service functions for document ingestion,
  keyword clustering, article generation, SEO scoring, internal linking, and
  WordPress sync in `src/lib/genseo-services.ts`.
- **Future backend:** PostgreSQL + pgvector, Redis queue, encrypted secrets,
  real LLM gateway, background workers.
- **Integrations:** OpenAI/Gemini and WordPress REST API/custom plugin webhook
  once credentials are available.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Quality checks

```bash
npm run lint
npm run build
```

## API route

`GET /api/genseo` returns the full current workspace snapshot.

`POST /api/genseo` accepts workflow actions:

```json
{ "type": "rotateApiKey", "projectId": "project-demo" }
```

Supported action types:

- `rotateApiKey`
- `ingestDocument`
- `generateKeywordPlan`
- `generateArticle`
- `scoreArticle`
- `scanInternalLinks`
- `syncWordPress`

## Project structure

- `src/app/page.tsx` — workspace entrypoint.
- `src/components/genseo-workspace.tsx` — interactive dashboard UI.
- `src/app/api/genseo/route.ts` — local API route for snapshots and actions.
- `src/lib/genseo-types.ts` — domain types.
- `src/lib/genseo-store.ts` — seeded in-memory store and workflow mutations.
- `src/lib/genseo-services.ts` — mockable service logic.
- `src/lib/genseo-data.ts` — legacy static MVP data retained for reference.
- `src/app/layout.tsx` — metadata and root layout.
- `src/app/globals.css` — Tailwind and global styles.

## Development roadmap

1. Replace in-memory storage with authenticated multi-project persistence.
2. Store provider and WordPress credentials with encryption.
3. Replace mock keyword/article generation with OpenAI/Gemini calls.
4. Add file upload, PDF/CSV extraction, embeddings, and pgvector retrieval.
5. Expand SEO checks toward the full 104-rule optimizer.
6. Run internal linking and publishing in a durable background queue.
7. Add Google Search Console import for article rewriting.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
