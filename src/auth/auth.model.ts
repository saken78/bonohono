import { z } from "@hono/zod-openapi";

export const REGISTER_SCHEMA = z.object({
  email: z.string().email().min(1).max(100),
  password: z.string().min(8).max(100),
  first_name: z.string().min(4).max(100),
  last_name: z.string().min(4).max(100).nullable(),
});

export type RegisterUserRequest = {
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
};

export const LOGIN_SCHEMA = z.object({
  email: z.string().email().min(1).max(100),
  password: z.string().min(8).max(100),
});

export type LoginUserRequest = {
  email: string;
  password: string;
};

export const RESET_PASSWORD_SCHEMA = z.object({
  password: z.string().min(8).max(100),
});

export type ResetPasswordRequest = {
  password: string;
};

export const DELETE_SCHEMA = z.object({
  email: z.string().email().min(1).max(100),
});

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
  role?: number | null | undefined;
  exp?: number;
  iat?: number;
};

export type JWT_RESPONSE = {
  id: string;
  email: string;
  poster: number;
};

export type RegisterAuthControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type LoginAuthControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type MeAuthControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type ResetPasswordAuthControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type LogoutAuthControllerResponse<T> = {
  data: T;
  status_code: number;
};

export type DeleteAuthControllerResponse<T> = {
  data: T;
  status_code: number;
};
