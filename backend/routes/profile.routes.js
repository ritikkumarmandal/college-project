import express from 'express';
import { getProfile, updateProfile,changePassword } from '../controllers/profile.controllers.js';

import { authUser } from '../middleware/authUser.middleware.js';
const router = express.Router();

router.get(
  "/seeprofile",
  authUser,
  getProfile
);

router.put(
  "/editprofile",
  authUser,
  updateProfile
);

router.put(
  "/change-password",
  authUser,
  changePassword
);

export default router;