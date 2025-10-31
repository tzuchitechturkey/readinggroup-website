import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { CreateSeries, EditSeriesById } from "@/api/videos";

function CreateOrEditSeries({ series, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: series?.name || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t("Please enter series name"));
      return;
    }

    setIsLoading(true);
    try {
      if (series?.id) {
        // Edit existing series
        await EditSeriesById(series.id, formData);
        toast.success(t("Series updated successfully"));
      } else {
        // Create new series
        await CreateSeries(formData);
        toast.success(t("Series created successfully"));
      }
      onSuccess();
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {isLoading && <Loader />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            {t("Series Name")} *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder={t("Enter series name")}
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {series?.id ? t("Update") : t("Create")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrEditSeries;
