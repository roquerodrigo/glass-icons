import { Field } from '@astryxdesign/core/Field'
import { HStack } from '@astryxdesign/core/HStack'
import { Slider } from '@astryxdesign/core/Slider'
import { Text } from '@astryxdesign/core/Text'
import { useId } from 'react'

interface ColorFieldProps {
  label: string
  value: string
  opacity: number
  onChange: (value: string) => void
  onOpacityChange: (opacity: number) => void
}

const formatPercent = (value: number) => `${Math.round(value * 100)}%`

export function ColorField({ label, value, opacity, onChange, onOpacityChange }: ColorFieldProps) {
  const inputId = useId()

  return (
    <Field label={label} inputID={inputId}>
      <HStack gap={3} vAlign="center">
        <span className="color-swatch">
          <span className="color-swatch-fill" style={{ background: value, opacity }} />
          <input id={inputId} type="color" value={value} onChange={(event) => onChange(event.target.value)} />
        </span>
        <Text type="code" color="secondary">
          {value.toUpperCase()}
        </Text>
        <Slider
          label={`${label} opacity`}
          isLabelHidden
          min={0}
          max={1}
          step={0.05}
          value={opacity}
          formatValue={formatPercent}
          valueDisplay="text"
          onChange={(nextOpacity: number) => onOpacityChange(nextOpacity)}
          containerClassName="color-opacity-slider"
        />
      </HStack>
    </Field>
  )
}
