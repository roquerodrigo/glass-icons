import { useEffect, useRef } from 'react'
import { drawSvgOnCanvas } from '../export/rasterize'
import { composeIconSvg } from '../glass/compose'
import type { GlassStyle, Glyph, OutputVariant } from '../glass/types'

interface IconCanvasProps {
  glyph: Glyph | null
  style: GlassStyle
  variant: OutputVariant
  size: number
  label: string
  className?: string
}

export function IconCanvas({ glyph, style, variant, size, label, className }: IconCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelSize = Math.round(size * (window.devicePixelRatio || 1))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    const svg = composeIconSvg(glyph, style, variant, pixelSize)
    const offscreen = document.createElement('canvas')
    offscreen.width = pixelSize
    offscreen.height = pixelSize
    drawSvgOnCanvas(svg, offscreen)
      .then(() => {
        if (cancelled) return
        const context = canvas.getContext('2d')
        context?.clearRect(0, 0, pixelSize, pixelSize)
        context?.drawImage(offscreen, 0, 0)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [glyph, style, variant, pixelSize])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      width={pixelSize}
      height={pixelSize}
      className={className ? `icon-canvas ${className}` : 'icon-canvas'}
      style={{ '--icon-size': `${size}px` } as React.CSSProperties}
    />
  )
}
