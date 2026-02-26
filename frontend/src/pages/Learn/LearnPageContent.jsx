import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LearnSidebar from "@/components/ForPages/Learn/LearnSidebar";
import LearnFilterBar from "@/components/ForPages/Learn/LearnFilterBar";
import LearnPagination from "@/components/Global/PagePagination/PagePagination";
import VerticalCard from "@/components/ForPages/Learn/VerticalCard";
import HorizontalCard from "@/components/ForPages/Learn/HorizontalCard";
import ImageViewerModal from "@/components/Global/ImageViewerModal/ImageViewerModal";

// Import images from assets/learn
import JingSi1 from "@/assets/learn/JingSiAphorism1.jpg";
import JingSi2 from "@/assets/learn/JingSiAphorism2.png";
import SloganImg from "@/assets/learn/Slogan.jpg";
import SpeakerImg from "@/assets/learn/Speaker.png";
import GoodEffectsImg from "@/assets/learn/GoodEffects.png";

const LearnPageContent = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("Jing Si Aphorisms");

  // Image Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = {
    CARDS: ["Jing Si Aphorisms", "Slogan", "Words of Encouragement"],
    POSTERS: ["Speaker Preview", "Good Effects", "Fundraising"],
  };

  // Generate data based on active category
  const getMockItems = () => {
    return Array(20)
      .fill(null)
      .map((_, index) => {
        let img = index % 2 === 0 ? JingSi1 : JingSi2;
        if (activeCategory === "Slogan") img = SloganImg;
        if (activeCategory === "Speaker Preview") img = SpeakerImg;
        if (activeCategory === "Good Effects") img = GoodEffectsImg;

        return {
          id: index,
          date: index < 10 ? "Jan 21, 2026" : "Jan 14, 2026",
          image: img,
          title: `${activeCategory} ${index + 1}`,
        };
      });
  };

  const mockItems = getMockItems();

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setCurrentImageIndex(0); // Reset index on category change
  };

  // Image Viewer Handlers
  const openViewer = (index) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockItems.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + mockItems.length) % mockItems.length,
    );
  };

  // Slogan uses Horizontal Card (16:9), others use Vertical Card (3:4)
  const isHorizontal = activeCategory === "Slogan";

  return (
    <div
      className="bg-background min-h-screen w-full"
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
      }}
      dir={i18n.dir()}
    >
      <div
        style={{
          width: "256px",
          borderRight: "1px solid #e5e7eb",
          flexShrink: 0,
        }}
      >
        <LearnSidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            paddingTop: "55px",
            paddingRight: "120px",
            paddingBottom: "162px",
            paddingLeft: "68px",
          }}
        >
          {/* Header Controls */}
          <LearnFilterBar activeCategory={activeCategory} />

          {/* Grid switching between Horizontal and Vertical layouts */}
          <div
            className={`grid ${isHorizontal ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}`}
            style={{ columnGap: "12px", rowGap: "16px" }}
          >
            {mockItems.map((item, index) =>
              isHorizontal ? (
                <HorizontalCard
                  key={item.id}
                  card={item}
                  onClick={() => openViewer(index)}
                />
              ) : (
                <VerticalCard
                  key={item.id}
                  card={item}
                  onClick={() => openViewer(index)}
                />
              ),
            )}
          </div>

          {/* Pagination */}
          <LearnPagination currentPage={1} totalPages={4} />
        </div>
      </main>

      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={closeViewer}
        images={mockItems}
        currentIndex={currentImageIndex}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
};

export default LearnPageContent;
