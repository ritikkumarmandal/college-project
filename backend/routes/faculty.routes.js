import express from "express";
import {registerFaculty,loginfaculty,getAllFaculty, getAttendanceDates,getAttendanceByDate} from "../controllers/faculty.controllers.js";
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

/*router.get(
  "/report",
  authFaculty,   // ✅ tumhara middleware
  getAttendanceReport
);*/

router.get(
  "/faculty/attendance-dates/:subjectId",
  authFaculty,
  getAttendanceDates
);

router.get(
  "/faculty/date-attendance/:subjectId/:date",
  authFaculty,
  getAttendanceByDate
);


export default router;