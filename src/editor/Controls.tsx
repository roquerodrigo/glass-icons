import { Card } from '@astryxdesign/core/Card'
import { HStack } from '@astryxdesign/core/HStack'
import { Slider } from '@astryxdesign/core/Slider'
import { Switch } from '@astryxdesign/core/Switch'
import { Text } from '@astryxdesign/core/Text'
import { ToggleButton } from '@astryxdesign/core/ToggleButton'
import { VStack } from '@astryxdesign/core/VStack'
import type { ReactNode } from 'react'
import { presets } from '../glass/presets'
import type { GlassStyle, GlyphMode, IconShape } from '../glass/types'
import { ColorField } from './ColorField'

interface ControlsProps {
  style: GlassStyle
  glyphMode: GlyphMode | null
  onChange: (style: GlassStyle) => void
  className?: string
}

const shapes: { id: IconShape; label: string }[] = [
  { id: 'squircle', label: 'Squircle' },
  { id: 'circle', label: 'Circle' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'square', label: 'Square' },
]

const formatPercent = (value: number) => `${Math.round(value * 100)}%`

function ControlGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <VStack gap={2}>
      <Text type="label" color="secondary">
        {title}
      </Text>
      {children}
    </VStack>
  )
}

export function Controls({ style, glyphMode, onChange, className }: ControlsProps) {
  const patch = (changes: Partial<GlassStyle>) => onChange({ ...style, ...changes })

  return (
    <Card aria-label="Style controls" className={className}>
      <VStack gap={5}>
        <ControlGroup title="Presets">
          <HStack gap={1} wrap="wrap">
            {presets.map((preset) => (
              <ToggleButton
                key={preset.name}
                label={preset.name}
                tooltip={preset.name}
                className="preset-button"
                isPressed={style.backgroundTop === preset.backgroundTop && style.backgroundBottom === preset.backgroundBottom}
                onPressedChange={() => patch({ backgroundTop: preset.backgroundTop, backgroundBottom: preset.backgroundBottom })}
              >
                <span
                  className="preset-swatch"
                  style={{ background: `linear-gradient(160deg, ${preset.backgroundTop}, ${preset.backgroundBottom})` }}
                />
              </ToggleButton>
            ))}
          </HStack>
        </ControlGroup>

        <ControlGroup title="Background">
          <HStack gap={4} wrap="wrap">
            <ColorField label="Top" value={style.backgroundTop} onChange={(backgroundTop) => patch({ backgroundTop })} />
            <ColorField label="Bottom" value={style.backgroundBottom} onChange={(backgroundBottom) => patch({ backgroundBottom })} />
          </HStack>
        </ControlGroup>

        <ControlGroup title="Glyph">
          {glyphMode === 'glass' ? (
            <ColorField label="Tint" value={style.glassTint} onChange={(glassTint) => patch({ glassTint })} />
          ) : (
            <ColorField label="Color" value={style.glyphColor} onChange={(glyphColor) => patch({ glyphColor })} />
          )}
          <Slider
            label="Size"
            min={0.35}
            max={0.8}
            step={0.01}
            value={style.glyphScale}
            formatValue={formatPercent}
            valueDisplay="text"
            onChange={(glyphScale: number) => patch({ glyphScale })}
          />
          <Switch
            label="Optical centering"
            description="Center by the glyph's visual mass instead of its bounding box"
            value={style.opticalAlignment}
            onChange={(opticalAlignment) => patch({ opticalAlignment })}
          />
        </ControlGroup>

        <ControlGroup title="Glass">
          <Slider
            label="Intensity"
            min={0}
            max={1}
            step={0.05}
            value={style.glassIntensity}
            formatValue={formatPercent}
            valueDisplay="text"
            onChange={(glassIntensity: number) => patch({ glassIntensity })}
          />
        </ControlGroup>

        <ControlGroup title="Shadow">
          <Slider
            label="Opacity"
            min={0}
            max={1}
            step={0.05}
            value={style.shadowOpacity}
            formatValue={formatPercent}
            valueDisplay="text"
            onChange={(shadowOpacity: number) => patch({ shadowOpacity })}
          />
          <Slider
            label="Blur"
            min={0}
            max={32}
            step={1}
            value={style.shadowBlur}
            formatValue={(value) => `${value}px`}
            valueDisplay="text"
            onChange={(shadowBlur: number) => patch({ shadowBlur })}
          />
        </ControlGroup>

        <ControlGroup title="Shape">
          <HStack gap={1} wrap="wrap" role="group" aria-label="Shape">
            {shapes.map((shape) => (
              <ToggleButton
                key={shape.id}
                label={shape.label}
                size="sm"
                isPressed={style.shape === shape.id}
                onPressedChange={() => patch({ shape: shape.id })}
              />
            ))}
          </HStack>
        </ControlGroup>
      </VStack>
    </Card>
  )
}
