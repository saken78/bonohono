import { jsonCreated, jsonOK } from "@/lib/response";
import { PosterMiddleware } from "@/middleware/poster.middleware";
import { Hono, type Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { JWT_RESPONSE } from "../auth/auth.model";
import { AuthMiddleware } from "../middleware/auth.middleware";
import type { JSONRespondReturn } from "../utils/json";
import { HttpStatus } from "../utils/status_code";
import {
  GET_STATUS,
  REGISTER_JOB_SCHEMA,
  UPDATE_JOB_SCHEMA,
  type GetJobResponse,
  type JobControllerResponse,
  type SavedJobResponse,
} from "./job.model";
import { jobService } from "./job.service";

const JobController = new Hono();
JobController.use("*", AuthMiddleware);
JobController.get(
  "/",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse[]>, HttpStatus.OK>
  > => {
    const result: GetJobResponse[] = await jobService.GetAllJob();
    return jsonOK(c, result);
  },
);
JobController.get(
  "/:id",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse>, HttpStatus.OK>
  > => {
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "param id undefined",
      });
    }
    const result: GetJobResponse = await jobService.GetJobById(id);
    return jsonOK(c, result);
  },
);
JobController.use(PosterMiddleware);
JobController.post(
  "/",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse>, HttpStatus.CREATED>
  > => {
    const user: JWT_RESPONSE = c.get("user");
    const body = await c.req.json();
    const v = REGISTER_JOB_SCHEMA.parse(body);
    const result: GetJobResponse = await jobService.PostJob(v, user.id);
    return jsonCreated(c, result);
  },
);
JobController.get(
  "/:id/status",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse[]>, HttpStatus.OK>
  > => {
    const id: string | undefined = c.req.param("id");
    const status = c.req.query("status");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param id undefined",
      });
    }
    if (!status) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Query param status is required",
      });
    }
    const v = GET_STATUS.parse({ status });
    const result: GetJobResponse[] = await jobService.GetJobStatusByUserId(
      id,
      v.status,
    );
    return jsonOK(c, result);
  },
);
JobController.put(
  "/:id",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse>, HttpStatus.OK>
  > => {
    const user: JWT_RESPONSE = c.get("user");
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param id undefined",
      });
    }
    const body = await c.req.json();
    if (!body) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Body status undefined",
      });
    }
    const v = UPDATE_JOB_SCHEMA.parse(body);
    const result = await jobService.UpdateStatusJobByUserId(
      id,
      v.status,
      user.id,
    );
    return jsonOK(c, result);
  },
);
JobController.post(
  "/:id/save",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<SavedJobResponse>, HttpStatus.OK>
  > => {
    const job_id = c.req.param("id");
    if (!job_id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param id undefined",
      });
    }
    const user: JWT_RESPONSE = c.get("user");
    const result = await jobService.CreateSavedJob(user.id, job_id);
    return jsonOK(c, result);
  },
);

JobController.get(
  "/:id/save",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<SavedJobResponse[]>, HttpStatus.OK>
  > => {
    const job_id = c.req.param("id");
    if (!job_id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param id undefined",
      });
    }
    const result = await jobService.GetSavedJobById(job_id);
    return jsonOK(c, result);
  },
);

export default JobController;
