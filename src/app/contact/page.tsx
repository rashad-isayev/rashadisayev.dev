import type { Metadata } from "next";
import Link from "next/link";
import { Code2, ExternalLink, Mail } from "lucide-react";

import { AmbientGlow } from "@/components/ambient-glow";
import { ConstructionStatus } from "@/components/construction-status";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  CONTACT_EMAIL_HREF,
  CONTACT_GITHUB_URL,
  CONTACT_LINKEDIN_URL,
  CONTACT_METHODS,
} from "@/constants/contact";
import { getPageConstructionStatus } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Rashad Isayev by email, LinkedIn, or GitHub.",
};

export default async function ContactPage() {
  if (await getPageConstructionStatus("contact")) {
    return <ConstructionStatus />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-5 sm:px-8 sm:pt-8">
      <AmbientGlow className="ambient-glow-cosmos layer-reveal layer-backdrop absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="min-h-screen">
          <SiteHeader className="layer-reveal layer-nav" />

          <section className="max-w-2xl py-16 sm:py-20">
            <h1 className="layer-reveal layer-heading text-4xl font-semibold leading-tight text-balance sm:text-5xl">
              Let&apos;s talk when the work is concrete.
            </h1>
            <p className="layer-reveal layer-copy mt-6 text-lg leading-8 text-muted">
              Send the context, timeline, and the decision you are trying to
              make. I read direct messages faster when the ask is specific.
            </p>

            <div className="layer-reveal layer-actions mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="w-full sm:w-auto">
                <Link href={CONTACT_EMAIL_HREF}>
                  <Mail aria-hidden="true" className="size-4" />
                  Email me
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={CONTACT_LINKEDIN_URL} target="_blank">
                  <ExternalLink aria-hidden="true" className="size-4" />
                  LinkedIn
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={CONTACT_GITHUB_URL} target="_blank">
                  <Code2 aria-hidden="true" className="size-4" />
                  GitHub
                </Link>
              </Button>
            </div>
          </section>

          <section className="layer-reveal layer-actions grid gap-3 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_METHODS.map((method) => {
            const isExternal = method.href.startsWith("http");

            return (
              <Link
                key={method.href}
                href={method.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="admin-link rounded-lg border border-border/70 bg-surface/55 p-5 hover:border-accent/35 hover:bg-surface/80 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex h-full flex-col">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background/45 text-accent">
                    {method.icon === "mail" ? (
                      <Mail aria-hidden className="size-4" />
                    ) : null}
                    {method.icon === "external" ? (
                      <ExternalLink aria-hidden className="size-4" />
                    ) : null}
                    {method.icon === "code" ? (
                      <Code2 aria-hidden className="size-4" />
                    ) : null}
                  </span>
                  <span className="mt-4 min-w-0 flex-1">
                    <span className="flex min-w-0 items-center gap-2 font-medium">
                      {method.label}
                      {isExternal ? (
                        <ExternalLink
                          aria-hidden
                          className="size-3.5 shrink-0 text-muted"
                        />
                      ) : null}
                    </span>
                    <span className="mt-1 block break-words text-sm text-foreground/85">
                      {method.value}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-muted">
                      {method.description}
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
          </section>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
