import { Card } from '@astryxdesign/core/Card'
import { HStack } from '@astryxdesign/core/HStack'
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import { useMemo, useState } from 'react'
import { composeIconSvg, svgToDataUrl } from '../glass/compose'
import type { GlassStyle, Glyph, OutputVariant } from '../glass/types'
import { IconCanvas } from './IconCanvas'

interface PreviewProps {
  glyph: Glyph | null
  style: GlassStyle
}

type DockTone = 'dark' | 'light'

const MAIN_PREVIEW_SIZE = 256
const SHADOW_PIXEL_SIZE = 128

const shapedVariant: OutputVariant = { fullBleed: false, safeZone: 1 }
const maskableVariant: OutputVariant = { fullBleed: true, safeZone: 0.8 }

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
  const shadow = useMemo(
    () => svgToDataUrl(composeIconSvg(glyph, style, shapedVariant, SHADOW_PIXEL_SIZE)),
    [glyph, style],
  )

  return (
    <Card aria-label="Preview">
      <VStack gap={4} hAlign="center">
        <VStack gap={6} hAlign="center" padding={8} width="100%" className={`preview-dock preview-dock-${dock}`}>
          <span className="preview-main">
            <img className="preview-main-shadow" src={shadow} alt="" aria-hidden="true" />
            <IconCanvas glyph={glyph} style={style} variant={shapedVariant} size={MAIN_PREVIEW_SIZE} label="Icon preview" />
          </span>
          <HStack gap={6} vAlign="end">
            {sizeSamples.map((sample) => (
              <VStack key={sample.caption} as="figure" gap={1.5} hAlign="center">
                <IconCanvas
                  glyph={glyph}
                  style={style}
                  variant={sample.isMaskable ? maskableVariant : shapedVariant}
                  size={sample.pixels}
                  label={sample.isMaskable ? 'Maskable preview' : `${sample.pixels} pixel preview`}
                  className={sample.isMaskable ? 'preview-maskable' : undefined}
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
