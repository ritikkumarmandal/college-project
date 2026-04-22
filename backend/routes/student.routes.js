import express from "express";
import upload from "../middleware/upload.middleware.js";
import { createStudent, getAllStudents, getStudentsBySemester,uploadStudents ,getStudentsByClass, loginStudent, setPassword } from "../controllers/student.controllers.js";
import { authFaculty } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", createStudent);
router.post("/login", loginStudent);
router.post("/set-password", setPassword);
router.get("/allstudents", getAllStudents);
router.get("/students/:semester", getStudentsBySemester);
router.post("/upload", upload.single("file"), uploadStudents);
router.get("/students", authFaculty, getStudentsByClass);

export default router;