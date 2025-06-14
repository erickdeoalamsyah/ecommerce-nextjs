import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import responseTime from "response-time";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import settingsRoutes from "./routes/settingRoutes";
import cartRoutes from "./routes/cartRoutes";
import addressRoutes from "./routes/addressRoutes";
import orderRoutes from "./routes/orderRoutes";
import chatRoutes from "./routes/chatRoutes";
import { setupSocketIO } from "./socket";
import { prometheusMiddleware, register, activeConnections } from "./middleware/prometheus";

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002; // Default port

// Create HTTP server
const httpServer = createServer(app);

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(responseTime());  // Response time logger middleware

// Prometheus middleware
app.use(prometheusMiddleware);

// Prisma Client
export const prisma = new PrismaClient();

// Metrics endpoint for Prometheus
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Hello from E-Commerce backend");
});

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Initialize socket handlers
setupSocketIO(io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔌 Socket.IO server is ready`);
  console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
  console.log(`❤️ Health check available at http://localhost:${PORT}/health`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
