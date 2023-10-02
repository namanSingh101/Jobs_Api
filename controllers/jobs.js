const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort("createdAt");
  if (!jobs) {
    throw new NotFoundError("No jobs found");
  }
  return res
    .status(StatusCodes.OK)
    .json({ response: "All jobs created", count: jobs.length, data: jobs });
};

const getJob = async (req, res) => {
  const { user, params } = req;
  if (!user || !params.id) {
    throw new NotFoundError("Please provide job id and user id ");
  }
  const job = await Job.findOne({ jobId: params.id, createdBy: user._id });
  if (!job) {
    throw new NotFoundError("No jobs found");
  }
  return res
    .status(StatusCodes.OK)
    .json({ response: "Get specific job", count: job.length, data: job });
};

const createJob = async (req, res) => {
  const { company, position, jobId } = req.body;
  if (!company || !position || !jobId) {
    throw new NotFoundError(
      "Please provide valid company or position and jobId"
    );
  }

  const jobDb = await Job.findOne({ jobId });
  if (jobDb) {
    throw new BadRequestError("Job already created");
  }
  const job = await Job.create({
    company,
    position,
    jobId,
    createdBy: req.user._id,
  });
  return res
    .status(StatusCodes.CREATED)
    .json({ response: "Job Created", data: job });
};

const updateJob = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new NotFoundError("Please provide id of job");
  }
  const updatedJob = await Job.findOneAndUpdate(
    { jobId: id },
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  return res.status(StatusCodes.OK).json({
    response: "Job Updated",
    count: updateJob.length,
    data: updatedJob,
  });
};

const deleteJob = async (req, res) => {
  const id = req.params.id;
  const {user} = req
  if (!id) {
    throw new NotFoundError("Please provide id of job");
  }
  try {
    const deletedJob = await Job.findOneAndDelete({
      jobId: id,
      createdBy: user._id,
    });
  } catch (error) {
    console.log(error);
    //throw new BadRequestError("Something went wrong")
  }
  
  return res
    .status(StatusCodes.OK)
    .send({ response: "Job deleted", data: deletedJob });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
