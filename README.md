# GenSEO

GenSEO is a GENSEO-inspired SEO content automation platform prototype. The
current MVP is a Next.js dashboard that maps the core product flows before the
real backend services are connected.

## MVP scope

- Project readiness dashboard for API keys, WordPress, Knowledge Base, and
  internal linking.
- Pillar–Cluster keyword plan board with search intent and content angles.
- RAG document pipeline preview for import, chunking, embedding, and grounding.
- Article editor preview with SEO rule checks.
- Internal linking suggestions and background job status.
- Roadmap for adding real persistence, LLM workflows, vector retrieval, and
  WordPress publishing.

## Recommended architecture

- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS.
- **Application services:** project settings, API key rotation, keyword plan,
  knowledge base, article generation, SEO scoring, internal linking, WordPress
  sync.
- **Future backend:** PostgreSQL + pgvector, Redis queue, encrypted secrets, LLM
  gateway, background workers.
- **Integrations:** OpenAI/Gemini, WordPress REST API or custom plugin webhook,
  Google Search Console in a later phase.

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

## Project structure

- `src/app/page.tsx` — product dashboard and MVP UI.
- `src/lib/genseo-data.ts` — typed mock data for the core GenSEO modules.
- `src/app/layout.tsx` — metadata and root layout.
- `src/app/globals.css` — Tailwind and global styles.

## Development roadmap

1. Add authentication and multi-project persistence.
2. Add encrypted API key storage and provider rotation.
3. Add keyword plan generation with OpenAI/Gemini.
4. Add document upload, extraction, chunking, embeddings, and vector retrieval.
5. Add article generation grounded by Knowledge Base context.
6. Add SEO scoring rules and editor actions.
7. Add internal linking scans and WordPress draft publishing.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
