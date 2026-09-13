import React, { useState, useRef, useEffect } from "react";
import { Head } from "@inertiajs/react";
import {
  Terminal,
  Database,
  Box,
  Zap,
  RefreshCw,
  Copy,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HardDrive,
  Cpu,
  Server,
  Play,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Index({ systemInfo: initialSystemInfo }) {
  const [systemInfo, setSystemInfo] = useState(initialSystemInfo);
  const [activeTab, setActiveTab] = useState("database");
  const [logs, setLogs] = useState([
    {
      type: "info",
      timestamp: new Date().toLocaleTimeString(),
      text: "Selamat datang di Konsol Web Developer Tools ARTDEVATA.\nPilih perintah di bawah untuk mengeksekusi migrasi database, instalasi dependensi, atau pembersihan cache.",
    },
  ]);
  const [runningAction, setRunningAction] = useState(null);
  const [copied, setCopied] = useState(false);

  // Modal State for Dangerous Actions (migrate:fresh)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  const terminalEndRef = useRef(null);

  // Auto-scroll terminal output to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (type, text) => {
    setLogs((prev) => [
      ...prev,
      {
        type,
        timestamp: new Date().toLocaleTimeString(),
        text,
      },
    ]);
  };

  const clearLogs = () => {
    setLogs([
      {
        type: "info",
        timestamp: new Date().toLocaleTimeString(),
        text: "Konsol log dibersihkan.",
      },
    ]);
  };

  const copyLogs = () => {
    const fullText = logs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.text}`).join("\n");
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = async (actionKey, actionTitle, requiresConfirm = false) => {
    if (requiresConfirm) {
      setPendingAction({ key: actionKey, title: actionTitle });
      setConfirmText("");
      setConfirmModalOpen(true);
      return;
    }

    executeCommand(actionKey, actionTitle);
  };

  const executeCommand = async (actionKey, actionTitle, confirmInput = "") => {
    setRunningAction(actionKey);
    addLog("info", `⚡ [START] Mengirim permintaan eksekusi: ${actionTitle}...`);

    try {
      const csrfToken =
        document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";

      const response = await fetch("/admin/dev-tools/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": csrfToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          action: actionKey,
          confirm_text: confirmInput,
        }),
      });

      const data = await response.json();

      if (data.systemInfo) {
        setSystemInfo(data.systemInfo);
      }

      if (response.ok && data.success) {
        addLog("success", `✅ [SUCCESS] Perintah '${actionTitle}' selesai:\n${data.output}`);
      } else {
        addLog("error", `❌ [ERROR] Perintah '${actionTitle}' gagal:\n${data.message || data.output}`);
      }
    } catch (err) {
      addLog("error", `❌ [CRITICAL ERROR] Gagal menghubungi server:\n${err.message}`);
    } finally {
      setRunningAction(null);
    }
  };

  const handleConfirmFreshSubmit = (e) => {
    e.preventDefault();
    if (confirmText.toUpperCase() !== "RESET") return;
    setConfirmModalOpen(false);
    if (pendingAction) {
      executeCommand(pendingAction.key, pendingAction.title, confirmText);
    }
  };

  return (
    <>
      <Head title="Developer Tools & Web Migration" />

      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Developer Tools & Web Migration
              </h1>
              <Badge className="bg-emerald-600 text-white font-mono text-xs">
                v1.0.0
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Konsol kontrol sistem untuk eksekusi migrasi database, manajemen dependensi (Composer/NPM), serta pembersihan cache.
            </p>
          </div>
        </div>

        {/* System Overview Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* PHP & Laravel Info */}
          <Card className="border-slate-200 shadow-2xs w-full min-w-0">
            <CardContent className="p-4 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  PHP & Laravel
                </p>
                <p className="text-lg font-bold text-slate-900 mt-1 font-mono truncate">
                  PHP {systemInfo?.php_version?.split("-")[0]}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  Laravel v{systemInfo?.laravel_version} ({systemInfo?.environment})
                </p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <Cpu className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Database & Migrations */}
          <Card className="border-slate-200 shadow-2xs w-full min-w-0">
            <CardContent className="p-4 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Database & Migrasi
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-lg font-bold text-slate-900 font-mono">
                    {systemInfo?.executed_migrations}/{systemInfo?.total_migration_files}
                  </p>
                  {systemInfo?.pending_migrations > 0 ? (
                    <Badge variant="destructive" className="animate-pulse text-[10px] py-0 shrink-0">
                      {systemInfo.pending_migrations} Pending
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 text-[10px] py-0 shrink-0">
                      Up to date
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate" title={systemInfo?.db_name}>
                  Driver: {systemInfo?.db_driver} ({systemInfo?.db_name})
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Database className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Server & Environment */}
          <Card className="border-slate-200 shadow-2xs w-full min-w-0">
            <CardContent className="p-4 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Sistem & Memory
                </p>
                <p className="text-lg font-bold text-slate-900 mt-1 font-mono truncate">
                  {systemInfo?.memory_limit}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate" title={systemInfo?.os}>
                  OS: {systemInfo?.os?.split(" ")[0]}
                </p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <Server className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Storage & Assets */}
          <Card className="border-slate-200 shadow-2xs w-full min-w-0">
            <CardContent className="p-4 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Symlink Storage
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {systemInfo?.storage_symlink_exists ? (
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Terhubung
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-amber-600 flex items-center gap-1">
                      <XCircle className="h-4 w-4" /> Belum Link
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  public/storage link
                </p>
              </div>
              <div className="p-3 bg-sky-50 text-sky-600 rounded-xl shrink-0">
                <HardDrive className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid: Control Panel Tabs + Terminal Console */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
          {/* Left Column: Command Categories */}
          <div className="w-full min-w-0 space-y-6">
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-2xs w-full">
              <button
                type="button"
                onClick={() => setActiveTab("database")}
                className={`flex-1 py-2.5 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "database"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Database className="h-4 w-4 shrink-0" />
                <span className="truncate">Database & Migrasi</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("packages")}
                className={`flex-1 py-2.5 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "packages"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Box className="h-4 w-4 shrink-0" />
                <span className="truncate">Dependensi</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cache")}
                className={`flex-1 py-2.5 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "cache"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Zap className="h-4 w-4 shrink-0" />
                <span className="truncate">Maintenance</span>
              </button>
            </div>

            {/* TAB 1: DATABASE & MIGRATIONS */}
            {activeTab === "database" && (
              <Card className="border-slate-200 shadow-2xs w-full min-w-0">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900">
                    <Database className="h-5 w-5 text-emerald-600 shrink-0" /> Eksekusi Migrasi & Database
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Perintah Artisan untuk membuat tabel, migrasi struktur database, dan menanam data awal (seeders).
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {/* Migrate */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Jalankan Migrasi Database</span>
                        <code className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          php artisan migrate
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Mengeksekusi semua file migrasi yang pending di folder <code className="text-xs">database/migrations</code>.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleExecute("migrate", "php artisan migrate")}
                      disabled={runningAction !== null}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                    >
                      {runningAction === "migrate" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      Jalankan
                    </Button>
                  </div>

                  {/* Migrate Status */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Cek Status Migrasi</span>
                        <code className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          php artisan migrate:status
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Menampilkan tabel status file migrasi mana yang sudah atau belum dijalankan.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExecute("migrate_status", "php artisan migrate:status")}
                      disabled={runningAction !== null}
                      className="shrink-0"
                    >
                      {runningAction === "migrate_status" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Cek Status"
                      )}
                    </Button>
                  </div>

                  {/* DB Seed */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Jalankan Seeders</span>
                        <code className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          php artisan db:seed
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Menanamkan data default/master ke dalam database dari <code className="text-xs">DatabaseSeeder</code>.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleExecute("db_seed", "php artisan db:seed")}
                      disabled={runningAction !== null}
                      className="shrink-0"
                    >
                      {runningAction === "db_seed" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Run Seeders"
                      )}
                    </Button>
                  </div>

                  {/* Migrate Rollback */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Rollback Migrasi Terakhir</span>
                        <code className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          php artisan migrate:rollback
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Membatalkan batch migrasi database yang paling terakhir dijalankan.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExecute("migrate_rollback", "php artisan migrate:rollback")}
                      disabled={runningAction !== null}
                      className="text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100 shrink-0"
                    >
                      {runningAction === "migrate_rollback" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Rollback"
                      )}
                    </Button>
                  </div>

                  {/* Dangerous: Migrate Fresh */}
                  <div className="p-3 border border-red-200 rounded-xl bg-red-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-red-900 text-sm flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" /> Reset Total Database (Fresh)
                        </span>
                        <code className="text-[11px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-mono">
                          php artisan migrate:fresh
                        </code>
                      </div>
                      <p className="text-xs text-red-600 mt-1">
                        PERINGATAN: Menghapus SELURUH tabel dan membuat ulang struktur dari awal.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleExecute("migrate_fresh", "php artisan migrate:fresh", true)}
                      disabled={runningAction !== null}
                      className="shrink-0"
                    >
                      {runningAction === "migrate_fresh" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Reset DB"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB 2: PACKAGES & DEPENDENCIES */}
            {activeTab === "packages" && (
              <Card className="border-slate-200 shadow-2xs w-full min-w-0">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900">
                    <Box className="h-5 w-5 text-indigo-600 shrink-0" /> Instalasi & Build Dependensi
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Perintah untuk menginstal package Composer (PHP) dan NPM (JavaScript/Vite).
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {/* Composer Install */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Composer Install</span>
                        <code className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          composer install
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Mengunduh dan memasang vendor dependensi PHP berdasarkan <code className="text-xs">composer.lock</code>.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleExecute("composer_install", "composer install")}
                      disabled={runningAction !== null}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                    >
                      {runningAction === "composer_install" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Instal PHP Deps"
                      )}
                    </Button>
                  </div>

                  {/* Composer Dump Autoload */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Dump Autoload</span>
                        <code className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          composer dump-autoload
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Memperbarui peta kelas autoloader Composer tanpa mengunduh ulang package.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExecute("composer_dump", "composer dump-autoload")}
                      disabled={runningAction !== null}
                      className="shrink-0"
                    >
                      {runningAction === "composer_dump" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Dump Autoload"
                      )}
                    </Button>
                  </div>

                  {/* NPM Install */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-sky-300 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">NPM Install</span>
                        <code className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          npm install
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Mengunduh package Node.js ke <code className="text-xs">node_modules</code>.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleExecute("npm_install", "npm install")}
                      disabled={runningAction !== null}
                      className="shrink-0"
                    >
                      {runningAction === "npm_install" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Instal NPM"
                      )}
                    </Button>
                  </div>

                  {/* NPM Build */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Build Frontend Assets</span>
                        <code className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          npm run build
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Mengomplikasi asset Vite React/JS untuk lingkungan produksi (public/build).
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleExecute("npm_build", "npm run build")}
                      disabled={runningAction !== null}
                      className="bg-slate-900 hover:bg-slate-800 text-white shrink-0"
                    >
                      {runningAction === "npm_build" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Build Production"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB 3: MAINTENANCE & CACHE CLEAR */}
            {activeTab === "cache" && (
              <Card className="border-slate-200 shadow-2xs w-full min-w-0">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900">
                    <Zap className="h-5 w-5 text-amber-500 shrink-0" /> Pembersihan Cache & System Storage
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Perintah untuk membersihkan cache aplikasi, konfigurasi, route, dan menghubungkan storage publik.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {/* Optimize Clear */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Clear All Cache (Optimize Clear)</span>
                        <code className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          php artisan optimize:clear
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Clear cache aplikasi, konfigurasi, rute, view compiled, dan event sekaligus.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleExecute("optimize_clear", "php artisan optimize:clear")}
                      disabled={runningAction !== null}
                      className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                    >
                      {runningAction === "optimize_clear" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Clear All Cache"
                      )}
                    </Button>
                  </div>

                  {/* Storage Link */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-sky-300 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Buat Symlink Storage</span>
                        <code className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          php artisan storage:link
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Membuat symbolic link dari <code className="text-xs">public/storage</code> ke <code className="text-xs">storage/app/public</code> untuk akses media publik.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExecute("storage_link", "php artisan storage:link")}
                      disabled={runningAction !== null}
                      className="shrink-0"
                    >
                      {runningAction === "storage_link" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Create Link"
                      )}
                    </Button>
                  </div>

                  {/* Route Clear & View Clear Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExecute("route_clear", "php artisan route:clear")}
                      disabled={runningAction !== null}
                      className="justify-start h-auto p-3 text-left w-full"
                    >
                      <div>
                        <span className="font-bold text-xs block text-slate-900">Clear Route Cache</span>
                        <code className="text-[10px] text-slate-500 font-mono">php artisan route:clear</code>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExecute("view_clear", "php artisan view:clear")}
                      disabled={runningAction !== null}
                      className="justify-start h-auto p-3 text-left w-full"
                    >
                      <div>
                        <span className="font-bold text-xs block text-slate-900">Clear View Cache</span>
                        <code className="text-[10px] text-slate-500 font-mono">php artisan view:clear</code>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Interactive Terminal Console */}
          <div className="w-full min-w-0">
            <Card className="border-slate-800 bg-slate-950 text-slate-100 shadow-xl overflow-hidden flex flex-col h-full min-h-[480px] w-full">
              {/* Terminal Title Bar */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="h-3 w-3 rounded-full bg-red-500 shrink-0 inline-block" />
                  <div className="h-3 w-3 rounded-full bg-amber-500 shrink-0 inline-block" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500 shrink-0 inline-block" />
                  <span className="text-xs font-mono font-semibold text-slate-400 ml-2 flex items-center gap-1.5 truncate">
                    <Terminal className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    artdevata@server:~ console output
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {runningAction && (
                    <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-400 text-[10px] animate-pulse">
                      Processing...
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={copyLogs}
                    title="Copy Output Console"
                    className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={clearLogs}
                    title="Bersihkan Log Console"
                    className="h-7 w-7 text-slate-400 hover:text-red-400 hover:bg-slate-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Terminal Logs Output Box */}
              <div className="p-4 flex-1 font-mono text-xs overflow-y-auto space-y-3 selection:bg-emerald-900 selection:text-emerald-100 max-h-[550px] w-full">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={`leading-relaxed whitespace-pre-wrap break-words p-2 rounded ${
                      log.type === "error"
                        ? "bg-red-950/60 text-red-300 border-l-2 border-red-500"
                        : log.type === "success"
                        ? "bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500"
                        : "text-slate-300 border-l-2 border-slate-700"
                    }`}
                  >
                    <span className="text-[10px] opacity-60 mr-2 text-slate-400">
                      [{log.timestamp}]
                    </span>
                    {log.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Bottom Prompt Bar */}
              <div className="bg-slate-900/80 px-4 py-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between shrink-0">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="text-emerald-400 font-bold">$</span> ready for commands
                </span>
                <span className="text-[10px] text-slate-500 shrink-0">ARTDEVATA System</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Destructive Commands */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-5 w-5" /> Konfirmasi Reset Database
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Perintah <code className="font-bold text-red-600">php artisan migrate:fresh</code> akan menghapus SEMUA tabel dan data dalam database sistem ARTDEVATA.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmFreshSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Ketik <strong className="text-red-600 font-mono">RESET</strong> di bawah ini untuk konfirmasi:
              </label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Ketik RESET"
                className="font-mono text-sm uppercase focus:ring-red-500"
                autoFocus
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={confirmText.toUpperCase() !== "RESET"}
              >
                Ya, Reset Database Now
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
