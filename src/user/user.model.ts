import z from "zod";
import { users_role } from "../../generated/prisma/enums";

export type UserResponse = {
  id: string;
  email: string;
  first_name: string;
  role: string | null;
};

export const BODY_JOB_SCHEMA = z.object({
  role: z.enum(users_role),
});

export type BodyJobRequest = z.infer<typeof BODY_JOB_SCHEMA>;

export type UserControllerResponse<T> = {
  data: T;
};
