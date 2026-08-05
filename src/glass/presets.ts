import type { GlassStyle } from './types'

export interface StylePreset {
  name: string
  backgroundTop: string
  backgroundBottom: string
}

export const presets: StylePreset[] = [
  { name: 'Sky', backgroundTop: '#67e8f9', backgroundBottom: '#2563eb' },
  { name: 'Violet', backgroundTop: '#c4b5fd', backgroundBottom: '#6d28d9' },
  { name: 'Sunset', backgroundTop: '#fcd34d', backgroundBottom: '#ea580c' },
  { name: 'Rose', backgroundTop: '#fda4af', backgroundBottom: '#be123c' },
  { name: 'Mint', backgroundTop: '#6ee7b7', backgroundBottom: '#047857' },
  { name: 'Ocean', backgroundTop: '#22d3ee', backgroundBottom: '#0e7490' },
  { name: 'Flamingo', backgroundTop: '#f9a8d4', backgroundBottom: '#9d174d' },
  { name: 'Graphite', backgroundTop: '#64748b', backgroundBottom: '#0f172a' },
]

export const defaultStyle: GlassStyle = {
  backgroundTop: presets[0].backgroundTop,
  backgroundBottom: presets[0].backgroundBottom,
  glyphColor: '#ffffff',
  glassTint: '#ffffff',
  glyphScale: 0.65,
  glassIntensity: 0,
  shadowOpacity: 0.5,
  shadowBlur: 32,
  opticalAlignment: false,
  shape: 'rounded',
}
