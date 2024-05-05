const Plan = require("../models/plan.model");
const BaseController = require("./base.controller");
const excel = require("exceljs");

function PlanController() {
  const baseController = BaseController;

  this.all = async (req, res) => {
    try {
      const { page, limit, plan_name } = req.query;
      let query = baseController.appendFilters({}, { plan_name });
      let eloquent = (queryBuilder) => {
        return queryBuilder.populate({
          path: "project_id",
        });
      };

      const { results, pagination } = await baseController.pagination(
        Plan,
        query,
        eloquent,
        page,
        limit
      );

      res.json({ data: results, pagination: pagination });
    } catch (error) {
      console.log(error);
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
      const removedPlan = await Plan.findByIdAndDelete(id);
      if (!removedPlan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.status(200).json({ message: "Plan deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to remove plan" });
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

  this.exportAllPlansToExcel = async (req, res) => {
    try {
      const plans = await Plan.find();

      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet("Plans");

      worksheet.columns = [
        { header: "ID", key: "_id", width: 30 },
        { header: "Plan Name", key: "plan_name", width: 30 },
        { header: "Start Date", key: "start_date", width: 15 },
        { header: "Deadline", key: "deadline", width: 15 },
        { header: "Create by", key: "created_by", width: 30 },
        { header: "Project id", key: "project_id", width: 30 },
      ];

      plans.forEach((plan) => {
        worksheet.addRow({
          _id: plan._id,
          plan_name: plan.plan_name,
          start_date: plan.start_date,
          deadline: plan.deadline,
          created_by: plan.created_by,
          project_id: plan.project_id,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=plans.xlsx");

      await workbook.xlsx.write(res);

      res.end();
    } catch (error) {
      res.status(500).json({ error: "Failed to export plans to Excel" });
    }
  };

  this.getPlanByIdProject = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      let { page, limit, plan_name } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const skip = (page - 1) * limit;

      const filter = { project_id: projectId };
      if (plan_name) {
        filter.plan_name = { $regex: new RegExp(plan_name, "i") };
      }

      const totalCount = await Plan.countDocuments(filter);

      const plans = await Plan.find(filter)
        .populate("project_id")
        .skip(skip)
        .limit(limit);

      if (!plans) {
        return res.status(404).json({
          message: "No plans found for the provided project ID or filter.",
        });
      }

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return res.status(200).json({
        data: plans,
        pagination: {
          total: totalCount,
          totalPages: totalPages,
          currentPage: page,
          hasNextPage: hasNextPage,
          hasPreviousPage: hasPreviousPage,
        },
      });
    } catch (error) {
      console.error("Error retrieving plans by project ID:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  module.exports = { getPlanByIdProject };

  return this;
}

module.exports = PlanController();
