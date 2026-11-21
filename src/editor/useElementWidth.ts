import { useLayoutEffect, useState, type RefObject } from 'react'

export function useElementWidth(elementRef: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const element = elementRef.current
    if (!element) return
    setWidth(element.clientWidth)
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [elementRef])

  return width
}
