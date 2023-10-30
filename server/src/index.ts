import { ValidateError } from "tsoa";
import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { RegisterRoutes } from "../__generated__/routes";
import { websocket } from "./websocket";

require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_CORS, credentials: true }));

if (process.env.NODE_ENVIRONMENT === "development") {
  app.get("/swagger/openapi.json", async (_req: Request, res: Response) => {
    return res.json(await import("../build/swagger.json"));
  });
}

app.use("/swagger", swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(
    swaggerUi.generateHTML(await import("../build/swagger.json"))
  );
});

RegisterRoutes(app);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: err.message,
    });
  }

  next();
});

app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({
    message: "Not Found",
  });
});

websocket();

app.listen(process.env.PORT, () => {
  console.log("Listening to ", process.env.PORT);
});
