import { defineStore } from 'pinia'
import type { UserRef } from '~/types/admin'

/**
 * Admin session store.
 *
 * Tokens are held in memory plus localStorage. This is an internal CMS behind
 * a login, not a public surface — but it does mean an XSS in the admin would
 * expose the token, which is why article HTML is sanitised server-side on
 * every save and never rendered unescaped in the editor's list views.
 */
const ACCESS_KEY = 'cfn.admin.access'
const REFRESH_KEY = 'cfn.admin.refresh'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<UserRef | null>(null)
  const ready = ref(false)

  const isAuthenticated = computed(() => Boolean(accessToken.value && user.value))

  function can(permission: string): boolean {
    return user.value?.permissions.includes(permission) ?? false
  }

  function persist() {
    try {
      if (accessToken.value) localStorage.setItem(ACCESS_KEY, accessToken.value)
      else localStorage.removeItem(ACCESS_KEY)
      if (refreshToken.value) localStorage.setItem(REFRESH_KEY, refreshToken.value)
      else localStorage.removeItem(REFRESH_KEY)
    } catch { /* private mode: the session simply will not survive a reload */ }
  }

  async function login(email: string, password: string) {
    const api = useApi()
    const result = await api.post<{
      tokens: { accessToken: string; refreshToken: string }
      user: UserRef
    }>('/api/auth/login', { email, password })

    accessToken.value = result.tokens.accessToken
    refreshToken.value = result.tokens.refreshToken
    user.value = result.user
    persist()
  }

  /** Restores a session from storage and re-validates it against the API. */
  async function restore() {
    if (ready.value) return
    try {
      accessToken.value = localStorage.getItem(ACCESS_KEY)
      refreshToken.value = localStorage.getItem(REFRESH_KEY)
    } catch { /* nothing stored */ }

    if (accessToken.value) {
      try {
        user.value = await useAdminApi().get<UserRef>('/api/auth/me')
      } catch {
        // The token is stale or revoked; try one refresh before giving up.
        if (!(await refresh())) logout()
      }
    }
    ready.value = true
  }

  /** Exchanges the refresh token for a new pair. Returns false when it fails. */
  async function refresh(): Promise<boolean> {
    if (!refreshToken.value) return false
    try {
      const api = useApi()
      const result = await api.post<{ tokens: { accessToken: string; refreshToken: string } }>(
        '/api/auth/refresh', { refreshToken: refreshToken.value },
      )
      accessToken.value = result.tokens.accessToken
      refreshToken.value = result.tokens.refreshToken
      persist()
      user.value = await useAdminApi().get<UserRef>('/api/auth/me')
      return true
    } catch {
      return false
    }
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    persist()
  }

  return { accessToken, refreshToken, user, ready, isAuthenticated, can, login, restore, refresh, logout }
})
