const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    project_code: {
      type: String,
      required: true,
      unique: true,
    },
    project_name: {
      type: String,
      required: true,
      index: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
    },
    project_manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    budget: {
      type: Number,
    },
    status: {
      type: Number,
      // enum: ["In Progress", "Completed", "Cancelled"],
      enum: [0, 1, 2],
      default: 0,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
