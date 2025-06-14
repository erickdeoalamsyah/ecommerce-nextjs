"use client"

import type React from "react"

import SuperAdminSidebar from "@/components/super-admin/sidebar"
import AdminChatPopup from "@/components/chat/AdminChatPopup"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { OrderNotification } from "@/components/notif/OrderNotification"

function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-black">
      <SuperAdminSidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={cn("transition-all duration-300", isSidebarOpen ? "ml-64" : "ml-16", "min-h-screen")}>
        {children}
      </div>
      <OrderNotification/>
      {/* Admin Chat Popup */}
      <AdminChatPopup />
    </div>
  )
}

export default SuperAdminLayout
