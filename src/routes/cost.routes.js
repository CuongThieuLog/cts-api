let router = require("express").Router();
const CostController = require("../controllers/cost.controller");
const auth = require("../middleware/auth.middleware");

router.get("/all", auth, CostController.all);
router.get("/get-by/:id", auth, CostController.getById);
router.post("/create", auth, CostController.create);
router.put("/update/:id", auth, CostController.update);
router.delete("/remove/:id", auth, CostController.remove);
router.get("/key-value", auth, CostController.getKeyValue);

module.exports = router;
