import { Banner } from '@astryxdesign/core/Banner'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { Icon } from '@astryxdesign/core/Icon'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { VStack } from '@astryxdesign/core/VStack'
import { useState } from 'react'
import { buildAssetZip, downloadBlob } from '../export/exportZip'
import type { GlassStyle, Glyph } from '../glass/types'

interface ExportCardProps {
  glyph: Glyph | null
  style: GlassStyle
  iconName: string | null
}

const COPIED_FEEDBACK_MILLISECONDS = 2000

export function ExportCard({ glyph, style, iconName }: ExportCardProps) {
  const [appName, setAppName] = useState('My App')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MILLISECONDS)
  }

  const exportAssets = async () => {
    if (!glyph) return
    setError(null)
    try {
      const shortName = appName.trim().split(/\s+/)[0] || 'App'
      const zip = await buildAssetZip(glyph, style, {
        name: appName.trim() || 'My App',
        shortName,
        themeColor: style.backgroundBottom,
        backgroundColor: style.backgroundBottom,
      })
      downloadBlob(zip, `${iconName ?? 'icon'}-pwa-assets.zip`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'export failed')
    }
  }

  return (
    <Card aria-label="Export">
      <VStack gap={3}>
        <TextInput label="App name" value={appName} onChange={setAppName} />
        <Button
          label="Download PWA assets"
          variant="primary"
          size="lg"
          isDisabled={!glyph}
          clickAction={exportAssets}
        />
        <Button
          label={copied ? 'Link copied' : 'Copy share link'}
          icon={<Icon icon={copied ? 'checkDouble' : 'copy'} />}
          isDisabled={!glyph}
          clickAction={copyShareLink}
        />
        <Text type="supporting" color="secondary">
          ZIP with PNG icons (192, 512, maskable, apple touch), favicons + .ico, the composed SVG, a manifest.webmanifest and a
          head snippet.
        </Text>
        {!glyph && (
          <Text type="supporting" color="secondary">
            Pick an icon in the gallery to enable the export.
          </Text>
        )}
        {error && <Banner status="error" title="The export failed" description={error} />}
      </VStack>
    </Card>
  )
}
