import type { GlyphMode } from '../glass/types'

export interface IconSetInfo {
  id: string
  label: string
  license: string
  source: string
  mode: GlyphMode
}

export interface CatalogIcon {
  set: string
  name: string
  title?: string
}

export interface Catalog {
  sets: IconSetInfo[]
  icons: CatalogIcon[]
}
