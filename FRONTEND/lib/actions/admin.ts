"use server";

import { apiClient } from "@/lib/api-client";

export async function getDashboardStats() {
  try {
    const response = await apiClient.get<any>("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
}

export async function getRecentOrders() {
  try {
    const response = await apiClient.get<any>("/admin/orders?limit=5");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }
}

// Projects / Catalogs CRUD
export async function getProjects() {
  try {
    const response = await apiClient.get<any>("/projects");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function createProject(data: any) {
  try {
    return await apiClient.post("/projects", data);
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProject(id: string, data: any) {
  try {
    return await apiClient.put(`/projects/${id}`, data);
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    return await apiClient.delete(`/projects/${id}`);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

// Orders Management
export async function getOrders() {
  try {
    const response = await apiClient.get<any>("/admin/orders");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    return await apiClient.patch(`/admin/orders/${id}/status`, { status });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

// Contacts / Inbox Management
export async function getContacts() {
  try {
    const response = await apiClient.get<any>("/contacts");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}

export async function deleteContact(id: string) {
  try {
    return await apiClient.delete(`/contacts/${id}`);
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
}
