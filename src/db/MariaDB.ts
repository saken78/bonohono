import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";
import { DEFAULT_CONNECTION_LIMIT } from "@/utils/constants";

const adapter = new PrismaMariaDb({
  host: Bun.env.DATABASE_HOST,
  user: Bun.env.DATABASE_USER,
  password: Bun.env.PASSWORD,
  database: Bun.env.DATABASE_NAME,
  connectionLimit: DEFAULT_CONNECTION_LIMIT,
});

export const prismaService = new PrismaClient({ adapter });
