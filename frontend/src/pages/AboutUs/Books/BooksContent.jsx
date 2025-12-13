import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { toast } from "react-toastify";

import Loader from "@/components/Global/Loader/Loader";
import Modal from "@/components/Global/Modal/Modal";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetBooksGroups, GetBooksByGroupId } from "@/api/books";

function BooksContent() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const VISIBLE_TABS = 4;
  const BOOKS_LIMIT = 10;

  function getPlainText(html) {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }
  function getExcerpt(html, maxLength = 120) {
    const text = getPlainText(html).trim();
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }
  // جلب الفئات
  const getCategories = async () => {
    setIsLoading(true);
    try {
      const res = await GetBooksGroups(100, 0);
      const categoryList = res?.data?.results || [];
      setCategories(categoryList);

      if (categoryList.length > 0) {
        setSelectedCategory(categoryList[0]);
        await getBooksByCategory(categoryList[0].id);
      }
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // جلب الكتب حسب الفئة
  const getBooksByCategory = async (categoryId, page = 0) => {
    const isFirstLoad = page === 0;
    if (isFirstLoad) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const offset = page * BOOKS_LIMIT;
      const res = await GetBooksByGroupId(categoryId);

      const booksList = res?.data?.results || res?.data || [];
      const paginatedBooks = booksList.slice(offset, offset + BOOKS_LIMIT);

      if (isFirstLoad) {
        setBooks(paginatedBooks);
        setTotalRecords(booksList.length);
        setCurrentPage(0);
      } else {
        setBooks((prev) => [...prev, ...paginatedBooks]);
      }

      setHasMore(offset + BOOKS_LIMIT < booksList.length);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      if (isFirstLoad) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  // عند اختيار فئة
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
    setBooks([]);
    setHasMore(true);
    getBooksByCategory(category.id, 0);
  };

  // تحميل المزيد من الكتب
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    getBooksByCategory(selectedCategory.id, nextPage);
  };

  // الحركة للأمام في Carousel
  const handleCarouselNext = () => {
    if (carouselPosition < categories.length - VISIBLE_TABS) {
      setCarouselPosition(carouselPosition + 1);
    }
  };

  // الحركة للخلف في Carousel
  const handleCarouselPrev = () => {
    if (carouselPosition > 0) {
      setCarouselPosition(carouselPosition - 1);
    }
  };

  // الفئات المرئية في الـ Carousel
  const visibleCategories = categories.slice(
    carouselPosition,
    carouselPosition + VISIBLE_TABS
  );

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("Books")}</h1>
        <p className="text-lg text-gray-600">
          {t("Explore our collection of books")}
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-gray-500 text-lg">
            {t("No categories available")}
          </p>
        </div>
      ) : (
        <>
          {/* Carousel Tabs */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="relative">
              {/* Previous Button */}
              {carouselPosition > 0 && (
                <button
                  onClick={handleCarouselPrev}
                  className={`absolute ${
                    i18n?.language === "ar"
                      ? "right-full mr-4"
                      : "left-full ml-4"
                  } top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-lg`}
                  title={t("Previous")}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
              )}

              {/* Next Button */}
              {carouselPosition < categories.length - VISIBLE_TABS && (
                <button
                  onClick={handleCarouselNext}
                  className={`absolute ${
                    i18n?.language === "ar"
                      ? "left-full ml-4"
                      : "right-full mr-4"
                  } top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-lg`}
                  title={t("Next")}
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              )}

              {/* Tabs Container */}
              <div className="flex gap-3 overflow-hidden">
                {visibleCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                      selectedCategory?.id === category.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="max-w-7xl mx-auto">
            {books.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {t("No books available in this category")}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
                    >
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {book?.name || book?.title}
                        </h3>
                      </div>

                      {/* Card Body */}
                      <div className="px-6 py-4">
                        <p className="text-gray-600 text-sm mb-4">
                          {getExcerpt(book?.description) ||
                            t("No description available")}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => {
                            setSelectedBook(book);
                            setShowDescriptionModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-2"
                          title={t("View Full Description")}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            {t("Read More")}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoadingMore ? (
                        <>
                          <span className="inline-block animate-spin">⟳</span>
                          {t("Loading...")}
                        </>
                      ) : (
                        t("Load More")
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Description Modal */}
      <Modal
        title={selectedBook?.name}
        isOpen={showDescriptionModal}
        onClose={() => {
          setShowDescriptionModal(false);
          setSelectedBook({});
        }}
        width="900px"
      >
        <div className="p-8 max-h-96 overflow-y-auto">
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: selectedBook?.description }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default BooksContent;
