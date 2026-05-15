import Attendance from "../models/Attendance.models.js";

export const updateAttendance =
  async (req, res) => {

    try {

      const {
        attendanceId,
      } = req.params;

      const {
        students,
      } = req.body;

      // VALIDATION
      if (!students) {

        return res.status(400).json({
          message:
            "Students data required",
        });

      }

      // FIND ATTENDANCE
      const attendance =
        await Attendance.findById(
          attendanceId
        );

      if (!attendance) {

        return res.status(404).json({
          message:
            "Attendance not found",
        });

      }

      // UPDATE STUDENTS
      attendance.students =
        students;

      // SAVE
      await attendance.save();

      res.status(200).json({

        success: true,

        message:
          "Attendance updated successfully",

        attendance,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",

      });

    }

};