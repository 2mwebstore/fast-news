/** Serves /news-sitemap.xml from the site's own domain (§51). */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const xml = await $fetch<string>('/news-sitemap.xml', {
      baseURL: config.apiInternalBase,
      responseType: 'text',
      // Attribute the fetch to the crawler that asked, not to this process.
      headers: { 'X-CFN-Client-IP': getRequestIP(event, { xForwardedFor: true }) || '' },
    })

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    // Short TTL: Google re-crawls the news sitemap frequently and it must
    // reflect the last couple of hours of publishing.
    setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
    return xml
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'News sitemap temporarily unavailable' })
  }
})
