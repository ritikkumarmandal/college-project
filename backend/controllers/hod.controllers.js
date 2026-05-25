import Hod from "../models/hod.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Student from "../models/Student.models.js";
import Attendance from "../models/Attendance.models.js";
import {sendEmail} from "../services/email.service.js";
import OtpModel from "../models/otp.model.js";
import {generateOtp,getOtpHtml} from "../utils/utils.js";
import subject from "../models/subject.models.js";

dotenv.config();


export const registered = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // Check department HOD
    const existingHod = await Hod.findOne({ department });

    if (existingHod) {
      return res.status(400).json({
        message: "Is department ka HOD pehle se registered hai",
      });
    }

    // Check existing email
    const existingEmail = await Hod.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Generate OTP
    const otp = generateOtp();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hash OTP
    
const otpHash = await bcrypt.hash(
  otp.toString(),
  10
);
    // Delete old OTP
    await OtpModel.deleteMany({
      email,
      role: "HOD",
    });

    // Save OTP Data
    await OtpModel.create({
  email: email.toLowerCase(),
  role: "HOD",
  otpHash,
});

    // Send Email
    await sendEmail(
      email,
      "HOD Email Verification",
      `Your OTP is ${otp}`,
      getOtpHtml(otp)
    );

    // Temporary data response
    res.status(200).json({
      message: "OTP sent successfully",
      data: {
        name,
        email,
        password: hashedPassword,
        department,
        role: "HOD",
      },
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// otp verify

export const verifyHodOtp = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
      department,
      otp,
    } = req.body;
    console.log("BODY:", req.body);

console.log("HEADERS:", req.headers);

    console.log(req.body);

    const otpData =
      await OtpModel.findOne({

        email:
          email.toLowerCase(),

        role: "HOD",

      });

    console.log(otpData);

    if (!otpData) {

      return res.status(400).json({
        message: "OTP expired",
      });

    }

    const isMatch =
      await bcrypt.compare(

        otp.toString(),

        otpData.otpHash

      );

    console.log(isMatch);

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid OTP",
      });

    }

    const hod = await Hod.create({

      name,

      email:
        email.toLowerCase(),

      password,

      department,

      role: "HOD",

    });

    await OtpModel.deleteOne({
      _id: otpData._id,
    });

    res.status(201).json({

      message:
        "HOD registered successfully",

      hod,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message,
    });

  }

};

// login


export const login= async (req, res) => {
  try {
    const { email, password } = req.body;

    const hod = await Hod.findOne({ email });
    if (!hod) {
      return res.status(404).json({ message: "HOD not found" });
    }

    const isMatch = await bcrypt.compare(password, hod.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: hod._id, role: hod.role, department: hod.department },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "HOD login successful",
      token,
      role: hod.role,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const getStudentAttendanceByRegNo =
  async (req, res) => {

    try {

      const { regNumber } =
        req.params;

      // STUDENT FIND
      const student =
        await Student.findOne({
          regNumber,
        });

      if (!student) {

        return res.status(404).json({
          message:
            "Student not found",
        });

      }

      // ALL ATTENDANCE
      const records =
        await Attendance.find({
          department:
            student.department,
        }).populate(
          "subject"
        );

      // SUBJECT MAP
      const subjectMap = {};

      records.forEach(
        (record) => {

          const studentData =
            record.students.find(
              (s) =>
                s.regNumber ===
                regNumber
            );

          // IF STUDENT EXISTS
          if (studentData) {

            const subjectName =
              record.subject
                ?.subjectName ||
              "Unknown";

            // CREATE ENTRY
            if (
              !subjectMap[
                subjectName
              ]
            ) {

              subjectMap[
                subjectName
              ] = {

                subject:
                  subjectName,

                totalClasses: 0,

                presentClasses: 0,

                absentClasses: 0,

              };

            }

            // TOTAL
            subjectMap[
              subjectName
            ].totalClasses += 1;

            // PRESENT
            if (
              studentData.status ===
              "Present"
            ) {

              subjectMap[
                subjectName
              ].presentClasses += 1;

            }

            // ABSENT
            else {

              subjectMap[
                subjectName
              ].absentClasses += 1;

            }

          }

        }
      );

      // FINAL DATA
      const attendanceData =
        Object.values(
          subjectMap
        ).map((sub) => ({

          ...sub,

          percentage:
            (
              (sub.presentClasses /
                sub.totalClasses) *
              100
            ).toFixed(2),

        }));

      res.json({

        student: {

          name:
            student.name,

          regNumber:
            student.regNumber,

          department:
            student.department,

          semester:
            student.semester,

        },

        attendance:
          attendanceData,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",

      });

    }

};