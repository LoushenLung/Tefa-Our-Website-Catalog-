import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // 1. Jika sudah login dan mencoba akses '/' atau '/user'
  if (token) {
    if (pathname === "/") {
      // Rewrite '/' ke '/user' (URL tetap '/', konten dari /user)
      return NextResponse.rewrite(new URL("/user", request.url));
    }
    if (pathname === "/user") {
      // Redirect '/user' ke '/' biar URL-nya bersih (karena sudah di-rewrite ke root)
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sign-in, sign-up (auth pages)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up).*)",
  ],
};



