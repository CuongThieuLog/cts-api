const Project = require("../models/project.model");
const BaseController = require("./base.controller");
const excel = require("exceljs");

function ProjectController() {
  const baseController = BaseController;

  this.all = async (req, res) => {
    try {
      const { page, limit, project_name } = req.query;
      let query = baseController.appendFilters({}, { project_name });
      const { results, pagination } = await baseController.pagination(
        Project,
        query,
        page,
        limit
      );

      res.json({ data: results, pagination: pagination });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project data" });
    }
  };

  this.getById = async (req, res) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate({
        path: "project_manager",
        select: "email role",
        populate: {
          path: "labor_id",
          populate: {
            path: "information_id",
          },
        },
      });
      if (!project) {
        res.status(404).json({ error: "Not found!" });
      }

      res.status(200).json({ data: project });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project data by id" });
    }
  };

  this.create = async (req, res) => {
    const {
      project_code,
      project_name,
      start_date,
      end_date,
      project_manager,
      budget,
      status,
    } = req.body;
    try {
      await Project.create({
        project_code,
        project_name,
        start_date,
        end_date,
        project_manager,
        budget,
        status,
      });
      res.status(201).json({ message: "Created project successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create project" });
    }
  };

  this.update = async (req, res) => {
    const { id } = req.params;
    const {
      project_code,
      project_name,
      start_date,
      end_date,
      project_manager,
      budget,
      status,
    } = req.body;
    try {
      await Project.findByIdAndUpdate(
        id,
        {
          project_code,
          project_name,
          start_date,
          end_date,
          project_manager,
          budget,
          status,
        },
        { new: true }
      );
      res.status(200).json({ message: "Updated project successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to updated project" });
    }
  };

  this.remove = async (req, res) => {
    const { id } = req.params;
    try {
      const removedProject = await Project.findByIdAndDelete(id);
      if (!removedProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to remove project" });
    }
  };

  this.getKeyValue = async (req, res) => {
    try {
      const projects = await Project.find();

      const keyValueProject = projects.map((project) => ({
        label: project.project_name,
        value: project._id,
      }));

      res.json(keyValueProject);
    } catch (error) {
      res.status(500).json({ error: "Failed to projects key value" });
    }
  };

  this.exportAllProjectsToExcel = async (req, res) => {
    try {
      const projects = await Project.find();

      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet("Projects");

      worksheet.columns = [
        { header: "ID", key: "_id", width: 15 },
        { header: "Project Code", key: "project_code", width: 15 },
        { header: "Project Name", key: "project_name", width: 30 },
        { header: "Start Date", key: "start_date", width: 15 },
        { header: "End Date", key: "end_date", width: 15 },
        { header: "Project Manager", key: "project_manager", width: 30 },
        { header: "Budget", key: "budget", width: 15 },
        { header: "Status", key: "status", width: 15 },
      ];

      projects.forEach((project) => {
        worksheet.addRow({
          _id: project._id,
          project_code: project.project_code,
          project_name: project.project_name,
          start_date: project.start_date,
          end_date: project.end_date,
          project_manager: project.project_manager,
          budget: project.budget,
          status: project.status,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=projects.xlsx"
      );

      await workbook.xlsx.write(res);

      res.end();
    } catch (error) {
      res.status(500).json({ error: "Failed to export projects to Excel" });
    }
  };

  this.addLaborsToProject = async (req, res) => {
    const { id } = req.params;
    const { laborIds } = req.body;

    try {
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const newLaborIds = laborIds.filter(
        (laborId) => !project.labors.includes(laborId)
      );

      if (newLaborIds.length === 0) {
        return res
          .status(400)
          .json({ error: "All laborIds are already added to the project" });
      }

      project.labors.push(...newLaborIds);

      await project.save();

      res.status(200).json({ project });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Failed to update or create labor in project" });
    }
  };

  return this;
}

module.exports = ProjectController();
