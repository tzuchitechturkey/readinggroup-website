import React from "react";

const RecommendationNewsCard = ({ t, article, onClick }) => (
  <article
    className="group cursor-pointer transition-all duration-200 hover:bg-white/5 hover:-translate-y-0.5 focus:outline-2 focus:outline-white/50 focus:outline-offset-2 py-4 rounded-lg"
    onClick={() => onClick?.(article)}
    tabIndex={0}
  >
    <div className="space-y-3">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-text leading-tight group-hover:text-text/90 transition-colors line-clamp-2 overflow-hidden text-ellipsis">
        {article.title}
      </h3>
      {/* Start ArticleMetadata */}
      <div
        className={`flex items-center gap-4 sm:gap-6 text-sm sm:text-base text-text/80 `}
      >
        <span className="truncate max-w-[150px] sm:max-w-none">
          {t("By")} {article.writer}
        </span>
        <div className={`w-px bg-text h-5 sm:h-6 flex-shrink-0`} />
        <span className="whitespace-nowrap">{article.created_at}</span>
      </div>
      {/* End ArticleMetadata */}
    </div>
  </article>
);
export default RecommendationNewsCard;
