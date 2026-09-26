/**
 * Service worker (§31).
 *
 * Deliberately conservative for a news site: HTML is always fetched from the
 * network first, because serving a cached copy of a breaking story would show
 * readers stale news. The cache exists to provide an offline shell and to make
 * static assets instant, not to serve old articles.
 */
const VERSION = 'cfn-v1'
const SHELL_CACHE = `${VERSION}-shell`
const ASSET_CACHE = `${VERSION}-assets`
const OFFLINE_URL = '/offline.html'

const SHELL_ASSETS = [OFFLINE_URL, '/manifest.webmanifest', '/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => !key.startsWith(VERSION)).map(key => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Never intercept Vite's dev endpoints. If this worker survives into a dev
  // session it must get out of the way rather than answer with a cached
  // production document whose asset hashes no longer exist.
  if (url.pathname.startsWith('/_nuxt/@')
    || url.pathname.startsWith('/@vite')
    || url.pathname.startsWith('/@id')
    || url.pathname.includes('?t=')) {
    return
  }

  // Never cache the API: breaking news must come from the network.
  if (url.pathname.startsWith('/api/')) return

  // Navigations: network first, offline page as the last resort.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then(cached => cached || Response.error()),
      ),
    )
    return
  }

  // Build assets are content-hashed and immutable, so cache-first is safe.
  if (url.pathname.startsWith('/_nuxt/') || /\.(css|js|woff2?|png|jpg|jpeg|webp|avif|svg)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(ASSET_CACHE).then(cache => cache.put(request, copy))
        }
        return response
      })),
    )
  }
})

// ── Web Push (§30) ──────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    return
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Cambodia Fast News', {
      body: payload.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      image: payload.image || undefined,
      tag: payload.tag || 'cfn-news',
      // Breaking alerts may re-notify; routine ones must not buzz twice.
      renotify: payload.topic === 'breaking',
      requireInteraction: false,
      data: { url: payload.url || '/' },
      lang: 'km',
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Reuse an open tab rather than piling up windows.
      for (const client of clients) {
        if (client.url.includes(target) && 'focus' in client) return client.focus()
      }
      return self.clients.openWindow(target)
    }),
  )
})
