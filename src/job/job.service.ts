import { HTTPException } from "hono/http-exception";
import type { jobs_status } from "../../generated/prisma/enums";
import { prismaService } from "../db/MariaDB";
import { HttpStatus } from "../utils/status_code";
import { winstonlogger } from "../utils/winston-logger";
import { selectData } from "./job.helper";
import {
  GET_JOB_ID_SCHEMA,
  type GetJobResponse,
  REGISTER_JOB_SCHEMA,
  type RegisterJobRequest,
} from "./job.model";

export const JobService = {
  async GetAllJob(): Promise<GetJobResponse[]> {
    const jobs = await prismaService.jobs.findMany({
      select: selectData,
      take: 20,
      orderBy: {
        created_at: "desc",
      },
    });
    return jobs;
  },
  async GetJobIdWhereCategory(id: string): Promise<GetJobResponse[]> {
    const jobs = await prismaService.jobs.findMany({
      select: selectData,
      where: { category_id: id },
      take: 20,
      orderBy: {
        created_at: "desc",
      },
    });

    if (!jobs) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "data not found",
      });
    }

    return jobs;
  },
  async PostJob(
    req: RegisterJobRequest,
    user_id: string,
  ): Promise<GetJobResponse> {
    const request = REGISTER_JOB_SCHEMA.parse(req);
    const job = await prismaService.jobs.create({
      data: {
        poster_id: user_id,
        title: request.title,
        budget: request.budget,
        description: request.description,
        category_id: request.category_id,
        status: request.status,
        deadline: request.deadline,
        location: request.location,
        work_type: request.work_type ?? null,
        commitment: request.commitment,
      },
      select: selectData,
    });
    return job;
  },
  async GetJobById(raw_id: string): Promise<GetJobResponse> {
    const id = GET_JOB_ID_SCHEMA.parse(raw_id);
    winstonlogger.debug("executed: ");
    const job = await prismaService.jobs.findUnique({
      where: { id: id },
      select: selectData,
    });
    if (!job) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Job not found",
      });
    }
    return job;
  },
  async GetJobCompleteByUserId(id: string): Promise<GetJobResponse[]> {
    const jobs = await prismaService.jobs.findMany({
      where: {
        poster_id: id,
        status: "completed",
      },
      select: selectData,
      take: 20,
      orderBy: {
        created_at: "desc",
      },
    });
    return jobs;
  },
  async GetJobOpenByUserId(id: string): Promise<GetJobResponse[]> {
    const jobs = await prismaService.jobs.findMany({
      where: {
        poster_id: id,
        status: "open",
      },
      select: selectData,
      take: 20,
      orderBy: {
        created_at: "desc",
      },
    });
    return jobs;
  },
  async GetJobInProgressByUserId(id: string): Promise<GetJobResponse[]> {
    const jobs = await prismaService.jobs.findMany({
      where: {
        poster_id: id,
        status: "in_progress",
      },
      select: selectData,
      take: 20,
      orderBy: {
        created_at: "desc",
      },
    });
    return jobs;
  },
  async GetJobReadyForPaymentByUserId(id: string): Promise<GetJobResponse[]> {
    const jobs = await prismaService.jobs.findMany({
      where: {
        poster_id: id,
        status: "ready_for_payment",
      },
      select: selectData,
      take: 20,
      orderBy: {
        created_at: "desc",
      },
    });
    return jobs;
  },
  async GetJobCancelledByUserId(id: string): Promise<GetJobResponse[]> {
    const jobs = await prismaService.jobs.findMany({
      where: {
        poster_id: id,
        status: "cancelled",
      },
      select: selectData,
      take: 20,
      orderBy: {
        created_at: "desc",
      },
    });
    return jobs;
  },
  async UpdateStatusJobByUserId(id: string, status: jobs_status) {
    const job = await prismaService.jobs.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
      select: selectData,
    });
    return job;
  },
};
