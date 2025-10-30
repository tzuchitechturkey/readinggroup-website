import { toast } from "react-toastify";

export const setErrorFn = (e, t) => {
  try {
    const errors = [];

    if (e?.response?.data) {
      Object.keys(e.response.data).forEach((key) => {
        const value = e.response.data[key];
        errors.push(`${t(key.toUpperCase())}: ${t(value)}`);
      });
    } else if (e?.message) {
      errors.push(t(e.message));
    } else {
      errors.push(t("Unexpected error occurred."));
    }
    toast.error(errors.join("\n"), {
      style: { whiteSpace: "pre-line" },
    });
  } catch (err) {
    toast.error(t("An unknown error occurred."));
  }
};
