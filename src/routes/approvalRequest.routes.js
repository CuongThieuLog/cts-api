let router = require("express").Router();
const ApprovalRequestController = require("../controllers/approvalRequest.controller");
const auth = require("../middleware/auth.middleware");

router.get("/all", auth, ApprovalRequestController.all);
router.post("/create", auth, ApprovalRequestController.create);
router.get("/get-by/:id", auth, ApprovalRequestController.getById);
router.put("/update-status/:id", auth, ApprovalRequestController.updateStatus);

module.exports = router;
