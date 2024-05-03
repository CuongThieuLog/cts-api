let router = require("express").Router();
let UserController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");

router.post("/register", UserController.register);
router.get("/me", auth, UserController.find);
router.get("/all", auth, UserController.getAll);
router.get("/all-no-page", auth, UserController.getAllNoPage);
router.get("/get-by/:id", auth, UserController.getById);

module.exports = router;
