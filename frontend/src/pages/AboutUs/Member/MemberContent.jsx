import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaWhatsapp,
  FaTelegramPlane,
  FaDiscord,
  FaGithub,
  FaBehance,
  FaDribbble,
  FaPinterestP,
} from "react-icons/fa";

import Loader from "@/components/Global/Loader/Loader";
import { GetTeamById } from "@/api/aboutUs";

// خريطة أيقونات وسائل التواصل الاجتماعي
const socialMediaIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaTwitter,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  snapchat: FaSnapchatGhost,
  whatsapp: FaWhatsapp,
  telegram: FaTelegramPlane,
  discord: FaDiscord,
  github: FaGithub,
  behance: FaBehance,
  dribbble: FaDribbble,
  pinterest: FaPinterestP,
};
const socialColors = {
  facebook: "#4267B2",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  linkedin: "#0077B5",
  youtube: "#FF0000",
  tiktok: "#000000",
  snapchat: "#FFFC00",
  whatsapp: "#25D366",
  telegram: "#0088cc",
  discord: "#5865F2",
  github: "#171515",
  behance: "#1769ff",
  dribbble: "#ea4c89",
  pinterest: "#E60023",
};

function MemberContent() {
  const { i18n, t } = useTranslation();
  const { id: paramId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [memberData, setMemberData] = useState({});
  const navigate = useNavigate();

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await GetTeamById(paramId);
      setMemberData(response.data);
    } catch (error) {
      console.error("Error fetching member data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    // تعيين التاب الرئيسي إلى "our_team"
    localStorage.setItem("aboutUsMainTab", "our_team");
    // التاب الفرعي للفريق محفوظ بالفعل في "teamActiveTab"
    // العودة إلى صفحة About Us
    navigate("/about");
  };

  useEffect(() => {
    getData();
  }, [paramId]);
  return (
    <div
      className="min-h-[60vh]  p-8 pb-0"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      <div className="max-w-4xl mx-auto pb-32">
        {/* Start Position */}
        <div className="">
          <p className="w-fit mx-auto text-2xl font-semibold mb-10 mt-5">
            {memberData?.position?.name}
          </p>
        </div>
        {/* End Position */}
        {/* بطاقة العضو */}
        <div className="flex flex-col items-center mb-8">
          {/* Start Img */}
          <div className="relative w-40 h-40 mb-3">
            <div className="w-full h-full border-2 border-gray-600 rounded-lg overflow-hidden bg-gradient-to-b from-transparent to-black/50">
              <img
                src={memberData?.avatar}
                alt={memberData?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* End Img */}

          {/* Start member Info */}
          <div className="text-center text-text mb-4">
            <h1
              className="text-xl font-semibold uppercase mb-1 tracking-widest"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              {memberData?.name}
            </h1>
            <p
              className="text-sm font-light"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              {memberData?.position?.name}
            </p>
          </div>
          {/* End member Info */}

          {/* Start Social Media Icons */}
          <div className="flex gap-4 mb-8">
            {memberData?.social_links?.map((item) => {
              const name = item.name.toLowerCase();
              const Icon = socialMediaIcons[name];
              if (!Icon) return null;

              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-2 hover:scale-125 transition-transform duration-200"
                >
                  <Icon size={20} color={socialColors[name]} />
                </a>
              );
            })}
          </div>
          {/* End Social Media Icons */}
        </div>

        {/* Start Description */}
        <div className="text-text space-y-8 mb-16">
          {/* Start Description */}
          <div className="space-y-6">{memberData?.description}</div>
          {/* End Description */}
        </div>
        {/* End Description */}

        {/* Start Back Button */}
        <div className="border-t border-gray-300 pt-8">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded hover:bg-primary hover:text-white transition-colors duration-200"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            <ArrowLeft className="w-5 h-5" />
            {t("Go Back")}
          </button>
        </div>
        {/* End Back Button */}
      </div>
    </div>
  );
}

export default MemberContent;
