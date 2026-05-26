import Link from "next/link";

import { AmbientGlow } from "@/components/ambient-glow";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-5 text-center sm:px-8 sm:py-8">
      <AmbientGlow className="ambient-glow-construction layer-reveal layer-backdrop absolute inset-0" />

      <section className="layer-reveal layer-heading relative z-10 mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-md flex-col items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <p className="mb-4 text-sm text-muted">error.404</p>
        <h1 className="text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
          This page could not be found
        </h1>
        <p className="mt-5 text-base leading-7 text-muted">
          It may have moved, been unpublished, or never existed. Please return
          to the{" "}
          <Link
            href="/"
            className="rounded-sm text-foreground underline decoration-amber-200/50 underline-offset-4 transition hover:text-amber-100 hover:decoration-amber-100 focus-visible:ring-2 focus-visible:ring-amber-200/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            homepage
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
