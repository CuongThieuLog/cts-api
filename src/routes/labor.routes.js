let router = require("express").Router();
const LaborController = require("../controllers/labor.controller");
const auth = require("../middleware/auth.middleware");

router.post("/create", auth, LaborController.create);
router.put("/update/:id", auth, LaborController.update);

module.exports = router;
