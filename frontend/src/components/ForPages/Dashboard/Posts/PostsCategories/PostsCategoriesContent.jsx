import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import {
  GetPostCategories,
  AddPostCategory,
  EditPostCategoryById,
  DeletePostCategory,
  SortPostCategories,
  GetPostCategoryById,
} from "@/api/posts";
import TableButtons from "@/components/Global/TableButtons/TableButtons";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";

function PostsCategoriesContent({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: false,
    post_count: 0,
  });
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [originalLanguage, setOriginalLanguage] = useState(null);
  const [categoryKey, setCategoryKey] = useState(null);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isSorting, setIsSorting] = useState(false);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const limit = 10;
  const languages = [
    { label: "Arabic", value: "ar" },
    { label: "English", value: "en" },
    { label: "Turkish", value: "tr" },
    { label: "Chinese (Simp)", value: "zh-hans" },
    { label: "Chinese (Trad)", value: "zh-hant" },
    { label: "Spanish", value: "es" },
    { label: "French", value: "fr" },
  ];
  // Map language names to language codes
  const languageCodeMap = {
    ar: "ar",
    en: "en",
    tr: "tr",
    ch: "ch",
    chsi: "chsi",
    fr: "fr",
  };
  const getCategoriesData = async (page, searchValue = searchTerm) => {
    setIsLoading(true);
    const offset = page * 10;
    try {
      const res = searchValue
        ? await GetPostCategories(limit, offset, searchValue)
        : await GetPostCategories(limit, offset);
      const results = res?.data?.results || [];
      setCategories(results);
      setOriginalCategories(JSON.parse(JSON.stringify(results)));
      setHasChanges(false);
      setTotalRecords(res?.data?.count || 0);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };
  // Handle Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getCategoriesData(newPage - 1);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    // setCategoryKey(null);
    setSelectedLanguage(i18n?.language || "en");
    setForm({ name: "", description: "", is_active: false, post_count: 0 });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    const currentLanguage = i18n?.language || "en";
    // setCategoryKey(cat.key || null);
    setSelectedLanguage(currentLanguage);
    setOriginalLanguage(currentLanguage);
    setForm({
      name: cat.name || "",
      description: cat.description || "",
      is_active: cat.is_active !== undefined ? cat.is_active : false,
      post_count: cat.post_count !== undefined ? cat.post_count : 0,
    });
    setErrors({});
    setShowModal(true);
  };

  // Load category data in selected language
  const loadCategoryByLanguage = async (categoryId, language) => {
    if (!categoryId) return;

    setIsLoadingTranslation(true);
    try {
      const res = await GetPostCategoryById(categoryId, language);

      const categoryData = res?.data;
      // setCategoryKey(categoryData.key || null);
      setForm({
        name: categoryData.name || "",
        description: categoryData.description || "",
        is_active:
          categoryData.is_active !== undefined ? categoryData.is_active : false,
        post_count: categoryData.post_count || 0,
      });
    } catch (err) {
      console.error("Error loading translation:", err);
      toast.error(t("Failed to load translation"));
    } finally {
      setIsLoadingTranslation(false);
    }
  };

  // Handle language change and fetch translated data
  const handleLanguageChange = async (newLanguage) => {
    setSelectedLanguage(newLanguage);
    console.log("New Language:", newLanguage);
    // Only fetch if language changed and we're editing an existing category
    if (newLanguage !== originalLanguage && editingCategory?.id) {
      console.log("Fetching translation for language:", newLanguage);
      await loadCategoryByLanguage(editingCategory.id, newLanguage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "name" || name === "description") {
      // setCategoryKey(null);
    }
    // إزالة الخطأ عند الإدخال
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!form.name || !form.name.trim()) {
      newErrors.name = t("Name is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      return;
    }

    // إنشاء array جديد مع الترتيب الجديد
    const newCategories = [...categories];
    const draggedIndex = newCategories.findIndex(
      (cat) => cat.id === draggedItem.id,
    );
    const targetIndex = newCategories.findIndex(
      (cat) => cat.id === targetItem.id,
    );

    // تبديل العناصر
    [newCategories[draggedIndex], newCategories[targetIndex]] = [
      newCategories[targetIndex],
      newCategories[draggedIndex],
    ];

    setCategories(newCategories);
    setHasChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSaveOrder = async () => {
    setIsSorting(true);
    try {
      // إنشاء البيانات المرسلة
      const sortData = categories.map((cat, index) => ({
        id: cat.id,
        order: index,
      }));
      // استدعاء API
      await SortPostCategories({ categories: sortData });
      toast.success(t("Categories reordered successfully"));
      setHasChanges(false);
      setOriginalCategories(JSON.parse(JSON.stringify(categories)));
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to reorder categories"));
    } finally {
      setIsSorting(false);
    }
  };

  const handleCancelOrder = () => {
    setCategories(JSON.parse(JSON.stringify(originalCategories)));
    setHasChanges(false);
    toast.info(t("Changes cancelled"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const languageCode = languageCodeMap[selectedLanguage];
    const submitData = { ...form };

    // إذا كانت عملية إنشاء جديدة، أرسل اللغة
    if (!editingCategory || !editingCategory.id) {
      submitData.language = languageCode;
    } else {
      // إذا كان تعديل:
      // إذا كان هناك key (ترجمة موجودة) ولم نعدل اللغة، أرسل الـ key
      // إذا أردنا تعديل الترجمات (اسم أو وصف)، لا نرسل الـ key
      // if (categoryKey) {
      //   submitData.key = categoryKey;
      // }
    }
    submitData.language = languageCode;
    // submitData.key = languageCode;
    console.log("Submitting data:", submitData);
    setIsLoading(true);
    try {
      if (editingCategory && editingCategory.id) {
        await EditPostCategoryById(editingCategory.id, submitData);
        toast.success(t("Category updated"));
      } else {
        await AddPostCategory(submitData);
        toast.success(t("Category created"));
      }
      setShowModal(false);
      getCategoriesData(0);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };
  const handleConfirmDelete = async () => {
    console.log("Deleting category:", selectedCategory);
    if (!selectedCategory?.id) return;
    setIsLoading(true);
    try {
      await DeletePostCategory(selectedCategory.id);
      toast.success(t("Category deleted"));
      setShowDeleteModal(false);
      setSelectedCategory(null);
      getCategoriesData(0);
    } catch (err) {
      console.error(err);
      toast.error(t("Delete failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / limit);

  useEffect(() => {
    getCategoriesData(0);
  }, []);

  return (
    <div
      className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Posts List")}
        onBack={() => {
          onSectionChange("posts");
        }}
        page={t("Posts Categories")}
      />
      {/* End Breadcrumb */}

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-2 lg:px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-3 md:mb-6">
          <h2 className="text-lg font-medium text-[#1D2630]">
            {t("Posts Categories")}
          </h2>

          <div className="flex items-center justify-between gap-1">
            <span className="text-xs md:text-sm text-gray-500">
              {t("Total")}: {totalRecords} {t("categories")}
            </span>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 text-xs md:text-sm bg-primary border border-primary hover:bg-white transition-all duration-200 text-white hover:text-primary px-3 py-1.5 rounded"
            >
              <Plus className="h-4 w-4" />
              {t("Add Category")}
            </button>
          </div>
        </div>

        {/* Start Search */}
        <div className="bg-white rounded-lg p-4  mb-3 md:mb-6 shadow-sm">
          <div className="relative max-w-md flex">
            <input
              type="text"
              placeholder={t("Search Categories")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 px-4 py-2 border border-gray-300 ${
                i18n?.language === "ar" ? "rounded-r-lg" : "rounded-l-lg"
              } text-sm pr-8`}
            />

            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  getCategoriesData(0, "");
                }}
                className={` absolute ${
                  i18n?.language === "ar" ? " left-20" : " right-20"
                } top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700`}
              >
                ✕
              </button>
            )}

            <button
              onClick={() => {
                if (searchTerm.trim()) {
                  getCategoriesData(0);
                }
              }}
              className={`px-4 py-2 bg-[#4680ff] text-white ${
                i18n?.language === "ar" ? "rounded-l-lg" : "rounded-r-lg"
              }  text-sm font-semibold hover:bg-blue-600`}
            >
              {t("Search")}
            </button>
          </div>
        </div>
        {/* End Search */}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr
                  className={`${
                    i18n?.language === "ar" ? "text-right " : "text-left"
                  }text-sm text-gray-600`}
                >
                  <th
                    className={`${
                      i18n?.language === "ar" ? "text-right " : "  text-left"
                    } py-2 px-3`}
                  >
                    {t("Name")}
                  </th>
                  <th
                    className={`${
                      i18n?.language === "ar" ? "text-right " : "  text-left"
                    } py-2 px-3`}
                  >
                    {t("Description")}
                  </th>
                  <th
                    className={`${
                      i18n?.language === "ar" ? "text-right " : "  text-left"
                    } py-2 px-3`}
                  >
                    {t("Status")}
                  </th>
                  <th
                    className={` ${
                      i18n?.language === "ar" ? "text-right " : "  text-left"
                    } py-2 px-3 w-[160px]`}
                  >
                    {t("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((cat) => (
                  <tr
                    key={cat.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, cat)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, cat)}
                    onDragEnd={handleDragEnd}
                    className={`border-t transition-all duration-200 ${
                      draggedItem?.id === cat.id
                        ? "opacity-50 bg-blue-50"
                        : "cursor-move hover:bg-gray-50"
                    } ${isSorting ? "opacity-75" : ""}`}
                    style={{
                      cursor: isSorting ? "not-allowed" : "move",
                    }}
                  >
                    <td className="py-3 px-3">{cat.name}</td>
                    <td className="py-3 px-3">{cat.description || "-"}</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={async () => {
                          if (!cat.is_active && cat.post_count === 0) {
                            toast.info(
                              t(
                                "You cannot activate this category because it does not contain any posts. Please add posts first.",
                              ),
                            );
                            return;
                          }
                          try {
                            await EditPostCategoryById(cat.id, {
                              ...cat,
                              is_active: !cat.is_active,
                            });
                            toast.success(
                              cat.is_active
                                ? t("Category disabled")
                                : t("Category enabled"),
                            );
                            getCategoriesData(currentPage - 1);
                          } catch (err) {
                            setErrorFn(err, t);
                          }
                        }}
                        className={`p-1 rounded-lg transition-all duration-200 ${
                          cat.is_active
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        } ${
                          !cat.is_active && cat.post_count === 0
                            ? "opacity-50 "
                            : ""
                        }`}
                        title={
                          !cat.is_active && cat.post_count === 0
                            ? t("Cannot activate category with no posts.")
                            : cat.is_active
                              ? t("Click to disable")
                              : t("Click to enable")
                        }
                      >
                        {cat.is_active ? (
                          <ToggleRight className="h-8 w-12" />
                        ) : (
                          <ToggleLeft className="h-8 w-12" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1 rounded hover:bg-gray-100"
                          title={t("Edit")}
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => {
                            console.log("Selected for delete:", cat);
                            // if (cat?.key) {
                            setSelectedCategory(cat);
                            console.log("if");
                            // } else {
                            //   loadCategoryByLanguage(cat.id);
                            //   console.log("else");
                            // }
                            setShowDeleteModal(true);
                          }}
                          className="p-1 rounded hover:bg-gray-100"
                          title={t("Delete")}
                        >
                          <Trash2 className="h-4 w-4 text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TableButtons
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              t={t}
            />
          </div>

          {/* Save/Cancel Order Buttons */}
          {hasChanges && (
            <div className="flex gap-3 p-4 bg-yellow-50 border-t border-yellow-200">
              <div className="flex-1 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm text-yellow-700">
                  {t("You have unsaved changes in the category order")}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelOrder}
                  disabled={isSorting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleSaveOrder}
                  disabled={isSorting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isSorting ? (
                    <>
                      <span className="inline-block animate-spin">⟳</span>
                      {t("Saving...")}
                    </>
                  ) : (
                    `✓ ${t("Save Changes")}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create / Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingCategory ? t("Edit Category") : t("Add Category")}
          width="600px"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              {/* Language Selection - Only for editing */}
              {editingCategory && editingCategory.id && (
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    {t("Language")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedLanguage || ""}
                    onChange={(e) => {
                      handleLanguageChange(e.target.value);
                    }}
                    disabled={isLoadingTranslation}
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                  >
                    <option value="" hidden disabled>
                      {t("Select Language")}
                    </option>
                    {languages.map((lang) => (
                      <option key={lang?.value} value={lang?.value}>
                        {lang?.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Start Fetch Item by Language - Show button only when language changed */}
              {editingCategory &&
                editingCategory.id &&
                selectedLanguage &&
                selectedLanguage !== originalLanguage && (
                  <button
                    type="button"
                    onClick={() => handleLanguageChange(selectedLanguage)}
                    disabled={isLoadingTranslation}
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {t("Fetch Translation")}
                  </button>
                )}
              {/* End Fetch Item by Language  */}
            </div>

            {isLoadingTranslation && (
              <p className="text-sm text-blue-600">
                {t("Loading translation...")}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("Name")} <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                disabled={isLoadingTranslation}
                className={`w-full p-2 border rounded ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } ${
                  isLoadingTranslation ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("Description")}
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                disabled={isLoadingTranslation}
                className={`w-full p-2 border border-gray-300 rounded ${
                  isLoadingTranslation ? "opacity-50 cursor-not-allowed" : ""
                }`}
                rows={4}
              />
            </div>

            {/* Is Active Toggle */}
            <div>
              <label className="block text-sm font-medium mb-3">
                {t("Status")}
              </label>
              <button
                type="button"
                disabled={isLoadingTranslation}
                onClick={() => {
                  if (!form.is_active && form.post_count === 0) {
                    toast.info(
                      t(
                        "You cannot activate this category because it does not contain any posts. Please add posts first.",
                      ),
                    );
                    return;
                  }
                  setForm((prev) => ({ ...prev, is_active: !prev.is_active }));
                }}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                  form.is_active
                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                } ${
                  isLoadingTranslation ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {form.is_active ? (
                  <ToggleRight className="h-8 w-12" />
                ) : (
                  <ToggleLeft className="h-8 w-12" />
                )}
                <span className="text-base font-medium">
                  {form?.is_active ? t("Active") : t("Inactive")}
                </span>
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isLoadingTranslation}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                disabled={isLoadingTranslation}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingCategory ? t("Save Changes") : t("Add Category")}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={t("Confirm Deletion")}
          width="500px"
        >
          <DeleteConfirmation
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            title={t("Delete Category")}
            message={t(
              "Are you sure you want to delete this category? This action cannot be undone.",
            )}
            itemName={selectedCategory?.name}
          />
        </Modal>
      </div>
    </div>
  );
}

export default PostsCategoriesContent;
