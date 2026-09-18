import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Phone, LayoutDashboard, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicNavbar({
  isDarkTheme,
  companyName,
  waNumber,
  auth,
  dashboardUrl,
  showPortfolio = true,
}) {
  const brandFirstWord = companyName?.split(" ")[0] || "ARTDEVATA";
  const brandRestWords = companyName?.split(" ").slice(1).join(" ") || "Photography Bali";

  const [activeSection, setActiveSection] = useState("beranda");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: "Beranda", href: "#beranda", id: "beranda" },
    { name: "Katalog Paket", href: "#katalog", id: "katalog" },
    ...(showPortfolio ? [{ name: "Portofolio", href: "#portofolio", id: "portofolio" }] : []),
    { name: "Keunggulan", href: "#keunggulan", id: "keunggulan" },
    { name: "FAQ", href: "#faq", id: "faq" },
    { name: "Kontak", href: "#kontak", id: "kontak" },
  ];

  // Detect scroll position for navbar styling & active section sync
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // ScrollSpy logic to detect active section
      const sectionIds = navLinks.map((item) => item.id);
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }

      if (window.scrollY < 100) {
        setActiveSection("beranda");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showPortfolio]);

  const handleConsultation = () => {
    const cleanPhone = waNumber.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(`Halo ${companyName}, saya ingin tanya mengenai paket pemotretan.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  // Smooth scroll handler with visual arrival animation
  const handleNavClick = (e, href, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveSection(id);

    if (id === "beranda") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", window.location.pathname);
      return;
    }

    const targetElement = document.getElementById(id);
    if (targetElement) {
      const headerOffset = 76;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Trigger section arrival highlight animation
      targetElement.classList.remove("section-highlight");
      void targetElement.offsetWidth; // force reflow
      targetElement.classList.add("section-highlight");

      window.history.pushState(null, "", href);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        isScrolled
          ? isDarkTheme
            ? "bg-[#092722]/95 border-[#21C9A4]/20 shadow-xl shadow-black/40"
            : "bg-white/95 border-slate-200 shadow-md"
          : isDarkTheme
          ? "bg-[#092722]/85 border-white/10 shadow-lg shadow-black/20"
          : "bg-white/90 border-slate-200/80 shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
        {/* Brand Logo & Name */}
        <a
          href="#beranda"
          onClick={(e) => handleNavClick(e, "#beranda", "beranda")}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <img
            src="/logo.svg"
            alt={companyName || "ARTDEVATA Logo"}
            className="h-10 w-10 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
          />
          <div>
            <span
              className={`text-lg font-black tracking-wider flex items-center gap-1.5 leading-none transition-colors duration-200 ${
                isDarkTheme ? "text-[#F5F7F6] group-hover:text-[#21C9A4]" : "text-[#14433B]"
              }`}
            >
              {brandFirstWord}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[#21C9A4] font-bold block uppercase mt-0.5">
              {brandRestWords}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links with animated active pill indicator */}
        <nav
          className={`hidden md:flex items-center p-1 rounded-2xl border transition-all duration-300 ${
            isDarkTheme
              ? "bg-[#061d19]/80 border-white/10"
              : "bg-slate-100/70 border-slate-200/80"
          }`}
        >
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.id)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ease-out flex items-center gap-1.5 ${
                  isActive
                    ? isDarkTheme
                      ? "bg-[#21C9A4]/20 text-[#21C9A4] border border-[#21C9A4]/40 shadow-sm shadow-[#21C9A4]/25"
                      : "bg-white text-[#14433B] border border-slate-200/80 shadow-xs"
                    : isDarkTheme
                    ? "text-[#B8C8C4] hover:text-white hover:bg-white/5 border border-transparent"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent"
                }`}
              >
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#21C9A4] animate-pulse" />
                )}
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center space-x-2.5">
          {auth?.user ? (
            <Link href={dashboardUrl}>
              <Button
                className={`font-bold rounded-xl text-xs h-9 px-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  isDarkTheme
                    ? "bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#092722] shadow-md shadow-[#21C9A4]/20"
                    : "bg-[#14433B] hover:bg-[#0B302B] text-[#21C9A4] shadow-xs"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                Dashboard Staff
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleConsultation}
              className="bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#092722] font-extrabold text-xs h-9 rounded-xl px-4 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="h-3.5 w-3.5 mr-1.5" /> Konsultasi Gratis
            </Button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className={`md:hidden p-2 rounded-xl border transition-all duration-200 ${
              isDarkTheme
                ? "bg-[#0b2f29] border-white/10 text-[#21C9A4] hover:bg-[#14433B]"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 transition-transform duration-200 rotate-90" />
            ) : (
              <Menu className="h-5 w-5 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer with smooth slide-down animation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden border-t ${
          isMobileMenuOpen
            ? "max-h-96 opacity-100 py-3"
            : "max-h-0 opacity-0 py-0 pointer-events-none border-transparent"
        } ${
          isDarkTheme
            ? "bg-[#071f1b]/98 border-white/10 text-white"
            : "bg-white/98 border-slate-200 text-slate-900"
        } backdrop-blur-2xl`}
      >
        <div className="px-4 space-y-1.5">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.id)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? isDarkTheme
                      ? "bg-[#21C9A4]/20 text-[#21C9A4] border border-[#21C9A4]/30 pl-5"
                      : "bg-[#14433B]/10 text-[#14433B] border border-[#14433B]/20 pl-5"
                    : isDarkTheme
                    ? "text-[#B8C8C4] hover:bg-white/5 hover:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-[#21C9A4] shadow-[0_0_8px_#21C9A4]" />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}
