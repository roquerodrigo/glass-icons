import { Card } from '@astryxdesign/core/Card'
import { HStack } from '@astryxdesign/core/HStack'
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import { useMemo, useState } from 'react'
import { composeIconSvg, svgToDataUrl } from '../glass/compose'
import type { GlassStyle, Glyph } from '../glass/types'

interface PreviewProps {
  glyph: Glyph | null
  style: GlassStyle
}

type DockTone = 'dark' | 'light'

const PREVIEW_PIXEL_SIZE = 1024

interface SizeSample {
  caption: string
  pixels: number
  isMaskable: boolean
}

const sizeSamples: SizeSample[] = [
  { caption: '64', pixels: 64, isMaskable: false },
  { caption: '32', pixels: 32, isMaskable: false },
  { caption: 'maskable', pixels: 64, isMaskable: true },
]

export function Preview({ glyph, style }: PreviewProps) {
  const [dock, setDock] = useState<DockTone>('dark')
  const shaped = useMemo(
    () => svgToDataUrl(composeIconSvg(glyph, style, { fullBleed: false, safeZone: 1 }, PREVIEW_PIXEL_SIZE)),
    [glyph, style],
  )
  const maskable = useMemo(
    () => svgToDataUrl(composeIconSvg(glyph, style, { fullBleed: true, safeZone: 0.8 }, PREVIEW_PIXEL_SIZE)),
    [glyph, style],
  )

  return (
    <Card aria-label="Preview">
      <VStack gap={4} hAlign="center">
        <VStack gap={6} hAlign="center" padding={8} width="100%" className={`preview-dock preview-dock-${dock}`}>
          <img className="preview-main" src={shaped} alt="Icon preview" width="256" height="256" />
          <HStack gap={6} vAlign="end">
            {sizeSamples.map((sample) => (
              <VStack key={sample.caption} as="figure" gap={1.5} hAlign="center">
                <img
                  className={sample.isMaskable ? 'preview-maskable' : undefined}
                  src={sample.isMaskable ? maskable : shaped}
                  alt={sample.isMaskable ? 'Maskable preview' : `${sample.pixels} pixel preview`}
                  width={sample.pixels}
                  height={sample.pixels}
                />
                <Text as="span" type="supporting" className="preview-caption">
                  {sample.caption}
                </Text>
              </VStack>
            ))}
          </HStack>
        </VStack>
        <SegmentedControl label="Preview background" size="sm" value={dock} onChange={(value) => setDock(value as DockTone)}>
          <SegmentedControlItem value="dark" label="Dark" />
          <SegmentedControlItem value="light" label="Light" />
        </SegmentedControl>
      </VStack>
    </Card>
  )
}
