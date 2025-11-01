import React from "react";

const NewsCard = ({ t, article, onClick, imgClassName }) => (
  <article
    className="group flex gap-2 cursor-pointer transition-all duration-200 hover:bg-white/5 hover:-translate-y-0.5 focus:outline-2 focus:outline-white/50 focus:outline-offset-2 rounded-lg p-2"
    onClick={() => onClick?.(article)}
    tabIndex={0}
  >
    <div
      className={`w-24 h-16 sm:w-32 sm:h-20 ${imgClassName} flex-shrink-0 overflow-hidden rounded-lg bg-gray-200`}
    >
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 will-change-transform"
        loading="lazy"
      />
    </div>
    <div className="flex flex-col justify-around flex-1 min-w-0">
      <h3 className="text-base sm:text-lg lg:text-xl font-medium text-text leading-tight group-hover:text-text/90 transition-colors line-clamp-2 overflow-hidden text-ellipsis">
        {article.title}
      </h3>
      {/* Start ArticleMetadata */}
      <div
        className={`flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-text/80 `}
      >
        <span className="truncate max-w-[120px] sm:max-w-none">
          {article.country} 
        </span>
        <span className="whitespace-nowrap">
          {article.created_at.split(" ")[0]}
        </span>
      </div>
      {/* End ArticleMetadata */}
    </div>
  </article>
);

export default NewsCard;
