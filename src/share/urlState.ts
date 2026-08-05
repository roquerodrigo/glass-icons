import { defaultStyle } from '../glass/presets'
import type { GlassStyle, IconShape } from '../glass/types'

export interface SharedIcon {
  set: string
  name: string
}

export interface SharedState {
  icon: SharedIcon | null
  style: GlassStyle
}

const shapes: IconShape[] = ['squircle', 'circle', 'rounded', 'square']

function parseColor(value: string | null, fallback: string): string {
  return value && /^[0-9a-f]{6}$/i.test(value) ? `#${value.toLowerCase()}` : fallback
}

function parseFraction(value: string | null, minimum: number, maximum: number, fallback: number): number {
  const parsed = Number(value)
  if (value === null || Number.isNaN(parsed)) return fallback
  return Math.min(maximum, Math.max(minimum, parsed))
}

function parseIcon(value: string | null): SharedIcon | null {
  const match = value?.match(/^([\w-]+)\/([\w.-]+)$/)
  return match ? { set: match[1], name: match[2] } : null
}

export function readSharedState(search: string): SharedState {
  const params = new URLSearchParams(search)
  const shapeParam = params.get('shape') as IconShape | null
  return {
    icon: parseIcon(params.get('icon')),
    style: {
      backgroundTop: parseColor(params.get('bg1'), defaultStyle.backgroundTop),
      backgroundBottom: parseColor(params.get('bg2'), defaultStyle.backgroundBottom),
      glyphColor: parseColor(params.get('color'), defaultStyle.glyphColor),
      glassTint: parseColor(params.get('tint'), defaultStyle.glassTint),
      glyphScale: parseFraction(params.get('size'), 0.35, 0.8, defaultStyle.glyphScale),
      glassIntensity: parseFraction(params.get('glass'), 0, 1, defaultStyle.glassIntensity),
      shadowOpacity: parseFraction(params.get('shadow'), 0, 1, defaultStyle.shadowOpacity),
      shadowBlur: parseFraction(params.get('blur'), 0, 32, defaultStyle.shadowBlur),
      opticalAlignment: params.get('optical') === '1',
      shape: shapeParam && shapes.includes(shapeParam) ? shapeParam : defaultStyle.shape,
    },
  }
}

export function buildShareQuery(icon: SharedIcon, style: GlassStyle): string {
  const params = new URLSearchParams({
    icon: `${icon.set}/${icon.name}`,
    bg1: style.backgroundTop.slice(1),
    bg2: style.backgroundBottom.slice(1),
    color: style.glyphColor.slice(1),
    tint: style.glassTint.slice(1),
    size: String(style.glyphScale),
    glass: String(style.glassIntensity),
    shadow: String(style.shadowOpacity),
    blur: String(style.shadowBlur),
    shape: style.shape,
  })
  if (style.opticalAlignment) params.set('optical', '1')
  return params.toString()
}

export function syncUrl(icon: SharedIcon, style: GlassStyle): void {
  const query = buildShareQuery(icon, style)
  window.history.replaceState(null, '', `${window.location.pathname}?${query}`)
}
