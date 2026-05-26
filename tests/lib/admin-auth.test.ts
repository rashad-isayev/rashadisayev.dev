import { scryptSync } from "node:crypto";
import { describe, expect, it } from "vitest";

import { createSessionSecret, verifyAdminPassword } from "@/lib/admin-auth";

function createTestPasswordHash(password: string) {
  const salt = Buffer.from("test-salt").toString("base64url");
  const key = scryptSync(password, Buffer.from(salt, "base64url"), 64, {
    N: 16384,
    r: 8,
    p: 1,
  });

  return `scrypt$16384$8$1$${salt}$${key.toString("base64url")}`;
}

describe("admin auth helpers", () => {
  it("creates session secrets with enough entropy for the configured minimum", () => {
    expect(createSessionSecret().length).toBeGreaterThanOrEqual(32);
  });

  it("verifies valid scrypt password hashes and rejects wrong passwords", async () => {
    process.env.ADMIN_PASSWORD_HASH = createTestPasswordHash(
      "correct-password",
    );

    await expect(verifyAdminPassword("correct-password")).resolves.toBe(true);
    await expect(verifyAdminPassword("wrong-password")).resolves.toBe(false);
  });
});
