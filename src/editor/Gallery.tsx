import { useState } from 'react'
import { iconSvgUrl } from '../catalog/glyphLoader'
import type { Catalog, CatalogIcon } from '../catalog/types'
import { useIconSearch } from '../catalog/useCatalog'

interface GalleryProps {
  catalog: Catalog
  selected: CatalogIcon | null
  onSelect: (icon: CatalogIcon) => void
}

export function Gallery({ catalog, selected, onSelect }: GalleryProps) {
  const [query, setQuery] = useState('')
  const [setFilter, setSetFilter] = useState<string | null>(null)
  const results = useIconSearch(catalog, query, setFilter)

  return (
    <section className="gallery" aria-label="Icon gallery">
      <input
        className="gallery-search"
        type="search"
        placeholder={`Search ${catalog.icons.length.toLocaleString('en-US')} icons`}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="gallery-sets" role="group" aria-label="Icon sets">
        <button type="button" className={setFilter === null ? 'chip chip-active' : 'chip'} onClick={() => setSetFilter(null)}>
          All
        </button>
        {catalog.sets.map((set) => (
          <button
            key={set.id}
            type="button"
            className={setFilter === set.id ? 'chip chip-active' : 'chip'}
            onClick={() => setSetFilter(setFilter === set.id ? null : set.id)}
          >
            {set.label}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {results.map((icon) => {
          const isSelected = selected?.set === icon.set && selected?.name === icon.name
          return (
            <button
              key={`${icon.set}/${icon.name}`}
              type="button"
              className={`tile tile-${icon.set === 'icons8-glass' ? 'dark' : 'light'}${isSelected ? ' tile-selected' : ''}`}
              title={icon.title ?? icon.name}
              onClick={() => onSelect(icon)}
            >
              <img src={iconSvgUrl(icon)} alt={icon.title ?? icon.name} loading="lazy" width="28" height="28" />
            </button>
          )
        })}
      </div>
      {results.length >= 240 && <p className="gallery-hint">Showing the first 240 matches — refine the search to narrow down.</p>}
      {results.length === 0 && <p className="gallery-hint">No icon matches this search. Try another term or clear the set filter.</p>}
    </section>
  )
}
