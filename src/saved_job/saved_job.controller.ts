import { Hono, type Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { JWT_RESPONSE } from "../auth/auth.model";
import { AuthMiddleware } from "../middleware/auth.middleware";
import type { JSONRespondReturn } from "../utils/json";
import { HttpStatus } from "../utils/status_code";
import type {
  DeleteJobRequest,
  GetSavedJobResponse,
  SavedJobControllerResponse,
} from "./saved_job.model";
import { savedJobService } from "./saved_job.service";

const SavedJobController = new Hono();
SavedJobController.use("*", AuthMiddleware);
SavedJobController.get(
  "/",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      SavedJobControllerResponse<GetSavedJobResponse[]>,
      HttpStatus.OK
    >
  > => {
    const user: JWT_RESPONSE = c.get("user");
    if (!user.id) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "UNAUTHORIZED",
      });
    }
    const result: GetSavedJobResponse[] =
      await savedJobService.GetSavedJobByUserId(user.id);
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
  ): Promise<
    JSONRespondReturn<SavedJobControllerResponse<string>, HttpStatus.OK>
  > => {
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
    await savedJobService.DeleteSavedJob(user.id, jobs.job_id);
    return c.json({
      data: "Job deleted from saved",
      status_code: HttpStatus.OK,
    });
  },
);

export default SavedJobController;
