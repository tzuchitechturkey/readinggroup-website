import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const HistoryModal = ({ isOpen, onClose, event, year }) => {
  const { t } = useTranslation();

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

  return (
    <div className="fixed inset-0 z-[50] bg-[#081945]/95 overflow-y-auto">
      <div className="min-h-screen px-4 md:px-8 py-16 md:py-24 flex items-start justify-center">
        <div className="w-full max-w-[792px] relative mt-10 md:mt-0">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-white text-[32px] md:text-[42px] font-[800] leading-none">
                {year}
              </h2>
              {event.date && (
                <h3 className="text-white text-[15px] font-black uppercase tracking-[0.15em]">
                  {event.date}
                </h3>
              )}
            </div>
            <button 
              onClick={onClose}
              className="text-white opacity-80 hover:opacity-100 transition-opacity p-2 -mr-2 -mt-2 cursor-pointer"
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8">
            <img 
              src={event.image} 
              alt={event.date || year} 
              className="w-full h-auto object-cover rounded-none"
            />
            
            <div className="text-white text-[14px] md:text-[15px] leading-[1.75] font-medium opacity-90">
              {event.modalDescription || event.title}
            </div>

            {/* Support for additional modal-specific images if they exist in the metadata */}
            {event.additionalImages && event.additionalImages.map((imgUrl, idx) => (
              <img 
                key={idx}
                src={imgUrl} 
                alt={`Additional ${idx}`} 
                className="w-full h-auto object-cover rounded-none"
              />
            ))}
            
            {/* Support for additional paragraphs if they exist in the metadata */}
            {event.additionalText && (
               <div className="text-white text-[14px] md:text-[15px] leading-[1.75] font-medium opacity-90">
                 {event.additionalText}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
