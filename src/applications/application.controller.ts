import { type Context, Hono } from "hono";
import { applicationService } from "./application.service";
import type { JWT_RESPONSE } from "@/auth/auth.model";
import { HTTPException } from "hono/http-exception";
import { HttpStatus } from "@/utils/status_code";
import type {
  ApplicationControllerResponse,
  ApplicationResponse,
  ApplyJobRequest,
} from "./application.model";
import { AuthMiddleware } from "@/middleware/auth.middleware";
import { jsonOK } from "@/lib/response";
import { TaskerMiddleware } from "@/middleware/tasker.middleware";
import type { JSONRespondReturn } from "@/utils/json";

export const ApplicationController = new Hono();
ApplicationController.use("*", AuthMiddleware);
ApplicationController.use("*", TaskerMiddleware);
ApplicationController.post(
  "/:id/apply",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      ApplicationControllerResponse<ApplicationResponse>,
      HttpStatus.OK
    >
  > => {
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
    return jsonOK(c, data);
  },
);

ApplicationController.get(
  "my-applications",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      ApplicationControllerResponse<ApplicationResponse[]>,
      HttpStatus.OK
    >
  > => {
    const tasker: JWT_RESPONSE = c.get("user");
    const data = await applicationService.myApplications(tasker.id);
    return jsonOK(c, data);
  },
);
