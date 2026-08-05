import { presets } from '../glass/presets'
import type { GlassStyle, GlyphMode, IconShape } from '../glass/types'

interface ControlsProps {
  style: GlassStyle
  glyphMode: GlyphMode | null
  onChange: (style: GlassStyle) => void
}

const shapes: { id: IconShape; label: string }[] = [
  { id: 'squircle', label: 'Squircle' },
  { id: 'circle', label: 'Circle' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'square', label: 'Square' },
]

export function Controls({ style, glyphMode, onChange }: ControlsProps) {
  const patch = (changes: Partial<GlassStyle>) => onChange({ ...style, ...changes })

  return (
    <section className="controls" aria-label="Style controls">
      <div className="control-group">
        <span className="control-label">Presets</span>
        <div className="preset-row">
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className="preset-swatch"
              title={preset.name}
              style={{ background: `linear-gradient(160deg, ${preset.backgroundTop}, ${preset.backgroundBottom})` }}
              onClick={() => patch({ backgroundTop: preset.backgroundTop, backgroundBottom: preset.backgroundBottom })}
            />
          ))}
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Background</span>
        <div className="control-row">
          <label className="color-field">
            <input type="color" value={style.backgroundTop} onChange={(event) => patch({ backgroundTop: event.target.value })} />
            Top
          </label>
          <label className="color-field">
            <input type="color" value={style.backgroundBottom} onChange={(event) => patch({ backgroundBottom: event.target.value })} />
            Bottom
          </label>
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Glyph</span>
        <div className="control-row">
          {glyphMode === 'glass' ? (
            <label className="color-field">
              <input type="color" value={style.glassTint} onChange={(event) => patch({ glassTint: event.target.value })} />
              Tint
            </label>
          ) : (
            <label className="color-field">
              <input type="color" value={style.glyphColor} onChange={(event) => patch({ glyphColor: event.target.value })} />
              Color
            </label>
          )}
          <label className="slider-field">
            <input
              type="range"
              min="0.35"
              max="0.8"
              step="0.01"
              value={style.glyphScale}
              onChange={(event) => patch({ glyphScale: Number(event.target.value) })}
            />
            Size
          </label>
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Glass</span>
        <div className="control-row">
          <label className="slider-field">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={style.glassIntensity}
              onChange={(event) => patch({ glassIntensity: Number(event.target.value) })}
            />
            Intensity
          </label>
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Shape</span>
        <div className="control-row">
          {shapes.map((shape) => (
            <button
              key={shape.id}
              type="button"
              className={style.shape === shape.id ? 'chip chip-active' : 'chip'}
              onClick={() => patch({ shape: shape.id })}
            >
              {shape.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
