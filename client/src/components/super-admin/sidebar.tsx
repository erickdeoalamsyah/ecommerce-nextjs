"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Package,
  Settings,
  ShoppingBag,
  MessageCircle,
} from "lucide-react"
import { useChatStore } from "@/store/useChatStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useEffect } from "react"
import { useRouter } from "next/navigation";


interface SuperAdminSidebarProps {
  isOpen: boolean
  toggle: () => void
}

export default function SuperAdminSidebar({ isOpen, toggle }: SuperAdminSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { toggleChat, unreadCount, fetchUnreadCount, initializeSocket } = useChatStore()
  const router = useRouter();
    const { logout } = useAuthStore();

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }

  // Initialize chat for super admin
  useEffect(() => {
    if (user && user.role === "SUPER_ADMIN") {
      initializeSocket()
      fetchUnreadCount()

      // Poll for unread messages every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [user, fetchUnreadCount, initializeSocket])

const navItems = [
  {
    name: "Products",
    icon: Package,
    href: "/super-admin/products/list",
  },
  {
    name: "Add New Product",
    icon: Printer,
    href: "/super-admin/products/add",
  },
  {
    name: "Orders",
    icon: ShoppingBag,
    href: "/super-admin/orders",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/super-admin/settings",
  },
  {
    name: "logout",
    icon: ChevronLeft,
    href: "",
  },
];
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-black text-white transition-all duration-300",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        {isOpen && <h1 className="text-lg">Admin Panel</h1>}
        <button onClick={toggle} className="rounded-full p-1 hover:bg-gray-800">
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <nav className="flex flex-col p-2 text-xs">
        {navItems.map((item) => (
          <Link
          onClick={
              item.name === "logout"
                ? handleLogout
                : () => router.push(item.href)
            }
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 transition-colors",
              pathname === item.href ? "text-red-600 " : "hover:bg-gray-900",
              !isOpen && "justify-center",
            )}
          >
            <item.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
            {isOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Chat Button - Simple di pojok kiri bawah */}
      <div className="absolute bottom-70 left-5">
        <button
          onClick={toggleChat}
          className="relative flex items-center justify-center rounded-full  shadow-lg transition-all hover:scale-105"
          title="Customer Chat"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
