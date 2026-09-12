# 📸 Manajemen FG — Sistem Manajemen Studio Fotografi

Sistem manajemen operasional studio fotografi berbasis web yang dibangun untuk **Art Devata**. Aplikasi ini menangani seluruh alur kerja studio — mulai dari penjadwalan sesi foto, penugasan fotografer & MUA, validasi kehadiran berbasis GPS, hingga pelaporan keuangan.

---

## 📋 Daftar Isi

- [Tentang Sistem](#tentang-sistem)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Alur Kerja Sistem](#alur-kerja-sistem)
- [Peran Pengguna](#peran-pengguna)
- [Struktur Database](#struktur-database)
- [Cara Instalasi](#cara-instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Modul & Fitur Detail](#modul--fitur-detail)
- [Catatan Teknis](#catatan-teknis)

---

## Tentang Sistem

Sistem ini dirancang untuk membantu studio fotografi mengelola operasional sehari-hari secara terstruktur dan akuntabel. Dengan sistem ini, admin dapat:

- Membuat jadwal pemotretan secara lengkap (termasuk koordinat GPS lokasi)
- Menugaskan fotografer dan MUA ke setiap sesi
- Memantau kehadiran fotografer secara real-time melalui foto bukti + verifikasi lokasi GPS
- Mengelola keuangan proyek: gaji fotografer, fee MUA, dan biaya operasional
- Melihat laporan profitabilitas per paket foto

Fotografer juga memiliki akses ke portal mereka sendiri untuk melihat jadwal, mengirim bukti foto, mengunggah galeri hasil kerja, dan melihat slip gaji.

---

## Fitur Utama

### 🗓️ Penjadwalan dengan Lokasi Wajib
Setiap jadwal pemotretan **wajib** menyertakan koordinat GPS (latitude, longitude) dan radius lokasi. Ini digunakan untuk memverifikasi kehadiran fotografer di lapangan.

### 📷 Sistem Bukti Foto dengan Verifikasi GPS
Fotografer wajib mengirim dua foto bukti:
- **Bukti START** — Diambil saat tiba di lokasi. Hanya bisa dikirim setelah waktu jadwal dimulai.
- **Bukti END** — Diambil saat sesi selesai. Hanya bisa dikirim setelah bukti START diterima.

Sistem otomatis menghitung jarak antara koordinat GPS foto dengan koordinat lokasi menggunakan **formula Haversine**, sehingga admin dapat memverifikasi apakah fotografer benar-benar hadir di lokasi yang benar.

### 💰 Manajemen Keuangan Proyek
Setiap proyek memiliki kalkulasi keuangan otomatis:
- **Pendapatan** = Harga paket foto
- **Biaya Fotografer** = Total gaji semua fotografer dalam proyek
- **Fee MUA** = Total fee semua MUA dalam proyek
- **Biaya Operasional** = Pengeluaran tambahan (transportasi, print, dll.)
- **Profit & Margin** = Dihitung secara otomatis dan real-time

### 📧 Notifikasi Email
Admin dapat mengirim email pengingat ke pelanggan, fotografer, dan MUA sebelum sesi foto berlangsung.

### 📊 Laporan & Ekspor CSV
Laporan profitabilitas per paket foto tersedia dengan filter tanggal dan kategori. Data dapat diekspor ke format CSV (kompatibel dengan Excel, sudah BOM UTF-8).

### 📋 Activity Log
Semua aksi penting (membuat jadwal, validasi bukti, pembayaran gaji, dll.) tercatat secara otomatis di log aktivitas untuk keperluan audit.

---

## Teknologi yang Digunakan

| Komponen | Teknologi |
|---|---|
| Backend Framework | Laravel 12 (PHP 8.2+) |
| Frontend | Inertia.js |
| Database | MySQL |
| Build Tool | Vite |
| Email | Laravel Mail (SMTP/log) |
| Queue | Database Queue |
| Session | Database Session |

---

## Alur Kerja Sistem

Berikut adalah alur kerja utama dari sebuah proyek foto:

```
1. Admin membuat Jadwal
   └─ Input: pelanggan, paket, tanggal, waktu, lokasi GPS, fotografer, MUA
   └─ Sistem otomatis membuat: Booking → Schedule → Project

2. Fotografer menerima penugasan
   └─ Terlihat di portal fotografer (Jadwal & Proyek)

3. Saat hari H — Fotografer kirim Bukti START
   └─ Upload foto + GPS terdeteksi otomatis
   └─ Sistem hitung jarak ke lokasi (Haversine)
   └─ Status project berubah: SCHEDULED → SHOOTING

4. Sesi selesai — Fotografer kirim Bukti END
   └─ Status project berubah: SHOOTING → EDITING

5. Admin validasi bukti foto (START & END)
   └─ Bisa disetujui atau ditolak dengan catatan

6. Fotografer upload galeri hasil foto

7. Admin update status project → COMPLETED / DELIVERED

8. Admin bayar gaji fotografer & fee MUA
   └─ Status pembayaran berubah: UNPAID → PAID
```

---

## Peran Pengguna

Sistem memiliki dua peran:

### 👑 Admin
Memiliki akses penuh ke semua fitur:
- Dashboard ringkasan (jadwal hari ini, proyek berjalan, keuangan)
- Manajemen data master: Paket Foto, Fotografer, MUA, Pelanggan
- Membuat & mengelola jadwal dan proyek
- Validasi bukti foto (START & END)
- Manajemen pembayaran gaji & fee
- Laporan keuangan & ekspor CSV
- Log aktivitas & pengaturan sistem

### 📷 Fotografer
Portal terpisah dengan akses terbatas:
- Melihat jadwal dan proyek yang ditugaskan kepadanya
- Mengirim bukti foto START dan END
- Mengunggah galeri hasil foto ke proyek
- Melihat riwayat gaji

---

## Struktur Database

Berikut tabel-tabel utama dan hubungannya:

```
customers              → Data pelanggan
muas                   → Data Make-Up Artist (MUA)
photo_packages         → Paket foto yang ditawarkan (harga, durasi, estimasi biaya)
users                  → Akun pengguna (role: ADMIN / PHOTOGRAPHER)

bookings               → Pemesanan paket oleh pelanggan
schedules              → Jadwal sesi foto (WAJIB punya koordinat GPS)
projects               → Proyek aktif yang dijalankan

project_photographers  → Pivot: fotografer yang ditugaskan ke proyek
project_muas           → Pivot: MUA yang ditugaskan ke proyek

photographer_project_salaries  → Gaji fotografer per proyek
mua_project_fees               → Fee MUA per proyek
project_expenses               → Biaya operasional tambahan per proyek
project_galleries              → Galeri foto hasil kerja

photo_session_proofs   → Bukti foto kehadiran (START & END) + koordinat GPS
activity_logs          → Log semua aktivitas admin & fotografer
system_settings        → Pengaturan sistem
```

### Status Alur Proyek

| Status | Artinya |
|---|---|
| `PLANNING` | Proyek baru dibuat |
| `SCHEDULED` | Jadwal sudah dikonfirmasi |
| `SHOOTING` | Fotografer sudah kirim bukti START — sedang berlangsung |
| `EDITING` | Sesi selesai (bukti END terkirim) — dalam editing |
| `REVIEW` | Menunggu persetujuan |
| `COMPLETED` | Proyek selesai |
| `DELIVERED` | Hasil foto sudah diserahkan ke pelanggan |
| `CANCELLED` | Dibatalkan |

### Status Bukti Foto

| Status | Artinya |
|---|---|
| `START_PENDING` | Bukti mulai terkirim, menunggu validasi admin |
| `START_VALID` | Bukti mulai disetujui admin |
| `START_REJECTED` | Bukti mulai ditolak admin |
| `END_PENDING` | Bukti selesai terkirim, menunggu validasi admin |
| `END_VALID` | Bukti selesai disetujui admin |
| `END_REJECTED` | Bukti selesai ditolak admin |

---

## Cara Instalasi

### Prasyarat
- PHP 8.2 atau lebih baru
- Composer
- Node.js & npm
- SQLite (default) atau MySQL

### Langkah Instalasi

**1. Clone repositori**
```bash
git clone <url-repositori>
cd manajemen-FG
```

**2. Install dependensi PHP**
```bash
composer install
```

**3. Salin file konfigurasi**
```bash
cp .env.example .env
```

**4. Generate application key**
```bash
php artisan key:generate
```

**5. Jalankan migrasi database**
```bash
php artisan migrate
```

**6. (Opsional) Isi data awal**
```bash
php artisan db:seed
```

**7. Install dependensi JavaScript & build aset**
```bash
npm install
npm run build
```

> **Cara cepat (semua langkah sekaligus):**
> ```bash
> composer run setup
> ```

---

## Konfigurasi Environment

Buka file `.env` dan sesuaikan pengaturan berikut:

### Aplikasi
```env
APP_NAME="Manajemen FG - Art Devata"
APP_URL=http://localhost
APP_ENV=local          # Ganti ke 'production' saat deploy
APP_DEBUG=false        # Matikan di production
```

### Database
```env
# SQLite (default, cocok untuk development)
DB_CONNECTION=sqlite

# MySQL (untuk production, hapus tanda # di bawah ini)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=manajemen_fg
# DB_USERNAME=root
# DB_PASSWORD=password_anda
```

### Email (Notifikasi Pengingat)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=email@artdevata.com
MAIL_PASSWORD=app_password_anda
MAIL_FROM_ADDRESS=email@artdevata.com
MAIL_FROM_NAME="Art Devata Studio"
```

> Jika ingin email hanya masuk ke log (tidak benar-benar terkirim), gunakan:
> ```env
> MAIL_MAILER=log
> ```

---

## Menjalankan Aplikasi

### Mode Development (Semua sekaligus)
Perintah ini menjalankan server PHP, queue worker, log viewer, dan Vite dev server secara bersamaan:
```bash
composer run dev
```

### Manual (Satu per satu)
```bash
# Terminal 1: Server PHP
php artisan serve

# Terminal 2: Vite dev server (hot reload)
npm run dev

# Terminal 3: Queue worker (untuk email & background jobs)
php artisan queue:listen
```

### Akses Aplikasi
Setelah server berjalan, buka di browser:

| Halaman | URL |
|---|---|
| Halaman Utama (Katalog Paket) | `http://localhost:8000/` |
| Login | `http://localhost:8000/login` |
| Dashboard Admin | `http://localhost:8000/admin/dashboard` |
| Dashboard Fotografer | `http://localhost:8000/photographer/dashboard` |

---

## Modul & Fitur Detail

### 🎁 Manajemen Paket Foto (`/admin/packages`)
- Buat dan kelola paket foto (Wedding, Graduation, Portrait, Product, Event, Prewedding, Commercial, Other)
- Setiap paket menyimpan: harga, durasi, jumlah foto, estimasi biaya fotografer, fee MUA, dan biaya operasional
- Fitur **duplikasi paket** untuk mempercepat pembuatan paket serupa
- Aktif/nonaktifkan paket tanpa menghapus data

### 👥 Manajemen Data Master
- **Pelanggan** (`/admin/customers`) — Nama, nomor HP, email, dan alamat
- **Fotografer** (`/admin/photographers`) — Punya akun login dengan role `PHOTOGRAPHER`
- **MUA** (`/admin/muas`) — Data Make-Up Artist eksternal (tidak perlu akun login)

### 📅 Penjadwalan (`/admin/schedules`)
Membuat jadwal adalah inti dari sistem. Saat jadwal dibuat, sistem otomatis:
1. Membuat record **Booking** (pemesanan dengan snapshot harga paket)
2. Membuat record **Schedule** (jadwal dengan koordinat GPS wajib)
3. Membuat record **Project** (proyek yang dapat dipantau)
4. Membuat record **Salary** untuk setiap fotografer yang ditugaskan
5. Membuat record **Fee** untuk setiap MUA yang terlibat

Sistem juga memeriksa **konflik jadwal** — fotografer tidak bisa dijadwalkan di dua tempat pada waktu yang sama.

### 🗂️ Manajemen Proyek (`/admin/projects`)
- Update status proyek secara manual
- Tambah/hapus fotografer dan MUA dari proyek
- Catat biaya operasional tambahan (transportasi, cetak foto, dll.)
- Lihat kalkulasi profit real-time (pendapatan - semua biaya)

### ✅ Validasi Bukti Foto (`/admin/proofs`)
- Lihat semua bukti foto yang menunggu validasi
- Setiap bukti menampilkan: foto, koordinat GPS fotografer, dan **jarak ke lokasi** (dalam meter)
- Approve atau reject dengan catatan
- Mendukung bukti START dan END secara terpisah

### 💳 Manajemen Pembayaran (`/admin/payments`)
- **Gaji Fotografer** — Tandai sebagai `PAID` setelah transfer dilakukan
- **Fee MUA** — Tandai sebagai `PAID` setelah pembayaran dilakukan
- Dashboard menampilkan total tagihan yang belum dibayar

### 📊 Laporan Keuangan (`/admin/reports/package-profit`)
- Lihat profitabilitas per paket foto
- Filter berdasarkan rentang tanggal dan kategori
- Kolom: Total Project, Revenue, Cost, Profit, Margin (%)
- **Ekspor ke CSV** — kompatibel Excel dengan encoding UTF-8

### 📱 Portal Fotografer (`/photographer/...`)

| Halaman | Fungsi |
|---|---|
| Dashboard | Ringkasan jadwal hari ini dan proyek aktif |
| Jadwal | Lihat jadwal yang ditugaskan, lengkap dengan lokasi dan waktu |
| Bukti Foto | Upload foto START (saat tiba) dan END (saat selesai) dengan GPS |
| Galeri | Upload foto hasil kerja ke proyek |
| Gaji | Lihat riwayat dan status pembayaran gaji |

---

## Catatan Teknis

### Formula Haversine
Jarak GPS dihitung menggunakan **formula Haversine** yang mengakomodasi kelengkungan bumi, sehingga akurat meski lokasi berjauhan. Hasilnya dalam satuan **meter**.

Implementasi ada di [`app/Utils/GeoUtils.php`](app/Utils/GeoUtils.php).

### Package Snapshot
Saat jadwal/proyek dibuat, detail paket foto (nama, harga, durasi) **disalin** ke tabel `bookings` dan `projects`. Ini memastikan data historis tetap akurat meski paket foto diubah di kemudian hari.

### Soft Delete
Semua data utama menggunakan **soft delete** — data tidak benar-benar terhapus dari database, hanya ditandai sebagai terhapus. Ini aman untuk audit dan pemulihan data.

### Activity Logger
Semua aksi penting dicatat otomatis via `ActivityLogger::log()` dengan informasi: aksi, modul, deskripsi, dan ID record yang terlibat.

---

## Lisensi

Aplikasi ini dikembangkan secara khusus untuk **Art Devata Studio Fotografi**. Seluruh hak cipta dilindungi.
