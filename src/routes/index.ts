import { Router } from "express";
import jobRouter from "../modules/job/job.route";

const router = Router();

router.use("/jobs", jobRouter);

export default router;
