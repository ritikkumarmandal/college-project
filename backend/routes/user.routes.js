import express from "express";
import { registered, login } from "../controllers/hod.controllers.js";
import { authHod } from "../middleware/authHod.middleware.js";
const router = express.Router();


router.post("/register", registered);
router.post("/login", login);
router.use(authHod); // HOD authentication for all routes below


export default router;