import type { ApiMeta, ApiResponse } from '~/types'

/**
 * What $fetch will accept as a request body. Wider than this (`unknown`) does
 * not type-check against ofetch's own signature; narrower would reject a
 * FormData upload.
 */
type RequestBody = Record<string, unknown> | BodyInit | null

/**
 * useApi wraps $fetch with the API base URL and unwraps the standard
 * `{ success, data, meta }` envelope (§78) so callers work with the payload
 * directly.
 */
/**
 * On a server-rendered request, every API call originates from this Nitro
 * process rather than from the reader's browser. Without forwarding the real
 * address, the API would attribute every visitor's page render to one IP and
 * rate-limit the whole site as a single client.
 *
 * The API only believes this header from a trusted peer, so it cannot be
 * spoofed by a browser.
 */
function forwardedClientHeaders(): Record<string, string> {
  if (!import.meta.server) return {}

  const event = useRequestEvent()
  if (!event) return {}

  const headers = event.node.req.headers
  const forwardedFor = headers['x-forwarded-for']
  const ip =
    (headers['cf-connecting-ip'] as string | undefined)
    || (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0]?.trim()
    || event.node.req.socket?.remoteAddress
    || ''

  return ip ? { 'X-CFN-Client-IP': ip } : {}
}

export function useApi() {
  const config = useRuntimeConfig()

  // On the server, talk to the API over the internal network; in the browser,
  // use the public URL. In Docker those are different hosts.
  const base = import.meta.server
    ? config.apiInternalBase
    : config.public.apiBase

  async function request<T>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<{ data: T; meta?: ApiMeta }> {
    const response = await $fetch<ApiResponse<T>>(path, {
      baseURL: base,
      ...options,
      headers: {
        ...forwardedClientHeaders(),
        ...((options as { headers?: Record<string, string> }).headers ?? {}),
      },
    })
    return { data: response.data, meta: response.meta }
  }

  return {
    base,

    /** GET a resource, returning just its data. */
    async get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
      const { data } = await request<T>(path, { method: 'GET', query })
      return data
    },

    /** GET a list, returning data and pagination together. */
    async list<T>(path: string, query?: Record<string, unknown>) {
      return request<T>(path, { method: 'GET', query })
    },

    async post<T>(path: string, body?: RequestBody): Promise<T> {
      const { data } = await request<T>(path, { method: 'POST', body })
      return data
    },

    /**
     * Fire-and-forget beacon for analytics. Failures are swallowed: a dropped
     * view count must never surface as an error to the reader.
     */
    beacon(path: string, body?: RequestBody): void {
      if (import.meta.server) return
      $fetch(path, { baseURL: base, method: 'POST', body }).catch(() => {})
    },
  }
}

/**
 * useAsyncApi is the SSR-friendly fetch for page data. It keys the cache by
 * path plus query so two sections do not share a payload.
 */
export function useAsyncApi<T>(
  key: string,
  path: string,
  query?: Record<string, unknown>,
) {
  const api = useApi()
  return useAsyncData<T>(key, () => api.get<T>(path, query), {
    // A failed module should leave a gap, not blank the whole page.
    default: () => null as unknown as T,
  })
}

/**
 * Turns a failed page fetch into the right HTTP error.
 *
 * Only a genuine 404 from the API means the page is gone. Reporting a
 * rate-limited or failed request as 404 tells crawlers a live article has been
 * removed, which is how a working page gets dropped from the index — and it
 * hides the real fault from whoever is debugging.
 */
export function pageError(error: unknown, notFoundMessage: string) {
  const status = statusOf(error)

  if (status === 404) {
    return createError({ statusCode: 404, statusMessage: notFoundMessage, fatal: true })
  }
  if (status === 429) {
    return createError({
      statusCode: 429,
      statusMessage: 'Too many requests — please wait a moment and reload',
      fatal: true,
    })
  }
  return createError({
    statusCode: status && status >= 400 ? status : 500,
    statusMessage: 'This page could not be loaded',
    fatal: true,
  })
}

function statusOf(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined
  const e = error as { statusCode?: number; status?: number; response?: { status?: number } }
  return e.statusCode ?? e.status ?? e.response?.status
}
