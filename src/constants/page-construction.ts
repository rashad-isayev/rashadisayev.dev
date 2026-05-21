export const PAGE_CONSTRUCTION_ITEMS = [
  {
    slug: "blog",
    label: "Blog",
    route: "/blog",
    title: "Writing is under construction",
    message: "This section is being prepared and will be available soon.",
    defaultUnderConstruction: false,
  },
  {
    slug: "courses",
    label: "Courses",
    route: "/courses",
    title: "Courses are under construction",
    message: "Learning materials are being prepared and will be available soon.",
    defaultUnderConstruction: true,
  },
  {
    slug: "projects",
    label: "Projects",
    route: "/projects",
    title: "Projects are under construction",
    message: "Case studies and project notes are being prepared.",
    defaultUnderConstruction: false,
  },
] as const;

export type PageConstructionSlug = (typeof PAGE_CONSTRUCTION_ITEMS)[number]["slug"];

export function isPageConstructionSlug(
  value: string,
): value is PageConstructionSlug {
  return PAGE_CONSTRUCTION_ITEMS.some((item) => item.slug === value);
}

export function getPageConstructionItem(slug: PageConstructionSlug) {
  return PAGE_CONSTRUCTION_ITEMS.find((item) => item.slug === slug)!;
}
