import express from "express";
import upload from "../middleware/upload.middleware.js";
import { createStudent, getAllStudents, getStudentsBySemester,uploadStudents ,getStudentsByClass, verifyStudentOTP, sendStudentOTP,setPassword ,getStudentAttendance, getStudentAttendanceBySubject} from "../controllers/student.controllers.js";
import { authFaculty } from "../middleware/auth.middleware.js";
import authemail from "../middleware/authemail.middleware.js";

const router = express.Router();

router.post("/create", createStudent);
router.post("/login", verifyStudentOTP);
router.post("/send-otp", sendStudentOTP);
router.post("/set-password", setPassword);
router.get("/allstudents", getAllStudents);
router.get("/students/:semester", getStudentsBySemester);
router.post("/upload", upload.single("file"), uploadStudents);
router.get("/students", authFaculty, getStudentsByClass);
router.get(
  "/showattendence",
  authemail,
  getStudentAttendance
);
router.get(
  "/calendar/:subjectId",
  authemail,
   getStudentAttendanceBySubject
);


export default router;