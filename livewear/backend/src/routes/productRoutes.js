import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authMiddleware, optionalAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAuth, getProducts);
router.get("/:id", optionalAuth, getProductById);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
