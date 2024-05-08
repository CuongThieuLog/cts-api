let router = require("express").Router();
const AttendanceController = require("../controllers/attendance.controller");
const auth = require("../middleware/auth.middleware");

router.post("/check-in", auth, AttendanceController.checkIn);
router.post("/check-out", auth, AttendanceController.checkOut);
router.get("/today", auth, AttendanceController.getAttendanceToday);
router.get(
  "/all-month-year",
  auth,
  AttendanceController.getAllCheckInOutByMonthAndYearForCurrentUser
);

module.exports = router;
