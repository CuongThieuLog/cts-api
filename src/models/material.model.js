const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema(
  {
    material_name: {
      type: String,
      required: true,
    },
    unit_price: {
      type: Number,
      required: true,
    },
    quantity_availiable: {
      type: Number,
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

const Material = mongoose.model("Material", MaterialSchema);

module.exports = Material;
