import express from "express";
import { assignClass } from "../controllers/classAssign.controller.js";
import { authUser } from '../middleware/authUser.middleware.js';
const router = express.Router();

router.post("/assign-class", 
    authUser,
    assignClass);

export default router;