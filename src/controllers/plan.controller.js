const Plan = require("../models/plan.model");
const BaseController = require("./base.controller");
const excel = require("exceljs");

function PlanController() {
  const baseController = BaseController;

  this.all = async (req, res) => {
    try {
      const { page, limit, plan_name } = req.query;
      let query = baseController.appendFilters({}, { plan_name });
      const { results, pagination } = await baseController.pagination(
        Plan,
        query,
        page,
        limit
      );

      res.json({ data: results, pagination: pagination });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plans data" });
    }
  };

  this.getById = async (req, res) => {
    const { id } = req.params;
    try {
      const plan = await Plan.findById(id)
        .populate({
          path: "created_by",
          select: "email role",
          populate: {
            path: "labor_id",
            populate: {
              path: "information_id",
            },
          },
        })
        .populate({
          path: "project_id",
        });
      if (!plan) {
        res.status(404).json({ error: "Not found!" });
      }

      res.status(200).json({ data: plan });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plan data by id" });
    }
  };

  this.create = async (req, res) => {
    const {
      plan_name,
      start_date,
      deadline,
      created_by,
      evaluation,
      project_id,
    } = req.body;
    try {
      await Plan.create({
        plan_name,
        start_date,
        deadline,
        created_by,
        evaluation,
        project_id,
      });
      res.status(201).json({ message: "Created plan successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create plan" });
    }
  };

  this.update = async (req, res) => {
    const { id } = req.params;
    const {
      plan_name,
      start_date,
      deadline,
      created_by,
      evaluation,
      project_id,
    } = req.body;
    try {
      await Plan.findByIdAndUpdate(
        id,
        {
          plan_name,
          start_date,
          deadline,
          created_by,
          evaluation,
          project_id,
        },
        { new: true }
      );
      res.status(200).json({ message: "Updated plan successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to updated plan" });
    }
  };

  this.remove = async (req, res) => {
    const { id } = req.params;
    try {
      await Plan.findByIdAndRemove(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to removed plan" });
    }
  };

  this.getKeyValue = async (req, res) => {
    try {
      const plans = await Plan.find();

      const keyValuePlans = plans.map((plan) => ({
        label: plan.plan_name,
        value: plan._id,
      }));

      res.json(keyValuePlans);
    } catch (error) {
      res.status(500).json({ error: "Failed to plans key value" });
    }
  };

  this.exportAllPlansToExcel = async (req, res) => {};

  return this;
}

module.exports = PlanController();
