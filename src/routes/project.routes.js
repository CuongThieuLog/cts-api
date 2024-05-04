let router = require("express").Router();
const ProjectController = require("../controllers/project.controller");
const auth = require("../middleware/auth.middleware");

router.get("/all", auth, ProjectController.all);
router.get("/get-by/:id", auth, ProjectController.getById);
router.post("/create", auth, ProjectController.create);
router.put("/update/:id", auth, ProjectController.update);
router.delete("/remove/:id", auth, ProjectController.remove);
router.get("/key-value", auth, ProjectController.getKeyValue);
router.get("/export-excel", auth, ProjectController.exportAllProjectsToExcel);
router.put("/add-labors/:id", auth, ProjectController.addLaborsToProject);

module.exports = router;
