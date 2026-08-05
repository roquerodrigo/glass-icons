# Glass Icons

Compose Liquid Glass style app icons from open licensed icon sets and download the full PWA asset kit — entirely in the browser.

**Live app:** https://www.rodrigoroque.dev/glass-icons/

## What it does

- Browse 12,000+ icons from six open licensed sets: [Icons8 Liquid Glass](https://github.com/icons8/liquid-glass-icons) (MIT), [Lucide](https://lucide.dev) (ISC), [Tabler Icons](https://tabler.io/icons) (MIT), [Phosphor](https://phosphoricons.com) (MIT), [Heroicons](https://heroicons.com) (MIT) and [Simple Icons](https://simpleicons.org) (CC0).
- Compose any glyph over a Liquid Glass background generated as self-contained SVG: superellipse squircle, layered gradients, specular highlight and rim light — no `backdrop-filter`, so the preview and the exported PNGs are pixel-identical.
- Customize background gradient, glyph color or glass tint, glyph size, glass intensity and shape (squircle, circle, rounded, square).
- Export a ZIP with everything a PWA needs:
  - `pwa-192x192.png`, `pwa-512x512.png`
  - `maskable-192x192.png`, `maskable-512x512.png` (80% safe zone, full-bleed background)
  - `apple-touch-icon.png` (180×180, opaque)
  - `favicon-16/32/48.png` and a multi-size `favicon.ico`
  - the composed `icon.svg`
  - a ready `manifest.webmanifest` and an HTML head snippet

Everything runs client side. No uploads, no backend.

## Development

```sh
npm install
npm run dev
```

The first run generates `public/icons/` and `public/catalog.json` from the icon set packages (`scripts/build-catalog.ts`). Regenerate at any time with `npm run catalog`.

```sh
npm run lint
npm run build
```

## Architecture

| Path | Responsibility |
| --- | --- |
| `scripts/build-catalog.ts` | Extracts and normalizes SVGs from the icon packages into `public/icons/` plus a searchable `public/catalog.json` |
| `src/catalog/` | Catalog loading, search and glyph fetching |
| `src/glass/` | The Liquid Glass engine: shapes, layered background, composition into a standalone SVG |
| `src/editor/` | Gallery, live preview, style controls and the export card |
| `src/export/` | SVG rasterization to PNG, ICO assembly, manifest generation and ZIP packaging |
| `vendor/icons8-liquid-glass/` | Vendored copy of the Icons8 Liquid Glass icons (MIT), pinned to the commit recorded in `COMMIT` |

## Licenses

The project code is MIT licensed. Each icon set keeps its own license, mirrored in [`LICENSES/`](./LICENSES). Brand icons from Simple Icons are subject to the respective owners' trademark policies — review them before shipping a brand mark as your app icon.
