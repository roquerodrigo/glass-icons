import { useLayoutEffect, useState, type RefObject } from 'react'

export interface RowRange {
  start: number
  end: number
}

export function useVisibleRows(
  viewportRef: RefObject<HTMLElement | null>,
  rowHeight: number,
  rowCount: number,
  overscanRows: number,
): RowRange {
  const [range, setRange] = useState<RowRange>({ start: 0, end: 0 })

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || rowHeight <= 0) return
    const update = () => {
      const start = Math.max(0, Math.floor(viewport.scrollTop / rowHeight) - overscanRows)
      const end = Math.min(rowCount, Math.ceil((viewport.scrollTop + viewport.clientHeight) / rowHeight) + overscanRows)
      setRange((current) => (current.start === start && current.end === end ? current : { start, end }))
    }
    update()
    viewport.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(viewport)
    return () => {
      viewport.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [viewportRef, rowHeight, rowCount, overscanRows])

  return range
}
