import { GenSeoWorkspace } from "@/components/genseo-workspace";
import { getSnapshot } from "@/lib/genseo-store";
import { connection } from "next/server";

export default async function Home() {
  await connection();

  return <GenSeoWorkspace initialSnapshot={getSnapshot()} />;
}
