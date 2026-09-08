import { Hono, type Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { AuthMiddleware } from "../middleware/auth.middleware";
import type { JSONRespondReturn } from "../utils/json";
import { HttpStatus } from "../utils/status_code";
import type { UserControllerResponse, UserResponse } from "./user.model";
import { userService } from "./user.service";

const UserController = new Hono();
UserController.use("*", AuthMiddleware);
UserController.get(
  "/",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<UserControllerResponse<UserResponse[]>, HttpStatus.OK>
  > => {
    const user: UserResponse[] = await userService.getAllUser();
    return c.json({
      data: user,
      status_code: HttpStatus.OK,
    });
  },
);
UserController.get(
  "/:id",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<UserControllerResponse<UserResponse>, HttpStatus.OK>
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

export default UserController;
