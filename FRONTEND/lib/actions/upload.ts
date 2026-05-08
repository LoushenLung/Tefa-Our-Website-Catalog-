"use server";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  // In a real implementation, you would use cloudinary SDK here.
  // For now, we'll send it to the backend endpoint that handles uploads if it exists,
  // or return a mock URL for demonstration if we can't connect.
  
  try {
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      body: backendFormData,
      // Note: We don't set Content-Type header here, browser/fetch will set it with boundary
    });

    if (!response.ok) throw new Error("Upload failed");
    
    const result = await response.json();
    return result.url; // Assuming backend returns { url: "..." }
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
