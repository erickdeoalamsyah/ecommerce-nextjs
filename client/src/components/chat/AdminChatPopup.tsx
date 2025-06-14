"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { X, Send, Loader2, User } from "lucide-react"
import { useChatStore } from "@/store/useChatStore"
import { useAuthStore } from "@/store/useAuthStore"
import { formatDistanceToNow } from "date-fns"

export default function AdminChatPopup() {
  const { user } = useAuthStore()
  const {
    isChatOpen,
    closeChat,
    chatRooms,
    currentChatId,
    messages,
    isLoading,
    error,
    fetchChatRooms,
    setCurrentChat,
    sendMessage,
    isTyping,
    setTyping,
  } = useChatStore()

  const [messageInput, setMessageInput] = useState("")
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Fetch chat rooms when component mounts
  useEffect(() => {
    if (isChatOpen && user && user.role === "SUPER_ADMIN") {
      fetchChatRooms()
    }
  }, [isChatOpen, user, fetchChatRooms])

  // Handle chat selection
  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId)
    setCurrentChat(chatId)
  }

  // Handle message input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value)
    setTyping(true)
  }

  // Handle message submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    await sendMessage(messageInput)
    setMessageInput("")
  }

  // Don't show for non-admin users
  if (!isChatOpen || !user || user.role !== "SUPER_ADMIN") return null

  return (
    <div className="fixed bottom-6 left-20 z-50 flex h-[600px] w-[800px] rounded-lg bg-gray-900 shadow-xl border border-gray-700">
      {/* Chat List Sidebar */}
      <div className="w-1/3 border-r border-gray-500">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-500 p-4">
          <h3 className="font-semibold text-sm text-white">Customer Chats</h3>
          <button onClick={closeChat} className="rounded-full p-1 hover:bg-gray-800 text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto h-[calc(100%-57px)] text-sm">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : chatRooms.length === 0 ? (
            <div className="p-4 text-gray-400">No active chats</div>
          ) : (
            <div>
              {chatRooms.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`w-full p-3 text-left border-b border-gray-800 hover:bg-gray-800 transition-colors ${
                    selectedChatId === chat.id ? "bg-gray-800" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium text-white truncate">
                        {chat.user?.name || chat.user?.email || "Customer"}
                      </span>
                    </div>
                    {chat._count.messages > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                        {chat._count.messages}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center text-sm text-gray-400">
                    <span
                      className={`h-2 w-2 rounded-full mr-2 ${chat.isUserOnline ? "bg-green-500" : "bg-gray-500"}`}
                    ></span>
                    <span>{chat.isUserOnline ? "Online" : "Offline"}</span>
                  </div>

                  {chat.messages[0] && (
                    <div className="mt-1">
                      <p className="text-sm truncate text-gray-300">{chat.messages[0].content}.......</p>
                      <p className="text-xs text-gray-300 mt-2">
                        {formatDistanceToNow(new Date(chat.messages[0].createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col">
        {!selectedChatId ? (
          <div className="flex h-full items-center justify-center text-gray-200 text-sm">
            <p>Select a chat to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-700 p-5">
              <h3 className="font-semibold text-white text-sm">
                {chatRooms.find((c) => c.id === selectedChatId)?.user?.name ||
                  chatRooms.find((c) => c.id === selectedChatId)?.user?.email ||
                  "Customer"}
              </h3>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 text-xs">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : error ? (
                <div className="flex h-full items-center justify-center text-red-500">{error}</div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
                  <p>No messages yet</p>
                  <p className="mt-2 text-sm">Send a message to start the conversation</p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === user.id ? "bg-red-600 text-white" : "bg-gray-800 text-white"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`mt-1 text-right text-xs ${
                            message.senderId === user.id ? "text-red-200" : "text-gray-400"
                          }`}
                        >
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[70%] rounded-lg bg-gray-800 p-3 text-white">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={messageInput}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="flex-1 text-xs rounded-l-lg border border-gray-600 bg-gray-800 p-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="rounded-r-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:bg-red-900 "
                >
                  <Send className="h-4 w-5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
