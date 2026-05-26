import { NextResponse } from "next/server";

import { ContentStatus } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { isPublicMetricRequestAllowed } from "@/lib/public-metrics-rate-limit";
import { getOrCreateVisitorKey } from "@/lib/visitor";

type BlogViewRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: BlogViewRouteProps) {
  if (!isPublicMetricRequestAllowed(request, "view")) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await params;
  const visitorKey = await getOrCreateVisitorKey();
  const post = await db.blogPost.findFirst({
    where: {
      id,
      status: ContentStatus.PUBLISHED,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    // A visitor can create only one view row per post, so refreshes do not inflate counts.
    await db.blogPostView.create({
      data: {
        postId: post.id,
        visitorKey,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Duplicate view attempts are successful no-ops from the client's perspective.
      return NextResponse.json({ ok: true });
    }

    throw error;
  }

  // Increment only after inserting the unique view row.
  await db.blogPost.update({
    where: { id: post.id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
