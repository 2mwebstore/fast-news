import type { ApiMeta } from '~/types'

interface Page<T> {
  data: T[]
  meta?: ApiMeta
}

// Named usePagedFeed rather than useInfiniteScroll: VueUse auto-imports a
// composable by that name, and shadowing it would silently break any other
// component that expects the VueUse one.

/**
 * Appends further pages as the reader reaches the bottom.
 *
 * Page 1 is rendered on the server so the feed is indexable and usable without
 * JavaScript; this only ever *adds* to it. The sentinel sits well above the
 * fold of the next screen so the next page is already arriving by the time the
 * reader gets there.
 *
 * The visible "load more" button is not a fallback afterthought — it is the
 * control, and the sentinel simply presses it. That keeps the feed reachable
 * by keyboard and by anyone whose browser never fires the observer.
 */
export function usePagedFeed<T>(
  loadPage: (page: number) => Promise<Page<T>>,
  initial: { meta?: ApiMeta | null },
) {
  const extra = ref([]) as Ref<T[]>
  const page = ref(initial.meta?.page ?? 1)
  const hasMore = ref(initial.meta?.hasMore ?? false)
  const total = ref(initial.meta?.total ?? 0)
  const loading = ref(false)
  const failed = ref(false)
  const sentinel = ref<HTMLElement | null>(null)

  async function next() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    failed.value = false
    try {
      const result = await loadPage(page.value + 1)
      extra.value.push(...result.data)
      page.value += 1
      hasMore.value = result.meta?.hasMore ?? false
      if (result.meta?.total) total.value = result.meta.total
    } catch {
      // Surface a retry rather than silently stopping: a reader who hit a
      // rate limit or a dropped connection should be able to try again.
      failed.value = true
      hasMore.value = true
    } finally {
      loading.value = false
    }
  }

  useIntersectionObserver(
    sentinel,
    ([entry]) => { if (entry?.isIntersecting && !failed.value) next() },
    { rootMargin: '600px 0px' },
  )

  /** Re-seeds when the underlying query changes (new category, new search). */
  function reset(meta?: ApiMeta | null) {
    extra.value = []
    page.value = meta?.page ?? 1
    hasMore.value = meta?.hasMore ?? false
    total.value = meta?.total ?? 0
    failed.value = false
  }

  return { extra, page, hasMore, total, loading, failed, sentinel, next, reset }
}
