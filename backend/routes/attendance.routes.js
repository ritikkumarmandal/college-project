import express from "express";

import {
  updateAttendance,
} from "../controllers/attendance.controller.js";

const router = express.Router();

router.put(
  "/update/:attendanceId",
  updateAttendance
);

export default router;