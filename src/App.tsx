import { useEffect, useState } from 'react'
import './App.css'
import { loadGlyph } from './catalog/glyphLoader'
import type { CatalogIcon } from './catalog/types'
import { useCatalog } from './catalog/useCatalog'
import { Controls } from './editor/Controls'
import { ExportCard } from './editor/ExportCard'
import { Gallery } from './editor/Gallery'
import { LicensesFooter } from './editor/LicensesFooter'
import { Preview } from './editor/Preview'
import { defaultStyle } from './glass/presets'
import type { GlassStyle, Glyph } from './glass/types'

export default function App() {
  const { catalog, error } = useCatalog()
  const [selected, setSelected] = useState<CatalogIcon | null>(null)
  const [glyph, setGlyph] = useState<Glyph | null>(null)
  const [glyphError, setGlyphError] = useState<string | null>(null)
  const [style, setStyle] = useState<GlassStyle>(defaultStyle)

  useEffect(() => {
    if (!catalog || selected) return
    const initial = catalog.icons.find((icon) => icon.set === 'icons8-glass' && icon.name === 'rocket') ?? catalog.icons[0]
    setSelected(initial)
  }, [catalog, selected])

  useEffect(() => {
    if (!catalog || !selected) return
    let cancelled = false
    setGlyphError(null)
    loadGlyph(selected, catalog)
      .then((loaded) => {
        if (!cancelled) setGlyph(loaded)
      })
      .catch((cause: Error) => {
        if (!cancelled) setGlyphError(cause.message)
      })
    return () => {
      cancelled = true
    }
  }, [catalog, selected])

  return (
    <div
      className="workspace"
      style={{ '--ambient-top': style.backgroundTop, '--ambient-bottom': style.backgroundBottom } as React.CSSProperties}
    >
      <header className="masthead">
        <h1>Glass Icons</h1>
        <p>Turn any open licensed icon into a Liquid Glass app icon and download the full PWA asset kit.</p>
      </header>
      {error && <p className="load-error">The icon catalog failed to load ({error}). Reload the page to try again.</p>}
      {glyphError && <p className="load-error">The selected icon failed to load ({glyphError}). Pick another one.</p>}
      <main className="workbench">
        {catalog ? <Gallery catalog={catalog} selected={selected} onSelect={setSelected} /> : <p className="loading">Loading catalog…</p>}
        <div className="stage">
          <Preview glyph={glyph} style={style} />
          <ExportCard glyph={glyph} style={style} iconName={selected?.name ?? null} />
        </div>
        <Controls style={style} glyphMode={glyph?.mode ?? null} onChange={setStyle} />
      </main>
      <LicensesFooter catalog={catalog} />
    </div>
  )
}
