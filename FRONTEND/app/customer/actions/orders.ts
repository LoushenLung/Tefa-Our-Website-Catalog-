"use server";

import { cookies } from "next/headers";

interface OrderItem {
  id: number;
  projectId: number | null;
  projectName: string;
  price: number;
  thumbnail: string | null;
  quantity: number;
}

interface Order {
  id: number;
  orderCode: string;
  totalPrice: number;
  status: "PENDING" | "PENDING_PAYMENT" | "WAITING_VERIFICATION" | "PAID" | "REJECTED" | "CANCELLED";
  customerName: string;
  createdAt: string;
  items: OrderItem[];
}

interface FetchOrdersResponse {
  code: number;
  status: string;
  message: string;
  data: Order[];
}

export async function fetchUserOrders(): Promise<Order[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    const url = `${backendUrl}/orders`;

    console.log("Fetching orders from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: Partial<FetchOrdersResponse> = await response
        .json()
        .catch(() => ({}));
      throw new Error(
        errorData.message || `Error: ${response.status} ${response.statusText}`
      );
    }

    const result: FetchOrdersResponse = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    throw new Error(error.message || "Gagal mengambil data pesanan.");
  }
}
