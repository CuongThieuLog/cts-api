const mongoose = require("mongoose");

const LaborSchema = new mongoose.Schema(
  {
    position: {
      type: String,
    },
    rate_per_hour: {
      type: Number,
    },
    information_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Information",
      default: null,
    },
  },
  { timestamps: true }
);

const Labor = mongoose.model("Labor", LaborSchema);

module.exports = Labor;
