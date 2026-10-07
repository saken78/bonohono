import { HTTPException } from "hono/http-exception";
import { prismaService } from "../db/MariaDB";
import type { UserResponse } from "./user.model";
import { HttpStatus } from "../utils/status_code";

export const userService = {
  async getAllUser(): Promise<UserResponse[]> {
    const result = await prismaService.users.findMany({
      select: {
        id: true,
        email: true,
        first_name: true,
        role: true,
      },
    });
    return result;
  },
  async getUserById(id: string): Promise<UserResponse> {
    const result = await prismaService.users.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        role: true,
      },
    });
    if (!result) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "User with this id not found",
      });
    }
    return result;
  },
  async changeRole(id: string, role: string): Promise<UserResponse> {
    const result = await prismaService.users.update({
      where: {
        id: id,
      },
      data: {
        role: role,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        role: true,
      },
    });
    return result;
  },
};
