/**
 * Serves /sitemap.xml from the site's own domain (§50).
 *
 * The XML is built by the API, which owns the data; this route proxies it so
 * the sitemap lives at the canonical host Search Console expects rather than
 * on the API subdomain.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const xml = await $fetch<string>('/sitemap.xml', {
      baseURL: config.apiInternalBase,
      responseType: 'text',
      // Attribute the fetch to the crawler that asked, not to this process.
      headers: { 'X-CFN-Client-IP': getRequestIP(event, { xForwardedFor: true }) || '' },
    })

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=1800, stale-while-revalidate=3600')
    return xml
  } catch {
    // Returning a 500 tells crawlers to retry, which is right — an empty but
    // valid sitemap would tell them we genuinely have no pages.
    throw createError({ statusCode: 503, statusMessage: 'Sitemap temporarily unavailable' })
  }
})
