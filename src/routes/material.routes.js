let router = require("express").Router();
const MaterialController = require("../controllers/material.controller");
const auth = require("../middleware/auth.middleware");

router.get("/all", auth, MaterialController.all);
router.get("/get-by/:id", auth, MaterialController.getById);
router.post("/create", auth, MaterialController.create);
router.put("/update/:id", auth, MaterialController.update);
router.delete("/remove/:id", auth, MaterialController.remove);
router.get("/key-value", auth, MaterialController.getKeyValue);

module.exports = router;
