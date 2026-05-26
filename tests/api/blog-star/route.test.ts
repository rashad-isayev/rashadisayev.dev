import { beforeEach, describe, expect, it, vi } from "vitest";

const db = {
  blogPost: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  blogPostStar: {
    count: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
};

vi.mock("@/lib/db", () => ({ db }));
vi.mock("@/lib/visitor", () => ({ getOrCreateVisitorKey: vi.fn(() => "visitor-1") }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

describe("blog star API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    db.blogPost.findFirst.mockResolvedValue({
      id: "post-1",
      slug: "published-post",
    });
    db.blogPostStar.count.mockResolvedValue(3);
    db.blogPost.update.mockResolvedValue({});
  });

  it("creates one anonymous star and syncs the post counter", async () => {
    const { POST } = await import("@/app/api/blog/[id]/star/route");
    const response = await POST(
      new Request("https://example.com/api/blog/post-1/star", {
        method: "POST",
        body: JSON.stringify({ starred: true }),
      }),
      { params: Promise.resolve({ id: "post-1" }) },
    );

    await expect(response.json()).resolves.toEqual({ starCount: 3 });
    expect(db.blogPostStar.create).toHaveBeenCalledWith({
      data: {
        postId: "post-1",
        visitorKey: "visitor-1",
      },
    });
    expect(db.blogPost.update).toHaveBeenCalledWith({
      where: { id: "post-1" },
      data: { starCount: 3 },
    });
  });

  it("removes the visitor star when unstarred", async () => {
    const { POST } = await import("@/app/api/blog/[id]/star/route");
    await POST(
      new Request("https://example.com/api/blog/post-1/star", {
        method: "POST",
        body: JSON.stringify({ starred: false }),
      }),
      { params: Promise.resolve({ id: "post-1" }) },
    );

    expect(db.blogPostStar.deleteMany).toHaveBeenCalledWith({
      where: {
        postId: "post-1",
        visitorKey: "visitor-1",
      },
    });
  });
});
