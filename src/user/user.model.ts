export type UserResponse = {
  email: string;
  first_name: string;
  poster: number | null;
};

export type UserControllerResponse<T> = {
  data: T;
  status_code: number;
};
