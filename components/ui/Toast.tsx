import toast from "react-hot-toast";

/**
 * Re-export of react-hot-toast with custom styled toasts for the Hillwalking platform.
 * Use: import { toast } from "@/components/ui/Toast";
 */

const styledToast = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        background: "#2D5A27",
        color: "#FEFDF9",
        border: "1px solid #3E7A36",
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
      },
      iconTheme: {
        primary: "#F4A340",
        secondary: "#2D5A27",
      },
    }),
  error: (message: string) =>
    toast.error(message, {
      style: {
        background: "#DC2626",
        color: "#FEFDF9",
        border: "1px solid #EF4444",
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
      },
    }),
  custom: toast.custom,
  remove: toast.remove,
  dismiss: toast.dismiss,
  loading: toast.loading,
  promise: toast.promise,
};

export { styledToast as toast };
export { Toaster } from "react-hot-toast";
