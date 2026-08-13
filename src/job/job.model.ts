import type { Decimal } from "@prisma/client/runtime/index-browser";
import {
  jobs_commitment,
  jobs_experience_level,
  jobs_payment_type,
  jobs_status,
  jobs_work_type,
} from "../../generated/prisma/enums";
import { z } from "@hono/zod-openapi";

export const GET_JOB_BY_CATEGORY_SCHEMA = z.object({
  category_id: z.string().min(3),
});
export const GET_JOB_ID_SCHEMA = z.string();
export const REGISTER_JOB_SCHEMA = z.object({
  title: z.string().min(2).max(100),
  budget: z.number().positive(),
  description: z.string(),
  category_id: z.string(),
  status: z.enum(jobs_status),
  deadline: z.iso.datetime(),
  location: z.string(),
  work_type: z.enum(jobs_work_type),
  commitment: z.enum(jobs_commitment),
});

export type RegisterJobRequest = {
  poster_id: string;
  title: string;
  budget: Decimal;
  description: string;
  category_id: string;
  status: jobs_status;
  deadline: Date;
  location: string;
  work_type?: jobs_work_type;
  commitment: jobs_commitment;
};

export type GetJobByCategoryRequest = {
  category_id: string;
};

export type GetJobResponse = {
  id: string;
  poster_id: string;
  title: string;
  description: string;
  categories: {
    name: string;
    description: string | null;
  } | null;
  budget: Decimal;
  status: jobs_status;
  deadline: Date | null;
  location: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  work_type: jobs_work_type | null;
  commitment: jobs_commitment | null;
  experience_level: jobs_experience_level | null;
  payment_type: jobs_payment_type | null;
  skills: string | null;
};

export type CreateJobControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type GetAllJobControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type GetIdJobControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type GetIdCompletedJobControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type GetIdOpenJobControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type GetIdInProgressJobControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type GetIdReadyForPaymentJobControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type GetIdCancelledJobControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type GetIdcategoryJobControllerResponse<T> = {
  data: T;
  status_code: number;
};
