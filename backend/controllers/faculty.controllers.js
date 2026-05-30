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
    const { name, email, password, department } = req.body;

    // Check department HOD
   

    // Check existing email
    const existingEmail = await Faculty.findOne({ email });

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
      role: "FACULTY",
    });

    // Save OTP Data
    await OtpModel.create({
  email: email.toLowerCase(),
  role: "FACULTY",
  otpHash,
});

    // Send Email
    await sendEmail(
      email,
      "Faculty Email Verification",
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
  
export const verifyFacultyOtp  = async (
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

        role: "FACULTY",

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

    const faculty = await Faculty.create({

      name,

      email:
        email.toLowerCase(),

      password: await bcrypt.hash(password, 10),

      department,

      role: "FACULTY",

    });

    await OtpModel.deleteOne({
      _id: otpData._id,
    });

    res.status(201).json({

      message:
        " faculty registered successfully",
       
        faculty
      ,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message,
    });

  }

};



// LOGIN FACULTY
export const loginfaculty= async (req, res) => {
  try {
    const { email, password } = req.body;

    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).json({ message: "faculty not found" });
    }

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: faculty._id, role: faculty.role, department: faculty.department },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "faculty login successful",
      token,
      role: faculty.role,
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


