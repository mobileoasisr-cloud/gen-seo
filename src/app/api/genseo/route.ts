import { getSnapshot, runAction } from "@/lib/genseo-store";
import type { GenseoAction } from "@/lib/genseo-types";

export async function GET() {
  return Response.json(getSnapshot());
}

export async function POST(request: Request) {
  const action = await parseAction(request);
  if (!action) {
    return Response.json({ error: "Invalid GenSEO action." }, { status: 400 });
  }

  return Response.json(runAction(action));
}

async function parseAction(request: Request): Promise<GenseoAction | null> {
  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || !hasString(body, "type") || !hasString(body, "projectId")) {
      return null;
    }

    switch (body.type) {
      case "rotateApiKey":
      case "scanInternalLinks":
        return { type: body.type, projectId: body.projectId };
      case "ingestDocument":
        return hasString(body, "fileName") && hasString(body, "content")
          ? {
              type: body.type,
              projectId: body.projectId,
              fileName: body.fileName,
              content: body.content,
            }
          : null;
      case "generateKeywordPlan":
        return hasString(body, "seedKeyword")
          ? {
              type: body.type,
              projectId: body.projectId,
              seedKeyword: body.seedKeyword,
            }
          : null;
      case "generateArticle":
        return hasString(body, "clusterId")
          ? {
              type: body.type,
              projectId: body.projectId,
              clusterId: body.clusterId,
            }
          : null;
      case "scoreArticle":
      case "syncWordPress":
        return hasString(body, "articleId")
          ? {
              type: body.type,
              projectId: body.projectId,
              articleId: body.articleId,
            }
          : null;
      default:
        return null;
    }
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasString(
  value: Record<string, unknown>,
  key: string,
): value is Record<string, string> {
  return typeof value[key] === "string";
}
