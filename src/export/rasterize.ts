export async function rasterizeSvg(svg: string, size: number): Promise<Uint8Array> {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try {
    const image = await loadImage(url)
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) throw new Error('canvas 2d context unavailable')
    context.drawImage(image, 0, 0, size, size)
    const png = await new Promise<Blob>((resolvePng, rejectPng) => {
      canvas.toBlob((result) => {
        if (result) resolvePng(result)
        else rejectPng(new Error('png encoding failed'))
      }, 'image/png')
    })
    return new Uint8Array(await png.arrayBuffer())
  } finally {
    URL.revokeObjectURL(url)
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolveImage, rejectImage) => {
    const image = new Image()
    image.onload = () => resolveImage(image)
    image.onerror = () => rejectImage(new Error('svg image failed to load'))
    image.src = url
  })
}
