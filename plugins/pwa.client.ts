/**
 * Service worker registration (§31).
 *
 * Registered only in production, and actively torn down in development.
 *
 * The worker caches hashed build assets. Those hashes change every build, so a
 * worker registered by a production run keeps answering requests on the same
 * origin when you later run `npm run dev` — serving a cached document that
 * points at asset files the dev server has never heard of. The result is a
 * white page that mysteriously "fixes itself" after `npm run build`, because
 * the build recreates files the stale cache is asking for.
 *
 * localhost is one origin for every mode, so dev has to clean up after
 * production rather than assume a separate scope.
 */
export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator)) return

  if (import.meta.dev) {
    // Remove anything a previous production run left behind, and drop its
    // caches, so dev is served by the dev server and nothing else.
    navigator.serviceWorker.getRegistrations()
      .then(async (registrations) => {
        if (!registrations.length) return
        await Promise.all(registrations.map(r => r.unregister()))

        if ('caches' in window) {
          const names = await caches.keys()
          await Promise.all(names.filter(n => n.startsWith('cfn-')).map(n => caches.delete(n)))
        }
        console.info('[cfn] Removed a service worker left over from a production build. Reload once.')
      })
      .catch(() => {
        // Nothing to clean up, or storage is blocked. Either way dev works.
      })
    return
  }

  // Register after load so the worker never competes with the first paint.
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      // A failed registration costs offline support and nothing else.
    })
  })
})
