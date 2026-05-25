import XLSX from "xlsx";
import Student from "../models/Student.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.models.js";
import ClassAssign from "../models/classAssign.models.js";
import OtpModel from "../models/otp.model.js";
import { sendEmail } from "../services/email.service.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";

import fs from "fs";


export const createStudent = async (req,res)=>{

try{

const { name,email,department,semester,regNumber } = req.body;

const student = new Student({
name,
email,
regNumber,
department,
semester,
password: null,        
 isFirstLogin: true     
});

await student.save();

res.status(201).json({
message:"Student created successfully",
student
});

}catch(error){

res.status(500).json({
error:error.message
});

}

};


// SEND OTP
export const sendStudentOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email required",
      });
    }

    // Find student
    const student = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Generate OTP
    const otp = generateOtp();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // Remove old OTP
    await OtpModel.deleteMany({
      email: email.toLowerCase(),
      role: "STUDENT",
    });

    // Save OTP
    await OtpModel.create({
      email: email.toLowerCase(),
      role: "STUDENT",
      otpHash,
    });

    // Send Email
    await sendEmail(
      student.email,
      "Student Login OTP",
      `Your OTP is ${otp}`,
      getOtpHtml(otp)
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyStudentOTP = async (
  req,
  res
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP required",
      });
    }

    // Find student
    const student = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Find OTP
    const otpData = await OtpModel.findOne({
      email: email.toLowerCase(),
      role: "STUDENT",
    });

    if (!otpData) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(
      otp,
      otpData.otpHash
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Verify student
    student.isVerified = true;

    await student.save();

    // Delete OTP
    await OtpModel.deleteOne({
      _id: otpData._id,
    });

    // Generate JWT
    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        regNumber: student.regNumber,
        role: "STUDENT",
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: "STUDENT",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};








export const setPassword = async (req, res) => {
  try {
    const { regNumber, newPassword } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    student.password = hashedPassword;
    student.isFirstLogin = false;

    await student.save();

    res.status(200).json({
      message: "Password set successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllStudents = async (req,res)=>{

try{

const students = await Student.find();

res.status(200).json({
success:true,
count:students.length,
students
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};

export const getStudentsBySemester = async (req, res) => {
  try {
    const semester = Number(req.params.semester);

    const students = await Student.find({ semester });

    res.status(200).json(students);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const uploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    // 📌 READ FILE FROM DISK (IMPORTANT FIX)
    const workbook = XLSX.read(req.file.buffer, {
  type: "buffer",
});

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);

    const requiredFields = [
      "name",
      "regNumber",
      "email",
      "semester",
      "department",
    ];

    const fileColumns = Object.keys(data[0] || {});

    const missingFields = requiredFields.filter(
      field => !fileColumns.includes(field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing mandatory columns: ${missingFields.join(", ")}`
      });
    }

    const students = data.map(row => ({
      name: row.name,
      email: row.email,
      regNumber: row.regNumber,
      semester: row.semester,
      department: row.department || ""
    }));


const existingStudents = await Student.find({
  email: { $in: students.map(s => s.email) }
});

const existingEmails = existingStudents.map(s => s.email);

const newStudents = students.filter(
  s => !existingEmails.includes(s.email)
);

if (newStudents.length > 0) {
  await Student.insertMany(newStudents);
}

    res.status(201).json({
      message: "Students uploaded successfully",
      total: students.length
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const getStudentsByClass = async (req, res) => {
  try {
    const { department, semester } = req.query;

    const students = await Student.find({
      department,
      semester
    })
      .select("name regNumber")
      .sort({ regNumber: 1 }); // ✅ ascending

    res.json({
      success: true,
      students
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getStudentAttendance =
  async (req, res) => {

    try {

      const studentId =
        req.user.id;

      // Student Details
      const student =
        await Student.findById(
          studentId
        );

      if (!student) {

        return res.status(404).json({

          message:
            "Student not found"

        });

      }

      // ✅ Only Assigned Subjects
      const assignedSubjects =
        await ClassAssign.find({

          department:
            student.department,

          semester:
            student.semester,

        }).populate(
          "subject"
        );

      // Subject IDs
      const subjectIds =
        assignedSubjects.map(
          (s) => s.subject._id
        );

      // Attendance Fetch
      const records =
        await Attendance.find({

          department:
            student.department,

          semester:
            student.semester,

          subject: {
            $in: subjectIds
          },

          "students.regNumber":
            student.regNumber

        }).populate(
          "subject"
        );

      const attendanceMap = {};

      records.forEach(
        (record) => {

          if (!record.subject)
            return;

          const subjectName =
            record.subject
              .subjectName;

          if (
            !attendanceMap[
              subjectName
            ]
          ) {

            attendanceMap[
              subjectName
            ] = {

              total: 0,

              present: 0,

            };

          }

          attendanceMap[
            subjectName
          ].total++;

          // Current Student
          const studentData =
            record.students.find(
              (s) =>
                s.regNumber ===
                student.regNumber
            );

          if (
            studentData &&
            studentData.status ===
              "Present"
          ) {

            attendanceMap[
              subjectName
            ].present++;

          }

        }
      );

      const result =
        Object.keys(
          attendanceMap
        ).map((subject) => {

          const total =
            attendanceMap[
              subject
            ].total;

          const present =
            attendanceMap[
              subject
            ].present;

          return {

            subject,

            totalClasses:
              total,

            presentClasses:
              present,

            percentage:
              (
                (present /
                  total) *
                100
              ).toFixed(2),

          };

        });

      res.json({

        attendance:
          result,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to fetch attendance"

      });

    }

};

export const getStudentAttendanceBySubject =
  async (req, res) => {

    try {

      const regNumber =
        req.user.regNumber;

      const { subjectId } =
        req.params;

      const attendanceRecords =
        await Attendance.find({

          subject: subjectId,

        }).populate(
          "markedBy",
          "name"
        );

      const result =
        attendanceRecords.map(
          (record) => {

            const foundStudent =
              record.students.find(
                (s) =>
                  s.regNumber ===
                  regNumber
              );

            return {

              date: record.date,

              status:
                foundStudent?.status ||
                "Absent",

              faculty:
                record.markedBy?.name ||
                "Unknown",

            };

          }
        );

      res.json(result);

    } catch (error) {

      console.log(
        "CALENDAR ERROR:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });

    }

};