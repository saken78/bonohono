import type { Decimal } from "@prisma/client/runtime/index-browser";
import {
  jobs_commitment,
  jobs_experience_level,
  jobs_payment_type,
  jobs_status,
  jobs_work_type,
} from "../../generated/prisma/enums";
import { z } from "@hono/zod-openapi";

export const REGISTER_JOB_SCHEMA = z.object({
  poster_id: z.string(),
  title: z.string().min(2).max(100),
  budget: z.number().positive(),
  description: z.string(),
  category_id: z.string(),
  status: z.enum(jobs_status),
  deadline: z.iso.date(),
  location: z.string(),
  work_type: z.enum(jobs_work_type).nullable(),
  commitment: z.enum(jobs_commitment),
});

export const UPDATE_JOB_SCHEMA = z.object({
  status: z.enum([
    "open",
    "in_progress",
    "ready_for_payment",
    "completed",
    "cancelled",
  ]),
});

export type RegisterJobRequest = z.infer<typeof REGISTER_JOB_SCHEMA>;

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

export type JobControllerResponse<T> = {
  data: T;
  status_code: number;
};
