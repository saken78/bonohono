import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import AuthController from "../auth/auth.controller";
import JobController from "../job/job.controller";
import SavedJobController from "../saved_job/saved_job.controller";
import UserController from "../user/user.controller";
import GlobalError from "../utils/error-handling";
import docs from "../utils/scalar";
import { winstonlogger } from "../utils/winston-logger";

export const app = new Hono();
app.use("/*", prettyJSON({ force: true }));
app.use("/*", logger());
app
  .basePath("/api")
  .route("/docs", docs)
  .route("/users", UserController)
  .route("/auth", AuthController)
  .route("/jobs", JobController)
  .route("/saved-jobs", SavedJobController);

app.onError(GlobalError);
for (let i = 0; i < app.routes.length; i++) {
  const route = app.routes[i];
  winstonlogger.info(
    `[METHOD] ${route?.method.padEnd(6)} | [ROUTE] ${route?.path}`,
  );
}

winstonlogger.info("=======================================================");
