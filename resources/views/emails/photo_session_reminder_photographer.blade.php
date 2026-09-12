<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pengingat Tugas Pemotretan H-1</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f6f8;
            color: #333333;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        .header {
            background: linear-gradient(135deg, #065f46 0%, #047857 100%);
            color: #ffffff;
            padding: 30px 25px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .header p {
            margin: 8px 0 0;
            font-size: 14px;
            color: #a7f3d0;
        }
        .content {
            padding: 30px 25px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .intro {
            font-size: 14px;
            line-height: 1.6;
            color: #4b5563;
            margin-bottom: 24px;
        }
        .card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .card-title {
            font-size: 15px;
            font-weight: 700;
            color: #065f46;
            margin-top: 0;
            margin-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
        }
        .detail-row {
            display: flex;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .detail-label {
            width: 140px;
            font-weight: 600;
            color: #64748b;
        }
        .detail-value {
            flex: 1;
            color: #1e293b;
            font-weight: 500;
        }
        .badge {
            display: inline-block;
            background-color: #d1fae5;
            color: #065f46;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 9999px;
        }
        .btn-map {
            display: inline-block;
            background-color: #059669;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 10px;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px 25px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Pengingat Tugas Fotografer (H-1)</h1>
            <p>ARTDEVATA Photography Management</p>
        </div>

        <div class="content">
            <div class="greeting">Halo, {{ $photographer->name }}!</div>
            <div class="intro">
                Ini adalah pengingat bahwa Anda ditugaskan sebagai <strong>Fotografer</strong> untuk sesi pemotretan yang akan dilaksanakan <strong>besok</strong>. Pastikan perlengkapan kamera dan baterai sudah siap.
            </div>

            <div class="card">
                <div class="card-title">Informasi Project & Pelanggan</div>

                <div class="detail-row">
                    <div class="detail-label">Nama Klien:</div>
                    <div class="detail-value"><strong>{{ $schedule->customer->name ?? '-' }}</strong> ({{ $schedule->customer->phone ?? '-' }})</div>
                </div>

                <div class="detail-row">
                    <div class="detail-label">Tanggal:</div>
                    <div class="detail-value">
                        <strong>{{ is_string($schedule->date) ? \Carbon\Carbon::parse($schedule->date)->translatedFormat('l, d F Y') : $schedule->date->translatedFormat('l, d F Y') }}</strong>
                    </div>
                </div>

                <div class="detail-row">
                    <div class="detail-label">Waktu Standby:</div>
                    <div class="detail-value">
                        <span class="badge">{{ substr($schedule->start_time, 0, 5) }} - {{ substr($schedule->end_time, 0, 5) }} WITA</span>
                    </div>
                </div>

                <div class="detail-row">
                    <div class="detail-label">Paket Foto:</div>
                    <div class="detail-value">{{ $schedule->photoPackage->name ?? ($schedule->project->package_name ?? '-') }}</div>
                </div>

                <div class="detail-row">
                    <div class="detail-label">Nama Lokasi:</div>
                    <div class="detail-value">{{ $schedule->location_name }}</div>
                </div>

                <div class="detail-row">
                    <div class="detail-label">Alamat Lokasi:</div>
                    <div class="detail-value">{{ $schedule->location_address }}</div>
                </div>

                @if($schedule->notes)
                <div class="detail-row">
                    <div class="detail-label">Catatan Tambahan:</div>
                    <div class="detail-value">{{ $schedule->notes }}</div>
                </div>
                @endif

                @if($schedule->latitude && $schedule->longitude)
                <div style="margin-top: 15px;">
                    <a href="https://maps.google.com/?q={{ $schedule->latitude }},{{ $schedule->longitude }}" target="_blank" class="btn-map">
                        📍 Navigasi Peta Lokasi (Google Maps)
                    </a>
                </div>
                @endif
            </div>

            @if($schedule->project && $schedule->project->muas->count() > 0)
            <div class="card">
                <div class="card-title">Tim MUA Pendamping</div>
                <div class="detail-row">
                    <div class="detail-label">MUA:</div>
                    <div class="detail-value">
                        {{ $schedule->project->muas->pluck('name')->implode(', ') }}
                    </div>
                </div>
            </div>
            @endif

            <p class="intro" style="margin-bottom: 0;">
                Jangan lupa untuk melakukan verifikasi <strong>Absensi Bukti Foto (START & END Proof)</strong> melalui aplikasi pada saat memulai dan mengakhiri pemotretan di lokasi.
            </p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} ARTDEVATA Photography Management System. All rights reserved.
        </div>
    </div>
</body>
</html>
