import { ConstructionStatus } from "@/components/construction-status";
import { SiteHeader } from "@/components/site-header";
import { getPageConstructionItem } from "@/constants/page-construction";
import { getPageConstructionStatus } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const pageStatus = getPageConstructionItem("projects");

export default async function ProjectsPage() {
  if (await getPageConstructionStatus("projects")) {
    return (
      <ConstructionStatus
        title={pageStatus.title}
        message={pageStatus.message}
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-5 sm:px-8 sm:py-8">
      <div className="relative z-10 mx-auto min-h-[calc(100vh-2.5rem)] w-full max-w-4xl sm:min-h-[calc(100vh-4rem)]">
        <SiteHeader className="layer-reveal layer-nav" />

        <section className="max-w-2xl py-16 sm:py-20">
          <h1 className="layer-reveal layer-heading text-4xl font-semibold leading-tight text-balance sm:text-5xl">
            Selected work, kept direct.
          </h1>
          <p className="layer-reveal layer-copy mt-6 text-lg leading-8 text-muted">
            A simple record of products, experiments, and systems I have worked
            on. Case studies will be added as they are ready.
          </p>
          <p className="layer-reveal layer-actions mt-8 text-sm text-muted">
            No projects have been added yet.
          </p>
        </section>
      </div>
    </main>
  );
}
