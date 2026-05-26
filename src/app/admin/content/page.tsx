import { redirect } from "next/navigation";

import { PAGE_CONSTRUCTION_ITEMS } from "@/constants/page-construction";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { getPageConstructionStatuses } from "@/lib/site-settings";
import { AdminSubmitButton } from "../admin-submit-button";
import { updatePageConstructionStatuses } from "../actions";

type ContentSettingsPageProps = {
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
};

function getErrorMessage(error: string | undefined) {
  switch (error) {
    case "database":
      return "The database connection is not configured correctly.";
    default:
      return null;
  }
}

export default async function ContentSettingsPage({
  searchParams,
}: ContentSettingsPageProps) {
  const params = await searchParams;
  const configured = isAdminConfigured();
  const session = await getAdminSession();

  if (!configured || !session) {
    redirect("/admin/sign-in");
  }

  const statuses = await getPageConstructionStatuses();
  const errorMessage = getErrorMessage(params?.error);
  const saved = params?.saved === "construction";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-normal">
          Content system
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Control whether public content pages show their normal page or a
          centered construction-only status.
        </p>
      </div>

      <div className="space-y-5">
        {saved ? (
          <div className="rounded-md border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            Construction statuses updated.
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-md border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
            {errorMessage}
          </div>
        ) : null}

        <form
          action={updatePageConstructionStatuses}
          className="rounded-lg border border-border/70 bg-surface/60"
        >
          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-3">
              {PAGE_CONSTRUCTION_ITEMS.map((item) => (
                <label
                  key={item.slug}
                  className="admin-option flex cursor-pointer items-start justify-between gap-4 rounded-md border border-border/80 bg-background/35 p-4 hover:border-accent/45 has-[:checked]:border-amber-300/70 has-[:checked]:bg-amber-300/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/70 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background"
                >
                  <span>
                    <span className="block font-medium">{item.label}</span>
                    <span className="mt-1 block text-sm text-muted">
                      {item.route}
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    name={item.slug}
                    defaultChecked={statuses[item.slug]}
                    className="mt-1 size-4 accent-amber-300"
                  />
                </label>
              ))}
            </div>

            <AdminSubmitButton icon="save" pendingLabel="Saving statuses">
              Save page statuses
            </AdminSubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
