const ApprovalRequest = require("../models/approvalRequest.model");

function ApprovalRequestController() {
  this.all = async (req, res) => {
    try {
      const approvalRequests = await ApprovalRequest.find()
        .populate("user_id")
        .exec();
      res.status(200).json(approvalRequests);
    } catch (error) {
      console.error("Error fetching approval requests:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  this.create = async (req, res) => {
    try {
      const { type, itemId, note } = req.body;

      if (type !== "material" && type !== "equipment") {
        return res.status(400).json({ message: "Invalid type" });
      }

      let item;
      if (type === "material") {
        item = await Material.findById(itemId);
      } else {
        item = await Equipment.findById(itemId);
      }

      if (!item) {
        return res
          .status(404)
          .json({ message: `${type.capitalize()} not found` });
      }

      const userId = req.user._id;

      const approvalRequest = new ApprovalRequest({
        user_id: userId,
        type,
        itemId,
        note,
      });
      await approvalRequest.save();

      return res
        .status(200)
        .json({ message: "Approval request sent successfully" });
    } catch (error) {
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

      res.status(200).json({
        message: "Approval request status updated",
        data: updatedRequest,
      });
    } catch (error) {
      console.error("Error updating approval request status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  return this;
}

module.exports = new ApprovalRequestController();
