export type UserResponse = {
  email: string;
  first_name: string;
  poster: number | null;
};
export type AllUserResponse = {
  email: string;
  first_name: string;
  poster: number | null;
};
export type GetAllUserControllerResponse<T> = {
  data: T;
  status_code: number;
};
export type GetUserByIdControllerResponse<T> = {
  data: T;
  status_code: number;
};
