import { Hono, type Context } from "hono";
import { HttpStatus } from "../utils/status_code";
import { SavedJobService } from "./saved_job.service";
import { AuthMiddleware } from "../middleware/auth.middleware";
import type {
  CreateJobRequest,
  CreateSavedJobController,
  CreateSavedJobResponse,
  DeleteJobRequest,
  DeleteSavedJobController,
  GetSavedJobByUserIdController,
  GetSavedJobResult,
} from "./saved_job.model";
import type { JWT_RESPONSE } from "../auth/auth.model";
import { HTTPException } from "hono/http-exception";
import type { JSONRespondReturn } from "../utils/json";

export const SavedJobController = new Hono();
SavedJobController.use("*", AuthMiddleware);
SavedJobController.post(
  "/",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      CreateSavedJobController<CreateSavedJobResponse>,
      HttpStatus.CREATED
    >
  > => {
    const job: CreateJobRequest = await c.req.json();
    const user: JWT_RESPONSE = c.get("user");
    if (!job) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Body job_id undefined",
      });
    }
    if (!user.id) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "UNAUTHORIZED",
      });
    }
    const result: CreateSavedJobResponse = await SavedJobService.CreateSavedJob(
      user.id,
      job.job_id,
    );
    c.status(HttpStatus.CREATED);
    return c.json({
      data: result,
      status_code: HttpStatus.CREATED,
    });
  },
);
SavedJobController.get(
  "/",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      GetSavedJobByUserIdController<GetSavedJobResult[]>,
      HttpStatus.OK
    >
  > => {
    const user: JWT_RESPONSE = c.get("user");
    if (!user.id) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "UNAUTHORIZED",
      });
    }
    const result: GetSavedJobResult[] =
      await SavedJobService.GetSavedJobByUserId(user.id);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
SavedJobController.delete(
  "/",
  async (
    c: Context,
  ): Promise<JSONRespondReturn<DeleteSavedJobController, HttpStatus.OK>> => {
    const jobs: DeleteJobRequest = await c.req.json();
    const user: JWT_RESPONSE = c.get("user");
    if (!user.id) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "UNAUTHORIZED",
      });
    }
    if (!jobs.job_id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "body job_id undefined",
      });
    }
    await SavedJobService.DeleteSavedJob(user.id, jobs.job_id);
    return c.json({
      message: "Job delete from saved",
      status_code: HttpStatus.OK,
    });
  },
);
