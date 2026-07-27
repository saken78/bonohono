import { createRoute } from "@hono/zod-openapi";
import { HttpStatus } from "../utils/status_code";
import { AUTH_RESPONSE_SCHEMA } from "./auth.model";
const tags = ["Tasks"];
export const list = createRoute({
  path: "/",
  method: "post",
  tags,
  responses: {
    [HttpStatus.CREATED]: {
      content: {
        "application/json": {
          schema: AUTH_RESPONSE_SCHEMA,
        },
      },
      description: "Create User",
    },
  },
});
