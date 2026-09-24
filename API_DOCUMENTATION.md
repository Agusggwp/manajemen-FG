# Dokumentasi RESTful API ARTDEVATA

Dokumentasi ini berisi panduan lengkap penggunaan RESTful API sistem ARTDEVATA untuk diintegrasikan pada website eksternal (landing page, frontend React/Next.js/Vue, WordPress, aplikasi mobile, dsb).

---

## 1. Informasi Umum & Base URL

- **Development Base URL:** `http://127.0.0.1:8000/api`
- **Production Base URL:** `https://your-domain.com/api`
- **API Versioning:** Tersedia prefix `/v1` (contoh: `/api/v1/packages`), atau shortcut langsung (contoh: `/api/packages`).
- **Format Pertukaran Data:** JSON (`Content-Type: application/json`, `Accept: application/json`).
- **CORS Support:** Sudah dikonfigurasi aktif (`allowed_origins: ['*']`), dapat di-request langsung dari client-side browser tanpa kendala CORS.

---

## 2. Struktur Standar Response

Setiap response dari API mengikuti format standar berikut:

### Sukses:
```json
{
  "success": true,
  "data": ...,
  "meta": ... // Opsional, berisi statistik/pagination
}
```

### Gagal / Validasi Error:
```json
{
  "message": "The phone field is required.",
  "errors": {
    "phone": [
      "The phone field is required."
    ]
  }
}
```

---

## 3. Daftar Endpoint

### A. Katalog Paket (`/api/packages`)

Mengambil daftar seluruh paket foto dan layanan MUA yang sedang berstatus aktif (`ACTIVE`).

- **Method:** `GET`
- **URL:** `/api/packages` atau `/api/v1/packages`
- **Query Parameters (Opsional):**

| Parameter | Tipe | Pilihan Nilai | Keterangan |
|---|---|---|---|
| `type` | String | `all`, `photo`, `mua` | Default: `all`.<br>• `photo`: Hanya paket foto (+ bundling MUA)<br>• `mua`: Hanya paket layanan MUA mandiri (0 FG) |
| `category` | String | `Graduation`, `Wedding`, `Prewedding`, `Portrait`, `MUA Only`, dll. | Filter spesifik kategori |
| `search` | String | Kata kunci | Pencarian berdasarkan nama paket, kategori, atau deskripsi |
| `sort` | String | `created_at`, `price_asc`, `price_desc`, `name_asc`, `name_desc` | Default: `created_at` (terbaru) |

#### Contoh Request:
```bash
GET /api/packages?type=photo&sort=price_asc
```

#### Contoh Response (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Basic Graduation",
      "category": "Graduation",
      "package_type": "PHOTO",
      "price": 650000,
      "formatted_price": "Rp 650.000",
      "duration_minutes": 60,
      "number_of_photos": 25,
      "number_of_photographers": 1,
      "includes_mua": true,
      "description": "Layanan pemotretan wisuda studio.",
      "features": [
        "25 Foto Retouched",
        "1 Fotografer Profesional",
        "Free Cetak 10R + Frame"
      ],
      "mua": {
        "id": 2,
        "name": "Ni Wayan Makeup",
        "specialty": "Graduation & Bridal",
        "bio": "MUA profesional berpengalaman sejak 2020.",
        "profile_photo": "http://127.0.0.1:8000/storage/muas/photo.jpg",
        "default_fee": 250000
      },
      "created_at": "2026-09-11T10:00:00+08:00",
      "updated_at": "2026-09-24T09:30:00+08:00"
    }
  ],
  "meta": {
    "total": 8,
    "photo_count": 5,
    "mua_count": 3,
    "filter_count": 1
  }
}
```

---

### B. Detail Paket (`/api/packages/{id}`)

Mengambil data lengkap satu paket berdasarkan ID.

- **Method:** `GET`
- **URL:** `/api/packages/{id}`
- **Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "Paket MUA Wisuda / Graduation Glam",
    "category": "MUA Only",
    "package_type": "MUA_ONLY",
    "price": 350000,
    "formatted_price": "Rp 350.000",
    "duration_minutes": 90,
    "number_of_photos": 0,
    "number_of_photographers": 0,
    "includes_mua": true,
    "description": "Layanan rias wajah & hair styling / hijab khusus wisuda tanpa fotografer.",
    "features": [
      "Makeup Natural Glam Flawless",
      "Hairdo Elegan atau Hijab Styling Modern",
      "Free Softlens & Bulu Mata Premium"
    ],
    "mua": null,
    "created_at": "2026-09-24T00:00:01+08:00",
    "updated_at": "2026-09-24T00:00:01+08:00"
  }
}
```
- **Response Tidak Ditemukan (404 Not Found):**
```json
{
  "success": false,
  "message": "Paket tidak ditemukan atau sedang tidak aktif."
}
```

---

### C. Kategori Paket (`/api/categories`)

Mengambil daftar kategori yang sedang aktif beserta jumlah paket di dalamnya.

- **Method:** `GET`
- **URL:** `/api/categories`
- **Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "name": "Graduation",
      "count": 2,
      "is_mua": false
    },
    {
      "name": "MUA Only",
      "count": 3,
      "is_mua": true
    },
    {
      "name": "Wedding",
      "count": 1,
      "is_mua": false
    }
  ]
}
```

---

### D. Galeri Portofolio (`/api/portfolios`)

Mengambil daftar item galeri portofolio foto studio yang diurutkan (`ordered`).

- **Method:** `GET`
- **URL:** `/api/portfolios`
- **Query Parameters (Opsional):** `category` (misal: `Wedding`, `Prewedding`)

#### Contoh Response (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Pawiwahan Agung Tabanan",
      "category": "Wedding",
      "description": "Dokumentasi prosesi adat pernikahan Bali.",
      "image_url": "http://127.0.0.1:8000/storage/portfolios/pawiwahan.jpg",
      "sort_order": 1
    }
  ]
}
```

---

### E. Pengaturan Profil & Web Publik (`/api/settings`)

Mengambil data profil bisnis, nomor WhatsApp untuk direct chat/order, teks hero banner, dan FAQ.

- **Method:** `GET`
- **URL:** `/api/settings`

#### Contoh Response (200 OK):
```json
{
  "success": true,
  "data": {
    "company_name": "ARTDEVATA Photography",
    "whatsapp_number": "6281999888777",
    "phone": "081999888777",
    "email": "contact@artdevata.com",
    "address": "Denpasar, Bali, Indonesia",
    "hero_badge": "Dokumentasi Fotografi & MUA Profesional di Bali",
    "hero_title": "Abadikan Setiap Momen Istimewa Anda",
    "hero_subtitle": "Pilihan paket foto terbaik untuk Wisuda, Pernikahan, Prewedding, dan Layanan MUA Profesional di Bali.",
    "cta_title": "Butuh Penawaran Custom atau Diskusi Lokasi?",
    "theme_mode": "light",
    "show_search": true,
    "show_categories": true,
    "faqs": [
      {
        "question": "Bagaimana cara melakukan booking jadwal pemotretan?",
        "answer": "Anda dapat memilih paket yang diinginkan lalu mengklik tombol WhatsApp atau mengajukan formulir inquiry online..."
      }
    ]
  }
}
```

---

### F. Form Inquiry / Pemesanan Pelanggan (`/api/inquiries`)

Mengirim data formulir pemesanan atau pertanyaan jadwal dari calon pelanggan di web luar ke sistem admin. Data pelanggan akan otomatis tersimpan di tabel `customers` dan dibuatkan draft `bookings` dengan status `PENDING`.

- **Method:** `POST`
- **URL:** `/api/inquiries`
- **Headers:** `Content-Type: application/json`, `Accept: application/json`

#### Request Body (JSON):
| Field | Tipe | Wajib? | Keterangan |
|---|---|---|---|
| `name` | String | **Ya** | Nama lengkap pelanggan |
| `phone` | String | **Ya** | Nomor HP / WhatsApp pelanggan |
| `email` | String | Tidak | Email pelanggan |
| `package_id` | Integer | Tidak | ID paket foto/MUA yang dipilih (validasi ID tabel `photo_packages`) |
| `booking_date` | Date (YYYY-MM-DD) | Tidak | Tanggal perkiraan pemotretan/rias |
| `location` | String | Tidak | Lokasi yang diinginkan |
| `notes` | String | Tidak | Catatan konsep, busana, atau permintaan khusus |

#### Contoh Payload Request:
```json
{
  "name": "Kadek Ayu Saraswati",
  "phone": "081234567890",
  "email": "kadek.ayu@gmail.com",
  "package_id": 1,
  "booking_date": "2026-10-25",
  "location": "Pantai Sanur, Bali",
  "notes": "Sesi pagi jam 06.00 untuk wisuda outdoor bersama keluarga."
}
```

#### Contoh Response Sukses (201 Created):
```json
{
  "success": true,
  "message": "Permintaan inquiry pemesanan berhasil dikirim. Tim kami akan segera menghubungi Anda!",
  "data": {
    "booking_code": "INQ-A8F2K1",
    "customer_name": "Kadek Ayu Saraswati",
    "package_name": "Basic Graduation",
    "status": "PENDING"
  }
}
```

---

### G. Log Izin Lokasi & Cookie Pengunjung (`/api/log-consent`)

Mengirim data izin cookie atau koordinat GPS akurat pengunjung web luar ke backend ARTDEVATA (terintegrasi dengan Discord Notification dan log aktivitas sistem).

- **Method:** `POST`
- **URL:** `/api/log-consent`
- **Payload (JSON):**
```json
{
  "status": "LOCATION_ALLOWED",
  "latitude": -8.670458,
  "longitude": 115.212629,
  "accuracy": 15,
  "address": "Denpasar Selatan, Bali",
  "precision_type": "GPS_HIGH_ACCURACY"
}
```

---

## 4. Contoh Integrasi di Frontend Web Lain

### Contoh Menggunakan JavaScript / Fetch API:
```javascript
const API_BASE = 'http://127.0.0.1:8000/api';

// 1. Mengambil Daftar Paket Foto
async function fetchPackages(type = 'all') {
  try {
    const res = await fetch(`${API_BASE}/packages?type=${type}`);
    const result = await res.json();
    if (result.success) {
      console.log('Daftar Paket:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Gagal mengambil paket:', error);
  }
}

// 2. Mengirim Booking Inquiry
async function submitInquiry(formData) {
  try {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    if (res.ok) {
      alert(`Terima kasih! Kode booking Anda: ${result.data.booking_code}`);
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Gagal mengirim inquiry:', error);
  }
}
```

### Contoh Menggunakan cURL:
```bash
# Mengambil paket MUA saja
curl -X GET "http://127.0.0.1:8000/api/packages?type=mua" \
     -H "Accept: application/json"

# Mengirim inquiry pemesanan
curl -X POST "http://127.0.0.1:8000/api/inquiries" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{
       "name": "Budi Santoso",
       "phone": "081999123456",
       "package_id": 6,
       "notes": "Paket rias wisuda"
     }'
```
