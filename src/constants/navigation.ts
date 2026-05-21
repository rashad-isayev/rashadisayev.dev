// The public header reads from this list, keeping route labels in one shared source.
export const NAVIGATION_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/courses", label: "Courses" },
] as const;
