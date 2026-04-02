import express from "express";
import upload from "../middleware/upload.middleware.js";
import { createStudent, getAllStudents, getStudentsBySemester,uploadStudents ,getStudentsByClass } from "../controllers/student.controllers.js";
import { authFaculty } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", createStudent);
router.get("/allstudents", getAllStudents);
router.get("/students/:semester", getStudentsBySemester);
router.post("/upload", upload.single("file"), uploadStudents);
router.get("/students", authFaculty, getStudentsByClass);

export default router;