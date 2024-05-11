let router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

router.post("/login", AuthController.login);
router.post("/logout", auth, AuthController.logout);
router.post("/logout-all", auth, AuthController.logoutAll);
router.post("/change-password", auth, AuthController.changePassword);
router.post("/forgot-password", AuthController.requestPasswordReset);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
