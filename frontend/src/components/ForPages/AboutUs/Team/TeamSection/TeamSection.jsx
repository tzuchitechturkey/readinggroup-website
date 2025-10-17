import React from "react";

import MemberCard from "@/components/ForPages/AboutUs/Team/MemberCard/MemberCard";

function TeamSection({ team }) {
  return (
    <div className="mb-6 md:mb-8">
      <h2
        className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight text-center md:text-start"
        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
      >
        {team.name}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 justify-items-center">
        {team.members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

export default TeamSection;
