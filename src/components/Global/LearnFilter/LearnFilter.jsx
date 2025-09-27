import React from "react";

function LearnFilter({
  t,
  searchDate,
  setSearchDate,
  type,
  setType,
  theme,
  setTheme,
}) {
  return (
    <div>
      <div className=" w-full   px-4">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#457DF6] px-6 py-6 text-white shadow-xl sm:px-8 sm:py-8">
          <h2 className="text-xl font-bold sm:text-2xl">
            {t("What do you want to learn?")}
          </h2>
          <div className=" grid grid-cols-1 gap-3 mt-4 sm:grid-cols-5">
            {/* Search by Date */}

            <input
              id="course-date"
              type="text"
              placeholder="Search by Date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="h-10 w-full col-span-2 rounded-md border-0 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 outline-none ring-2 ring-transparent focus:ring-white/80"
            />

            {/* Type */}
            <label className="sr-only" htmlFor="course-type">
              Type
            </label>
            <input
              id="course-type"
              type="text"
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-10 w-full rounded-md border-0 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 outline-none ring-2 ring-transparent focus:ring-white/80"
            />

            {/* Theme */}
            <label className="sr-only" htmlFor="course-theme">
              Theme
            </label>
            <input
              id="course-theme"
              type="text"
              placeholder="Theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="h-10 w-full rounded-md border-0 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 outline-none ring-2 ring-transparent focus:ring-white/80"
            />

            {/* Search Button */}
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-[#1f3fb3] shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/80"
              aria-label="Search"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnFilter;
