"use client"

import { useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { useChatStore } from "@/store/useChatStore"
import { useAuthStore } from "@/store/useAuthStore"

export default function ChatButton() {
  const { user } = useAuthStore()
  const { toggleChat, unreadCount, fetchUnreadCount, initializeSocket, isChatOpen } = useChatStore()

  useEffect(() => {
    if (user) {
      initializeSocket()
      fetchUnreadCount()

      // Poll for unread messages every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [user, fetchUnreadCount, initializeSocket])

  // Don't show chat button for non-logged in users
  if (!user) return null

  return (
    <button
      onClick={toggleChat}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full p-4 shadow-lg transition-all ${
        isChatOpen ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
      }`}
      aria-label="Chat with support"
    >
      <MessageCircle className="h-6 w-6 text-white" data-testid="chat-icon" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {unreadCount}
        </span>
      )}
    </button>
  )
}
