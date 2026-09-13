import React, { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, BarChart3, PieChart } from "lucide-react";

/**
 * 1. Admin Revenue & Financial Trend Chart (Shadcn AreaChart)
 */
export function RevenueTrendChart({ data = [] }) {
  const [activeTab, setActiveTab] = useState("all");

  const safeData = data && data.length > 0 ? data : [
    { month: "Jan", revenue: 0, profit: 0, cost: 0 },
    { month: "Feb", revenue: 0, profit: 0, cost: 0 },
    { month: "Mar", revenue: 0, profit: 0, cost: 0 },
    { month: "Apr", revenue: 0, profit: 0, cost: 0 },
    { month: "Mei", revenue: 0, profit: 0, cost: 0 },
    { month: "Jun", revenue: 0, profit: 0, cost: 0 },
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#10b981", // Emerald 500
    },
    profit: {
      label: "Profit Bersih",
      color: "#6366f1", // Indigo 500
    },
    cost: {
      label: "Biaya / Cost",
      color: "#f59e0b", // Amber 500
    },
  };

  const totalPeriodRevenue = safeData.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const totalPeriodProfit = safeData.reduce((acc, curr) => acc + (curr.profit || 0), 0);

  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Tren Keuangan (6 Bulan Terakhir)
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Performa omset revenue, profit aktual, dan biaya operasional.
          </CardDescription>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("revenue")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "revenue"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Revenue
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("profit")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "profit"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Profit
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="flex flex-wrap items-center gap-4 mb-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Total Omset:</span>
            <span className="font-bold text-slate-900">{formatRupiah(totalPeriodRevenue)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-500">Total Profit:</span>
            <span className="font-bold text-indigo-700">{formatRupiah(totalPeriodProfit)}</span>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto">
          <AreaChart data={safeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-200/80" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
              className="text-slate-500"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={10}
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
              className="text-slate-500"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex items-center justify-between gap-4 w-full">
                      <span className="text-slate-500 font-medium">
                        {chartConfig[name]?.label || name}:
                      </span>
                      <span className="font-bold text-slate-900">{formatRupiah(value)}</span>
                    </div>
                  )}
                />
              }
            />
            {(activeTab === "all" || activeTab === "revenue") && (
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#fillRevenue)"
                name="revenue"
              />
            )}
            {(activeTab === "all" || activeTab === "profit") && (
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#fillProfit)"
                name="profit"
              />
            )}
            {activeTab === "all" && (
              <Area
                type="monotone"
                dataKey="cost"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#fillCost)"
                name="cost"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/**
 * 2. Admin Package Performance Bar Chart (Shadcn Horizontal BarChart)
 */
export function PackagePerformanceBarChart({ data = [] }) {
  const safeData = Array.isArray(data) ? data : [];

  const chartConfig = {
    revenue: {
      label: "Total Pendapatan",
      color: "#6366f1",
    },
  };

  const chartData = safeData.slice(0, 5).map((pkg) => ({
    name: pkg.name?.length > 18 ? `${pkg.name.substring(0, 18)}...` : pkg.name,
    fullName: pkg.name,
    revenue: pkg.revenue || 0,
    category: pkg.category || "General",
    projects_count: pkg.projects_count || 0,
  }));

  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Performa Paket Terlaris
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Top 5 paket foto dengan kontribusi pendapatan tertinggi
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Belum ada data transaksi paket foto selesai.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-60 w-full aspect-auto">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-slate-200/80" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                fontSize={10}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                width={120}
                className="font-medium text-slate-800"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _, item) => (
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900">{item.payload?.fullName}</p>
                        <p className="text-indigo-600 font-semibold">{formatRupiah(value)}</p>
                        <p className="text-xs text-slate-500">
                          {item.payload?.projects_count} project diselesaikan
                        </p>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="revenue"
                fill="#6366f1"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 3. Project Status Donut Chart (Shadcn PieChart)
 */
export function ProjectStatusDonutChart({ statusCounts = {}, title = "Distribusi Status Project" }) {
  const counts = statusCounts || {};

  const statusConfig = {
    SCHEDULED: { label: "Terjadwal",   color: "#3b82f6" },
    COMPLETED: { label: "Selesai",     color: "#10b981" },
    SHOOTING:  { label: "Pemotretan",  color: "#f59e0b" },
    EDITING:   { label: "Pengeditan",  color: "#8b5cf6" },
    REVIEW:    { label: "Peninjauan",  color: "#a855f7" },
    BOOKED:    { label: "Dipesan",     color: "#64748b" },
    CANCELLED: { label: "Dibatalkan",  color: "#ef4444" },
  };

  const chartData = Object.entries(counts)
    .filter(([_, count]) => Number(count) > 0)
    .map(([status, count]) => ({
      status,
      name: statusConfig[status]?.label || status,
      count: Number(count),
      fill: statusConfig[status]?.color || "#94a3b8",
    }));

  const total = chartData.reduce((acc, curr) => acc + curr.count, 0);

  const chartConfig = Object.fromEntries(
    Object.entries(statusConfig).map(([k, v]) => [k, { label: v.label, color: v.color }])
  );

  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-slate-700" />
          <div>
            <CardTitle className="text-base font-bold text-slate-900">{title}</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Total {total} project tercatat
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {total === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            Belum ada data status project.
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <ChartContainer config={chartConfig} className="h-44 w-full aspect-auto">
              <RechartsPieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(val, name) => (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-600">{name}:</span>
                          <span className="font-bold text-slate-900">{val} project</span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ChartContainer>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 w-full mt-2 text-xs">
              {chartData.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between p-1.5 px-2 rounded-md bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="font-medium text-slate-700 truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 4. Photographer Monthly Earnings Chart (Shadcn Stacked BarChart)
 */
export function PhotographerEarningsChart({ data = [] }) {
  const safeData = data && data.length > 0 ? data : [
    { month: "Jan", paid: 0, unpaid: 0, total: 0 },
    { month: "Feb", paid: 0, unpaid: 0, total: 0 },
    { month: "Mar", paid: 0, unpaid: 0, total: 0 },
    { month: "Apr", paid: 0, unpaid: 0, total: 0 },
    { month: "Mei", paid: 0, unpaid: 0, total: 0 },
    { month: "Jun", paid: 0, unpaid: 0, total: 0 },
  ];

  const chartConfig = {
    paid: {
      label: "Sudah Dibayar",
      color: "#10b981", // Emerald 500
    },
    unpaid: {
      label: "Menunggu Pencairan",
      color: "#f59e0b", // Amber 500
    },
  };

  const totalEarnings = safeData.reduce((acc, c) => acc + (c.paid || 0) + (c.unpaid || 0), 0);

  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Tren Penghasilan & Gaji (6 Bulan)
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Perbandingan honor yang sudah dibayar vs menunggu pencairan
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Dibayar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 font-medium">Menunggu</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <ChartContainer config={chartConfig} className="h-56 w-full aspect-auto">
          <BarChart data={safeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-200/80" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
              className="text-slate-500"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={10}
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
              className="text-slate-500"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex items-center justify-between gap-4 w-full">
                      <span className="text-slate-500 font-medium">
                        {chartConfig[name]?.label || name}:
                      </span>
                      <span className="font-bold text-slate-900">{formatRupiah(value)}</span>
                    </div>
                  )}
                />
              }
            />
            <Bar
              dataKey="paid"
              stackId="salary"
              fill="#10b981"
              radius={[0, 0, 4, 4]}
              name="paid"
            />
            <Bar
              dataKey="unpaid"
              stackId="salary"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              name="unpaid"
            />
          </BarChart>
        </ChartContainer>

        <div className="flex items-center justify-between pt-3 text-xs text-slate-500 border-t border-slate-100 mt-2">
          <span>Akumulasi Total 6 Bulan:</span>
          <span className="font-bold text-slate-900 text-sm">{formatRupiah(totalEarnings)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
