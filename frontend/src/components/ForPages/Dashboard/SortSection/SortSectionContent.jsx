import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { GripVertical, Save, X } from "lucide-react";

import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetStatistics, ReorderSections } from "@/api/dashboard";

import CustomBreadcrumb from "../CustomBreadcrumb/CustomBreadcrumb";

function SortSectionContent({ onSectionChange }) {
  const { t } = useTranslation();
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModified, setIsModified] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);

  // جلب الأقسام من الـ API
  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const response = await GetStatistics();
      const topLikedData = response?.data?.top_liked;
      // استبعاد weekly_moment و top_posts لأنهما لا يحتاجان لترتيب
      const sectionsArray = Object.entries(topLikedData || {})
        .filter(
          ([sectionName]) =>
            sectionName !== "weekly_moment" && sectionName !== "top_posts"
        )
        .map(([sectionName, itemData]) => ({
          sectionName,
          id: itemData?.id,
          name: itemData?.name || itemData?.title || "",
          image:
            itemData?.image || itemData?.image_url || itemData?.cover || "",
          likes_count: itemData?.likes_count || 0,
          has_liked: itemData?.has_liked || false,
          ...itemData,
        }));

      setSections(sectionsArray);
      setIsModified(false);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSections();
  }, []);
  console.log(sections);
  // التعامل مع بدء السحب
  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  // التعامل مع الإفلات فوق عنصر
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItem !== null && draggedItem !== index) {
      setDraggedOverItem(index);
    }
  };

  // التعامل مع الإفلات
  const handleDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItem !== null && draggedItem !== index) {
      // تبديل الأقسام
      const newSections = [...sections];
      const draggedSection = newSections[draggedItem];
      newSections.splice(draggedItem, 1);
      newSections.splice(index, 0, draggedSection);
      setSections(newSections);
      setIsModified(true);
    }

    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  // التعامل مع ترك السحب
  const handleDragEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  // حفظ الترتيب الجديد
  const handleSave = async () => {
    setIsLoading(true);
    // إنشاء مصفوفة من الـ IDs بالترتيب الجديد
    const orderedIds = sections.map((section, index) => ({
      sectionName: section.sectionName,
      order: index + 1,
    }));
    try {
      console.log(orderedIds);
      // إرسال الترتيب الجديد للـ API
      await ReorderSections(orderedIds);
      toast.success(t("Sections reordered successfully"));
      setIsModified(false);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // إلغاء التعديلات
  const handleCancel = () => {
    fetchSections();
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full mx-auto ">
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Dashboard")}
        onBack={() => {
          onSectionChange("dashboard");
        }}
        page={t("Sort Sections")}
      />
      {/* End Breadcrumb */}

      {/* Start Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
        <div>
          <h2 className="text-lg font-medium text-[#1D2630]">
            {t("Manage Sections")}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t("Drag and drop to reorder sections")}
          </p>
        </div>
      </div>
      {/* End Header */}
      {/* رسالة إذا لم تكن هناك أقسام */}
      {sections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {t("No sections available")}
          </p>
        </div>
      ) : (
        <>
          {/* جدول الأقسام */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* رأس الجدول */}
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300 w-12">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-80">
                      {t("Section Name")}
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 w-24">
                      {t("Image")}
                    </th>
                    <th className="px-4 py-3  text-sm font-semibold text-gray-700 text-center dark:text-gray-300">
                      {t("Item Name")}
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 w-20">
                      {t("Move")}
                    </th>
                  </tr>
                </thead>

                {/* جسم الجدول */}
                <tbody>
                  {sections.map((section, index) => (
                    <tr
                      key={`${section.sectionName}-${section.id}`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      onDragLeave={() => setDraggedOverItem(null)}
                      className={`border-b border-gray-200 dark:border-gray-600 transition-all duration-200 cursor-move ${
                        draggedItem === index
                          ? "opacity-50 bg-gray-100 dark:bg-gray-700"
                          : draggedOverItem === index
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      {/* الترتيب */}
                      <td className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                        {index + 1}
                      </td>

                      {/* اسم القسم */}
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                          {t(section.sectionName)}
                        </span>
                      </td>

                      {/* صورة العنصر */}
                      <td className="px-4 py-4 text-center">
                        <img
                          src={
                            section.image ||
                            section.image_url ||
                            section.thumbnail ||
                            section.thumbnail_url
                          }
                          alt={section.name}
                          className="w-12 h-12 mx-auto object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                      </td>
                      {/* اسم العنصر */}
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs text-center truncate">
                        {section.name}
                      </td>

                      {/* أيقونة السحب */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          {isModified && (
            <div className="mt-6 flex gap-3 justify-end animate-in fade-in-0 duration-200">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isLoading
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <X className="w-4 h-4" />
                {t("Cancel")}
              </button>

              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                }`}
              >
                <Save className="w-4 h-4" />
                {t("Save Changes")}
              </button>
            </div>
          )}

          {/* رسالة إذا لم تكن هناك تعديلات */}
          {!isModified && (
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              {t("Drag sections to reorder them")}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SortSectionContent;
