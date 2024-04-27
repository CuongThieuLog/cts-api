let router = require("express").Router();
const PlanController = require("../controllers/plan.controller");
const auth = require("../middleware/auth.middleware");

router.get("/all", auth, PlanController.all);
router.get("/get-by/:id", auth, PlanController.getById);
router.post("/create", auth, PlanController.create);
router.put("/update/:id", auth, PlanController.update);
router.delete("/remove/:id", auth, PlanController.remove);
router.get("/key-value", auth, PlanController.getKeyValue);
router.get("/export-excel", auth, PlanController.exportAllProjectsToExcel);

module.exports = router;
