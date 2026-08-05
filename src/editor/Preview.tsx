import { useMemo, useState } from 'react'
import { composeIconSvg, svgToDataUrl } from '../glass/compose'
import type { GlassStyle, Glyph } from '../glass/types'

interface PreviewProps {
  glyph: Glyph | null
  style: GlassStyle
}

const PREVIEW_PIXEL_SIZE = 1024

export function Preview({ glyph, style }: PreviewProps) {
  const [dock, setDock] = useState<'dark' | 'light'>('dark')
  const shaped = useMemo(
    () => svgToDataUrl(composeIconSvg(glyph, style, { fullBleed: false, safeZone: 1 }, PREVIEW_PIXEL_SIZE)),
    [glyph, style],
  )
  const maskable = useMemo(
    () => svgToDataUrl(composeIconSvg(glyph, style, { fullBleed: true, safeZone: 0.8 }, PREVIEW_PIXEL_SIZE)),
    [glyph, style],
  )

  return (
    <section className="preview" aria-label="Icon preview">
      <div className={`preview-dock preview-dock-${dock}`}>
        <img className="preview-main" src={shaped} alt="Icon preview" width="256" height="256" />
        <div className="preview-row">
          <figure>
            <img src={shaped} alt="64 pixel preview" width="64" height="64" />
            <figcaption>64</figcaption>
          </figure>
          <figure>
            <img src={shaped} alt="32 pixel preview" width="32" height="32" />
            <figcaption>32</figcaption>
          </figure>
          <figure>
            <img className="preview-maskable" src={maskable} alt="Maskable preview" width="64" height="64" />
            <figcaption>maskable</figcaption>
          </figure>
        </div>
      </div>
      <div className="preview-toggle" role="group" aria-label="Preview background">
        <button type="button" className={dock === 'dark' ? 'chip chip-active' : 'chip'} onClick={() => setDock('dark')}>
          Dark
        </button>
        <button type="button" className={dock === 'light' ? 'chip chip-active' : 'chip'} onClick={() => setDock('light')}>
          Light
        </button>
      </div>
    </section>
  )
}
