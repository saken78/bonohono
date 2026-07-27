import { app } from "./app/app";

Bun.serve({
  port: Bun.env.PORT,
  fetch: app.fetch,
});
