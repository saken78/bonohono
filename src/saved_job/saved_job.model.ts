import type { Decimal } from "@prisma/client/runtime/index-browser";
import type { jobs_status } from "../../generated/prisma/enums";
import { z } from "@hono/zod-openapi";

export const CREATE_JOB_SCHEMA = {
  job_id: z.string().min(1),
};

export const DELETE_JOB_SCHEMA = {
  job_id: z.string().min(1),
};

export type CreateJobRequest = {
  job_id: string;
};

export type DeleteJobRequest = {
  job_id: string;
};

export type GetSavedJobResponse = {
  saved_job_id: string;
  user_id: string;
  job_id: string;
  saved_at: Date;
  id: string;
  poster_id: string;
  title: string;
  description: string;
  category_id: string;
  budget: Decimal;
  status: jobs_status;
  deadline: Date | null;
  location: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  name: string;
  poster_email: string;
  poster_avatar: string | null;
};

export type CreateSavedJobResponse = {
  job_id: string;
};

export type CreateSavedJobController<T> = {
  data: T;
  status_code: number;
};

export type DeleteSavedJobController = {
  message: string;
  status_code: number;
};

export type GetSavedJobByUserIdController<T> = {
  data: T;
  status_code: number;
};
