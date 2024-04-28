const Material = require("../models/material.model");
const BaseController = require("./base.controller");
const excel = require("exceljs");

function MaterialController() {
  const baseController = BaseController;

  this.all = async (req, res) => {
    try {
      const { page, limit, material_name } = req.query;
      let query = baseController.appendFilters({}, { material_name });
      const { results, pagination } = await baseController.pagination(
        Material,
        query,
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
      await Material.findByIdAndRemove(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to removed material" });
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

  return this;
}

module.exports = MaterialController();
