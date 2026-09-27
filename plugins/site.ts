import type { SiteInfo } from '~/types'

/**
 * Loads the site's name, logo and footer details (Admin → Settings) before
 * anything renders. The header, footer, page titles and structured data all
 * read them, so they have to be there before the first of those runs.
 *
 * On a server-rendered page the state travels in the payload, so the browser
 * does not fetch it a second time on hydration.
 */
export default defineNuxtPlugin(async () => {
  const site = useState<SiteInfo | null>('site-info', () => null)
  if (site.value) return

  try {
    site.value = await useApi().get<SiteInfo>('/api/site')
  }
  catch {
    // The runtime config defaults apply: the site still has a name and mark.
  }
})
