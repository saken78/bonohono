import { type Context, Hono } from "hono";
import { applicationService } from "./application.service";
import type { JWT_RESPONSE } from "@/auth/auth.model";
import { HTTPException } from "hono/http-exception";
import { HttpStatus } from "@/utils/status_code";
import type { ApplyJobRequest } from "./application.model";
import { AuthMiddleware } from "@/middleware/auth.middleware";

export const ApplicationController = new Hono();
ApplicationController.use(AuthMiddleware);
ApplicationController.post("/:id/apply", async (c: Context) => {
  const job_id = c.req.param("id");
  if (!job_id) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Job id undefined",
    });
  }
  const tasker: JWT_RESPONSE = c.get("user");
  const body: ApplyJobRequest = await c.req.json();
  if (!body.proposal) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Proposal is required!",
    });
  }
  if (!body.proposed_budget) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Proposed budget is required!",
    });
  }
  const data = await applicationService.applyJob(
    job_id,
    tasker.id,
    body.proposal,
    body.proposed_budget,
  );
  return c.json(data);
});
