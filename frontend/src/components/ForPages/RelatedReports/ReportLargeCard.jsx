import React from "react";

import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const ReportLargeCard = ({ report }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/related-reports/${report.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image Left */}
        <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden bg-gray-200">
          <img
            src={report?.images?.[0]?.image || report?.image_url}
            alt={report.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Content Right */}
        <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
          {report.happened_at && (
            <span className="inline-block bg-[#FFB6C1] text-[#285688] text-xs px-3 py-1 rounded-full w-fit mb-3 font-semibold">
              {new Date(report.happened_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}

          <div className="flex-1">
            <h2 className="font-black text-[#081945] text-xl md:text-2xl mb-3 line-clamp-3">
              {report.title}
            </h2>
            <p className="text-[#285688] text-sm md:text-base leading-relaxed line-clamp-2">
              {report.description}
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            <button className="inline-flex items-center gap-2 flex-1 bg-[#285688] hover:bg-[#1e3f5a] text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm justify-center">
              View Details
            </button>
            {report.external_link && (
              <a
                href={report.external_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-2 bg-white border border-[#285688] hover:bg-[#E8F1F7] text-[#285688] px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportLargeCard;
