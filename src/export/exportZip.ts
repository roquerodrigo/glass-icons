import { strToU8, zipSync } from 'fflate'
import { composeIconSvg } from '../glass/compose'
import type { GlassStyle, Glyph } from '../glass/types'
import { buildIco } from './ico'
import { buildHeadSnippet, buildManifest, type AppIdentity } from './manifest'
import { rasterizeSvg } from './rasterize'

const MASKABLE_SAFE_ZONE = 0.8

export async function buildAssetZip(glyph: Glyph, style: GlassStyle, identity: AppIdentity): Promise<Blob> {
  const shaped = composeIconSvg(glyph, style, { fullBleed: false, safeZone: 1 })
  const fullBleed = composeIconSvg(glyph, style, { fullBleed: true, safeZone: 1 })
  const maskable = composeIconSvg(glyph, style, { fullBleed: true, safeZone: MASKABLE_SAFE_ZONE })

  const [pwa192, pwa512, maskable192, maskable512, appleTouch, favicon16, favicon32, favicon48] = await Promise.all([
    rasterizeSvg(shaped, 192),
    rasterizeSvg(shaped, 512),
    rasterizeSvg(maskable, 192),
    rasterizeSvg(maskable, 512),
    rasterizeSvg(fullBleed, 180),
    rasterizeSvg(shaped, 16),
    rasterizeSvg(shaped, 32),
    rasterizeSvg(shaped, 48),
  ])

  const files = {
    'icons/pwa-192x192.png': pwa192,
    'icons/pwa-512x512.png': pwa512,
    'icons/maskable-192x192.png': maskable192,
    'icons/maskable-512x512.png': maskable512,
    'icons/apple-touch-icon.png': appleTouch,
    'icons/favicon-16x16.png': favicon16,
    'icons/favicon-32x32.png': favicon32,
    'icons/favicon-48x48.png': favicon48,
    'favicon.ico': buildIco([
      { size: 16, png: favicon16 },
      { size: 32, png: favicon32 },
      { size: 48, png: favicon48 },
    ]),
    'icon.svg': strToU8(shaped),
    'manifest.webmanifest': strToU8(buildManifest(identity)),
    'head-snippet.html': strToU8(buildHeadSnippet(identity)),
  }

  return new Blob([zipSync(files, { level: 0 })], { type: 'application/zip' })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
