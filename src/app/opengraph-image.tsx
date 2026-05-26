import { SITE_DESCRIPTION, SITE_NAME } from "@/constants/site";
import { createOgImage, OG_IMAGE_SIZE } from "@/lib/og-image";

export const alt = SITE_NAME;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Personal platform",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  });
}
