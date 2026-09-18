import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generate() {
  const rootDir = process.cwd();
  const svgPath = path.join(rootDir, 'public', 'logo.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. Generate square logo.png (600x600) with transparent or padded background
  // First render SVG directly to PNG
  await sharp(svgBuffer)
    .resize(600, 600, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(rootDir, 'public', 'logo.png'));
  console.log('Generated public/logo.png');

  // 2. Generate WhatsApp & Social Media Preview Banner: og-image.png (1200x630)
  // WhatsApp prefers 1200x630 or square 600x600. Having a rich 1200x630 banner makes links look ultra professional.
  const logoResizedBuffer = await sharp(svgBuffer)
    .resize(220, 220, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const bannerSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#061d19" />
        <stop offset="50%" stop-color="#092722" />
        <stop offset="100%" stop-color="#0e3832" />
      </linearGradient>
      <radialGradient id="glow" cx="80%" cy="20%" r="60%">
        <stop offset="0%" stop-color="#21C9A4" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#21C9A4" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="glowLeft" cx="20%" cy="80%" r="50%">
        <stop offset="0%" stop-color="#0D9488" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#0D9488" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bg)" />
    <rect width="1200" height="630" fill="url(#glow)" />
    <rect width="1200" height="630" fill="url(#glowLeft)" />

    <!-- Subtle Border -->
    <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#21C9A4" stroke-opacity="0.25" stroke-width="2" />

    <!-- Category Pill -->
    <g transform="translate(420, 155)">
      <rect width="360" height="38" rx="19" fill="#14433B" stroke="#21C9A4" stroke-opacity="0.4" stroke-width="1.5" />
      <text x="180" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#21C9A4" text-anchor="middle" letter-spacing="2">
        PROFESSIONAL PHOTOGRAPHY &amp; MUA
      </text>
    </g>

    <!-- Brand Name -->
    <text x="420" y="275" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="900" fill="#F5F7F6" letter-spacing="1">
      ARTDEVATA
    </text>
    <text x="420" y="325" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#21C9A4" letter-spacing="8">
      PHOTOGRAPHY BALI
    </text>

    <!-- Tagline & Description -->
    <text x="420" y="390" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400" fill="#B8C8C4">
      Layanan Fotografi &amp; MUA Terbaik untuk Wisuda, Wedding, Prewedding,
    </text>
    <text x="420" y="425" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400" fill="#B8C8C4">
      Personal Portrait, dan Komersial di Seluruh Bali.
    </text>

    <!-- Bottom Features -->
    <g transform="translate(420, 485)">
      <text x="0" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#21C9A4">
        ✓ Fotografer Berpengalaman
      </text>
      <text x="270" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#21C9A4">
        ✓ MUA Profesional
      </text>
      <text x="470" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#21C9A4">
        ✓ Harga Transparan
      </text>
    </g>
  </svg>
  `;

  // Composite the SVG logo over the banner
  await sharp(Buffer.from(bannerSvg))
    .composite([
      {
        input: logoResizedBuffer,
        top: 175,
        left: 120,
      }
    ])
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(path.join(rootDir, 'public', 'og-image.png'));
  console.log('Generated public/og-image.png');

  // Also create a high-quality JPEG version (whatsapp loves jpeg under 300kb)
  await sharp(path.join(rootDir, 'public', 'og-image.png'))
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(rootDir, 'public', 'og-image.jpg'));
  console.log('Generated public/og-image.jpg');
}

generate().catch(console.error);
