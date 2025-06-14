import { create } from "zustand"
import { io, type Socket } from "socket.io-client"
import axios from "axios"
import { API_ROUTES } from "@/utils/api"
import { useAuthStore } from "./useAuthStore"

// Types
export type ChatMessage = {
  id: string
  chatId: string
  senderId: string
  content: string
  isRead: boolean
  createdAt: string
  sender: {
    id: string
    name: string | null
    email: string
    role: string
  }
}

export type ChatRoom = {
  id: string
  userId: string
  superAdminId: string
  isActive: boolean
  lastMessageAt: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string | null
    email: string
  }
  superAdmin?: {
    id: string
    name: string | null
    email: string
  }
  messages: ChatMessage[]
  _count: {
    messages: number
  }
  isUserOnline?: boolean
  isAdminOnline?: boolean
}

type ChatState = {
  socket: Socket | null
  isConnected: boolean
  chatRooms: ChatRoom[]
  currentChatId: string | null
  messages: ChatMessage[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  isChatOpen: boolean
  isTyping: boolean

  // Actions
  initializeSocket: () => void
  disconnectSocket: () => void
  fetchChatRooms: () => Promise<void>
  fetchMessages: (chatId: string) => Promise<void>
  sendMessage: (content: string) => Promise<void>
  createChat: () => Promise<string | null>
  setCurrentChat: (chatId: string | null) => void
  fetchUnreadCount: () => Promise<void>
  toggleChat: () => void
  closeChat: () => void
  openChat: () => void
  setTyping: (isTyping: boolean) => void
}

const axiosInstance = axios.create({
  baseURL: API_ROUTES.CHAT,
  withCredentials: true,
})

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  isConnected: false,
  chatRooms: [],
  currentChatId: null,
  messages: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  isChatOpen: false,
  isTyping: false,

  // Initialize WebSocket connection
  initializeSocket: () => {
    // ✅ CEK USER LOGIN DULU
    const user = useAuthStore.getState().user
    if (!user) {
      console.log("Cannot initialize socket: User not logged in")
      return
    }

    const { socket } = get()

    // Don't create a new socket if one already exists
    if (socket) return

    const newSocket = io(API_ROUTES.WEBSOCKET, {
      withCredentials: true,
    })

    newSocket.on("connect", () => {
      console.log("Socket connected")
      set({ isConnected: true })
    })

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected")
      set({ isConnected: false })
    })

    newSocket.on("message_received", (message: ChatMessage) => {
      const { currentChatId, messages } = get()

      // If this message belongs to current chat, add it to messages
      if (message.chatId === currentChatId) {
        set({ messages: [...messages, message] })
      }

      // Update unread count
      get().fetchUnreadCount()

      // Update chat rooms to reflect new message
      get().fetchChatRooms()
    })

    newSocket.on("user_typing", ({ userId }: { userId: string }) => {
      // Only show typing indicator if it's not the current user
      if (userId !== useAuthStore.getState().user?.id) {
        set({ isTyping: true })

        // Clear typing indicator after 3 seconds
        setTimeout(() => {
          set({ isTyping: false })
        }, 3000)
      }
    })

    newSocket.on("error", (error: string) => {
      console.error("Socket error:", error)
      set({ error })
    })

    set({ socket: newSocket })
  },

  // Disconnect WebSocket
  disconnectSocket: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  // Fetch chat rooms
  fetchChatRooms: async () => {
    // ✅ CEK USER LOGIN DULU
    const user = useAuthStore.getState().user
    if (!user) {
      console.log("Cannot fetch chat rooms: User not logged in")
      return
    }

    try {
      set({ isLoading: true, error: null })
      const response = await axiosInstance.get("/rooms")
      set({ chatRooms: response.data.data, isLoading: false })
    } catch (error) {
      console.error("Error fetching chat rooms:", error)
      set({
        isLoading: false,
        error: "Failed to fetch chat rooms",
      })
    }
  },

  // Fetch messages for a chat
  fetchMessages: async (chatId: string) => {
    // ✅ CEK USER LOGIN DULU
    const user = useAuthStore.getState().user
    if (!user) {
      console.log("Cannot fetch messages: User not logged in")
      return
    }

    try {
      set({ isLoading: true, error: null })

      // Join chat room via socket
      const { socket } = get()
      if (socket) {
        socket.emit("join_chat", chatId)
      }

      const response = await axiosInstance.get(`/rooms/${chatId}/messages`)
      set({
        messages: response.data.data,
        currentChatId: chatId,
        isLoading: false,
      })

      // Update unread count after reading messages
      get().fetchUnreadCount()
    } catch (error) {
      console.error("Error fetching messages:", error)
      set({
        isLoading: false,
        error: "Failed to fetch messages",
      })
    }
  },

  // Send a message
  sendMessage: async (content: string) => {
    // ✅ CEK USER LOGIN DULU
    const user = useAuthStore.getState().user
    if (!user) {
      console.log("Cannot send message: User not logged in")
      return
    }

    try {
      const { socket, currentChatId } = get()

      if (!socket || !currentChatId) {
        throw new Error("Socket not connected or no chat selected")
      }

      // Emit message via socket
      socket.emit("send_message", {
        chatId: currentChatId,
        content,
      })
    } catch (error) {
      console.error("Error sending message:", error)
      set({ error: "Failed to send message" })
    }
  },

  // Create a new chat
  createChat: async () => {
    // ✅ CEK USER LOGIN DULU
    const user = useAuthStore.getState().user
    if (!user) {
      console.log("Cannot create chat: User not logged in")
      return null
    }

    try {
      set({ isLoading: true, error: null })
      const response = await axiosInstance.post("/rooms")
      const newChat = response.data.data

      // Update chat rooms
      await get().fetchChatRooms()

      set({ isLoading: false })
      return newChat.id
    } catch (error) {
      console.error("Error creating chat:", error)
      set({
        isLoading: false,
        error: "Failed to create chat",
      })
      return null
    }
  },

  // Set current chat
  setCurrentChat: (chatId: string | null) => {
    set({ currentChatId: chatId })

    if (chatId) {
      get().fetchMessages(chatId)
    }
  },

  // Fetch unread message count
  fetchUnreadCount: async () => {
    // ✅ CEK USER LOGIN DULU
    const user = useAuthStore.getState().user
    if (!user) {
      console.log("Cannot fetch unread count: User not logged in")
      set({ unreadCount: 0 }) // Reset ke 0 jika belum login
      return
    }

    try {
      const response = await axiosInstance.get("/unread")
      set({ unreadCount: response.data.data.unreadCount })
    } catch (error) {
      console.error("Error fetching unread count:", error)
      set({ unreadCount: 0 }) // Reset ke 0 jika error
    }
  },

  // Toggle chat open/close
  toggleChat: () => {
    // ✅ CEK USER LOGIN DULU
    const user = useAuthStore.getState().user
    if (!user) {
      console.log("Cannot toggle chat: User not logged in")
      return
    }

    const { isChatOpen } = get()
    set({ isChatOpen: !isChatOpen })
  },

  // Close chat
  closeChat: () => {
    set({ isChatOpen: false })
  },

  // Open chat
  openChat: () => {
    // ✅ CEK USER LOGIN DULU
    const user = useAuthStore.getState().user
    if (!user) {
      console.log("Cannot open chat: User not logged in")
      return
    }

    set({ isChatOpen: true })
  },

  // Set typing indicator
  setTyping: (isTyping: boolean) => {
    // ✅ CEK USER LOGIN DULU
    const user = useAuthStore.getState().user
    if (!user) {
      return
    }

    const { socket, currentChatId } = get()

    if (socket && currentChatId && isTyping) {
      socket.emit("typing", currentChatId)
    }
  },
}))
