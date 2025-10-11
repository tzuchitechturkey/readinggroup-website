import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import Modal from "@/components/Global/Modal/Modal";
// يمكنك استبدال هذه الصور بصورك الفعلية
const timelineData = [
  {
    id: 1,
    year: "2010",
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet consectetur. Massa in maecenas sed viverra. Molestie elementum urna fermentum ac. Urna at convallis etiam commodo erat malesuada eleifend hendrerit platea. Vitae sed est dictumst lorem habitasse congue mattis porta.",
    image: "/path/to/your/image1.jpg", // استبدل بمسار صورتك
    hasButton: true,
    alignment: "right", // النص على اليمين والصورة على اليسار
  },
  {
    id: 2,
    year: "2011",
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet consectetur. Massa in maecenas sed viverra. Molestie elementum urna fermentum ac. Urna at convallis etiam commodo erat malesuada eleifend hendrerit platea. Vitae sed est dictumst lorem habitasse congue mattis porta.",
    image: null,
    hasButton: false,
    alignment: "left", // النص على اليسار فقط
  },
  {
    id: 3,
    year: "2012",
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet consectetur. Massa in maecenas sed viverra. Molestie elementum urna fermentum ac. Urna at convallis etiam commodo erat malesuada eleifend hendrerit platea. Vitae sed est dictumst lorem habitasse congue mattis porta.",
    image: null,
    hasButton: false,
    alignment: "right", // النص على اليمين فقط
  },
  {
    id: 4,
    year: "2013",
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet consectetur. Massa in maecenas sed viverra. Molestie elementum urna fermentum ac. Urna at convallis etiam commodo erat malesuada eleifend hendrerit platea. Vitae sed est dictumst lorem habitasse congue mattis porta.",
    image: null,
    hasButton: true,
    alignment: "left", // النص على اليسار مع زر
  },
  {
    id: 5,
    year: "2014",
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet consectetur. Massa in maecenas sed viverra. Molestie elementum urna fermentum ac. Urna at convallis etiam commodo erat malesuada eleifend hendrerit platea. Vitae sed est dictumst lorem habitasse congue mattis porta.",
    image: "/path/to/your/image2.jpg", // استبدل بمسار صورتك
    hasButton: false,
    alignment: "right", // النص على اليمين والصورة على اليسار
  },
];

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

const TimelineItem = ({ item }) => {
  const { t } = useTranslation();
  const { year, title, description, image, hasButton, alignment } = item;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Desktop & Tablet Layout (md and up) */}
      <div className="hidden md:flex items-start w-full relative">
        {/* المحتوى الأيسر */}
        <div className="flex-1 flex justify-end">
          {alignment === "right" && (
            <div className="max-w-md pr-4 lg:pr-8">
              <div className="text-right">
                <h3 className="text-lg lg:text-2xl font-bold text-gray-900 mb-1">
                  {year}
                </h3>
                <h4 className="text-base lg:text-lg font-bold text-blue-600 mb-2">
                  {title}
                </h4>
                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed mb-4 text-right">
                  {description}
                </p>
                {hasButton && (
                  <div className="flex justify-end">
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
          )}
          {alignment === "left" && image && (
            <div className="max-w-md pr-4 lg:pr-8">
              <img
                src={image}
                alt={title}
                className="w-full h-48 lg:h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        {/* النقطة الوسطية */}
        <div className="flex flex-col items-center px-4 lg:px-6 relative z-10">
          <div className="w-4 h-4 lg:w-6 lg:h-6 bg-blue-600 rounded-full border-2 lg:border-4 border-white shadow-lg" />
        </div>

        {/* المحتوى الأيمن */}
        <div className="flex-1">
          {alignment === "left" && (
            <div className="max-w-md pl-4 lg:pl-8">
              <div className="text-left">
                <h3 className="text-lg lg:text-2xl font-bold text-gray-900 mb-1">
                  {year}
                </h3>
                <h4 className="text-base lg:text-lg font-bold text-blue-600 mb-2">
                  {title}
                </h4>
                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed mb-4">
                  {description}
                </p>
                {hasButton && (
                  <button
                    className="bg-primary hover:bg-white text-white hover:text-primary border-[1px] border-primary px-4 lg:px-6 py-2 lg:py-3 rounded-full text-xs lg:text-sm font-bold flex items-center gap-2 transition-colors duration-200"
                    onClick={handleOpen}
                  >
                    {t("Learn more")}
                    <ArrowIcon />
                  </button>
                )}
              </div>
            </div>
          )}
          {alignment === "right" && image && (
            <div className="max-w-md pl-4 lg:pl-8">
              <img
                src={image}
                alt={title}
                className="w-full h-48 lg:h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col w-full relative">
        {/* العنوان والسنة */}
        <div className="flex items-center mb-3">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{year}</h3>
            <h4 className="text-base font-bold text-blue-600">{title}</h4>
          </div>
        </div>

        {/* الصورة (إذا وجدت) */}
        {image && (
          <div className="mb-4 mr-7">
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* الوصف */}
        <div className="mr-7">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {description}
          </p>

          {/* الزر */}
          {hasButton && (
            <button
              className="bg-primary hover:bg-white text-white hover:text-primary border-[1px] border-primary px-4 lg:px-6 py-2 lg:py-3 rounded-full text-xs lg:text-sm font-bold flex items-center gap-2 transition-colors duration-200"
              onClick={handleOpen}
            >
              {t("Learn more")}
              <ArrowIcon />
            </button>
          )}
        </div>
      </div>
      {/* Start Details Modal */}
      <Modal
        isOpen={open}
        onClose={handleClose}
        title={title}
        width="min(90vw, 500px)"
      >
        <div className="p-2">
          <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-3">
            {year} - {title}
          </h3>
          {image && (
            <img
              src={image}
              alt={title}
              className="w-full h-40 sm:h-48 object-cover rounded mt-3 mb-4"
            />
          )}
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </div>
      </Modal>
      {/* End Details Modal */}
    </>
  );
};

const Timeline = ({ data = timelineData, className = "" }) => {
  return (
    <div
      className={`relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 ${className}`}
    >
      {/* الخط العمودي المتصل - Desktop & Tablet */}
      <div
        className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-0.5 lg:w-1 bg-blue-600 h-full z-0"
        style={{ minHeight: "100%" }}
      />

      {/* الخط العمودي - Mobile */}
      <div className="md:hidden absolute left-2 top-0 w-0.5 bg-blue-600 h-full z-0" />

      {/* Container للمحتوى */}
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8 md:space-y-12 lg:space-y-16 relative z-10">
          {data.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
              isLast={index === data.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
