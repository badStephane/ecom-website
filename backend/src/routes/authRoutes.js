import express from "express";
import { register, login, getCurrentUser, updateProfile, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { loginLimiter } from "../middlewares/securityMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginLimiter, login); // Protection contre les attaques brute force
router.get("/me", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, updateProfile);
router.post("/logout", authMiddleware, logout);

export default router;
