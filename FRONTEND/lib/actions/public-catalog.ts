"use server";

import { apiClient } from "@/lib/api-client";

export async function getPublicProjects() {
  try {
    const response = await apiClient.get<any[]>("/projects");
    return response || [];
  } catch (error) {
    console.error("Error fetching public projects:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const response = await apiClient.get<any>(`/projects/slug/${slug}`);
    return response;
  } catch (error) {
    console.error(`Error fetching project by slug ${slug}:`, error);
    return null;
  }
}
