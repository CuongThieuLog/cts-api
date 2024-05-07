const mongoose = require("mongoose");

const ApprovalRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
      enum: [0, 1],
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
