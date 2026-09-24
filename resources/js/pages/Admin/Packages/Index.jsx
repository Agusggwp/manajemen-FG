import React, { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/utils";
import { Head, useForm, router, Link } from "@inertiajs/react";
import {
  Package,
  Plus,
  Search,
  Copy,
  Power,
  Trash2,
  Edit3,
  Sparkles,
  TrendingUp,
  MoreVertical,
  X,
  Save,
  Loader2,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePageLoading, TableSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ packages, filters, categories, muas, counts }) {
  const safePackages = packages?.data ? packages : { data: [] };
  const safeCounts = counts || {
    all: safePackages.data.length,
    photo: safePackages.data.filter((p) => p.category !== "MUA Only" && Number(p.number_of_photographers) > 0).length,
    mua: safePackages.data.filter((p) => p.category === "MUA Only" || Number(p.number_of_photographers) === 0).length,
  };

  const safeFilters = {
    type: filters?.type ?? "all", // 'all' | 'photo' | 'mua'
    search: filters?.search ?? "",
    category: filters?.category ?? "",
    status: filters?.status ?? "",
    sort: filters?.sort ?? "created_at",
    direction: filters?.direction ?? "desc",
  };

  const rawCategories = Array.isArray(categories) ? categories : [];
  const photoCategories = rawCategories.filter((c) => c !== "MUA Only");
  const safeMuas = Array.isArray(muas) ? muas : [];

  const isNavigating = usePageLoading();
  const [isSearching, setIsSearching] = useState(false);
  const [activeType, setActiveType] = useState(safeFilters.type || "all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [search, setSearch] = useState(safeFilters.search || "");
  const [category, setCategory] = useState(safeFilters.category || "");
  const [sortBy, setSortBy] = useState(safeFilters.sort || "created_at");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state if props change
  useEffect(() => {
    setActiveType(safeFilters.type || "all");
  }, [safeFilters.type]);

  const triggerFilter = (newType = activeType, newSearch = search, newCategory = category, newSort = sortBy) => {
    setIsSearching(true);
    router.get(
      "/admin/packages",
      {
        type: newType,
        search: newSearch,
        category: newType === "mua" ? "" : newCategory,
        sort: newSort,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsSearching(false),
      }
    );
  };

  const handleTypeTabChange = (type) => {
    setActiveType(type);
    const newCategory = type === "mua" ? "" : category;
    if (type === "mua") setCategory("");
    triggerFilter(type, search, newCategory, sortBy);
  };

  useEffect(() => {
    if (search === (safeFilters.search || "")) return;
    const timer = setTimeout(() => {
      triggerFilter(activeType, search, category, sortBy);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const form = useForm({
    package_type: "photo", // 'photo' | 'mua'
    name: "",
    category: "Graduation",
    price: 0,
    duration_minutes: 60,
    number_of_photos: 25,
    number_of_photographers: 1,
    includes_mua: false,
    mua_id: "",
    estimated_photographer_cost: 0,
    estimated_mua_fee: 0,
    estimated_operational_cost: 0,
    description: "",
    status: "ACTIVE",
  });

  const handleOpenCreate = (targetType = "photo") => {
    setEditingPackage(null);
    if (targetType === "mua") {
      form.setData({
        package_type: "mua",
        name: "",
        category: "MUA Only",
        price: 350000,
        duration_minutes: 90,
        number_of_photos: 0,
        number_of_photographers: 0,
        includes_mua: true,
        mua_id: "",
        estimated_photographer_cost: 0,
        estimated_mua_fee: 250000,
        estimated_operational_cost: 25000,
        description: "",
        status: "ACTIVE",
      });
    } else {
      form.setData({
        package_type: "photo",
        name: "",
        category: "Graduation",
        price: 650000,
        duration_minutes: 60,
        number_of_photos: 25,
        number_of_photographers: 1,
        includes_mua: false,
        mua_id: "",
        estimated_photographer_cost: 300000,
        estimated_mua_fee: 0,
        estimated_operational_cost: 50000,
        description: "",
        status: "ACTIVE",
      });
    }
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    const isMuaPackage = pkg.category === "MUA Only" || Number(pkg.number_of_photographers) === 0;

    form.setData({
      package_type: isMuaPackage ? "mua" : "photo",
      name: pkg.name,
      category: pkg.category,
      price: pkg.price,
      duration_minutes: pkg.duration_minutes,
      number_of_photos: pkg.number_of_photos,
      number_of_photographers: pkg.number_of_photographers,
      includes_mua: pkg.includes_mua,
      mua_id: pkg.mua_id || "",
      estimated_photographer_cost: pkg.estimated_photographer_cost,
      estimated_mua_fee: pkg.estimated_mua_fee,
      estimated_operational_cost: pkg.estimated_operational_cost,
      description: pkg.description || "",
      status: pkg.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPackage) {
      form.put(`/admin/packages/${editingPackage.id}`, {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      form.post("/admin/packages", {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const handleDuplicate = (id) => {
    router.post(`/admin/packages/${id}/duplicate`);
  };

  const handleToggleStatus = (id) => {
    router.patch(`/admin/packages/${id}/toggle-status`);
  };

  const handleDeleteClick = (pkg) => {
    setDeleteTarget(pkg);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    router.delete(`/admin/packages/${deleteTarget.id}`, {
      onSuccess: () => {
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
      onFinish: () => setIsDeleting(false),
    });
  };

  const isLoading = isNavigating || isSearching;

  // Dynamic profit calculation in modal
  const estTotalCost =
    Number(form.data.estimated_photographer_cost || 0) +
    Number(form.data.estimated_mua_fee || 0) +
    Number(form.data.estimated_operational_cost || 0);

  const estProfit = Number(form.data.price || 0) - estTotalCost;
  const estMargin =
    form.data.price > 0 ? ((estProfit / form.data.price) * 100).toFixed(2) : 0;

  return (
    <>
      <Head
        title={
          activeType === "mua"
            ? "Master Paket Khusus MUA"
            : activeType === "photo"
            ? "Master Paket Foto (+ MUA)"
            : "Master Paket Foto & MUA"
        }
      />
      <div className="space-y-6">
        {/* Header Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {activeType === "mua"
                  ? "Master Paket Khusus MUA"
                  : activeType === "photo"
                  ? "Master Paket Foto (+ MUA)"
                  : "Master Paket Foto & Layanan MUA"}
              </h1>
              {activeType === "mua" && (
                <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border-pink-300 dark:border-pink-800 text-xs px-2 py-0.5 font-semibold">
                  MUA Saja
                </Badge>
              )}
              {activeType === "photo" && (
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800 text-xs px-2 py-0.5 font-semibold">
                  Fotografi + Bundling
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activeType === "mua"
                ? "Kelola layanan rias mandiri khusus MUA (tata rias & hairdo tanpa fotografer)."
                : activeType === "photo"
                ? "Kelola paket pemotretan foto, fotografer, kuota foto, dan opsi bundling MUA."
                : "Kelola master paket fotografi, bundling MUA, dan layanan rias mandiri MUA."}
            </p>
          </div>

          {/* Quick Create Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {activeType === "mua" ? (
              <Button
                onClick={() => handleOpenCreate("mua")}
                size="sm"
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold gap-1.5 text-xs w-full sm:w-auto shadow-xs"
              >
                <Sparkles className="h-4 w-4" />
                <span>Tambah Paket MUA Baru</span>
              </Button>
            ) : activeType === "photo" ? (
              <Button
                onClick={() => handleOpenCreate("photo")}
                size="sm"
                className="font-semibold gap-1.5 text-xs w-full sm:w-auto shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Paket Foto Baru</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => handleOpenCreate("photo")}
                  size="sm"
                  className="font-semibold gap-1.5 text-xs flex-1 sm:flex-initial shadow-xs"
                >
                  <Camera className="h-4 w-4" />
                  <span>+ Paket Foto</span>
                </Button>
                <Button
                  onClick={() => handleOpenCreate("mua")}
                  size="sm"
                  variant="outline"
                  className="border-pink-300 hover:bg-pink-50 text-pink-700 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-950/40 font-semibold gap-1.5 text-xs flex-1 sm:flex-initial"
                >
                  <Sparkles className="h-4 w-4 text-pink-600" />
                  <span>+ Paket MUA</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Dedicated Type Segmented Tabs */}
        <div className="flex border-b border-border dark:border-slate-800 space-x-2">
          <button
            type="button"
            onClick={() => handleTypeTabChange("all")}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeType === "all"
                ? "border-slate-900 text-slate-900 dark:border-white dark:text-white"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Semua Paket</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeType === "all"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {safeCounts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeTabChange("photo")}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeType === "photo"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Paket Foto (+ MUA)</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeType === "photo"
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {safeCounts.photo}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeTabChange("mua")}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeType === "mua"
                ? "border-pink-600 text-pink-600 dark:border-pink-400 dark:text-pink-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span>Paket Khusus MUA Saja</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeType === "mua"
                  ? "bg-pink-600 text-white dark:bg-pink-500"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {safeCounts.mua}
            </span>
          </button>
        </div>

        {/* Informational Guidance Banner based on Active Tab */}
        {activeType === "mua" && (
          <div className="p-3.5 bg-pink-50/80 dark:bg-pink-950/25 border border-pink-200 dark:border-pink-900/60 rounded-xl text-xs text-pink-900 dark:text-pink-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-pink-600 dark:text-pink-400 shrink-0" />
              <span>
                <strong>Mode Paket MUA Saja:</strong> Layanan rias wajah & hairdo/hijab khusus MUA tanpa fotografer (0 FG & 0 Foto). Pengeluaran hanya fee MUA dan operasional rias.
              </span>
            </div>
            <Button
              size="xs"
              variant="outline"
              onClick={() => handleOpenCreate("mua")}
              className="border-pink-300 text-pink-700 hover:bg-pink-100 dark:border-pink-700 dark:text-pink-300 shrink-0 font-medium"
            >
              + Tambah Paket MUA
            </Button>
          </div>
        )}

        {activeType === "photo" && (
          <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/25 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-900 dark:text-blue-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Camera className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                <strong>Mode Paket Foto (+ MUA):</strong> Layanan pemotretan foto studio/outdoor dengan fotografer dan kuota foto. Dapat berupa foto saja atau bundling termasuk layanan MUA.
              </span>
            </div>
            <Button
              size="xs"
              variant="outline"
              onClick={() => handleOpenCreate("photo")}
              className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 shrink-0 font-medium"
            >
              + Tambah Paket Foto
            </Button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <Card className="border-border dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder={
                    activeType === "mua"
                      ? "Cari nama paket MUA (misal: Wisuda Glam, Bridal)..."
                      : activeType === "photo"
                      ? "Cari nama paket foto (misal: Graduation, Wedding)..."
                      : "Cari nama paket foto atau layanan MUA..."
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Category Filter (hidden on MUA Only tab for clarity) */}
              {activeType !== "mua" && (
                <Select
                  value={category || "all"}
                  onValueChange={(val) => {
                    const newCat = val === "all" ? "" : val;
                    setCategory(newCat);
                    triggerFilter(activeType, search, newCat, sortBy);
                  }}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {photoCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Sort Filter */}
              <Select
                value={sortBy || "created_at"}
                onValueChange={(val) => {
                  setSortBy(val);
                  triggerFilter(activeType, search, category, val);
                }}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Terbaru Ditambahkan</SelectItem>
                  <SelectItem value="price_asc">Harga Terendah</SelectItem>
                  <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
                  <SelectItem value="name_asc">Nama (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Nama (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Packages Table Grid or Skeleton */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : (
          <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 shadow-2xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
                <TableRow className="border-border dark:border-slate-800">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    {activeType === "mua" ? "Layanan Rias MUA" : "Paket Foto"}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                    Harga Jual
                  </TableHead>

                  {activeType === "mua" ? (
                    <>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                        Est. Fee MUA
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                        Est. Operasional
                      </TableHead>
                    </>
                  ) : (
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                      Est. Total Biaya
                    </TableHead>
                  )}

                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                    Est. Profit
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                    Margin
                  </TableHead>

                  {activeType === "mua" ? (
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                      Partner MUA
                    </TableHead>
                  ) : (
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                      Bundling MUA
                    </TableHead>
                  )}

                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safePackages.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={activeType === "mua" ? 9 : 8} className="text-center py-12 text-slate-400 dark:text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        {activeType === "mua" ? (
                          <>
                            <Sparkles className="h-8 w-8 text-pink-300 dark:text-pink-800" />
                            <p className="font-medium text-slate-600 dark:text-slate-300">Belum ada paket khusus MUA ditemukan.</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenCreate("mua")}
                              className="mt-2 text-xs border-pink-300 text-pink-700 hover:bg-pink-50"
                            >
                              + Buat Paket Khusus MUA
                            </Button>
                          </>
                        ) : activeType === "photo" ? (
                          <>
                            <Camera className="h-8 w-8 text-blue-300 dark:text-blue-800" />
                            <p className="font-medium text-slate-600 dark:text-slate-300">Belum ada paket foto ditemukan.</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenCreate("photo")}
                              className="mt-2 text-xs"
                            >
                              + Buat Paket Foto Baru
                            </Button>
                          </>
                        ) : (
                          <p>Tidak ada data paket ditemukan dengan filter saat ini.</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  safePackages.data.map((pkg) => {
                    const isMuaPkg = pkg.category === "MUA Only" || Number(pkg.number_of_photographers) === 0;

                    return (
                      <TableRow key={pkg.id} className="border-border dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <TableCell>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{pkg.name}</span>
                            {isMuaPkg && (
                              <Badge
                                variant="outline"
                                className="text-[10px] py-0 px-1.5 border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/40 font-semibold"
                              >
                                Khusus MUA
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2 mt-0.5">
                            {isMuaPkg ? (
                              <>
                                <span className="font-medium text-pink-600 dark:text-pink-400">Layanan Rias</span>
                                <span>•</span>
                                <span>{pkg.duration_minutes} Menit Rias</span>
                                <span>•</span>
                                <span className="text-slate-500 dark:text-slate-400">Tanpa Foto (0 FG)</span>
                              </>
                            ) : (
                              <>
                                <span className="font-medium text-slate-600 dark:text-slate-400">{pkg.category}</span>
                                <span>•</span>
                                <span>{pkg.duration_minutes} Menit</span>
                                <span>•</span>
                                <span>{pkg.number_of_photos} Foto ({pkg.number_of_photographers} FG)</span>
                              </>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                          {formatRupiah(pkg.price)}
                        </TableCell>

                        {activeType === "mua" ? (
                          <>
                            <TableCell className="text-right font-medium text-pink-700 dark:text-pink-300">
                              {formatRupiah(pkg.estimated_mua_fee)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-slate-600 dark:text-slate-300">
                              {formatRupiah(pkg.estimated_operational_cost)}
                            </TableCell>
                          </>
                        ) : (
                          <TableCell className="text-right font-medium text-slate-600 dark:text-slate-300">
                            {formatRupiah(pkg.estimated_total_cost)}
                          </TableCell>
                        )}

                        <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(pkg.estimated_profit)}
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge variant={pkg.estimated_margin >= 30 ? "success" : "warning"}>
                            {pkg.estimated_margin}%
                          </Badge>
                        </TableCell>

                        {/* MUA Status or Partner Column */}
                        <TableCell className="text-center">
                          {isMuaPkg ? (
                            pkg.mua ? (
                              <Badge variant="outline" className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 text-[10px]">
                                {pkg.mua.name}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700 bg-pink-50 dark:bg-pink-950/40 text-[10px] font-semibold">
                                MUA Bebas / Fleksibel
                              </Badge>
                            )
                          ) : pkg.includes_mua ? (
                            <Badge variant="outline" className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-[10px] font-semibold">
                              ✨ MUA Inc.
                            </Badge>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">— Tanpa MUA</span>
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge variant={pkg.status === "ACTIVE" ? "success" : "secondary"}>
                            {pkg.status === "ACTIVE" ? "Aktif" : "Non-Aktif"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center whitespace-nowrap">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus-visible:ring-1"
                                title="Aksi Paket"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 shadow-md">
                              <DropdownMenuItem
                                onClick={() => handleOpenEdit(pkg)}
                                className="cursor-pointer text-xs flex items-center gap-2"
                              >
                                <Edit3 className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                                <span>Edit Paket</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDuplicate(pkg.id)}
                                className="cursor-pointer text-xs flex items-center gap-2"
                              >
                                <Copy className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                                <span>Duplikasi Paket</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(pkg.id)}
                                className="cursor-pointer text-xs flex items-center gap-2"
                              >
                                <Power
                                  className={`h-3.5 w-3.5 ${
                                    pkg.status === "ACTIVE"
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-emerald-600 dark:text-emerald-400"
                                  }`}
                                />
                                <span>{pkg.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(pkg)}
                                className="cursor-pointer text-xs text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40 flex items-center gap-2"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                <span>Hapus Paket</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {safePackages.links && safePackages.links.length > 3 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <p className="text-xs text-slate-500">
                  Menampilkan{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {safePackages.from || 0}
                  </span>{" "}
                  sampai{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {safePackages.to || 0}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {safePackages.total || 0}
                  </span>{" "}
                  paket
                </p>
                <div className="flex items-center gap-1">
                  {safePackages.links.map((link, idx) => {
                    const isPrev = idx === 0;
                    const isNext = idx === safePackages.links.length - 1;

                    return (
                      <Link
                        key={idx}
                        href={link.url || "#"}
                        preserveScroll
                        preserveState
                        className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                          link.active
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                            : !link.url
                            ? "text-slate-300 dark:text-slate-600 pointer-events-none"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                        }`}
                      >
                        {isPrev ? (
                          <ChevronLeft className="h-3.5 w-3.5" />
                        ) : isNext ? (
                          <ChevronRight className="h-3.5 w-3.5" />
                        ) : (
                          <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Form Create/Edit Package with Segmented Type Switch */}
        <Dialog
          open={modalOpen}
          onOpenChange={(val) => {
            if (!form.processing) setModalOpen(val);
          }}
        >
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {editingPackage ? (
                  <>
                    <span>Edit Paket:</span>
                    <span className="font-normal text-slate-600 dark:text-slate-300">{editingPackage.name}</span>
                  </>
                ) : form.data.package_type === "mua" ? (
                  <>
                    <Sparkles className="h-5 w-5 text-pink-600" />
                    <span>Tambah Paket Khusus MUA Saja</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 text-blue-600" />
                    <span>Tambah Paket Foto (+ MUA)</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              {/* Type Switcher in Form */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    form.setData({
                      ...form.data,
                      package_type: "photo",
                      category: form.data.category === "MUA Only" ? "Graduation" : form.data.category,
                      number_of_photographers: Number(form.data.number_of_photographers) === 0 ? 1 : form.data.number_of_photographers,
                      number_of_photos: Number(form.data.number_of_photos) === 0 ? 25 : form.data.number_of_photos,
                    });
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    form.data.package_type !== "mua"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span>Paket Foto (+ MUA)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    form.setData({
                      ...form.data,
                      package_type: "mua",
                      category: "MUA Only",
                      number_of_photographers: 0,
                      number_of_photos: 0,
                      includes_mua: true,
                      estimated_photographer_cost: 0,
                    });
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    form.data.package_type === "mua"
                      ? "bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Paket Khusus MUA Saja</span>
                </button>
              </div>

              {/* Informative helper box */}
              {form.data.package_type === "mua" ? (
                <div className="p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800/60 rounded-xl text-xs text-pink-800 dark:text-pink-300 flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Mode Paket Rias MUA Mandiri:</span> Paket ini khusus layanan tata rias & hairdo tanpa sesi fotografer. Kuota fotografer dan foto otomatis diatur ke 0.
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
                  <Camera className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Mode Paket Fotografi:</span> Paket untuk sesi foto (wisuda, wedding, portrait, dll). Anda dapat menambahkan bundling MUA secara opsional.
                  </div>
                </div>
              )}

              {/* Name & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2 sm:col-span-1">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Nama Paket
                  </Label>
                  <Input
                    required
                    placeholder={
                      form.data.package_type === "mua"
                        ? "misal: Paket MUA Wisuda Glam"
                        : "misal: Signature Graduation"
                    }
                    value={form.data.name}
                    onChange={(e) => form.setData("name", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Kategori
                  </Label>
                  {form.data.package_type === "mua" ? (
                    <Input
                      disabled
                      value="MUA Only"
                      className="text-xs sm:text-sm h-9 sm:h-10 bg-slate-100 dark:bg-slate-800 text-pink-700 dark:text-pink-300 font-semibold"
                    />
                  ) : (
                    <Select
                      value={form.data.category || "Graduation"}
                      onValueChange={(val) => form.setData("category", val)}
                    >
                      <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {photoCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Status Paket
                  </Label>
                  <Select
                    value={form.data.status || "ACTIVE"}
                    onValueChange={(val) => form.setData("status", val)}
                  >
                    <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Aktif (ACTIVE)</SelectItem>
                      <SelectItem value="INACTIVE">Non-Aktif (INACTIVE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price & Duration (and Photos/FG if Photo) */}
              <div
                className={`grid gap-3 sm:gap-4 ${
                  form.data.package_type === "mua"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-2 sm:grid-cols-4"
                }`}
              >
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Harga Jual (Rp)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={form.data.price}
                    onChange={(e) => form.setData("price", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {form.data.package_type === "mua" ? "Durasi Rias (Menit)" : "Durasi Sesi (Menit)"}
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={form.data.duration_minutes}
                    onChange={(e) => form.setData("duration_minutes", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>

                {form.data.package_type !== "mua" && (
                  <>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Jumlah Foto
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        required
                        value={form.data.number_of_photos}
                        onChange={(e) => form.setData("number_of_photos", e.target.value)}
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Jumlah FG
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        required
                        value={form.data.number_of_photographers}
                        onChange={(e) => form.setData("number_of_photographers", e.target.value)}
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* MUA Selection Section */}
              <div
                className={`p-3.5 sm:p-4 rounded-xl border space-y-3 ${
                  form.data.package_type === "mua"
                    ? "bg-pink-50/60 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900/50"
                    : "bg-slate-50 dark:bg-slate-800/60 border-border dark:border-slate-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-pink-500" />
                      <span>{form.data.package_type === "mua" ? "Penugasan & Partner MUA" : "Layanan Bundling MUA"}</span>
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      {form.data.package_type === "mua"
                        ? "Pilih partner MUA default atau biarkan fleksibel saat pemesanan"
                        : "Centang jika paket fotografi ini sudah termasuk jasa rias MUA"}
                    </p>
                  </div>

                  {form.data.package_type !== "mua" && (
                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={form.data.includes_mua}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            form.setData({
                              ...form.data,
                              includes_mua: checked,
                              mua_id: checked ? form.data.mua_id : "",
                              estimated_mua_fee: checked ? form.data.estimated_mua_fee : 0,
                            });
                          }}
                          className="rounded border-slate-300 dark:border-slate-700 text-slate-900 focus:ring-slate-950 h-4 w-4"
                        />
                        <span>{form.data.includes_mua ? "✓ Termasuk MUA" : "— Tanpa MUA"}</span>
                      </label>
                    </div>
                  )}
                </div>

                {(form.data.package_type === "mua" || form.data.includes_mua) && (
                  <div className="space-y-1.5 sm:space-y-2 pt-1 border-t border-border dark:border-slate-700/60">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Partner MUA Default (Opsional)
                    </Label>
                    <Select
                      value={form.data.mua_id ? String(form.data.mua_id) : "flexible"}
                      onValueChange={(val) => {
                        const isFlexible = val === "flexible";
                        const selectedMua = safeMuas.find((m) => String(m.id) === String(val));
                        form.setData({
                          ...form.data,
                          mua_id: isFlexible ? "" : val,
                          estimated_mua_fee: selectedMua?.default_fee ? selectedMua.default_fee : form.data.estimated_mua_fee,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                        <SelectValue placeholder="-- Pilih Partner MUA (Opsional) --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">-- Fleksibel / Tentukan Nanti Saat Jadwal --</SelectItem>
                        {safeMuas.map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {m.name} {m.specialty ? `(${m.specialty})` : ""}{" "}
                            {m.default_fee ? `- ${formatRupiah(m.default_fee)}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Cost Estimations */}
              <div className="border-t border-border dark:border-slate-800 pt-3">
                <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-3">
                  Estimasi Biaya & Margin Keuntungan
                </p>
                <div
                  className={`grid gap-3 ${
                    form.data.package_type === "mua" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
                  }`}
                >
                  {form.data.package_type !== "mua" && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Est. Gaji Fotografer
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={form.data.estimated_photographer_cost}
                        onChange={(e) => form.setData("estimated_photographer_cost", e.target.value)}
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Est. Fee MUA
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={form.data.estimated_mua_fee}
                      onChange={(e) => form.setData("estimated_mua_fee", e.target.value)}
                      className="text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Est. Operasional
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={form.data.estimated_operational_cost}
                      onChange={(e) => form.setData("estimated_operational_cost", e.target.value)}
                      className="text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>
                </div>

                {/* Live Profit Preview */}
                <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-900 dark:text-emerald-300">Total Biaya: </span>
                    <span className="text-emerald-800 dark:text-emerald-200 font-medium">
                      {formatRupiah(estTotalCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div>
                      <span className="font-semibold text-emerald-900 dark:text-emerald-300">Est. Profit: </span>
                      <span className="font-bold text-emerald-950 dark:text-emerald-100">
                        {formatRupiah(estProfit)}
                      </span>
                    </div>
                    <span className="font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px]">
                      Margin {estMargin}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Deskripsi & Fasilitas Paket
                </Label>
                <Textarea
                  placeholder={
                    form.data.package_type === "mua"
                      ? "misal: Termasuk riasan natural glam, hairdo/hijab do, free bulu mata & softlens..."
                      : "misal: Keterangan fasilitas pemotretan, soft file, cetak frame, touch up..."
                  }
                  value={form.data.description}
                  onChange={(e) => form.setData("description", e.target.value)}
                  rows={2}
                  className="text-xs sm:text-sm"
                />
              </div>

              <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={form.processing}
                  onClick={() => setModalOpen(false)}
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4 mr-1" />
                  <span>Batal</span>
                </Button>
                <Button
                  type="submit"
                  disabled={form.processing}
                  className={`w-full sm:w-auto shadow-xs ${
                    form.data.package_type === "mua" ? "bg-pink-600 hover:bg-pink-700 text-white" : ""
                  }`}
                >
                  {form.processing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  <span>{form.processing ? "Menyimpan..." : "Simpan Paket"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={(val) => {
            if (!isDeleting) setDeleteOpen(val);
          }}
          title="Hapus Paket"
          description={`Apakah Anda yakin ingin menghapus paket "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus Paket"
          cancelText="Batal"
          variant="destructive"
          loading={isDeleting}
          disabled={isDeleting}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
}
