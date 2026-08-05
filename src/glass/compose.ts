import { shapePath } from './shapes'
import type { GlassStyle, Glyph, OutputVariant } from './types'

export const CANVAS_SIZE = 512

function backgroundDefs(style: GlassStyle, clipPathData: string | null): string {
  return [
    '<defs>',
    `<linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="${style.backgroundTop}"/><stop offset="1" stop-color="${style.backgroundBottom}"/></linearGradient>`,
    '<radialGradient id="sheen" cx="0.5" cy="-0.15" r="1.1"><stop offset="0" stop-color="#fff" stop-opacity="0.55"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/></radialGradient>',
    '<linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.95"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.12"/><stop offset="1" stop-color="#fff" stop-opacity="0.45"/></linearGradient>',
    '<linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>',
    '<filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8"/></filter>',
    '<filter id="softer" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="26"/></filter>',
    `<filter id="glyphShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="7" stdDeviation="${style.shadowBlur}" flood-color="#000" flood-opacity="${style.shadowOpacity}"/></filter>`,
    clipPathData ? `<clipPath id="shape"><path d="${clipPathData}"/></clipPath>` : '',
    '</defs>',
  ].join('')
}

function backgroundLayers(style: GlassStyle, variant: OutputVariant, clipPathData: string | null): string {
  const size = CANVAS_SIZE
  const intensity = style.glassIntensity
  const layers = [
    `<rect width="${size}" height="${size}" fill="url(#bg)"/>`,
    `<rect width="${size}" height="${size}" fill="url(#sheen)" opacity="${(0.9 * intensity).toFixed(3)}"/>`,
    `<ellipse cx="${size / 2}" cy="-60" rx="${size * 0.66}" ry="${size * 0.4}" fill="#fff" opacity="${(0.32 * intensity).toFixed(3)}" filter="url(#softer)"/>`,
    `<path d="M0,0H${size}V${size * 0.28}Q${size / 2},${size * 0.45} 0,${size * 0.28}Z" fill="url(#gloss)" opacity="${(0.85 * intensity).toFixed(3)}"/>`,
    `<ellipse cx="${size / 2}" cy="${size * 1.16}" rx="${size * 0.74}" ry="${size * 0.32}" fill="#000" opacity="${(0.22 * intensity).toFixed(3)}" filter="url(#softer)"/>`,
  ]
  if (!variant.fullBleed && clipPathData) {
    layers.push(
      `<path d="${clipPathData}" fill="none" stroke="url(#rim)" stroke-width="10" opacity="${(0.55 * intensity).toFixed(3)}" filter="url(#soft)"/>`,
      `<path d="${clipPathData}" fill="none" stroke="url(#rim)" stroke-width="3" opacity="${(0.9 * intensity).toFixed(3)}"/>`,
    )
  }
  const group = layers.join('')
  return clipPathData ? `<g clip-path="url(#shape)">${group}</g>` : `<g>${group}</g>`
}

function glyphLayer(glyph: Glyph, style: GlassStyle, variant: OutputVariant): string {
  const [minX, minY, viewWidth, viewHeight] = glyph.viewBox.split(/[\s,]+/).map(Number)
  const target = CANVAS_SIZE * style.glyphScale * variant.safeZone
  const scale = target / Math.max(viewWidth, viewHeight)
  const center = style.opticalAlignment && glyph.opticalCenter
    ? glyph.opticalCenter
    : { x: minX + viewWidth / 2, y: minY + viewHeight / 2 }
  const translateX = CANVAS_SIZE / 2 - center.x * scale
  const translateY = CANVAS_SIZE / 2 - center.y * scale
  const markup = glyph.mode === 'glass' ? glyph.markup.replaceAll('#fff', style.glassTint) : glyph.markup
  return [
    `<g filter="url(#glyphShadow)">`,
    `<g transform="translate(${translateX.toFixed(2)},${translateY.toFixed(2)}) scale(${scale.toFixed(4)})" color="${style.glyphColor}">`,
    markup,
    '</g></g>',
  ].join('')
}

export function composeIconSvg(glyph: Glyph | null, style: GlassStyle, variant: OutputVariant, pixelSize = CANVAS_SIZE): string {
  const clipPathData = variant.fullBleed ? null : shapePath(style.shape, CANVAS_SIZE)
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${pixelSize}" height="${pixelSize}" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}">`,
    backgroundDefs(style, clipPathData),
    backgroundLayers(style, variant, clipPathData),
    glyph ? glyphLayer(glyph, style, variant) : '',
    '</svg>',
  ].join('')
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
