import Hod from "../models/hod.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Student from "../models/Student.models.js";
import Attendance from "../models/Attendance.models.js";
import subject from "../models/subject.models.js";

dotenv.config();

export const registered = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // 1 Check: department ka HOD already hai?
    const existingHod = await Hod.findOne({ department });
    if (existingHod) {
      return res.status(400).json({
        message: "Is department ka HOD pehle se registered hai",
      });
    }

    // 2️ Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️ Create HOD
    const hod = await Hod.create({
      name,
      email,
      password: hashedPassword,
      department,
      role: "HOD", //  force HOD
    });

    res.status(201).json({
      message: "HOD registered successfully",
      hod: {
        id: hod._id,
        name: hod.name,
        department: hod.department,
        role: hod.role,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/*export const registered = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      department
    } = req.body;

    // =========================
    // ALL FIELDS CHECK
    // =========================

    if (
      !name ||
      !email ||
      !password ||
      !department
    ) {

      return res.status(400).json({

        message:
          "All fields are required",

      });

    }

    // =========================
    // HOD EMAIL CHECK
    // =========================

    if (
      !email.includes("hod")
    ) {

      return res.status(400).json({

        message:
          "Use HOD email (email must contain 'hod')",

      });

    }

    // =========================
    // EMAIL ALREADY EXISTS
    // =========================

    const existingEmail =
      await Hod.findOne({
        email
      });

    if (existingEmail) {

      return res.status(400).json({

        message:
          "Email already registered",

      });

    }

    // =========================
    // DEPARTMENT HOD CHECK
    // =========================

    const existingHod =
      await Hod.findOne({

        department

      });

    if (existingHod) {

      return res.status(400).json({

        message:
          "This department already has a HOD",

      });

    }

    // =========================
    // PASSWORD HASH
    // =========================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // =========================
    // CREATE HOD
    // =========================

    const hod =
      await Hod.create({

        name,

        email,

        password:
          hashedPassword,

        department,

        role: "HOD",

      });

    // =========================
    // RESPONSE
    // =========================

    res.status(201).json({

      success: true,

      message:
        "HOD registered successfully",

      hod: {

        id:
          hod._id,

        name:
          hod.name,

        email:
          hod.email,

        department:
          hod.department,

        role:
          hod.role,

      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        error.message,

    });

  }

};*/

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