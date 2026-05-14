import { getSnapshot, runAction } from "@/lib/genseo-store";
import type { GenseoAction } from "@/lib/genseo-types";

export async function GET() {
  return Response.json(getSnapshot());
}

export async function POST(request: Request) {
  const action = (await request.json()) as GenseoAction;

  return Response.json(runAction(action));
}
