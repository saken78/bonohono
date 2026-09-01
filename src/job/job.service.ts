import { HTTPException } from "hono/http-exception";
import type { jobs_status } from "../../generated/prisma/enums";
import { prismaService } from "../db/MariaDB";
import { HttpStatus } from "../utils/status_code";
import { selectData } from "./job.helper";
import {
  type ApplyJobResponse,
  type GetJobResponse,
  type RegisterJobRequest,
} from "./job.model";

export const jobService = {
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
  async ApplyJob(
    job_id: string,
    proposal: string,
    proposal_budget: number | undefined,
    tasker_id: string,
  ): Promise<ApplyJobResponse> {
    const job = await prismaService.jobs.findUnique({
      where: {
        id: job_id,
      },
      select: {
        poster_id: true,
        status: true,
      },
    });

    if (!job) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "Job not found",
      });
    }

    if (job.status !== "open") {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Cannot apply to a job that is not open",
      });
    }
    const existingApplication = await prismaService.applications.findFirst({
      where: {
        job_id: job_id,
        tasker_id: tasker_id,
      },
      select: {
        id: true,
      },
    });

    if (existingApplication) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "You have already applied to this job",
      });
    }

    if (job.poster_id === tasker_id) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "You cannot apply to your own job",
      });
    }

    const application = await prismaService.applications.create({
      data: {
        job_id: job_id,
        tasker_id: tasker_id,
        proposal: proposal,
        proposed_budget: proposal_budget ?? null,
      },
      select: {
        id: true,
        job_id: true,
        tasker_id: true,
        proposal: true,
        proposed_budget: true,
        status: true,
        created_at: true,
      },
    });
    return application;
  },
};
