// "use client";

// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useProductStore } from "@/store/useProductStore";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import ProductDetailsSkeleton from "./productSkeleton";
// import { useCartStore } from "@/store/useCartStore";
// import { useToast } from "@/hooks/use-toast";

// function ProductDetailsContent({ id }: { id: string }) {
//   const [product, setProduct] = useState<any>(null);
//   const { getProductById, isLoading, error } = useProductStore();
//   const { addToCart } = useCartStore();
//   const { toast } = useToast();
//   const router = useRouter();
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [selectedSize, setSelectedSize] = useState<string>(""); // Make sure it's string
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       const productDetails = await getProductById(id);
//       if (productDetails) {
//         setProduct(productDetails);
//       } else {
//         router.push("/404");
//       }
//     };

//     fetchProduct();
//   }, [id, getProductById, router]);

//   const handleAddToCart = () => {
//     if (!product) {
//       toast({ title: "Product not found", variant: "destructive" });
//       return;
//     }

//     if (!selectedSize || selectedColor === null) {
//       toast({
//         title: "Please select a color and size before adding to cart",
//         variant: "destructive",
//       });
//       return;
//     }

//     addToCart({
//       productId: product.id,
//       name: product.name,
//       price: product.price,
//       image: product.images[0],
//       color: product.colors[selectedColor],
//       size: selectedSize,
//       quantity: quantity,
//     });

//     setSelectedSize(""); // Clear selection after adding to cart
//     setSelectedColor(0);
//     setQuantity(1);

//     toast({
//       title: "Product added to cart",
//       description: `${product.name} has been added.`,
//       variant: "default",
//     });
//   };

//   if (isLoading) return <ProductDetailsSkeleton />;  // Tampilkan skeleton jika sedang loading
//   if (error) return <div>Error: {error}</div>;  // Menampilkan pesan error

//   if (!product) return <div>Product not found</div>;  // Jika produk tidak ditemukan

//   return (
//     <div className="min-h-screen bg-black text-gray-200">
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-1/2 flex gap-4">
//             <div className="hidden lg:flex flex-col gap-2 w-24">
//               {product?.images.map((image: string, index: number) => (
//                 <button
//                   onClick={() => setSelectedImage(index)}
//                   key={index}
//                   className={`${
//                     selectedImage === index
//                       ? "border-red-600"
//                       : "border-gray-400"
//                   } border-2 rounded-lg p-1`}
//                 >
//                   <img
//                     src={image}
//                     alt={`Product-${index + 1}`}
//                     className="w-full aspect-square object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//             <div className="relative h-[450px] w-[450px]">
//               <img
//                 src={product.images[selectedImage]}
//                 alt={product.name}
//                 className="w-full h-full object-fit"
//               />
//             </div>
//           </div>
//           <div className="lg:w-1/2 space-y-6">
//             <div>
//               <h1 className="text-2xl font-semibold uppercase mb-2">{product.name}</h1>
//               <div>
//                 <span className="text-xl font-semibold">
//                   Rp. {product.price.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//             <div>
//               <h3 className="font-medium mb-2">Color</h3>
//               <div className="flex gap-2">
//                 {product.colors.map((color: string, index: number) => (
//                   <button
//                     key={index}
//                     className={`w-8 h-8 rounded-full border-2 ${
//                       selectedColor === index
//                         ? "border-red-600"
//                         : "border-gray-300"
//                     }`}
//                     style={{ backgroundColor: color }}
//                     onClick={() => setSelectedColor(index)}
//                   />
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h3 className="font-medium mb-2">Size</h3>
//               <div className="flex gap-2">
//                 {product.sizes.map((size: string, index: string) => (
//                   <Button
//                     key={index}
//                     className={`w-8 h-8 border-2 border-red-600`}
//                     variant={selectedSize === size ? "secondary" : "default"}
//                     onClick={() => setSelectedSize(size)}
//                   >
//                     {size}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h3 className="font-medium mb-2">Quantity</h3>
//               <div className="flex items-center gap-2">
//                 <Button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="font-bold bg-black border-2 border-red-600 text-gray-200"
//                 >
//                   -
//                 </Button>
//                 <span className="w-4 text-center">{quantity}</span>
//                 <Button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="font-bold bg-black border-2 border-red-600 text-gray-200"
//                 >
//                   +
//                 </Button>
//               </div>
//             </div>
//             <div>
//               <Button
//                 className={"w-full border border-red-600 text-white hover:bg-gray-800"}
//                 onClick={handleAddToCart}
//               >
//                 ADD TO CART
//               </Button>
//             </div>
//           </div>
//         </div>
//         <div className="mt-16 text-gray-200">
//           <Tabs defaultValue="details">
//             <TabsList className="w-full justify-center border-2 border-red-600 bg-blur text-300 text-xs">
//               <TabsTrigger value="details">PRODUCT DESCRIPTION</TabsTrigger>
//               <TabsTrigger value="reviews">REVIEWS</TabsTrigger>
//               <TabsTrigger value="shipping">
//                 SHIPPING & RETURNS INFO
//               </TabsTrigger>
//             </TabsList>
//             <TabsContent value="details" className="mt-5">
//               <p className=" mb-4">{product.description}</p>
//             </TabsContent>
//             <TabsContent value="reviews" className="mt-5">
//               Reviews
//             </TabsContent>
//             <TabsContent value="shipping">
//               <p className=" mb-4">
//                 Shipping and return information goes here. Please read the info
//                 before proceeding.
//               </p>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductDetailsContent;
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import ProductDetailsSkeleton from "./productSkeleton";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// Enhanced Image Gallery Component
const ImageGallery = React.memo(
  ({
    images,
    selectedImage,
    setSelectedImage,
    productName,
  }: {
    images: string[];
    selectedImage: number;
    setSelectedImage: (index: number) => void;
    productName: string;
  }) => {
    const nextImage = useCallback(() => {
      setSelectedImage((selectedImage + 1) % images.length);
    }, [selectedImage, images.length, setSelectedImage]);

    const prevImage = useCallback(() => {
      setSelectedImage(
        selectedImage === 0 ? images.length - 1 : selectedImage - 1
      );
    }, [selectedImage, images.length, setSelectedImage]);

    return (
      <div className="space-y-4">
        {/* Main Image */}
        <motion.div
          className="relative group overflow-hidden rounded-lg bg-black backdrop-blur-sm border border-red-600"
          variants={fadeInUp}
        >
          <div className="aspect-square relative">
            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt={productName}
              fill
              className="object-cover transition-all duration-700"
              quality={90}
              priority
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white transition-all duration-300 hover:text-red-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white transition-all duration-300 hover:text-red-600"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-white text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </motion.div>

        {/* Thumbnail Gallery */}
        <motion.div
          className="flex gap-3 overflow-x-auto scrollbar-none pb-2"
          variants={fadeInUp}
        >
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedImage === index
                  ? "border-red-600 shadow-lg shadow-red-600/25"
                  : "border-gray-600 hover:border-gray-300"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${productName} ${index + 1}`}
                fill
                className="object-cover"
                quality={70}
              />
              {selectedImage === index && (
                <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    );
  }
);

ImageGallery.displayName = "ImageGallery";

const SizeSelector = React.memo(
  ({
    sizes,
    selectedSize,
    setSelectedSize,
  }: {
    sizes: string[];
    selectedSize: string;
    setSelectedSize: (size: string) => void;
  }) => (
    <motion.div variants={fadeInUp} className="space-y-3">
      <h3 className="text-xs text-white flex items-center gap-2">
        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
        SIZE
      </h3>
      <div className="flex gap-3 flex-wrap">
        {sizes.map((size) => (
          <motion.button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`px-4 py-2 text-xs rounded-full border-2 transition-all duration-300 ${
              selectedSize === size
                ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/25"
                : "border-gray-600 text-gray-300 hover:border-gray-300 hover:text-white bg-gray-900/50"
            }`}
          >
            {size}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
);

SizeSelector.displayName = "SizeSelector";

// Enhanced Quantity Selector
const QuantitySelector = React.memo(
  ({
    quantity,
    setQuantity,
  }: {
    quantity: number;
    setQuantity: (quantity: number) => void;
  }) => (
    <motion.div variants={fadeInUp} className="space-y-3">
      <h3 className="text-xs text-white flex items-center gap-2">
        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
        QUANTITY
      </h3>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center bg-gray-900/50 backdrop-blur-sm border-2 border-gray-600 rounded-full overflow-hidden">
          <motion.button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 text-gray-300 hover:text-red-600 transition-all duration-300"
          >
            <Minus className="w-4 h-4" />
          </motion.button>
          <div className="px-6 py-3 text-white font-semibold min-w-[60px] text-center">
            {quantity}
          </div>
          <motion.button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 text-gray-300 hover:text-red-600 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
);

QuantitySelector.displayName = "QuantitySelector";

function ProductDetailsContent({ id }: { id: string }) {
  const [product, setProduct] = useState<any>(null);
  const { getProductById, isLoading, error } = useProductStore();
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const productDetails = await getProductById(id);
      if (productDetails) {
        setProduct(productDetails);
      } else {
        router.push("/404");
      }
    };
    fetchProduct();
  }, [id, getProductById, router]);

  const handleAddToCart = useCallback(() => {
    if (!product) {
      toast({ title: "Product not found", variant: "destructive" });
      return;
    }

    // if (!selectedSize || selectedColor === null) {
    //   toast({
    //     title: "Please select a color and size before adding to cart",
    //     variant: "destructive",
    //   })
    //   return
    // }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: product.colors[selectedColor],
      size: selectedSize,
      quantity: quantity,
    });

    setSelectedSize("");
    // setSelectedColor(0)
    setQuantity(1);

    toast({
      title: "Added to cart! 🎉",
      description: `${product.name} has been added to your cart.`,
      variant: "default",
    });
  }, [product, selectedSize, selectedColor, quantity, addToCart, toast]);

  if (isLoading) return <ProductDetailsSkeleton />;
  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Product not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-gray-200">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:px-10 md:py-16">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Image Gallery */}
          <motion.div variants={fadeInUp}>
            <ImageGallery
              images={product.images}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              productName={product.name}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div className="space-y-8" variants={staggerContainer}>
            {/* Header */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-lg md:text-xl font-semibold text-white uppercase tracking-wide">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs">
                      (4.8) • 127 reviews
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2 rounded-full border-2 transition-all duration-300 ${
                      isWishlisted
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-gray-400 text-gray-200 hover:border-red-600 hover:text-red-600"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? "fill-current" : ""
                      }`}
                    />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-full border-2 border-gray-400 text-gray-200 hover:border-red-600 hover:text-red-600 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-lg lg:text-xl text-red-600">
                  Rp {product.price.toLocaleString()}
                </span>
                <div className="bg-red-600/10 backdrop-blur-sm border border-red-600/20 rounded-full px-3 py-1">
                  <span className="text-red-400 text-sm font-medium">
                    In Stock
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Product Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
              <div className="text-right">
                <a
                  href="/size-guide"
                  className="text-right text-gray-200 text-xs transform hover:text-red-600 hover:font-bold transition-all duration-300"
                >
                  View Size Guide ⭢
                </a>
              </div>
              </div>
              
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            </div>
            {/* Action Buttons */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <motion.button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-full text-xs flex items-center justify-center gap-3 transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                ADD TO CART
              </motion.button>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2 p-4 bg-gray-900/30 backdrop-blur-sm border-2 border-gray-600 rounded-full">
                  <Truck className="w-6 h-6 text-red-600" />
                  <span className="text-xs text-gray-400">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-gray-900/30 backdrop-blur-sm border-2 border-gray-600 rounded-full">
                  <Shield className="w-6 h-6 text-red-600" />
                  <span className="text-xs text-gray-400">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-gray-900/30 backdrop-blur-sm border-2 border-gray-600 rounded-full">
                  <RotateCcw className="w-6 h-6 text-red-600" />
                  <span className="text-xs text-gray-400">Easy Returns</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Product Details Tabs */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-center bg-gray-900/50 backdrop-blur-sm border border-red-600 rounded-full">
              <TabsTrigger
                value="details"
                className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 rounded-full transition-all duration-300 py-2"
              >
                DESCRIPTION
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 font-semibold rounded-lg transition-all duration-300 py-2"
              >
                REVIEWS
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 font-semibold rounded-lg transition-all duration-300 py-2"
              >
                SHIPPING
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="details" className="space-y-6">
                <div className="bg-gray-900/30 backdrop-blur-sm border border-red-600 rounded-xl p-6">
                  <h3 className="text-sm text-white mb-4">
                    Product Description
                  </h3>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <div className="bg-gray-900/30 backdrop-blur-sm border border-red-600 rounded-xl p-6">
                  <h3 className="text-sm  text-white mb-4">Customer Reviews</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    No description yet
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-6">
                <div className="bg-gray-900/30 backdrop-blur-sm border border-red-600 rounded-xl p-6">
                  <h3 className="text-sm text-white mb-4">
                    Shipping & Returns
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-xs text-white">
                          Free Shipping
                        </h4>
                        <p className="text-xs">
                          Free shipping on orders over Rp 500,000
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RotateCcw className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-xs text-white">
                          Easy Returns
                        </h4>
                        <p className="text-xs">
                          30-day return policy for all items
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

export default React.memo(ProductDetailsContent);
