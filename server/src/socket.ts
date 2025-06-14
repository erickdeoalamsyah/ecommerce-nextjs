import type { Server } from "socket.io"
import { authenticateSocket, type AuthenticatedSocket } from "./middleware/socketAuth"
import { prisma } from "./server"

const connectedUsers = new Map<string, AuthenticatedSocket>()

export const setupSocketIO = (io: Server) => {
  console.log("Setting up Socket.IO...")

  io.use(authenticateSocket)

  io.on("connection", async (socket: AuthenticatedSocket) => {
    if (!socket.user) {
      console.log("Socket connection rejected: No user data")
      socket.disconnect()
      return
    }

    const { userId, role } = socket.user
    console.log(`User connected: ${userId}, Role: ${role}`)

    connectedUsers.set(userId, socket)

    socket.join(`user:${userId}`)

    if (role === "SUPER_ADMIN") {
      socket.join("admin")
    }
    socket.on('confirm_notification', (notificationId: string) => {
      console.log(`User ${userId} received notification ${notificationId}`);
    });

    socket.on("join_chat", (chatId: string) => {
      console.log(`User ${userId} joining chat: ${chatId}`)
      socket.join(`chat:${chatId}`)
    })

    socket.on("send_message", async (data: { chatId: string; content: string }) => {
      try {
        const { chatId, content } = data

        const chat = await prisma.chat.findUnique({
          where: { id: chatId },
        })

        if (!chat) {
          socket.emit("error", "Chat not found")
          return
        }

        // Check if user is part of this chat
        if (chat.userId !== userId && chat.superAdminId !== userId) {
          socket.emit("error", "Unauthorized to send message in this chat")
          return
        }

        // Create message in database - GUNAKAN chatMessage (camelCase)
        const message = await prisma.chatMessage.create({
          data: {
            chatId,
            senderId: userId,
            content,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        })

        // Update chat's lastMessageAt
        await prisma.chat.update({
          where: { id: chatId },
          data: { lastMessageAt: new Date() },
        })

        // Broadcast to chat room
        io.to(`chat:${chatId}`).emit("message_received", message)

        // If sender is user, notify admin
        if (role === "USER") {
          io.to("admin").emit("new_user_message", {
            chatId,
            userId,
            message: content,
          })
        }
        // If sender is admin, notify specific user
        else if (role === "SUPER_ADMIN") {
          io.to(`user:${chat.userId}`).emit("new_admin_message", {
            chatId,
            message: content,
          })
        }
      } catch (error) {
        console.error("Error sending message:", error)
        socket.emit("error", "Failed to send message")
      }
    })

    // Handle typing indicator
    socket.on("typing", (chatId: string) => {
      socket.to(`chat:${chatId}`).emit("user_typing", { userId })
    })

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`)
      connectedUsers.delete(userId)
    })
  })

  return io
}

// Helper to check if user is online
export const isUserOnline = (userId: string): boolean => {
  return connectedUsers.has(userId)
}

// Helper to get all online users
export const getOnlineUsers = (): string[] => {
  return Array.from(connectedUsers.keys())
}
export const sendOrderNotification = (
  io: Server,
  userId: string,
  message: string
) => {
  if (isUserOnline(userId)) {
    io.to(`user:${userId}`).emit('order_notification', { message });
  }
};
