import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: Bun.env.DATABASE_HOST,
  user: Bun.env.DATABASE_USER,
  password: Bun.env.PASSWORD,
  database: Bun.env.DATABASE_NAME,
  connectionLimit: 20,
});

export const prismaService = new PrismaClient({ adapter });
