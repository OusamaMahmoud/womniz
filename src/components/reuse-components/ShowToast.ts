import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (
  message: string,
  type = "default",
  options?: { delay?: number; navigateTo?: string },
  navigate?: (path: string) => void
) => {
  // Show the toast based on the type
  switch (type) {
    case "success":
      toast.success(message, {
        position: "top-center",
        style: { width: "400px", height: "100px", fontSize: "18px" },
      });
      break;
    case "error":
      toast.error(message, {
        position: "top-center",
        style: { width: "400px", height: "100px", fontSize: "18px" },
      });
      break;
    case "info":
      toast.info(message, {
        position: "top-center",
        style: { width: "400px", height: "100px", fontSize: "18px" },
      });
      break;
    default:
      toast(message, {
        position: "top-center",
        style: { width: "400px", height: "100px", fontSize: "18px" },
      });
  }

  // Handle optional navigation
  if (options?.navigateTo && navigate) {
    const delay = options.delay || 3000; // Default delay is 3 seconds if not specified
    setTimeout(() => {
      navigate(options.navigateTo!); // Navigate to the specified route
    }, delay);
  }
};
