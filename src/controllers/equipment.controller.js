const Equipment = require("../models/equipment.model");
const BaseController = require("./base.controller");
const excel = require("exceljs");

function EquipmentController() {
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
        Equipment,
        query,
        eloquent,
        page,
        limit
      );

      res.json({ data: results, pagination: pagination });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equipments data" });
    }
  };

  this.getById = async (req, res) => {
    const { id } = req.params;
    try {
      const plan = await Equipment.findById(id).populate({
        path: "project_id",
      });
      if (!plan) {
        res.status(404).json({ error: "Not found!" });
      }

      res.status(200).json({ data: plan });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equipment data by id" });
    }
  };

  this.create = async (req, res) => {
    const { equipment_name, quantity, description, project_id } = req.body;
    try {
      await Equipment.create({
        equipment_name,
        quantity,
        description,
        project_id,
      });
      res.status(201).json({ message: "Created equipment successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create equipment" });
    }
  };

  this.update = async (req, res) => {
    const { id } = req.params;
    const { equipment_name, quantity, description, project_id } = req.body;
    try {
      await Equipment.findByIdAndUpdate(
        id,
        {
          equipment_name,
          quantity,
          description,
          project_id,
        },
        { new: true }
      );
      res.status(200).json({ message: "Updated equipment successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to updated equipment" });
    }
  };

  this.remove = async (req, res) => {
    const { id } = req.params;
    try {
      const removedEquipment = await Equipment.findByIdAndDelete(id);
      if (!removedEquipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }
      res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to deleted equipment" });
    }
  };

  this.getKeyValue = async (req, res) => {
    try {
      const equipments = await Equipment.find();

      const keyValueEquipments = equipments.map((equipment) => ({
        label: equipment.equipment_name,
        value: equipment._id,
      }));

      res.json(keyValueEquipments);
    } catch (error) {
      res.status(500).json({ error: "Failed to equipments key value" });
    }
  };

  this.exportAllEquipmentsToExcel = async (req, res) => {
    try {
      const equipments = await Equipment.find();

      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet("Equipments");

      worksheet.columns = [
        { header: "ID", key: "_id", width: 30 },
        { header: "Equipment Name", key: "equipment_name", width: 30 },
        { header: "Quantity", key: "quantity", width: 15 },
        { header: "Description", key: "description", width: 15 },
        { header: "Project id", key: "project_id", width: 30 },
      ];

      equipments.forEach((equipment) => {
        worksheet.addRow({
          _id: equipment._id,
          equipment_name: equipment.equipment_name,
          quantity: equipment.quantity,
          description: equipment.description,
          project_id: equipment.project_id,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=equipments.xlsx"
      );

      await workbook.xlsx.write(res);

      res.end();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to export equipments to Excel" });
    }
  };

  this.getEquipmentByIdProject = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      let { page, limit, equipment_name } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const skip = (page - 1) * limit;

      const filter = { project_id: projectId };
      if (equipment_name) {
        filter.equipment_name = { $regex: new RegExp(equipment_name, "i") };
      }

      const totalCount = await Equipment.countDocuments(filter);

      const equipments = await Equipment.find(filter)
        .populate("project_id")
        .skip(skip)
        .limit(limit);

      if (!equipments) {
        return res.status(404).json({
          message: "No equipments found for the provided project ID or filter.",
        });
      }

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return res.status(200).json({
        data: equipments,
        pagination: {
          total: totalCount,
          totalPages: totalPages,
          currentPage: page,
          hasNextPage: hasNextPage,
          hasPreviousPage: hasPreviousPage,
        },
      });
    } catch (error) {
      console.error("Error retrieving equipments by project ID:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  return this;
}

module.exports = EquipmentController();
