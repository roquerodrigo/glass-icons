import type { GlassStyle } from './types'

export function backgroundStartColor(style: GlassStyle): string {
  return style.backgroundGradient ? style.backgroundTop : style.backgroundBottom
}

export function backgroundFill(top: string, bottom: string, isGradient: boolean): string {
  return isGradient ? `linear-gradient(160deg, ${top}, ${bottom})` : bottom
}
