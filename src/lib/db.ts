import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getPgAdapterDatabaseUrl } from "@/lib/database-url";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaDatabaseUrl?: string;
};

const databaseUrl = getPgAdapterDatabaseUrl();
const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

function hasCurrentModelDelegates(prisma: PrismaClient | undefined) {
  const client = prisma as
    | (PrismaClient & {
        blogPost?: unknown;
        blogPostStar?: unknown;
        blogPostView?: unknown;
      })
    | undefined;

  return Boolean(client?.blogPost && client.blogPostStar && client.blogPostView);
}

export const db =
  globalForPrisma.prisma &&
  globalForPrisma.prismaDatabaseUrl === databaseUrl &&
  hasCurrentModelDelegates(globalForPrisma.prisma)
    ? globalForPrisma.prisma
    : new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  // Next.js hot reload can re-run modules many times in development.
  // Reusing one Prisma client avoids opening a new database connection on every reload.
  globalForPrisma.prisma = db;
  globalForPrisma.prismaDatabaseUrl = databaseUrl;
}
