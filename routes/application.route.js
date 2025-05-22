import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controller/application.controller.js"

const router = express.Router()
router.route("/apply/:id").post(isAuthenticated, applyJob)
router.route("/allApplication").get(isAuthenticated, getAppliedJobs)
router.route("/getApplicant/:id").get(isAuthenticated, getApplicants)
router.route("/status/:id").put(isAuthenticated, updateStatus)


export default router