import apiClient from "../../services/api-client";
import { toast } from "react-toastify";

export const handleBulkUpload = async ({ bulkFile }: { bulkFile: File }) => {
  if (!bulkFile) {
    alert("Please select a file first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", bulkFile);

  try {
    await apiClient.post("/products/bulk/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("File uploaded successfully");
  } catch (error) {
    toast.error("Failed to upload file");
  }
};
