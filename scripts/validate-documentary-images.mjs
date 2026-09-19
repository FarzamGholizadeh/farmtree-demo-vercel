import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { documentaryContent } from './documentary-content.mjs';

const plan = JSON.parse(await readFile('config/farmtree-documentary-images.json', 'utf8'));
const exports = JSON.parse(await readFile('config/farmtree-documentary-exports.json', 'utf8'));
const release = JSON.parse(await readFile('config/farmtree-native-release-files.json', 'utf8'));
const root = 'wordpress/wp-content/themes/farmtree-native/assets/images/documentary/';
assert.deepEqual(plan.images.map((image) => image.number), Array.from({ length: 20 }, (_, i) => i + 1));
const selected = plan.images.filter((image) => image.selected);
assert.equal(exports.files.length, selected.length * Object.keys(plan.variants).length * plan.formats.length);
assert.equal(new Set(exports.files.map((file) => file.filename)).size, exports.files.length);
assert.deepEqual((await readdir(root)).sort(), exports.files.map((file) => file.filename).sort());
let totalBytes = 0;
for (const image of selected) {
  assert.ok(image.alt && image.section && image.priority && image.edit);
  for (const [variant, dimensions] of Object.entries(plan.variants)) {
    for (const format of plan.formats) {
      const filename = `${image.slug}-${variant}.${format}`;
      const record = exports.files.find((file) => file.filename === filename);
      assert.ok(record, `Missing evidence: ${filename}`);
      assert.ok(release.runtime.includes(root + filename), `Not allowlisted: ${filename}`);
      const bytes = await readFile(root + filename);
      assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256, filename);
      const metadata = await sharp(bytes).metadata();
      assert.equal(metadata.width, dimensions.width, filename);
      assert.equal(metadata.height, dimensions.height, filename);
      assert.ok(!metadata.exif && !metadata.iptc && !metadata.xmp, `Private metadata: ${filename}`);
      assert.ok(bytes.length < (format === 'jpg' ? 1100000 : 750000), `Image budget exceeded: ${filename}`);
      totalBytes += bytes.length;
    }
  }
}
for (const slug of ['platform', 'solutions', 'proof-stories', 'customer-segments', 'blog']) {
  const content = documentaryContent(slug);
  assert.ok(content.includes('<!-- wp:image'), slug);
  assert.ok(!content.includes('loading=') && !content.includes('fetchpriority='), 'Runtime attributes must not invalidate core Image saved markup');
  assert.ok(content.includes('<figcaption'), slug);
}
assert.equal(documentaryContent('privacy'), '');
assert.equal(documentaryContent('terms'), '');
const home = await readFile('wordpress/wp-content/themes/farmtree-native/patterns/homepage-foundation.php', 'utf8');
assert.equal((home.match(/documentary\/farmtree-[a-z-]+-hero.jpg/g) ?? []).length, 4);
const theme = await readFile('wordpress/wp-content/themes/farmtree-native/functions.php', 'utf8');
assert.ok(theme.includes("$processor->set_attribute('fetchpriority', 'high')"));
assert.ok(theme.includes("$processor->set_attribute('width', $hero ? '1920' : '1200')"));
assert.ok(theme.includes("$processor->set_attribute('loading', $primary ? 'eager' : 'lazy')"));
console.log(JSON.stringify({ status: 'ok', selected: selected.length, reserved: 20 - selected.length,
  exports: exports.files.length, totalBytes, metadata: 'stripped', releaseAllowlist: 'complete' }, null, 2));
