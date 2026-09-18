import { readFileSync } from 'node:fs';

const library = JSON.parse(readFileSync(new URL('../config/farmtree-documentary-images.json', import.meta.url), 'utf8')).images;
const photograph = (number) => {
  const image = library.find((item) => item.number === number && item.selected);
  if (!image) throw new Error(`Missing approved photograph ${number}`);
  return { key: `asset.documentary.${image.slug}`, directory: 'documentary', filename: `${image.slug}-content.jpg`, alt: image.alt, title: image.alt };
};
export const proofPhotographs = Object.fromEntries(Object.entries({
  'carbon-planning': 19,
  'farm-value-projection': 8,
  'cocoa-scenario-planning': 15,
  'landscape-hydrology': 20
}).map(([slug, number]) => [slug, photograph(number)]));
export const newsPhotographs = Object.fromEntries(Object.entries({
  'farmtree-water-erosion-microclimate-model-update-2026': 20,
  'eu-carbon-farming-methodologies-agroforestry-2026': 11,
  'eudr-2026-agroforestry-data-readiness': 15,
  'verra-vm0042-v22-agricultural-land-management': 12,
  'verra-vm0042-v30-consultation-lessons': 2,
  'smallholder-agroforestry-wood-production-lessons-2025': 19,
  'carbon-pricing-2026-nature-project-quality': 8,
  'agroforestry-species-data-switchboard-2025': 10,
  'nature-restoration-plans-report-once-agroforestry-2025': 14
}).map(([slug, number]) => [slug, photograph(number)]));
export const editorialPhotographs = [...new Map([...Object.values(proofPhotographs), ...Object.values(newsPhotographs)].map((photo) => [photo.key, photo])).values()];
export const photoContext = '<!-- wp:paragraph {"fontSize":"caption"} --><p class="has-caption-font-size">Documentary photograph shown for agricultural context, not as evidence of the project, event or outcomes discussed below.</p><!-- /wp:paragraph -->';
