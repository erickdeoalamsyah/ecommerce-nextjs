// "use client"

// import {
//   ArrowLeft,
//   Menu,
//   ShoppingCart,
//   User,
//   MessageCircle,
// } from "lucide-react"
// import Link from "next/link"
// import { useRouter, usePathname } from "next/navigation"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu"
// import { Button } from "../ui/button"
// import { useAuthStore } from "@/store/useAuthStore"
// import { useChatStore } from "@/store/useChatStore"
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "../ui/sheet"
// import { useEffect, useState } from "react"
// import { useCartStore } from "@/store/useCartStore"
// import Image from "next/image"
// import logo from "../../../public/images/logo_isoneday.webp"
// import { useToast } from "@/hooks/use-toast"
// import ChatPopup from "../chat/ChatPopup"
// import clsx from "clsx"

// const navItems = [
//   { title: "HOME", to: "/" },
//   { title: "PRODUCTS", to: "/listing" },

//   { title: "ABOUT", to: "/about" },
// ]

// function Header() {
//   const pathname = usePathname()
//   const { user, logout } = useAuthStore()
//   const {
//     toggleChat,
//     unreadCount,
//     fetchUnreadCount,
//     initializeSocket,
//   } = useChatStore()
//   const router = useRouter()
//   const { toast } = useToast()
//   const [mobileView, setMobileView] = useState<"menu" | "account">("menu")
//   const [showSheetDialog, setShowSheetDialog] = useState(false)
//   const { fetchCart, items } = useCartStore()

//   useEffect(() => {
//     if (user) {
//       fetchCart()
//       initializeSocket()
//       fetchUnreadCount()

//       const interval = setInterval(() => {
//         fetchUnreadCount()
//       }, 30000)
//       return () => clearInterval(interval)
//     }
//   }, [user, fetchCart, fetchUnreadCount, initializeSocket])

//   async function handleLogout() {
//     try {
//       await logout()
//       toast({
//         title: "Logged out successfully",
//         description: "You have been logged out.",
//         variant: "default",
//       })
//       router.push("/")
//     } catch (error) {
//       toast({
//         title: "Logout failed",
//         description: "Please try again later.",
//         variant: "destructive",
//       })
//     }
//   }

//   const renderMobileMenuItems = () => {
//     return (
//       <div className="space-y-2 py-2">
//         <div>
//           {navItems.map((navItem) => (
//             <p
//               className="block w-full text-xs font-semibold py-2 cursor-pointer hover:text-red-600"
//               onClick={() => {
//                 setShowSheetDialog(false)
//                 router.push(navItem.to)
//               }}
//               key={navItem.title}
//             >
//               {navItem.title}
//             </p>
//           ))}
//         </div>
//         {!user ? (
//           <Button
//             onClick={() => {
//               setShowSheetDialog(false)
//               router.push("/auth/login")
//             }}
//             className="w-full bg-red-600 hover:bg-red-900"
//           >
//             Login
//           </Button>
//         ) : (
//           <>
//             <Button
//               onClick={() => {
//                 setShowSheetDialog(false)
//                 router.push("/account")
//               }}
//               className="w-full text-xs bg-black border border-red-600"
//             >
//               <User className="h-4 w-4" />
//               Account
//             </Button>
//             <Button
//               onClick={() => {
//                 setShowSheetDialog(false)
//                 router.push("/cart")
//               }}
//               className="w-full text-xs bg-black border border-red-600"
//             >
//               <ShoppingCart className="h-4 w-4" />
//               Cart ({items?.length || 0})
//             </Button>
//             <Button
//               onClick={() => {
//                 setShowSheetDialog(false)
//                 toggleChat()
//               }}
//               className="w-full text-xs bg-black border border-red-600"
//             >
//               <MessageCircle className="h-4 w-4" />
//               Chat
//               {unreadCount > 0 && (
//                 <span className="text-red-600"> ({unreadCount})</span>
//               )}
//             </Button>
//             <Button
//               onClick={() => {
//                 setShowSheetDialog(false)
//                 setMobileView("menu")
//                 handleLogout()
//               }}
//               className="w-full bg-red-600 hover:bg-red-900"
//             >
//               Logout
//             </Button>
//           </>
//         )}
//       </div>
//     )
//   }

//   return (
//     <>
//       <header className="sticky top-0 z-50 w-full bg-black border-b-2 border-red-600 transition-all duration-300">
//         <div className="px-4 md:px-10">
//           {/* MOBILE HEADER */}
//           <div className="flex items-center justify-between h-[55px] lg:hidden">
//             {/* Cart kiri */}
//             <div
//               className="relative cursor-pointer text-gray-200"
//               onClick={() => router.push("/cart")}
//             >
//               <ShoppingCart  className="h-5 w-5"/>
//               <span className="absolute -top-1 -right-2 h-4 w-4 bg-black text-red-600 font-bold text-sm rounded-full flex items-center justify-center">
//                 {items?.length || 0}
//               </span>
//             </div>

//             {/* Logo tengah */}
//             <Link href="/" className="flex items-center justify-center">
//               <Image
//                 src={logo}
//                 alt="ISONEDAY Logo"
//                 width={30}
//                 height={30}
//                 className="hover:scale-110 transition-transform duration-200"
//               />
//             </Link>

//             {/* Hamburger kanan */}
//             <Sheet
//               open={showSheetDialog}
//               onOpenChange={() => {
//                 setShowSheetDialog(false)
//                 setMobileView("menu")
//               }}
//             >
//               <Button
//                 onClick={() => setShowSheetDialog(!showSheetDialog)}
//                 size="icon"
//                 variant="ghost"
//                 className="text-gray-200 hover:text-gray-400"
//               >
//                 <Menu className="h-6 w-6" />
//               </Button>
//               <SheetContent
//                 side="left"
//                 className="w-80 bg-black/70 border-r text-gray-200 border-red-600"
//               >
//                 <SheetHeader>
//                   <SheetTitle className="text-gray-200 text-sm border-b border-red-600 pb-2">
//                     ISONEDAY
//                   </SheetTitle>
//                 </SheetHeader>
//                 {renderMobileMenuItems()}
//               </SheetContent>
//             </Sheet>
//           </div>

//           {/* DESKTOP HEADER */}
//           <div className="hidden lg:flex items-center justify-between h-[55px] ">
//             <Link href="/">
//               <Image
//                 src={logo}
//                 alt="ISONEDAY Logo"
//                 width={30}
//                 height={30}
//                 className="hover:scale-110 transition-transform duration-200"
//               />
//             </Link>

//             <div className="flex items-center space-x-6 text-xs uppercase ml-auto">
//               {/* NAV */}
//               {navItems.map((item, index) => (
//                 <Link
//                   key={index}
//                   href={item.to}
//                   className={clsx(
//                     "text-red-600 hover:text-red-800 font-semibold transition-all tracking-wide",
//                     pathname === item.to ? "underline underline-offset-4" : ""
//                   )}
//                 >
//                   {item.title}
//                 </Link>
//               ))}

//               {/* Separator */}
//               <span className="text-red-600">|</span>

//               {/* Chat */}
//               <div
//                 className="relative cursor-pointer text-red-600 hover:text-red-800"
//                 onClick={toggleChat}
//               >
//                 <MessageCircle  className="h-5 w-5"/>
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-2 h-4 w-4 bg-red-600 text-white font-bold text-xs rounded-full flex items-center justify-center">
//                     {unreadCount}
//                   </span>
//                 )}
//               </div>

//               {/* Cart */}
//               <div
//                 className="relative cursor-pointer text-red-600 hover:text-red-800"
//                 onClick={() => router.push("/cart")}
//               >
//                 <ShoppingCart className="h-5 w-5"/>
//                 <span className="absolute -top-1 -right-2 h-4 w-4 bg-red-600 text-white font-bold text-xs rounded-full flex items-center justify-center">
//                   {items?.length || 0}
//                 </span>
//               </div>

//               {/* Account */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger className="text-red-600 hover:text-red-800">
//                   <User className="h-5 w-5"/>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   {!user ? (
//                     <DropdownMenuItem
//                       onClick={() => router.push("/auth/login")}
//                     >
//                       Login
//                     </DropdownMenuItem>
//                   ) : (
//                     <>
//                       <DropdownMenuItem
//                         onClick={() => router.push("/account")}
//                       >
//                         Your Account
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={handleLogout}>
//                         Logout
//                       </DropdownMenuItem>
//                     </>
//                   )}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>
//       </header>

//       {user && <ChatPopup />}
//     </>
//   )
// }

// export default Header


"use client"

import { Menu, ShoppingCart, User, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import { useChatStore } from "@/store/useChatStore"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"
import { useEffect, useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import Image from "next/image"
import logo from "../../../public/images/logo_white.webp"
import logoDesk from "../../../public/images/logo_red.webp"
import { useToast } from "@/hooks/use-toast"
import ChatPopup from "../chat/ChatPopup"
import clsx from "clsx"

const navItems = [
  { title: "HOME", to: "/" },
  { title: "PRODUCTS", to: "/listing" },
  { title: "ABOUT", to: "/about" },
]

function Header() {
  const pathname = usePathname()
  const { user, logout, isLoading } = useAuthStore()
  const { toggleChat, unreadCount, fetchUnreadCount, initializeSocket } = useChatStore()
  const router = useRouter()
  const { toast } = useToast()
  const [mobileView, setMobileView] = useState<"menu" | "account">("menu")
  const [showSheetDialog, setShowSheetDialog] = useState(false)
  const { fetchCart, items } = useCartStore()

  // State untuk menghindari flash content
  const [isInitialized, setIsInitialized] = useState(false)

  // Cek apakah user benar-benar sudah login
  const isAuthenticated = user && user.id && !isLoading

  useEffect(() => {
    // Set initialized setelah auth store selesai loading
    if (!isLoading) {
      setIsInitialized(true)
    }
  }, [isLoading])

  useEffect(() => {
    // Hanya fetch data jika user benar-benar sudah login
    if (isAuthenticated) {
      fetchCart()
      initializeSocket()
      fetchUnreadCount()

      const interval = setInterval(() => {
        fetchUnreadCount()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [isAuthenticated, fetchCart, fetchUnreadCount, initializeSocket])

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

  const renderMobileMenuItems = () => {
    return (
      <div className="space-y-2 py-2">
        <div>
          {navItems.map((navItem) => (
            <p
              className="block w-full text-xs font-semibold py-2 cursor-pointer hover:text-red-600"
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

        {/* Tampilkan loading state atau kondisi berdasarkan auth status */}
        {!isInitialized ? (
          <div className="w-full py-2 text-center text-xs text-gray-400">Loading...</div>
        ) : !isAuthenticated ? (
          <Button
            onClick={() => {
              setShowSheetDialog(false)
              router.push("/auth/login")
            }}
            className="w-full bg-red-600 hover:bg-red-900"
          >
            Login
          </Button>
        ) : (
          <>
            <Button
              onClick={() => {
                setShowSheetDialog(false)
                router.push("/account")
              }}
              className="w-full text-xs bg-black border border-red-600"
            >
              <User className="h-4 w-4" />
              Account
            </Button>
            <Button
              onClick={() => {
                setShowSheetDialog(false)
                router.push("/cart")
              }}
              className="w-full text-xs bg-black border border-red-600"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart ({items?.length || 0})
            </Button>
            <Button
              onClick={() => {
                setShowSheetDialog(false)
                toggleChat()
              }}
              className="w-full text-xs bg-black border border-red-600"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
              {unreadCount > 0 && <span className="text-red-600"> ({unreadCount})</span>}
            </Button>
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
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-black border-b border-red-600 transition-all duration-300">
        <div className="px-4 md:px-10">
          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between h-[55px] lg:hidden">
            {/* Cart kiri - hanya tampil jika user sudah login */}
            {isAuthenticated ? (
              <div className="relative cursor-pointer text-gray-200" onClick={() => router.push("/cart")}>
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-2 h-4 w-4 bg-black text-red-600 font-bold text-sm rounded-full flex items-center justify-center">
                  {items?.length || 0}
                </span>
              </div>
            ) : (
              <div className="w-5 h-5" /> // Placeholder untuk menjaga layout
            )}

            {/* Logo tengah */}
            <Link href="/" className="flex items-center justify-center">
              <Image
                src={logo || "/placeholder.svg"}
                alt="ISONEDAY Logo"
                width={90}
                height={90}
                className="hover:scale-110 transition-transform duration-200"
              />
            </Link>

            {/* Hamburger kanan */}
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
                className="text-gray-200 hover:text-gray-400"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <SheetContent side="left" className="w-80 bg-black/70 border-r text-gray-200 border-red-600">
                <SheetHeader>
                  <SheetTitle className="text-gray-200 text-sm border-b border-red-600 pb-2">ISONEDAY</SheetTitle>
                </SheetHeader>
                {renderMobileMenuItems()}
              </SheetContent>
            </Sheet>
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden lg:flex items-center justify-between h-[55px]">
            <Link href="/">
              <Image
                src={logoDesk || "/placeholder.svg"}
                alt="ISONEDAY Logo"
                width={110}
                height={110}
                className="hover:scale-110 transition-transform duration-300"
              />
            </Link>

            <div className="flex items-center space-x-6 text-xs uppercase ml-auto">
              {/* NAV */}
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.to}
                  className={clsx(
                    "text-red-600 hover:text-red-800 font-semibold transition-all tracking-wide",
                    pathname === item.to ? "underline underline-offset-4" : "",
                  )}
                >
                  {item.title}
                </Link>
              ))}

              {/* Separator */}
              <span className="text-red-600">|</span>

              {/* Chat - hanya tampil jika user sudah login */}
              {isAuthenticated && (
                <div className="relative cursor-pointer text-red-600 hover:text-red-800" onClick={toggleChat}>
                  <MessageCircle className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 h-4 w-4 bg-red-600 text-white font-bold text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}

              {/* Cart - hanya tampil jika user sudah login */}
              {isAuthenticated && (
                <div
                  className="relative cursor-pointer text-red-600 hover:text-red-800"
                  onClick={() => router.push("/cart")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-2 h-4 w-4 bg-red-600 text-white font-bold text-xs rounded-full flex items-center justify-center">
                    {items?.length || 0}
                  </span>
                </div>
              )}

              {/* Account */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-red-600 hover:text-red-800">
                  <User className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 text-gray-200 border border-red-600">
                  {!isInitialized ? (
                    <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                  ) : !isAuthenticated ? (
                    <DropdownMenuItem onClick={() => router.push("/auth/login")}>Login</DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => router.push("/account")}>Your Account</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* ChatPopup hanya tampil jika user sudah login */}
      {isAuthenticated && <ChatPopup />}
    </>
  )
}

export default Header
