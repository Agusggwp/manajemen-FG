import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
  LayoutDashboard,
  Calendar,
  FolderKanban,
  Users,
  Camera,
  Sparkles,
  Package,
  CreditCard,
  TrendingUp,
  History,
  Settings,
  LogOut,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  Image,
  DollarSign,
  Terminal,
  Loader2,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function AppSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  toggleSidebar,
  user,
}) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const currentRoute = window.location.pathname;
  const isActive = (path) => currentRoute.startsWith(path);

  const isPhotographer =
    currentRoute.startsWith("/photographer") || user?.role === "photographer";

  const adminNavigation = [
    {
      group: "UTAMA",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      group: "OPERASIONAL",
      items: [
        { name: "Jadwal", href: "/admin/schedules", icon: Calendar },
        { name: "Project", href: "/admin/projects", icon: FolderKanban },
        { name: "Validasi Presensi Foto", href: "/admin/proofs", icon: CheckCircle2 },
        { name: "Pelanggan", href: "/admin/customers", icon: Users },
      ],
    },
    {
      group: "MANAJEMEN",
      items: [
        { name: "Fotografer", href: "/admin/photographers", icon: Camera },
        { name: "MUA", href: "/admin/muas", icon: Sparkles },
        { name: "Paket Foto", href: "/admin/packages", icon: Package },
        { name: "Galeri Portofolio", href: "/admin/portfolios", icon: Image },
      ],
    },
    {
      group: "KEUANGAN",
      items: [
        { name: "Gaji Fotografer", href: "/admin/payments/salaries", icon: CreditCard },
        { name: "Gaji MUA", href: "/admin/payments/mua-fees", icon: UserCheck },
        { name: "Laporan Keuntungan", href: "/admin/reports/package-profit", icon: TrendingUp },
      ],
    },
    {
      group: "SISTEM",
      items: [
        { name: "Log Aktivitas", href: "/admin/activity-logs", icon: History },
        { name: "Dev Tools", href: "/admin/dev-tools", icon: Terminal },
        { name: "Pengaturan", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const photographerNavigation = [
    {
      group: "MENU UTAMA",
      items: [
        { name: "Dashboard", href: "/photographer/dashboard", icon: LayoutDashboard },
        { name: "Jadwal", href: "/photographer/schedules", icon: Calendar },
        { name: "Project", href: "/photographer/projects", icon: FolderKanban },
        { name: "Galeri Foto", href: "/photographer/gallery", icon: Image },
        { name: "Gaji Saya", href: "/photographer/salary", icon: DollarSign },
      ],
    },
  ];

  const navigation = isPhotographer ? photographerNavigation : adminNavigation;
  const portalSubtitle = isPhotographer ? "Portal Fotografer" : "Sistem Fotografi";
  const portalBadge = isPhotographer ? "FOTOGRAFER" : "ADMIN";

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out lg:static lg:h-screen lg:z-30 shrink-0 ${sidebarOpen
            ? "translate-x-0 w-64 shadow-2xl lg:shadow-none"
            : "-translate-x-full lg:translate-x-0"
          } ${sidebarCollapsed ? "lg:w-[72px]" : "lg:w-64"}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Brand */}
          <div
            className={`h-16 border-b border-slate-200 dark:border-slate-800 flex items-center shrink-0 ${sidebarCollapsed ? "lg:justify-center lg:px-2 px-4" : "px-4"
              }`}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              {/* Logo Mark (Always visible) */}
              <img
                src="/logo.svg"
                alt="ARTDEVATA Logo"
                className={`h-9 w-9 object-contain shrink-0 cursor-pointer transition-transform ${sidebarCollapsed ? "mx-auto" : ""
                  }`}
                onClick={sidebarCollapsed ? toggleSidebar : undefined}
                title={sidebarCollapsed ? "Buka / Perluas Sidebar" : "ARTDEVATA"}
              />

              {/* Brand Text (hidden when collapsed on desktop) */}
              <div className={`truncate ${sidebarCollapsed ? "lg:hidden block" : "block"}`}>
                <h1 className="font-bold text-slate-900 dark:text-white tracking-tight text-lg leading-tight truncate">
                  ARTDEVATA
                </h1>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium tracking-wide uppercase truncate">
                  {portalSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav
            className={`flex-1 overflow-y-auto overflow-x-hidden ${sidebarCollapsed ? "p-2 lg:px-2 lg:py-3 space-y-4" : "p-4 space-y-6"
              }`}
          >
            {navigation.map((group, idx) => (
              <div key={idx}>
                {/* Group Title or subtle separator when collapsed on desktop */}
                {sidebarCollapsed ? (
                  <div className="hidden lg:block">
                    {idx > 0 && <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-1" />}
                  </div>
                ) : (
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2 px-2">
                    {group.group}
                  </p>
                )}

                {/* Always show group title on mobile drawer */}
                {sidebarCollapsed && (
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2 px-2 lg:hidden">
                    {group.group}
                  </p>
                )}

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        title={sidebarCollapsed ? item.name : undefined}
                        className={`flex items-center rounded-lg transition-colors group relative ${sidebarCollapsed
                            ? "lg:justify-center lg:p-2.5 lg:h-10 lg:w-10 lg:mx-auto px-3 py-2 justify-between"
                            : "px-3 py-2 justify-between"
                          } ${active
                            ? "bg-slate-900 dark:bg-emerald-600 text-white shadow-xs"
                            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                          }`}
                      >
                        <div
                          className={`flex items-center ${sidebarCollapsed ? "lg:space-x-0 space-x-3" : "space-x-3"
                            }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                              }`}
                          />
                          <span
                            className={`text-sm font-medium whitespace-nowrap ${sidebarCollapsed ? "lg:hidden block" : "block"
                              }`}
                          >
                            {item.name}
                          </span>
                        </div>

                        {active && !sidebarCollapsed && (
                          <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                        )}
                        {active && sidebarCollapsed && (
                          <ChevronRight className="h-3.5 w-3.5 opacity-70 lg:hidden" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile & Logout in Sidebar Footer */}
          <div
            className={`border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 shrink-0 ${sidebarCollapsed ? "p-2 lg:py-3 lg:px-1" : "p-3"
              }`}
          >
            {/* Compact Profile for Desktop Collapsed State */}
            {sidebarCollapsed && (
              <div className="hidden lg:flex flex-col items-center space-y-2.5">
                <Avatar
                  className="h-9 w-9 ring-2 ring-white dark:ring-slate-800 shadow-2xs cursor-pointer"
                  title={`${user?.name} (${user?.email})`}
                >
                  <AvatarImage src={user?.avatar_url || user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setLogoutOpen(true)}
                  title="Logout"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            {/* Full Profile on Mobile or Expanded Desktop */}
            <div
              className={`flex flex-col gap-2 ${sidebarCollapsed ? "lg:hidden flex" : "flex"
                }`}
            >
              <div className="flex items-center space-x-3 overflow-hidden min-w-0">
                <Avatar className="h-9 w-9 shrink-0 ring-2 ring-white dark:ring-slate-800 shadow-2xs">
                  <AvatarImage src={user?.avatar_url || user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="truncate min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name || "User"}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email || user?.specialty || "-"}</p>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => setLogoutOpen(true)}
                title="Logout"
                className="w-full flex items-center justify-center gap-2"
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
            </div>
          </div>
        </div>
      </aside>

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
        onConfirm={() => {
          setIsLoggingOut(true);
          router.post("/logout", {}, {
            onFinish: () => {
              setIsLoggingOut(false);
              setLogoutOpen(false);
            },
          });
        }}
      />
    </>
  );
}
