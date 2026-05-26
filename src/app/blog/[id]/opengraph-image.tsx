import { BLOG_CATEGORIES, getPublishedBlogPostBySlug } from "@/lib/content";
import { createOgImage, OG_IMAGE_SIZE } from "@/lib/og-image";

type BlogPostOgImageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";
export const alt = "Blog post";

export default async function Image({ params }: BlogPostOgImageProps) {
  const { id } = await params;
  const post = await getPublishedBlogPostBySlug(id);

  return createOgImage({
    eyebrow: post.category ?? BLOG_CATEGORIES[0],
    title: post.title,
    description: post.excerpt,
    footer: `${post.slug}.md`,
  });
}
