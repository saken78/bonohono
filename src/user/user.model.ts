import z from "zod";

export type UserResponse = {
  id: string;
  email: string;
  first_name: string;
  role: string | null;
};

export const BODY_JOB_SCHEMA = z.object({
  role: z.string().min(8).max(100),
});

export type BodyJobRequest = z.infer<typeof BODY_JOB_SCHEMA>;

export type UserControllerResponse<T> = {
  data: T;
};
