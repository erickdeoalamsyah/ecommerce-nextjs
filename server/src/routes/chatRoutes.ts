import express from "express"
import { getChatRooms, createChat, getChatMessages, getUnreadCount } from "../controllers/chatController"
import { authenticateJwt } from "../middleware/authMiddleware"

const router = express.Router()

// All routes require authentication
router.use(authenticateJwt)

// Chat routes with proper typing
router.get("/rooms", getChatRooms)
router.post("/rooms", createChat)
router.get("/rooms/:chatId/messages", getChatMessages)
router.get("/unread", getUnreadCount)

export default router
