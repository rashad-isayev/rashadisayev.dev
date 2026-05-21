"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  assertAdminSession,
  assertSameOrigin,
  clearAdminSession,
  getRateLimitKey,
  isAdminConfigured,
  isLoginRateLimited,
  resetLoginRateLimit,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { PAGE_CONSTRUCTION_ITEMS } from "@/constants/page-construction";
import {
  setPageConstructionStatuses,
  setWorkAvailability,
  type PageConstructionStatuses,
} from "@/lib/site-settings";

export async function loginAdmin(formData: FormData) {
  // Server actions can be called directly by forms. Because they mutate auth state,
  // each action first checks that the request came from this same site.
  await assertSameOrigin();

  if (!isAdminConfigured()) {
    redirect("/admin?error=not-configured");
  }

  // Rate limiting is keyed by client IP to slow down repeated password guesses.
  const key = await getRateLimitKey();

  if (await isLoginRateLimited(key)) {
    redirect("/admin?error=rate-limited");
  }

  const password = formData.get("password");

  // FormData values can be strings or files, so TypeScript needs a runtime type check.
  if (typeof password !== "string" || !(await verifyAdminPassword(password))) {
    redirect("/admin?error=invalid");
  }

  await resetLoginRateLimit(key);
  await setAdminSession();
  redirect("/admin/availability");
}

export async function logoutAdmin() {
  await assertSameOrigin();
  await clearAdminSession();
  redirect("/admin");
}

export async function updateWorkAvailability(formData: FormData) {
  await assertSameOrigin();
  // This mutation is only allowed after a valid signed admin session is present.
  await assertAdminSession();

  const availability = formData.get("availability");

  if (availability !== "available" && availability !== "unavailable") {
    redirect("/admin?error=invalid-availability");
  }

  try {
    await setWorkAvailability(availability === "available");
  } catch {
    redirect("/admin?error=database");
  }

  // These paths read the setting, so they must be invalidated after the database update.
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/availability");
  redirect("/admin/availability?saved=availability");
}

export async function updatePageConstructionStatuses(formData: FormData) {
  await assertSameOrigin();
  await assertAdminSession();

  const statuses = PAGE_CONSTRUCTION_ITEMS.reduce((nextStatuses, item) => {
    nextStatuses[item.slug] = formData.get(item.slug) === "on";
    return nextStatuses;
  }, {} as PageConstructionStatuses);

  try {
    await setPageConstructionStatuses(statuses);
  } catch {
    redirect("/admin/content?error=database");
  }

  for (const item of PAGE_CONSTRUCTION_ITEMS) {
    revalidatePath(item.route);
  }

  revalidatePath("/admin/content");
  redirect("/admin/content?saved=construction");
}
