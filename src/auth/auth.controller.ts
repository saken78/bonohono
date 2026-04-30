import { Hono, type Context } from "hono";
import { authService } from "./auth.service";
import {
  type JWT_RESPONSE,
  type LoginUserRequest,
  type RegisterUserRequest,
  type ResetPasswordRequest,
} from "./auth.model";
import { HttpStatus } from "../utils/status_code";
import { AuthMiddleware } from "../middleware/auth.middleware";

const authController = new Hono();
authController.post("/", async (c: Context) => {
  const body: RegisterUserRequest = await c.req.json();
  const result = await authService.register(body);
  c.status(HttpStatus.CREATED);
  return c.json({
    data: result,
    status_code: HttpStatus.CREATED,
  });
});
authController.post("/login", async (c: Context) => {
  const body: LoginUserRequest = await c.req.json();
  const result = await authService.login(body, c);
  return c.json({
    data: result,
    status_code: HttpStatus.OK,
  });
});
authController.use(AuthMiddleware);
authController.get("/me", async (c: Context) => {
  const result = await authService.me(c);
  return c.json({
    data: result.data,
  });
});
authController.patch("/current", async (c: Context) => {
  const user: JWT_RESPONSE = c.get("user");
  const body: ResetPasswordRequest = await c.req.json();
  await authService.resetPassword(body.password, user.email);
  return c.json({
    message: "Password changed succesfully",
    status_code: HttpStatus.OK,
  });
});
authController.delete("/current", async (c: Context) => {
  await authService.logout(c);
  return c.json({
    message: "Cookies cleared succesfully",
    status_code: HttpStatus.OK,
  });
});
authController.delete("/delete_account", async (c: Context) => {
  const user: JWT_RESPONSE = c.get("user");
  await authService.deleteAccount(user.email);
  return c.json({
    message: "Account deleted succesfully",
    status_code: HttpStatus.OK,
  });
});
export default authController;
