import mongoose from "mongoose";
import Attendance from "../models/Attendance.models.js";

export const markAttendance = async (req, res) => {
  try {
    const { subject, department, semester, students } = req.body;

    if (!subject || !department || !semester || !students) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    // today date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // prevent duplicate
    const alreadyMarked = await Attendance.findOne({
      subject,
      department,
      semester,
      date: today
    });

    if (alreadyMarked) {
      return res.status(400).json({
        message: "Attendance already marked today"
      });
    }

    // ✅ VERY IMPORTANT TRANSFORMATION
    const formattedStudents = students.map(s => ({
      student: s.studentId || s.student || s._id,
      status: s.status
    }));

    const attendance = await Attendance.create({
      faculty: req.user.id,
      subject,
      department,
      semester,
      date: today,
      students: formattedStudents
    });

    res.status(201).json({
      success: true,
      attendance
    });

  } catch (error) {
    console.log("ATTENDANCE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



export const getAttendanceReport = async (req, res) => {
  try {

    const { department, semester, subjectId } = req.query;
    const facultyId = req.user.id;

    const report = await Attendance.aggregate([

      {
        $match: {
          department: department,
          semester: Number(semester),
          subject: new mongoose.Types.ObjectId(subjectId),
          faculty: new mongoose.Types.ObjectId(facultyId)
        }
      },

      { $unwind: "$students" },

      {
        $group: {
          _id: "$students.student",
          totalClass: { $sum: 1 },
          presentClass: {
            $sum: {
              $cond: [
                { $eq: ["$students.status", "Present"] },
                1,
                0
              ]
            }
          }
        }
      },

      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      },

      { $unwind: "$student" },

      {
        $project: {
          regNumber: "$student.regNumber",
          name: "$student.name",
          totalClass: 1,
          presentClass: 1,
          absentClass: {
            $subtract: ["$totalClass", "$presentClass"]
          },
          percentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$presentClass", "$totalClass"] },
                  100
                ]
              },
              2
            ]
          }
        }
      }

    ]);

    console.log("REPORT:", report);

    res.json(report);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};