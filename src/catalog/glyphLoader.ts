import type { Glyph } from '../glass/types'
import { catalogUrl } from './useCatalog'
import type { Catalog, CatalogIcon } from './types'

export function iconSvgUrl(icon: CatalogIcon): string {
  return catalogUrl(`icons/${icon.set}/${icon.name}.svg`)
}

export async function loadGlyph(icon: CatalogIcon, catalog: Catalog): Promise<Glyph> {
  const set = catalog.sets.find((candidate) => candidate.id === icon.set)
  if (!set) throw new Error(`unknown icon set ${icon.set}`)
  const response = await fetch(iconSvgUrl(icon))
  if (!response.ok) throw new Error(`glyph request failed with ${response.status}`)
  const markup = await response.text()
  const document = new DOMParser().parseFromString(markup, 'image/svg+xml')
  const root = document.documentElement
  const viewBox = root.getAttribute('viewBox')
  if (!viewBox) throw new Error(`glyph ${icon.set}/${icon.name} has no viewBox`)
  const opticalCenter = await measureOpticalCenter(markup, viewBox).catch(() => null)
  return { viewBox, markup: root.innerHTML, mode: set.mode, opticalCenter }
}

const MEASURE_SIZE = 96

async function measureOpticalCenter(markup: string, viewBox: string): Promise<{ x: number; y: number } | null> {
  const [minX, minY, viewWidth, viewHeight] = viewBox.split(/[\s,]+/).map(Number)
  const sized = markup.replace('<svg ', `<svg width="${MEASURE_SIZE}" height="${MEASURE_SIZE}" `)
  const image = new Image()
  const loaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('glyph failed to rasterize'))
  })
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`
  await loaded
  const canvas = document.createElement('canvas')
  canvas.width = MEASURE_SIZE
  canvas.height = MEASURE_SIZE
  const context = canvas.getContext('2d')
  if (!context) return null
  context.drawImage(image, 0, 0, MEASURE_SIZE, MEASURE_SIZE)
  const { data } = context.getImageData(0, 0, MEASURE_SIZE, MEASURE_SIZE)
  let weight = 0
  let momentX = 0
  let momentY = 0
  for (let y = 0; y < MEASURE_SIZE; y += 1) {
    for (let x = 0; x < MEASURE_SIZE; x += 1) {
      const alpha = data[(y * MEASURE_SIZE + x) * 4 + 3]
      weight += alpha
      momentX += alpha * (x + 0.5)
      momentY += alpha * (y + 0.5)
    }
  }
  if (weight === 0) return null
  return {
    x: minX + (momentX / weight / MEASURE_SIZE) * viewWidth,
    y: minY + (momentY / weight / MEASURE_SIZE) * viewHeight,
  }
}
