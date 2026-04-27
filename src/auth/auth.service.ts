import { prismaService } from "../db/MariaDB";
import {
  type JWT_PAYLOAD,
  type LOGIN_USER_REQUEST,
  type REGISTER_USER_REQUEST,
  REGISTER_SCHEMA,
  type RESET_PASSWORD_REQUEST,
  type UserResponse,
  LOGIN_SCHEMA,
  RESET_PASSWORD_SCHEMA,
} from "./auth.model";
import { HttpStatus } from "../utils/status_code";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { SECRET } from "../utils/secret";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import type { Context } from "hono";

export const authService = {
  async register(req: REGISTER_USER_REQUEST): Promise<UserResponse> {
    const request = REGISTER_SCHEMA.parse(req);

    const password = await Bun.password.hash(request.password, {
      algorithm: "argon2id",
      memoryCost: 4,
      timeCost: 3,
    });

    const user = await prismaService.users.create({
      data: {
        email: request.email,
        password: password,
        first_name: request.first_name,
        last_name: request.last_name ?? null,
      },
      select: { email: true },
    });

    return {
      email: user.email,
    };
  },
  async login(req: LOGIN_USER_REQUEST, c: Context): Promise<UserResponse> {
    const request = LOGIN_SCHEMA.parse(req);

    if (!SECRET || SECRET === undefined) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Secret not found",
      });
    }

    const result = await prismaService.users.findUnique({
      where: { email: request.email },
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

    const match = await Bun.password.verify(request.password, result.password);

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
  async me(c: Context): Promise<{ data: JWT_PAYLOAD }> {
    const result = c.get("user");
    return {
      data: result,
    };
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
  async resetPassword(
    req: RESET_PASSWORD_REQUEST,
    email: string,
  ): Promise<void> {
    const request = RESET_PASSWORD_SCHEMA.parse(req);

    const npw = await Bun.password.hash(request.password, {
      algorithm: "argon2id",
      memoryCost: 4,
      timeCost: 3,
    });

    await prismaService.users.update({
      where: { email: email },
      data: { password: npw },
    });
  },
  async deleteAccount(email: string): Promise<void> {
    if (!email) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }
    await prismaService.users.delete({ where: { email: email } });
  },
};
