"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function UserCartPage() {
  const {
    fetchCart,
    items,
    isLoading,
    updateCartItemQuantity,
    removeFromCart,
  } = useCartStore();
  const { user } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    setIsUpdating(true);
    await updateCartItemQuantity(id, Math.max(1, newQuantity));
    setIsUpdating(false);
  };

  const handleRemoveItem = async (id: string) => {
    setIsUpdating(true);
    await removeFromCart(id);
    setIsUpdating(false);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-black py-8 text-gray-200">
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-bold text-left mb-8">YOUR CART</h1>

        {/* Desktop Table */}
        <div className="w-full overflow-x-auto hidden md:block">
          <table className="w-full table-auto ">
            <thead className="border-2 border-red-600 text-sm">
              <tr>
                <th className="text-left py-4 px-6">PRODUCT</th>
                <th className="text-right py-4 px-6">PRICE</th>
                <th className="text-center py-4 px-6">QUANTITY</th>
                <th className="text-right py-4 px-6">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-red-600">
                  <td className="py-4 px-6 align-top">
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex flex-col gap-1 flex-1 ">
                        <h3 className=" text-xs font-semibold text-base">{item.name}</h3>
                        <p className="text-xs text-gray-300">Color: {item.color}</p>
                        <p className="text-xs text-gray-300">Size: {item.size}</p>
                      </div>
                      <Button
                        disabled={isUpdating}
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs text-white bg-red-600 px-2 py-1 hover:bg-red-800"
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-sm">
                    Rp. {item.price.toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center ">
                      <Button
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="bg-transparent hover:text-red-600 hover:bg-transparent"
                        // variant={"secondary"}
                        size={"sm"}
                      >
                        <Minus/>
                      </Button>
                      <Input
                        type="number"
                        className="w-16 text-center" 
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(
                            item.id,
                            parseInt(e.target.value)
                          )
                        }
                      />
                      <Button
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="bg-transparent hover:text-red-600 hover:bg-transparent"
                        // variant={"secondary"}
                        size={"sm"}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-sm">
                    Rp. {(item.price * item.quantity).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border-2 border-red-600 p-4 rounded shadow-sm">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 space-y-1">
                  <h3 className=" text-xs font-semibold">{item.name}</h3>
                  <p className="text-xs text-gray-300">Color: {item.color}</p>
                  <p className="text-xs text-gray-300">Size: {item.size}</p>
                  <p className="text-xs">
                    Harga: Rp. {item.price.toLocaleString("id-ID")}
                  </p>
                  <p className="w-fit text-xs text-red-600 font-medium">
                    Total: Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <Button
                    disabled={isUpdating}
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    className="bg-transparent hover:text-red-600 hover:bg-transparent"
                    // variant={"secondary"}
                    size={"sm"}
                  >
                    <Minus/>
                  </Button>
                  <Input
                    type="number"
                    className="w-16 text-center text-xs"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateQuantity(item.id, parseInt(e.target.value))
                    }
                  />
                  <Button
                    disabled={isUpdating}
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    className="bg-transparent hover:text-red-600 hover:bg-transparent"
                    // variant={"secondary"}
                    size={"sm"}
                  >
                    <Plus />
                  </Button>
                </div>
                <Button
                  disabled={isUpdating}
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-xs text-white bg-red-600 hover:bg-red-800 px-2 py-1"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Actions */}
        <div className="mt-8 flex justify-end">
          <div className="space-y-4 w-full md:w-auto">
            <div className="flex justify-between items-center text-md font-medium">
              <span>TOTAL</span>
              <span className="font-bold text-red-600">Rp{total.toLocaleString("id-ID")}</span>
            </div>
            <Button
              onClick={() => router.push("/checkout")}
              className="w-full border-2 border-red-600 text-white text-xs hover:text-red-600"
            >
              PROCEED TO CHECKOUT
            </Button>
            <Button
              onClick={() => router.push("/listing")}
              className="w-full mt-2 bg-gray-200 text-black text-xs hover:bg-gray-400" 
            >
              CONTINUE SHOPPING
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCartPage;
