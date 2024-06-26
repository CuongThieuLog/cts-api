const mongoose = require("mongoose");

const EquipmentSchema = new mongoose.Schema(
  {
    equipment_name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: Number,
      // enum: ["Pending", "Approved", "Rejected"],
      enum: [0, 1, 2],
      default: 0,
    },
  },
  { timestamps: true }
);

const Equipment = mongoose.model("Equipment", EquipmentSchema);

module.exports = Equipment;
