import { jsonOK } from "@/lib/response";
import { Hono, type Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { HttpStatus } from "../utils/status_code";
import type { UserResponse } from "./user.model";
import { userService } from "./user.service";

const UserController = new Hono();
UserController.use("*", AuthMiddleware);
UserController.get("/", async (c: Context) => {
  const user: UserResponse[] = await userService.getAllUser();
  return jsonOK(c, user);
});
UserController.get("/:id", async (c: Context) => {
  const id: string | undefined = c.req.param("id");
  if (!id) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "param id not found",
    });
  }
  const user: UserResponse = await userService.getUserById(id);
  return jsonOK(c, user);
});

export default UserController;
