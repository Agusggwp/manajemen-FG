import React from "react";
import { Link, usePage } from "@inertiajs/react";
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
} from "lucide-react";

export default function AppSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  toggleSidebar,
  user,
}) {
  const currentRoute = window.location.pathname;
  const isActive = (path) => currentRoute.startsWith(path);

  const isPhotographer =
    currentRoute.startsWith("/photographer") || user?.role === "photographer";

  const adminNavigation = [
    {
      group: "MAIN",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      group: "OPERASIONAL",
      items: [
        { name: "Jadwal", href: "/admin/schedules", icon: Calendar },
        { name: "Project", href: "/admin/projects", icon: FolderKanban },
        { name: "Validasi Proof", href: "/admin/proofs", icon: CheckCircle2 },
        { name: "Pelanggan", href: "/admin/customers", icon: Users },
      ],
    },
    {
      group: "MANAJEMEN",
      items: [
        { name: "Photographer", href: "/admin/photographers", icon: Camera },
        { name: "MUA", href: "/admin/muas", icon: Sparkles },
        { name: "Paket Foto", href: "/admin/packages", icon: Package },
      ],
    },
    {
      group: "KEUANGAN",
      items: [
        { name: "Gaji Photographer", href: "/admin/payments/salaries", icon: CreditCard },
        { name: "Fee MUA", href: "/admin/payments/mua-fees", icon: UserCheck },
        { name: "Laporan Profit", href: "/admin/reports/package-profit", icon: TrendingUp },
      ],
    },
    {
      group: "SISTEM",
      items: [
        { name: "Activity Logs", href: "/admin/activity-logs", icon: History },
        { name: "Settings", href: "/admin/settings", icon: Settings },
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
        { name: "Galeri", href: "/photographer/gallery", icon: Image },
        { name: "Gaji Saya", href: "/photographer/salary", icon: DollarSign },
      ],
    },
  ];

  const navigation = isPhotographer ? photographerNavigation : adminNavigation;
  const portalSubtitle = isPhotographer ? "Photographer Portal" : "Photography System";
  const portalBadge = isPhotographer ? "PHOTOGRAPHER" : "ADMIN";

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
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out lg:static lg:h-screen lg:z-30 shrink-0 ${
          sidebarOpen
            ? "translate-x-0 w-64 shadow-2xl lg:shadow-none"
            : "-translate-x-full lg:translate-x-0"
        } ${sidebarCollapsed ? "lg:w-[72px]" : "lg:w-64"}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Brand */}
          <div
            className={`border-b-2 p-4 border-slate-100 flex items-center shrink-0 ${
              sidebarCollapsed ? "lg:justify-center lg:px-2" : "px-4"
            }`}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              {/* Logo Mark (Always visible) */}
              <img
                src="/logo.svg"
                alt="ARTDEVATA Logo"
                className={`h-9 w-9 object-contain shrink-0 cursor-pointer transition-transform ${
                  sidebarCollapsed ? "mx-auto" : ""
                }`}
                onClick={sidebarCollapsed ? toggleSidebar : undefined}
                title={sidebarCollapsed ? "Buka / Perluas Sidebar" : "ARTDEVATA"}
              />

              {/* Brand Text (hidden when collapsed on desktop) */}
              <div className={`truncate ${sidebarCollapsed ? "lg:hidden block" : "block"}`}>
                <h1 className="font-bold text-slate-900 tracking-tight text-lg leading-tight truncate">
                  ARTDEVATA
                </h1>
                <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase truncate">
                  {portalSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav
            className={`flex-1 overflow-y-auto overflow-x-hidden ${
              sidebarCollapsed ? "p-2 lg:px-2 lg:py-3 space-y-4" : "p-4 space-y-6"
            }`}
          >
            {navigation.map((group, idx) => (
              <div key={idx}>
                {/* Group Title or subtle separator when collapsed on desktop */}
                {sidebarCollapsed ? (
                  <div className="hidden lg:block">
                    {idx > 0 && <div className="h-px bg-slate-100 my-2 mx-1" />}
                  </div>
                ) : (
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2 px-2">
                    {group.group}
                  </p>
                )}

                {/* Always show group title on mobile drawer */}
                {sidebarCollapsed && (
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2 px-2 lg:hidden">
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
                        className={`flex items-center rounded-lg transition-colors group relative ${
                          sidebarCollapsed
                            ? "lg:justify-center lg:p-2.5 lg:h-10 lg:w-10 lg:mx-auto px-3 py-2 justify-between"
                            : "px-3 py-2 justify-between"
                        } ${
                          active
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                        }`}
                      >
                        <div
                          className={`flex items-center ${
                            sidebarCollapsed ? "lg:space-x-0 space-x-3" : "space-x-3"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              active ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium whitespace-nowrap ${
                              sidebarCollapsed ? "lg:hidden block" : "block"
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
            className={`border-t border-slate-100 bg-slate-50/50 shrink-0 ${
              sidebarCollapsed ? "p-2 lg:py-3 lg:px-1" : "p-4"
            }`}
          >
            {/* Compact Profile for Desktop Collapsed State */}
            {sidebarCollapsed && (
              <div className="hidden lg:flex flex-col items-center space-y-2.5">
                <div
                  className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-slate-100 shadow-2xs"
                  title={`${user?.name} (${user?.email})`}
                >
                  {user?.name?.charAt(0) || "U"}
                </div>
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Full Profile on Mobile or Expanded Desktop */}
            <div
              className={`flex items-center justify-between ${
                sidebarCollapsed ? "lg:hidden flex" : "flex"
              }`}
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email || user?.specialty}</p>
                </div>
              </div>
              <Link
                href="/logout"
                method="post"
                as="button"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
