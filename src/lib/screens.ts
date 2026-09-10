import type { ImageMetadata } from 'astro';

/**
 * Every screenshot on the site lives in src/assets/work as a lossless .webp,
 * and content files reference them by filename stem. This is the only image
 * resolver: keeping one folder means a key can never resolve two ways, and
 * astro:assets gives us intrinsic dimensions plus content-hashed output.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/work/*.webp',
  { eager: true }
);

const byKey = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, mod]) => [
    path.split('/').pop()!.replace('.webp', ''),
    mod.default,
  ])
);

export function screen(key: string): ImageMetadata {
  const found = byKey.get(key);
  if (!found) {
    throw new Error(
      `No screenshot named "${key}" in src/assets/work. Available: ${[...byKey.keys()].join(', ')}`
    );
  }
  return found;
}
