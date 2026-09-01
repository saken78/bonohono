import { type Context, type MiddlewareHandler, type Next } from "hono";
import { verify } from "hono/jwt";
import { SECRET } from "../utils/secret";
import { getSignedCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { HttpStatus } from "../utils/status_code";
import type { JWT_PAYLOAD } from "../auth/auth.model";

export const AuthMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next,
): Promise<void> => {
  if (!SECRET) {
    throw new HTTPException(HttpStatus.UNAUTHORIZED, {
      message: "SECRET NOT FOUND",
    });
  }
  const token = await getSignedCookie(c, SECRET, "refresh_token");
  if (!token) {
    throw new HTTPException(HttpStatus.UNAUTHORIZED, {
      message: "UNAUTHORIZED",
    });
  }
  let user: JWT_PAYLOAD;
  try {
    user = await verify(token, SECRET, "HS256");
  } catch (err) {
    throw new HTTPException(HttpStatus.UNAUTHORIZED, {
      message: "Invalid or expired token",
    });
  }
  c.set("user", {
    id: user.sub,
    email: user.email,
    poster: user.role,
  });
  await next();
};
