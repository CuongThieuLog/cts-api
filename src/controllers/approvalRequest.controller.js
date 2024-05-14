const ApprovalRequest = require("../models/approvalRequest.model");
const Equipment = require("../models/equipment.model");
const Material = require("../models/material.model");
const mongoose = require("mongoose");
const BaseController = require("./base.controller");

function ApprovalRequestController() {
  const baseController = BaseController;

  this.all = async (req, res) => {
    try {
      const { page, limit, status } = req.query;
      let query = baseController.appendFilters({}, { status });
      let eloquent = (queryBuilder) => {
        return queryBuilder.populate({
          path: "user_id",
          select: "email role labor_id",
        });
      };

      const { results, pagination } = await baseController.pagination(
        ApprovalRequest,
        query,
        eloquent,
        page,
        limit
      );

      res.json({ data: results, pagination: pagination });
    } catch (error) {
      console.error("Error fetching approval requests:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  this.create = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { type, itemId, note, quantity, project_id } = req.body;

      switch (type) {
        case "material": {
          const material = await Material.findById(itemId);
          if (!material) {
            return res.status(404).json({ message: "Material not found" });
          }
          break;
        }
        case "equipment": {
          const equipment = await Equipment.findById(itemId);
          if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
          }

          // Check if requested quantity exceeds available quantity
          if (quantity > equipment.quantity) {
            return res.status(400).json({
              message: "Requested quantity exceeds available quantity",
            });
          }

          // Update equipment quantity
          await Equipment.findByIdAndUpdate(itemId, {
            $inc: { quantity: -quantity },
          });

          break;
        }
        default:
          return res.status(400).json({ message: "Invalid type" });
      }

      const userId = req.user._id;

      const approvalRequest = new ApprovalRequest({
        user_id: userId,
        type,
        itemId,
        note,
        quantity,
        project_id,
      });
      await approvalRequest.save();

      await session.commitTransaction();
      session.endSession();

      return res
        .status(200)
        .json({ message: "Approval request sent successfully" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.error("Error sending approval request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  this.getById = async (req, res) => {
    const { id } = req.params;
    try {
      const approvalRequest = await ApprovalRequest.findById(id);

      if (!approvalRequest) {
        res.status(404).json({ error: "Not found!" });
      }

      res.status(200).json({ data: approvalRequest });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch approval request data by id" });
    }
  };

  this.update = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedRequest = await ApprovalRequest.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Approval request not found" });
      }

      res
        .status(200)
        .json({ message: "Approval request updated", data: updatedRequest });
    } catch (error) {
      console.error("Error updating approval request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  this.updateStatus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedRequest = await ApprovalRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Approval request not found" });
      }

      if (status === 2) {
        const { type, itemId, quantity } = updatedRequest;

        switch (type) {
          case "material":
            await Material.findByIdAndUpdate(itemId, {
              $inc: { quantity_availiable: quantity },
            });
            break;
          case "equipment":
            await Equipment.findByIdAndUpdate(itemId, {
              $inc: { quantity: quantity },
            });
            break;
          default:
            break;
        }
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: "Approval request status updated",
        data: updatedRequest,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.error("Error updating approval request status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  this.getById = async (req, res) => {
    const { id } = req.params;
    try {
      const approvalRequest = await ApprovalRequest.findById(id);

      if (!approvalRequest) {
        return res.status(404).json({ error: "Approval request not found" });
      }

      res.status(200).json({ data: approvalRequest });
    } catch (error) {
      console.error("Error fetching approval request by ID:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch approval request data by ID" });
    }
  };

  this.getByProjectId = async (req, res) => {
    const { projectId } = req.params;
    const { type } = req.query;

    const query = {
      project_id: projectId,
    };

    if (type === "material" || type === "equipment") {
      query.type = type; // Set the type in the query if it's either "material" or "equipment"
    }

    try {
      const approvalRequests = await ApprovalRequest.find(query);

      if (approvalRequests.length === 0) {
        res.status(202).json({ data: [] });
      } else {
        res.status(200).json({ data: approvalRequests });
      }
    } catch (error) {
      console.error("Error fetching approval requests by project ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  return this;
}

module.exports = new ApprovalRequestController();
