import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/me", ];
const authPaths = ["/login", "/register"];
const adminPaths = ["/admin","/dashboard"]; // Example path that requires admin role
const productEditRegex = /^\/products\/\d+\/edit$/;

// // Utility function to decode JWT and get user roles
// const getUserRoles = () => {
//   if (typeof window !== "undefined") {
//     const user = window.localStorage.getItem("user");
//     if (!user) {
//       return [];
//     }
//     const { roles } = JSON.parse(user) as { roles: string[] };
//     console.log("roles: ", roles);
//     return roles;
//   }
// };

// Middleware function
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const userRole = request.cookies.get("role")?.value;
  // console.log("userRole: ", userRole);
  // Redirect unauthenticated users from private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users from auth paths
  if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  // Redirect unauthenticated users trying to edit products
  if (pathname.match(productEditRegex) && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check roles for authorization
  if (sessionToken) {
    

    // Example: Restrict admin paths to users with 'admin' role
    if (
      adminPaths.some((path) => pathname.startsWith(path)) &&
      !userRole?.includes("admin")
    ) {
      return NextResponse.redirect(new URL("/403", request.url)); // Redirect to a forbidden page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/me",
    "/login",
    "/register",
    "/products/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
