import type { SiteInfo } from '~/types'

/**
 * The site's identity — name and logo — as set in Admin → Settings, with the
 * runtime config as the fallback so a fresh install still has a name.
 *
 * plugins/site.ts loads it once per request; this only reads it.
 */
export function useSite() {
  const config = useRuntimeConfig()
  const { locale } = useLocale()
  const api = useApi()
  const info = useState<SiteInfo | null>('site-info', () => null)

  const nameEn = computed(() => info.value?.nameEn || config.public.siteName)
  const nameKh = computed(() => info.value?.nameKh || config.public.siteNameKh)
  /** The name in the reading language. */
  const name = computed(() => (locale.value === 'en' ? nameEn.value : nameKh.value))
  const logoUrl = computed(() => info.value?.logoUrl || '')
  const logoShowName = computed(() => Boolean(info.value?.logoShowName))

  /**
   * Re-reads the settings, e.g. after the admin saves them. The public
   * endpoint is cached for five minutes, so the request is made unique to get
   * past the browser's copy.
   */
  async function refresh() {
    info.value = await api.get<SiteInfo>('/api/site', { t: Date.now() })
  }

  return { info, nameEn, nameKh, name, logoUrl, logoShowName, refresh }
}
