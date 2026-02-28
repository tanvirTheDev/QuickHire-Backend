import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  createJobController,
  deleteJobController,
  getAllJobsController,
  getJobByIdController,
  updateJobController,
} from "./job.controller";
import { createJobSchema, updateJobSchema } from "./job.schema";

const jobRouter = Router();

jobRouter.get("/", getAllJobsController);
jobRouter.get("/:id", getJobByIdController);
jobRouter.post("/", validateRequest(createJobSchema), createJobController);
jobRouter.patch("/:id", validateRequest(updateJobSchema), updateJobController);
jobRouter.delete("/:id", deleteJobController);

export default jobRouter;
