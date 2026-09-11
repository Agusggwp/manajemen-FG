import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Calendar,
  FolderKanban,
  Image,
  DollarSign,
  LogOut,
  Camera,
} from "lucide-react";

export default function PhotographerLayout({ children, title }) {
  const { auth, flash } = usePage().props;
  const user = auth?.user;
  const currentPath = window.location.pathname;

  const isActive = (path) => currentPath.startsWith(path);

  const navItems = [
    { name: "Dashboard", href: "/photographer/dashboard", icon: LayoutDashboard },
    { name: "Jadwal", href: "/photographer/schedules", icon: Calendar },
    { name: "Project", href: "/photographer/projects", icon: FolderKanban },
    { name: "Galeri", href: "/photographer/gallery", icon: Image },
    { name: "Gaji Saya", href: "/photographer/salary", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20 lg:pb-0">
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-sm px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight text-base block leading-none">ARTDEVATA</span>
            <span className="text-[10px] text-slate-400 font-medium">PHOTOGRAPHER PORTAL</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">{user?.name}</p>
            <p className="text-[10px] text-slate-400">{user?.specialty || "Photographer"}</p>
          </div>
          <Link
            href="/logout"
            method="post"
            as="button"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Desktop Sub-Header Navigation */}
      <nav className="hidden lg:block bg-white border-b border-slate-200 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {flash?.success && (
          <div className="mb-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium shadow-2xs">
            {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm font-medium shadow-2xs">
            {flash.error}
          </div>
        )}

        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 text-[11px] font-medium transition-colors ${
                active ? "text-slate-900 font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <div className={`p-1 rounded-full ${active ? "bg-slate-100 text-slate-900" : ""}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
