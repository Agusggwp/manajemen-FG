import React, { useState, useMemo } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Save,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  Search,
  Upload,
  Link as LinkIcon,
  HelpCircle,
  RefreshCw,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/sonner";

const PRESET_CATEGORIES = [
  "PERNIKAHAN",
  "UPACARA YADNYA",
  "GRADUATION",
  "PREWEDDING",
  "ACARA PERUSAHAAN",
  "STUDIO GEAR",
  "FAMILY & MATERNITY",
  "COMMERCIAL & BRAND",
];

export default function Index({ portfolios = [], portfolioSettings = {} }) {
  // Search & category filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Section Settings Form
  const sectionForm = useForm({
    public_portfolio_section_title:
      portfolioSettings?.public_portfolio_section_title || "Galeri Portofolio & Perlengkapan Studio",
    public_portfolio_section_subtitle:
      portfolioSettings?.public_portfolio_section_subtitle || "Dokumentasi eksklusif karya fotografi & kelengkapan studio ARTDEVATA",
    public_portfolio_show: portfolioSettings?.public_portfolio_show ?? "true",
  });

  // Create / Edit Form
  const itemForm = useForm({
    category: "",
    title: "",
    description: "",
    image: "",
    image_file: null,
    sort_order: 1,
    is_active: true,
  });

  const [imageInputMode, setImageInputMode] = useState("file"); // 'file' | 'url'
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // Categories list for filter pills
  const availableCategories = useMemo(() => {
    const cats = new Set(portfolios.map((p) => p.category).filter(Boolean));
    return Array.from(cats);
  }, [portfolios]);

  // Filtered Portfolios
  const filteredPortfolios = useMemo(() => {
    return portfolios.filter((p) => {
      const matchCat = selectedCategory === "ALL" || p.category === selectedCategory;
      const matchSearch =
        !searchTerm ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [portfolios, selectedCategory, searchTerm]);

  // Handle Opening Create Modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    itemForm.setData({
      category: "PERNIKAHAN",
      title: "",
      description: "",
      image: "/images/pawiwahan.jpeg",
      image_file: null,
      sort_order: (portfolios.length > 0 ? Math.max(...portfolios.map((p) => p.sort_order || 0)) : 0) + 1,
      is_active: true,
    });
    setImageInputMode("file");
    setImagePreviewUrl("");
    setIsCreateOpen(true);
  };

  // Handle Opening Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    itemForm.setData({
      category: item.category || "PERNIKAHAN",
      title: item.title || "",
      description: item.description || "",
      image: item.image || "",
      image_file: null,
      sort_order: item.sort_order ?? 1,
      is_active: Boolean(item.is_active),
    });
    setImageInputMode(item.image?.startsWith("http") || item.image?.startsWith("/") ? "url" : "file");
    setImagePreviewUrl(item.image_url || item.image || "");
    setIsCreateOpen(true);
  };

  // Handle Image File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      itemForm.setData("image_file", file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle Form Submit
  const handleSaveItem = (e) => {
    e.preventDefault();

    if (editingItem) {
      // Update with multipart support
      router.post(
        `/admin/portfolios/${editingItem.id}`,
        {
          _method: "PUT",
          ...itemForm.data,
        },
        {
          preserveScroll: true,
          forceFormData: true,
          onSuccess: () => {
            setIsCreateOpen(false);
            setEditingItem(null);
            toast.success("Item portofolio berhasil diperbarui!");
          },
          onError: (err) => {
            const firstErr = Object.values(err)[0];
            toast.error(firstErr || "Gagal memperbarui item portofolio.");
          },
        }
      );
    } else {
      // Create new
      itemForm.post("/admin/portfolios", {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
          setIsCreateOpen(false);
          itemForm.reset();
          toast.success("Item portofolio baru berhasil ditambahkan!");
        },
        onError: (err) => {
          const firstErr = Object.values(err)[0];
          toast.error(firstErr || "Gagal menambahkan item portofolio.");
        },
      });
    }
  };

  // Handle Toggle Active Status
  const handleToggleStatus = (item) => {
    router.patch(
      `/admin/portfolios/${item.id}/toggle-status`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success(`Status "${item.title}" berhasil diubah.`);
        },
      }
    );
  };

  // Handle Delete
  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    router.delete(`/admin/portfolios/${deleteItem.id}`, {
      preserveScroll: true,
      onFinish: () => {
        setIsDeleting(false);
        setDeleteItem(null);
      },
      onSuccess: () => {
        toast.success("Item portofolio berhasil dihapus.");
      },
    });
  };

  // Handle Move Order Up / Down
  const handleMoveOrder = (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= portfolios.length) return;

    const newItems = [...portfolios];
    const currentItem = newItems[index];
    const targetItem = newItems[targetIndex];

    const currentOrder = currentItem.sort_order;
    const targetOrder = targetItem.sort_order;

    // Swap sort orders
    const payload = [
      { id: currentItem.id, sort_order: targetOrder === currentOrder ? targetOrder + (direction === "up" ? -1 : 1) : targetOrder },
      { id: targetItem.id, sort_order: currentOrder },
    ];

    router.post(
      "/admin/portfolios/reorder",
      { items: payload },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Urutan slide berhasil diperbarui.");
        },
      }
    );
  };

  // Handle Section Settings Save
  const handleSaveSectionSettings = (e) => {
    e.preventDefault();
    sectionForm.post("/admin/portfolios/section-settings", {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Pengaturan section landing page berhasil disimpan!");
      },
    });
  };

  // Active slide for live miniature preview
  const activePreviewItem =
    portfolios[previewSlideIndex] || portfolios[0] || {
      category: "PERNIKAHAN",
      title: "Dokumentasi Pernikahan",
      description: "Pratinjau portofolio",
      image_url: "/images/pawiwahan.jpeg",
    };

  return (
    <>
      <Head title="Kelola Galeri Portofolio & Perlengkapan" />

      <div className="space-y-6 max-w-7xl pb-12">
        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ImageIcon className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Kelola Galeri Portofolio & Perlengkapan Studio
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Manajemen konten foto slide portofolio, kategori, deskripsi & pengaturan section untuk landing page publik (/).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="/#portofolio"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Buka di Web</span>
            </a>
            <Button onClick={handleOpenCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Tambah Slide Portofolio</span>
            </Button>
          </div>
        </div>

        {/* SECTION 1: LIVE INTERACTIVE PREVIEW & SECTION SETTINGS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: Interactive Live Mini Preview */}
          <div className="lg:col-span-7 flex flex-col">
            <Card className="border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden h-full flex flex-col bg-slate-900 text-white">
              <CardHeader className="p-4 border-b border-white/10 bg-slate-950/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-400" />
                  <CardTitle className="text-xs font-bold text-white tracking-wide uppercase">
                    Pratinjau Langsung (Live Preview di Landing Page)
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-300 bg-emerald-950/40">
                  {portfolios.length} Slide Aktif
                </Badge>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black group">
                  <img
                    src={activePreviewItem.image_url || activePreviewItem.image || "/images/pawiwahan.jpeg"}
                    alt={activePreviewItem.title}
                    className="w-full h-full object-cover transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/images/pawiwahan.jpeg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                      {activePreviewItem.category}
                    </span>
                  </div>

                  {/* Title & Desc Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10">
                    <h4 className="text-sm font-bold text-white truncate">
                      {activePreviewItem.title}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
                      {activePreviewItem.description || "Tidak ada deskripsi."}
                    </p>
                  </div>
                </div>

                {/* Mini selector thumbnails */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                  {portfolios.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPreviewSlideIndex(idx)}
                      className={`relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        previewSlideIndex === idx
                          ? "border-emerald-400 scale-105 shadow-md shadow-emerald-500/20"
                          : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={item.image_url || item.image || "/images/pawiwahan.jpeg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/pawiwahan.jpeg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Section Settings on Public Page */}
          <div className="lg:col-span-5 flex flex-col">
            <Card className="border-slate-200 dark:border-slate-800 shadow-2xs h-full flex flex-col">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 p-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Sliders className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Konfigurasi Section Landing Page
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Atur judul heading dan visibilitas section ini pada halaman publik (/).
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveSectionSettings} className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                    <div>
                      <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Tampilkan Section di Web
                      </Label>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Aktifkan agar section galeri terlihat di halaman depan publik.
                      </p>
                    </div>
                    <Switch
                      checked={sectionForm.data.public_portfolio_show === "true"}
                      onCheckedChange={(val) =>
                        sectionForm.setData("public_portfolio_show", val ? "true" : "false")
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Judul Utama Section
                    </Label>
                    <Input
                      value={sectionForm.data.public_portfolio_section_title}
                      onChange={(e) => sectionForm.setData("public_portfolio_section_title", e.target.value)}
                      placeholder="Galeri Portofolio & Perlengkapan Studio"
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Sub-Judul / Keterangan (Opsional)
                    </Label>
                    <Textarea
                      rows={2}
                      value={sectionForm.data.public_portfolio_section_subtitle}
                      onChange={(e) => sectionForm.setData("public_portfolio_section_subtitle", e.target.value)}
                      placeholder="Dokumentasi eksklusif karya fotografi & kelengkapan studio ARTDEVATA"
                      className="text-xs resize-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={sectionForm.processing}
                  className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white text-xs h-9"
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  <span>Simpan Konfigurasi Section</span>
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* SECTION 2: PORTFOLIO ITEMS LIST & MANAGEMENT */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-2xs">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Daftar Slide Portofolio ({portfolios.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Klik ikon panah atas/bawah untuk mengatur urutan slide di halaman depan.
                </CardDescription>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari judul / kategori..."
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1">
              <Button
                variant={selectedCategory === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("ALL")}
                className="h-7 text-xs px-2.5 rounded-lg"
              >
                Semua ({portfolios.length})
              </Button>
              {availableCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="h-7 text-xs px-2.5 rounded-lg shrink-0"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {filteredPortfolios.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Tidak ada slide portofolio
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                  {searchTerm
                    ? "Tidak ditemukan portofolio yang cocok dengan kata kunci pencarian Anda."
                    : "Belum ada item portofolio yang ditambahkan. Silakan klik tombol 'Tambah Slide Portofolio'."}
                </p>
                <Button onClick={handleOpenCreate} size="sm" className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Tambah Slide Baru
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPortfolios.map((item, index) => {
                  const itemImg = item.image_url || item.image || "/images/pawiwahan.jpeg";
                  const isFirst = index === 0;
                  const isLast = index === filteredPortfolios.length - 1;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        item.is_active
                          ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                          : "border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-950/40 opacity-70"
                      }`}
                    >
                      {/* Left: Thumbnail + Reorder controls + Info */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {/* Reorder Buttons */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveOrder(index, "up")}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                            title="Pindah ke Atas"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-[10px] font-bold text-slate-400">
                            #{item.sort_order || index + 1}
                          </span>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveOrder(index, "down")}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                            title="Pindah ke Bawah"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-xs">
                          <img
                            src={itemImg}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/images/pawiwahan.jpeg";
                            }}
                          />
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300 tracking-wider">
                              {item.category}
                            </span>
                            {item.is_active ? (
                              <Badge className="bg-emerald-500 text-white text-[10px] py-0 px-2 h-4">
                                Aktif di Web
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px] py-0 px-2 h-4 text-slate-500">
                                Disembunyikan
                              </Badge>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.description || "Tidak ada deskripsi."}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* Switch Active Toggle */}
                        <div className="flex items-center gap-2 mr-2">
                          <Switch
                            checked={Boolean(item.is_active)}
                            onCheckedChange={() => handleToggleStatus(item)}
                            title={item.is_active ? "Klik untuk sembunyikan" : "Klik untuk tampilkan"}
                          />
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          <span>Edit</span>
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteItem(item)}
                          className="h-8 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CREATE / EDIT MODAL DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {editingItem ? <Edit2 className="h-5 w-5 text-emerald-600" /> : <Plus className="h-5 w-5 text-emerald-600" />}
              <span>{editingItem ? "Edit Slide Portofolio" : "Tambah Slide Portofolio Baru"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Isi data foto, kategori, dan deskripsi yang akan ditampilkan pada slider landing page.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveItem} className="space-y-4 pt-2">
            {/* Kategori dengan Preset Tags */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Kategori Portofolio <span className="text-rose-500">*</span>
              </Label>
              <Input
                required
                value={itemForm.data.category}
                onChange={(e) => itemForm.setData("category", e.target.value.toUpperCase())}
                placeholder="Misal: PERNIKAHAN, GRADUATION, UPACARA YADNYA"
                className="uppercase text-xs"
              />
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-400 font-medium">Preset Cepat:</span>
                {PRESET_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => itemForm.setData("category", cat)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-600 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Judul Slide */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Judul Slide <span className="text-rose-500">*</span>
              </Label>
              <Input
                required
                value={itemForm.data.title}
                onChange={(e) => itemForm.setData("title", e.target.value)}
                placeholder="Misal: Dokumentasi Pernikahan Adat Bali"
                className="text-xs"
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Deskripsi Singkat
              </Label>
              <Textarea
                rows={3}
                value={itemForm.data.description}
                onChange={(e) => itemForm.setData("description", e.target.value)}
                placeholder="Jelaskan konsep, nuansa, atau detail layanan foto ini..."
                className="text-xs resize-none"
              />
            </div>

            {/* Gambar Slide: Upload File / URL */}
            <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Foto / Gambar Portofolio <span className="text-rose-500">*</span>
                </Label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setImageInputMode("file")}
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                      imageInputMode === "file"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    Unggah File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode("url")}
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                      imageInputMode === "url"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    URL / Path
                  </button>
                </div>
              </div>

              {imageInputMode === "file" ? (
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  <p className="text-[10px] text-slate-400">
                    Format: JPG, PNG, WEBP. Maksimal 5MB. Rasio optimal 16:9 atau 4:3.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={itemForm.data.image}
                    onChange={(e) => {
                      itemForm.setData("image", e.target.value);
                      setImagePreviewUrl(e.target.value);
                    }}
                    placeholder="https://... atau /images/graduation.jpg"
                    className="text-xs"
                  />
                  <p className="text-[10px] text-slate-400">
                    Masukkan URL gambar langsung atau path aset lokal internal (misal: /images/metatah.jpg).
                  </p>
                </div>
              )}

              {/* Preview Box */}
              {imagePreviewUrl && (
                <div className="mt-2 relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview Foto"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/pawiwahan.jpeg";
                    }}
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[9px] text-white">
                    Pratinjau Foto
                  </span>
                </div>
              )}
            </div>

            {/* Urutan & Status Aktif */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Nomor Urut Tampilan
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={itemForm.data.sort_order}
                  onChange={(e) => itemForm.setData("sort_order", parseInt(e.target.value) || 1)}
                  className="text-xs"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 self-end">
                <div>
                  <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Status Aktif
                  </Label>
                  <span className="text-[10px] text-slate-400">Tampilkan di slider</span>
                </div>
                <Switch
                  checked={Boolean(itemForm.data.is_active)}
                  onCheckedChange={(val) => itemForm.setData("is_active", val)}
                />
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={itemForm.processing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                <span>{editingItem ? "Simpan Perubahan" : "Simpan Slide Baru"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        open={Boolean(deleteItem)}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        title="Hapus Slide Portofolio"
        description={`Apakah Anda yakin ingin menghapus slide "${deleteItem?.title}" (${deleteItem?.category})? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Slide"
        cancelText="Batal"
        loading={isDeleting}
        variant="destructive"
        icon={Trash2}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
