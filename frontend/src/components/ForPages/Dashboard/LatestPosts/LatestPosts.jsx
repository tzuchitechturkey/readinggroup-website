import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function LatestPosts({ data, onSectionChange }) {
  const { t, i18n } = useTranslation();

  const htmlToText = (html) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };
  const getPreviewText = (html, limit = 120) => {
    const text = htmlToText(html);
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };
  return (
    <aside
      className="bg-white rounded-lg border   border-gray-200 w-80 w-full"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="px-4 sm:px-6 py-4 border-b">
        <h3 className="text-base sm:text-lg font-semibold text-[#1D2630]">
          {t("Latest Posts")}
        </h3>
      </div>
      <div className="divide-y">
        {data?.map((p, i) => (
          <div
            key={i}
            onClick={() => {
              onSectionChange("createOrEditPost", p);
            }}
            className="relative cursor-pointer"
          >
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
                  src={p?.image || p?.image_url}
                  alt="icon"
                  className="w-8 h-8 rounded-full"
                />
              </div>
              {/* End User Avatar */}

              <div>
                <div className="flex items-center gap-1 ">
                  {/* Start Edge Arrow */}
                  <div className=" w-5 h-5 flex items-center justify-center bg-[#E4E4E4] rounded-md">
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-3 h-3 text-[#333]"
                    />
                  </div>
                  {/* End Edge Arrow */}

                  <div className="mx-2">
                    <p className="text-sm font-medium text-[#0057B7]">
                      {t(p.title)}
                    </p>
                    <p className="text-sm text-[#060606]">{t(p.subtitle)}</p>
                  </div>
                  {/* 
                  <div className="absolute top-2 right-3 ml-auto ">
                    <SubMenu
                      isOpen={openMenuIndex === i}
                      onOpenChange={(v) => setOpenMenuIndex(v ? i : null)}
                      items={p.items}
                      iconSize={12}
                    />
                  </div> */}
                </div>

                <p className="mt-3 mx-2 text-sm text-[#0057B7]">
                  {getPreviewText(p?.body, 120)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default LatestPosts;
