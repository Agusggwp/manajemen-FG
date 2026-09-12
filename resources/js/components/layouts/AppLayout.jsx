import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

export default function AppLayout({ children, title }) {
  const { auth, flash, title: pageTitle } = usePage().props;
  const user = auth?.user;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const isPhotographer =
    currentPath.startsWith("/photographer") || user?.role === "photographer";

  const routeTitles = {
    // Admin routes
    "/admin/dashboard": "Dashboard Overview",
    "/admin/schedules": "Manajemen Jadwal",
    "/admin/projects": "Manajemen Project",
    "/admin/proofs": "Validasi Pemotretan",
    "/admin/customers": "Manajemen Pelanggan",
    "/admin/photographers": "Manajemen Photographer",
    "/admin/muas": "Manajemen MUA",
    "/admin/packages": "Master Paket Foto",
    "/admin/payments/salaries": "Pembayaran Gaji Photographer",
    "/admin/payments/mua-fees": "Pembayaran Fee MUA",
    "/admin/reports/package-profit": "Laporan Profit Per Paket",
    "/admin/activity-logs": "Activity Logs",
    "/admin/settings": "Pengaturan Sistem & Web Publik",
    // Photographer routes
    "/photographer/dashboard": "Dashboard Photographer",
    "/photographer/schedules": "Jadwal Pemotretan",
    "/photographer/projects": "Project Saya",
    "/photographer/gallery": "Galeri Foto",
    "/photographer/salary": "Gaji & Fee Saya",
    "/photographer/proof": "Upload Bukti Proof",
  };

  const getFallbackTitle = () => {
    for (const [route, name] of Object.entries(routeTitles)) {
      if (currentPath.startsWith(route)) return name;
    }
    return isPhotographer ? "Photographer Portal" : "Dashboard Admin";
  };

  const activeTitle = title || pageTitle || children?.props?.title || getFallbackTitle();

  return (
    <div className="h-screen bg-slate-50 flex font-sans overflow-hidden">
      {/* Sidebar Component */}
      <AppSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        user={user}
      />

      {/* Main Content Area with Header */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Component */}
        <AppHeader
          title={activeTitle}
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          user={user}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
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
