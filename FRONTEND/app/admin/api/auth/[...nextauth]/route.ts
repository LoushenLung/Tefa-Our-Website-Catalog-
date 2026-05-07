// ─────────────────────────────────────────────────────────────────────────────
// DEV MODE: NextAuth route dinonaktifkan sementara.
// Aktifkan kode di bawah ini saat backend & kredensial OAuth sudah siap.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

const DEV_RESPONSE = NextResponse.json(
  { message: "[DEV MODE] Auth API belum terhubung ke backend." },
  { status: 503 }
);

export async function GET() {
  return DEV_RESPONSE;
}

export async function POST() {
  return DEV_RESPONSE;
}

// ─── Aktifkan blok ini saat backend sudah siap ────────────────────────────────
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
//
// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//     }),
//   ],
//   pages: { signIn: "/sign-in" },
//   callbacks: {
//     async session({ session }) { return session; },
//     async jwt({ token })       { return token; },
//   },
// });
//
// export { handler as GET, handler as POST };

