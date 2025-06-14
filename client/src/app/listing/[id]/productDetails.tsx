"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetailsSkeleton from "./productSkeleton";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/hooks/use-toast";

function ProductDetailsContent({ id }: { id: string }) {
  const [product, setProduct] = useState<any>(null);
  const { getProductById, isLoading, error } = useProductStore();
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(""); // Make sure it's string
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    if (!product) {
      toast({ title: "Product not found", variant: "destructive" });
      return;
    }

    if (!selectedSize || selectedColor === null) {
      toast({
        title: "Please select a color and size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: product.colors[selectedColor],
      size: selectedSize,
      quantity: quantity,
    });

    setSelectedSize(""); // Clear selection after adding to cart
    setSelectedColor(0);
    setQuantity(1);

    toast({
      title: "Product added to cart",
      description: `${product.name} has been added.`,
      variant: "default",
    });
  };

  if (isLoading) return <ProductDetailsSkeleton />;  // Tampilkan skeleton jika sedang loading
  if (error) return <div>Error: {error}</div>;  // Menampilkan pesan error

  if (!product) return <div>Product not found</div>;  // Jika produk tidak ditemukan

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 flex gap-4">
            <div className="hidden lg:flex flex-col gap-2 w-24">
              {product?.images.map((image: string, index: number) => (
                <button
                  onClick={() => setSelectedImage(index)}
                  key={index}
                  className={`${
                    selectedImage === index
                      ? "border-red-600"
                      : "border-gray-400"
                  } border-2 rounded-lg p-1`}
                >
                  <img
                    src={image}
                    alt={`Product-${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="relative h-[450px] w-[450px]">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-fit"
              />
            </div>
          </div>
          <div className="lg:w-1/2 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold uppercase mb-2">{product.name}</h1>
              <div>
                <span className="text-xl font-semibold">
                  Rp. {product.price.toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color: string, index: number) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === index
                        ? "border-red-600"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(index)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size: string, index: string) => (
                  <Button
                    key={index}
                    className={`w-8 h-8 border-2 border-red-600`}
                    variant={selectedSize === size ? "secondary" : "default"}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="font-bold bg-black border-2 border-red-600 text-gray-200"
                >
                  -
                </Button>
                <span className="w-4 text-center">{quantity}</span>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  className="font-bold bg-black border-2 border-red-600 text-gray-200"
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <Button
                className={"w-full border border-red-600 text-white hover:bg-gray-800"}
                onClick={handleAddToCart}
              >
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-16 text-gray-200">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-center border-2 border-red-600 bg-blur text-300">
              <TabsTrigger value="details">PRODUCT DESCRIPTION</TabsTrigger>
              <TabsTrigger value="reviews">REVIEWS</TabsTrigger>
              <TabsTrigger value="shipping">
                SHIPPING & RETURNS INFO
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-5">
              <p className=" mb-4">{product.description}</p>
            </TabsContent>
            <TabsContent value="reviews" className="mt-5">
              Reviews
            </TabsContent>
            <TabsContent value="shipping">
              <p className=" mb-4">
                Shipping and return information goes here. Please read the info
                before proceeding.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsContent;
