import Faculty from "../models/faculty.models.js";
import ClassAssign from "../models/classAssign.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Attendance from "../models/Attendance.models.js";




// REGISTER FACulty

export const registerFaculty = async (req, res) => {
  try {
    const { name, email, mobile, department,password } = req.body;

    const exists = await Faculty.findOne({
      $or: [{ email }, { mobile }]
    });

    if (exists) {
      return res.status(400).json({
        message: "Faculty already exists"
      });
    }
       const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = await Faculty.create({
      name,
      email: email.toLowerCase(),
      mobile,
      department,
      password: hashedPassword,
      role: "FACULTY"
    });

    res.status(201).json({
      message: "Faculty registered successfully",
      faculty: {
        name: faculty.name,
        email: faculty.email,
        department: faculty.department
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// SEND OTP (LOGIN STEP 1)

/*export const sendFacultyOtp = async (req, res) => {

  try {
    const { emailOrMobile } = req.body;

    const faculty = await Faculty.findOne({
      $or: [
        { email: emailOrMobile.toLowerCase() },
        { mobile: emailOrMobile }
      ]
    });

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found"
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    faculty.otp = otp;
    faculty.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    await faculty.save();

    // 👉 Later email/SMS send karna
    console.log("Faculty OTP:", otp);

    res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// VERIFY OTP (LOGIN STEP 2)

export const verifyFacultyOtp = async (req, res) => {
  try {
    const { emailOrMobile, otp } = req.body;

    const faculty = await Faculty.findOne({
      $or: [
        { email: emailOrMobile.toLowerCase() },
        { mobile: emailOrMobile }
      ]
    });

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found"
      });
    }

    if (faculty.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (faculty.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    // clear OTP after use
    faculty.otp = null;
    faculty.otpExpiry = null;
    await faculty.save();

    // JWT Token
    const token = jwt.sign(
      {
        id: faculty._id,
        role: faculty.role,
        department: faculty.department
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Faculty login successful",
      token,
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/

// faculty login with password (temporary until OTP is implemented)

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

// assign class to faculty and get faculty classes



/*export const getFacultyClasses = async (req, res) => {
  try {

    // ✅ safety check
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

   
    // ✅ mongoose auto casting karega
    const classes = await ClassAssign.find({
      faculty: req.user.id
    })
      .populate("subject", "subjectName subjectCode")
      .populate("faculty", "name department")
      .lean();

      const validClasses = classes.filter(c => c.subject !== null);


    

    res.status(200).json({
      success: true,
      validClasses
    });

  } catch (error) {
    console.error("ERROR =>", error);
    res.status(500).json({
      message: error.message
    });
  }
};*/


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


