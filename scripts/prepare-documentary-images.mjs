import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

// Deterministic asset compilation, never creative retouching. Originals are read-only.
const plan = JSON.parse(await readFile('config/farmtree-documentary-images.json', 'utf8'));
const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error('Usage: node scripts/prepare-documentary-images.mjs /absolute/photo/directory');
const output = resolve('wordpress/wp-content/themes/farmtree-native/assets/images/documentary');
await mkdir(output, { recursive: true });
const evidence = { schemaVersion: 1, sharp: sharp.versions.sharp, files: [] };
for (const entry of plan.images.filter((image) => image.selected)) {
  const source = await readFile(resolve(sourceDirectory, entry.source));
  const sourceSha256 = createHash('sha256').update(source).digest('hex');
  for (const [variant, dimensions] of Object.entries(plan.variants)) {
    for (const format of plan.formats) {
      const filename = `${entry.slug}-${variant}.${format}`;
      const pipeline = sharp(source).rotate().resize({ ...dimensions, fit: 'cover', position: entry.cropPosition });
      const buffer = await pipeline.toFormat(format === 'jpg' ? 'jpeg' : format, {
        quality: format === 'avif' ? 48 : format === 'webp' ? 76 : 82,
        ...(format === 'avif' ? { effort: 5 } : {})
      }).toBuffer();
      await writeFile(resolve(output, filename), buffer);
      evidence.files.push({ number: entry.number, sourceSha256, filename, ...dimensions,
        bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex') });
    }
  }
  console.log(`Exported Image ${String(entry.number).padStart(2, '0')}: ${entry.slug}`);
}
await writeFile('config/farmtree-documentary-exports.json', `${JSON.stringify(evidence, null, 2)}\n`);
