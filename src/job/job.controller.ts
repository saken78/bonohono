import { Hono, type Context } from "hono";
import { jobService } from "./job.service";
import { HttpStatus } from "../utils/status_code";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { HTTPException } from "hono/http-exception";
import type { JWT_RESPONSE } from "../auth/auth.model";
import type { JSONRespondReturn } from "../utils/json";
import {
  UPDATE_JOB_SCHEMA,
  type JobControllerResponse,
  type GetJobResponse,
  REGISTER_JOB_SCHEMA,
} from "./job.model";

const JobController = new Hono();
JobController.use("*", AuthMiddleware);
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
    return c.json({
      data: result,
      status_code: HttpStatus.CREATED,
    });
  },
);
JobController.get(
  "/",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse[]>, HttpStatus.OK>
  > => {
    const result: GetJobResponse[] = await jobService.GetAllJob();
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
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
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
JobController.get(
  "/:id/complete",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse[]>, HttpStatus.OK>
  > => {
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param id undefined",
      });
    }
    const result: GetJobResponse[] =
      await jobService.GetJobCompleteByUserId(id);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
JobController.get(
  "/:id/open",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse[]>, HttpStatus.OK>
  > => {
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param id undefined",
      });
    }
    const result: GetJobResponse[] = await jobService.GetJobOpenByUserId(id);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
JobController.get(
  "/:id/in_progress",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse[]>, HttpStatus.OK>
  > => {
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param id undefined",
      });
    }
    const result: GetJobResponse[] =
      await jobService.GetJobInProgressByUserId(id);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
JobController.get(
  "/:id/ready_for_payment",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse[]>, HttpStatus.OK>
  > => {
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param id undefined",
      });
    }
    const result: GetJobResponse[] =
      await jobService.GetJobReadyForPaymentByUserId(id);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
JobController.get(
  "/:id/cancelled",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse[]>, HttpStatus.OK>
  > => {
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param id undefined",
      });
    }
    const result: GetJobResponse[] =
      await jobService.GetJobCancelledByUserId(id);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
JobController.put(
  "/:id",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<JobControllerResponse<GetJobResponse>, HttpStatus.OK>
  > => {
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
    const result = await jobService.UpdateStatusJobByUserId(id, v.status);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);

export default JobController;
