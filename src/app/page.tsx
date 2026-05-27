import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Mail } from "lucide-react";

import { AmbientGlow } from "@/components/ambient-glow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { CONTACT_GITHUB_URL } from "@/constants/contact";
import { getWorkAvailability } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const availability = await getWorkAvailability();

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-5 sm:px-8 sm:pt-8">
      <AmbientGlow className="layer-reveal layer-backdrop absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="flex min-h-screen flex-col">
          <SiteHeader className="layer-reveal layer-nav shrink-0" />

          <section className="flex flex-1 flex-col items-center justify-center pb-8 pt-6 text-center sm:pb-12">
            <div className="layer-reveal layer-avatar relative mb-9">
              <div className="relative size-16 overflow-hidden rounded-full border border-border bg-surface shadow-[var(--shadow-soft)] sm:size-20">
                <Image
                  src="/avatar.avif"
                  alt="Rashad Isayev"
                  fill
                  priority
                  sizes="(min-width: 640px) 80px, 64px"
                  className="object-cover"
                />
              </div>
              <div className="absolute left-1/2 top-[70%] flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-border/80 bg-surface-muted/95 px-4 py-2 text-sm font-medium text-accent shadow-sm backdrop-blur-xl">
                <span className="relative flex size-3">
                  <span
                    className={`absolute inline-flex size-full animate-ping rounded-full opacity-55 ${availability.pingClassName}`}
                  />
                  <span
                    className={`relative inline-flex size-3 rounded-full ${availability.toneClassName}`}
                  />
                </span>
                {availability.label}
              </div>
            </div>

            <div className="mt-7 max-w-3xl">
              <h1 className="layer-reveal layer-heading text-4xl font-semibold tracking-normal text-balance sm:text-6xl">
                Building digital experiences with purpose
              </h1>
              <p className="layer-reveal layer-copy mx-auto mt-5 max-w-2xl text-base leading-8 text-muted">
                I am Rashad Isayev, a developer and an entrepreneur, preparing learning materials
                practical digital solutions, and publishing useful ideas.
              </p>
            </div>

            <div className="layer-reveal layer-actions mt-7 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={CONTACT_GITHUB_URL} target="_blank">
                  <ExternalLink aria-hidden="true" className="size-4" />
                  See my GitHub
                </Link>
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/contact">
                  <Mail aria-hidden="true" className="size-4" />
                  Contact me
                </Link>
              </Button>
            </div>
          </section>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
