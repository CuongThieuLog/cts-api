const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    report_date: {
      type: Date,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    actual_cost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", ReportSchema);

module.exports = Report;
