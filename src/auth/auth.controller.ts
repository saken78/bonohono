import { Hono, type Context } from "hono";
import { authService } from "./auth.service";
import {
  type AuthResponse,
  type DeleteAuthControllerResponse,
  type JWT_RESPONSE,
  type LoginAuthControllerResponse,
  type LoginUserRequest,
  type LogoutAuthControllerResponse,
  type MeAuthControllerResponse,
  type RegisterAuthControllerResponse,
  type RegisterUserRequest,
  type ResetPasswordAuthControllerResponse,
  type ResetPasswordRequest,
} from "./auth.model";
import { HttpStatus } from "../utils/status_code";
import { AuthMiddleware } from "../middleware/auth.middleware";
import type { JSONRespondReturn } from "@/utils/json";

const AuthController = new Hono();
AuthController.post(
  "/",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      RegisterAuthControllerResponse<AuthResponse>,
      HttpStatus.CREATED
    >
  > => {
    const body: RegisterUserRequest = await c.req.json();
    const result = await authService.register(body);
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
    JSONRespondReturn<LoginAuthControllerResponse<AuthResponse>, HttpStatus.OK>
  > => {
    const body: LoginUserRequest = await c.req.json();
    const result = await authService.login(body, c);
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
    JSONRespondReturn<MeAuthControllerResponse<JWT_RESPONSE>, HttpStatus.OK>
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
    JSONRespondReturn<
      ResetPasswordAuthControllerResponse<string>,
      HttpStatus.OK
    >
  > => {
    const user: JWT_RESPONSE = c.get("user");
    const body: ResetPasswordRequest = await c.req.json();
    await authService.resetPassword(body.password, user.email);
    return c.json({
      data: "Password changed succesfully",
      status_code: HttpStatus.OK,
    });
  },
);
AuthController.delete(
  "/current",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<LogoutAuthControllerResponse<string>, HttpStatus.OK>
  > => {
    await authService.logout(c);
    return c.json({
      data: "Cookies cleared succesfully",
      status_code: HttpStatus.OK,
    });
  },
);
AuthController.delete(
  "/delete_account",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<DeleteAuthControllerResponse<string>, HttpStatus.OK>
  > => {
    const user: JWT_RESPONSE = c.get("user");
    await authService.deleteAccount(user.email);
    return c.json({
      data: "Account deleted succesfully",
      status_code: HttpStatus.OK,
    });
  },
);
export default AuthController;
