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
  return { viewBox, markup: root.innerHTML, mode: set.mode }
}
