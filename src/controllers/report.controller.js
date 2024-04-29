const Report = require("../models/report.model");
const BaseController = require("./base.controller");
const excel = require("exceljs");

function ReportController() {
  const baseController = BaseController;

  this.all = async (req, res) => {
    try {
      const { page, limit } = req.query;
      let query = baseController.appendFilters({}, {});
      const { results, pagination } = await baseController.pagination(
        Report,
        query,
        page,
        limit
      );

      res.json({ data: results, pagination: pagination });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports data" });
    }
  };

  this.getById = async (req, res) => {
    const { id } = req.params;
    try {
      const report = await Report.findById(id);

      if (!report) {
        res.status(404).json({ error: "Not found!" });
      }

      res.status(200).json({ data: report });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch report data by id" });
    }
  };

  this.create = async (req, res) => {
    const { project_id, report_date, progress, actual_cost } = req.body;
    try {
      await Report.create({
        project_id,
        report_date,
        progress,
        actual_cost,
      });
      res.status(201).json({ message: "Created report successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to created report" });
    }
  };

  this.update = async (req, res) => {
    const { id } = req.params;
    const { project_id, report_date, progress, actual_cost } = req.body;
    try {
      await Report.findByIdAndUpdate(
        id,
        {
          project_id,
          report_date,
          progress,
          actual_cost,
        },
        { new: true }
      );
      res.status(200).json({ message: "Updated report successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to updated report" });
    }
  };

  this.remove = async (req, res) => {
    const { id } = req.params;
    try {
      const removedReport = await Material.findByIdAndDelete(id);
      if (!removedReport) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to remove report" });
    }
  };

  this.getKeyValue = async (req, res) => {};

  this.exportAllReportsToExcel = async (req, res) => {};

  return this;
}

module.exports = ReportController();
