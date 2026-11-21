import { Field } from '@astryxdesign/core/Field'
import { HStack } from '@astryxdesign/core/HStack'
import { Text } from '@astryxdesign/core/Text'
import { useId } from 'react'

interface ColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const inputId = useId()

  return (
    <Field label={label} inputID={inputId}>
      <HStack gap={2} vAlign="center">
        <span className="color-swatch" style={{ background: value }}>
          <input id={inputId} type="color" value={value} onChange={(event) => onChange(event.target.value)} />
        </span>
        <Text type="code" color="secondary">
          {value.toUpperCase()}
        </Text>
      </HStack>
    </Field>
  )
}
