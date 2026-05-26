export const CONTACT_EMAIL = "rashadisayev1@outlook.com";
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export const CONTACT_LINKEDIN_URL = "https://linkedin.com/in/isayevrashad";
export const CONTACT_LINKEDIN_LABEL = "linkedin.com/in/isayevrashad";

export const CONTACT_GITHUB_URL = "https://github.com/rashad-isayev";
export const CONTACT_GITHUB_LABEL = "github.com/rashad-isayev";

export const CONTACT_METHODS = [
  {
    href: CONTACT_EMAIL_HREF,
    label: "Email",
    value: CONTACT_EMAIL,
    description: "Best for work, collaboration, and direct questions.",
    icon: "mail",
  },
  {
    href: CONTACT_LINKEDIN_URL,
    label: "LinkedIn",
    value: CONTACT_LINKEDIN_LABEL,
    description: "Best for professional updates and network context.",
    icon: "external",
  },
  {
    href: CONTACT_GITHUB_URL,
    label: "GitHub",
    value: CONTACT_GITHUB_LABEL,
    description: "Best for code, open-source work, and technical context.",
    icon: "code",
  },
] as const;
