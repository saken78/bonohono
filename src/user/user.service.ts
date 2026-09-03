import { HTTPException } from "hono/http-exception";
import { prismaService } from "../db/MariaDB";
import type { UserResponse } from "./user.model";
import { HttpStatus } from "../utils/status_code";

export const userService = {
  async getAllUser(): Promise<UserResponse[]> {
    const result = await prismaService.users.findMany({
      select: { email: true, first_name: true, role: true },
    });
    return result;
  },
  async getUserById(id: string): Promise<UserResponse> {
    const result = await prismaService.users.findUnique({
      where: { id: id },
      select: { email: true, first_name: true, role: true },
    });
    if (!result) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "User with this id not found",
      });
    }
    return {
      email: result.email,
      first_name: result.first_name,
      role: result.role,
    };
  },
};
