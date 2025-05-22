import { Application } from "../model/application.model.js";
import { Job } from "../model/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userID = req.id;
    const jobID = req.params.id;

    if (!jobID) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    //check user already applied or not
    const existingApplication = await Application.findOne({
      job: jobID,
      applicant: userID,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You already applied this job.",
        success: false,
      });
    }
    // check if job exist
    const job = await Job.findById(jobID);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    const newApplication = await Application.create({
      job: jobID,
      applicant: userID,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// user applied jobs
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({ applicant: userId })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 }, populate: { path: "company" } },
      })
      .sort({ createdAt: -1 });
    if (applications.length === 0) {
      return res.status(404).json({
        message: "You have no applied job",
        success: false,
      });
    }

    return res.status(200).json({
      jobs: applications,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant" },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
        success: true,
      });
    }
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status update successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
