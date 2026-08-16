import type { Context } from "hono";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { prismaService } from "../db/MariaDB";
import { SECRET } from "../utils/secret";
import { HttpStatus } from "../utils/status_code";
import {
  type AuthResponse,
  type JWT_PAYLOAD,
  type JWT_RESPONSE,
  type LoginUserRequest,
  type RegisterUserRequest,
  type ResetPasswordRequest,
} from "./auth.model";

export const authService = {
  async register(req: RegisterUserRequest): Promise<AuthResponse> {
    const password = await Bun.password.hash(req.password, {
      algorithm: "argon2id",
      memoryCost: 65534,
      timeCost: 3,
    });

    const user = await prismaService.users.create({
      data: {
        email: req.email,
        password: password,
        first_name: req.first_name,
        last_name: req.last_name ?? null,
      },
      select: { email: true, first_name: true },
    });

    return {
      email: user.email,
      first_name: user.first_name,
    };
  },
  async login(req: LoginUserRequest, c: Context): Promise<AuthResponse> {
    if (!SECRET || SECRET === undefined) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Secret not found",
      });
    }

    const result = await prismaService.users.findUnique({
      where: { email: req.email },
      select: {
        id: true,
        first_name: true,
        email: true,
        password: true,
        poster: true,
      },
    });

    if (!result) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }

    const match = await Bun.password.verify(req.password, result.password);

    if (!match) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }

    const pay: JWT_PAYLOAD = {
      sub: result.id,
      email: result.email,
      role: result.poster,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = await sign(pay, SECRET);
    await setSignedCookie(c, "refresh_token", token, SECRET);
    return {
      first_name: result.first_name,
      email: result.email,
    };
  },
  async me(c: Context): Promise<JWT_RESPONSE> {
    const result = c.get("user");
    return result;
  },
  async logout(c: Context): Promise<void> {
    const cookie = await getSignedCookie(c, SECRET, "refresh_token");
    if (!cookie) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Cookie Already Cleared",
      });
    }
    deleteCookie(c, "refresh_token");
  },
  async resetPassword(req: ResetPasswordRequest, email: string): Promise<void> {
    const npw = await Bun.password.hash(req.password, {
      algorithm: "argon2id",
      memoryCost: 65534,
      timeCost: 3,
    });

    await prismaService.users.update({
      where: { email: email },
      data: { password: npw },
    });
  },
  async deleteAccount(email: string): Promise<void> {
    await prismaService.users.delete({
      where: { email: email },
    });
  },
};
