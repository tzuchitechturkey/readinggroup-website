import React from "react";

import { useTranslation } from "react-i18next";

import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";

const WeekPhotos = () => {
  const { t } = useTranslation();
  const photos = [
    {
      id: 1,
      title: "Alexander Readig",
      subtitle: "Session Photo",
      image: "/weekly-images.jpg",
      views: 234,
      likes: 45,
    },
    {
      id: 2,
      title: "Alexander Reading",
      subtitle: "Group Activity",
      image: "/weekly-images.jpg",
      views: 189,
      likes: 32,
    },
    {
      id: 3,
      title: "Alexander Reading",
      subtitle: "Discussion Time",
      image: "/weekly-images.jpg",
      views: 156,
      likes: 28,
    },
    {
      id: 4,
      title: "Alexander Reading",
      subtitle: "Learning Moment",
      image: "/weekly-images.jpg",
      views: 298,
      likes: 67,
    },
    {
      id: 5,
      title: "Alexander Reading",
      subtitle: "Community Event",
      image: "/weekly-images.jpg",
      views: 122,
      likes: 19,
    },
  ];

  return (
    <div className="mt-12">
      <DynamicSection
        title={t("This Week's Photos")}
        data={photos}
        isSlider={true}
        cardName={WeekPhotosCard}
      />
    </div>
  );
};

export default WeekPhotos;
