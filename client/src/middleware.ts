import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = [
  "/",
  "/auth/register",
  "/auth/login",
  "/listing",
  "/about",
  "/contact"
];

const superAdminRoutes = ["/super-admin", "/super-admin/:path*"];
const userRoutes = ["/home"];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Cek apakah route publik (exact match atau prefix /listing/)
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/listing/")
  ) {
    return NextResponse.next();
  }

  // Jika ada token, verifikasi dan logic redirect sesuai role
  if (accessToken) {
    try {
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      const { role } = payload as { role: string };

      if (publicRoutes.includes(pathname) || pathname.startsWith("/listing/")) {
        return NextResponse.redirect(
          new URL(role === "SUPER_ADMIN" ? "/super-admin" : "/home", request.url)
        );
      }

      if (
        role === "SUPER_ADMIN" &&
        userRoutes.some((route) => pathname.startsWith(route))
      ) {
        return NextResponse.redirect(new URL("/super-admin", request.url));
      }
      if (
        role !== "SUPER_ADMIN" &&
        superAdminRoutes.some((route) => pathname.startsWith(route))
      ) {
        return NextResponse.redirect(new URL("/home", request.url));
      }

      return NextResponse.next();
    } catch (e) {
      console.error("Token verification failed", e);
      const refreshResponse = await fetch(
        "http://localhost:3000/api/auth/refresh-token",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (refreshResponse.ok) {
        const response = NextResponse.next();
        response.cookies.set(
          "accessToken",
          refreshResponse.headers.get("Set-Cookie") || ""
        );
        return response;
      } else {
        const response = NextResponse.redirect(
          new URL("/auth/login", request.url)
        );
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
    }
  }

  // Kalau bukan route publik dan tidak ada token, redirect login
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/listing/:path*",
  ],
};
