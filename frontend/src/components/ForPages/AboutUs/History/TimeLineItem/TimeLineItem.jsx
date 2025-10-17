import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import Modal from "@/components/Global/Modal/Modal";

function TimelineItem({ item, index }) {
  const { t } = useTranslation();
  const { story_date, title, description, image, image_url, alignment } = item;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const isRight = index % 2 === 0; // زوجي → الصورة يمين

  return (
    <>
      {/* Desktop & Tablet Layout */}
      <div className="hidden md:flex items-start w-full relative">
        {/* المحتوى الأيسر */}
        <div className="flex-1 flex justify-end">
          {/* إذا العنصر فردي (isRight = false) الصورة يسار */}
          {!isRight && (image || image_url) && (
            <div className="max-w-md pr-4 lg:pr-8">
              <img
                src={image || image_url}
                alt={title}
                className="w-full h-48 lg:h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* إذا العنصر زوجي النص يسار */}
          {isRight && (
            <div className="max-w-md pr-4 lg:pr-8 text-right">
              <h3 className="text-lg lg:text-2xl font-bold text-gray-900 mb-1">
                {story_date}
              </h3>
              <h4 className="text-base lg:text-lg font-bold text-blue-600 mb-2">
                {title}
              </h4>
              <p className="text-xs lg:text-sm text-gray-600 leading-relaxed mb-4 text-right">
                {description}
              </p>
              <div className="flex justify-end">
                <button
                  className="bg-primary hover:bg-white text-white hover:text-primary border-[1px] border-primary px-4 lg:px-6 py-2 lg:py-3 rounded-full text-xs lg:text-sm font-bold flex items-center gap-2 transition-colors duration-200"
                  onClick={handleOpen}
                >
                  {t("Learn more")}
                  <ArrowIcon />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* النقطة الوسطية */}
        <div className="flex flex-col items-center px-4 lg:px-6 relative z-10">
          <div className="w-4 h-4 lg:w-6 lg:h-6 bg-blue-600 rounded-full border-2 lg:border-4 border-white shadow-lg" />
        </div>

        {/* المحتوى الأيمن */}
        <div className="flex-1">
          {/* إذا العنصر زوجي الصورة يمين */}
          {isRight && (image || image_url) && (
            <div className="max-w-md pl-4 lg:pl-8">
              <img
                src={image || image_url}
                alt={title}
                className="w-full h-48 lg:h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* إذا العنصر فردي النص يمين */}
          {!isRight && (
            <div className="max-w-md pl-4 lg:pl-8 text-left">
              <h3 className="text-lg lg:text-2xl font-bold text-gray-900 mb-1">
                {story_date}
              </h3>
              <h4 className="text-base lg:text-lg font-bold text-blue-600 mb-2">
                {title}
              </h4>
              <p className="text-xs lg:text-sm text-gray-600 leading-relaxed mb-4">
                {description}
              </p>
              <button
                className="bg-primary hover:bg-white text-white hover:text-primary border-[1px] border-primary px-4 lg:px-6 py-2 lg:py-3 rounded-full text-xs lg:text-sm font-bold flex items-center gap-2 transition-colors duration-200"
                onClick={handleOpen}
              >
                {t("Learn more")}
                <ArrowIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col w-full relative">
        <div className="flex items-center mb-3">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{story_date}</h3>
            <h4 className="text-base font-bold text-blue-600">{title}</h4>
          </div>
        </div>

        {(image || image_url) && (
          <div className="mb-4 mr-7">
            <img
              src={image || image_url}
              alt={title}
              className="w-full h-48 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="mr-7">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {description}
          </p>
          <button
            className="bg-primary hover:bg-white text-white hover:text-primary border-[1px] border-primary px-4 lg:px-6 py-2 lg:py-3 rounded-full text-xs lg:text-sm font-bold flex items-center gap-2 transition-colors duration-200"
            onClick={handleOpen}
          >
            {t("Learn more")}
            <ArrowIcon />
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={open}
        onClose={handleClose}
        title={title}
        width="min(90vw, 500px)"
      >
        <div className="p-2">
          <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-3">
            {story_date} - {title}
          </h3>
          {(image || image_url) && (
            <img
              src={image || image_url}
              alt={title}
              className="w-full h-40 sm:h-48 object-cover rounded mt-3 mb-4"
            />
          )}
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </div>
      </Modal>
    </>
  );
}

export default TimelineItem;
// مكوّن السهم البسيط
const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
