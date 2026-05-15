import XLSX from "xlsx";
import Student from "../models/Student.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.models.js";


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




export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🔥 First time user
    if (!student.password) {
      return res.status(200).json({
        message: "Please set password first",
        firstTime: true
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ 🔥 REAL JWT TOKEN BAN RAHA HAI
    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        regNumber: student.regNumber,
        role: "STUDENT"
      },
      process.env.JWT_SECRET,   // 🔐 .env me rakho
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      role: "STUDENT",
      token,
      firstTime: false
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
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

    // Read excel buffer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);

    // ✅ Mandatory fields
    const requiredFields = [
      "name",
      "regNumber",
      "email",
      "semester",
      "department",
    ];

    // check columns exist
    const fileColumns = Object.keys(data[0] || {});

    const missingFields = requiredFields.filter(
      field => !fileColumns.includes(field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing mandatory columns: ${missingFields.join(", ")}`
      });
    }

    // ✅ Save students
    const students = [];

    for (const row of data) {
      const student = new Student({
        name: row.name,
        email: row.email,
        regNumber: row.regNumber,
        semester: row.semester,
        department: row.department || ""
      });

      students.push(student);
    }

    await Student.insertMany(students);

    res.status(201).json({
      message: "Students uploaded successfully",
      total: students.length
    });

  } catch (error) {
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



export const getStudentAttendance = async (req, res) => {
  try {

    const studentId = req.user.id;

    // Student details
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // Attendance fetch
    const records = await Attendance.find({
      department: student.department,
      semester: student.semester,
      "students.regNumber": student.regNumber
    }).populate("subject");

    const attendanceMap = {};

    records.forEach((record) => {

      const subjectName =
        record.subject.subjectName;

      if (!attendanceMap[subjectName]) {

        attendanceMap[subjectName] = {
          total: 0,
          present: 0
        };
      }

      attendanceMap[subjectName].total++;

      // find current student attendance
      const studentData =
        record.students.find(
          (s) =>
            s.regNumber === student.regNumber
        );

      if (
        studentData &&
        studentData.status === "Present"
      ) {
        attendanceMap[subjectName].present++;
      }
    });

    const result = Object.keys(attendanceMap)
      .map((subject) => {

        const total =
          attendanceMap[subject].total;

        const present =
          attendanceMap[subject].present;

        return {
          subject,
          totalClasses: total,
          presentClasses: present,
          percentage:
            ((present / total) * 100).toFixed(2)
        };
      });

    res.json({
      attendance: result
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch attendance"
    });
  }
};


export const getStudentAttendanceBySubject = async (req, res) => {

  try {

    const regNumber = req.user.regNumber;
    const { subjectId } = req.params;

    const attendanceRecords = await Attendance.find({
      subject: subjectId,
    }).populate("faculty", "name");

    const result = attendanceRecords.map((record) => {

      const foundStudent = record.students.find(
        (s) => s.regNumber === regNumber
      );

      return {
        date: record.date,
        status: foundStudent?.status || "Absent",
        faculty: record.faculty.name,
      };
    });

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};