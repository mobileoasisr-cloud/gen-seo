import { GenSeoWorkspace } from "@/components/genseo-workspace";
import { getSnapshot } from "@/lib/genseo-store";

export default function Home() {
  return <GenSeoWorkspace initialSnapshot={getSnapshot()} />;
}
