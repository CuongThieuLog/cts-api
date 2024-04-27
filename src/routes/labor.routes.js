let router = require("express").Router();
const LaborController = require("../controllers/labor.controller");
const auth = require("../middleware/auth.middleware");

router.get("/all", auth, LaborController.getAll);
router.get("/get-by/:id", auth, LaborController.getById);
router.post("/create", auth, LaborController.create);
router.put("/update/:id", auth, LaborController.update);

module.exports = router;
