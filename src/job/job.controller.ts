import { Hono, type Context } from "hono";
import { JobService } from "./job.service";
import { HttpStatus } from "../utils/status_code";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { HTTPException } from "hono/http-exception";
import type { JWT_RESPONSE } from "../auth/auth.model";
import type { JSONRespondReturn } from "../utils/json";
import type {
  CreateJobControllerResponse,
  GetAllJobControllerResponse,
  GetIdCancelledJobControllerResponse,
  GetIdCompletedJobControllerResponse,
  GetIdInProgressJobControllerResponse,
  GetIdJobControllerResponse,
  GetIdOpenJobControllerResponse,
  GetIdReadyForPaymentJobControllerResponse,
  GetJobResult,
  REGISTER_JOB,
} from "./job.model";

export const JobController = new Hono();
JobController.use(AuthMiddleware);
JobController.post(
  "/",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      CreateJobControllerResponse<GetJobResult>,
      HttpStatus.CREATED
    >
  > => {
    const user: JWT_RESPONSE = c.get("user");
    if (!user) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "UNAUTHORIZED",
      });
    }
    const body: REGISTER_JOB = await c.req.json();
    const result: GetJobResult = await JobService.PostJob(body, user.id);
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
    JSONRespondReturn<
      GetAllJobControllerResponse<GetJobResult[]>,
      HttpStatus.OK
    >
  > => {
    const user: JWT_RESPONSE = c.get("user");
    if (!user) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Unauthorized",
      });
    }
    const result: GetJobResult[] = await JobService.GetAllJob();
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
    JSONRespondReturn<GetIdJobControllerResponse<GetJobResult>, HttpStatus.OK>
  > => {
    const user: JWT_RESPONSE = c.get("user");
    if (!user) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "param id undefined",
      });
    }
    // console.dir(c.var, { depth: null });
    // console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(c)));
    const result: GetJobResult = await JobService.GetJobById(id);
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
    JSONRespondReturn<
      GetIdCompletedJobControllerResponse<GetJobResult[]>,
      HttpStatus.OK
    >
  > => {
    const user: JWT_RESPONSE = c.get("user");
    if (!user) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param not found",
      });
    }
    const result: GetJobResult[] = await JobService.GetJobCompleteByUserId(id);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
JobController.get(
  ":/id/open",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      GetIdOpenJobControllerResponse<GetJobResult[]>,
      HttpStatus.OK
    >
  > => {
    const user: JWT_RESPONSE = c.get("user");
    if (!user) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param not found",
      });
    }
    const result: GetJobResult[] = await JobService.GetJobOpenByUserId(id);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
JobController.get(
  ":/id/in_progress",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      GetIdInProgressJobControllerResponse<GetJobResult[]>,
      HttpStatus.OK
    >
  > => {
    const user: JWT_RESPONSE = c.get("user");
    if (!user) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param not found",
      });
    }
    const result: GetJobResult[] =
      await JobService.GetJobInProgressByUserId(id);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
JobController.get(
  ":/id/ready_for_payment",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      GetIdReadyForPaymentJobControllerResponse<GetJobResult[]>,
      HttpStatus.OK
    >
  > => {
    const user: JWT_RESPONSE = c.get("user");
    if (!user) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param not found",
      });
    }
    const result: GetJobResult[] =
      await JobService.GetJobReadyForPaymentByUserId(id);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);
JobController.get(
  ":/id/cancelled",
  async (
    c: Context,
  ): Promise<
    JSONRespondReturn<
      GetIdCancelledJobControllerResponse<GetJobResult[]>,
      HttpStatus.OK
    >
  > => {
    const user: JWT_RESPONSE = c.get("user");
    if (!user) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }
    const id: string | undefined = c.req.param("id");
    if (!id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Param not found",
      });
    }
    const result: GetJobResult[] = await JobService.GetJobCancelledByUserId(id);
    return c.json({
      data: result,
      status_code: HttpStatus.OK,
    });
  },
);

// JobController.get("/cg/:category_id", async (c: Context) => {
//   const user = c.get("user");
//   if (!user) {
//     throw new HTTPException(HttpStatus.BAD_REQUEST, {
//       message: "Unauthorized",
//     });
//   }
//   const rawId = c.req.param("category_id");
//   if (!rawId || rawId === undefined) {
//     throw new HTTPException(HttpStatus.BAD_REQUEST, {
//       message: "body not found",
//     });
//   }
//   const id: string = rawId;
//   const result = await JobService.GetJobIdWhereCategory(id);
//   return c.json({
//     data: result,
//     status_code: HttpStatus.OK,
//   });
// });
