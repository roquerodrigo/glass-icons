import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const projectRoot = resolve(import.meta.dirname, '..')
const outputRoot = join(projectRoot, 'public', 'icons')
const catalogPath = join(projectRoot, 'public', 'catalog.json')

interface IconSet {
  id: string
  label: string
  license: string
  source: string
  mode: 'stroke' | 'fill' | 'glass' | 'color'
}

interface CatalogIcon {
  set: string
  name: string
  title?: string
}

const sets: IconSet[] = [
  { id: 'icons8-glass', label: 'Icons8 Liquid Glass', license: 'MIT', source: 'https://github.com/icons8/liquid-glass-icons', mode: 'glass' },
  { id: 'lucide', label: 'Lucide', license: 'ISC', source: 'https://lucide.dev', mode: 'stroke' },
  { id: 'tabler', label: 'Tabler Icons', license: 'MIT', source: 'https://tabler.io/icons', mode: 'stroke' },
  { id: 'phosphor', label: 'Phosphor', license: 'MIT', source: 'https://phosphoricons.com', mode: 'fill' },
  { id: 'heroicons', label: 'Heroicons', license: 'MIT', source: 'https://heroicons.com', mode: 'fill' },
  { id: 'simple', label: 'Simple Icons', license: 'CC0-1.0', source: 'https://simpleicons.org', mode: 'fill' },
  { id: 'fluent-color', label: 'Fluent Color', license: 'MIT', source: 'https://github.com/microsoft/fluentui-system-icons', mode: 'color' },
  { id: 'fluent-emoji-flat', label: 'Fluent Emoji Flat', license: 'MIT', source: 'https://github.com/microsoft/fluentui-emoji', mode: 'color' },
  { id: 'fluent-emoji', label: 'Fluent Emoji 3D', license: 'MIT', source: 'https://github.com/microsoft/fluentui-emoji', mode: 'color' },
  { id: 'noto', label: 'Noto Emoji', license: 'Apache-2.0', source: 'https://github.com/googlefonts/noto-emoji', mode: 'color' },
  { id: 'noto-v1', label: 'Noto Emoji v1', license: 'Apache-2.0', source: 'https://github.com/googlefonts/noto-emoji', mode: 'color' },
  { id: 'flat-color-icons', label: 'Flat Color Icons', license: 'MIT', source: 'https://github.com/icons8/flat-color-icons', mode: 'color' },
  { id: 'glyphs-poly', label: 'Glyphs Poly', license: 'MIT', source: 'https://github.com/gorango/glyphs', mode: 'color' },
  { id: 'icon-park', label: 'IconPark', license: 'Apache-2.0', source: 'https://github.com/bytedance/IconPark', mode: 'color' },
  { id: 'meteocons', label: 'Meteocons', license: 'MIT', source: 'https://github.com/basmilius/meteocons', mode: 'color' },
  { id: 'flat-ui', label: 'Flat UI', license: 'MIT', source: 'https://github.com/designmodo/Flat-UI', mode: 'color' },
]

interface IconifyIcon {
  body: string
  width?: number
  height?: number
  left?: number
  top?: number
  hidden?: boolean
}

interface IconifyCollection {
  icons: Record<string, IconifyIcon>
  width?: number
  height?: number
  left?: number
  top?: number
}

const ICONIFY_DEFAULT_SIZE = 16

const presentationAttributes = new Set([
  'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'fill-rule', 'clip-rule', 'opacity',
])

function parseRootSvg(markup: string): { attributes: Map<string, string>; inner: string } {
  const match = markup.match(/<svg([^>]*)>([\s\S]*)<\/svg>\s*$/)
  if (!match) throw new Error('markup is not a single <svg> element')
  const attributes = new Map<string, string>()
  for (const attribute of match[1].matchAll(/([\w:-]+)="([^"]*)"/g)) {
    attributes.set(attribute[1], attribute[2])
  }
  return { attributes, inner: match[2].trim() }
}

function normalizeGlyph(markup: string, mode: IconSet['mode']): string {
  const { attributes, inner } = parseRootSvg(markup)
  const viewBox = attributes.get('viewBox')
  if (!viewBox) throw new Error('glyph has no viewBox')
  const wrapper: string[] = []
  for (const [name, value] of attributes) {
    if (presentationAttributes.has(name)) wrapper.push(`${name}="${value}"`)
  }
  const hasPaint = attributes.has('fill') || attributes.has('stroke')
  if (mode === 'fill' && !hasPaint) wrapper.push('fill="currentColor"')
  const innerWithoutTitle = inner.replace(/<title>[\s\S]*?<\/title>/, '').trim()
  const body = wrapper.length > 0 ? `<g ${wrapper.join(' ')}>${innerWithoutTitle}</g>` : innerWithoutTitle
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`
}

function namespaceReferences(markup: string, prefix: string): string {
  const ids = new Set([...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]))
  if (ids.size === 0) return markup
  const rename = (id: string) => `${prefix}-${id}`
  return markup
    .replace(/\bid="([^"]+)"/g, (_, id: string) => `id="${rename(id)}"`)
    .replace(/url\(#([^)]+)\)/g, (match, id: string) => (ids.has(id) ? `url(#${rename(id)})` : match))
    .replace(/href="#([^"]+)"/g, (match, id: string) => (ids.has(id) ? `href="#${rename(id)}"` : match))
}

function referencePrefix(setId: string, name: string): string {
  return `${setId}-${name}`.replaceAll(/[^A-Za-z0-9-]/g, '')
}

function writeGlyph(setId: string, name: string, markup: string): void {
  writeFileSync(join(outputRoot, setId, `${name}.svg`), markup)
}

function extractTitle(markup: string): string | undefined {
  return markup.match(/<title>([\s\S]*?)<\/title>/)?.[1]
}

async function buildIcons8(): Promise<CatalogIcon[]> {
  const vendorDirectory = join(projectRoot, 'vendor', 'icons8-liquid-glass')
  const icons: CatalogIcon[] = []
  for (const file of readdirSync(vendorDirectory).filter((entry) => entry.endsWith('.tsx')).sort()) {
    const name = file.replace(/\.tsx$/, '').toLowerCase()
    const componentModule = await import(join(vendorDirectory, file))
    const markup = renderToStaticMarkup(createElement(componentModule.default))
    const { attributes, inner } = parseRootSvg(markup)
    const viewBox = attributes.get('viewBox')
    if (!viewBox) throw new Error(`icons8 glyph ${name} has no viewBox`)
    const namespaced = namespaceReferences(inner, referencePrefix('icons8-glass', name))
    writeGlyph('icons8-glass', name, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${namespaced}</svg>`)
    icons.push({ set: 'icons8-glass', name })
  }
  return icons
}

function buildFromDirectory(setId: string, directory: string, mode: IconSet['mode']): CatalogIcon[] {
  const icons: CatalogIcon[] = []
  for (const file of readdirSync(directory).filter((entry) => entry.endsWith('.svg')).sort()) {
    const name = file.replace(/\.svg$/, '')
    const markup = readFileSync(join(directory, file), 'utf8')
    const title = extractTitle(markup)
    const normalized = normalizeGlyph(markup, mode)
    writeGlyph(setId, name, mode === 'color' ? namespaceReferences(normalized, referencePrefix(setId, name)) : normalized)
    icons.push(title ? { set: setId, name, title } : { set: setId, name })
  }
  return icons
}

function buildFromIconify(setId: string, collectionPath: string): CatalogIcon[] {
  const collection = JSON.parse(readFileSync(collectionPath, 'utf8')) as IconifyCollection
  const icons: CatalogIcon[] = []
  const entries = Object.entries(collection.icons).sort(([first], [second]) => first.localeCompare(second))
  for (const [name, icon] of entries) {
    if (icon.hidden) continue
    const left = icon.left ?? collection.left ?? 0
    const top = icon.top ?? collection.top ?? 0
    const width = icon.width ?? collection.width ?? ICONIFY_DEFAULT_SIZE
    const height = icon.height ?? collection.height ?? ICONIFY_DEFAULT_SIZE
    const body = namespaceReferences(icon.body.replaceAll('xlink:href=', 'href='), referencePrefix(setId, name))
    writeGlyph(setId, name, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left} ${top} ${width} ${height}">${body}</svg>`)
    icons.push({ set: setId, name })
  }
  return icons
}

async function main(): Promise<void> {
  if (process.argv.includes('--if-missing') && existsSync(catalogPath)) return
  rmSync(outputRoot, { recursive: true, force: true })
  for (const set of sets) mkdirSync(join(outputRoot, set.id), { recursive: true })

  const nodeModules = join(projectRoot, 'node_modules')
  const iconifyCollection = (prefix: string) => join(nodeModules, '@iconify-json', prefix, 'icons.json')
  const icons: CatalogIcon[] = [
    ...(await buildIcons8()),
    ...buildFromDirectory('lucide', join(nodeModules, 'lucide-static', 'icons'), 'stroke'),
    ...buildFromDirectory('tabler', join(nodeModules, '@tabler', 'icons', 'icons', 'outline'), 'stroke'),
    ...buildFromDirectory('phosphor', join(nodeModules, '@phosphor-icons', 'core', 'assets', 'fill'), 'fill'),
    ...buildFromDirectory('heroicons', join(nodeModules, 'heroicons', '24', 'solid'), 'fill'),
    ...buildFromDirectory('simple', join(nodeModules, 'simple-icons', 'icons'), 'fill'),
    ...buildFromIconify('fluent-color', iconifyCollection('fluent-color')),
    ...buildFromIconify('fluent-emoji-flat', iconifyCollection('fluent-emoji-flat')),
    ...buildFromIconify('fluent-emoji', iconifyCollection('fluent-emoji')),
    ...buildFromIconify('noto', iconifyCollection('noto')),
    ...buildFromIconify('noto-v1', iconifyCollection('noto-v1')),
    ...buildFromIconify('flat-color-icons', iconifyCollection('flat-color-icons')),
    ...buildFromIconify('glyphs-poly', iconifyCollection('glyphs-poly')),
    ...buildFromIconify('icon-park', iconifyCollection('icon-park')),
    ...buildFromDirectory('meteocons', join(nodeModules, '@meteocons', 'svg-static', 'fill'), 'color'),
    ...buildFromIconify('flat-ui', iconifyCollection('flat-ui')),
  ]

  writeFileSync(catalogPath, JSON.stringify({ sets, icons }))
  for (const set of sets) {
    console.log(`${set.id}: ${icons.filter((icon) => icon.set === set.id).length} icons`)
  }
}

await main()
