import express from "express";
import { registered, login ,getStudentAttendanceByRegNo,verifyHodOtp} from "../controllers/hod.controllers.js";
import { authHod } from "../middleware/authHod.middleware.js";
const router = express.Router();


router.post("/register", registered);
router.post(
  "/verify-otp",
  verifyHodOtp
);
router.post("/login", login);
router.use(authHod); // HOD authentication for all routes below
router.get(
  "/search-attendance/:regNumber",
  getStudentAttendanceByRegNo
);

router.post(
  "/verify-otp",
  verifyHodOtp
);


export default router;