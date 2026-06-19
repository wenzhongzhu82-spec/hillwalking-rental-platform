import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const DB_PATH = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace("file:", "")
  : `${process.cwd()}/dev.db`;

process.env.DATABASE_URL = `file:${DB_PATH}`;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaLibSql({ url: `file:${DB_PATH}` });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
