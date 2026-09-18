<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <!-- Halaman Utama & Katalog Publik -->
    <url>
        <loc>{{ url('/') }}</loc>
        <lastmod>{{ $lastMod }}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
        <image:image>
            <image:loc>{{ asset('og-image.jpg') }}</image:loc>
            <image:title>ARTDEVATA Photography Bali</image:title>
            <image:caption>Layanan Jasa Fotografi dan MUA Profesional di Bali</image:caption>
        </image:image>
        <image:image>
            <image:loc>{{ asset('logo.svg') }}</image:loc>
            <image:title>ARTDEVATA Logo</image:title>
        </image:image>
    </url>

    <!-- Navigasi Bagian Katalog & Layanan -->
    <url>
        <loc>{{ url('/') }}#katalog</loc>
        <lastmod>{{ $lastMod }}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>

    <!-- Bagian Galeri Portofolio -->
    <url>
        <loc>{{ url('/') }}#portofolio</loc>
        <lastmod>{{ $lastMod }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Bagian Keunggulan Layanan -->
    <url>
        <loc>{{ url('/') }}#keunggulan</loc>
        <lastmod>{{ $lastMod }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>

    <!-- Bagian Pertanyaan Umum (FAQ) -->
    <url>
        <loc>{{ url('/') }}#faq</loc>
        <lastmod>{{ $lastMod }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>

    <!-- Bagian Kontak & Pemesanan -->
    <url>
        <loc>{{ url('/') }}#kontak</loc>
        <lastmod>{{ $lastMod }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>
