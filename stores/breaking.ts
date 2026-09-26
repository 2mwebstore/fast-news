import { defineStore } from 'pinia'
import type { ArticleCard, BreakingPayload } from '~/types'

/**
 * The breaking-news store is the single source for the red bar and /live.
 * Both the initial SSR fetch and the WebSocket push write here.
 */
export const useBreakingStore = defineStore('breaking', () => {
  const items = ref<ArticleCard[]>([])
  const hasNewArticles = ref(false)
  const lastUpdated = ref<Date | null>(null)

  const hasBreaking = computed(() => items.value.length > 0)
  const headline = computed(() => items.value[0] ?? null)

  function setItems(next: ArticleCard[]) {
    items.value = next
    lastUpdated.value = new Date()
  }

  /**
   * pushBreaking prepends a pushed alert. If the article is already in the
   * list it is moved to the front and updated rather than duplicated.
   */
  function pushBreaking(payload: BreakingPayload) {
    const card: ArticleCard = {
      id: payload.id,
      slug: payload.slug,
      titleKh: payload.titleKh,
      titleEn: payload.titleEn,
      summaryKh: payload.summaryKh,
      imageUrl: payload.imageUrl,
      category: payload.category
        ? { id: 0, slug: '', nameKh: payload.category, nameEn: payload.category }
        : undefined,
      isBreaking: true,
      isFeatured: false,
      publishedAt: payload.publishedAt,
      readingMinutes: 1,
      viewCount: 0,
      contentType: 'editorial',
    }

    items.value = [card, ...items.value.filter(item => item.id !== card.id)].slice(0, 12)
    lastUpdated.value = new Date()
  }

  function markNewArticles() {
    hasNewArticles.value = true
  }

  function clearNewArticles() {
    hasNewArticles.value = false
  }

  /** Re-reads the breaking list from the API. */
  async function refresh() {
    try {
      const api = useApi()
      setItems(await api.get<ArticleCard[]>('/api/breaking'))
    } catch {
      // Keep whatever is already on screen; a failed refresh should not blank
      // the bar.
    }
  }

  return {
    items, hasNewArticles, lastUpdated,
    hasBreaking, headline,
    setItems, pushBreaking, markNewArticles, clearNewArticles, refresh,
  }
})
