// import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|sign-in|sign-up|_next/static|_next/image|favicon.ico).*)",
  ],
};


