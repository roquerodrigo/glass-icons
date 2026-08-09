# Glass Icons

Browser-only Liquid Glass PWA icon generator. See `README.md` for the feature
list and the `src/` responsibility table.

## Gotchas

- **The glass background must stay a self-contained SVG with no
  `backdrop-filter`.** That is a hard design constraint, not an oversight: the
  live preview and the rasterized PNGs are the same SVG, so anything the browser
  can't reproduce in a headless canvas would make the export diverge from the
  preview. Keep effects (gradients, specular, rim light) inline in the SVG.

- **`public/icons/` and `public/catalog.json` are generated and gitignored.**
  `predev`/`prebuild` run the catalog build with `--if-missing`, so they only
  generate when absent — they will NOT pick up changes to `scripts/build-catalog.ts`
  or to the icon-set packages. After changing either, rerun `npm run catalog`
  explicitly to regenerate.

- **App is served from a subpath** (`base: '/glass-icons/'` in `vite.config.ts`).
  Reference assets through Vite (`import.meta.env.BASE_URL`, bundler imports),
  never with root-absolute `/...` paths.

- **`vendor/icons8-liquid-glass/` is a vendored copy** pinned to the hash in
  `vendor/icons8-liquid-glass/COMMIT`. Update that file when re-syncing the
  upstream icons.

- Each icon set keeps its own upstream license (mirrored in `LICENSES/`); Simple
  Icons brand marks carry trademark constraints. Preserve attribution when
  touching catalog or export code.
