import { Card } from '@astryxdesign/core/Card'
import { Grid } from '@astryxdesign/core/Grid'
import { ScrollableArea } from '@astryxdesign/core/ScrollableArea'
import { Selector, type SelectorOptionType } from '@astryxdesign/core/Selector'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { ToggleButton } from '@astryxdesign/core/ToggleButton'
import { VStack } from '@astryxdesign/core/VStack'
import { useMemo, useState } from 'react'
import { iconSvgUrl } from '../catalog/glyphLoader'
import type { Catalog, CatalogIcon, IconSetInfo } from '../catalog/types'
import { useIconSearch } from '../catalog/useCatalog'

interface GalleryProps {
  catalog: Catalog
  selected: CatalogIcon | null
  onSelect: (icon: CatalogIcon) => void
  className?: string
}

const RESULT_LIMIT = 240
const ALL_SETS = 'all'

function buildSetOptions(catalog: Catalog): SelectorOptionType[] {
  const iconCounts = new Map<string, number>()
  for (const icon of catalog.icons) iconCounts.set(icon.set, (iconCounts.get(icon.set) ?? 0) + 1)
  const toOption = (set: IconSetInfo) => ({
    value: set.id,
    label: set.label,
    description: `${(iconCounts.get(set.id) ?? 0).toLocaleString('en-US')} icons · ${set.license}`,
  })
  const isColorSet = (set: IconSetInfo) => set.mode === 'glass' || set.mode === 'color'
  return [
    { value: ALL_SETS, label: 'All sets', description: `${catalog.icons.length.toLocaleString('en-US')} icons` },
    { type: 'section', title: 'Color', options: catalog.sets.filter(isColorSet).map(toOption) },
    { type: 'section', title: 'Monochrome', options: catalog.sets.filter((set) => !isColorSet(set)).map(toOption) },
  ]
}

export function Gallery({ catalog, selected, onSelect, className }: GalleryProps) {
  const [query, setQuery] = useState('')
  const [setFilter, setSetFilter] = useState<string | null>(null)
  const results = useIconSearch(catalog, query, setFilter, RESULT_LIMIT)
  const setOptions = useMemo(() => buildSetOptions(catalog), [catalog])
  const darkTileSets = useMemo(() => new Set(catalog.sets.filter((set) => set.mode === 'glass').map((set) => set.id)), [catalog])

  return (
    <Card aria-label="Icon gallery" className={className}>
      <VStack gap={3}>
        <TextInput
          type="search"
          label="Search icons"
          isLabelHidden
          startIcon="search"
          hasClear
          placeholder={`Search ${catalog.icons.length.toLocaleString('en-US')} icons`}
          value={query}
          onChange={setQuery}
        />
        <Selector
          label="Icon set"
          isLabelHidden
          presentation="adaptive"
          options={setOptions}
          value={setFilter ?? ALL_SETS}
          onChange={(value) => setSetFilter(value === ALL_SETS ? null : value)}
        />
        <ScrollableArea label="Icons" padding={1} className="gallery-scroll">
          <Grid columns={{ minWidth: 46 }} gap={2}>
            {results.map((icon) => (
              <ToggleButton
                key={`${icon.set}/${icon.name}`}
                label={icon.title ?? icon.name}
                tooltip={icon.title ?? icon.name}
                isPressed={selected?.set === icon.set && selected?.name === icon.name}
                onPressedChange={() => onSelect(icon)}
                className={`icon-tile ${darkTileSets.has(icon.set) ? 'icon-tile-dark' : 'icon-tile-light'}`}
              >
                <img src={iconSvgUrl(icon)} alt="" loading="lazy" width="28" height="28" />
              </ToggleButton>
            ))}
          </Grid>
        </ScrollableArea>
        {results.length >= RESULT_LIMIT && (
          <Text type="supporting" color="secondary">
            Showing the first {RESULT_LIMIT} matches — refine the search to narrow down.
          </Text>
        )}
        {results.length === 0 && (
          <Text type="supporting" color="secondary">
            No icon matches this search. Try another term or clear the set filter.
          </Text>
        )}
      </VStack>
    </Card>
  )
}
