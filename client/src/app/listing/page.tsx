"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductStore } from "@/store/useProductStore";
import { brands, categories, sizes } from "@/utils/config";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import bannerProduct from "../../../public/images/bannerProduct.webp"
import Image from "next/image";
import { formatRupiah } from "@/utils/formatCurrency";

const colors = [
  { name: "Navy", class: "bg-blue-900" },
  { name: "Black", class: "bg-black border-2" },
  { name: "White", class: "bg-white border" },
  { name: "Army", class: "bg-green-900" },
  { name: "Red", class: "bg-red-700" },
];

function ProductListingPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();
  const {
    products,
    currentPage,
    totalProducts,
    totalPages,
    setCurrentPage,
    fetchProductsForClient,
    isLoading,
    error,
  } = useProductStore();

  const fetchAllProducts = () => {
    fetchProductsForClient({
      page: currentPage,
      limit: 6,
      categories: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      brands: selectedBrands,
      sortBy,
      sortOrder,
    });
  };

  useEffect(() => {
    fetchAllProducts();
  }, [
    currentPage,
    selectedCategories,
    selectedSizes,
    selectedBrands,
    selectedColors,
    sortBy,
    sortOrder,
  ]);

  const handleSortChange = (value: string) => {
    console.log(value);
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as "asc" | "desc");
  };

  const handleToggleFilter = (
    filterType: "categories" | "sizes" | "brands" | "colors",
    value: string
  ) => {
    const setterMap = {
      categories: setSelectedCategories,
      sizes: setSelectedSizes,
      colors: setSelectedColors,
      brands: setSelectedBrands,
    };

    setterMap[filterType]((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const FilterSection = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 font-semibold text-red-600">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                className="border-2 border-red-600"
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() =>
                    handleToggleFilter("categories", category)
                  }
                  id={category}
                />
                <Label htmlFor={category} className="ml-2 text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-red-600">Brands</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <Checkbox
                className="border-2 border-red-600"
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleToggleFilter("brands", brand)}
                  id={brand}
                />
                <Label htmlFor={brand} className="ml-2 text-sm">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-red-600">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((sizeItem) => (
              <Button
                key={sizeItem}
                variant={
                  selectedSizes.includes(sizeItem) ? "secondary" : "default"
                }
                onClick={() => handleToggleFilter("sizes", sizeItem)}
                className="h-8 w-8 border-2 border-red-600 font-bold "
                size="sm"
              >
                {sizeItem}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-red-600">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                className={`w-6 h-6 rounded-full ${color.class} ${
                  selectedColors.includes(color.name)
                    ? "ring-offset-2 ring-black ring-2"
                    : ""
                }`}
                title={color.name}
                onClick={() => handleToggleFilter("colors", color.name)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  console.log(totalPages, totalProducts, products);

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className=" relative md:h-[560px] overflow-hidden border-b border-red-600 ">
        <Image
          src={bannerProduct}
          alt="Listing Page Banner"
          className="w-full object-contain md:object-cover h-full opacity-50 "
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-xl md:text-4xl font-semibold mb-2">HOT COLLECTION</h1>
            <p className="text-lg">Discover our latest collection</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 md:gap-0 ">
  <h2 className="text-lg md:text-2xl font-semibold">All Products</h2>
  <div className="flex items-center gap-2 w-full md:w-auto">
    {/* Tombol filter untuk mobile */}
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="lg:hidden flex items-center gap-1 mt-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-h-[600px] overflow-auto max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <FilterSection />
      </DialogContent>
    </Dialog>

    {/* Select untuk sorting, full width di mobile */}
    <Select
      value={`${sortBy}-${sortOrder}`}
      onValueChange={(value) => handleSortChange(value)}
      name="sort "
    >
      <SelectTrigger className="mt-1.5 w-full md:w-auto border border-red-600 text-red-600">
        <SelectValue placeholder="Select Brand " />
      </SelectTrigger>
      <SelectContent className="bg-black text-red-600">
        <SelectItem value="createdAt-asc">Sort by: Featured</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price : High to Low</SelectItem>
        <SelectItem value="createdAt-desc">
          Sort by: Newest First
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

        <div className="flex gap-8">
          <div className="hidden lg:block flex-shrink-0 ">
            <FilterSection />
          </div>
          {/* product grid */}
          <div className="flex-1">
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
                {products.map((productItem) => (
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
                    <h2 className="text-center text-xs font-semibold uppercase">{productItem.name}</h2>
                    <div className="flex text-xs items-center justify-center space-x-2 ">
                      <span className="font-semibold text-xs mt-1">
                        {formatRupiah(productItem.price)}
                      </span>
                      <div className="flex gap-1">
                        {productItem.colors.map((colorItem, index) => (
                          <div
                            key={index}
                            className={`w-4 h-4 rounded-full border `}
                            style={{ backgroundColor: colorItem }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* pagination */}
            <div className="mt-10 items-center flex justify-center gap-2">
              <Button
                disabled={currentPage === 1}
                className="bg-white text-black"
                size={"icon"}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "secondary"}
                    className="w-10"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                disabled={currentPage === totalPages}
                className="bg-white text-black"
                size={"icon"}
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductListingPage;