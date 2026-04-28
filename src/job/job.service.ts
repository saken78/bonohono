import { prismaService } from "../db/MariaDB";
import {
  type RegisterJobRequest,
  type GetJobResponse,
  REGISTER_JOB_SCHEMA,
  GET_JOB_ID_SCHEMA,
} from "./job.model";
import { winstonlogger } from "../utils/winston-logger";
import { HTTPException } from "hono/http-exception";
import { HttpStatus } from "../utils/status_code";

export const JobService = {
  async GetAllJob(): Promise<GetJobResponse[]> {
    const jobs = await prismaService.jobs.findMany({
      select: {
        id: true,
        poster_id: true,
        title: true,
        description: true,
        category_id: true,
        budget: true,
        status: true,
        deadline: true,
        location: true,
        work_type: true,
        commitment: true,
        experience_level: true,
        payment_type: true,
        skills: true,
        created_at: true,
        updated_at: true,
      },
      take: 20,
      orderBy: {
        created_at: "desc",
      },
    });
    return jobs;
  },
  async GetJobIdWhereCategory(id: string) {
    const result = await prismaService.jobs.findMany({
      select: {
        title: true,
        description: true,
        budget: true,
        status: true,
        deadline: true,
        location: true,
        work_type: true,
        commitment: true,
        skills: true,
        experience_level: true,
        payment_type: true,
        categories: {
          select: {
            name: true,
            description: true,
          },
        },
      },
      where: { category_id: id },
      take: 20,
      orderBy: {
        created_at: "desc",
      },
    });

    if (!result) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "data not found",
      });
    }

    return result;
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
    });
    return {
      id: job.id,
      poster_id: job.poster_id,
      title: job.title,
      description: job.description,
      category_id: job.category_id,
      budget: job.budget,
      status: job.status,
      deadline: job.deadline,
      location: job.location,
      work_type: job.work_type,
      commitment: job.commitment,
      experience_level: job.experience_level,
      payment_type: job.payment_type,
      skills: job.skills,
      created_at: job.created_at,
      updated_at: job.updated_at,
    };
  },
  async GetJobById(raw_id: string): Promise<GetJobResponse> {
    const id = GET_JOB_ID_SCHEMA.parse(raw_id);
    winstonlogger.debug("executed: ");
    const jobs = await prismaService.jobs.findUnique({
      where: { id: id },
      select: {
        id: true,
        poster_id: true,
        title: true,
        description: true,
        category_id: true,
        budget: true,
        status: true,
        deadline: true,
        location: true,
        work_type: true,
        commitment: true,
        experience_level: true,
        payment_type: true,
        skills: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!jobs) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Job not found",
      });
    }
    return {
      id: jobs.id,
      poster_id: jobs.poster_id,
      title: jobs.title,
      description: jobs.description,
      category_id: jobs.category_id,
      budget: jobs.budget,
      status: jobs.status,
      deadline: jobs.deadline,
      location: jobs.location,
      work_type: jobs.work_type,
      commitment: jobs.commitment,
      experience_level: jobs.experience_level,
      payment_type: jobs.payment_type,
      skills: jobs.skills,
      created_at: jobs.created_at,
      updated_at: jobs.updated_at,
    };
  },
  async GetJobCompleteByUserId(id: string): Promise<GetJobResponse[]> {
    const jobs = await prismaService.jobs.findMany({
      where: {
        poster_id: id,
        status: "completed",
      },
      select: {
        id: true,
        poster_id: true,
        title: true,
        description: true,
        category_id: true,
        budget: true,
        status: true,
        deadline: true,
        location: true,
        work_type: true,
        commitment: true,
        experience_level: true,
        payment_type: true,
        skills: true,
        created_at: true,
        updated_at: true,
      },
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
      select: {
        id: true,
        poster_id: true,
        title: true,
        description: true,
        category_id: true,
        budget: true,
        status: true,
        deadline: true,
        location: true,
        work_type: true,
        commitment: true,
        experience_level: true,
        payment_type: true,
        skills: true,
        created_at: true,
        updated_at: true,
      },
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
      select: {
        id: true,
        poster_id: true,
        title: true,
        description: true,
        category_id: true,
        budget: true,
        status: true,
        deadline: true,
        location: true,
        work_type: true,
        commitment: true,
        experience_level: true,
        payment_type: true,
        skills: true,
        created_at: true,
        updated_at: true,
      },
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
      select: {
        id: true,
        poster_id: true,
        title: true,
        description: true,
        category_id: true,
        budget: true,
        status: true,
        deadline: true,
        location: true,
        work_type: true,
        commitment: true,
        experience_level: true,
        payment_type: true,
        skills: true,
        created_at: true,
        updated_at: true,
      },
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
      select: {
        id: true,
        poster_id: true,
        title: true,
        description: true,
        category_id: true,
        budget: true,
        status: true,
        deadline: true,
        location: true,
        work_type: true,
        commitment: true,
        experience_level: true,
        payment_type: true,
        skills: true,
        created_at: true,
        updated_at: true,
      },
      take: 20,
      orderBy: {
        created_at: "desc",
      },
    });
    return jobs;
  },
};
