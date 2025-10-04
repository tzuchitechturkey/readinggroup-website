import React from "react";

import { useTranslation } from "react-i18next";

import NewsCard from "@/components/ForPages/Connect/NewsCard/NewsCard";
import RecommendationNewsCard from "@/components/ForPages/Connect/RecommendationNewsCard/RecommendationNewsCard";
import CategoryTag from "@/components/ForPages/Connect/CategoryTag/CategoryTag";

const EventstNewsSection = () => {
  const { t } = useTranslation();
  // Static data - يمكن استبدالها ببيانات ديناميكية
  const data = {
    recommendationNews: [
      {
        id: 1,
        title: "Fitness Trends That Will Dominate This Year!",
        author: "John Deep",
        date: "Jan 13, 2025",
        category: "Health & Wellness",
      },
      {
        id: 2,
        title: "How Gen Z is Changing the Workplace Forever",
        author: "Ryan Cooper",
        date: "Jan 13, 2025",
        category: "Business & Economy",
      },
      {
        id: 3,
        title: "Gaming Industry Shakeup: What's Next for Esports?",
        author: "Jake Wilson",
        date: "Dec 28, 2024",
        category: "Gaming",
      },
    ],

    trendingNews: [
      {
        id: 4,
        title: "Inside the World's Most Advanced Smart Cities",
        author: "Olivia Cartere",
        date: "Nov 14, 2024",
        image: "/1-top5.jpg",
        category: "Tech & Innovation",
      },
      {
        id: 5,
        title: "How Streaming Services Are Changing Entertainment",
        author: "Jason Mitchell",
        date: "Jan 13, 2025",
        image: "/2-top5.jpg",
        category: "Entertainment",
      },
      {
        id: 6,
        title: "The Rise of Sustainable Fashion",
        author: "Emily Thompson",
        date: "Jan 16, 2025",
        image: "/3-top5.jpg",
        category: "Lifestyle",
      },
      {
        id: 7,
        title: "New Space Missions Set to Change Astronomy",
        author: "Robert Chen",
        date: "Jan 16, 2025",
        image: "/4-top5.jpg",
        category: "Science",
      },
    ],

    breakingNews: [
      {
        id: 8,
        title: "The Dark Side of AI: Ethical Concerns & Risks",
        author: "Anthony Rivera",
        date: "Jan 13, 2025",
        image: "/testCard.png",
        category: "Tech & Innovation",
      },
      {
        id: 9,
        title: "How Minimalism is Changing Interior Design",
        author: "Rachel Stevens",
        date: "Jan 13, 2025",
        image: "/1-top5.jpg",
        category: "Lifestyle",
      },
      {
        id: 10,
        title: "Hollywood's Biggest Movie Releases This Year",
        author: "Alex Johnson",
        date: "Jan 15, 2025",
        image: "/2-top5.jpg",
        category: "Entertainment",
      },
      {
        id: 11,
        title: "Is Cloud Gaming the Future of Play?",
        author: "John Doe",
        date: "Jan 13, 2025",
        image: "/3-top5.jpg",
        category: "Gaming",
      },
      {
        id: 12,
        title: "The Rise of K-Pop: What's Next for the Global Phenomenon?",
        author: "Shin tae yong",
        date: "Jan 13, 2025",
        image: "/4-top5.jpg",
        category: "Entertainment",
      },
      {
        id: 13,
        title: "The Future of Work: Remote, Hybrid, or Back to Office?",
        author: "Jim corry",
        date: "Jan 13, 2025",
        image: "/testCard.png",
        category: "Business",
      },
    ],

    latestUpdates: [
      {
        id: 14,
        title: "Is Cloud Gaming the Future of Play?",
        author: "John Doe",
        date: "Jan 13, 2025",
        image: "/3-top5.jpg",
      },
      {
        id: 15,
        title: "Trends You Need to Try This Year",
        author: "John Doe",
        date: "Jan 13, 2025",
        image: "/testCard.png",
      },
      {
        id: 16,
        title: "The Rise of K-Pop: What's Next for the Global Phenomenon?",
        author: "Shin tae yong",
        date: "Jan 13, 2025",
        image: "/4-top5.jpg",
      },
      {
        id: 17,
        title: "The Future of Work: Remote, Hybrid, or Back to Office?",
        author: "Jim corry",
        date: "Jan 13, 2025",
        image: "/testCard.png",
      },
      {
        id: 18,
        title: "The Future of Work: Remote, Hybrid, or Back to Office?",
        author: "Jim corry",
        date: "Jan 13, 2025",
        image: "/testCard.png",
      },
      {
        id: 19,
        title: "The Future of Work: Remote, Hybrid, or Back to Office?",
        author: "Jim corry",
        date: "Jan 13, 2025",
        image: "/testCard.png",
      },
    ],

    categories: [
      "Tech & Innovation",
      "Business & Economy",
      "Entertainment & Pop Culture",
      "Science & Discovery",
      "Health & Wellness",
      "Sports",
      "Gaming",
      "Esport",
      "Virtual Worlds",
      "Travel & Adventure",
      "Politics & Global Affairs",
      "Finance",
      "Cryptocurrency",
      "Lifestyle & Trends",
      "Social Media & Influencers",
      "Education",
      "Environment & Sustainability",
      "More",
    ],
  };

  const SectionHeader = ({ title, ornamentHeight = "h-12" }) => (
    <div className="flex items-center gap-6 mb-2">
      <div className={`w-4 ${ornamentHeight} bg-black`} />
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-text tracking-tight leading-tight">
        {title}
      </h2>
    </div>
  );

  // Event handlers - يمكن تخصيصها حسب الحاجة
  const handleArticleClick = () => {
    // يمكن إضافة منطق التنقل هنا
  };

  const handleCategoryClick = () => {
    // يمكن إضافة منطق التصفية هنا
  };

  return (
    <div className="w-full text-text py-4 sm:py-6 lg:py-8 print:bg-white print:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Recommendation News Section */}
        <section className="mb-12">
          <SectionHeader title="Recommendation News" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {data.recommendationNews.map((article) => (
              <RecommendationNewsCard
                t={t}
                key={article.id}
                article={article}
                onClick={handleArticleClick}
              />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-12">
          {/* Left Column - Main News (3/5 width) */}
          <div className="lg:col-span-3 space-y-8 lg:space-y-16 order-1">
            {/* Trending Now */}
            <section>
              <SectionHeader title="Trending Now" />
              <div className="  space-y-2 mt-5">
                {data.trendingNews.map((article) => (
                  <NewsCard
                    t={t}
                    key={article.id}
                    article={article}
                    onClick={handleArticleClick}
                    imgClassName=" md:!w-40 md:!h-28 "
                  />
                ))}
              </div>
            </section>

            {/* Breaking News */}
            <section>
              <SectionHeader title="Breaking News" />
              <div className=" space-y-2 mt-5">
                {data.breakingNews.map((article) => (
                  <NewsCard
                    imgClassName=" md:!w-40 md:!h-28 "
                    t={t}
                    key={article.id}
                    article={article}
                    onClick={handleArticleClick}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar (2/5 width) */}
          <div className="lg:col-span-2 space-y-2 order-2">
            {/* Latest Updates */}
            <section>
              <SectionHeader title="Latest Updates" ornamentHeight="h-10" />
              <div className="   max-h-screen overflow-y-auto mt-5 scrollbar-thin">
                {data.latestUpdates.map((article) => (
                  <NewsCard
                    t={t}
                    key={article.id}
                    article={article}
                    onClick={handleArticleClick}
                  />
                ))}
              </div>
            </section>

            {/* Tags Category */}
            <section className="pt-3">
              <SectionHeader title="Tags Category" ornamentHeight="h-10" />
              <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mt-5 justify-center lg:justify-start">
                {data.categories.map((category, index) => (
                  <CategoryTag
                    key={index}
                    category={category}
                    onClick={handleCategoryClick}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventstNewsSection;
