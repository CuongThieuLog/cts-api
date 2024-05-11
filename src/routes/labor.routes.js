let router = require("express").Router();
const LaborController = require("../controllers/labor.controller");
const auth = require("../middleware/auth.middleware");

router.post("/create", auth, LaborController.create);
router.put("/update/:id", auth, LaborController.update);
router.get(
  "/attendance/timesheet/:month/:year",
  auth,
  LaborController.getAttendanceByMonthAndYear
);
router.get(
  "/attendance/timesheet/:userId/:month/:year",
  auth,
  LaborController.getAttendanceByMonthAndYearByUser
);
router.get(
  "/attendance/total-salary-month/:userId/:month/:year",
  auth,
  LaborController.calculateMonthlySalary
);

module.exports = router;
