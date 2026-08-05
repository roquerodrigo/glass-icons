export type GlyphMode = 'stroke' | 'fill' | 'glass'

export type IconShape = 'squircle' | 'circle' | 'rounded' | 'square'

export interface Glyph {
  viewBox: string
  markup: string
  mode: GlyphMode
  opticalCenter: { x: number; y: number } | null
}

export interface GlassStyle {
  backgroundTop: string
  backgroundBottom: string
  glyphColor: string
  glassTint: string
  glyphScale: number
  glassIntensity: number
  shadowOpacity: number
  shadowBlur: number
  opticalAlignment: boolean
  shape: IconShape
}

export interface OutputVariant {
  fullBleed: boolean
  safeZone: number
}
