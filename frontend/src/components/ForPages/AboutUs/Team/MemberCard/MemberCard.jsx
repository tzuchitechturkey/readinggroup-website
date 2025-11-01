import React from "react";

import { Link } from "react-router-dom";

function MemberCard({ member }) {
  const handleClick = () => {
    // حفظ التاب الرئيسي (our_team)
    localStorage.setItem("aboutUsMainTab", "our_team");
    // حفظ التاب الفرعي النشط الحالي (مثل "All" أو اسم المنصب)
    const currentTab = localStorage.getItem("teamActiveTab") || "All";
    localStorage.setItem("teamActiveTab", currentTab);
  };

  return (
    <Link
      to={`/about/team/${member.id}`}
      onClick={handleClick}
      className="flex flex-col items-center p-2 sm:p-3 w-40 sm:w-48 md:w-56 hover:transform hover:scale-105 transition-all duration-200"
    >
      {/* Start Image */}
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 mb-2 rounded-lg overflow-hidden">
        <div className="relative w-full h-full border border-gray-300 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover"
          />
          {/* Blur */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded" />
        </div>
      </div>

      {/* Start Member Info */}
      <div className="text-center">
        <h3
          className="text-base sm:text-lg font-semibold text-gray-900 mb-1 uppercase tracking-wider"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          {member.name}
        </h3>
        <p
          className="text-xs sm:text-sm text-gray-600 font-light"
          style={{ fontFamily: "Lato, sans-serif" }}
        >
          {member.position?.name}
        </p>
      </div>
      {/* End Member Info */}
    </Link>
  );
}

export default MemberCard;
