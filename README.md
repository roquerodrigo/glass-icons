# Glass Icons

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-db61a2?logo=githubsponsors&logoColor=white&style=for-the-badge)](https://github.com/sponsors/roquerodrigo)

Compose Liquid Glass style app icons from open licensed icon sets and download the full PWA asset kit — entirely in the browser.

**Live app:** https://www.rodrigoroque.dev/glass-icons/

## What it does

- Browse 30,000+ icons from sixteen open licensed sets:
  - Monochrome: [Lucide](https://lucide.dev) (ISC), [Tabler Icons](https://tabler.io/icons) (MIT), [Phosphor](https://phosphoricons.com) (MIT), [Heroicons](https://heroicons.com) (MIT) and [Simple Icons](https://simpleicons.org) (CC0).
  - Color, keeping their own palette: [Icons8 Liquid Glass](https://github.com/icons8/liquid-glass-icons) (MIT), [Fluent UI System Color Icons](https://github.com/microsoft/fluentui-system-icons) (MIT), [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) flat and 3D (MIT), [Noto Emoji](https://github.com/googlefonts/noto-emoji) current and v1 (Apache 2.0), [Flat Color Icons](https://github.com/icons8/flat-color-icons) (MIT), [Glyphs Poly](https://github.com/gorango/glyphs) (MIT), [IconPark](https://github.com/bytedance/IconPark) (Apache 2.0), [Meteocons](https://github.com/basmilius/meteocons) (MIT) and [Flat UI](https://github.com/designmodo/Flat-UI) (MIT).
- Compose any glyph over a Liquid Glass background generated as self-contained SVG: superellipse squircle, layered gradients, specular highlight and rim light — no `backdrop-filter`, so the preview and the exported PNGs are pixel-identical.
- Customize the background (gradient or solid color, each color with its own opacity), glyph color, glass tint or glyph opacity, glyph size, glass intensity and shape (squircle, circle, rounded, square).
- Export a ZIP with everything a PWA needs:
  - `pwa-192x192.png`, `pwa-512x512.png`
  - `maskable-192x192.png`, `maskable-512x512.png` (80% safe zone, full-bleed background)
  - `apple-touch-icon.png` (180×180, opaque)
  - `favicon-16/32/48.png` and a multi-size `favicon.ico`
  - the composed `icon.svg`
  - a ready `manifest.webmanifest` and an HTML head snippet

Everything runs client side. No uploads, no backend. The interface is built with the [Astryx](https://github.com/meta/astryx) design system.

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
| `scripts/build-catalog.ts` | Extracts and normalizes SVGs from the icon packages (plain SVG files, `@iconify-json/*` collections and the static `@meteocons/svg-static` build) into `public/icons/` plus a searchable `public/catalog.json` |
| `src/catalog/` | Catalog loading, search and glyph fetching |
| `src/glass/` | The Liquid Glass engine: shapes, layered background, composition into a standalone SVG |
| `src/editor/` | Gallery, live preview, style controls and the export card, composed from Astryx components |
| `src/export/` | SVG rasterization to PNG, ICO assembly, manifest generation and ZIP packaging |
| `vendor/icons8-liquid-glass/` | Vendored copy of the Icons8 Liquid Glass icons (MIT), pinned to the commit recorded in `COMMIT` |

## Support

This project is built and maintained on personal time. If it is useful to you, consider [sponsoring the work](https://github.com/sponsors/roquerodrigo) — it keeps the development, the testing and the releases coming.

## Licenses

The project code is MIT licensed. Each icon set keeps its own license, mirrored in [`LICENSES/`](./LICENSES). Brand icons from Simple Icons are subject to the respective owners' trademark policies — review them before shipping a brand mark as your app icon.
