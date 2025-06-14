"use client"

import { ArrowLeft, Menu, ShoppingCart, User, ShoppingBag, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import { useChatStore } from "@/store/useChatStore"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"
import { useEffect, useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import Image from "next/image"
import logo from "../../../public/images/logo.webp"
import { useToast } from "@/hooks/use-toast"
import ChatPopup from "../chat/ChatPopup"

const navItems = [
  {
    title: "HOME",
    to: "/",
  },
  {
    title: "PRODUCTS",
    to: "/listing",
  },
  {
    title: "ABOUT US",
    to: "/about",
  },
]

function Header() {
  const { user, logout } = useAuthStore()
  const { toggleChat, unreadCount, fetchUnreadCount, initializeSocket } = useChatStore()
  const router = useRouter()
  const { toast } = useToast()
  const [mobileView, setMobileView] = useState<"menu" | "account">("menu")
  const [showSheetDialog, setShowSheetDialog] = useState(false)
  const { fetchCart, items } = useCartStore()

  // ✅ Hanya fetch cart dan initialize chat jika user sudah login
  useEffect(() => {
    if (user) {
      fetchCart()
      initializeSocket()
      fetchUnreadCount()

      // Poll untuk unread messages setiap 30 detik
      const interval = setInterval(() => {
        fetchUnreadCount()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [user, fetchCart, fetchUnreadCount, initializeSocket])

  async function handleLogout() {
    try {
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
        variant: "default",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  // === Mobile View Menu Items ===
  const renderMobileMenuItems = () => {
    if (!user) {
      // User belum login - hanya tampilkan tombol Login dan menu navigasi
      return (
        <div className="space-y-2 py-2">
          <div>
            {navItems.map((navItem) => (
              <p
                className="block w-full font-semibold text-xs py-2 cursor-pointer hover:text-red-600"
                onClick={() => {
                  setShowSheetDialog(false)
                  router.push(navItem.to)
                }}
                key={navItem.title}
              >
                {navItem.title}
              </p>
            ))}
          </div>
          <Button
            onClick={() => {
              setShowSheetDialog(false)
              router.push("/auth/login")
            }}
            className="w-full bg-red-600 hover:bg-red-900"
          >
            Login
          </Button>
        </div>
      )
    }

    // User sudah login - tampilkan menu account dan logout
    switch (mobileView) {
      case "account":
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <Button onClick={() => setMobileView("menu")} className="bg-black text-red-600 mt-2 ">
                <ArrowLeft />
              </Button>
            </div>
            <nav className="space-y-2">
              <p
                onClick={() => {
                  setShowSheetDialog(false)
                  router.push("/account")
                }}
                className="block cursor-pointer w-full py-2 hover:underline"
              >
                Your Account
              </p>
              <Button
                onClick={() => {
                  setShowSheetDialog(false)
                  setMobileView("menu")
                  handleLogout()
                }}
                className="w-full bg-red-600 hover:bg-red-900"
              >
                Logout
              </Button>
            </nav>
          </div>
        )

      default:
        return (
          <div className="space-y-2 py-2">
            <div>
              {navItems.map((navItem) => (
                <p
                  className="block w-full font-semibold text-sm p-2 cursor-pointer hover:text-red-600"
                  onClick={() => {
                    setShowSheetDialog(false)
                    router.push(navItem.to)
                  }}
                  key={navItem.title}
                >
                  {navItem.title}
                </p>
              ))}
            </div>
            <div className="space-y-2 bg-black">
              <Button
                onClick={() => setMobileView("account")}
                className="w-full justify-start border-2 border-red-600 bg-black"
              >
                <User className="mr-1 h-4 w-4" />
                Account
              </Button>
              <Button
                onClick={() => {
                  setShowSheetDialog(false)
                  router.push("/cart")
                }}
                className="w-full justify-start border-2 border-red-600 bg-black"
              >
                <ShoppingBag className="mr-1 h-4 w-4" />
                Cart
                <span className="text-red-600">({items?.length || 0})</span>
              </Button>
              {/* Hanya tampilkan tombol chat untuk user yang sudah login */}
              {user && (
                <Button
                  onClick={() => {
                    setShowSheetDialog(false)
                    toggleChat()
                  }}
                  className="w-full justify-start border-2 border-red-600 bg-black"
                >
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Chat Support
                  {unreadCount > 0 && <span className="text-red-600">({unreadCount})</span>}
                </Button>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <header className="sticky bg-black text-gray-200 top-0 z-50 shadow-sm border-b border-red-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[55px]">
            <Link href="/">
              <Image
                src={logo || "/placeholder.svg"}
                alt="ISONEDAY Logo"
                width={30}
                height={30}
                className="hover:scale-110 transition-transform duration-200"
              />
            </Link>

            {/* === DESKTOP NAVIGATION === */}
            <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
              <nav className="flex items-center space-x-8">
                {navItems.map((item, index) => (
                  <Link
                    href={item.to}
                    key={index}
                    className="text-xs font-semibold hover:text-red-600 hover:scale-110 transition-all duration-200"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>

            {/* === DESKTOP USER MENU === */}
            <div className="hidden lg:flex items-center space-x-4">
              {!user ? (
                <Button onClick={() => router.push("/auth/login")} className="bg-red-600 text-xs px-3 hover:bg-red-900">
                  Login
                </Button>
              ) : (
                <>
                  {/* Icon Cart */}
                  <div
                    className="relative cursor-pointer hover:text-red-600 hover:scale-110 transition-all duration-200"
                    onClick={() => router.push("/cart")}
                  >
                    <ShoppingCart />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-black text-red-600 font-bold text-sm rounded-full flex items-center justify-center">
                      {items?.length || 0}
                    </span>
                  </div>

                  {/* Chat Button */}
                  <div
                    className="relative cursor-pointer hover:text-red-600 hover:scale-110 transition-all duration-200"
                    onClick={toggleChat}
                  >
                    <MessageCircle />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 text-white font-bold text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <User className="hover:text-red-600 hover:scale-110 transition-all duration-200 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push("/account")}>Your Account</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            {/* === MOBILE MENU === */}
            <div className="lg:hidden">
              <Sheet
                open={showSheetDialog}
                onOpenChange={() => {
                  setShowSheetDialog(false)
                  setMobileView("menu")
                }}
              >
                <Button
                  onClick={() => setShowSheetDialog(!showSheetDialog)}
                  size="icon"
                  variant="ghost"
                  className="hover:text-red-600"
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <SheetContent side="left" className="w-80 bg-black border-r-2 text-gray-200 border-red-600">
                  <SheetHeader>
                    <SheetTitle className="text-gray-200 text-sm border-b-2 border-red-600 pb-2">ISONEDAY</SheetTitle>
                  </SheetHeader>
                  {renderMobileMenuItems()}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Popup */}
      {user && <ChatPopup />}
    </>
  )
}

export default Header
