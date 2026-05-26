import { describe, expect, it } from "vitest";

import { isValidVisitorKey } from "@/lib/visitor";

describe("visitor helpers", () => {
  it("accepts only UUID v4 visitor keys", () => {
    expect(isValidVisitorKey("0f43d8f1-5d6f-4d0b-9b8b-4e26a9f1d729")).toBe(
      true,
    );
    expect(isValidVisitorKey("visitor-1")).toBe(false);
    expect(isValidVisitorKey("0f43d8f1-5d6f-3d0b-9b8b-4e26a9f1d729")).toBe(
      false,
    );
    expect(isValidVisitorKey("0f43d8f15d6f4d0b9b8b4e26a9f1d729")).toBe(
      false,
    );
  });
});
