"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useAddressStore } from "@/store/useAddressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { CartItem, useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatRupiah } from "@/utils/formatCurrency";

function CheckoutContent() {
  const { addresses, fetchAddresses } = useAddressStore();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<(CartItem & { product: any })[]>([]);
  const { items, fetchCart, clearCart } = useCartStore();
  const { getProductById } = useProductStore();
  const { initiateMidtransPayment, isPaymentProcessing } = useOrderStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const subTotal = cartItemsWithDetails.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const total = subTotal;

  useEffect(() => {
    fetchAddresses();
    fetchCart();
  }, [fetchAddresses, fetchCart]);

  useEffect(() => {
    const findDefaultAddress = addresses.find((address) => address.isDefault);
    if (findDefaultAddress) setSelectedAddress(findDefaultAddress.id);
  }, [addresses]);

  useEffect(() => {
    const fetchDetails = async () => {
      const result = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          return { ...item, product };
        })
      );
      setCartItemsWithDetails(result);
    };
    fetchDetails();
  }, [items, getProductById]);

  // ⬇️ Inject Midtrans Snap.js
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleMidtransPayment = async () => {
  if (!checkoutEmail) {
    toast({ title: "Email tidak boleh kosong", variant: "destructive" });
    return;
  }

  if (!user) {
    toast({ title: "Silakan login terlebih dahulu", variant: "destructive" });
    return;
  }

  if (!selectedAddress) {
    toast({ title: "Pilih alamat pengiriman terlebih dahulu", variant: "destructive" });
    return;
  }

  const mappedItems = cartItemsWithDetails.map((item) => ({
    productId: item.productId,
    productName: item.product.name,
    productCategory: item.product.category,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    price: item.product.price,
  }));

  await initiateMidtransPayment(
    checkoutEmail,
    user.id,
    selectedAddress,
    mappedItems,
    total
  );
};

  if (isPaymentProcessing) {
    return (
      <Skeleton className="w-full h-[600px] rounded-xl">
        <div className="h-full flex justify-center items-center">
          <h1 className="text-3xl font-bold">
            Processing payment...Please wait!
          </h1>
        </div>
      </Skeleton>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-black text-gray-200">
              <h2 className="text-xl font-semibold mb-4">Delivery</h2>
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={address.id}
                      checked={selectedAddress === address.id}
                      onCheckedChange={() => setSelectedAddress(address.id)}
                    />
                    <Label htmlFor={address.id} className="flex-grow ml-3">
                      <div>
                        <span className="font-medium">{address.name}</span>
                        {address.isDefault && (
                          <span className="ml-2 text-xs text-green-600">(Default)</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{address.address}</div>
                      <div className="text-xs text-gray-400">
                        {address.province}, {address.city}, {address.subdistrict}, {address.postcode}
                      </div>
                      <div className="text-xs text-gray-400">{address.phone}</div>
                    </Label>
                  </div>
                ))}
                <Button onClick={() => router.push("/account")} className="border border-red-600 bg-red-600 text-xs">
                  Add a new Address
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-black text-gray-200">
              <h3 className="text-lg font-semibold mb-4">Enter Email to get started</h3>
              <div className="gap-2 flex items-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full text-xs"
                  value={checkoutEmail}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setCheckoutEmail(event.target.value)
                  }
                />
                <Button className="border border-red-600 bg-red-600 text-xs" onClick={handleMidtransPayment}>
                  Proceed to Buy
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8 bg-black text-gray-200">
              <h2>Order summary</h2>
              <div className="space-y-4">
                {cartItemsWithDetails.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative rounded-md overflow-hidden">
                      <img
                        src={item?.product?.images[0]}
                        alt={item?.product?.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-xs">{item?.product?.name}</h3>
                      <p className="text-xs text-gray-400">{item.color} / {item.size}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-xs">{formatRupiah(item?.product?.price * item.quantity)}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subTotal)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-sm">
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutContent;
