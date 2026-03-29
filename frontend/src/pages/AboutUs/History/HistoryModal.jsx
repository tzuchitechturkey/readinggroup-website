import React, { useEffect } from "react";

const HistoryModal = ({ isOpen, onClose, event }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  // Add a helper function to map month numbers to names
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1); // JavaScript months are 0-indexed
    return date.toLocaleString("en-US", { month: "long" });
  };

  return (
    <div className="fixed inset-0 z-[50] bg-[#16213AF7]/95 overflow-y-auto">
      <div className="min-h-screen px-4 md:px-8 py-16 md:py-24 flex items-start justify-center">
        <div className="w-full max-w-[1000px] relative mt-10 md:mt-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-white text-[22px] md:text-[32px] font-black leading-none">
                {event?.year}
              </h2>
              <h2 className="text-white uppercase text-[22px] md:text-[32px] mt-3 font-black leading-none">
                {getMonthName(event?.month)}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white opacity-80 hover:opacity-100 transition-opacity p-2 -mr-2 -mt-2 cursor-pointer"
              aria-label="Close modal"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8">
            <img
              src={event.images[0]?.image}
              alt={event.title}
              className="w-full h-auto object-cover rounded-none"
            />

            <div className="text-[#FCFDFF] text-[14px] md:text-lg leading-[1.75]">
              {event.sub_title_one}
            </div>

            {/* Support for additional modal-specific images if they exist in the metadata */}
            {event.images?.length === 2 && (
              <img
                key={1}
                src={event.images[1]?.image}
                alt={`Additional 1 for ${event.title}`}
                className="w-full h-auto object-cover rounded-none"
              />
            )}
            {/* Support for additional paragraphs if they exist in the metadata */}
            {event.sub_title_two && (
              <div className="text-[#FCFDFF] text-[14px] md:text-lg leading-[1.75] ">
                {event.sub_title_two}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
