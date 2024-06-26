const mongoose = require("mongoose");

const ApprovalRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    type: {
      //type: material and equipment
      type: String,
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ApprovalRequest = mongoose.model(
  "ApprovalRequest",
  ApprovalRequestSchema
);

module.exports = ApprovalRequest;
