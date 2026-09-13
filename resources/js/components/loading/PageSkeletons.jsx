import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

/**
 * Hook to detect when Inertia is navigating or searching
 */
export function usePageLoading() {
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const unregisterStart = router.on("start", () => setIsNavigating(true));
    const unregisterFinish = router.on("finish", () => setIsNavigating(false));

    return () => {
      unregisterStart();
      unregisterFinish();
    };
  }, []);

  return isNavigating;
}

/**
 * Generic Table Rows Skeleton
 */
export function TableSkeleton({ rows = 5, cols = 5, hasActions = true }) {
  return (
    <div className="bg-card dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
          <TableRow className="border-b border-slate-200 dark:border-slate-800">
            {Array.from({ length: cols }).map((_, i) => (
              <TableHead key={i} className="py-3 px-4">
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="py-3 px-4 text-center w-24">
                <Skeleton className="h-4 w-12 mx-auto" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, r) => (
            <TableRow key={r} className="border-b border-slate-100 dark:border-slate-800/60">
              {Array.from({ length: cols }).map((_, c) => (
                <TableCell key={c} className="py-3.5 px-4">
                  {c === 0 ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ) : c === cols - 1 ? (
                    <Skeleton className="h-5 w-20 rounded-full" />
                  ) : (
                    <div className="space-y-1">
                      <Skeleton className={`h-4 ${c % 2 === 0 ? "w-28" : "w-36"}`} />
                      <Skeleton className="h-3 w-20 opacity-60" />
                    </div>
                  )}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * Standard Table Page Skeleton (Customers, Packages, Photographers, MUAs, Activity Logs, Payments)
 */
export function TablePageSkeleton({
  title = "Memuat Data...",
  subtitle = "Sedang mengambil data dari server, mohon tunggu sebentar.",
  statCards = 0,
  searchPlaceholder = "Cari data...",
  createButtonText = "Tambah Baru",
  rows = 6,
  cols = 4,
}) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        {createButtonText && (
          <Skeleton className="h-9 w-32 rounded-md" />
        )}
      </div>

      {/* Optional Stat Cards */}
      {statCards > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: statCards }).map((_, i) => (
            <Card key={i} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search & Filter Bar */}
      <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <TableSkeleton rows={rows} cols={cols} />
    </div>
  );
}

/**
 * Schedules Page Skeleton (Admin & Photographer Schedules)
 */
export function SchedulesPageSkeleton({ viewMode = "table" }) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header with Title and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-44 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>

      {/* Search Bar */}
      <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Content depending on view mode */}
      {viewMode === "calendar" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
                <div className="p-2.5 bg-slate-100 dark:bg-slate-950/60 rounded-lg space-y-1.5 border border-slate-200 dark:border-slate-800">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <TableSkeleton rows={6} cols={5} />
      )}
    </div>
  );
}

/**
 * Projects Page Skeleton (Admin & Photographer Projects)
 */
export function ProjectsPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
      </div>

      {/* 4 Status Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <Skeleton className="h-7 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Projects Table Skeleton */}
      <div className="bg-card dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
            <TableRow className="border-b border-slate-200 dark:border-slate-800">
              <TableHead className="py-3 px-4"><Skeleton className="h-4 w-28" /></TableHead>
              <TableHead className="py-3 px-4"><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead className="py-3 px-4"><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead className="py-3 px-4"><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead className="py-3 px-4"><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead className="py-3 px-4 text-center w-24"><Skeleton className="h-4 w-12 mx-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, r) => (
              <TableRow key={r} className="border-b border-slate-100 dark:border-slate-800/60">
                <TableCell className="py-3.5 px-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell className="py-3.5 px-4 text-center">
                  <Skeleton className="h-8 w-8 rounded-lg mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/**
 * Dashboard Page Skeleton (Admin Dashboard)
 */
export function DashboardPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Title */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* 4 Financial Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Dark Revenue */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-3.5 w-24 bg-slate-700" />
            <Skeleton className="h-4 w-4 rounded bg-slate-700" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-36 bg-slate-800" />
            <Skeleton className="h-3 w-28 bg-slate-800" />
          </CardContent>
        </Card>

        {/* Card 2 - Cost */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>

        {/* Card 3 - Profit */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>

        {/* Card 4 - Unpaid */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>
      </div>

      {/* 7 Operational Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-card dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <Skeleton className="h-5 w-5 rounded-full mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
            <Skeleton className="h-6 w-10 mx-auto" />
          </div>
        ))}
      </div>

      {/* Analytics Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-8 w-32 rounded-lg" />
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-52 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-28" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 pt-2">
              <Skeleton className="h-36 w-36 rounded-full" />
              <div className="grid grid-cols-2 gap-2 w-full">
                <Skeleton className="h-8 rounded-md" />
                <Skeleton className="h-8 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Schedules Table */}
      <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </CardHeader>
        <CardContent className="p-0">
          <TableSkeleton rows={5} cols={5} hasActions={false} />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Photographer Dashboard Skeleton
 */
export function PhotographerDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title */}
      <div className="space-y-1">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      {/* 3 Salary & Task Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="p-4 pb-1">
            <Skeleton className="h-3.5 w-28 bg-slate-700" />
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-2">
            <Skeleton className="h-8 w-36 bg-slate-800" />
            <Skeleton className="h-3 w-20 bg-slate-800" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardHeader className="p-4 pb-1">
            <Skeleton className="h-3.5 w-28" />
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardHeader className="p-4 pb-1">
            <Skeleton className="h-3.5 w-20" />
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      </div>

      {/* 4 Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3 bg-card dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-md shrink-0" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-60" />
              </div>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              <Skeleton className="h-48 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-28" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 pt-2">
              <Skeleton className="h-36 w-36 rounded-full" />
              <div className="grid grid-cols-2 gap-2 w-full">
                <Skeleton className="h-8 rounded-md" />
                <Skeleton className="h-8 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Schedules */}
      <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-8 w-28 rounded-md" />
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-3 sm:p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <Skeleton className="h-9 w-44 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Project Detail Page Skeleton
 */
export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header with Back button and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-md shrink-0" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* 3 Summary Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-80 rounded-lg" />
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <TableSkeleton rows={3} cols={4} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Proofs Validation Page Skeleton
 */
export function ProofsPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-72 rounded-lg" />
      </div>

      {/* Proof Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-36" />
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg space-y-1 border border-slate-100 dark:border-slate-800">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3.5 w-32" />
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Skeleton className="h-9 flex-1 rounded-md" />
                <Skeleton className="h-9 flex-1 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Photo Gallery Page Skeleton
 */
export function GalleryPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-1">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      {/* Dropzone Skeleton */}
      <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
        <CardContent className="p-8 text-center space-y-3">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-3 w-32 mx-auto" />
        </CardContent>
      </Card>

      {/* Photo Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 overflow-hidden aspect-square">
            <Skeleton className="h-full w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Settings Page Skeleton
 */
export function SettingsPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-44 rounded-md" />
      </div>

      <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 py-4">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Generic Card Grid Skeleton
 */
export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <Skeleton className="h-16 w-full rounded-lg" />
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
