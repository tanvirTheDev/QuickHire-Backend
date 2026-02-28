import { Router } from "express";
import applicationRouter from "../modules/application/application.route";
import jobRouter from "../modules/job/job.route";

const router = Router();

router.use("/jobs", jobRouter);
router.use("/applications", applicationRouter);

export default router;
