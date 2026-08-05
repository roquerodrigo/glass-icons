import { useState } from 'react'
import { buildAssetZip, downloadBlob } from '../export/exportZip'
import type { GlassStyle, Glyph } from '../glass/types'

interface ExportCardProps {
  glyph: Glyph | null
  style: GlassStyle
  iconName: string | null
}

export function ExportCard({ glyph, style, iconName }: ExportCardProps) {
  const [appName, setAppName] = useState('My App')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const exportAssets = async () => {
    if (!glyph) return
    setBusy(true)
    setError(null)
    try {
      const shortName = appName.trim().split(/\s+/)[0] || 'App'
      const zip = await buildAssetZip(glyph, style, {
        name: appName.trim() || 'My App',
        shortName,
        themeColor: style.backgroundBottom,
        backgroundColor: style.backgroundBottom,
      })
      downloadBlob(zip, `${iconName ?? 'icon'}-pwa-assets.zip`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'export failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="export-card" aria-label="Export">
      <label className="text-field">
        App name
        <input type="text" value={appName} onChange={(event) => setAppName(event.target.value)} />
      </label>
      <button type="button" className="export-button" disabled={!glyph || busy} onClick={exportAssets}>
        {busy ? 'Rendering assets…' : 'Download PWA assets'}
      </button>
      <button type="button" className="share-button" disabled={!glyph} onClick={copyShareLink}>
        {copied ? 'Link copied' : 'Copy share link'}
      </button>
      <p className="export-note">
        ZIP with PNG icons (192, 512, maskable, apple touch), favicons + .ico, the composed SVG, a manifest.webmanifest and a
        head snippet.
      </p>
      {!glyph && <p className="export-note">Pick an icon in the gallery to enable the export.</p>}
      {error && <p className="export-error">{error}</p>}
    </section>
  )
}
