import React from "react";

import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  "Guided Reading",
  "Unit Videos",
  "Full Videos",
  "Incentive Cards",
  "Good Effect Cards",
  "Health News",
  "DA AI TV",
];

const titles = [
  "Learning & Inspiration",
  "Weekly Highlight",
  "Health Focus",
  "Motivation",
  "Inspiring Stories",
];

const items = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: titles[i % titles.length],
  image: "/authback.jpg",
}));

function MediaCard({ title, image }) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-sm">
      <img src={image} alt={title} className="h-40 w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-3 left-4 text-white text-sm font-medium">
        {title}
      </div>
    </div>
  );
}

function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {items.map((it) => (
        <MediaCard key={it.id} title={it.title} image={it.image} />
      ))}
    </div>
  );
}

function Archives() {
  const { t, i18n } = useTranslation();
  return (
    <div className="w-full" dir={i18n?.language === "ar" ? "rtl" : "ltr"}>
      <Tabs defaultValue="Guided Reading" className="w-full">
        <TabsList className="bg-white shadow-none flex justify-start flex-wrap gap-6 h-auto p-0 my-5 ">
          {categories.map((c) => (
            <TabsTrigger
              key={c}
              value={c}
              className="gap-2 pb-3 rounded-none text-muted-foreground data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none"
            >
              <span className="text-sm whitespace-nowrap">{c}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((c) => (
          <TabsContent key={c} value={c} className="mt-0">
            <CategoryGrid />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default Archives;
