import express from "express";
import { getUsers, getUserById, updateUser, deleteUser, getUserOrders } from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes protégées admin
router.get("/", authMiddleware, adminMiddleware, getUsers);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.put("/:id", authMiddleware, adminMiddleware, updateUser);

// Routes protégées utilisateur
router.get("/:id", authMiddleware, getUserById);
router.get("/:id/orders", authMiddleware, getUserOrders);

export default router;
