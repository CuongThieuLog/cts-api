const Attendance = require("../models/attendance.model");

function AttendanceController() {
  this.checkIn = async (req, res) => {
    try {
      const userId = req.user._id;

      const todayAttendance = await Attendance.findOne({
        user_id: userId,
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59)),
        },
      });
      if (todayAttendance) {
        return res
          .status(400)
          .json({ error: "You have already checked in today" });
      }
      const attendance = new Attendance({
        user_id: userId,
        checkIn: new Date(),
      });
      await attendance.save();
      res.status(200).json({ message: "Check-in successful" });
    } catch (error) {
      console.error("Error during check-in:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  this.checkOut = async (req, res) => {
    try {
      const userId = req.user._id;

      const latestAttendance = await Attendance.findOne({
        user_id: userId,
      }).sort({ createdAt: -1 });
      if (!latestAttendance) {
        return res.status(400).json({ error: "You have not checked in yet" });
      }
      if (latestAttendance.checkOut) {
        return res.status(400).json({ error: "You have already checked out" });
      }
      const now = new Date();
      if (now <= latestAttendance.checkIn) {
        return res
          .status(400)
          .json({ error: "Check-out time must be after check-in time" });
      }
      latestAttendance.checkOut = now;
      await latestAttendance.save();
      res.status(200).json({ message: "Check-out successful" });
    } catch (error) {
      console.error("Error during check-out:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  this.getAttendanceToday = async (req, res) => {
    try {
      const userId = req.user._id;
      const todayAttendance = await Attendance.findOne({
        user_id: userId,
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59)),
        },
      });

      if (!todayAttendance) {
        return res.status(200).json({});
      }

      res.status(200).json({
        checkIn: todayAttendance.checkIn,
        checkOut: todayAttendance.checkOut,
      });
    } catch (error) {
      console.error("Error while getting today's attendance:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  this.calculateMonthlySalary = async (req, res) => {
    const { userId, month, year } = req.params;
    const attendances = await Attendance.find({
      user_id: userId,
      checkIn: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });

    const laborInfo = await Labor.findOne({ information_id: userId });

    if (!laborInfo) {
      throw new Error("Labor information not found for the user");
    }

    let totalHours = 0;
    attendances.forEach((attendance) => {
      if (attendance.checkIn && attendance.checkOut) {
        const hoursWorked =
          (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
        totalHours += hoursWorked;
      }
    });

    const totalSalary = totalHours * laborInfo.rate_per_hour;

    return totalSalary;
  };

  this.getAllSheetByMonthYear = async (req, res) => {
    try {
      const userId = req.user._id;
      const { month, year } = req.params;
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      const allCheckInOut = await Attendance.find({
        user_id: userId,
        checkIn: { $gte: startDate, $lte: endDate },
      });
      if (allCheckInOut.length === 0) {
        return res.status(404).json({
          error:
            "No check-in/out data available for the current user and month",
        });
      }
      const checkInOutData = allCheckInOut.map((attendance) => ({
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
      }));
      res.status(200).json(checkInOutData);
    } catch (error) {
      console.error("Error fetching check-in/out data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  return this;
}

module.exports = AttendanceController();
