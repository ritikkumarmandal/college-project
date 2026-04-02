import  Subject from "../models/subject.models.js";

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