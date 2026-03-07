import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { GetCollections } from "@/api/photoCollections";
import Pagination from "@/components/Global/PagePagination/PagePagination";
// import CollectionCard from "@/components/ForPages/PhotoCollections/CollectionCard";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import CollectionCard from "@/components/ForPages/Home/shared/CollectionCard";

import Image from "../../assets/photocard.png";

const PhotoCollectionsPageContent = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    limit: 16,
    totalCount: 0,
  });

  // Fetch collections on mount or when pagination changes
  const fetchCollections = async (page = 1) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * paginationData.limit;
      const res = await GetCollections(
        paginationData.limit,
        offset,
        "",
        "-created_at",
      );

      setCollections(res.data.results || []);
      setPaginationData((prev) => ({
        ...prev,
        page,
        totalCount: res.data.count || 0,
      }));
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections(1);
  }, []);

  const handlePageChange = (newPage) => {
    fetchCollections(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Mock data for photo collections
  // const mockPhotosData = [
  //   {
  //     id: 1,
  //     date: "Jan. 21, 2026",
  //     image: Image,
  //     isNew: true,
  //   },
  //   {
  //     id: 2,
  //     date: "Dec. 31, 2025",
  //     image: Image,
  //     isNew: false,
  //   },
  //   {
  //     id: 3,
  //     date: "Dec. 24, 2025",
  //     image: Image,
  //     isNew: false,
  //   },
  //   {
  //     id: 4,
  //     date: "Dec. 17, 2025",
  //     image: Image,
  //     isNew: false,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-[#D7EAFF] py-8 md:py-12" dir={i18n.dir()}>
      {isLoading && <Loader />}

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 md:mb-14">
          <h1 className="font-['Noto_Sans_TC:Black',sans-serif] font-black text-3xl md:text-4xl lg:text-5xl text-[#081945] mb-3">
            {t("Photo Collections")}
          </h1>
          <p className="text-[#285688] text-base md:text-lg font-normal ">
            {t(
              "Explore photos from our weekly livestream sessions. Each album features highlights and behind-the-scenes moments from the gathering. Click any album to view the full collection.",
            )}
          </p>
        </div>

        {/* Grid of Collections */}
        {collections.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8">
              {collections.map((collection) => (
                <div key={collection.id}>
                  <CollectionCard
                    photo={collection}
                    t={t}
                    handleNavigate={(id) => {
                      navigate(`/photo-collections/${id}`);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {Math.ceil(paginationData.totalCount / paginationData.limit) >
              1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={paginationData.page}
                  totalPages={Math.ceil(
                    paginationData.totalCount / paginationData.limit,
                  )}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          !isLoading && (
            <div className="text-center py-20">
              <p className="text-[#285688] text-lg">
                {t("No collections found")}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PhotoCollectionsPageContent;
