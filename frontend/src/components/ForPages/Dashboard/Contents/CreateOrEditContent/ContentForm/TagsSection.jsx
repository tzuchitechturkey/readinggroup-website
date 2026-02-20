import { Tag, X } from "lucide-react";

import { Input } from "@/components/ui/input";

export const TagsSection = ({
  t,
  formData,
  errors,
  tagInput,
  setTagInput,
  handleTagInput,
  removeTag,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("Tags")} *
      </label>
      <div className="space-y-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInput}
          placeholder={t("Type a tag and press Enter")}
          className={errors.tags ? "border-red-500" : ""}
        />
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      {errors.tags && (
        <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
      )}
    </div>
  );
};
