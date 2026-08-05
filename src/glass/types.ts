export type GlyphMode = 'stroke' | 'fill' | 'glass'

export type IconShape = 'squircle' | 'circle' | 'rounded' | 'square'

export interface Glyph {
  viewBox: string
  markup: string
  mode: GlyphMode
}

export interface GlassStyle {
  backgroundTop: string
  backgroundBottom: string
  glyphColor: string
  glassTint: string
  glyphScale: number
  glassIntensity: number
  shape: IconShape
}

export interface OutputVariant {
  fullBleed: boolean
  safeZone: number
}
