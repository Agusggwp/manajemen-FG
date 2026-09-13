import React, { useState, useRef } from "react";
import { formatDate, formatRupiah, getStatusLabel } from "@/lib/utils";
import { Head, useForm, router, Link } from "@inertiajs/react";
import LocationPickerMap from "@/components/ui/LocationPickerMap";
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Clock,
  Sparkles,
  User,
  Camera,
  Eye,
  Mail,
  CheckCircle2,
  LayoutList,
  X,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { usePageLoading, TableSkeleton, CardGridSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ schedules, existingAssignments, filters, customers, packages, photographers, muas }) {
  const safeSchedules = schedules?.data ? schedules : { data: [] };
  const safeExistingAssignments = Array.isArray(existingAssignments) ? existingAssignments : [];
  const safeFilters = filters || {};
  const safeCustomers = Array.isArray(customers) ? customers : [];
  const safePackages = Array.isArray(packages) ? packages : [];
  const safePhotographers = Array.isArray(photographers) ? photographers : [];
  const safeMuas = Array.isArray(muas) ? muas : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [search, setSearch] = useState(safeFilters.search || "");
  const [selectedPackage, setSelectedPackage] = useState(null);

  const form = useForm({
    customer_id: "",
    photo_package_id: "",
    date: new Date().toISOString().split("T")[0],
    start_time: "09:00",
    end_time: "10:00",
    overtime_hours: 0,
    overtime_fee: 0,
    // Mandatory location fields
    location_name: "",
    location_address: "",
    latitude: -8.671234,
    longitude: 115.215678,
    location_radius: 100,
    location_notes: "",
    notes: "",
    photographer_ids: [],
    mua_ids: [],
    photographer_salary: "",
    mua_fee: "",
  });

  const calculateEndTime = (startTime, durationMinutes = 60, overtimeHours = 0) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return startTime;
    const totalMinutes = (parseInt(durationMinutes) || 0) + (parseFloat(overtimeHours) || 0) * 60;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setMinutes(date.getMinutes() + totalMinutes);
    const resHours = String(date.getHours()).padStart(2, "0");
    const resMinutes = String(date.getMinutes()).padStart(2, "0");
    return `${resHours}:${resMinutes}`;
  };

  const checkPhotographerBusy = (photographerId) => {
    if (!form.data.date || !form.data.start_time || !form.data.end_time) {
      return null;
    }
    const formDate = form.data.date;
    const formStart = form.data.start_time;
    const formEnd = form.data.end_time;

    return safeExistingAssignments.find((assignment) => {
      if (assignment.date !== formDate) return false;
      if (!assignment.photographer_ids.includes(photographerId)) return false;
      // Time overlap check: start_time < existing_end && end_time > existing_start
      return formStart < assignment.end_time && formEnd > assignment.start_time;
    });
  };

  const handlePackageChange = (packageId) => {
    const pkg = packages.find((p) => String(p.id) === String(packageId));
    setSelectedPackage(pkg || null);
    
    let defaultMuaFee = form.data.mua_fee;
    let selectedMuaIds = form.data.mua_ids;
    if (pkg) {
      if (pkg.mua_id) {
        selectedMuaIds = [pkg.mua_id];
      }
      if (pkg.mua?.default_fee) {
        defaultMuaFee = pkg.mua.default_fee;
      } else if (pkg.estimated_mua_fee) {
        defaultMuaFee = pkg.estimated_mua_fee;
      }
    }

    const computedEnd = pkg
      ? calculateEndTime(form.data.start_time, pkg.duration_minutes, form.data.overtime_hours)
      : form.data.end_time;

    form.setData({
      ...form.data,
      photo_package_id: packageId,
      mua_ids: selectedMuaIds,
      mua_fee: defaultMuaFee,
      end_time: computedEnd,
    });
  };

  const handleStartTimeChange = (val) => {
    const duration = selectedPackage ? selectedPackage.duration_minutes : 60;
    const computedEnd = calculateEndTime(val, duration, form.data.overtime_hours);
    form.setData({
      ...form.data,
      start_time: val,
      end_time: computedEnd,
    });
  };

  const handleOvertimeHoursChange = (val) => {
    const hours = parseFloat(val) || 0;
    const duration = selectedPackage ? selectedPackage.duration_minutes : 60;
    const computedEnd = calculateEndTime(form.data.start_time, duration, hours);
    form.setData({
      ...form.data,
      overtime_hours: val,
      end_time: computedEnd,
    });
  };

  const handleLocationSelect = ({ lat, lng, address, name }) => {
    form.setData({
      ...form.data,
      latitude: lat,
      longitude: lng,
      location_address: address ? address : form.data.location_address,
      location_name: form.data.location_name ? form.data.location_name : (name || form.data.location_name),
    });
  };

  const handlePhotographerCheckbox = (id) => {
    const current = form.data.photographer_ids;
    if (current.includes(id)) {
      form.setData("photographer_ids", current.filter((x) => x !== id));
    } else {
      form.setData("photographer_ids", [...current, id]);
    }
  };

  const handleMuaCheckbox = (id) => {
    const current = form.data.mua_ids;
    const isAdding = !current.includes(id);
    const updatedMuaIds = isAdding ? [...current, id] : current.filter((x) => x !== id);
    const targetMua = muas.find((m) => m.id === id);

    form.setData({
      ...form.data,
      mua_ids: updatedMuaIds,
      mua_fee: isAdding && targetMua?.default_fee ? targetMua.default_fee : form.data.mua_fee,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post("/admin/schedules", {
      onSuccess: () => {
        setModalOpen(false);
        form.reset();
        setSelectedPackage(null);
      },
    });
  };

  const isNavigating = usePageLoading();
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" | "calendar"

  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setIsSearching(true);
      router.get("/admin/schedules", { search: val }, {
        preserveState: true,
        onFinish: () => setIsSearching(false),
      });
    }, 500);
  };

  const isLoading = isNavigating || isSearching;

  return (
    <>
      <Head title="Manajemen Jadwal" />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Manajemen Jadwal Pemotretan
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Buat jadwal baru, tentukan penugasan tim, dan tetapkan koordinat lokasi pemotretan.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList className="bg-slate-100 border border-slate-200">
                <TabsTrigger value="table" className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <LayoutList className="h-4 w-4" />
                  <span>Tabel</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Kalender</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button onClick={() => setModalOpen(true)}>
              <Plus />
              Buat Jadwal Baru
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari pelanggan, nama lokasi, atau alamat..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          viewMode === "calendar" ? (
            <CardGridSkeleton count={6} />
          ) : (
            <TableSkeleton rows={6} cols={5} />
          )
        ) : viewMode === "calendar" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeSchedules.data.length === 0 ? (
              <div className="col-span-full bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-400">
                Belum ada jadwal pemotretan pada sistem.
              </div>
            ) : (
              safeSchedules.data.map((s) => (
                <Card key={s.id} className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={
                        s.status === "COMPLETED"  ? "success"     :
                        s.status === "SHOOTING"   ? "warning"     :
                        s.status === "SCHEDULED"  ? "info"        :
                        s.status === "CANCELLED"  ? "destructive" :
                        "secondary"
                      }>
                        {getStatusLabel(s.status)}
                      </Badge>
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {s.start_time?.substring(0, 5)} - {s.end_time?.substring(0, 5)}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{s.customer?.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-slate-500 font-medium">{s.photo_package?.name || s.project?.package_name || "Paket Standard"}</p>
                        {Number(s.overtime_hours) > 0 && (
                          <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-300 font-medium">
                            +{s.overtime_hours} Jam Overtime
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1 text-slate-800 font-medium truncate">
                        <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{s.location_name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{s.location_address}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-700">{formatDate(s.date)}</span>
                      <Link href={`/admin/schedules/${s.id}`}>
                        <Button size="sm" variant="outline">
                          Lihat Detail <Eye />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : null}

        {viewMode === "table" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Tanggal & Waktu</TableHead>
                  <TableHead className="font-semibold text-slate-700">Pelanggan</TableHead>
                  <TableHead className="font-semibold text-slate-700">Paket Foto</TableHead>
                  <TableHead className="font-semibold text-slate-700">Lokasi Pemotretan (Wajib)</TableHead>
                  <TableHead className="font-semibold text-slate-700">Tim Bertugas</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeSchedules.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                      Tidak ada jadwal pemotretan ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  safeSchedules.data.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-slate-900 whitespace-nowrap">
                        {formatDate(s.date)} <br />
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {s.start_time?.substring(0, 5)} - {s.end_time?.substring(0, 5)}
                        </span>
                        {Number(s.overtime_hours) > 0 && (
                          <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-300 font-medium block w-max mt-1">
                            +{s.overtime_hours} Jam Overtime
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="font-semibold text-slate-900">
                        {s.customer?.name}
                      </TableCell>

                      <TableCell className="font-medium text-slate-800">
                        <div>{s.photo_package?.name || s.project?.package_name || "-"}</div>
                        {Number(s.overtime_fee) > 0 && (
                          <div className="text-[11px] text-amber-700 font-medium">
                            Overtime: +{formatRupiah(s.overtime_fee)}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="max-w-xs">
                        <div className="font-semibold text-slate-900 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{s.location_name}</span>
                        </div>
                        <span className="text-xs text-slate-400 truncate block">{s.location_address}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Radius GPS: {s.location_radius}m
                        </span>
                      </TableCell>

                      <TableCell className="text-xs">
                        <div className="space-y-1">
                          {s.project?.photographers?.map((p) => (
                            <div key={p.id} className="flex items-center space-x-1 text-slate-800 font-medium">
                              <Camera className="h-3 w-3 text-slate-400" />
                              <span>{p.name}</span>
                            </div>
                          ))}
                          {s.project?.muas?.map((m) => (
                            <div key={m.id} className="flex items-center space-x-1 text-amber-700 font-medium">
                              <Sparkles className="h-3 w-3 text-amber-500" />
                              <span>{m.name}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant={
                            s.status === "COMPLETED"  ? "success"     :
                            s.status === "SHOOTING"   ? "warning"     :
                            s.status === "SCHEDULED"  ? "info"        :
                            s.status === "CANCELLED"  ? "destructive" :
                            "secondary"
                          }
                        >
                          {getStatusLabel(s.status)}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedScheduleId(s.id);
                              setReminderOpen(true);
                            }}
                            title={s.reminder_sent_at ? `Email Peringatan Terkirim (${formatDate(s.reminder_sent_at)}) - Klik untuk kirim ulang` : "Kirim Email Peringatan H-1"}
                          >
                            <Mail className={`h-4 w-4 ${s.reminder_sent_at ? "text-emerald-600 font-bold" : "text-slate-600"}`} />
                          </Button>
                          <Link href={`/admin/schedules/${s.id}`}>
                            <Button variant="ghost" size="icon" title="Lihat Detail">
                              <Eye className="h-4 w-4 text-slate-600" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Modal Create Schedule */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buat Jadwal Pemotretan Baru</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 py-2">
              {/* Customer & Package */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pelanggan (Customer)</Label>
                  <Select
                    value={form.data.customer_id ? String(form.data.customer_id) : ""}
                    onValueChange={(val) => form.setData("customer_id", val)}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="-- Pilih Pelanggan --" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name} ({c.phone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Paket Foto</Label>
                  <Select
                    value={form.data.photo_package_id ? String(form.data.photo_package_id) : ""}
                    onValueChange={(val) => handlePackageChange(val)}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="-- Pilih Paket Foto --" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.id} value={String(pkg.id)}>
                          {pkg.name} - {formatRupiah(pkg.price)} ({pkg.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Package Detail Preview Banner */}
              {selectedPackage && (
                <div className="p-3 bg-[slate-100/70] border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{selectedPackage.name}</span>
                    <span className="text-emerald-700">
                      Harga Paket: {formatRupiah(selectedPackage.price)}
                      {Number(form.data.overtime_fee) > 0 && (
                        <span className="text-amber-700 font-semibold ml-1">
                          (+ Overtime {formatRupiah(form.data.overtime_fee)}) = {formatRupiah(Number(selectedPackage.price) + Number(form.data.overtime_fee))}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-slate-600">
                    <span>Durasi Paket: {selectedPackage.duration_minutes} Menit</span>
                    {Number(form.data.overtime_hours) > 0 && (
                      <span className="text-amber-700 font-medium">
                        + Overtime {form.data.overtime_hours} Jam ({form.data.overtime_hours * 60} Menit)
                      </span>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium text-amber-800">
                      <Sparkles className="h-3 w-3 text-amber-600" />
                      {selectedPackage.mua?.name
                        ? `MUA Paket: ${selectedPackage.mua.name}`
                        : selectedPackage.includes_mua
                          ? "Termasuk MUA Paket"
                          : "— Tanpa MUA"}
                    </span>
                  </div>
                </div>
              )}

              {/* Date & Time & Overtime */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Pemotretan</Label>
                  <Input
                    type="date"
                    required
                    value={form.data.date}
                    onChange={(e) => form.setData("date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jam Mulai</Label>
                  <Input
                    type="time"
                    required
                    value={form.data.start_time}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Jam Selesai</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">(Otomatis)</span>
                  </Label>
                  <Input
                    type="time"
                    required
                    value={form.data.end_time}
                    onChange={(e) => form.setData("end_time", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Overtime (Jam)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="0"
                    value={form.data.overtime_hours}
                    onChange={(e) => handleOvertimeHoursChange(e.target.value)}
                  />
                </div>
              </div>

              {/* Overtime Fee */}
              <div className="space-y-2">
                <Label>Tambahan Biaya Overtime (Rp)</Label>
                <Input
                  type="number"
                  placeholder="0 (misal: 150000)"
                  value={form.data.overtime_fee}
                  onChange={(e) => form.setData("overtime_fee", e.target.value)}
                />
                <p className="text-[11px] text-slate-500">
                  Biaya overtime akan terakumulasi ke total tagihan project pelanggan.
                </p>
              </div>

              {/* MANDATORY LOCATION SECTION */}
              <div className="border-t border-slate-200 pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-rose-600" /> Informasi Lokasi (Pilih di Peta atau Isi Manual)
                  </p>
                </div>

                {/* Interactive Leaflet Map Picker */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Peta Pemilihan Lokasi</Label>
                  <LocationPickerMap
                    latitude={form.data.latitude}
                    longitude={form.data.longitude}
                    radius={form.data.location_radius}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>

                <div>
                  <Label>Nama Lokasi</Label>
                  <Input
                    required
                    placeholder="misal: Kampus Sudirman Unud / Pantai Sanur"
                    value={form.data.location_name}
                    onChange={(e) => form.setData("location_name", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Radius Validasi GPS (Meter)</Label>
                  <Input
                    type="number"
                    required
                    value={form.data.location_radius}
                    onChange={(e) => form.setData("location_radius", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Alamat Lengkap Lokasi</Label>
                  <Input
                    required
                    placeholder="misal: Jl. PB Sudirman, Denpasar Barat, Bali"
                    value={form.data.location_address}
                    onChange={(e) => form.setData("location_address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude GPS</Label>
                    <Input
                      type="number"
                      step="any"
                      required
                      placeholder="-8.671234"
                      value={form.data.latitude}
                      onChange={(e) => form.setData("latitude", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Longitude GPS</Label>
                    <Input
                      type="number"
                      step="any"
                      required
                      placeholder="115.215678"
                      value={form.data.longitude}
                      onChange={(e) => form.setData("longitude", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Assignment Section */}
              <div className="border-t border-slate-200 pt-3 space-y-4">
                <p className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Penugasan Tim & Gaji Project
                </p>

                <div>
                  <Label className="mb-2 block">Pilih Photographer (Minimal 1)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {photographers.map((p) => {
                      const conflict = checkPhotographerBusy(p.id);
                      const isBusy = Boolean(conflict);
                      const isSelected = form.data.photographer_ids.includes(p.id);

                      return (
                        <label
                          key={p.id}
                          title={
                            isBusy
                              ? `Photographer ${p.name} sudah ada jadwal ${conflict.start_time} - ${conflict.end_time} (${conflict.customer_name || "Pelanggan"})`
                              : ""
                          }
                          className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between transition-colors ${isBusy
                              ? "bg-rose-50/80 border-rose-200 text-rose-500 cursor-not-allowed opacity-80"
                              : isSelected
                                ? "bg-slate-900 text-white border-slate-900 cursor-pointer"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer"
                            }`}
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              disabled={isBusy}
                              checked={isSelected && !isBusy}
                              onChange={() => !isBusy && handlePhotographerCheckbox(p.id)}
                              className="hidden"
                            />
                            <Camera className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate font-medium">{p.name}</span>
                          </div>
                          {isBusy && (
                            <div className="mt-1 text-[10px] font-bold text-rose-600 flex items-center gap-1">
                              <span>⚠️ Bentrok ({conflict.start_time} - {conflict.end_time})</span>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  {form.errors.photographer_ids && (
                    <p className="text-xs text-rose-600 font-semibold mt-1">
                      {form.errors.photographer_ids}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Gaji Photographer per Project (Rp)</Label>
                    <Input
                      type="number"
                      placeholder="Default dari estimasi paket"
                      value={form.data.photographer_salary}
                      onChange={(e) => form.setData("photographer_salary", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Fee MUA per Project (Rp)</Label>
                    <Input
                      type="number"
                      disabled
                      placeholder="Otomatis dari fee MUA"
                      value={form.data.mua_fee}
                      onChange={(e) => form.setData("mua_fee", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Catatan Tambahan</Label>
                <Textarea
                  placeholder="Catatan khusus untuk photographer..."
                  value={form.data.notes}
                  onChange={(e) => form.setData("notes", e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  <X /> Batal
                </Button>
                <Button type="submit" disabled={form.processing}>
                  <Plus />
                  {form.processing ? "Memproses..." : "Buat Jadwal & Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={reminderOpen}
          onOpenChange={setReminderOpen}
          title="Kirim Email Peringatan"
          description="Apakah Anda yakin ingin mengirim email peringatan (reminder) H-1 ke Pelanggan, Fotografer, dan MUA untuk jadwal pemotretan ini?"
          confirmText="Kirim Email"
          cancelText="Batal"
          variant="default"
          icon={Mail}
          onConfirm={() => {
            setReminderOpen(false);
            if (selectedScheduleId) {
              router.post(`/admin/schedules/${selectedScheduleId}/send-reminder`);
            }
          }}
        />
      </div>
    </>
  );
}
