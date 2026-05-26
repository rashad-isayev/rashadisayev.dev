export const PAGE_CONSTRUCTION_ITEMS = [
  {
    slug: "blog",
    label: "Blog",
    route: "/blog",
    defaultUnderConstruction: false,
  },
  {
    slug: "contact",
    label: "Contact",
    route: "/contact",
    defaultUnderConstruction: false,
  },
] as const;

export type PageConstructionSlug = (typeof PAGE_CONSTRUCTION_ITEMS)[number]["slug"];

export function isPageConstructionSlug(
  value: string,
): value is PageConstructionSlug {
  return PAGE_CONSTRUCTION_ITEMS.some((item) => item.slug === value);
}
