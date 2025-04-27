import express from 'express';
import { login, logout, signup, updateProfile, checkAuth } from '../controllers/authController.js';
import { protectRoute } from '../middleware/middleware.js';
const router = express.Router();

router.post("/signup",signup);
router.post("/login", login); 
router.post("/logout", logout);

router.post("/update-profile", protectRoute,updateProfile);
router.get("/check", protectRoute, checkAuth); 
export default router;