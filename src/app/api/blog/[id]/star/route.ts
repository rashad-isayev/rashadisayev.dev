import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { ContentStatus } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { isPublicMetricRequestAllowed } from "@/lib/public-metrics-rate-limit";
import { getOrCreateVisitorKey } from "@/lib/visitor";

type BlogStarRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: BlogStarRouteProps) {
  if (!isPublicMetricRequestAllowed(request, "star")) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    starred?: unknown;
  } | null;
  const starred = body?.starred === true;
  const visitorKey = await getOrCreateVisitorKey();
  const post = await db.blogPost.findFirst({
    where: {
      id,
      status: ContentStatus.PUBLISHED,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (starred) {
    try {
      // The database uniqueness constraint makes repeated star requests idempotent.
      await db.blogPostStar.create({
        data: {
          postId: post.id,
          visitorKey,
        },
      });
    } catch (error) {
      if (
        !(
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        )
      ) {
        throw error;
      }
    }
  } else {
    // deleteMany is safe even when the visitor never starred the post.
    await db.blogPostStar.deleteMany({
      where: {
        postId: post.id,
        visitorKey,
      },
    });
  }

  const starCount = await db.blogPostStar.count({
    where: {
      postId: post.id,
    },
  });

  // Keep the denormalized counter aligned with the source table used for uniqueness.
  await db.blogPost.update({
    where: {
      id: post.id,
    },
    data: {
      starCount,
    },
  });

  // Star counts appear on both the index and detail page.
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return NextResponse.json({ starCount });
}
