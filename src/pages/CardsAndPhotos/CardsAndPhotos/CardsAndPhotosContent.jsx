import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import { readings } from "@/mock/reading";
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import CardsAndPhotosTabs from "@/components/ForPages/CardsAndPhotos/CardsAndPhotosTabs/CardsAndPhotosTabs";
import WeeklyMoments from "@/components/ForPages/Home/WeeklyMomentsSection/WeeklyMoments";
import WeekPhotos from "@/components/ForPages/Home/WeekPhotosSection/WeekPhotos";
import LearnFilter from "@/components/Global/LearnFilter/LearnFilter";
import heroImg from "@/assets/guiding-image.png";

function CardsAndPhotosContent() {
  const { t } = useTranslation();
  const [searchDate, setSearchDate] = useState("");
  const [type, setType] = useState("");
  const [theme, setTheme] = useState("");

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      {/* Header with hero image */}
      <div className="relative">
        <img
          src={heroImg}
          alt="Guiding"
          className="h-[60vh] w-full object-cover"
        />

        {/* Start FIlter */}
        <LearnFilter
          t={t}
          searchDate={searchDate}
          setSearchDate={setSearchDate}
          type={type}
          setType={setType}
          theme={theme}
          setTheme={setTheme}
        />
        {/* End FIlter */}
      </div>

      {/* Content container */}
      <div className="mx-auto   max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <h1 className=" text-center text-6xl font-bold  mt-5  ">
          Browse Our Top Courses
        </h1>
      </div>
      {/* Start Tabs */}
      <CardsAndPhotosTabs />
      {/* End Tabs */}

      <div className="grid grid-cols-2 px-12 my-6 ">
        {/* Start Image */}
        <div className="mt-8">
          <img
            src="../../../src/assets/authback.jpg"
            alt="text"
            className="w-full h-full rounded-xl"
          />
        </div>
        {/* End Image */}
        {/* Start Grid Cards */}
        <div className=" px-7">
          {/* Start Title */}
          <h2 className="text-2xl font-bold">This Week’s Good Effect Cards</h2>
          {/* End Title */}
          {/* Start Cards */}
          <div className="grid grid-cols-2 gap-7 ">
            {readings?.slice(0, 4).map((item, index) => (
              <div key={index}>
                <GuidingReadingcard item={item} />
              </div>
            ))}
          </div>
          {/* End Cards */}
        </div>
        {/* End Grid Cards */}
      </div>
      {/* Start Weekly Moments */}
      <WeeklyMoments />
      {/* End Weekly Moments */}
      {/* Start Week's Photos */}
      <WeekPhotos />
      {/* End Week's Photos */}
    </div>
  );
}

export default CardsAndPhotosContent;
