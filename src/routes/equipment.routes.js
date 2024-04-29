let router = require("express").Router();
const EquipmentController = require("../controllers/equipment.controller");
const auth = require("../middleware/auth.middleware");

router.get("/all", auth, EquipmentController.all);
router.get("/get-by/:id", auth, EquipmentController.getById);
router.post("/create", auth, EquipmentController.create);
router.put("/update/:id", auth, EquipmentController.update);
router.delete("/remove/:id", auth, EquipmentController.remove);
router.get("/key-value", auth, EquipmentController.getKeyValue);
router.get(
  "/export-excel",
  auth,
  EquipmentController.exportAllEquipmentsToExcel
);

module.exports = router;
