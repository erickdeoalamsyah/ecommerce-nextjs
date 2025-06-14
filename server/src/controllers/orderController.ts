import { RequestHandler } from "express";
import midtransClient = require("midtrans-client");
import { prisma } from "../server";

// Buat Snap Token
export const createMidtransTransaction: RequestHandler = async (req, res, next) => {
  try {
    const { email, total, items } = req.body;

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: total,
      },
      customer_details: {
        email,
      },
      item_details: items.map((item: any) => ({
        id: item.productId,
        price: item.price,
        quantity: item.quantity,
        name: item.productName,
      })),
    };

    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({ token: transaction.token });
  } catch (e) {
    console.error("Midtrans error:", e);
    res.status(500).json({ success: false, message: "Gagal membuat transaksi Midtrans" });
  }
};

// Simpan ke database setelah transaksi berhasil
export const createFinalOrder: RequestHandler = async (req, res, next) => {
  try {
    const { items, addressId, couponId, total, paymentId } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated user" });
      return;
    }

    const order = await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          userId,
          addressId,
          total,
          paymentMethod: "TRANSFER",
          paymentStatus: "COMPLETED",
          paymentId,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              productName: item.productName,
              productCategory: item.productCategory,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });


      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      await prisma.cartItem.deleteMany({ where: { cart: { userId } } });
      await prisma.cart.delete({ where: { userId } });

      return newOrder;
    });
    const io = req.app.get('io');
    io.to('admin').emit('new_order', {
      orderId: order.id,
      userId: order.userId,
      total: order.total,
      createdAt: order.createdAt
    });
    

    res.status(201).json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Unexpected error occurred" });
  }
};

// Dapatkan satu order
export const getOrder: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user?.userId;
    const { orderId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated user" });
      return;
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true, address: true },
    });

    res.status(200).json(order);
  } catch (e) {
    res.status(500).json({ success: false, message: "Unexpected error occurred" });
  }
};

// Semua order milik user ini
export const getOrdersByUserId: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated user" });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true, address: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({ success: false, message: "Unexpected error occurred" });
  }
};

// Semua order untuk Admin
export const getAllOrdersForAdmin: RequestHandler = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({ success: false, message: "Unexpected error occurred" });
  }
};

// Update status order oleh admin
export const updateOrderStatus: RequestHandler = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { user: true } // Untuk dapatkan userId
    });
    const io = req.app.get('io');
    io.to(`user:${updatedOrder.user.id}`).emit('order_status_updated', {
      orderId,
      newStatus: status
    });

    res.status(200).json({ success: true, message: "Order status updated" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Unexpected error occurred" });
  }
};