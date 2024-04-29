let router = require("express").Router();
const ReportController = require("../controllers/report.controller");
const auth = require("../middleware/auth.middleware");

router.get("/all", auth, ReportController.all);
router.get("/get-by/:id", auth, ReportController.getById);
router.post("/create", auth, ReportController.create);
router.put("/update/:id", auth, ReportController.update);
router.delete("/remove/:id", auth, ReportController.remove);
router.get("/key-value", auth, ReportController.getKeyValue);

module.exports = router;
