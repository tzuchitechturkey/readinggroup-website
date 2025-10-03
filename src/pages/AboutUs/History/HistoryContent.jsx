import React from "react";

import { useTranslation } from "react-i18next";

import SimpleTimeline from "@/components/ForPages/AboutUs/History/Timeline/Timeline";
import { resolveAsset } from "@/utils/assetResolver";
// بيانات التاريخ المخصصة للتاريخ
const historyTimelineData = [
  {
    id: 1,
    year: "2010",
    title: "تأسيس المجموعة",
    description:
      "تم تأسيس مجموعة القراءة كمبادرة صغيرة لتشجيع حب القراءة في المجتمع. بدأنا بمجموعة صغيرة من المتطوعين الذين يؤمنون بقوة الكتاب في تغيير الحياة.",
    image: resolveAsset("1-top5.jpg"),
    hasButton: true,
    alignment: "right",
  },
  {
    id: 2,
    year: "2012",
    title: "أول مكتبة مجتمعية",
    description:
      "افتتحنا أول مكتبة مجتمعية مجانية، والتي أصبحت نقطة تجمع لعشاق القراءة. تضمنت المكتبة أكثر من 1000 كتاب في مختلف المجالات.",
    image: null,
    hasButton: false,
    alignment: "left",
  },
  {
    id: 3,
    year: "2015",
    title: "برنامج القراءة للأطفال",
    description:
      "أطلقنا برنامجاً متخصصاً لتشجيع الأطفال على القراءة، والذي شمل ورش عمل تفاعلية وقصص مصورة. استفاد من البرنامج أكثر من 500 طفل في العام الأول.",
    image: null,
    hasButton: false,
    alignment: "right",
  },
  {
    id: 4,
    year: "2018",
    title: "التوسع الرقمي",
    description:
      "انتقلنا إلى العصر الرقمي بإطلاق منصتنا الإلكترونية التي تتيح للأعضاء الوصول إلى آلاف الكتب الرقمية ومشاركة تجاربهم القرائية.",
    image: resolveAsset("2-top5.jpg"),
    hasButton: true,
    alignment: "left",
  },
  {
    id: 5,
    year: "2020",
    title: "مواجهة التحديات",
    description:
      "خلال جائحة كوفيد-19، نجحنا في الحفاظ على نشاطاتنا من خلال التحول الكامل إلى النشاطات الافتراضية، مما مكننا من الوصول لجمهور أوسع.",
    image: resolveAsset("3-top5.jpg"),
    hasButton: false,
    alignment: "right",
  },
  {
    id: 6,
    year: "2023",
    title: "المستقبل الآن",
    description:
      "اليوم، نفتخر بكوننا أكبر مجتمع للقراءة في المنطقة مع أكثر من 10,000 عضو نشط و 50 مكتبة مجتمعية منتشرة في مختلف المدن.",
    image: resolveAsset("4-top5.jpg"),
    hasButton: true,
    alignment: "left",
  },
];

const AboutHistoryContent = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("About Us History (Timeline)")}
          </h2>
        </div>

        <SimpleTimeline data={historyTimelineData} className="rtl" />
      </div>
    </div>
  );
};

export default AboutHistoryContent;
