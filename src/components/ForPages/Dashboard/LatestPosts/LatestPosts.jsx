import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "react-i18next";

import SubMenu from "@/components/Global/SubMenu/SubMenu";
import userAvatar from "@/assets/Beared Guy02-min 1.png";

const posts = [
  {
    title: "Weekly Feature",
    subtitle: "Health tech",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    active: false,
    items: [
      {
        label: "This Week",
        url: "#",
      },
    ],
  },
  {
    title: "Guided Reading",
    subtitle: "Quick start",
    excerpt:
      "Lorem ipsum dolor sit amet, elit sit consectetur adipiscing elit.",
    active: true,
    items: [
      {
        label: "This Week",
        url: "#",
      },
    ],
  },
  {
    title: "Incentive Card",
    subtitle: "Community initiative",
    excerpt:
      "Lorem ipsum dolor sit amet, turpis consectetur adipiscing sit amet elit.",
    active: false,
    items: [
      {
        label: "This Week",
        url: "#",
      },
    ],
  },
  {
    title: "Latest News",
    subtitle: "Event report",
    excerpt:
      "Lorem ipsum dolor sit amet, elit sit consectetur adipiscing elit.",
    active: false,
    items: [
      {
        label: "This Week",
        url: "#",
      },
    ],
  },
  {
    title: "Latest News",
    subtitle: "Event report",
    excerpt:
      "Lorem ipsum dolor sit amet, elit sit consectetur adipiscing elit.",
    active: false,
    items: [
      {
        label: "This Week",
        url: "#",
      },
    ],
  },
];

function LatestPosts() {
  const { t } = useTranslation();
  const [data] = useState(posts);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  //   const getData = async () => {
  //     try {
  //       const res = await GetLatestPosts();
  //       setData(res?.data?.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   useEffect(() => {
  //     getData();
  //   }, []);
  return (
    <aside className="bg-white rounded-lg border mr-6 border-gray-200 w-80 md:w-96">
      <div className="px-4 sm:px-6 py-4 border-b">
        <h3 className="text-base sm:text-lg font-semibold text-[#1D2630]">
          {t("Latest Posts")}
        </h3>
      </div>
      <div className="divide-y">
        {data.map((p, i) => (
          <div key={i} className="">
            <div
              key={i}
              className={`p-3   flex gap-3 ${
                p.active
                  ? "bg-gradient-to-r from-[#4786CB] to-white"
                  : "bg-gradient-to-r from-white to-white"
              }`}
            >
              {/* Start User Avatar */}
              <div className="flex-shrink-0 -mt-1 rounded-full">
                <img
                  src={userAvatar}
                  alt="icon"
                  className="w-8 h-8 rounded-full"
                />
              </div>
              {/* End User Avatar */}

              <div>
                <div className="flex items-center gap-1">
                  {/* Start Edge Arrow */}
                  <div className="p-1 w-5 h-5 flex items-center justify-center bg-[#E4E4E4] rounded-md">
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-3 h-3 text-[#333]"
                    />
                  </div>
                  {/* End Edge Arrow */}

                  <div>
                    <p className="text-sm font-medium text-[#0057B7]">
                      {t(p.title)}
                    </p>
                    <p className="text-sm text-[#060606]">{t(p.subtitle)}</p>
                  </div>
                  <div className="ml-auto">
                    <SubMenu
                      isOpen={openMenuIndex === i}
                      onOpenChange={(v) => setOpenMenuIndex(v ? i : null)}
                      items={p.items}
                      iconSize={12}
                    />
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#0057B7]">{p.excerpt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default LatestPosts;
