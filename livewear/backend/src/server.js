import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/errorMiddleware.js";
import { corsOptions } from "./middlewares/corsMiddleware.js";
import {
  xssProtection,
  httpParameterProtection,
  nosqlInjectionProtection,
  helmetConfig,
  rateLimiter,
} from "./middlewares/securityMiddleware.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware de sécurité
app.use(helmetConfig); // Sécurisation des en-têtes HTTP
app.use(cors(corsOptions)); // Configuration CORS
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(xssProtection); // Protection contre les attaques XSS
app.use(nosqlInjectionProtection); // Protection contre les injections NoSQL
app.use(httpParameterProtection); // Protection contre la pollution des paramètres HTTP
app.use(rateLimiter); // Limitation du taux de requêtes

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/config", configRoutes);
app.use("/api/upload", uploadRoutes);

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     🎨 LIVEWEAR BACKEND SERVER 🎨     ║
╚════════════════════════════════════════╝
✅ Server running on port ${PORT}
📡 Environment: ${process.env.NODE_ENV || "development"}
🗄️  MongoDB: Connecting...
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
