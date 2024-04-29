const Cost = require("../models/cost.model");
const BaseController = require("./base.controller");

function CostController() {
  const baseController = BaseController;

  this.all = async (req, res) => {
    try {
      const { page, limit } = req.query;
      let query = baseController.appendFilters({}, {});
      const { results, pagination } = await baseController.pagination(
        Cost,
        query,
        page,
        limit
      );

      res.json({ data: results, pagination: pagination });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch costs data" });
    }
  };

  this.getById = async (req, res) => {
    const { id } = req.params;
    try {
      const cost = await Cost.findById(id);

      if (!cost) {
        res.status(404).json({ error: "Not found!" });
      }

      res.status(200).json({ data: cost });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cost data by id" });
    }
  };

  this.create = async (req, res) => {
    const { project_id, labor_id, material_id, cost_date, cost_amount } =
      req.body;
    try {
      await Cost.create({
        project_id,
        labor_id,
        material_id,
        cost_date,
        cost_amount,
      });
      res.status(201).json({ message: "Created cost successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to cost plan" });
    }
  };

  this.update = async (req, res) => {
    const { id } = req.params;
    const { project_id, labor_id, material_id, cost_date, cost_amount } =
      req.body;
    try {
      await Cost.findByIdAndUpdate(
        id,
        {
          project_id,
          labor_id,
          material_id,
          cost_date,
          cost_amount,
        },
        { new: true }
      );
      res.status(200).json({ message: "Updated cost successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to updated cost" });
    }
  };

  this.remove = async (req, res) => {
    const { id } = req.params;
    try {
      const removedCost = await Plan.findByIdAndDelete(id);
      if (!removedCost) {
        return res.status(404).json({ error: "Cost not found" });
      }
      res.status(200).json({ message: "Cost deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to remove cost" });
    }
  };

  this.getKeyValue = async (req, res) => {};

  this.exportAllCostsToExcel = async (req, res) => {};

  return this;
}

module.exports = CostController();
