import { redirect } from "next/navigation";

import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";

export default async function SecuritySettingsPage() {
  const configured = isAdminConfigured();
  const session = await getAdminSession();

  if (!configured || !session) {
    redirect("/admin");
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">Settings</p>
      <h1 className="text-3xl font-semibold tracking-normal">
        Access & security
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Authentication settings can be expanded here as the admin system grows.
      </p>
    </div>
  );
}
