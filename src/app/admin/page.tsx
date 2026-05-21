import { redirect } from "next/navigation";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  createAdminPasswordHashCommand,
  createSessionSecret,
  getAdminSession,
  isAdminConfigured,
} from "@/lib/admin-auth";
import { loginAdmin } from "./actions";

type AdminPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error: string | undefined) {
  switch (error) {
    case "invalid":
      return "The password was not accepted.";
    case "rate-limited":
      return "Too many login attempts. Try again later.";
    case "not-configured":
      return "Admin access is not configured yet.";
    case "database":
      return "The database connection is not configured correctly.";
    default:
      return null;
  }
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const session = await getAdminSession();
  const configured = isAdminConfigured();
  const errorMessage = getErrorMessage(params?.error);
  const showSetupCommands = !configured && process.env.NODE_ENV !== "production";

  // Signed-in admins should not see the login screen again.
  if (configured && session) {
    redirect("/admin/availability");
  }

  return (
    <div className="max-w-md">
      <div className="mb-8">
        <p className="mb-3 text-sm text-muted">Admin dashboard</p>
        <h1 className="text-3xl font-semibold tracking-normal">Sign in</h1>
      </div>

      {!configured ? (
        <div className="space-y-5 rounded-lg border border-border/70 bg-surface/60 p-5 sm:p-6">
          <div className="rounded-md border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
            Configure <code>ADMIN_PASSWORD_HASH</code> and{" "}
            <code>ADMIN_SESSION_SECRET</code> before using the dashboard.
          </div>
          {showSetupCommands ? (
            <div className="space-y-3 text-sm text-muted">
              <p>Password hash command:</p>
              <pre className="overflow-x-auto rounded-md border border-border bg-background/70 p-4 text-xs text-foreground">
                {/* These generated values help bootstrap the app before admin auth is configured. */}
                {createAdminPasswordHashCommand()}
              </pre>
              <p>Session secret example:</p>
              <pre className="overflow-x-auto rounded-md border border-border bg-background/70 p-4 text-xs text-foreground">
                {`ADMIN_SESSION_SECRET="${createSessionSecret()}"`}
              </pre>
            </div>
          ) : null}
        </div>
      ) : (
        <form
          action={loginAdmin}
          className="space-y-5 rounded-lg border border-border/70 bg-surface/60 p-5 sm:p-6"
        >
          {errorMessage ? (
            <div className="rounded-md border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
              {errorMessage}
            </div>
          ) : null}

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Admin password
            </label>
            <div className="mt-2 flex rounded-md border border-border bg-background/50 px-3 focus-within:border-accent">
              <Lock aria-hidden="true" className="mr-2 mt-3 size-4 text-muted" />
              <input
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
                autoComplete="current-password"
                className="h-11 w-full bg-transparent text-foreground outline-none placeholder:text-muted"
                placeholder="Enter your admin password"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      )}
    </div>
  );
}
