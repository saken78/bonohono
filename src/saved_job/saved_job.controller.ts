import { Hono, type Context } from "hono";
import { HttpStatus } from "../utils/status_code";
import { SavedJobService } from "./saved_job.service";
import { AuthMiddleware } from "../middleware/auth.middleware";
import type { CREATE_JOB_REQUEST } from "./saved_job.model";
import type { JWT_RESPONSE } from "../auth/auth.model";
import { HTTPException } from "hono/http-exception";

export const SavedJobController = new Hono();
SavedJobController.use("*", AuthMiddleware);
SavedJobController.post("/", async (c: Context) => {
  const job: CREATE_JOB_REQUEST = await c.req.json();
  const user: JWT_RESPONSE = c.get("user");
  if (!job) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Body job_id undefined",
    });
  }
  const result = await SavedJobService.CreateSavedJob(user.id, job.job_id);
  c.status(HttpStatus.CREATED);
  return c.json({
    data: result,
    status_code: HttpStatus.CREATED,
  });
});
SavedJobController.get("/", async (c: Context) => {
  const user: JWT_RESPONSE = c.get("user");
  if (!user.id) {
    throw new HTTPException(HttpStatus.UNAUTHORIZED, {
      message: "UNAUTHORIZED",
    });
  }
  const result = await SavedJobService.GetSavedJobByUserId(user.id);
  return c.json({
    data: result,
    status_code: HttpStatus.CREATED,
  });
});
SavedJobController.delete("/", async (c: Context) => {
  const jobs: CREATE_JOB_REQUEST = await c.req.json();
  const user: JWT_RESPONSE = c.get("user");
  await SavedJobService.DeleteSavedJob(user.id, jobs.job_id);
  return c.json({
    message: "Job delete from saved",
    status_code: HttpStatus.OK,
  });
});
