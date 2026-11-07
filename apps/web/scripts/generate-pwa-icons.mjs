import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(__dirname, '../../package.json'));
const { chromium } = require('@playwright/test');
const publicDir = path.resolve(__dirname, '../public');
const iconsDir = path.join(publicDir, 'icons');
const svgPath = path.resolve(__dirname, '../app/icon.svg');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const rawSvg = fs.readFileSync(svgPath, 'utf8');

// For maskable icons, the inner graphic must occupy ~75-80% of the canvas with solid background to avoid clipping by circular or squircle OS masks.
const maskableHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: #FFFDF8;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .icon-wrap {
      width: 78%;
      height: 78%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div class="icon-wrap">
    ${rawSvg}
  </div>
</body>
</html>
`;

// For standard icons:
const standardHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  ${rawSvg}
</body>
</html>
`;

async function generate() {
  console.log('Launching browser to render high-res PWA icons...');
  const browser = await chromium.launch({ channel: 'msedge' });

  const targets = [
    { name: 'icon-192.png', size: 192, html: standardHtml },
    { name: 'icon-512.png', size: 512, html: standardHtml },
    { name: 'icon-maskable-192.png', size: 192, html: maskableHtml },
    { name: 'icon-maskable-512.png', size: 512, html: maskableHtml },
    { name: 'apple-touch-icon.png', size: 180, html: standardHtml },
  ];

  for (const target of targets) {
    const page = await browser.newPage({
      viewport: { width: target.size, height: target.size },
      deviceScaleFactor: 1,
    });
    await page.setContent(target.html, { waitUntil: 'load' });
    const outPath = path.join(iconsDir, target.name);
    await page.screenshot({
      path: outPath,
      omitBackground: target.html === standardHtml ? false : false,
    });
    await page.close();
    console.log(`Generated: ${target.name} (${target.size}x${target.size})`);
  }

  await browser.close();
  console.log('All PWA icons successfully generated in apps/web/public/icons/');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
