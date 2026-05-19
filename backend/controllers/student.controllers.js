import XLSX from "xlsx";
import Student from "../models/Student.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.models.js";
import ClassAssign from "../models/classAssign.models.js";
import nodemailer from "nodemailer";
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






// ============================
// EMAIL TRANSPORTER
// ============================


const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },

});


// ============================
// SEND OTP
// ============================

export const sendStudentOTP = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        message: "Email required"
      });

    }

    // FIND STUDENT
    const student = await Student.findOne({ email });

    if (!student) {

      return res.status(404).json({
        message: "Student not found"
      });

    }

    // GENERATE OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // SAVE OTP
    student.otp = otp;

    student.otpExpiry =
      Date.now() + 5 * 60 * 1000;

    await student.save();

    // SEND EMAIL
    await transporter.sendMail({

      from: process.env.EMAIL,

      to: student.email,

      subject: "Your Login OTP",

      text: `Hello ${student.name},

Your OTP for login is:

${otp}

This OTP will expire in 5 minutes.

Regards
Attendance Management System`,

    });

    res.status(200).json({

      success: true,

      message: "OTP sent successfully",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }

};


// ============================
// VERIFY OTP LOGIN
// ============================

export const verifyStudentOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    if (!email || !otp) {

      return res.status(400).json({
        message: "Email and OTP required"
      });

    }

    // FIND STUDENT
    const student = await Student.findOne({ email });

    if (!student) {

      return res.status(404).json({
        message: "Student not found"
      });

    }

    // CHECK OTP
    if (student.otp !== otp) {

      return res.status(400).json({
        message: "Invalid OTP"
      });

    }

    // CHECK EXPIRY
    if (student.otpExpiry < Date.now()) {

      return res.status(400).json({
        message: "OTP expired"
      });

    }

    // EMAIL VERIFIED
    student.isVerified = true;

    // CLEAR OTP
    student.otp = null;
    student.otpExpiry = null;

    await student.save();

    // GENERATE JWT
    const token = jwt.sign(

      {
        id: student._id,
        email: student.email,
        regNumber: student.regNumber,
        role: "STUDENT"
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d"
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
      message: error.message
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