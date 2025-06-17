"use client";

import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/useSettingsStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import home1 from "../../public/images/home1.webp";
import home2 from "../../public/images/home2.webp";
import home3 from "../../public/images/home3.webp";
import home4 from "../../public/images/home4.webp";
import { useRouter } from "next/navigation";

const gridItems = [
  {
    title: "T-SHIRT",
    subtitle: "From world's top designer",
    Image: home1,
  },
  {
    title: "HAT",
    subtitle: "Timeless cool weather",
    Image: home2,
  },
  {
    title: "STICKER",
    subtitle: "Everything you need",
    Image: home3,
  },
  {
    title: "ACCESSORIES",
    subtitle: "Party season ready",
    Image: home4,
  },
];

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const { banners, featuredProducts, fetchFeaturedProducts, fetchBanners } =
    useSettingsStore();

  useEffect(() => {
    fetchBanners();
    fetchFeaturedProducts();
  }, [fetchBanners, fetchFeaturedProducts]);

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(bannerTimer);
  }, [banners.length]);

  console.log(banners, featuredProducts);

  return (
    <div className="min-h-screen bg-black">
      <section className="relative h-[600px] overflow-hidden ">
        {banners.map((bannerItem, index) => (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
            key={bannerItem.id}
          >
            <div className="absolute inset-0">
              <img
                src={bannerItem.imageUrl}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20" />
            </div>
            <div className="relative h-full container px-10 flex items-center">
              <div className="text-white space-y-6">
                <span className="text-sm uppercase tracking-wider">
                  Isoneday
                </span>
                <h1 className="text-xl lg:text-4xl font-semibold leading-tight">
                  BEST SELLING
                  <br />
                  E-COMMERCE WEBSITE
                </h1>
                <p className="text-lg text-red-600">
                  A Creative, Flexible , Clean, Easy to use and
                  <br />
                  High Performance E-Commerce Theme
                </p>
                <Button className="text-red-600 border border-red-600 bg-blur px-6 py-4 text-sm">
                  SHOP NOW
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </section>

      {/* grid section */}
      <section className="py-16 border-t border-red-600 ">
        <div className="container mx-auto px-4 text-gray-200 ">
          <h2 className="text-center text-3xl font-semibold mb-2">
            THE WINTER EDIT
          </h2>
          <p className="text-center text-red-600 mb-8">
            Designed to keep your satisfaction and warmth
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gridItems.map((gridItem, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg"
              >
                <div className="aspect-[3/4]">
                  <Image
                    src={gridItem.Image}
                    alt={gridItem.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 "
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {gridItem.title}
                    </h3>
                    <p className="text-sm">{gridItem.subtitle}</p>
                    <Button
                      onClick={() => router.push("/listing")}
                      className="mt-4 bg-white text-black hover:bg-gray-100"
                    >
                      SHOP NOW
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature products section */}
      <section className="py-16 border-t border-red-600">
        <div className="container mx-auto px-4 text-gray-200">
          <h2 className="text-center text-3xl font-semibold mb-2">
            NEW ARRIVALS
          </h2>
          <p className="text-center text-red-600 mb-8">
            Shop our new arrivals from established brands
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
            {featuredProducts.map((productItem) => (
              <div
                onClick={() => router.push(`/listing/${productItem.id}`)}
                key={productItem.id}
                className="group border border-red-600 p-2 rounded-lg"
              >
                <div className="relative mb-2 bg-blur overflow-hidden rounded-lg">
                  <img
                    src={productItem.images[0]}
                    alt={productItem.name}
                    className="w-full h-full object-cover transition-transform duration-300 border-b border-red-600 "
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button className="bg-black text-red-600 hover:text-gray-100">
                      View Detail
                    </Button>
                  </div>
                </div>
                <h2 className="text-center text-xs font-semibold uppercase">
                  {productItem.name}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
