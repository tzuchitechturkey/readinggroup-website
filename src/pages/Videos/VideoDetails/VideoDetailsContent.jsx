import React from "react";

import { Play, Heart, Download, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import TabsSection from "@/components/ForPages/Videos/VideoDetails/TabsSections/TabSections";
import { mockVideos, topCast } from "@/mock/Viedeos";

function VideoDetailsContent() {
  const { t } = useTranslation();
  const videoData = {
    title: "Tzu Chi Visits Syrian Lands",
    tags: ["Journey", "Documentary", "Humanitarian"],
    duration: "1h 28m",
    description:
      "In this heartfelt documentary, Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict. Through touching encounters with families and volunteers, the film highlights real stories of hope, resilience, and compassion that shine through even in the most challenging times.",
    backgroundImage: "/src/assets/authback.jpg",
  };

  return (
    <div>
      {/* Start Hero Section */}
      <div className="bg-black text-white relative -z-10">
        {/* Hero Section with Background */}
        <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={videoData.backgroundImage}
              alt="Video background"
              className="w-full h-[85%] object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full px-4 sm:px-6 md:px-8 lg:px-12 pb-12 sm:pb-16 md:pb-20">
            <div className="max-w-4xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-5 leading-tight font-bold">
                {videoData.title}
              </h1>

              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                {videoData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 sm:px-3 sm:py-2 md:px-4 text-[#D9D9D9CC] bg-black/30 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium ${
                      index === 0 ? "border border-white/50" : ""
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                <span className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 text-[#D9D9D9CC] bg-black/30 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                  {videoData.duration}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Start Blur Background */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-white via-white/50 to-transparent z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-10 md:h-12 bg-gradient-to-t from-white/70 to-transparent z-19" />
      </div>
      {/* Start End Section */}
      {/* Start Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 -mt-12 sm:-mt-14 md:-mt-16 relative z-10 gap-4 sm:gap-0">
        {/* Start Action  */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 md:gap-8 w-full sm:w-auto mt-2 md:mt-0">
          <Link
            to={`/videos/${1}`}
            className="flex items-center justify-center w-full sm:w-auto bg-black text-white rounded-full hover:scale-105 transition-all duration-200 px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg shadow-xl"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 fill-white" />
            <span>{t("Watch Now")}</span>
          </Link>

          <button
            variant="outline"
            size="lg"
            className="bg-white flex items-center justify-center w-full sm:w-auto border-[1px] border-text rounded-full text-text hover:scale-105 duration-300 px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg backdrop-blur-sm"
          >
            <img
              src="../../../../src/assets/icons/wishlist-icon.png"
              alt="wishlist"
              className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] object-contain mr-2"
            />
            {t("Add Watchlist")}
          </button>
        </div>
        {/* End Action  */}

        {/* Start Action Icons */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-0">
          <button
            className="p-2 sm:p-3 rounded-full bg-black hover:bg-opacity-80 hover:scale-110 transition-all duration-300"
            title="Add to Favorites"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white opacity-80" />
          </button>
          <button
            className="p-2 sm:p-3 rounded-full bg-black hover:bg-opacity-80 hover:scale-110 transition-all duration-300"
            title="Download"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white opacity-80" />
          </button>
          <button
            className="p-2 sm:p-3 rounded-full bg-black hover:bg-opacity-80 hover:scale-110 transition-all duration-300"
            title="Share"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white opacity-80" />
          </button>
        </div>
        {/* End Action Icons */}
      </div>
      {/* End Buttons */}
      {/* Start Description && Top Cast */}
      <div className="py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Start Description */}
        <div className="mb-6 sm:mb-8">
          <p className="text-sm sm:text-base md:text-lg text-text leading-relaxed max-w-4xl">
            {videoData.description}
          </p>
        </div>
        {/* End Description */}
        {/* Start Top Cast Section */}
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-3 sm:mb-4 md:mb-6">
            {t("Top Cast")}
          </h2>
          {/* Cast Carousel */}
          <Carousel className="w-full overflow-visible">
            <CarouselContent className="-ml-2 sm:-ml-4 overflow-visible">
              {topCast.map((person) => (
                <CarouselItem
                  key={person.id}
                  className="pl-2 sm:pl-4 py-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[15%] overflow-visible"
                >
                  <div className="flex gap-2 sm:gap-3 items-center group cursor-pointer p-2 sm:p-3 rounded-lg transition-all duration-300">
                    {/* Profile Image */}
                    <div className="">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover group-hover:scale-110 transition-transform duration-300 border-2 border-transparent group-hover:border-white/30"
                      />
                    </div>

                    {/* Name */}
                    <p className="font-semibold text-xs sm:text-sm md:text-base text-text transition-colors line-clamp-2">
                      {person.name}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        {/* End Top Cast Section */}
      </div>
      {/* End Description && Top Cast */}
      {/* Start Episodes && User Reviews */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">
        <TabsSection />
      </div>
      {/* End Episodes && User Reviews */}
      {/* Start Lists */}
      {/* Start TOP 5 */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12  sm:py-6">
        <DynamicSection
          title="Top 5 in your like"
          titleClassName="text-[21px] sm:text-2xl md:text-3xl font-medium mb-3 sm:mb-4 md:mb-6"
          data={mockVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End TOP 5 */}
      {/* Start My LIST */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6">
        <DynamicSection
          title="My LIST"
          titleClassName="text-[21px] sm:text-2xl md:text-3xl font-medium mb-3 sm:mb-4 md:mb-6"
          data={mockVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End My LIST */}
      {/* Start Full Video */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6">
        <DynamicSection
          title="Full Video"
          titleClassName="text-[21px] sm:text-2xl md:text-3xl font-medium mb-3 sm:mb-4 md:mb-6"
          data={mockVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End Full Video */}
      {/* Start Unit Video */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6">
        <DynamicSection
          title="Unit Video"
          titleClassName="text-xl sm:text-2xl md:text-3xl font-medium mb-3 sm:mb-4 md:mb-6"
          data={mockVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End Unit  Video */}
      {/* End Lits */}
    </div>
  );
}

export default VideoDetailsContent;
