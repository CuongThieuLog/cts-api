let router = require("express").Router();
const ApprovalRequestController = require("../controllers/approvalRequest.controller");
const auth = require("../middleware/auth.middleware");

router.get("/all", auth, ApprovalRequestController.all);
router.post("/create", auth, ApprovalRequestController.create);
router.get("/get-by/:id", auth, ApprovalRequestController.getById);
router.put("/update-status/:id", auth, ApprovalRequestController.updateStatus);
router.get(
  "/get-by-project/:projectId",
  auth,
  ApprovalRequestController.getByProjectId
);

module.exports = router;
