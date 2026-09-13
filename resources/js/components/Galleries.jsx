import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Galleries({ isDarkTheme = false }) {
  const portfolioSlides = [
    {
      id: 1,
      category: "PERNIKAHAN",
      title: "Dokumentasi Pernikahan",
      image: "/images/pawiwahan.jpeg",
      description:
        "Momen sakral pernikahan adat & modern yang diabadikan secara alami, sinematik, dan berkesan.",
    },
    {
      id: 2,
      category: "UPACARA YADNYA",
      title: "Upacara Adat & Sakral Bali",
      image: "/images/metatah.jpg",
      description:
        "Dokumentasi yadnya dan upacara kebudayaan Bali dengan sudut pandang eksklusif.",
    },
    {
      id: 3,
      category: "GRADUATION",
      title: "Wisuda & Personal Portrait",
      image: "/images/graduation.jpg",
      description:
        "Selebrasi momen kelulusan wisuda & potret diri dengan pengarahan gaya profesional.",
    },
    {
      id: 4,
      category: "PREWEDDING",
      title: "Prewedding Casual & Adat Bali",
      image: "/images/prewedding.jpg",
      description:
        "Sesi foto prewedding outdoor di lokasi eksotis dengan konsep estetik berkelas.",
    },
    {
      id: 5,
      category: "ACARA PERUSAHAAN",
      title: "Acara Perusahaan Kebersamaan",
      image: "/images/makan.jpeg",
      description:
        "Kegiatan perusahaan untuk membangun semangat kebersamaan, komunikasi, dan kolaborasi yang lebih baik.",
    },
  ];

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAutoSlide, setIsAutoSlide] = useState(true);

  useEffect(() => {
    if (!isAutoSlide) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % portfolioSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoSlide, portfolioSlides.length]);

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) =>
      prev === 0 ? portfolioSlides.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % portfolioSlides.length);
  };

  return (
    <section
      id="portofolio"
      className={`py-16 md:py-20 relative z-10 border-t ${isDarkTheme
        ? "bg-[#071f1b]/95 border-white/10"
        : "bg-slate-100/60 border-slate-200/80"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2
              className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 ${isDarkTheme ? "text-white" : "text-slate-900"
                }`}
            >
              <span>Galeri Portofolio & Perlengkapan Studio</span>
            </h2>
            <div className="h-1 w-28 bg-gradient-to-r from-[#21C9A4] to-[#0D9488] rounded-full mt-2" />
          </div>

        </div>


        {/* Main Grid: Left Large Preview, Right Selectable List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* LEFT COLUMN: Main Slide Preview */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-black/10 group bg-slate-950">
              {/* Main Preview Image with smooth transition */}
              <img
                key={portfolioSlides[activeSlideIndex].id}
                src={portfolioSlides[activeSlideIndex].image}
                alt={portfolioSlides[activeSlideIndex].title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />

              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

              {/* Top-Left Category Badge */}
              <div className="absolute top-5 left-5">
                <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-black uppercase tracking-wider text-white border border-white/20 shadow-lg">
                  {portfolioSlides[activeSlideIndex].category}
                </span>
              </div>
            </div>

            {/* DESCRIPTION CARD below photo */}
            <div
              className={`mt-4 flex-1 flex flex-col justify-center p-5 sm:p-6 rounded-2xl transition-all duration-500 ${
                isDarkTheme
                  ? "bg-[#0e352f]/90 border border-white/10"
                  : "bg-[#092722] border border-[#14433B]"
              }`}
            >
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                {portfolioSlides[activeSlideIndex].title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {portfolioSlides[activeSlideIndex].description}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Slide Selector Item Cards */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="px-1">
              <span
                className={`text-xs font-black uppercase tracking-wider ${isDarkTheme ? "text-slate-300" : "text-slate-600"
                  }`}
              >
                Slide Portofolio
              </span>
            </div>

            <div className="space-y-3 flex flex-col">
              {portfolioSlides.map((slide, idx) => {
                const isActive = idx === activeSlideIndex;
                return (
                  <div
                    key={slide.id}
                    onClick={() => setActiveSlideIndex(idx)}
                    className="relative cursor-pointer group pt-3.5 transition-all duration-300"
                  >
                    {/* FLOATING TOP-RIGHT CIRCULAR ARROW BUTTON */}
                    <div className="absolute top-0 right-1 z-20">
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isActive
                          ? "bg-[#21C9A4] text-[#092722] shadow-[#21C9A4]/40 scale-105 ring-4 ring-[#071f1b]"
                          : isDarkTheme
                            ? "bg-slate-800 text-[#21C9A4] ring-4 ring-[#071f1b] group-hover:bg-[#21C9A4] group-hover:text-[#092722]"
                            : "bg-slate-900 text-white ring-4 ring-slate-100/80 group-hover:bg-[#14433B]"
                          }`}
                      >
                        <ArrowUpRight
                          className={`h-5 w-5 transition-transform duration-300 ${isActive
                            ? "scale-110 stroke-[2.5]"
                            : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            }`}
                        />
                      </div>
                    </div>

                    {/* MAIN NOTCHED CARD BODY */}
                    <div
                      className={`relative p-3.5 sm:p-4 rounded-3xl transition-all duration-300 flex items-center justify-between gap-3.5 border ${isActive
                        ? "bg-[#092722] border-[#21C9A4] shadow-xl shadow-[#092722]/40 text-white ring-2 ring-[#21C9A4]/30"
                        : isDarkTheme
                          ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                          : "bg-white border-slate-200/90 text-slate-800 shadow-xs hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border border-black/10">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-[#21C9A4]/20 border-2 border-[#21C9A4] rounded-2xl" />
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0 pr-10">
                        <p
                          className={`text-[10px] font-black uppercase tracking-wider truncate ${isActive
                            ? "text-[#21C9A4]"
                            : isDarkTheme
                              ? "text-slate-400"
                              : "text-slate-500"
                            }`}
                        >
                          {slide.category}
                        </p>
                        <h4
                          className={`text-xs sm:text-sm font-bold truncate mt-1 ${isActive
                            ? "text-white"
                            : isDarkTheme
                              ? "text-slate-100"
                              : "text-slate-900"
                            }`}
                        >
                          {slide.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
