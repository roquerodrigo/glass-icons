import { Card } from '@astryxdesign/core/Card'
import { Grid } from '@astryxdesign/core/Grid'
import { HStack } from '@astryxdesign/core/HStack'
import { ScrollableArea } from '@astryxdesign/core/ScrollableArea'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { ToggleButton } from '@astryxdesign/core/ToggleButton'
import { VStack } from '@astryxdesign/core/VStack'
import { useState } from 'react'
import { iconSvgUrl } from '../catalog/glyphLoader'
import type { Catalog, CatalogIcon } from '../catalog/types'
import { useIconSearch } from '../catalog/useCatalog'

interface GalleryProps {
  catalog: Catalog
  selected: CatalogIcon | null
  onSelect: (icon: CatalogIcon) => void
}

const RESULT_LIMIT = 240

export function Gallery({ catalog, selected, onSelect }: GalleryProps) {
  const [query, setQuery] = useState('')
  const [setFilter, setSetFilter] = useState<string | null>(null)
  const results = useIconSearch(catalog, query, setFilter, RESULT_LIMIT)

  return (
    <Card aria-label="Icon gallery">
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
        <HStack gap={1} wrap="wrap" role="group" aria-label="Icon sets">
          <ToggleButton label="All" size="sm" isPressed={setFilter === null} onPressedChange={() => setSetFilter(null)} />
          {catalog.sets.map((set) => (
            <ToggleButton
              key={set.id}
              label={set.label}
              size="sm"
              isPressed={setFilter === set.id}
              onPressedChange={(isPressed) => setSetFilter(isPressed ? set.id : null)}
            />
          ))}
        </HStack>
        <ScrollableArea label="Icons" padding={1} className="gallery-scroll">
          <Grid columns={{ minWidth: 46 }} gap={2}>
            {results.map((icon) => (
              <ToggleButton
                key={`${icon.set}/${icon.name}`}
                label={icon.title ?? icon.name}
                tooltip={icon.title ?? icon.name}
                isPressed={selected?.set === icon.set && selected?.name === icon.name}
                onPressedChange={() => onSelect(icon)}
                className={`icon-tile ${icon.set === 'icons8-glass' ? 'icon-tile-dark' : 'icon-tile-light'}`}
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
