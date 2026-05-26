import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { getWorkAvailability } from "@/lib/site-settings";
import { updateWorkAvailability } from "../actions";

type AvailabilityPageProps = {
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
};

function getErrorMessage(error: string | undefined) {
  switch (error) {
    case "invalid-availability":
      return "Choose a valid availability state.";
    case "database":
      return "The database connection is not configured correctly.";
    default:
      return null;
  }
}

export default async function AvailabilityPage({
  searchParams,
}: AvailabilityPageProps) {
  const params = await searchParams;
  const configured = isAdminConfigured();
  const session = await getAdminSession();

  if (!configured || !session) {
    redirect("/admin/sign-in");
  }

  const availability = await getWorkAvailability();
  const errorMessage = getErrorMessage(params?.error);
  const saved = params?.saved === "availability";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-normal">
          Work availability
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Controls the availability badge on the homepage.
        </p>
      </div>

      <div className="space-y-5">
        {saved ? (
          <div className="rounded-md border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            Availability updated.
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-md border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
            {errorMessage}
          </div>
        ) : null}

        <form
          action={updateWorkAvailability}
          className="rounded-lg border border-border/70 bg-surface/60"
        >
          <div className="space-y-5 p-5 sm:p-6">
            <fieldset className="grid gap-3 sm:grid-cols-2">
              <label className="admin-option cursor-pointer rounded-md border border-border/80 bg-background/35 p-4 transition hover:border-accent/50 has-[:checked]:border-emerald-400/70 has-[:checked]:bg-emerald-400/10">
                <input
                  className="sr-only"
                  type="radio"
                  name="availability"
                  value="available"
                  defaultChecked={availability.isAvailable}
                />
                <span className="flex items-center gap-3 font-medium">
                  <span className="size-3 rounded-full bg-emerald-400 shadow-[0_0_14px_rgb(52_211_153_/_0.75)]" />
                  Available
                </span>
                <span className="mt-2 block text-sm text-muted">
                  Show the green work badge.
                </span>
              </label>

              <label className="admin-option cursor-pointer rounded-md border border-border/80 bg-background/35 p-4 transition hover:border-accent/50 has-[:checked]:border-amber-300/70 has-[:checked]:bg-amber-300/10">
                <input
                  className="sr-only"
                  type="radio"
                  name="availability"
                  value="unavailable"
                  defaultChecked={!availability.isAvailable}
                />
                <span className="flex items-center gap-3 font-medium">
                  <span className="size-3 rounded-full bg-amber-300 shadow-[0_0_14px_rgb(252_211_77_/_0.7)]" />
                  Not receiving work
                </span>
                <span className="mt-2 block text-sm text-muted">
                  Show the yellow pause badge.
                </span>
              </label>
            </fieldset>

            <Button type="submit">Save availability</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
