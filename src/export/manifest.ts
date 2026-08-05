export interface AppIdentity {
  name: string
  shortName: string
  themeColor: string
  backgroundColor: string
}

export function buildManifest(identity: AppIdentity): string {
  return `${JSON.stringify(
    {
      name: identity.name,
      short_name: identity.shortName,
      start_url: '/',
      display: 'standalone',
      theme_color: identity.themeColor,
      background_color: identity.backgroundColor,
      icons: [
        { src: 'icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'icons/maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        { src: 'icons/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  )}\n`
}

export function buildHeadSnippet(identity: AppIdentity): string {
  return [
    '<link rel="icon" href="/favicon.ico" sizes="48x48">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">',
    '<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">',
    '<link rel="manifest" href="/manifest.webmanifest">',
    `<meta name="theme-color" content="${identity.themeColor}">`,
    '',
  ].join('\n')
}
