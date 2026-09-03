import { z } from "@hono/zod-openapi";

export const REGISTER_SCHEMA = z.object({
  email: z.email().min(1).max(100),
  password: z.string().min(8).max(100),
  first_name: z.string().min(4).max(100),
  last_name: z.string().min(4).max(100).nullable().optional(),
});

export type RegisterUserRequest = z.infer<typeof REGISTER_SCHEMA>;

export const LOGIN_SCHEMA = z.object({
  email: z.email().min(1).max(100),
  password: z.string().min(8).max(100),
});

export type LoginUserRequest = z.infer<typeof LOGIN_SCHEMA>;

export const RESET_PASSWORD_SCHEMA = z.object({
  password: z.string().min(8).max(100),
});

export type ResetPasswordRequest = z.infer<typeof RESET_PASSWORD_SCHEMA>;

// RESPONSE
export type AuthResponse = {
  email: string;
  first_name: string;
};

export const AUTH_RESPONSE_SCHEMA = {
  email: z.string().openapi("example@gmail.com"),
  first_name: z.string().openapi("example"),
};

export type AuthResponseQuery = {
  email: string;
  first_name: string;
};

export type JWT_PAYLOAD = {
  sub?: string;
  email?: string;
  role?: string | null | undefined;
  exp?: number;
  iat?: number;
};

export type JWT_RESPONSE = {
  id: string;
  email: string;
  role: string;
};

export type AuthControllerResponse<T> = {
  data: T;
  status_code: number;
};
