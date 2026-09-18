<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @php
            $rawName = config('app.name');
            $brandName = (!empty($rawName) && strtolower($rawName) !== 'laravel') ? $rawName : 'ARTDEVATA Photography';
        @endphp
        <title inertia>{{ $brandName }}</title>

        <!-- Primary SEO Meta Tags -->
        <meta name="description" content="Layanan jasa fotografi dan MUA profesional di Bali. Abadikan momen wisuda, wedding, prewedding, event, dan komersial terbaik dengan fotografer berpengalaman dari ARTDEVATA Photography.">
        <meta name="keywords" content="fotografer bali, jasa fotografi bali, prewedding bali, wedding photography bali, fotografer wisuda bali, mua bali, paket foto bali, sewa fotografer bali, studio foto bali, artdevata photography">
        <meta name="author" content="{{ $brandName }}">
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- Theme Color & Mobile Settings -->
        <meta name="theme-color" content="#092722" media="(prefers-color-scheme: dark)">
        <meta name="theme-color" content="#14433B" media="(prefers-color-scheme: light)">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="ARTDEVATA">

        <!-- Open Graph / Facebook / WhatsApp Meta Tags -->
        <meta property="og:type" content="website">
        <meta property="og:locale" content="id_ID">
        <meta property="og:site_name" content="{{ $brandName }}">
        <meta property="og:title" content="{{ $brandName }} - Jasa Fotografer & MUA Profesional Bali">
        <meta property="og:description" content="Layanan fotografi dan MUA profesional di Bali untuk momen wisuda, prewedding, wedding, dan event berharga Anda bersama ARTDEVATA Photography.">
        <meta property="og:url" content="{{ url()->current() }}">
        
        <!-- WhatsApp & Social Media Preview Image (JPEG/PNG required by WhatsApp crawler) -->
        <meta property="og:image" content="{{ asset('og-image.jpg') }}">
        <meta property="og:image:secure_url" content="{{ asset('og-image.jpg') }}">
        <meta property="og:image:type" content="image/jpeg">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="ARTDEVATA Photography Bali">

        <!-- Square Thumbnail Fallback for WhatsApp Mobile -->
        <meta property="og:image" content="{{ asset('logo.png') }}">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="600">
        <meta property="og:image:height" content="600">
        <link rel="image_src" href="{{ asset('og-image.jpg') }}">

        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $brandName }} - Jasa Fotografer & MUA Profesional Bali">
        <meta name="twitter:description" content="Layanan fotografi dan MUA profesional di Bali untuk momen wisuda, prewedding, wedding, dan event berharga Anda bersama ARTDEVATA Photography.">
        <meta name="twitter:image" content="{{ asset('og-image.jpg') }}">
        <meta name="twitter:image:alt" content="ARTDEVATA Photography Logo">

        <!-- Favicon / Logo -->
        <link rel="icon" type="image/png" sizes="600x600" href="{{ asset('logo.png') }}">
        <link rel="icon" type="image/svg+xml" href="{{ asset('logo.svg') }}">
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="apple-touch-icon" href="{{ asset('logo.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

        <script>
            (function() {
                try {
                    var theme = localStorage.getItem('theme');
                    var isDark = theme === 'dark' || ((!theme || theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                    if (isDark) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                } catch (e) {}
            })();
        </script>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="h-full font-sans antialiased text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 selection:bg-slate-900 selection:text-white">
        @inertia
    </body>
</html>
