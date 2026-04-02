import ClassAssign from "../models/classAssign.models.js";

export const assignClass = async (req, res) => {
  try {
    const { department, semester, subject, faculty } = req.body;

    const exists = await ClassAssign.findOne({
      subject,
      semester,
    });

    if (exists) {
      return res.status(400).json({
        message: "Class already assigned",
      });
    }

    const assign = await ClassAssign.create({
      department,
      semester,
      subject,
      faculty,
    });

    res.status(201).json({
      message: "Class Assigned Successfully ✅",
      assign,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};