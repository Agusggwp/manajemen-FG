import React, { useState } from "react";
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
  Menu,
  X,
  ChevronRight,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children, title }) {
  const { auth, flash, appName } = usePage().props;
  const user = auth?.user;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentRoute = window.location.pathname;

  const isActive = (path) => currentRoute.startsWith(path);

  const navigation = [
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

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Top Navbar Mobile */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-600"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="font-bold text-slate-900 tracking-tight text-base">ARTDEVATA</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">ADMIN</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Desktop & Mobile Sheet */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo Brand */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-slate-900 tracking-tight text-lg">ARTDEVATA</h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Photography System</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-white rounded">ADMIN</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {navigation.map((group, idx) => (
              <div key={idx}>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2 px-2">
                  {group.group}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          active
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-400"}`} />
                          <span>{item.name}</span>
                        </div>
                        {active && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <Link
                href="/logout"
                method="post"
                as="button"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Flash Alert Banners */}
          {flash?.success && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-2xs">
              <span>{flash.success}</span>
            </div>
          )}
          {flash?.error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm font-medium flex items-center justify-between shadow-2xs">
              <span>{flash.error}</span>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
