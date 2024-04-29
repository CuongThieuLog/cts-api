const express = require("express");

const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");
const laborRoute = require("./labor.routes");
const projectRoute = require("./project.routes");
const planRoute = require("./plan.routes");
const materialRoute = require("./material.routes");
const costRoute = require("./cost.routes");
const reportRoute = require("./report.routes");

const router = express.Router();

router.use("/user", userRoute);
router.use("/auth", authRoute);
router.use("/labor", laborRoute);
router.use("/project", projectRoute);
router.use("/plan", planRoute);
router.use("/material", materialRoute);
router.use("/cost", costRoute);
router.use("/report", reportRoute);

module.exports = router;
