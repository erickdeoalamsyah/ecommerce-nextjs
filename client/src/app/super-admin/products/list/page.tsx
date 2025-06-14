"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useProductStore } from "@/store/useProductStore";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { formatRupiah } from "@/utils/formatCurrency";

function SuperAdminProductListingPage() {
  const { products, isLoading, fetchAllProductsForAdmin, deleteProduct } =
    useProductStore();
  const { toast } = useToast();
  const router = useRouter();
  const productFetchRef = useRef(false);

  useEffect(() => {
    if (!productFetchRef.current) {
      fetchAllProductsForAdmin();
      productFetchRef.current = true;
    }
  }, [fetchAllProductsForAdmin]);

  async function handleDeleteProduct(getId: string) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(getId);
      if (result) {
        toast({
          title: "Product deleted successfully",
        });
        fetchAllProductsForAdmin();
      }
    }
  }

  if (isLoading) return null;

  return (
    <div className="p-6 bg-black text-gray-200">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between ">
          <h1 className="font-bold">All Products</h1>
          <Button onClick={() => router.push("/super-admin/products/add")} className=" bg-black border border-red-600 hover:bg-red-600">
            Add New Product
          </Button>
        </header>
        <div>
          <div className="overflow-x-auto">
            <div className="hidden md:block bg-black border  ">
              <Table>
                <TableHeader>
                  <TableRow className="text-white">
                    <TableHead >Product Name</TableHead>
                    <TableHead >Price</TableHead>
                    <TableHead >Stock</TableHead>
                    <TableHead >Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {products.map((product) => (
                    <TableRow key={product.id}  >
                      <TableCell>
                        <div className="flex items-center gap-3 ">
                          <div className="rounded overflow-hidden">
                            {product.images[0] && (
                              <Image
                                src={product.images[0]}
                                alt="product image"
                                width={60}
                                height={60}
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Size: {product.sizes.join(",")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         {formatRupiah(product.price)}
                      </TableCell>
                      <TableCell>{product.stock} item left</TableCell>
                      <TableCell>{product.category.toUpperCase()}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() =>
                              router.push(
                                `/super-admin/products/add?id=${product.id}`
                              )
                            }
                            variant={"ghost"}
                            size={"icon"}
                          >
                            <Pencil className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteProduct(product.id)}
                            variant={"ghost"}
                            size={"icon"}
                          >
                            <Trash2 className="h-4 w-4 text-red-600 " />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-red-600 rounded-lg p-4 shadow-sm flex flex-col"
                >
                  <div className="flex gap-4">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={80}
                        height={80}
                        className=" object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {product.sizes.join(", ")}
                      </p>
                      <p className="text-sm">Category: {product.category}</p>
                      <p className="text-sm">Stock: {product.stock}</p>
                      <p className="text-sm font-medium">
                        Price: Rp{product.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      onClick={() =>
                        router.push(
                          `/super-admin/products/add?id=${product.id}`
                        )
                      }
                      variant={"secondary"}
                      size={"sm"}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.id)}
                      variant={"destructive"}
                      size={"sm"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminProductListingPage;
