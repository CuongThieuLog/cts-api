const mongoose = require("mongoose");

const ApprovalRequestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0: Pending, 1: Approved
      default: 0,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ApprovalRequest = mongoose.model(
  "ApprovalRequest",
  ApprovalRequestSchema
);

module.exports = ApprovalRequest;
