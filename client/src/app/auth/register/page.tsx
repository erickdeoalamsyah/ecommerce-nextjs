"use client";

import Image from "next/image";
import banners from "../../../../public/images/banners.webp";
import logo from "../../../../public/images/logo.webp";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { protectSignUpAction } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

function Registerpage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const checkFirstLevelOfValidation = await protectSignUpAction(
      formData.email
    );
    if (!checkFirstLevelOfValidation.success) {
      toast({
        title: checkFirstLevelOfValidation.error,
        variant: "destructive",
      });
      return;
    }

    const userId = await register( 
      formData.name,
      formData.email,
      formData.password
    );
    if (userId) {
      toast({
        title: "Registration Successfull!",
      });
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      <div className="hidden lg:block w-1/2  relative overflow-hidden border-r-2 border-red-600">
        <Image
          src={banners}
          alt="Register"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-center">
            <Image src={logo} width={200} height={50} alt="Logo" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-gray-200">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
                className="bg-gray-200 text-sm"
                value={formData.name}
                onChange={handleOnChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name" className="text-gray-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="bg-gray-200"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleOnChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name" className="text-gray-200">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                className="bg-[#ffede1]"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleOnChange}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border-2 border-red-600 text-white hover:bg-red-600 transition-colors"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  CREATE ACCOUNT
                </>
              )}
            </Button>
            <p className="text-center text-gray-200 text-sm">
              Already have an account{" "}
              <Link
                href={"/auth/login"}
                className="text-blue-600 hover:underline font-bold"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registerpage;