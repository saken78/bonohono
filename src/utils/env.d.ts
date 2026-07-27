declare module "bun" {
  interface Env {
    DATABASE_URL: string;
    DATABASE_USER: string;
    DATABASE_NAME: string;
    DATABASE_HOST: string;
    DATABASE_PORT: string;
    SECRET: string;
    PORT: string;
    PASSWORD: string;
    CORS_ORIGIN_DEV: string;
  }
}
