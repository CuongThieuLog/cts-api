const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {
    plan_name: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    evaluation: {
      type: Number,
      // enum: ["Completed", "In Progress", "Delayed"],
      enum: [0, 1, 2],
      default: 1,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", PlanSchema);

module.exports = Plan;
