import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { CreateSeason, EditSeasonById } from "@/api/videos";

function CreateOrEditSeason({ season, onClose, onSuccess, preSelectedSeries }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    season_number: season?.season_number || "",
  });

  // Get the series (either from preSelected or from editing season)
  const currentSeries = preSelectedSeries || season?.season_title;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.season_number.trim()) {
      toast.error(t("Please enter season number"));
      return;
    }

    if (!currentSeries?.id) {
      toast.error(t("Series not found"));
      return;
    }

    const submitData = {
      season_id: formData.season_number,
      season_title: currentSeries.id,
    };

    setIsLoading(true);
    try {
      if (season?.id) {
        // Edit existing season
        await EditSeasonById(season.id, submitData);
        toast.success(t("Season updated successfully"));
      } else {
        // Create new season
        await CreateSeason(submitData);
        toast.success(t("Season created successfully"));
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
          <label htmlFor="season_number" className="text-sm font-medium">
            {t("Season Number")} *
          </label>
          <Input
            id="season_number"
            type="text"
            value={formData.season_number}
            onChange={(e) =>
              setFormData({ ...formData, season_number: e.target.value })
            }
            placeholder={t("Enter season number (e.g., 1, 2, 3...)")}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("Series")}</label>
          <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {currentSeries?.name || t("Unknown Series")}
            </p>
          </div>
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
            {season?.id ? t("Update") : t("Create")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrEditSeason;
