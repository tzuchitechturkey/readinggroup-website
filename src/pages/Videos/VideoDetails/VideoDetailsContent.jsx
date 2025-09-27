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
import { allVideos, topCast } from "@/mock/Viedeos";

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
      <div className="  bg-black text-white relative -z-10   ">
        {/* Hero Section with Background */}
        <div className="relative  h-[85vh]">
          {/* Background Image */}
          <div className="absolute inset-0 ">
            <img
              src={videoData.backgroundImage}
              alt="a"
              className="w-full h-[85%] bg-cover bg-center bg-no-repeat"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0  bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="absolute  inset-0  bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full p-7 pb-20">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl  mb-5 leading-tight">
                {videoData.title}
              </h1>

              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                {videoData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-2 sm:px-4 text-[#D9D9D9CC] bg-opacity-70 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium ${
                      index === 0 ? "border border-white/50" : ""
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                <span className="px-3 py-2 sm:px-4 text-[#D9D9D9CC] bg-opacity-70 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium ">
                  {videoData.duration}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Start Blur Background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/70 to-transparent z-19" />
      </div>
      {/* Start End Section */}
      {/* Start Buttons */}
      <div className="flex items-center justify-between px-7 -mt-16 relative z-10">
        {/* Start Action  */}
        <div className="flex items-start  gap-8 ">
          <Link
            to={`/videos/${1}`}
            className="flex items-center w-full sm:w-auto bg-black text-white rounded-full hover:scale-105 transition-all duration-200 px-6 sm:px-8 py-3 text-base sm:text-lg shadow-xl"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 fill-black" />
            <span>{t("Watch Now")}</span>
          </Link>

          <button
            variant="outline"
            size="lg"
            className=" bg-white flex items-center w-full sm:w-auto border-[1px] border-text rounded-full text-text hover:scale-105 duration-300 px-4 sm:px-6 py-3 text-base sm:text-lg backdrop-blur-sm"
          >
            <img
              src="../../../../src/assets/icons/wishlist-icon.png"
              alt="wishlist"
              className="w-[14px] h-[14px] object-contain  mr-2"
            />
            {t("Add Watchlist")}
          </button>
        </div>
        {/* End Action  */}

        {/* Start Action Icons */}
        <div className="flex items-center gap-6">
          <button
            className="p-3 rounded-full bg-black  hover:bg-opacity-80 hover:scale-110 transition-all duration-300"
            title="Add to Favorites"
          >
            <Heart className="w-6 h-6 text-white opacity-80" />
          </button>
          <button
            className="p-3 rounded-full bg-black   hover:bg-opacity-80 hover:scale-110 transition-all duration-300"
            title="Download"
          >
            <Download className="w-6 h-6  text-white opacity-80 " />
          </button>
          <button
            className="p-3 rounded-full bg-black   hover:bg-opacity-80 hover:scale-110 transition-all duration-300"
            title="Share"
          >
            <Share2 className="w-6 h-6  text-white opacity-80" />
          </button>
        </div>
        {/* End Action Icons */}
      </div>
      {/* End Buttons */}
      {/* Start Description && Top Cast */}
      <div className=" py-8 px-8">
        {/* Start Description */}
        <div className="">
          <p className="  text-text leading-relaxed ">
            {videoData.description}
          </p>
        </div>
        {/* End Description */}
        {/* Start Top Cast Section */}
        <div>
          <h2 className="text-3xl font-medium mt-8 mb-2">Top Cast</h2>
          {/* Cast Carousel */}
          <Carousel className="w-full overflow-visible">
            <CarouselContent className="-ml-4 overflow-visible">
              {topCast.map((person) => (
                <CarouselItem
                  key={person.id}
                  className="pl-4 py-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-[15%] overflow-visible"
                >
                  <div className="flex gap-3 items-center group cursor-pointer p-3 rounded-lg  transition-all duration-300">
                    {/* Profile Image */}
                    <div className="">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-12 h-12 rounded-full object-cover group-hover:scale-110 transition-transform duration-300 border-2 border-transparent group-hover:border-white/30"
                      />
                    </div>

                    {/* Name */}
                    <p className="font-semibold text-sm text-text transition-colors line-clamp-2">
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
      <div className="px-8 py-6">
        <TabsSection />
      </div>
      {/* End Episodes && User Reviews */}
      {/* Start Lits */} {/* Start TOP 5 */}
      <div className="">
        <DynamicSection
          title="Top 5 in your like"
          titleClassName="text-[30px] font-medium mb-2"
          data={allVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End TOP 5 */}
      {/* Start My LIST */}
      <div className="my-3">
        <DynamicSection
          title="My LIST"
          titleClassName="text-[30px] font-medium mb-2"
          data={allVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End My LIST */}
      {/* Start Full Video */}
      <div className="my-3">
        <DynamicSection
          title="Full Video"
          titleClassName="text-[30px] font-medium mb-2"
          data={allVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End Full Video */}
      {/* Start Unit  Video */}
      <div className="my-3">
        <DynamicSection
          title="Unit  Video"
          titleClassName="text-[30px] font-medium mb-2"
          data={allVideos}
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
