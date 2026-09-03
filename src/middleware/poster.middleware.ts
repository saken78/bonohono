import type { JWT_RESPONSE } from "../auth/auth.model";
import { HttpStatus } from "../utils/status_code";
import type { Context, MiddlewareHandler, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const PosterMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next,
): Promise<void> => {
  const user: JWT_RESPONSE = await c.get("user");
  if (user.role !== "poster") {
    throw new HTTPException(HttpStatus.FORBIDDEN, {
      message: "Role Poster only",
    });
  }
  await next();
};
