let router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

router.post("/login", AuthController.login);
router.post("/logout", auth, AuthController.logout);
router.post("/logout-all", auth, AuthController.logoutAll);

module.exports = router;
