import "express-async-errors";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";
import mainRouter from "./routes";

const app = express();

const corsOrigin =
  process.env.CLIENT_URL ||
  (process.env.NODE_ENV === "development" ? "*" : false);

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (_req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "QuickHire API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", mainRouter);

app.use(notFound);

app.use(errorHandler);

export default app;
