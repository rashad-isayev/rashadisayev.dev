import { db } from "@/lib/db";
import {
  PAGE_CONSTRUCTION_ITEMS,
  type PageConstructionSlug,
} from "@/constants/page-construction";

const WORK_AVAILABILITY_KEY = "workAvailability";
const PAGE_CONSTRUCTION_KEY = "pageConstruction";

export type WorkAvailability = {
  isAvailable: boolean;
  label: string;
  toneClassName: string;
  pingClassName: string;
  updatedAt?: Date;
};

export type PageConstructionStatuses = Record<PageConstructionSlug, boolean>;

export const AVAILABLE_WORK_LABEL = "Available for work";
export const UNAVAILABLE_WORK_LABEL = "Not receiving new work right now";

function toWorkAvailability(value: string | undefined, updatedAt?: Date): WorkAvailability {
  // Missing settings default to "available" so a fresh database still renders a useful homepage.
  const isAvailable = value !== "unavailable";

  return {
    isAvailable,
    label: isAvailable ? AVAILABLE_WORK_LABEL : UNAVAILABLE_WORK_LABEL,
    toneClassName: isAvailable
      ? "bg-emerald-400 shadow-[0_0_14px_rgb(52_211_153_/_0.75)]"
      : "bg-amber-300 shadow-[0_0_14px_rgb(252_211_77_/_0.7)]",
    pingClassName: isAvailable ? "bg-emerald-400" : "bg-amber-300",
    updatedAt,
  };
}

function getDefaultPageConstructionStatuses(): PageConstructionStatuses {
  return PAGE_CONSTRUCTION_ITEMS.reduce((statuses, item) => {
    statuses[item.slug] = item.defaultUnderConstruction;
    return statuses;
  }, {} as PageConstructionStatuses);
}

function toPageConstructionStatuses(value: string | undefined) {
  const statuses = getDefaultPageConstructionStatuses();

  if (!value) {
    return statuses;
  }

  try {
    const parsed = JSON.parse(value) as Partial<Record<PageConstructionSlug, unknown>>;

    for (const item of PAGE_CONSTRUCTION_ITEMS) {
      const status = parsed[item.slug];

      if (typeof status === "boolean") {
        statuses[item.slug] = status;
      }
    }
  } catch {
    return statuses;
  }

  return statuses;
}

export async function getWorkAvailability() {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: WORK_AVAILABILITY_KEY },
    });

    return toWorkAvailability(setting?.value, setting?.updatedAt);
  } catch {
    // Public pages should still load if the database is temporarily unavailable.
    return toWorkAvailability(undefined);
  }
}

export async function setWorkAvailability(isAvailable: boolean) {
  // Upsert creates the row the first time and updates it on later saves.
  return db.siteSetting.upsert({
    where: { key: WORK_AVAILABILITY_KEY },
    create: {
      key: WORK_AVAILABILITY_KEY,
      value: isAvailable ? "available" : "unavailable",
    },
    update: {
      value: isAvailable ? "available" : "unavailable",
    },
  });
}

export async function getPageConstructionStatuses() {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: PAGE_CONSTRUCTION_KEY },
    });

    return toPageConstructionStatuses(setting?.value);
  } catch {
    return getDefaultPageConstructionStatuses();
  }
}

export async function getPageConstructionStatus(slug: PageConstructionSlug) {
  const statuses = await getPageConstructionStatuses();

  return statuses[slug];
}

export async function setPageConstructionStatuses(
  statuses: PageConstructionStatuses,
) {
  return db.siteSetting.upsert({
    where: { key: PAGE_CONSTRUCTION_KEY },
    create: {
      key: PAGE_CONSTRUCTION_KEY,
      value: JSON.stringify(statuses),
    },
    update: {
      value: JSON.stringify(statuses),
    },
  });
}
