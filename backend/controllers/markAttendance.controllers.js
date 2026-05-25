
import mongoose from "mongoose";

import Attendance from "../models/Attendance.models.js";
import Student from "../models/Student.models.js";
import Subject from "../models/subject.models.js";

import { getAttendanceHtml }

from "../utils/utils.js";



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


export const markAttendance = async (req, res) => {

  try {

    const {

      subject,
      department,
      semester,
      students,

    } = req.body;

    // ================= VALIDATION =================

    if (

      !subject ||
      !department ||
      !semester ||
      !students

    ) {

      return res.status(400).json({

        message: "All fields required",

      });

    }

    // ================= TODAY DATE =================

     const now = new Date();

const today = `${now.getFullYear()}-${
  String(now.getMonth() + 1)
    .padStart(2, "0")
}-${
  String(now.getDate())
    .padStart(2, "0")
}`;
    // EMAIL DATE
const emailDate = today;
   
    // ================= SUBJECT =================

    const subjectData =
      await Subject.findById(subject);

    const subjectName =
      subjectData?.subjectName || "Subject";

    // ================= FORMAT STUDENTS =================

    const formattedStudents =
      students.map((s) => ({

        student:

          s.studentId ||

          s.student ||

          s._id,

        regNumber:
          s.regNumber,

        name:
          s.name,

        status:
          s.status,

      }));

    // ================= DUPLICATE CHECK =================

    const alreadyMarked =
      await Attendance.findOne({

        subject,

        department,

        semester,

        date: today,

      });

    // ================= UPDATE ATTENDANCE =================

    if (alreadyMarked) {

      alreadyMarked.students =
        formattedStudents;

      await alreadyMarked.save();

      // ================= SEND EMAIL =================

      for (const s of students) {

        const studentData =
          await Student.findById(

            s.studentId ||

            s.student ||

            s._id

          );

        if (studentData?.email) {

         await sendEmail(
  studentData.email,

  "Attendance Status",

  `Your attendance status is ${s.status}`,

  getAttendanceHtml(
    studentData.name,
    studentData.regNumber,
    subjectName,
    s.status,
    emailDate
  )
);

        }

      }

      return res.status(200).json({

        success: true,

        message:
          "Attendance updated successfully",

        attendance:
          alreadyMarked,

      });

    }

    // ================= STUDENT IDS =================

    const studentIds =
      students.map(

        (s) =>

          s.studentId ||

          s.student ||

          s._id

      );

    // ================= VALIDATE STUDENTS =================

    const validStudents =
      await Student.find({

        _id: {
          $in: studentIds,
        },

        semester:
          Number(semester),

        department:
          department,

      });

    if (

      validStudents.length !==
      studentIds.length

    ) {

      return res.status(400).json({

        message:
          "Some students do not belong to selected semester or department",

      });

    }

    // ================= CREATE ATTENDANCE =================

    const attendance =
      await Attendance.create({

        markedBy:
          req.user.id,

        markedByRole:

          req.user.role ===
          "FACULTY"

            ? "Faculty"

            : "Hod",

        subject,

        department,

        semester,

        date: today,

        students:
          formattedStudents,

      });

    // ================= SEND EMAIL =================

    for (const s of students) {

      const studentData =
        await Student.findById(

          s.studentId ||

          s.student ||

          s._id

        );

      if (studentData?.email) {

        await sendAttendanceEmail(

          studentData.email,

          studentData.name,

          studentData.regNumber,

          subjectName,

          s.status,

          emailDate

        );

      }

    }

    // ================= RESPONSE =================

    res.status(201).json({

      success: true,

      message:
        "Attendance marked successfully",

      attendance,

    });

  } catch (error) {

    console.log(

      "ATTENDANCE ERROR:",
      error

    );

    res.status(500).json({

      message:
        error.message,

    });

  }

};