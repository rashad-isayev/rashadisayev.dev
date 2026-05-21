import { redirect } from "next/navigation";

import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";

export default async function SiteSettingsPage() {
  const configured = isAdminConfigured();
  const session = await getAdminSession();

  if (!configured || !session) {
    redirect("/admin");
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">Settings</p>
      <h1 className="text-3xl font-semibold tracking-normal">Site shell</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Navigation, metadata, and visual controls can be managed from this
        section later.
      </p>
    </div>
  );
}
