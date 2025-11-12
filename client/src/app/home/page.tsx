"use client";

import { useSettingsStore } from "@/store/useSettingsStore";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import home1 from "../../../public/images/home1_isoneday.webp";
import home2 from "../../../public/images/home2.webp";
import home3 from "../../../public/images/home3_isoneday.webp";
import home4 from "../../../public/images/home4_isoneday .webp";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import Art from "@/components/user/Art";
import React from "react";
import { Star, Sparkles, Zap, Heart, ShoppingBag, Eye } from "lucide-react";

// Static Grid Items with enhanced data
const gridItems = [
  {
    title: "HAT",
    subtitle: "Timeless cool weather",
    image: home2,
    badge: "TRENDING",
    color: "from-red-600 to-orange-600",
  },
  {
    title: "T-SHIRT",
    subtitle: "From world's top designer",
    image: home1,
    badge: "NEW",
    color: "from-red-600 to-pink-600",
  },
  {
    title: "STICKER",
    subtitle: "Everything you need",
    image: home3,
    badge: "LIMITED",
    color: "from-red-600 to-purple-600",
  },
  {
    title: "ACCESSORIES",
    subtitle: "Party season ready",
    image: home4,
    badge: "SALE",
    color: "from-red-600 to-yellow-600",
  },
];

// Enhanced Loading Components with Glassmorphism
const BannerSkeleton = React.memo(() => (
  <div className="relative h-[50vh] sm:h-[60vh] lg:h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
    {/* Floating Geometric Shapes */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-red-600/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-red-600/20 rotate-45 blur-lg animate-pulse delay-500"></div>
    </div>

    <div className="relative z-10 grid grid-cols-5 h-full w-full">
      {/* Left Panel with Diagonal */}
      <div className="col-span-2 h-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-gray-700/30 to-gray-900/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/10 to-transparent animate-pulse duration-2000"></div>
        </div>
        <div className="absolute -right-8 top-0 w-16 h-full bg-gradient-to-r from-transparent to-black transform skew-x-12"></div>
      </div>

      {/* Right Panel */}
      <div className="col-span-3 h-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-gray-800/50 via-gray-700/30 to-gray-900/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-red-600/10 to-transparent animate-pulse duration-2000 delay-500"></div>
        </div>
      </div>
    </div>

    {/* Glassmorphism Loading Card */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-black/20 backdrop-blur-md border border-red-600/30 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-600/50 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-red-400 rounded-full animate-spin mx-auto animate-reverse"></div>
        </div>
        <div className="space-y-2">
          <p className="text-white text-lg font-semibold animate-pulse">
            Crafting Excellence
          </p>
          <p className="text-red-400 text-sm animate-pulse delay-300">
            Loading amazing content...
          </p>
        </div>
      </div>
    </div>
  </div>
));

const ProductSkeleton = React.memo(() => (
  <div className="min-w-[50vw] h-[50vw] md:min-w-[300px] md:h-[300px] xl:min-w-[300px] xl:h-[300px] relative group">
    <div className="w-full h-full p-2 relative overflow-hidden rounded-2xl">
      {/* Glassmorphism Card */}
      <div className="w-full h-full bg-gradient-to-br from-gray-800/40 via-gray-700/20 to-gray-900/40 backdrop-blur-sm border border-red-600/30 rounded-xl relative overflow-hidden">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/20 to-transparent animate-pulse duration-2000"></div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-red-600/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-red-600/10 rounded-full animate-bounce delay-700"></div>
      </div>
    </div>
  </div>
));

// Custom Hook for Scroll Animations
const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
};

// Intersection Observer Hook
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting] as const;
};

// Enhanced Banner Section with Parallax & Diagonal Split
const BannerSection = React.memo(
  ({
    banners,
    currentSlide,
    setCurrentSlide,
  }: {
    banners: any[];
    currentSlide: number;
    setCurrentSlide: (slide: number) => void;
  }) => {
    const groupedBanners = useMemo(() => {
      const result = [];
      for (let i = 0; i < banners.length; i += 2) {
        result.push(banners.slice(i, i + 2));
      }
      return result;
    }, [banners]);

    if (banners.length === 0) {
      return <BannerSkeleton />;
    }

    return (
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-screen w-full overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-red-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/10 rotate-45 blur-xl animate-spin duration-[20s]"></div>
        </div>

        {groupedBanners.map((group, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              currentSlide === index
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <div className="grid grid-cols-5 h-full w-full">
              {/* Left Panel with Diagonal Cut */}
              <div className="col-span-2 h-full relative overflow-hidden group">
                {group[0] && (
                  <>
                    <Image
                      src={group[0].imageUrl || "/placeholder.svg"}
                      alt={`Banner ${index * 2 + 1}`}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      priority={index === 0}
                      quality={90}
                    />
                    {/* Diagonal Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-red-600/20"></div>
                    <div className="absolute -right-8 top-0 w-16 h-full bg-gradient-to-r from-transparent to-black transform skew-x-12 z-10"></div>
                  </>
                )}
              </div>

              {/* Right Panel */}
              <div className="col-span-3 h-full relative overflow-hidden group">
                {group[1] ? (
                  <>
                    <Image
                      src={group[1].imageUrl || "/placeholder.svg"}
                      alt={`Banner ${index * 2 + 2}`}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      priority={index === 0}
                      quality={90}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tl from-black/30 via-transparent to-red-600/10"></div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black"></div>
                )}
              </div>
            </div>

            {/* Floating Brand Message */}
            <div className="absolute inset-x-0 bottom-16 flex items-center justify-center pointer-events-none">
              <div className="bg-black/10 backdrop-blur-md rounded-2xl px-8 py-4 text-center transform hover:scale-105 transition-transform duration-300">
                <h1 className="text-white text-2xl md:text-4xl font-bold mb-2 animate-pulse">
                  ISONEDAY
                </h1>
                <p className="text-red-600 text-sm md:text-lg font-light">
                  Art • Fashion • Culture
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {groupedBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                currentSlide === index
                  ? "w-12 h-3 bg-red-700 "
                  : "w-3 h-3 bg-white/30 hover:bg-white/60 hover:scale-125"
              }`}
            >
              {currentSlide === index && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </section>
    );
  }
);

const GridSection = React.memo(() => {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-4 md:px-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-600/10 backdrop-blur-sm border border-red-600/20 rounded-full px-6 py-2 mb-4">
            {/* <Sparkles className="w-4 h-4 text-red-400 animate-pulse" /> */}
            <span className="text-red-400 text-sm uppercase">
              FEATURED COLLECTIONS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl uppercase text-white mb-4">
            Curated for <span className="text-red-600">You</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our handpicked selection of premium items that define
            modern style and creativity
          </p>
        </div>

        {/* Simple 2x2 Grid Layout */}
        <div className="space-y-2 md:grid grid-cols-5 md:grid-rows-5 gap-3 sm:space-y-2">
          {gridItems.map((gridItem, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer transform transition-all duration-700 ${
                isIntersecting
                  ? `animate-in slide-in-from-bottom-8 duration-700 delay-${
                      index * 100
                    }`
                  : "opacity-0 translate-y-8"
              } ${
                index === 0
                  ? "md:col-span-3 md:row-span-3"
                  : index === 1
                  ? "md:col-span-2 md:row-span-3 md:col-start-4"
                  : index === 2
                  ? "md:col-span-3 md:row-span-3 md:col-start-3 md:row-start-4"
                  : "md:col-span-2 md:row-span-3 md:col-start-1 md:row-start-4"
              }`}
            >
              {/* Glassmorphism Card - konten yang sama seperti sebelumnya */}
              <div className="w-full h-full aspect-[19/8] relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600/20 to-black/50 backdrop-blur-sm border border-red-600 group-hover:border-red-600/50 transition-all duration-500">
                <Image
                  src={gridItem.image || "/placeholder.svg"}
                  alt={gridItem.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  quality={85}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                {/* Floating Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div
                    className={`bg-gradient-to-r ${gridItem.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-0 group-hover:rotate-3 transition-transform duration-300`}
                  >
                    {gridItem.badge}
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="space-y-3">
                    <h3 className="text-white text-xl md:text-2xl font-bold tracking-wide">
                      {gridItem.title}
                    </h3>
                    <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {gridItem.subtitle}
                    </p>

                    {/* CTA Button */}
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                      <a
                        href="/listing"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-600/25"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        EXPLORE
                      </a>
                      <button className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group/btn">
                        <Heart className="w-4 h-4 text-white group-hover/btn:text-red-400 transition-colors duration-300" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Magnetic Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Enhanced Featured Products with 3D Effects
const FeaturedProductsSection = React.memo(
  ({
    featuredProducts,
    isLoading,
  }: {
    featuredProducts: any[];
    isLoading: boolean;
  }) => {
    const [ref, isIntersecting] = useIntersectionObserver();

    if (isLoading) {
      return (
        <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black overflow-visible">
          <div className="px-4 md:px-10 text-center">
            <div className="inline-flex items-center gap-2 bg-red-600/10 backdrop-blur-sm border border-red-600/20 rounded-full px-6 py-2 mb-8">
              <Zap className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-red-400 text-sm font-medium">
                NEW ARRIVALS
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Loading Masterpieces...
            </h2>
            <div className="flex gap-6 justify-center overflow-hidden mt-16">
              {[...Array(4)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section
        ref={ref}
        className="py-20 bg-gradient-to-b from-black via-gray-950 to-black overflow-visible relative"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-red-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 px-4 md:px-10 text-center">
          <div
            className={`transition-all duration-1000 ${
              isIntersecting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-red-600/10 backdrop-blur-sm border border-red-600/20 rounded-full px-6 py-2 mb-8">
              {/* <Star className="w-4 h-4 text-red-400 animate-pulse" /> */}
              <span className="text-red-400 text-sm font-medium">
                NEW ARRIVALS
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl uppercase text-white mb-4">
              Fresh <span className="text-red-600">Drops</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-16">
              Discover the latest additions to our collection, crafted with
              passion and designed for the bold
            </p>
          </div>

          <div className="relative overflow-visible">
            <Swiper
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              loop={featuredProducts.length > 3}
              speed={800}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              modules={[EffectCoverflow, Autoplay]}
              coverflowEffect={{
                rotate: 25,
                stretch: 0,
                depth: 150,
                modifier: 1.5,
                slideShadows: true,
              }}
              breakpoints={{
                0: { slidesPerView: 1.2 },
                768: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="w-full overflow-visible !pb-16"
            >
              {featuredProducts.map((productItem, index) => (
                <SwiperSlide
                  key={`${productItem.id}-${index}`}
                  className="min-w-[50vw] h-[50vw] md:min-w-[300px] md:h-[300px] lg:min-w-[350px] lg:h-[350px] relative"
                >
                  <div className="w-full h-full p-3 group cursor-pointer">
                    {/* 3D Card Container */}
                    <div className="w-full h-full relative overflow-hidden rounded-lg bg-gradient-to-tl from-red-900/50 to-black/50  border-2 border-black transition-all duration-500 transform">
                      {/* Product Image */}
                      <img
                        src={productItem.images[0] || "/placeholder.svg"}
                        alt={productItem.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-all duration-700 p-2"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>

                      {/* Floating Price Tag */}
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-red-600 text-gray-300 text-xs font-bold px-3 py-1 rounded-full shadow-lg transform  group-hover:text-white transition-all duration-300">
                          {productItem.price}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <button className="w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all duration-300 group/btn">
                          <Heart className="w-4 h-4 text-white" />
                        </button>
                        <button className="w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all duration-300 group/btn">
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Content Overlay with 3D Effect */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <div className="space-y-3">
                          <h3 className="text-white text-xs font-semibold tracking-wide line-clamp-2">
                            {productItem.name}
                          </h3>

                          {/* CTA Button */}
                          <a
                            href="/listing"
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-lg text-xs font-semibold transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 opacity-0 group-hover:opacity-100 delay-200"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            View All
                          </a>
                        </div>
                      </div>

                      {/* Magnetic Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-600/10 rounded-full blur-2xl animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Enhanced View All Button */}
          <div className="mt-10">
            <a
              href="/listing"
              className="group inline-flex text-xs items-center gap-3 bg-red-600 hover:bg-red-800 text-white px-6 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300"
            >
              <span>EXPLORE ALL PRODUCTS</span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>
    );
  }
);

// Enhanced Marquee with Dual Direction
const MarqueeSection = React.memo(() => (
  <section className="relative py-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-red-800 border-y border-red-600 font-bold overflow-hidden">
    {/* Gradient Fade Edges */}
    <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-yellow-600 to-transparent z-10"></div>
    <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-yellow-600 to-transparent z-10"></div>

    {/* Top Marquee - Left to Right */}
    <div className="relative flex overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap text-sm gap-8 items-center">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-pulse" />
          ISONEDAY — NOT JUST A BRAND, IT'S A WHOLE VIBE!
          <Sparkles className="w-4 h-4 animate-pulse" />
        </span>
        <span className="flex items-center gap-2">
          <Zap className="w-4 h-4 animate-bounce" />
          100% LOCAL CRAFT, ALL HEART, ALL ART
          <Zap className="w-4 h-4 animate-bounce" />
        </span>
        <span className="flex items-center gap-2">
          <Star className="w-4 h-4 animate-spin" />
          TURN CLOTHES INTO CANVAS, TURN STYLE INTO STATEMENT
          <Star className="w-4 h-4 animate-spin" />
        </span>
        <span className="flex items-center gap-2">
          <Heart className="w-4 h-4 animate-pulse" />
          MADE FOR THE REBELS, THE DREAMERS, THE CREATORS
          <Heart className="w-4 h-4 animate-pulse" />
        </span>
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-bounce" />
          ART • FASHION • CULTURE • UNITED
          <Sparkles className="w-4 h-4 animate-bounce" />
        </span>
      </div>

      {/* Duplicate for seamless loop */}
      <div
        className="flex animate-marquee whitespace-nowrap text-sm gap-8 items-center"
        aria-hidden="true"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-pulse" />
          ISONEDAY — NOT JUST A BRAND, IT'S A WHOLE VIBE!
          <Sparkles className="w-4 h-4 animate-pulse" />
        </span>
        <span className="flex items-center gap-2">
          <Zap className="w-4 h-4 animate-bounce" />
          100% LOCAL CRAFT, ALL HEART, ALL ART
          <Zap className="w-4 h-4 animate-bounce" />
        </span>
        <span className="flex items-center gap-2">
          <Star className="w-4 h-4 animate-spin" />
          TURN CLOTHES INTO CANVAS, TURN STYLE INTO STATEMENT
          <Star className="w-4 h-4 animate-spin" />
        </span>
        <span className="flex items-center gap-2">
          <Heart className="w-4 h-4 animate-pulse" />
          MADE FOR THE REBELS, THE DREAMERS, THE CREATORS
          <Heart className="w-4 h-4 animate-pulse" />
        </span>
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-bounce" />
          ART • FASHION • CULTURE • UNITED
          <Sparkles className="w-4 h-4 animate-bounce" />
        </span>
      </div>
    </div>
  </section>
));

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    banners,
    featuredProducts,
    fetchFeaturedProducts,
    fetchBanners,
    isLoading,
  } = useSettingsStore();

  const fetchData = useCallback(async () => {
    await Promise.all([fetchBanners(), fetchFeaturedProducts()]);
  }, [fetchBanners, fetchFeaturedProducts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (banners.length === 0) return;
    const bannerTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(banners.length / 2));
    }, 6000);
    return () => clearInterval(bannerTimer);
  }, [banners.length]);

  const handleSlideChange = useCallback((slide: number) => {
    setCurrentSlide(slide);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Enhanced Marquee Section */}
      <MarqueeSection />

      {/* Enhanced Banner Section */}
      <BannerSection
        banners={banners}
        currentSlide={currentSlide}
        setCurrentSlide={handleSlideChange}
      />

      {/* Enhanced Grid Section */}
      <GridSection />

      {/* Enhanced Featured Products Section */}
      <FeaturedProductsSection
        featuredProducts={featuredProducts}
        isLoading={isLoading}
      />

      <Art />

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-reverse {
          animation-direction: reverse;
        }
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: animate-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default React.memo(HomePage);
