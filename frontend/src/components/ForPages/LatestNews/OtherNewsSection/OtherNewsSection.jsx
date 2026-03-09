import React, { useEffect, useState } from "react";

import NewsCard from "@/components/ForPages/LatestNews/NewsCard";
import { GetOtherLatestNews } from "@/api/latestNews";

function OtherNewsSection({ t, newsId }) {
  const [otherNews, setOtherNews] = useState([]);
  const fetchOtherNews = async () => {
    try {
      const res = await GetOtherLatestNews(newsId);
      setOtherNews(res.data || []);
    } catch (err) {
      setErrorFn(err, t);
    }
  };
  useEffect(() => {
    fetchOtherNews();
  }, []);

  return (
    <div className="mb-14">
      {/* Other News Section */}
      {otherNews.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6 ">
            <span className="h-8 w-1 rounded-full bg-[#081945] " />
            <h2 className="font-['Noto_Sans_TC:Black',sans-serif] font-black text-lg md:text-xl lg:text-3xl text-[#081945] uppercase">
              {t("OTHER NEWS")}
            </h2>
            <hr className="flex-1 h-[1px] border-none bg-[#5E82AB] " />
          </div>
          <div className="flex flex-col gap-3 md:gap-4">
            {otherNews.map((n, index) => (
              <NewsCard
                key={n.id}
                news={n}
                t={t}
                latestItem={index === otherNews.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OtherNewsSection;
