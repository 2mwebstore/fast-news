/**
 * Guards every /admin route.
 *
 * This is a convenience gate only — it keeps an unauthenticated editor from
 * seeing an empty shell. The real enforcement is server-side: every admin
 * endpoint checks the JWT and the caller's permissions (§66, §67).
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // The admin is client-rendered (routeRules), so there is nothing to do on
  // the server pass.
  if (import.meta.server) return
  if (to.path === '/admin/login') return

  const auth = useAuthStore()
  await auth.restore()

  if (!auth.isAuthenticated) {
    return navigateTo({ path: '/admin/login', query: { redirect: to.fullPath } })
  }
})
