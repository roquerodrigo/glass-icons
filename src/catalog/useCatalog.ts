import { useEffect, useMemo, useState } from 'react'
import type { Catalog, CatalogIcon } from './types'

export function catalogUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`
}

export function useCatalog(): { catalog: Catalog | null; error: string | null } {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(catalogUrl('catalog.json'))
      .then((response) => {
        if (!response.ok) throw new Error(`catalog request failed with ${response.status}`)
        return response.json() as Promise<Catalog>
      })
      .then((data) => {
        if (!cancelled) setCatalog(data)
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { catalog, error }
}

export function searchIcons(catalog: Catalog, query: string, setFilter: string | null, limit: number): CatalogIcon[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const results: CatalogIcon[] = []
  for (const icon of catalog.icons) {
    if (setFilter && icon.set !== setFilter) continue
    const haystack = icon.title ? `${icon.name} ${icon.title.toLowerCase()}` : icon.name
    if (terms.every((term) => haystack.includes(term))) {
      results.push(icon)
      if (results.length >= limit) break
    }
  }
  return results
}

export function useIconSearch(catalog: Catalog | null, query: string, setFilter: string | null, limit = 240): CatalogIcon[] {
  return useMemo(() => {
    if (!catalog) return []
    return searchIcons(catalog, query, setFilter, limit)
  }, [catalog, query, setFilter, limit])
}
