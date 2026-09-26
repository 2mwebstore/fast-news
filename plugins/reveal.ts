/**
 * `v-reveal` — fades an element up as it scrolls into view.
 *
 * Registered universally, not client-only. A directive that exists solely on
 * the client is `undefined` during server rendering, and Vue fails the whole
 * render with "Cannot read properties of undefined (reading 'getSSRProps')".
 * The browser work is guarded instead, so the server sees a directive that
 * simply does nothing.
 *
 * One shared IntersectionObserver serves every element: on a forty-card feed
 * that is one observer rather than forty. Elements are unobserved once
 * revealed — re-animating on every scroll past is distracting when you are
 * trying to read.
 */
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null
  let reduced = false

  if (import.meta.client) {
    // Honour the OS setting: someone who asked for less motion gets the
    // content immediately, with no transform at all.
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!reduced && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            entry.target.classList.add('is-revealed')
            observer?.unobserve(entry.target)
          }
        },
        // Start the fade just before the element is fully on screen so it has
        // finished by the time the reader looks at it.
        { rootMargin: '0px 0px -40px 0px', threshold: 0.01 },
      )
    }
  }

  nuxtApp.vueApp.directive('reveal', {
    // getSSRProps must exist for server rendering; the effect is client-only.
    getSSRProps: () => ({}),

    mounted(el: HTMLElement) {
      if (reduced || !observer) {
        el.classList.add('is-revealed')
        return
      }
      el.classList.add('reveal')
      observer.observe(el)
    },

    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    },
  })
})
