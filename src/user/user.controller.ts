import { Hono, type Context } from "hono";
import { userService } from "./user.service.ts";
import { HttpStatus } from "../utils/status_code.ts";
import { AuthMiddleware } from "../middleware/auth.middleware.ts";
import { HTTPException } from "hono/http-exception";
import type {
  GetAllUserControllerResponse,
  GetUserByIdControllerResponse,
  UserResponse,
} from "./user.model.ts";
import type { JSONRespondReturn } from "../utils/json.ts";

export const userController = new Hono();
userController.use("*", AuthMiddleware);
userController.get(
  "/",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      GetAllUserControllerResponse<UserResponse[]>,
      HttpStatus.OK
    >
  > => {
    const user: UserResponse[] = await userService.getAllUser();
    return c.json({
      data: user,
      status_code: HttpStatus.OK,
    });
  },
);
userController.get(
  "/:id",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      GetUserByIdControllerResponse<UserResponse>,
      HttpStatus.OK
    >
  > => {
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "param id not found",
      });
    }
    const user: UserResponse = await userService.getUserById(id);
    return c.json({
      data: user,
      status_code: HttpStatus.OK,
    });
  },
);
