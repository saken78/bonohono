import { Hono } from "hono";
import { Scalar } from "@scalar/hono-api-reference";

const docs = new Hono().get(
  "/",
  Scalar({
    url: "openapi",
    theme: "kepler",
    layout: "classic",
    defaultHttpClient: {
      targetKey: "js",
      clientKey: "axios",
    },
  }),
);

export type AppType = typeof docs;
export default docs;
