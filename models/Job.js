const mongoose = require("mongoose");

const jobsSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "interview", "decline"],
      default: "pending",
    },
    jobId:{
      type: String,
      required: [true, "Please provide position"],
      maxLength: 100,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobsSchema);
