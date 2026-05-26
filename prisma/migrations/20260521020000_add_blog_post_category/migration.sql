ALTER TABLE "blog_posts"
ADD COLUMN "category" TEXT NOT NULL DEFAULT 'General';

CREATE INDEX "blog_posts_status_category_publishedAt_idx"
ON "blog_posts"("status", "category", "publishedAt");
