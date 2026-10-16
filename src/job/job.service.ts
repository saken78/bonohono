import { DEFAULT_PAGE_SIZE } from "@/utils/constants";
import { HTTPException } from "hono/http-exception";
import type { jobs_status } from "../../generated/prisma/enums";
import { prismaService } from "../db/MariaDB";
import { HttpStatus } from "../utils/status_code";
import { selectData } from "./job.helper";
import {
  type GetJobResponse,
  type RegisterJobRequest,
  type SavedJobResponse,
} from "./job.model";

export const jobService = {
  async GetAllJob(): Promise<GetJobResponse[]> {
    const jobs = await prismaService.jobs.findMany({
      select: selectData,
      take: DEFAULT_PAGE_SIZE,
      orderBy: {
        created_at: "desc",
      },
    });
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
  async GetJobStatusByUserId(
    id: string,
    status: jobs_status,
  ): Promise<GetJobResponse[]> {
    const jobs = await prismaService.jobs.findMany({
      where: {
        poster_id: id,
        status: status,
      },
      select: selectData,
      take: DEFAULT_PAGE_SIZE,
      orderBy: {
        created_at: "desc",
      },
    });
    return jobs;
  },
  async UpdateStatusJobByUserId(
    id: string,
    status: jobs_status,
    user_id: string,
  ): Promise<GetJobResponse> {
    const job = await prismaService.jobs.findUnique({
      where: {
        id: id,
      },
      select: {
        poster_id: true,
      },
    });
    if (!job) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "Job not found",
      });
    }
    if (job.poster_id !== user_id) {
      throw new HTTPException(HttpStatus.FORBIDDEN, {
        message: "You're not allowed to update this job",
      });
    }
    const updated = await prismaService.jobs.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
      select: selectData,
    });
    return updated;
  },
  async CreateSavedJob(
    user_id: string,
    job_id: string,
  ): Promise<SavedJobResponse> {
    const data = await prismaService.saved_jobs.create({
      data: {
        user_id: user_id,
        job_id: job_id,
      },
    });
    return data;
  },
  async GetSavedJobById(job_id: string): Promise<SavedJobResponse[]> {
    const data = await prismaService.saved_jobs.findMany({
      where: {
        job_id: job_id,
      },
    });
    return data;
  },
};
