"use server";

import { cookies } from "next/headers";

/**
 * Mengambil nilai cookie berdasarkan nama
 */
export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(name)?.value;
  return cookieValue;
};

/**
 * Menyimpan cookie dengan opsi keamanan standar
 */
export const storeCookie = async (
  name: string,
  value: string,
  expiresInDays: number = 1
) => {
  const cookieStore = await cookies();

  cookieStore.set(name, value, {
    maxAge: 60 * 60 * 24 * expiresInDays, // Konversi hari ke detik
    path: "/",
    httpOnly: true, // Lebih aman karena tidak bisa diintip via JS Client
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

/**
 * Menghapus cookie
 */
export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};