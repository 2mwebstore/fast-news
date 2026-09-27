/**
 * Serves the web app manifest with the name set in Admin → Settings, so an
 * installed app carries the current name rather than the one at build time.
 *
 * This replaced a static public/manifest.webmanifest. If the API is
 * unreachable the build-time names are used: an installable app with the old
 * name beats a manifest request that fails.
 */
interface SiteNames { nameEn?: string; nameKh?: string; taglineKh?: string }

/** Home-screen label: the name if it fits, else its initials ("CFN"). */
function shortName(name: string) {
  if (name.length <= 12) return name
  const initials = name.split(/\s+/).map(word => word[0] ?? '').join('').toUpperCase()
  return initials || name.slice(0, 12)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  let site: SiteNames = {}
  try {
    const response = await $fetch<{ data: SiteNames }>('/api/site', {
      baseURL: config.apiInternalBase,
      headers: { 'X-CFN-Client-IP': getRequestIP(event, { xForwardedFor: true }) || '' },
    })
    site = response.data ?? {}
  }
  catch {
    // Build-time names below.
  }

  const name = site.nameEn || config.public.siteName
  const nameKh = site.nameKh || config.public.siteNameKh

  setHeader(event, 'Content-Type', 'application/manifest+json; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return {
    name,
    short_name: shortName(name),
    description: site.taglineKh || `${nameKh} — ព័ត៌មានទាន់ហេតុការណ៍ពីកម្ពុជា និងពិភពលោក`,
    lang: 'km',
    dir: 'ltr',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FFFFFF',
    theme_color: '#1E3A8A',
    categories: ['news', 'magazines'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'ព័ត៌មានផ្ទាល់', short_name: 'Live', url: '/live' },
      { name: 'វីដេអូ', short_name: 'Video', url: '/video' },
      { name: 'ស្វែងរក', short_name: 'Search', url: '/search' },
    ],
  }
})
