import type { Metadata } from "next";
import Link from "next/link";

import { AmbientGlow } from "@/components/ambient-glow";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminSidebar } from "./admin-sidebar";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAdminSession();

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <AmbientGlow className="layer-reveal layer-backdrop absolute inset-0 opacity-70" />

      <div className="layer-reveal layer-panel relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-col rounded-lg border border-border/70 bg-background/50 shadow-[var(--shadow-soft)] backdrop-blur-2xl sm:min-h-[calc(100vh-3rem)] lg:flex-row">
        <AdminSidebar isSignedIn={Boolean(session)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-4 text-sm sm:px-7">
            <Link href="/" className="text-muted transition hover:text-foreground">
              Rashad Isayev
            </Link>
            <span className="text-muted">Admin</span>
          </header>

          <section className="flex flex-1 overflow-y-auto px-5 py-7 sm:px-7 lg:px-10">
            <div className="mx-auto w-full max-w-4xl">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
