import { jsonOK } from "@/lib/response";
import type { JSONRespondReturn } from "@/utils/json";
import { Hono, type Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { HttpStatus } from "../utils/status_code";
import type {
  BodyJobRequest,
  UserControllerResponse,
  UserResponse,
} from "./user.model";
import { userService } from "./user.service";
import type { JWT_RESPONSE } from "@/auth/auth.model";

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
    return jsonOK(c, user);
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
    return jsonOK(c, user);
  },
);
UserController.post(
  "/role",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<UserControllerResponse<UserResponse>, HttpStatus.OK>
  > => {
    const user: JWT_RESPONSE = c.get("user");
    const body: BodyJobRequest = await c.req.json();
    if (!body.role) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Body role undefined",
      });
    }
    const data = await userService.changeRole(user.id, body.role);
    return jsonOK(c, data);
  },
);

export default UserController;
