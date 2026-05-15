import  Subject from "../models/subject.models.js";
import Student from "../models/Student.models.js";



// CREATE SUBJECT
export const createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, department, semester } = req.body;

    const subject = await Subject.create({
      subjectName,
      subjectCode,
      department,
      semester,
    });

    res.status(201).json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Subject creation failed",
      error: error.message,
    });
  }
};

// GET SUBJECTS BY SEMESTER
export const getSubjects = async (req, res) => {
  try {
    const { department, semester } = req.query;

    const subjects = await Subject.find({
      department,
      semester,
    });

    res.json({ subjects });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch subjects",
    });
  }
};





export const getSubjectsForStudent = async (req, res) => {
  try {
    // Assume middleware ne user email attach kiya hai

    
    const email = req.user.email;

    // Step 1: Student find karo
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Step 2: Department & Semester nikalo
    const { department, semester } = student;

    // Step 3: Subjects fetch karo
    const subjects = await Subject.find({
      department,
      semester,
    });

    res.json({ subjects });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch subjects",
    });
  }
};