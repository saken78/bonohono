import type { JSONRespondReturn } from "@/utils/json";
import { Hono, type Context } from "hono";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { HttpStatus } from "../utils/status_code";
import {
  LOGIN_SCHEMA,
  REGISTER_SCHEMA,
  RESET_PASSWORD_SCHEMA,
  type AuthControllerResponse,
  type AuthResponse,
  type JWT_RESPONSE,
} from "./auth.model";
import { authService } from "./auth.service";

const AuthController = new Hono();
AuthController.post(
  "/",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<AuthControllerResponse<AuthResponse>, HttpStatus.CREATED>
  > => {
    const body = await c.req.json();
    const v = REGISTER_SCHEMA.parse(body);
    const result = await authService.register(v);
    return c.json({
      data: result,
      status_code: HttpStatus.CREATED,
    });
  },
);
AuthController.post(
  "/login",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<AuthControllerResponse<AuthResponse>, HttpStatus.OK>
  > => {
    const body = await c.req.json();
    const v = LOGIN_SCHEMA.parse(body);
    const result = await authService.login(v, c);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
AuthController.use(AuthMiddleware);
AuthController.get(
  "/me",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<AuthControllerResponse<JWT_RESPONSE>, HttpStatus.OK>
  > => {
    const result = await authService.me(c);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
AuthController.patch(
  "/current",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<AuthControllerResponse<string>, HttpStatus.OK>
  > => {
    const user: JWT_RESPONSE = c.get("user");
    const body = await c.req.json();
    const v = RESET_PASSWORD_SCHEMA.parse(body);
    await authService.resetPassword(v, user.email);
    return c.json({
      data: "Password changed successfully",
      status_code: HttpStatus.OK,
    });
  },
);
AuthController.delete(
  "/current",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<AuthControllerResponse<string>, HttpStatus.OK>
  > => {
    await authService.logout(c);
    return c.json({
      data: "Cookies cleared successfully",
      status_code: HttpStatus.OK,
    });
  },
);
AuthController.delete(
  "/delete_account",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<AuthControllerResponse<string>, HttpStatus.OK>
  > => {
    const user: JWT_RESPONSE = c.get("user");
    await authService.deleteAccount(user.email);
    return c.json({
      data: "Account deleted successfully",
      status_code: HttpStatus.OK,
    });
  },
);
export default AuthController;
