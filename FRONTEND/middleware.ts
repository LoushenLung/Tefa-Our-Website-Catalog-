import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Protect customer-only routes: /profile, /cart, /settings
  if ((pathname.startsWith("/profile") || pathname.startsWith("/cart") || pathname.startsWith("/settings")) && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Legacy: redirect /customer/* to root customer routes
  if (pathname === "/customer") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith("/customer/profile")) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }
  if (pathname.startsWith("/customer/cart")) {
    return NextResponse.redirect(new URL("/cart", request.url));
  }
  if (pathname.startsWith("/customer/settings")) {
    return NextResponse.redirect(new URL("/settings", request.url));
  }

  // Redirect logged-in users away from auth pages
  if (token && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Handle /user redirect if legacy
  if (token && pathname === "/user") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
