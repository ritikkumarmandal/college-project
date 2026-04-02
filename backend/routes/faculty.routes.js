import express from "express";
import {registerFaculty,loginfaculty,getAllFaculty} from "../controllers/faculty.controllers.js";
import { getFacultyClasses } from "../controllers/faculty.controllers.js";
import { authFaculty} from "../middleware/auth.middleware.js";
import { markAttendance ,getAttendanceReport} from "../controllers/markAttendance.controllers.js";



const router = express.Router();

 router.post("/faculty/register",registerFaculty);
// router.post("/send-otp", sendFacultyOtp);
// router.post("/verify-otp", verifyFacultyOtp);
router.post("/faculty/login",loginfaculty);
router.get("/faculty/all",getAllFaculty);
router.get("/faculty/classes", authFaculty, getFacultyClasses);

router.post("/attendance",authFaculty, markAttendance);

router.get(
  "/report",
  authFaculty,   // ✅ tumhara middleware
  getAttendanceReport
);

export default router;