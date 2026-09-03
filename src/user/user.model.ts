export type UserResponse = {
  email: string;
  first_name: string;
  role: string | null;
};

export type UserControllerResponse<T> = {
  data: T;
  status_code: number;
};
