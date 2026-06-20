import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const DB_URL = process.env.DATABASE_URL || "file:./dev.db";

function createPrismaClient(): PrismaClient {
  // PostgreSQL — use direct connection (no adapter needed)
  if (DB_URL.startsWith("postgresql://") || DB_URL.startsWith("postgres://")) {
    return new PrismaClient();
  }

  // SQLite / libsql — use the libsql adapter
  const dbPath = DB_URL.replace("file:", "");
  process.env.DATABASE_URL = `file:${dbPath}`;
  const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
