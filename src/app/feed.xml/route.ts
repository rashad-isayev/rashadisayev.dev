import { NextResponse } from "next/server";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/constants/site";
import { getPublishedBlogPosts } from "@/lib/content";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = await getPublishedBlogPosts();
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const date = post.publishedAt ?? post.createdAt;

      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <description>${escapeXml(post.excerpt)}</description>
          <pubDate>${date.toUTCString()}</pubDate>
        </item>`;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(SITE_NAME)}</title>
        <link>${SITE_URL}</link>
        <description>${escapeXml(SITE_DESCRIPTION)}</description>
        <language>en</language>
        ${items}
      </channel>
    </rss>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
