const Material = require("../models/material.model");
const BaseController = require("./base.controller");
const excel = require("exceljs");

function MaterialController() {
  const baseController = BaseController;

  this.all = async (req, res) => {
    try {
      const { page, limit, material_name } = req.query;
      let query = baseController.appendFilters({}, { material_name });
      let eloquent = (queryBuilder) => {
        return queryBuilder.populate({
          path: "project_id",
        });
      };

      const { results, pagination } = await baseController.pagination(
        Material,
        query,
        eloquent,
        page,
        limit
      );

      res.json({ data: results, pagination: pagination });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch materials data" });
    }
  };

  this.getById = async (req, res) => {
    const { id } = req.params;
    try {
      const material = await Material.findById(id);

      if (!material) {
        res.status(404).json({ error: "Not found!" });
      }

      res.status(200).json({ data: material });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch material data by id" });
    }
  };

  this.create = async (req, res) => {
    const { material_name, unit_price, quantity_availiable, project_id } =
      req.body;
    try {
      await Material.create({
        material_name,
        unit_price,
        quantity_availiable,
        project_id,
      });
      res.status(201).json({ message: "Created material successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to material plan" });
    }
  };

  this.update = async (req, res) => {
    const { id } = req.params;
    const { material_name, unit_price, quantity_availiable, project_id } =
      req.body;
    try {
      await Material.findByIdAndUpdate(
        id,
        {
          material_name,
          unit_price,
          quantity_availiable,
          project_id,
        },
        { new: true }
      );
      res.status(200).json({ message: "Updated material successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to updated material" });
    }
  };

  this.remove = async (req, res) => {
    const { id } = req.params;
    try {
      const removedMaterial = await Material.findByIdAndDelete(id);
      if (!removedMaterial) {
        return res.status(404).json({ error: "Material not found" });
      }
      res.status(200).json({ message: "Material deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to remove material" });
    }
  };

  this.getKeyValue = async (req, res) => {
    try {
      const materials = await Material.find();

      const keyValueMaterials = materials.map((material) => ({
        label: material.material_name,
        value: material._id,
      }));

      res.json(keyValueMaterials);
    } catch (error) {
      res.status(500).json({ error: "Failed to materials key value" });
    }
  };

  this.exportAllPlansToExcel = async (req, res) => {};

  this.getMaterialByIdProject = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      let { page, limit, material_name } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const skip = (page - 1) * limit;

      const filter = { project_id: projectId };
      if (material_name) {
        filter.material_name = { $regex: new RegExp(material_name, "i") };
      }

      const totalCount = await Material.countDocuments(filter);

      const materials = await Material.find(filter)
        .populate("project_id")
        .skip(skip)
        .limit(limit);

      if (!materials) {
        return res.status(404).json({
          message: "No materials found for the provided project ID or filter.",
        });
      }

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return res.status(200).json({
        data: materials,
        pagination: {
          total: totalCount,
          totalPages: totalPages,
          currentPage: page,
          hasNextPage: hasNextPage,
          hasPreviousPage: hasPreviousPage,
        },
      });
    } catch (error) {
      console.error("Error retrieving materials by project ID:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  return this;
}

module.exports = MaterialController();
