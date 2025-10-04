import React from "react";

import { useTranslation } from "react-i18next";

const NewsSection = () => {
  const { t } = useTranslation();
  // Data for the news sections
  const recommendationNews = [
    {
      id: 1,
      title: "Fitness Trends That Will Dominate This Year!",
      author: "John Deep",
      date: "Jan 13, 2025",
    },
    {
      id: 2,
      title: "How Gen Z is Changing the Workplace Forever",
      author: "Ryan Cooper",
      date: "Jan 13, 2025",
    },
    {
      id: 3,
      title: "Gaming Industry Shakeup: What's Next for Esports?",
      author: "Jake Wilson",
      date: "Dec 28, 2024",
    },
  ];

  const trendingNews = [
    {
      id: 4,
      title: "Inside the World's Most Advanced Smart Cities",
      author: "Olivia Cartere",
      date: "Nov 14, 2024",
      image: "/src/assets/1-top5.jpg",
    },
    {
      id: 5,
      title: "How Streaming Services Are Changing Entertainment",
      author: "Jason Mitchell",
      date: "Jan 13, 2025",
      image: "/src/assets/2-top5.jpg",
    },
    {
      id: 6,
      title: "The Rise of Sustainable Fashion",
      author: "Emily Thompson",
      date: "Jan 16, 2025",
      image: "/src/assets/3-top5.jpg",
    },
    {
      id: 7,
      title: "New Space Missions Set to Change Astronomy",
      author: "Robert Chen",
      date: "Jan 16, 2025",
      image: "/src/assets/4-top5.jpg",
    },
  ];

  const breakingNews = [
    {
      id: 8,
      title: "The Dark Side of AI: Ethical Concerns & Risks",
      author: "Anthony Rivera",
      date: "Jan 13, 2025",
      image: "/src/assets/testCard.png",
    },
    {
      id: 9,
      title: "How Minimalism is Changing Interior Design",
      author: "Rachel Stevens",
      date: "Jan 13, 2025",
      image: "/src/assets/1-top5.jpg",
    },
    {
      id: 10,
      title: "Hollywood's Biggest Movie Releases This Year",
      author: "Alex Johnson",
      date: "Jan 15, 2025",
      image: "/src/assets/2-top5.jpg",
    },
    {
      id: 11,
      title: "Is Cloud Gaming the Future of Play?",
      author: "John Doe",
      date: "Jan 13, 2025",
      image: "/src/assets/3-top5.jpg",
    },
    {
      id: 12,
      title: "The Rise of K-Pop: What's Next for the Global Phenomenon?",
      author: "Shin tae yong",
      date: "Jan 13, 2025",
      image: "/src/assets/4-top5.jpg",
    },
    {
      id: 13,
      title: "The Future of Work: Remote, Hybrid, or Back to Office?",
      author: "Jim corry",
      date: "Jan 13, 2025",
      image: "/src/assets/testCard.png",
    },
  ];

  const latestUpdates = [
    {
      id: 14,
      title: "Is Cloud Gaming the Future of Play?",
      author: "John Doe",
      date: "Jan 13, 2025",
      image: "/src/assets/3-top5.jpg",
    },
    {
      id: 15,
      title: "Trends You Need to Try This Year",
      author: "John Doe",
      date: "Jan 13, 2025",
      image: "/src/assets/testCard.png",
    },
    {
      id: 16,
      title: "The Rise of K-Pop: What's Next for the Global Phenomenon?",
      author: "Shin tae yong",
      date: "Jan 13, 2025",
      image: "/src/assets/4-top5.jpg",
    },
    {
      id: 17,
      title: "The Future of Work: Remote, Hybrid, or Back to Office?",
      author: "Jim corry",
      date: "Jan 13, 2025",
      image: "/src/assets/testCard.png",
    },
  ];

  const categories = [
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
  ];

  const SectionTitle = ({ title }) => (
    <div className="flex items-center gap-6 mb-12">
      <div className="w-4 h-12 bg-white" />
      <h2 className="text-3xl font-medium text-white tracking-tight">
        {t(title)}
      </h2>
    </div>
  );

  const NewsCard = ({ article, showImage = false, imageSize = "large" }) => (
    <article className="flex gap-3 items-start hover:bg-white/5 p-3 rounded-lg transition-colors cursor-pointer">
      {showImage && (
        <img
          src={article.image}
          alt={article.title}
          className={`object-cover rounded-lg flex-shrink-0 ${
            imageSize === "small" ? "w-36 h-24" : "w-52 h-36"
          }`}
          loading="lazy"
        />
      )}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        <h3
          className={`font-medium text-white leading-tight line-clamp-2 ${
            imageSize === "small" ? "text-xl" : "text-3xl"
          }`}
        >
          {article.title}
        </h3>
        <div className="flex items-center gap-6 text-white/80 text-lg">
          <span>
            {t("By")} {article.author}
          </span>
          <div className="w-px h-6 bg-white/50" />
          <span>{article.date}</span>
        </div>
      </div>
    </article>
  );

  const SimpleNewsCard = ({ article }) => (
    <article className="flex flex-col gap-3">
      <h3 className="text-2xl font-medium text-white leading-tight line-clamp-2">
        {article.title}
      </h3>
      <div className="flex items-center gap-6 text-white/80 text-lg">
        <span>
          {t("By")} {article.author}
        </span>
        <div className="w-px h-6 bg-white/50" />
        <span>{article.date}</span>
      </div>
    </article>
  );

  const CategoryButton = ({ label }) => (
    <button className="bg-zinc-600 hover:bg-zinc-500 px-6 py-2 rounded text-gray-200 text-base transition-colors shadow-md">
      {t(label)}
    </button>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-16">
      {/* Recommendation News Section */}
      <section>
        <SectionTitle title="news.recommendation" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendationNews.map((article) => (
            <SimpleNewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Trending Now */}
        <div className="lg:col-span-2">
          <section className="mb-16">
            <SectionTitle title="news.trending" />
            <div className="space-y-8">
              {trendingNews.map((article) => (
                <NewsCard key={article.id} article={article} showImage={true} />
              ))}
            </div>
          </section>

          {/* Breaking News */}
          <section>
            <SectionTitle title="news.breaking" />
            <div className="space-y-8">
              {breakingNews.map((article) => (
                <NewsCard key={article.id} article={article} showImage={true} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-16">
          {/* Latest Updates */}
          <section>
            <SectionTitle title="news.latest" />
            <div className="space-y-6">
              {latestUpdates.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  showImage={true}
                  imageSize="small"
                />
              ))}
            </div>
          </section>

          {/* Tags Category */}
          <section>
            <SectionTitle title="news.tags" />
            <div className="flex flex-wrap gap-4">
              {categories.map((category, index) => (
                <CategoryButton key={index} label={t(category)} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
