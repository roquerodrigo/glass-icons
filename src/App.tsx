import { Banner } from '@astryxdesign/core/Banner'
import { Grid } from '@astryxdesign/core/Grid'
import { Heading } from '@astryxdesign/core/Heading'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryxdesign/core/Layout'
import { Spinner } from '@astryxdesign/core/Spinner'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { loadGlyph } from './catalog/glyphLoader'
import type { CatalogIcon } from './catalog/types'
import { useCatalog } from './catalog/useCatalog'
import { Controls } from './editor/Controls'
import { ExportCard } from './editor/ExportCard'
import { Gallery } from './editor/Gallery'
import { LicensesFooter } from './editor/LicensesFooter'
import { Preview } from './editor/Preview'
import type { GlassStyle, Glyph } from './glass/types'
import { readSharedState, syncUrl } from './share/urlState'

export default function App() {
  const { catalog, error } = useCatalog()
  const shared = useMemo(() => readSharedState(window.location.search), [])
  const [selected, setSelected] = useState<CatalogIcon | null>(null)
  const [glyph, setGlyph] = useState<Glyph | null>(null)
  const [glyphError, setGlyphError] = useState<string | null>(null)
  const [style, setStyle] = useState<GlassStyle>(shared.style)

  useEffect(() => {
    if (!catalog || selected) return
    const fromUrl = shared.icon
      ? catalog.icons.find((icon) => icon.set === shared.icon?.set && icon.name === shared.icon?.name)
      : undefined
    const initial =
      fromUrl ?? catalog.icons.find((icon) => icon.set === 'icons8-glass' && icon.name === 'rocket') ?? catalog.icons[0]
    setSelected(initial)
  }, [catalog, selected, shared])

  useEffect(() => {
    if (selected) syncUrl(selected, style)
  }, [selected, style])

  useEffect(() => {
    if (!catalog || !selected) return
    let cancelled = false
    setGlyphError(null)
    loadGlyph(selected, catalog)
      .then((loaded) => {
        if (!cancelled) setGlyph(loaded)
      })
      .catch((cause: Error) => {
        if (!cancelled) setGlyphError(cause.message)
      })
    return () => {
      cancelled = true
    }
  }, [catalog, selected])

  return (
    <Layout
      height="auto"
      className="workspace"
      style={{ '--ambient-top': style.backgroundTop, '--ambient-bottom': style.backgroundBottom } as React.CSSProperties}
      header={
        <LayoutHeader>
          <VStack gap={1}>
            <Heading level={1}>Glass Icons</Heading>
            <Text color="secondary">
              Turn any open licensed icon into a Liquid Glass app icon and download the full PWA asset kit.
            </Text>
          </VStack>
        </LayoutHeader>
      }
      footer={
        <LayoutFooter hasDivider>
          <LicensesFooter catalog={catalog} />
        </LayoutFooter>
      }
    >
      <LayoutContent isScrollable={false}>
        <VStack gap={4}>
          {error && (
            <Banner status="error" title="The icon catalog failed to load" description={`${error}. Reload the page to try again.`} />
          )}
          {glyphError && (
            <Banner status="error" title="The selected icon failed to load" description={`${glyphError}. Pick another one.`} />
          )}
          <Grid gap={5} align="start" className="workbench">
            {catalog ? (
              <Gallery catalog={catalog} selected={selected} onSelect={setSelected} className="workbench-gallery" />
            ) : (
              <VStack className="workbench-gallery" hAlign="center" padding={8}>
                <Spinner size="lg" label="Loading catalog…" />
              </VStack>
            )}
            <Preview glyph={glyph} style={style} className="workbench-preview" />
            <ExportCard glyph={glyph} style={style} iconName={selected?.name ?? null} className="workbench-export" />
            <Controls style={style} glyphMode={glyph?.mode ?? null} onChange={setStyle} className="workbench-controls" />
          </Grid>
        </VStack>
      </LayoutContent>
    </Layout>
  )
}
