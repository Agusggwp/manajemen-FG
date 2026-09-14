<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aktivasi Akun Fotografer ARTDEVATA</title>
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
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #ffffff;
            padding: 35px 25px;
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
            color: #94a3b8;
        }
        .content {
            padding: 30px 25px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
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
        .flow-step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 14px;
        }
        .flow-step:last-child {
            margin-bottom: 0;
        }
        .flow-number {
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: #0f172a;
            color: #ffffff;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            line-height: 24px;
            margin-right: 12px;
            flex-shrink: 0;
        }
        .flow-text {
            font-size: 13px;
            line-height: 1.5;
            color: #334155;
        }
        .flow-text strong {
            color: #0f172a;
        }
        .cta-container {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: #ffffff !important;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            box-shadow: 0 4px 10px rgba(5, 150, 105, 0.25);
            letter-spacing: 0.3px;
        }
        .notice {
            background-color: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 14px 16px;
            border-radius: 4px;
            font-size: 13px;
            color: #b45309;
            line-height: 1.5;
            margin-bottom: 24px;
        }
        .url-box {
            font-size: 11px;
            color: #64748b;
            word-break: break-all;
            background: #f1f5f9;
            padding: 12px;
            border-radius: 6px;
            border: 1px dashed #cbd5e1;
            margin-top: 15px;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ARTDEVATA PHOTOGRAPHY</h1>
            <p>Konfirmasi & Aktivasi Pendaftaran Fotografer</p>
        </div>
        <div class="content">
            <div class="greeting">Halo, {{ $user->name }}!</div>
            <div class="intro">
                Terima kasih telah mendaftar sebagai fotografer di <strong>ARTDEVATA Photography</strong>. Untuk memastikan keabsahan email Anda dan melanjutkan proses aktivasi akun, silakan verifikasi alamat email Anda melalui tombol di bawah ini:
            </div>

            <div class="cta-container">
                <a href="{{ $activationUrl }}" class="btn">Verifikasi Email Saya</a>
            </div>

            <div class="card">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 12px; color: #0f172a;">Alur Aktivasi Akun Anda:</div>
                <div class="flow-step">
                    <span class="flow-number">1</span>
                    <div class="flow-text">
                        <strong>Klik Tombol Verifikasi:</strong> Konfirmasi bahwa alamat email ini aktif dan milik Anda.
                    </div>
                </div>
                <div class="flow-step" style="margin-top: 10px;">
                    <span class="flow-number">2</span>
                    <div class="flow-text">
                        <strong>Peninjauan oleh Admin:</strong> Setelah email terverifikasi, akun Anda masuk ke antrean persetujuan Admin ARTDEVATA.
                    </div>
                </div>
                <div class="flow-step" style="margin-top: 10px;">
                    <span class="flow-number">3</span>
                    <div class="flow-text">
                        <strong>Aktivasi Selesai:</strong> Setelah disetujui Admin, Anda dapat langsung masuk (*login*) ke portal fotografer untuk melihat jadwal & tugas pemotretan.
                    </div>
                </div>
            </div>

            <div class="notice">
                <strong>Catatan Penting:</strong> Tautan verifikasi ini berlaku selama 60 menit. Jika Anda tidak merasa mendaftar di ARTDEVATA, Anda dapat mengabaikan email ini.
            </div>

            <p style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
                Jika tombol di atas tidak dapat diklik, salin dan tempel URL berikut ke browser Anda:
            </p>
            <div class="url-box">
                {{ $activationUrl }}
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} ARTDEVATA Photography Management System. Seluruh hak cipta dilindungi.<br>
            Email ini dikirim otomatis oleh sistem, mohon tidak membalas langsung ke alamat ini.
        </div>
    </div>
</body>
</html>
