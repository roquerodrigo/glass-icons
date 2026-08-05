export interface IcoEntry {
  size: number
  png: Uint8Array
}

export function buildIco(entries: IcoEntry[]): Uint8Array {
  const headerSize = 6
  const directorySize = 16 * entries.length
  const totalSize = headerSize + directorySize + entries.reduce((sum, entry) => sum + entry.png.length, 0)
  const buffer = new Uint8Array(totalSize)
  const view = new DataView(buffer.buffer)

  view.setUint16(0, 0, true)
  view.setUint16(2, 1, true)
  view.setUint16(4, entries.length, true)

  let dataOffset = headerSize + directorySize
  entries.forEach((entry, index) => {
    const entryOffset = headerSize + index * 16
    view.setUint8(entryOffset, entry.size >= 256 ? 0 : entry.size)
    view.setUint8(entryOffset + 1, entry.size >= 256 ? 0 : entry.size)
    view.setUint8(entryOffset + 2, 0)
    view.setUint8(entryOffset + 3, 0)
    view.setUint16(entryOffset + 4, 1, true)
    view.setUint16(entryOffset + 6, 32, true)
    view.setUint32(entryOffset + 8, entry.png.length, true)
    view.setUint32(entryOffset + 12, dataOffset, true)
    buffer.set(entry.png, dataOffset)
    dataOffset += entry.png.length
  })

  return buffer
}
