"use client"

import Link from "next/link"
import { useEffect, useRef, useCallback, useState } from "react"
import { motion } from "framer-motion"
import { Instagram, ExternalLink } from "lucide-react"
import Image, { type StaticImageData } from "next/image"
import React from "react"

// Import images
import art1 from "../../../public/images/art1.webp"
import art2 from "../../../public/images/art2.webp"
import art3 from "../../../public/images/art3.webp"
import art4 from "../../../public/images/art4.webp"
import art5 from "../../../public/images/art5.webp"
import art6 from "../../../public/images/art6.webp"
import art7 from "../../../public/images/art7.webp"
import art8 from "../../../public/images/art8.webp"
import art9 from "../../../public/images/art9.webp"
import art10 from "../../../public/images/art10.webp"
import art11 from "../../../public/images/art11.webp"

// TypeScript interfaces
interface ArtItem {
  id: number
  name: string
  image: StaticImageData
  alt?: string
}

// Art data with proper typing
const artItems: ArtItem[] = [
  { id: 1, name: "Art1", image: art1, alt: "Creative artwork showcasing modern design" },
  { id: 2, name: "Art2", image: art2, alt: "Abstract art piece with vibrant colors" },
  { id: 3, name: "Art3", image: art3, alt: "Contemporary art expression" },
  { id: 4, name: "Art4", image: art4, alt: "Artistic creation with unique style" },
  { id: 5, name: "Art5", image: art5, alt: "Modern art interpretation" },
  { id: 6, name: "Art6", image: art6, alt: "Creative visual artwork" },
  { id: 7, name: "Art7", image: art7, alt: "Artistic design with bold elements" },
  { id: 8, name: "Art8", image: art8, alt: "Contemporary creative expression" },
  { id: 9, name: "Art9", image: art9, alt: "Modern artistic composition" },
  { id: 10, name: "Art10", image: art10, alt: "Creative art with unique perspective" },
  { id: 11, name: "Art11", image: art11, alt: "Artistic masterpiece with modern touch" },
]

// Animation variants for Framer Motion
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// Memoized Art Item Component
const ArtItemCard = React.memo(({ item, index }: { item: ArtItem; index: number }) => (
  <motion.div
    className="relative flex-shrink-0 w-[50vw] h-[50vw] md:w-72 md:h-72 group cursor-pointer"
    whileHover={{
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeOut" },
    }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    {/* Glassmorphism Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl z-10 flex items-end p-4">
      <div className="text-white">
        <h3 className="text-sm font-semibold mb-1">{item.name}</h3>
        <p className="text-xs text-gray-300 opacity-80">Creative Expression</p>
      </div>
    </div>

    {/* Red border glow effect */}
    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-red-600/50 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-red-600/25"></div>

    <Image
      src={item.image || "/placeholder.svg"}
      alt={item.alt || item.name}
      className="w-full h-full object-cover rounded-xl transition-all duration-500 group-hover:brightness-110"
      quality={85}
      sizes="(max-width: 768px) 50vw, 288px"
      placeholder="blur"
    />

    {/* Floating Instagram Icon */}
    <div className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
      <Instagram className="w-4 h-4 text-white" />
    </div>
  </motion.div>
))

ArtItemCard.displayName = "ArtItemCard"

// Custom hook for auto-scroll functionality
const useAutoScroll = (scrollRef: React.RefObject<HTMLDivElement | null>) => {
  const [isScrolling, setIsScrolling] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startScroll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      if (scrollRef.current && isScrolling && scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current

        if (scrollLeft >= scrollWidth - clientWidth) {
          scrollRef.current.scrollLeft = 0
        } else {
          scrollRef.current.scrollLeft += 1
        }
      }
    }, 30)
  }, [scrollRef, isScrolling])

  const stopScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsScrolling(false)
    stopScroll()
  }, [stopScroll])

  const handleMouseLeave = useCallback(() => {
    setIsScrolling(true)
    startScroll()
  }, [startScroll])

  useEffect(() => {
    startScroll()
    return () => stopScroll()
  }, [startScroll, stopScroll])

  return { handleMouseEnter, handleMouseLeave }
}

// Main Art Component
const Art: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { handleMouseEnter, handleMouseLeave } = useAutoScroll(scrollRef)

  return (
    <section className="relative text-gray-300 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden py-20 border-t border-red-600">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full sm:px-4 md:px-0">
        {/* Header Section */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 lg:gap-12 py-12 mb-16 px-4 md:px-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Left side - Heading */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-6 justify-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-semibold leading-tight">
              JOIN US ON <span className="text-red-700 ">INSTAGRAM</span>
            </h2>
            <div className="inline-flex items-center gap-2 bg-red-600/10 backdrop-blur-sm border border-red-600/20 rounded-full px-4 py-2 mb-6 w-fit">
              <Instagram className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">FOLLOW US</span>
            </div>
          </motion.div>

          {/* Right side - Text and Button */}
          <motion.div variants={fadeInUp} className="flex flex-col justify-center space-y-6">
            <p className="text-gray-200 text-xs md:text-lg leading-relaxed">
              Discover the Art, Live the Culture. At <span className="text-red-600 font-semibold">Isoneday</span>, every
              piece tells a story of rebellion, passion, and creativity. Join our journey and express your identity
              through art and style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://www.instagram.com/isoneday.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full text-xs font-semibold transform  transition-all duration-300 w-fit"
              >
                <Instagram className="w-5 h-5" />
                <span>FOLLOW NOW</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Updates Daily</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative border-y border-red-600 "
        >
          <div className="text-center py-16 md:px-0  ">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 uppercase">
              Our <span className="text-red-600">Creative</span> Gallery
            </h3>
            <p className="text-gray-400 text-sm">Swipe through our latest artistic creations</p>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden overflow-y-hidden cursor-grab active:cursor-grabbing select-none scrollbar-none  pb-16"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={
              {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              } as React.CSSProperties & {
                WebkitScrollbar?: { display: string }
              }
            }
          >
            {artItems.map((artItem, index) => (
              <ArtItemCard key={artItem.id} item={artItem} index={index} />
            ))}

            {/* Duplicate items for seamless loop */}
            {artItems.map((artItem, index) => (
              <ArtItemCard key={`duplicate-${artItem.id}`} item={artItem} index={index} />
            ))}
          </div>

          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black via-black/50 to-transparent pointer-events-none z-10"></div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-200 text-sm mb-4">Want to see more? Follow us for daily inspiration</p>
          <div className="flex justify-center items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-red-600 rounded-full border-2 border-black flex items-center justify-center"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </div>
              ))}
            </div>
            <span className="text-gray-500 text-sm ml-2">+2k followers</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default React.memo(Art)
