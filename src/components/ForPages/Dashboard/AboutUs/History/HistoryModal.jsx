import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const HistoryModal = ({
  isOpen,
  onClose,
  onSave,
  historyItem = null,
  isEditing = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    title: "",
    description: "",
    image: "",
  });

  // Reset form when modal opens/closes or historyItem changes
  useEffect(() => {
    if (isOpen) {
      if (historyItem && isEditing) {
        setFormData({ ...historyItem });
      } else {
        setFormData({
          from_date: "",
          to_date: "",
          title: "",
          description: "",
          image: "",
        });
      }
    }
  }, [isOpen, historyItem, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg p-6 overflow-y-auto">
      <form onSubmit={handleSubmit} className="relative z-50 space-y-4">
        {/* Start Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Start Date")}
          </label>
          <Popover className="!z-[999999999999999]">
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span>{t("Pick start date")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.from_date}
                onSelect={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    from_date: date,
                  }))
                }
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* End Start Date */}

        {/* Start End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("End Date")}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formData.endDate ? (
                  format(formData.endDate, "PPP")
                ) : (
                  <span>{t("Pick end date")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.endDate}
                onSelect={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: date,
                  }))
                }
                disabled={(date) =>
                  date > new Date() ||
                  date < new Date("1900-01-01") ||
                  (formData.startDate && date < formData.startDate)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* End End Date */}

        {/* Start Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Title")}
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        {/* End Title */}

        {/* Start Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        {/* End Description */}

        {/* Start Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Image URL")}
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        {/* End Image URL */}

        {/* Start Image Preview */}
        {formData.image && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Image Preview")}
            </label>
            <img
              src={formData.image}
              alt={t("Preview")}
              className="w-32 h-32 object-cover rounded-lg border"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}
        {/* End Image Preview */}

        {/* Start Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isEditing ? t("Save Changes") : t("Add Event")}
          </button>
        </div>
        {/* End Actions */}
      </form>
    </div>
  );
};

export default HistoryModal;
