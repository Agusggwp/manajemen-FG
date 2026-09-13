import React, { useState, useMemo } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  LogOut,
  Home,
  ChevronDown,
  User as UserIcon,
  Settings,
  History,
  Camera,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ROUTE_LABELS = {
  // Common & Admin
  admin: "Admin",
  dashboard: "Dashboard",
  schedules: "Jadwal",
  projects: "Project",
  proofs: "Validasi Presensi Foto",
  customers: "Pelanggan",
  packages: "Master Paket Foto",
  muas: "MUA",
  photographers: "Fotografer",
  salaries: "Gaji Fotografer",
  "mua-fees": "Gaji MUA",
  reports: "Laporan Keuangan",
  settings: "Pengaturan Profil",
  activity: "Log Aktivitas",

  // Photographer
  photographer: "Fotografer",
  proof: "Kirim Presensi Foto",
  gallery: "Galeri & Klien",
  salary: "Gaji Saya",
};

export default function AppHeader({
  title,
  sidebarOpen,
  sidebarCollapsed,
  toggleSidebar,
  user,
}) {
  const { url } = usePage();
  const currentRoute = url ? url.split("?")[0] : (typeof window !== "undefined" ? window.location.pathname : "");
  const isPhotographer =
    currentRoute.startsWith("/photographer") || user?.role === "photographer";

  const userBadge = isPhotographer ? "FOTOGRAFER" : "ADMIN";
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    router.post("/logout", {}, {
      onFinish: () => {
        setIsLoggingOut(false);
        setLogoutOpen(false);
      },
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const breadcrumbs = useMemo(() => {
    const segments = currentRoute.split("/").filter(Boolean);
    if (segments.length === 0) {
      return [{ label: "Dashboard", href: isPhotographer ? "/photographer/dashboard" : "/admin/dashboard", isCurrent: true }];
    }

    const rootPrefix = segments[0] === "photographer" ? "photographer" : "admin";
    const rootLabel = rootPrefix === "photographer" ? "Fotografer" : "Admin";
    const rootHref = `/${rootPrefix}/dashboard`;

    const crumbs = [{ label: rootLabel, href: rootHref }];

    if (segments.length === 1 || (segments.length === 2 && segments[1] === "dashboard")) {
      crumbs.push({ label: "Dashboard", isCurrent: true });
      return crumbs;
    }

    let accumulatedPath = `/${rootPrefix}`;
    for (let i = 1; i < segments.length; i++) {
      const seg = segments[i];
      accumulatedPath += `/${seg}`;
      const isLast = i === segments.length - 1;

      const isId = /^\d+$/.test(seg) || seg.length > 20;
      let label = ROUTE_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);

      if (isId) {
        label = title || "Detail";
      } else if (isLast && title && !ROUTE_LABELS[seg]) {
        label = title;
      }

      const hasDirectLink = !["payments", "reports"].includes(seg);

      crumbs.push({
        label,
        href: isLast ? undefined : hasDirectLink ? accumulatedPath : undefined,
        isCurrent: isLast,
      });
    }

    return crumbs;
  }, [currentRoute, title, isPhotographer]);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between shadow-2xs shrink-0">
      <div className="flex items-center space-x-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Perluas Sidebar" : "Kecilkan Sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 hidden lg:block text-slate-600" />
          ) : (
            <PanelLeftClose className="h-4 w-4 hidden lg:block text-slate-600" />
          )}
          {sidebarOpen ? (
            <X className="h-4 w-4 lg:hidden text-slate-600" />
          ) : (
            <Menu className="h-4 w-4 lg:hidden text-slate-600" />
          )}
        </Button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* Dynamic Desktop Breadcrumb */}
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            {breadcrumbs.map((item, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-semibold text-slate-900 text-sm max-w-[200px] md:max-w-[300px] lg:max-w-[420px] truncate">
                        {item.label}
                      </BreadcrumbPage>
                    ) : item.href ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href}
                          className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">
                        {item.label}
                      </span>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className="text-slate-300" />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Mobile Header Title */}
        <div className="flex items-center space-x-2 truncate sm:hidden">
          <span className="font-bold text-slate-900 tracking-tight text-base truncate">
            {title || (isPhotographer ? "Portal Fotografer" : "Dashboard Admin")}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2.5 p-1 sm:px-2 sm:py-1.5 h-auto rounded-lg hover:bg-slate-100 transition-colors focus-visible:ring-1 focus-visible:ring-slate-300"
            >
              <Avatar className="h-8 w-8 ring-2 ring-slate-100 shrink-0">
                <AvatarImage src={user?.avatar_url || user?.avatar} alt={user?.name || "User"} />
                <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[130px]">
                  {user?.name}
                </p>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200">
                  {userBadge}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1 shadow-lg p-1.5">
            <DropdownMenuLabel className="font-normal py-2 px-2">
              <div className="flex items-center space-x-2.5">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={user?.avatar_url || user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5 overflow-hidden min-w-0">
                  <p className="text-sm font-semibold text-slate-900 leading-none truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 leading-none truncate">{user?.email || (isPhotographer ? "Portal Fotografer" : "Administrator")}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Quick Navigation Items */}
            {isPhotographer ? (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href="/photographer/gallery"
                    className="flex items-center cursor-pointer text-xs font-medium text-slate-700 py-1.5"
                  >
                    <Camera className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Galeri Portofolio</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/photographer/salary"
                    className="flex items-center cursor-pointer text-xs font-medium text-slate-700 py-1.5"
                  >
                    <DollarSign className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Riwayat Gaji</span>
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/settings"
                    className="flex items-center cursor-pointer text-xs font-medium text-slate-700 py-1.5"
                  >
                    <Settings className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Pengaturan Sistem</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/activity-logs"
                    className="flex items-center cursor-pointer text-xs font-medium text-slate-700 py-1.5"
                  >
                    <History className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Log Aktivitas</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
              <Button
                onClick={() => setLogoutOpen(true)}
                variant="destructive"
                size="sm"
                className="w-full justify-center mt-0.5 gap-2"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span>Mengeluarkan...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>Keluar</span>
                  </>
                )}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin keluar dari sistem manajemen ART DEVATA?"
        confirmText="Keluar"
        cancelText="Batal"
        loadingText="Mengeluarkan..."
        loading={isLoggingOut}
        variant="destructive"
        icon={LogOut}
        onConfirm={handleLogout}
      />
    </header>
  );
}
