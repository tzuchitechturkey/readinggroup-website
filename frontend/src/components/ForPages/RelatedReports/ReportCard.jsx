import React from "react";

import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const ReportCard = ({ report }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/related-reports/${report.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative w-full h-40 overflow-hidden bg-gray-200">
        <img
          src={report?.images?.[0]?.image || report?.image_url}
          alt={report.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {report.happened_at && (
          <div className="absolute top-2 left-2 bg-[#FFB6C1] text-[#285688] text-[10px] px-2 py-1 rounded-full font-bold">
            {new Date(report.happened_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
        <h3 className="font-bold text-[#081945] text-sm md:text-base line-clamp-2">
          {report.title}
        </h3>

        {report.external_link && (
          <a
            href={report.external_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-1.5 bg-[#E8F1F7] hover:bg-[#D0E4F2] text-[#285688] px-3 py-1.5 rounded text-xs font-semibold transition-colors mt-2"
          >
            <ExternalLink className="w-3 h-3" />
            View
          </a>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
