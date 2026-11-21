import type { GlassStyle } from './types'

export function backgroundStartColor(style: GlassStyle): string {
  return style.backgroundGradient ? style.backgroundTop : style.backgroundBottom
}

export function backgroundStartOpacity(style: GlassStyle): number {
  return style.backgroundGradient ? style.backgroundTopOpacity : style.backgroundBottomOpacity
}

export function withOpaqueBackground(style: GlassStyle): GlassStyle {
  return { ...style, backgroundTopOpacity: 1, backgroundBottomOpacity: 1 }
}

export function backgroundFill(top: string, bottom: string, isGradient: boolean): string {
  return isGradient ? `linear-gradient(160deg, ${top}, ${bottom})` : bottom
}
