import { Hono, type Context } from "hono";
import { JobService } from "./job.service";
import { HttpStatus } from "../utils/status_code";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { HTTPException } from "hono/http-exception";
import type { JWT_RESPONSE } from "../auth/auth.model";
import type { JSONRespondReturn } from "../utils/json";
import {
  UPDATE_JOB_SCHEMA,
  type JobControllerResponse,
  type GetJobResponse,
  type RegisterJobRequest,
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
    const body: RegisterJobRequest = await c.req.json();
    const result: GetJobResponse = await JobService.PostJob(body, user.id);
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
    const result: GetJobResponse[] = await JobService.GetAllJob();
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
    const result: GetJobResponse = await JobService.GetJobById(id);
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
      await JobService.GetJobCompleteByUserId(id);
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
    const result: GetJobResponse[] = await JobService.GetJobOpenByUserId(id);
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
      await JobService.GetJobInProgressByUserId(id);
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
      await JobService.GetJobReadyForPaymentByUserId(id);
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
      await JobService.GetJobCancelledByUserId(id);
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
    const body = c.req.json();
    if (!body) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Body status undefined",
      });
    }
    const validate = UPDATE_JOB_SCHEMA.parse(body);
    const result = await JobService.UpdateStatusJobByUserId(
      id,
      validate.status,
    );
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);

export default JobController;
