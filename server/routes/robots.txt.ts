/**
 * Serves /robots.txt (§52).
 *
 * The API decides the contents, which is what keeps a staging deployment from
 * advertising itself to crawlers. If the API is unreachable the fallback
 * disallows everything: failing closed is the safe direction here — a
 * permissive fallback could get a broken deployment indexed.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  try {
    const body = await $fetch<string>('/robots.txt', {
      baseURL: config.apiInternalBase,
      responseType: 'text',
      // Attribute the fetch to the crawler that asked, not to this process.
      headers: { 'X-CFN-Client-IP': getRequestIP(event, { xForwardedFor: true }) || '' },
    })
    setHeader(event, 'Cache-Control', 'public, max-age=3600')
    return body
  } catch {
    setHeader(event, 'Cache-Control', 'public, max-age=60')
    return 'User-agent: *\nDisallow: /\n'
  }
})
