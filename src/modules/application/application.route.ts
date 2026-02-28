import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  getAllApplicationsController,
  getApplicationByIdController,
  getApplicationsByJobIdController,
  submitApplicationController,
} from "./application.controller";
import { createApplicationSchema } from "./application.schema";

const applicationRouter = Router();

applicationRouter.post(
  "/",
  validateRequest(createApplicationSchema),
  submitApplicationController
);
applicationRouter.get("/", getAllApplicationsController);
applicationRouter.get("/:id", getApplicationByIdController);
applicationRouter.get("/job/:jobId", getApplicationsByJobIdController);

export default applicationRouter;
