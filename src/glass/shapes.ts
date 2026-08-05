import type { IconShape } from './types'

function superellipsePath(size: number, exponent: number, points: number): string {
  const radius = size / 2
  const center = size / 2
  const segments: string[] = []
  for (let index = 0; index < points; index += 1) {
    const angle = (index / points) * Math.PI * 2
    const cosine = Math.cos(angle)
    const sine = Math.sin(angle)
    const x = center + Math.sign(cosine) * Math.abs(cosine) ** (2 / exponent) * radius
    const y = center + Math.sign(sine) * Math.abs(sine) ** (2 / exponent) * radius
    segments.push(`${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return `${segments.join('')}Z`
}

function roundedRectPath(size: number, radius: number): string {
  const far = size - radius
  return [
    `M${radius},0`,
    `H${far}`,
    `A${radius},${radius} 0 0 1 ${size},${radius}`,
    `V${far}`,
    `A${radius},${radius} 0 0 1 ${far},${size}`,
    `H${radius}`,
    `A${radius},${radius} 0 0 1 0,${far}`,
    `V${radius}`,
    `A${radius},${radius} 0 0 1 ${radius},0`,
    'Z',
  ].join('')
}

export function shapePath(shape: IconShape, size: number): string {
  if (shape === 'squircle') return superellipsePath(size, 4.6, 256)
  if (shape === 'circle') return superellipsePath(size, 2, 128)
  if (shape === 'rounded') return roundedRectPath(size, size * 0.2)
  return `M0,0H${size}V${size}H0Z`
}
