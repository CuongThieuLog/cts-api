const express = require("express");

const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");
const laborRoute = require("./labor.routes");

const router = express.Router();

router.use("/user", userRoute);
router.use("/auth", authRoute);
router.use("/labor", laborRoute);

module.exports = router;
