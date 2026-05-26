ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS "blog_post_stars" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "visitorKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "blog_post_stars_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "blog_post_stars_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "blog_post_stars_postId_visitorKey_key" ON "blog_post_stars"("postId", "visitorKey");
CREATE INDEX IF NOT EXISTS "blog_post_stars_visitorKey_idx" ON "blog_post_stars"("visitorKey");

CREATE TABLE IF NOT EXISTS "blog_post_views" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "visitorKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "blog_post_views_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "blog_post_views_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "blog_post_views_postId_visitorKey_key" ON "blog_post_views"("postId", "visitorKey");
CREATE INDEX IF NOT EXISTS "blog_post_views_visitorKey_idx" ON "blog_post_views"("visitorKey");
