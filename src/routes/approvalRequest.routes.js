let router = require("express").Router();
const ApprovalRequestController = require("../controllers/approvalRequest.controller");
const auth = require("../middleware/auth.middleware");

router.get("/all", auth, ApprovalRequestController.all);
router.post("/create", auth, ApprovalRequestController.create);

module.exports = router;
