import express from "express";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controller/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();
router.route("/post").post(isAuthenticated, postJob);
router.route("/allJobs").get(getAllJobs);
router.route("/myPostedJobs").get(isAuthenticated, getAdminJobs);
router.route("/:id").get(getJobById);
export default router