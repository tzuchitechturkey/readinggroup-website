import React from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";

function LogoutConfirmation({ onCancel }) {
  const { t } = useTranslation();

  const Logout = () => {
    toast.success(t("You have been logged out successfully."));
    onCancel();
  };
  return (
    <div className="p-4 text-center">
      <p className="text-lg font-medium text-gray-700 mb-6">
        {t("Are you sure you want to log out?")}
      </p>
      <div className="flex justify-center gap-4">
        <Button
          onClick={onCancel}
          variant="outline"
          className="px-6 py-2 rounded-lg"
        >
          {t("Cancel")}
        </Button>
        <Button
          onClick={Logout}
          className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-lg"
        >
          {t("Log Out")}
        </Button>
      </div>
    </div>
  );
}

export default LogoutConfirmation;
