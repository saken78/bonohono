import { HTTPException } from "hono/http-exception";
import { prismaService } from "../db/MariaDB";
import type { ApplicationResponse } from "./application.model";
import { HttpStatus } from "@/utils/status_code";

export const applicationService = {
  async applyJob(
    job_id: string,
    tasker_id: string,
    proposal: string,
    proposed_budget: number,
  ): Promise<ApplicationResponse> {
    const check_job = await prismaService.jobs.findUnique({
      where: {
        id: job_id,
      },
      select: {
        poster_id: true,
        status: true,
      },
    });

    if (!check_job) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "Job not foud",
      });
    }

    if (check_job.status !== "open") {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "Cannot apply to a job that is not open",
      });
    }

    const existing = await prismaService.applications.findUnique({
      where: {
        job_id_tasker_id: {
          job_id: job_id,
          tasker_id: tasker_id,
        },
      },
    });

    if (existing) {
      throw new HTTPException(HttpStatus.CONFLICT, {
        message: "You have already applied to this job",
      });
    }

    const data = await prismaService.applications.create({
      data: {
        job_id: job_id,
        tasker_id: tasker_id,
        proposal: proposal,
        proposed_budget: proposed_budget,
      },
    });

    if (!data) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "Application not found",
      });
    }

    const created_at = data.created_at?.toISOString().split("T")[0];
    const updated_at = data.updated_at?.toISOString().split("T")[0];

    return {
      id: data.id,
      job_id: data.job_id,
      tasker_id: data.tasker_id,
      proposal: data.proposal,
      proposed_budget: data.proposed_budget,
      status: data.status,
      created_at: created_at,
      updated_at: updated_at,
    };
  },
  async myApplications(tasker_id: string): Promise<ApplicationResponse[]> {
    const raw = await prismaService.applications.findMany({
      where: {
        tasker_id: tasker_id,
      },
    });
    const data = raw.map((ap) => {
      return {
        id: ap.id,
        job_id: ap.job_id,
        tasker_id: ap.tasker_id,
        proposal: ap.proposal,
        proposed_budget: ap.proposed_budget,
        status: ap.status,
        created_at: ap.created_at?.toISOString().split("T")[0],
        updated_at: ap.updated_at?.toISOString().split("T")[0],
      };
    });
    return data;
  },
};
