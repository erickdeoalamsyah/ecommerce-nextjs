// "use client"

// import Link from "next/link"
// import Image from "next/image"
// import { Instagram, Youtube } from "lucide-react"
// import logo from "../../../public/images/logo.webp"

// function Footer() {
//   return (
//     <footer className="bg-black text-gray-200 border-t-2 border-red-600 ">
//       <div className="px-4 md:px-10 pt-10 grid grid-cols-3 lg:grid-cols-4 gap-10">
//         {/* Logo & About */}
//         <div>
//           <Link href="/" className="inline-block mb-4">
//             <Image src={logo} alt="ISONEDAY Logo" width={40} height={40} />
//           </Link>
          
//         </div>

//         {/* Navigasi */}
//         <div>
//           <h3 className="text-xs font-semibold text-red-600 mb-4 uppercase">
//             Navigasi
//           </h3>
//           <ul className="space-y-2 text-xs">
//             <li><Link href="/" className="hover:text-red-600">Home</Link></li>
//             <li><Link href="/listing" className="hover:text-red-600">Products</Link></li>
//             <li><Link href="/about" className="hover:text-red-600">About Us</Link></li>
//           </ul>
//         </div>

//         {/* Bantuan */}
//         <div>
//           <h3 className="text-xs font-semibold text-red-600 mb-4 uppercase">
//             Bantuan
//           </h3>
//           <ul className="space-y-2 text-xs">
//             <li><Link href="/faq" className="hover:text-red-600">FAQ</Link></li>
//             <li><Link href="/support" className="hover:text-red-600">Customer Support</Link></li>
//             <li><Link href="/returns" className="hover:text-red-600">Pengembalian</Link></li>
//             <li><Link href="/terms" className="hover:text-red-600">Syarat & Ketentuan</Link></li>
//           </ul>
//         </div>

//         {/* Social Media */}
//         <div>
//           <h3 className="text-xs font-semibold text-red-600 mb-4 uppercase">
//             Ikuti Kami
//           </h3>
//           <div className="flex space-x-4">
//             <Link href="#" className="hover:text-red-600"><Instagram size={20} /></Link>
//             <Link href="#" className="hover:text-red-600"><Youtube size={20} /></Link>
//           </div>
//         </div>
//       </div>

//       <div className="border-t border-red-600 mt-10 py-6 text-center text-xs text-gray-200">
//         © {new Date().getFullYear()} ISONEDAY. All rights reserved.
//       </div>
//     </footer>
//   )
// }

// export default Footer
"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react"
import { FaTiktok } from "react-icons/fa";
import logo from "../../../public/images/logo.webp"

function Footer() {

  const currentYear = new Date().getFullYear()

  const navigationLinks = [
    { title: "Home", href: "/" },
    { title: "Products", href: "/listing" },
    { title: "About Us", href: "/about" },
  ]

  const supportLinks = [
    { title: "FAQ", href: "/faq" },
    { title: "Customer Support", href: "/support" },
    { title: "Shipping Info", href: "/shipping" },
    { title: "Returns & Exchanges", href: "/returns" },
    { title: "Size Guide", href: "/size-guide" },
  ]

  const legalLinks = [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Cookie Policy", href: "/cookies" },
    { title: "Refund Policy", href: "/refund" },
  ]

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/isoneday.studio/", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/isoneday", label: "YouTube" },
    { icon: FaTiktok, href: "https://www.tiktok.com/@isoneday.studios", label: "Tiktok"}
  ]

  return (
    <footer className="bg-black text-gray-200 border-t border-red-600">
      <div className="px-4 md:px-10 py-12">
        {/* Main Footer Content */}
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Newsletter - Takes 2 columns on xl screens */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-2">
            {/* Logo & Brand */}
            <div>
              <Link href="/" className="inline-block mb-4 group">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="ISONEDAY Logo"
                  width={50}
                  height={50}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </Link>
              
            </div>
            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">Kontak</h3>
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-red-600" />
                  <span>+62 812-3456-789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-red-600" />
                  <span>isoneday.studio@gmail.com</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                  <span>
                    Bandung City
                    <br />
                    East Java, Indonesia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">Navigasi</h3>
            <ul className="space-y-1">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-300 hover:text-red-600 transition-colors duration-200 hover:scale-105 inline-block"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">Bantuan</h3>
            <ul className="space-y-1">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-300 hover:text-red-600 transition-colors duration-200 hover:scale-105 inline-block"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-6">
            {/* Legal Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">Legal</h3>
              <ul className="space-y-1">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-300 hover:text-red-600 transition-colors duration-200 hover:scale-105 inline-block"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">Ikuti Kami</h3>
              <div className="flex flex-wrap gap-1">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-gray-200 hover:text-red-600 transition-all duration-300 hover:scale-105 group"
                      aria-label={social.label}
                    >
                      <IconComponent className="h-5 w-5" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Certifications */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-300 mb-5">Metode Pembayaran Aman</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Mandiri", "Shopeepay", "GoPay", "DANA", "SeaBank"].map((payment) => (
                  <div
                    key={payment}
                    className="px-3 py-2 rounded text-xs text-gray-200 border border-red-600"
                  >
                    {payment}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-red-600 ">
        <div className="px-4 md:px-10 py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="text-xs text-gray-200 text-center">
              © {currentYear} ISONEDAY. All rights reserved.
              <span className="hidden sm:inline"> | Designed with </span>
              <Heart className="inline h-3 w-3 text-red-600 mx-1" />
              <span className="hidden sm:inline"> in Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
