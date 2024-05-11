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

  return this;
}

module.exports = AttendanceController();
