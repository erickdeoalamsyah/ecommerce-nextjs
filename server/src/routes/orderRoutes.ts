// src/routes/orderRoutes.ts

import express from "express";
import {
  createMidtransTransaction,
  createFinalOrder,
  getOrder,
  getOrdersByUserId,
  getAllOrdersForAdmin,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// Semua route di bawah ini harus user terautentikasi
router.use(authenticateJwt);

// Midtrans transaction: buat token Snap
router.post("/create-midtrans-transaction", createMidtransTransaction);

// Finalize order setelah sukses bayar di Midtrans
router.post("/create-final-order", createFinalOrder);

// Dapatkan order tertentu (detail per ID)
router.get("/get-single-order/:orderId", getOrder);

// Dapatkan semua order milik user saat ini
router.get("/get-order-by-user-id", getOrdersByUserId);

// ADMIN: Dapatkan semua order
router.get("/get-all-orders-for-admin", isSuperAdmin, getAllOrdersForAdmin);

// ADMIN: Update status order
router.put("/:orderId/status", isSuperAdmin, updateOrderStatus);

export default router;
