import type { Request, Response } from "express"
import { prisma } from "../server"
import { isUserOnline } from "../socket"

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    email: string
    role: string
  }
}

// Get user's chat rooms
export const getChatRooms = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Unauthorized" })
      return
    }

    const { userId, role } = req.user

    let chats
    if (role === "SUPER_ADMIN") {
      // Super admin can see all chats
      chats = await prisma.chat.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
          _count: {
            select: {
              messages: {
                where: {
                  isRead: false,
                  NOT: {
                    senderId: userId,
                  },
                },
              },
            },
          },
        },
        orderBy: {
          lastMessageAt: "desc",
        },
      })

      // Add online status
      chats = chats.map((chat) => ({
        ...chat,
        isUserOnline: isUserOnline(chat.userId),
      }))
    } else {
      // Regular user can only see their chats
      chats = await prisma.chat.findMany({
        where: {
          userId,
        },
        include: {
          superAdmin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
          _count: {
            select: {
              messages: {
                where: {
                  isRead: false,
                  NOT: {
                    senderId: userId,
                  },
                },
              },
            },
          },
        },
        orderBy: {
          lastMessageAt: "desc",
        },
      })

      // Add online status for admin
      chats = chats.map((chat) => ({
        ...chat,
        isAdminOnline: isUserOnline(chat.superAdminId),
      }))
    }

    res.status(200).json({ success: true, data: chats })
  } catch (error) {
    console.error("Error getting chat rooms:", error)
    res.status(500).json({ success: false, error: "Failed to get chat rooms" })
  }
}

// Create new chat
export const createChat = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Unauthorized" })
      return
    }

    const { userId, role } = req.user

    // Only regular users can create chats
    if (role !== "USER") {
      res.status(403).json({
        success: false,
        error: "Only users can initiate chats with admin",
      })
      return
    }

    // Find a super admin to chat with
    const superAdmin = await prisma.user.findFirst({
      where: {
        role: "SUPER_ADMIN",
      },
    })

    if (!superAdmin) {
      res.status(404).json({
        success: false,
        error: "No admin available for chat",
      })
      return
    }

    // Check if chat already exists
    let chat = await prisma.chat.findFirst({
      where: {
        userId,
        superAdminId: superAdmin.id,
      },
    })

    // If not, create new chat
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userId,
          superAdminId: superAdmin.id,
        },
      })
    }

    res.status(200).json({ success: true, data: chat })
  } catch (error) {
    console.error("Error creating chat:", error)
    res.status(500).json({ success: false, error: "Failed to create chat" })
  }
}

// Get chat messages
export const getChatMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Unauthorized" })
      return
    }

    const { userId } = req.user
    const { chatId } = req.params

    // Verify chat access
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    })

    if (!chat) {
      res.status(404).json({ success: false, error: "Chat not found" })
      return
    }

    // Check if user is part of this chat
    if (chat.userId !== userId && chat.superAdminId !== userId) {
      res.status(403).json({
        success: false,
        error: "You don't have access to this chat",
      })
      return
    }

    // Get messages - GUNAKAN chatMessage (camelCase untuk Prisma client)
    const messages = await prisma.chatMessage.findMany({
      where: {
        chatId,
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
      orderBy: {
        createdAt: "asc",
      },
    })

    // Mark messages as read - GUNAKAN chatMessage (camelCase untuk Prisma client)
    await prisma.chatMessage.updateMany({
      where: {
        chatId,
        senderId: {
          not: userId,
        },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    res.status(200).json({ success: true, data: messages })
  } catch (error) {
    console.error("Error getting chat messages:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get chat messages",
    })
  }
}

// Get unread message count
export const getUnreadCount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Unauthorized" })
      return
    }

    const { userId } = req.user

    // Count unread messages - GUNAKAN chatMessage (camelCase untuk Prisma client)
    const unreadCount = await prisma.chatMessage.count({
      where: {
        chat: {
          OR: [{ userId }, { superAdminId: userId }],
        },
        senderId: {
          not: userId,
        },
        isRead: false,
      },
    })

    res.status(200).json({ success: true, data: { unreadCount } })
  } catch (error) {
    console.error("Error getting unread count:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get unread message count",
    })
  }
}
