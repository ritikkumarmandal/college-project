import express from "express";
import { createSubject, getSubjects } from "../controllers/subject.controller.js";
const router = express.Router();

router.post("/subject/create", createSubject);
router.get("/subject", getSubjects);

export default router;