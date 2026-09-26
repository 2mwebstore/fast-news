import type { ApiMeta, ApiResponse } from '~/types'

/**
 * Authenticated API client for the admin.
 *
 * On a 401 it transparently refreshes the access token once and replays the
 * request, so an editor mid-draft is not bounced to the login screen when a
 * 15-minute token expires.
 */
export function useAdminApi() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase

  async function request<T>(
    path: string,
    options: Record<string, unknown> = {},
    retrying = false,
  ): Promise<{ data: T; meta?: ApiMeta }> {
    const auth = useAuthStore()

    try {
      const response = await $fetch<ApiResponse<T>>(path, {
        baseURL: base,
        ...options,
        headers: {
          ...(options.headers as Record<string, string> | undefined),
          ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
        },
      })
      return { data: response.data, meta: response.meta }
    } catch (error: unknown) {
      const status = (error as { statusCode?: number; response?: { status?: number } })
        .statusCode ?? (error as { response?: { status?: number } }).response?.status

      if (status === 401 && !retrying && auth.refreshToken) {
        if (await auth.refresh()) return request<T>(path, options, true)
        auth.logout()
        await navigateTo('/admin/login')
      }
      throw error
    }
  }

  return {
    async get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
      return (await request<T>(path, { method: 'GET', query })).data
    },
    async list<T>(path: string, query?: Record<string, unknown>) {
      return request<T>(path, { method: 'GET', query })
    },
    async post<T>(path: string, body?: unknown): Promise<T> {
      return (await request<T>(path, { method: 'POST', body })).data
    },
    async put<T>(path: string, body?: unknown): Promise<T> {
      return (await request<T>(path, { method: 'PUT', body })).data
    },
    async patch<T>(path: string, body?: unknown): Promise<T> {
      return (await request<T>(path, { method: 'PATCH', body })).data
    },
    async del<T>(path: string): Promise<T> {
      return (await request<T>(path, { method: 'DELETE' })).data
    },
    /** Multipart upload; the browser sets the boundary, so no Content-Type here. */
    async upload<T>(path: string, form: FormData): Promise<T> {
      return (await request<T>(path, { method: 'POST', body: form })).data
    },
  }
}
