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
  mode: 'stroke' | 'fill' | 'glass'
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
]

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

function namespaceIds(markup: string, prefix: string): string {
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  let result = markup
  for (const id of ids) {
    result = result.replaceAll(`id="${id}"`, `id="${prefix}_${id}"`).replaceAll(`url(#${id})`, `url(#${prefix}_${id})`)
  }
  return result
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
    const namespaced = namespaceIds(inner, name.replaceAll(/[^a-z0-9]/g, ''))
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
    writeGlyph(setId, name, normalizeGlyph(markup, mode))
    icons.push(title ? { set: setId, name, title } : { set: setId, name })
  }
  return icons
}

async function main(): Promise<void> {
  if (process.argv.includes('--if-missing') && existsSync(catalogPath)) return
  rmSync(outputRoot, { recursive: true, force: true })
  for (const set of sets) mkdirSync(join(outputRoot, set.id), { recursive: true })

  const nodeModules = join(projectRoot, 'node_modules')
  const icons: CatalogIcon[] = [
    ...(await buildIcons8()),
    ...buildFromDirectory('lucide', join(nodeModules, 'lucide-static', 'icons'), 'stroke'),
    ...buildFromDirectory('tabler', join(nodeModules, '@tabler', 'icons', 'icons', 'outline'), 'stroke'),
    ...buildFromDirectory('phosphor', join(nodeModules, '@phosphor-icons', 'core', 'assets', 'fill'), 'fill'),
    ...buildFromDirectory('heroicons', join(nodeModules, 'heroicons', '24', 'solid'), 'fill'),
    ...buildFromDirectory('simple', join(nodeModules, 'simple-icons', 'icons'), 'fill'),
  ]

  writeFileSync(catalogPath, JSON.stringify({ sets, icons }))
  for (const set of sets) {
    console.log(`${set.id}: ${icons.filter((icon) => icon.set === set.id).length} icons`)
  }
}

await main()
