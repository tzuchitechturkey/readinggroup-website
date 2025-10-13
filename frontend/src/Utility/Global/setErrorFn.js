import { toast } from "react-toastify";

export const setErrorFn = (e) => {
  try {
    const errors = [];

    if (e?.response?.data) {
      Object.keys(e.response.data).forEach((key) => {
        const value = e.response.data[key];
        errors.push(`${key.toUpperCase()}: ${value}`);
      });
    } else if (e?.message) {
      errors.push(e.message);
    } else {
      errors.push("Unexpected error occurred.");
    }

    // عرض الخطأ في toast
    toast.error(errors.join("\n"), {
      style: {
        whiteSpace: "pre-line", // حتى لو كانت الأسطر طويلة
      },
    });
  } catch (err) {
    toast.error("An unknown error occurred.");
  }
};
