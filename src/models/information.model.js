const mongoose = require("mongoose");

const InformationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: Number,
      enum: [0, 1, 2],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Information = mongoose.model("Information", InformationSchema);

module.exports = Information;
