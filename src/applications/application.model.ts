import { z } from "@hono/zod-openapi";
import type { applications_status } from "../../generated/prisma/enums";
import type { Decimal } from "../../generated/prisma/internal/prismaNamespace";

export const APLLY_JOB_SCHEMA = z.object({
  proposal: z.string().min(8).max(100),
  proposed_budget: z.number().min(0),
});

export type ApplyJobRequest = z.infer<typeof APLLY_JOB_SCHEMA>;

export type ApplicationResponse = {
  id: string;
  job_id: string;
  tasker_id: string;
  proposal: string;
  proposed_budget: Decimal | null;
  status: applications_status | null;
  created_at: String | null | undefined;
  updated_at: String | null | undefined;
};

export type ApplicationControllerResponse<T> = {
  data: T;
};
