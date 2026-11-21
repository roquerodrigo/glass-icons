import { Grid } from '@astryxdesign/core/Grid'
import { ScrollableArea } from '@astryxdesign/core/ScrollableArea'
import { ToggleButton } from '@astryxdesign/core/ToggleButton'
import { VStack } from '@astryxdesign/core/VStack'
import { memo, useEffect, useRef } from 'react'
import { iconSvgUrl } from '../catalog/glyphLoader'
import type { CatalogIcon } from '../catalog/types'
import { useElementWidth } from './useElementWidth'
import { useVisibleRows } from './useVisibleRows'

interface IconGridProps {
  icons: CatalogIcon[]
  selected: CatalogIcon | null
  darkTileSets: Set<string>
  onSelect: (icon: CatalogIcon) => void
}

interface IconRowProps {
  icons: CatalogIcon[]
  rowIndex: number
  columns: number
  rowHeight: number
  selectedKey: string | null
  darkTileSets: Set<string>
  onSelect: (icon: CatalogIcon) => void
}

const MINIMUM_TILE_PIXELS = 46
const TILE_GAP_PIXELS = 8
const OVERSCAN_ROWS = 4

const iconKey = (icon: CatalogIcon) => `${icon.set}/${icon.name}`

function gridGeometry(width: number) {
  const columns = Math.max(1, Math.floor((width + TILE_GAP_PIXELS) / (MINIMUM_TILE_PIXELS + TILE_GAP_PIXELS)))
  const tileSize = (width - TILE_GAP_PIXELS * (columns - 1)) / columns
  return { columns, rowHeight: tileSize + TILE_GAP_PIXELS }
}

const IconRow = memo(function IconRow({ icons, rowIndex, columns, rowHeight, selectedKey, darkTileSets, onSelect }: IconRowProps) {
  return (
    <Grid columns={columns} gap={2} className="icon-grid-row" style={{ transform: `translateY(${rowIndex * rowHeight}px)` }}>
      {icons.slice(rowIndex * columns, (rowIndex + 1) * columns).map((icon) => (
        <ToggleButton
          key={iconKey(icon)}
          label={icon.title ?? icon.name}
          tooltip={icon.title ?? icon.name}
          isPressed={iconKey(icon) === selectedKey}
          onPressedChange={() => onSelect(icon)}
          className={`icon-tile ${darkTileSets.has(icon.set) ? 'icon-tile-dark' : 'icon-tile-light'}`}
        >
          <img src={iconSvgUrl(icon)} alt="" loading="lazy" decoding="async" width="28" height="28" />
        </ToggleButton>
      ))}
    </Grid>
  )
})

export function IconGrid({ icons, selected, darkTileSets, onSelect }: IconGridProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const width = useElementWidth(contentRef)
  const { columns, rowHeight } = gridGeometry(width)
  const rowCount = width > 0 ? Math.ceil(icons.length / columns) : 0
  const visibleRows = useVisibleRows(viewportRef, rowHeight, rowCount, OVERSCAN_ROWS)
  const rowIndexes = Array.from({ length: visibleRows.end - visibleRows.start }, (_, offset) => visibleRows.start + offset)
  const selectedKey = selected ? iconKey(selected) : null

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0 })
  }, [icons])

  return (
    <ScrollableArea ref={viewportRef} label="Icons" padding={1} className="gallery-scroll">
      <VStack ref={contentRef} height={rowCount * rowHeight} className="icon-grid">
        {rowIndexes.map((rowIndex) => (
          <IconRow
            key={rowIndex}
            icons={icons}
            rowIndex={rowIndex}
            columns={columns}
            rowHeight={rowHeight}
            selectedKey={selectedKey}
            darkTileSets={darkTileSets}
            onSelect={onSelect}
          />
        ))}
      </VStack>
    </ScrollableArea>
  )
}
