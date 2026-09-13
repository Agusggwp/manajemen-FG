import React from "react";

export default function CategoryFilter({
  isDarkTheme,
  categories = [],
  safePackages = [],
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => setSelectedCategory("ALL")}
        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
          selectedCategory === "ALL"
            ? isDarkTheme
              ? "bg-[#21C9A4] text-[#092722] shadow-lg shadow-[#21C9A4]/20 scale-105"
              : "bg-[#14433B] text-[#21C9A4] shadow-md scale-105"
            : isDarkTheme
            ? "bg-[#14433B]/70 text-[#B8C8C4] border border-white/10 hover:bg-[#14433B]"
            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
        }`}
      >
        Semua Paket ({safePackages.length})
      </button>
      {categories.map((cat) => {
        const count = safePackages.filter((p) => p.category === cat).length;
        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? isDarkTheme
                  ? "bg-[#21C9A4] text-[#092722] shadow-lg shadow-[#21C9A4]/20 scale-105"
                  : "bg-[#14433B] text-[#21C9A4] shadow-md scale-105"
                : isDarkTheme
                ? "bg-[#14433B]/70 text-[#B8C8C4] border border-white/10 hover:bg-[#14433B]"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat} ({count})
          </button>
        );
      })}
    </div>
  );
}
