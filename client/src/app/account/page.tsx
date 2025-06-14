"use client";

import { OrderNotification } from "@/components/notif/OrderNotification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRupiah } from "@/utils/formatCurrency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Address, useAddressStore } from "@/store/useAddressStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect, useState } from "react";

const initialAddressFormState = {
  name: "",
  phone: "",
  address: "",
  province: "",
  city: "",
  subdistrict: "",
  postcode: "",
  isDefault: false,
};

function UserAccountPage() {
  const {
    isLoading: addressesLoading,
    addresses,
    error: addressesError,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  } = useAddressStore();
  const [showAddresses, setShowAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialAddressFormState);
  const { toast } = useToast();
  const { userOrders, getOrdersByUserId, isLoading } = useOrderStore();

  useEffect(() => {
    fetchAddresses();
    getOrdersByUserId();
  }, [fetchAddresses, getOrdersByUserId]);

  console.log(userOrders, "userOrders");

  const handleAddressSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (editingAddress) {
        const result = await updateAddress(editingAddress, formData);
        if (result) {
          fetchAddresses();
          setEditingAddress(null);
        }
      } else {
        const result = await createAddress(formData);
        if (result) {
          fetchAddresses();
          toast({
            title: "Address created successfully",
          });
        }
      }

      setShowAddresses(false);
      setFormData(initialAddressFormState);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      province: address.province,
      city: address.city,
      subdistrict: address.subdistrict,
      postcode: address.postcode,
      isDefault: address.isDefault,
    });

    setEditingAddress(address.id);
    setShowAddresses(true);
  };

  const handleDeleteAddress = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you wanna delete this address?"
    );

    if (confirmed) {
      try {
        const success = await deleteAddress(id);
        if (success) {
          toast({
            title: "Address is deleted successfully",
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  console.log(addresses);

  const getStatusColor = (
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED"
  ) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-500";

      case "PROCESSING":
        return "bg-yellow-500";

      case "SHIPPED":
        return "bg-purple-500";

      case "DELIVERED":
        return "bg-green-500";

      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-black py-4 text-gray-200">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-lg font-semibold">MY ACCOUNT</h1>
        </div>
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <Card>
              <CardContent className="p-6 bg-black text-gray-200 rounded-2xl">
                <h2 className="text-md font-semibold">Order History</h2>
                {userOrders.length === 0 && (
                  <h1 className="text-sm text-gray-400 font-semibold">
                    You havn't placed an Order yet.
                  </h1>
                )}

                <div className="overflow-x-auto ">
                  <Table>
                    <TableHeader>
                      <TableRow >
                        <TableHead>Order</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {order.items.length}{" "}
                            {order.items.length > 1 ? "Items" : "Item"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(order.status)}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatRupiah(order.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="addresses">
            <Card>
              <CardContent className="p-6 bg-black text-gray-200 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Addresses</h2>
                  <Button
                    onClick={() => {
                      setEditingAddress(null);
                      setFormData(initialAddressFormState);
                      setShowAddresses(true);
                    }}
                    className="text-xs bg-red-600 border border-red-600"
                  >
                    Add New Address
                  </Button>
                </div>
                {addressesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
                  </div>
                ) : showAddresses ? (
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: e.target.value,
                          })
                        }
                        placeholder="Enter your address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Province</Label>
                      <Input
                        id="province"
                        value={formData.province}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            province: e.target.value,
                          })
                        }
                        placeholder="Enter your province"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            city: e.target.value,
                          })
                        }
                        placeholder="Enter your city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Postal Code</Label>
                      <Input
                        id="postcode"
                        value={formData.postcode}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            postcode: e.target.value,
                          })
                        }
                        placeholder="Enter your Postal code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Enter your phone"
                      />
                      <div>
                        <Checkbox
                          id="default"
                          checked={formData.isDefault}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              isDefault: checked as boolean,
                            })
                          }
                        />
                        <Label className="ml-3" htmlFor="default">
                          Set as default address
                        </Label>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit" className="border-2 border-red-600 hover:bg-red-600">
                          {editingAddress ? "Update" : "Add"} Address
                        </Button>
                        <Button
                          type="button"
                          className="bg-red-600 border border-red-600"
                          onClick={() => {
                            setShowAddresses(false);
                            setEditingAddress(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <Card key={address.id}>
                        <CardContent className="p-5 bg-black text-gray-200 rounded-2xl">
                          <div className="flex flex-col mb-5 justify-between items-start text-xs">
                            <p className="font-medium">{address.name}</p>
                            <p className="mb-2">{address.address}</p>
                            <p className="mb-2">
                              {address.province}, {address.city}, {address.subdistrict}{" "}
                              {address.postcode}
                            </p>
                            {address.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <div className="space-x-2">
                            <Button
                              onClick={() => handleEditAddress(address)}
                              size={"sm"}
                              className=" border-2 border-red-600 hover:bg-red-600"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteAddress(address.id)}
                              size={"sm"}
                              className="bg-red-600 border border-red-600"
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserAccountPage;