import { HTTPException } from "hono/http-exception";
import type { jobs_status } from "../../generated/prisma/enums";
import { prismaService } from "../db/MariaDB";
import { HttpStatus } from "../utils/status_code";
import { winstonlogger } from "../utils/winston-logger";
import { selectData } from "./job.helper";
import { type GetJobResponse, type RegisterJobRequest } from "./job.model";

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
    const job = await prismaService.jobs.create({
      data: {
        poster_id: user_id,
        title: req.title,
        budget: req.budget,
        description: req.description,
        category_id: req.category_id,
        status: req.status,
        deadline: req.deadline,
        location: req.location,
        work_type: req.work_type ?? null,
        commitment: req.commitment,
      },
      select: selectData,
    });
    return job;
  },
  async GetJobById(id: string): Promise<GetJobResponse> {
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
  async UpdateStatusJobByUserId(
    id: string,
    status: jobs_status,
  ): Promise<GetJobResponse> {
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
