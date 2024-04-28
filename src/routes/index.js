const express = require("express");

const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");
const laborRoute = require("./labor.routes");
const projectRoute = require("./project.routes");
const planRoute = require("./plan.routes");
const materialRoute = require("./material.routes");

const router = express.Router();

router.use("/user", userRoute);
router.use("/auth", authRoute);
router.use("/labor", laborRoute);
router.use("/project", projectRoute);
router.use("/plan", planRoute);
router.use("/material", materialRoute);

module.exports = router;
