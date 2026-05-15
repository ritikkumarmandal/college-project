import express from "express";
import { createSubject, getSubjects,getSubjectsForStudent } from "../controllers/subject.controller.js";
import authemail from "../middleware/authemail.middleware.js";

const router = express.Router();

router.post("/create", createSubject);
router.get("/", getSubjects);
//router.get("/student", authemail,getSubjectsForStudent);


router.get(
  "/student",
  authemail,
  getSubjectsForStudent
);

export default router;