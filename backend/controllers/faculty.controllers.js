import Faculty from "../models/faculty.models.js";
import ClassAssign from "../models/classAssign.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Attendance from "../models/Attendance.models.js";

import OtpModel from "../models/otp.model.js";

import { sendEmail } from "../services/email.service.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";





// REGISTER FACulty

export const registerFaculty = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      department,
      password,
    } = req.body;

    // Check existing faculty
    const exists = await Faculty.findOne({
      $or: [
        { email: email.toLowerCase() },
        { mobile },
      ],
    });

    if (exists) {
      return res.status(400).json({
        message: "Faculty already exists",
      });
    }

    // Generate OTP
    const otp = generateOtp();

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // Remove old OTP
    await OtpModel.deleteMany({
      email: email.toLowerCase(),
      role: "FACULTY",
    });

    // Save OTP
    await OtpModel.create({
      email: email.toLowerCase(),
      role: "FACULTY",
      otpHash,
    });

    // Send OTP Email
    await sendEmail(
      email,
      "Faculty Email Verification",
      `Your OTP is ${otp}`,
      getOtpHtml(otp)
    );

    // Response
    res.status(200).json({
      message: "OTP sent successfully",

      data: {
        name,
        email: email.toLowerCase(),
        mobile,
        department,
        password: hashedPassword,
        role: "FACULTY",
      },
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// validate otp and create faculty
  
export const verifyFacultyOtp = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      mobile,
      department,
      password,
      otp,
    } = req.body;

    // Find OTP
    const otpData = await OtpModel.findOne({
      email: email.toLowerCase(),
      role: "FACULTY",
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

    // Create Faculty
    const faculty = await Faculty.create({
      name,
      email: email.toLowerCase(),
      mobile,
      department,
      password,
      role: "FACULTY",
    });

    // Delete OTP
    await OtpModel.deleteOne({
      _id: otpData._id,
    });

    res.status(201).json({
      message: "Faculty registered successfully",

      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
      },
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// LOGIN FACULTY
export const loginfaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    const FACULTY = await Faculty.findOne({ email });
    if (!FACULTY) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const isMatch = await bcrypt.compare(password, FACULTY.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ FIX HERE
    const token = jwt.sign(
      {
        id: FACULTY._id,   // ⭐ IMPORTANT FIX
        role: FACULTY.role,
        department: FACULTY.department,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Faculty login successful",
      token,
      role: FACULTY.role,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET ALL FACULTY DETAILS
export const getAllFaculty = async (req, res) => {
  try {

    // fetch faculty without sensitive fields
    const facultyList = await Faculty.find()
      .select("name email mobile department");

    res.status(200).json({
      success: true,
      totalFaculty: facultyList.length,
      faculty: facultyList,
    });

  } catch (error) {
    console.error("Get Faculty Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error while fetching faculty",
    });
  }
};

// GET FACULTY CLASSES

export const getFacultyClasses =
  async (req, res) => {

    try {

      // AUTH CHECK
      if (
        !req.user ||
        !req.user.id
      ) {

        return res.status(401)
          .json({

            message:
              "User not authenticated",

          });

      }

      // FACULTY + HOD
      const classes =
        await ClassAssign.find({

          $or: [

            {
              faculty:
                req.user.id,
            },

            {
              hod:
                req.user.id,
            },

          ],

        })

          .populate(
            "subject",
            "subjectName subjectCode"
          )

          .populate(
            "faculty",
            "name department"
          )

          .populate(
            "hod",
            "name department"
          )

          .lean();

      // REMOVE INVALID
      const validClasses =
        classes.filter(
          (c) =>
            c.subject !== null
        );

      res.status(200).json({

        success: true,

        validClasses,

      });

    } catch (error) {

      console.error(
        "ERROR =>",
        error
      );

      res.status(500).json({

        message:
          error.message,

      });

    }

};




// ==========================================
// GET ALL ATTENDANCE DATES
// ==========================================

export const getAttendanceDates =
  async (req, res) => {

    try {

      const { subjectId } =
        req.params;

      const records =
        await Attendance.find({
          subject: subjectId,
        });

      const result =
        records.map((record) => {

          // YYYY-MM-DD
          const formattedDate =
            new Date(record.date)
              .toISOString()
              .split("T")[0];

          // Any Present?
          const hasPresent =
            record.students.some(
              (s) =>
                s.status ===
                "Present"
            );

          return {

            date:
              formattedDate,

            status:
              hasPresent
                ? "Present"
                : "Absent",

          };
        });

      res.json(result);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch dates",
      });

    }
};





// ==========================================
// GET ATTENDANCE BY DATE
// ==========================================

export const getAttendanceByDate =
  async (req, res) => {

    try {

      const {
        subjectId,
        date,
      } = req.params;

      const records =
        await Attendance.find({
          subject: subjectId,
        });

      const attendance =
        records.find((record) => {

          const formattedDate =
            new Date(record.date)
              .toISOString()
              .split("T")[0];

          return (
            formattedDate ===
            date
          );
        });

      if (!attendance) {

        return res.status(404).json({
          message:
            "No attendance found",
        });

      }

      // ONLY PRESENT STUDENTS
      const presentStudents =
        attendance.students.filter(
          (s) =>
            s.status ===
            "Present"
        );

      res.json({

        date:
          attendance.date,

        students:
          presentStudents,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch attendance",
      });

    }
};


