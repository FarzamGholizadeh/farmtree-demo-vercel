import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

// Deterministic asset compilation, never creative retouching. Originals are read-only.
const plan = JSON.parse(await readFile('config/farmtree-documentary-images.json', 'utf8'));
const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error('Usage: node scripts/prepare-documentary-images.mjs /absolute/photo/directory');
const variantArgument = process.argv[3];
const newOnly = variantArgument === '--new-only';
if (variantArgument && !newOnly && !/^--variant=[a-z]+$/.test(variantArgument)) throw new Error('Invalid variant argument');
const onlyVariant = newOnly ? undefined : variantArgument?.slice('--variant='.length);
if (onlyVariant && !Object.hasOwn(plan.variants, onlyVariant)) throw new Error('Unknown variant');
const previous = onlyVariant || newOnly
  ? JSON.parse(await readFile('config/farmtree-documentary-exports.json', 'utf8'))
  : null;
const output = resolve('wordpress/wp-content/themes/farmtree-native/assets/images/documentary');
// Incremental compilation preserves prior evidence; full compilation can bootstrap.
// Read every selected original before any output write in either mode.
const sources = new Map();
for (const entry of plan.images.filter(image => image.selected && (!newOnly || !previous.files.some(file => file.number === image.number)))) {
  const source = await readFile(resolve(sourceDirectory, entry.source));
  const sourceSha256 = createHash('sha256').update(source).digest('hex');
  if (onlyVariant) {
    const records = previous.files.filter(file => file.number === entry.number);
    if (!records.length || records.some(file => file.sourceSha256 !== sourceSha256)) throw new Error(`Source hash mismatch: ${entry.source}`);
  }
  sources.set(entry.number, source);
}
if (onlyVariant || newOnly) {
  for (const file of previous.files) {
    const bytes = await readFile(resolve(output, file.filename));
    if (createHash('sha256').update(bytes).digest('hex') !== file.sha256) throw new Error(`Existing export mismatch: ${file.filename}`);
  }
  if (previous.sharp !== sharp.versions.sharp) throw new Error('Sharp version mismatch for incremental compilation');
}
await mkdir(output, { recursive: true });
const evidence = newOnly ? { ...previous, files: [...previous.files] } : onlyVariant ? { ...previous, files: previous.files.filter(file => !file.filename.endsWith(`-${onlyVariant}.avif`) && !file.filename.endsWith(`-${onlyVariant}.webp`) && !file.filename.endsWith(`-${onlyVariant}.jpg`)) } : { schemaVersion: 1, sharp: sharp.versions.sharp, files: [] };
for (const entry of plan.images.filter((image) => sources.has(image.number))) {
  const source = sources.get(entry.number);
  const sourceSha256 = createHash('sha256').update(source).digest('hex');
  for (const [variant, dimensions] of Object.entries(plan.variants)) {
    if (onlyVariant && variant !== onlyVariant) continue;
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
