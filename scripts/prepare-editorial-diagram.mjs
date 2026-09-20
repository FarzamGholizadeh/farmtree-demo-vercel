import sharp from 'sharp';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Original abstract vector artwork. No documentary claim, external image or text.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
<rect width="1200" height="900" fill="#f5f0e5"/>
<path d="M80 740Q380 640 620 750T1200 690" fill="none" stroke="#d9e1cf" stroke-width="110"/>
<g fill="#fffdf7" stroke="#174c38" stroke-width="8"><rect x="90" y="260" width="280" height="360" rx="36"/><rect x="460" y="260" width="280" height="360" rx="36"/><rect x="830" y="260" width="280" height="360" rx="36"/></g>
<g stroke="#b18a3d" stroke-width="10" fill="none"><path d="M380 440h sixty"/><path d="M385 440h55m-18-18 18 18-18 18M755 440h55m-18-18 18 18-18 18"/></g>
<g stroke="#174c38" stroke-width="10" fill="none" stroke-linecap="round"><path d="M145 545h170M175 540V390m0 65-35-30m35-15 30-35M280 540V355m0 65-35-30m35-5 28-40"/><path d="M505 370h190M505 440h190M505 510h190"/><path d="m885 435 50 50 95-110M885 540h160"/></g>
<g fill="#b18a3d"><circle cx="540" cy="370" r="17"/><circle cx="650" cy="440" r="17"/><circle cx="575" cy="510" r="17"/></g></svg>`.replace('<path d="M380 440h sixty"/>', '');
const directory = 'wordpress/wp-content/themes/farmtree-native/assets/images/editorial';
await mkdir(directory, { recursive: true });
const variants = JSON.parse(await readFile('config/farmtree-documentary-images.json')).variants;
const files = [];
for (const [variant, dimensions] of Object.entries(variants)) {
  for (const format of ['avif', 'webp', 'jpg']) {
    const filename = `farmtree-evidence-chain-${variant}.${format}`;
    const bytes = await sharp(Buffer.from(svg)).resize({ ...dimensions, fit: 'cover' }).toFormat(format === 'jpg' ? 'jpeg' : format, { quality: 80 }).toBuffer();
    await writeFile(`${directory}/${filename}`, bytes);
    files.push({ filename, ...dimensions, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  }
}
await writeFile('config/farmtree-editorial-diagram-exports.json', JSON.stringify({ source: 'Original abstract SVG defined in scripts/prepare-editorial-diagram.mjs', files }, null, 2) + '\n');
