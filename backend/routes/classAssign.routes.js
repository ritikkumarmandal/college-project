import express from "express";
import { assignClass } from "../controllers/classAssign.controller.js";
const router = express.Router();

router.post("/assign-class", assignClass);

export default router;