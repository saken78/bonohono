import type { Context } from "hono";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { sign, verify } from "hono/jwt";
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
import {
  ARGON2_TIME_COST,
  REFRESH_TOKEN_EXPIRY,
  COST,
  ACCESS_TOKEN_EXPIRY,
} from "@/utils/constants";
import { tr } from "zod/locales";

export const authService = {
  async register(req: RegisterUserRequest): Promise<AuthResponse> {
    const password = await Bun.password.hash(req.password, {
      algorithm: "argon2id",
      memoryCost: COST,
      timeCost: ARGON2_TIME_COST,
    });

    const user = await prismaService.users.create({
      data: {
        email: req.email,
        password: password,
        first_name: req.first_name,
        last_name: req.last_name ?? null,
        role: req.role,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
      },
    });

    return user;
  },
  async login(req: LoginUserRequest, c: Context): Promise<AuthResponse> {
    if (!SECRET) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Secret not found",
      });
    }

    const result = await prismaService.users.findUnique({
      where: { email: req.email },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        role: true,
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

    const now = Math.floor(Date.now() / 1000);
    const access_token_payload: JWT_PAYLOAD = {
      sub: result.id,
      email: result.email,
      role: result.role,
      exp: now + ACCESS_TOKEN_EXPIRY,
      iat: now,
    };
    const refresh_token_payload: JWT_PAYLOAD = {
      sub: result.id,
      email: result.email,
      role: result.role,
      exp: now + REFRESH_TOKEN_EXPIRY,
      iat: now,
    };

    const access_token = await sign(access_token_payload, SECRET, "HS256");
    await setSignedCookie(c, "access_token", access_token, SECRET, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: ACCESS_TOKEN_EXPIRY,
    });

    const refresh_token = await sign(refresh_token_payload, SECRET, "HS256");
    await setSignedCookie(c, "refresh_token", refresh_token, SECRET, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: REFRESH_TOKEN_EXPIRY,
    });

    return {
      id: result.id,
      email: result.email,
      first_name: result.first_name,
      last_name: result.last_name,
      role: result.role,
    };
  },
  async refresh(c: Context) {
    const token = await getSignedCookie(c, SECRET, "refresh_token");
    if (!token) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Invalid or expired refresh token",
      });
    }
    const payload: JWT_PAYLOAD = await verify(token, SECRET, "HS256");
    if (!payload.sub) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Invalid or expired refresh token",
      });
    }
    const result = await prismaService.users.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!result) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "Users not found",
      });
    }
    const now = Math.floor(Date.now() / 1000);
    const access_token_payload: JWT_PAYLOAD = {
      sub: result.id,
      email: result.email,
      role: result.role,
      exp: now + ACCESS_TOKEN_EXPIRY,
      iat: now,
    };
    const access_token = await sign(access_token_payload, SECRET, "HS256");
    await setSignedCookie(c, "access_token", access_token, SECRET, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_TOKEN_EXPIRY,
    });
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
      memoryCost: COST,
      timeCost: ARGON2_TIME_COST,
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
