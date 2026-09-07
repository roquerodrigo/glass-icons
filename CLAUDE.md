# glass-icons

Browser-only Liquid Glass PWA icon generator. Composes glyphs from six open icon
sets over a self-contained glass SVG background and exports a full PWA asset ZIP.
Everything runs client side; there is no backend. Deployed to GitHub Pages at
`/glass-icons/`. Public repo — see README for the icon sets and their licenses.

## Generated assets (not in git)
`public/icons/` and `public/catalog.json` are gitignored and produced by
`scripts/build-catalog.ts` from the icon-set packages. `npm run dev`/`npm run
build` regenerate them only when missing (the `predev`/`prebuild` hooks pass
`--if-missing`). Run `npm run catalog` to force a full rebuild after changing the
script, the icon-set deps, or the vendored Icons8 set — the `--if-missing` runs
will not pick those changes up.

## Non-obvious constraints
- The glass background is emitted as plain SVG (superellipse squircle, layered
  gradients, specular/rim light) with **no `backdrop-filter`**, on purpose: that
  keeps the on-screen preview and the rasterized PNG export pixel-identical. Do
  not reach for `backdrop-filter`/CSS glass — it would desync preview and output.
- `vite.config.ts` sets `base: '/glass-icons/'` because the site lives under a
  Pages subpath. Changing it breaks all asset URLs in the deployed build.
- Icons8 Liquid Glass icons are vendored as `.tsx` React components under
  `vendor/icons8-liquid-glass/`, pinned to the hash in that dir's `COMMIT` file
  (upstream ships no npm package). The other five sets come from npm deps.
- `build-catalog.ts` normalizes each glyph: `stroke` sets get `currentColor`
  stroke, `fill` sets get `currentColor` fill only when they carry no paint of
  their own, `glass` (Icons8) keeps its baked-in colors. Preserve this per-set
  `mode` handling when touching the script.

## CI / release
GitHub Pages deploy runs on push to `main` (`.github/workflows/deploy.yml`:
lint + `npm run build`, then `deploy-pages`). Branch protection is on, so land
changes through a PR with green CI; merge with **rebase merge only**.
