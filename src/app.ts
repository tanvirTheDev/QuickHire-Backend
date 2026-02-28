import "express-async-errors";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";
import mainRouter from "./routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", mainRouter);

app.use(notFound);

app.use(errorHandler);

export default app;
