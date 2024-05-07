// Import model
const ApprovalRequest = require("../models/approvalRequest.model");

function ApprovalRequestController() {
  this.approvalRequest = async (req, res) => {
    try {
      const { type, itemId } = req.body;

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

      const approvalRequest = new ApprovalRequest({ type, itemId });
      await approvalRequest.save();

      return res
        .status(200)
        .json({ message: "Approval request sent successfully" });
    } catch (error) {
      console.error("Error sending approval request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  return this;
}

module.exports = new ApprovalRequestController();
