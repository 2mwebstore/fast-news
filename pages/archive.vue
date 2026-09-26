<script setup lang="ts">
import { MONTH_NAMES } from '~/composables/useLocale'
import type { ApiMeta, ArticleCard, CategoryDetail } from '~/types'

/**
 * Archive (§33).
 *
 * A month with nothing in it is noindexed: an empty archive page is exactly
 * the thin content §33 warns against.
 */

const { t, locale } = useLocale()
const route = useRoute()
const api = useApi()

const year = computed(() => Number(route.query.year) || 0)
const month = computed(() => Number(route.query.month) || 0)
const category = computed(() => String(route.query.category ?? ''))
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const limit = computed(() => Math.min(60, Math.max(5, Number(route.query.limit) || 30)))

const { data } = await useAsyncData(
  () => `archive-${year.value}-${month.value}-${category.value}-${page.value}`,
  async () => {
    const result = await api.list<ArticleCard[]>('/api/archive', {
      year: year.value || undefined, month: month.value || undefined,
      category: category.value || undefined, page: page.value, limit: limit.value,
    })
    return { articles: result.data, meta: result.meta }
  },
  { watch: [() => route.query] },
)

const { data: categories } = await useAsyncApi<CategoryDetail[]>('nav-categories', '/api/categories')

const articles = computed(() => data.value?.articles ?? [])
const meta = computed<ApiMeta | undefined>(() => data.value?.meta)

// Page 1 is server-rendered; the feed appends the rest as the reader scrolls.
const {
  extra: extraArticles,
  loading: feedLoading,
  hasMore: feedHasMore,
  failed: feedFailed,
  sentinel,
  next: loadNextPage,
  reset: resetFeed,
} = usePagedFeed<ArticleCard>(
  async (nextPage) => {
    const result = await api.list<ArticleCard[]>('/api/archive', {
      year: year.value || undefined, month: month.value || undefined,
      category: category.value || undefined, page: nextPage, limit: limit.value,
    })
    return { data: result.data ?? [], meta: result.meta }
  },
  { meta: meta.value },
)

// Changing month or section is a different archive.
watch(meta, m => resetFeed(m), { immediate: true })

const allArticles = computed(() => [...articles.value, ...extraArticles.value])

const monthNames = computed(() => MONTH_NAMES[locale.value])

const now = new Date()
const currentYear = now.getFullYear()

/**
 * Which year's months the picker is showing. The current year by default, so a
 * reader opening the archive sees this year rather than a rolling window that
 * started two years ago.
 *
 * It follows ?year= when one is set, so a link to an older month still lands on
 * that month's own year rather than resetting to now.
 */
const listedYear = computed(() => year.value || currentYear)

// The site launched in 2025; there is nothing older to offer.
const FIRST_YEAR = 2025
const years = computed(() => {
  const out: number[] = []
  for (let y = currentYear; y >= FIRST_YEAR; y -= 1) out.push(y)
  return out
})

// Newest month first, and never a month that has not happened yet — a future
// month can only ever be an empty page.
const months = computed(() => {
  const lastMonth = listedYear.value === currentYear ? now.getMonth() + 1 : 12
  return Array.from({ length: lastMonth }, (_, i) => {
    const monthNumber = lastMonth - i
    return {
      year: listedYear.value,
      month: monthNumber,
      label: `${monthNames.value[monthNumber - 1]} ${listedYear.value}`,
    }
  })
})

const hasContent = computed(() => articles.value.length > 0)

useSiteSeo({
  title: year.value
    ? t('archiveFor', { month: monthNames.value[month.value - 1] ?? '', year: year.value })
    : t('archiveTitle'),
  description: t('archiveDesc'),
  path: '/archive',
  robots: hasContent.value && page.value === 1 ? undefined : 'noindex, follow',
})
</script>

<template>
  <div class="container-content">
    <h1 class="text-kh-2xl font-bold">{{ t('archiveTitle') }}</h1>

    <div class="mt-6 grid gap-8 lg:grid-cols-4">
      <aside class="lg:col-span-1">
        <SectionHeading :title="t('byMonth')" />

        <!-- Year switcher, shown only once there is more than one year of
             archive to choose between. -->
        <div v-if="years.length > 1" class="mb-2 flex flex-wrap gap-1">
          <NuxtLink
            v-for="y in years"
            :key="y"
            :to="{ path: '/archive', query: { year: y, category: category || undefined } }"
            :class="[
              'rounded px-2 py-1 text-xs font-semibold',
              listedYear === y ? 'bg-brand text-white' : 'border border-line hover:border-brand',
            ]"
          >{{ y }}</NuxtLink>
        </div>

        <ul class="max-h-80 space-y-1 overflow-y-auto pr-2">
          <li v-for="m in months" :key="`${m.year}-${m.month}`">
            <NuxtLink
              :to="{ path: '/archive', query: { year: m.year, month: m.month, category: category || undefined } }"
              :class="[
                'block rounded px-2 py-1.5 text-kh-sm',
                year === m.year && month === m.month ? 'bg-brand text-white' : 'hover:bg-surface-muted',
              ]"
            >
              {{ m.label }}
            </NuxtLink>
          </li>
        </ul>

        <SectionHeading :title="t('bySection')" class="mt-6" />
        <ul class="space-y-1">
          <li>
            <NuxtLink
              :to="{ path: '/archive', query: { year: year || undefined, month: month || undefined } }"
              :class="['block rounded px-2 py-1.5 text-kh-sm', !category ? 'bg-brand text-white' : 'hover:bg-surface-muted']"
            >{{ t('all') }}</NuxtLink>
          </li>
          <li v-for="c in categories ?? []" :key="c.slug">
            <NuxtLink
              :to="{ path: '/archive', query: { year: year || undefined, month: month || undefined, category: c.slug } }"
              :class="['block rounded px-2 py-1.5 text-kh-sm', category === c.slug ? 'bg-brand text-white' : 'hover:bg-surface-muted']"
            >{{ c.nameKh }}</NuxtLink>
          </li>
        </ul>
      </aside>

      <div class="lg:col-span-3">
        <p v-if="!hasContent" class="py-12 text-center text-kh-base text-ink-muted">
          {{ t('noArticlesForSelection') }}
        </p>

        <ul v-else class="divide-y divide-line">
          <li v-for="article in allArticles" :key="article.id" v-reveal class="py-4 first:pt-0">
            <NewsCard :article="article" variant="list" show-time />
          </li>
        </ul>

        <div ref="sentinel" aria-hidden="true" />
        <InfiniteFooter
          v-if="hasContent"
          :loading="feedLoading"
          :has-more="feedHasMore"
          :failed="feedFailed"
          show-end
          @next="loadNextPage"
        />
      </div>
    </div>
  </div>
</template>
