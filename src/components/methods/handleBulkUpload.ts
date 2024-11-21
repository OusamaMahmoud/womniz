import apiClient from "../../services/api-client";
import { showToast } from "../reuse-components/ShowToast";

export const handleBulkUpload = async ({ bulkFile }: { bulkFile: File }) => {
  if (!bulkFile) {
    showToast("Please select a file first.", "error");
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
    showToast("File uploaded successfully", "success");
  } catch (error) {
    showToast("Failed to upload file", "error");
  }
};
