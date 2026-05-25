// routes/report.routes.js

import express from "express";

import {
  downloadAttendanceReport,
} from "../controllers/report.controller.js";

const router =
  express.Router();



router.get(
  "/download-report",
  (req, res, next) => {

    console.log(
      "ROUTE HIT"
    );

    next();

  },
  downloadAttendanceReport
);
export default router;