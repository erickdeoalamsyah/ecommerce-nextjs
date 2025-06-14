"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { X, Send, Loader2 } from "lucide-react"
import { useChatStore } from "@/store/useChatStore"
import { useAuthStore } from "@/store/useAuthStore"
import { formatDistanceToNow } from "date-fns"

export default function ChatPopup() {
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
    createChat,
    setCurrentChat,
    sendMessage,
    isTyping,
    setTyping,
  } = useChatStore()

  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Fetch chat rooms when component mounts
  useEffect(() => {
    if (isChatOpen && user) {
      fetchChatRooms()
    }
  }, [isChatOpen, user, fetchChatRooms])

  // Initialize chat if no current chat
  useEffect(() => {
    const initializeChat = async () => {
      if (isChatOpen && user && chatRooms.length === 0 && !isLoading) {
        // Create a new chat
        const chatId = await createChat()
        if (chatId) {
          setCurrentChat(chatId)
        }
      } else if (isChatOpen && user && chatRooms.length > 0 && !currentChatId) {
        // Select first chat
        setCurrentChat(chatRooms[0].id)
      }
    }

    initializeChat()
  }, [isChatOpen, user, chatRooms, currentChatId, isLoading, createChat, setCurrentChat])

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

  if (!isChatOpen || !user) return null

  return (
    <div className="fixed bottom-2 right-6 z-50 flex h-[500px] w-[350px] flex-col rounded-lg bg-gray-900 shadow-xl text-gray-200">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">Chat</h3>
        <button onClick={closeChat} className="rounded-full p-1 hover:text-red-600" aria-label="Close chat">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
            <p>Welcome to customer support!</p>
            <p className="mt-2 text-xs">Send a message to get started.</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex text-sm ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === user.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`mt-2 text-right text-xs font-semibold ${
                      message.senderId === user.id ? "text-gray-800" : "text-gray-800"
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-lg bg-gray-100 p-3 text-gray-800">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
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
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 text-sm text-gray-800 rounded-l-lg border border-r-0 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="rounded-r-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:bg-blue-600"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
