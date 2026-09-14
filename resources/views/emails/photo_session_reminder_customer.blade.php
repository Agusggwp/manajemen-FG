<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Peringatan Jadwal Pemotretan H-1</title>
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
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
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
            color: #c7d2fe;
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
            color: #1e1b4b;
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
            background-color: #e0e7ff;
            color: #3730a3;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 9999px;
        }
        .btn-map {
            display: inline-block;
            background-color: #4f46e5;
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
            <h1>Pengingat Sesi Pemotretan (H-1)</h1>
            <p>ARTDEVATA Photography Management</p>
        </div>

        <div class="content">
            <div class="greeting">Halo, {{ $schedule->customer->name ?? 'Pelanggan' }}!</div>
            <div class="intro">
                Ini adalah pengingat bahwa sesi pemotretan Anda dijadwalkan untuk <strong>besok</strong>. Mohon persiapkan kebutuhan sesi Anda dan datang tepat waktu sesuai lokasi yang telah ditentukan.
            </div>

            <div class="card">
                <div class="card-title">Detail Sesi Pemotretan</div>

                <div class="detail-row">
                    <div class="detail-label">Tanggal:</div>
                    <div class="detail-value">
                        <strong>{{ is_string($schedule->date) ? \Carbon\Carbon::parse($schedule->date)->translatedFormat('l, d F Y') : $schedule->date->translatedFormat('l, d F Y') }}</strong>
                    </div>
                </div>

                <div class="detail-row">
                    <div class="detail-label">Waktu:</div>
                    <div class="detail-value">
                        <span class="badge">{{ substr($schedule->start_time, 0, 5) }} - {{ substr($schedule->end_time, 0, 5) }} WITA</span>
                    </div>
                </div>

                <div class="detail-row">
                    <div class="detail-label">Paket Foto:</div>
                    <div class="detail-value">{{ $schedule->photoPackage->name ?? ($schedule->project->package_name ?? '-') }}</div>
                </div>

                <div class="detail-row">
                    <div class="detail-label">Lokasi Pemotretan:</div>
                    <div class="detail-value">
                        <strong>{{ $schedule->location_name }}</strong>
                        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">{{ $schedule->location_address }}</div>
                    </div>
                </div>

                @if(!$schedule->mua_same_as_shooting_location && $schedule->mua_location_name)
                <div class="detail-row">
                    <div class="detail-label">Lokasi Rias (MUA):</div>
                    <div class="detail-value">
                        <strong>{{ $schedule->mua_location_name }}</strong>
                        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">{{ $schedule->mua_location_address }}</div>
                        @if($schedule->mua_location_notes)
                        <div style="font-size: 11px; color: #b45309; margin-top: 2px;"><em>Catatan: {{ $schedule->mua_location_notes }}</em></div>
                        @endif
                    </div>
                </div>
                @endif

                @if($schedule->notes)
                <div class="detail-row">
                    <div class="detail-label">Catatan Tambahan:</div>
                    <div class="detail-value">{{ $schedule->notes }}</div>
                </div>
                @endif

                @if($schedule->latitude && $schedule->longitude)
                <div style="margin-top: 15px;">
                    <a href="https://maps.google.com/?q={{ $schedule->latitude }},{{ $schedule->longitude }}" target="_blank" class="btn-map">
                        📍 Buka Peta Lokasi di Google Maps
                    </a>
                </div>
                @endif
            </div>

            @if($schedule->project && ($schedule->project->photographers->count() > 0 || $schedule->project->muas->count() > 0))
            <div class="card">
                <div class="card-title">Tim Bertugas</div>

                @if($schedule->project->photographers->count() > 0)
                <div class="detail-row">
                    <div class="detail-label">Fotografer:</div>
                    <div class="detail-value">
                        {{ $schedule->project->photographers->pluck('name')->implode(', ') }}
                    </div>
                </div>
                @endif

                @if($schedule->project->muas->count() > 0)
                <div class="detail-row">
                    <div class="detail-label">MUA (Make Up):</div>
                    <div class="detail-value">
                        {{ $schedule->project->muas->pluck('name')->implode(', ') }}
                    </div>
                </div>
                @endif
            </div>
            @endif

            <p class="intro" style="margin-bottom: 0;">
                Jika ada perubahan atau hal yang ingin ditanyakan sebelum sesi besok, Anda dapat menghubungi tim kami. Sampai jumpa besok!
            </p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} ARTDEVATA Photography Management System. All rights reserved.
        </div>
    </div>
</body>
</html>
