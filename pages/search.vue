<script setup lang="ts">
import type { ApiMeta, ArticleCard, AuthorRef, CategoryDetail, CategoryRef, VideoCard as VideoCardType } from '~/types'

/**
 * Search (§32).
 *
 * Search result pages are noindex,follow: they are useful to readers but would
 * otherwise flood the index with thousands of near-duplicate URLs.
 */

const { t, categoryName } = useLocale()
const route = useRoute()
const router = useRouter()
const api = useApi()

const term = ref(String(route.query.q ?? ''))
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

// Back/forward changes the query without remounting; keep the field in step.
watch(() => route.query.q, (q) => { term.value = String(q ?? '') })

// Emptying the field (backspace, or the field's own ✕) drops ?q= straight
// away rather than leaving results for a term that is no longer there.
// replace, not push: each cleared field is not a step worth going back to.
watch(term, (value) => {
  if (!value.trim() && route.query.q) {
    router.replace({ path: '/search', query: { ...route.query, q: undefined, page: undefined } })
  }
})

const { data: categories } = await useAsyncApi<CategoryDetail[]>('nav-categories', '/api/categories')

const hasQuery = computed(() => String(route.query.q ?? '').trim().length >= 2)

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * The month filter is ?year=&month= in the URL, the same as the archive, but
 * the API takes a date range. An explicit ?from=&to= still works for links
 * made before the filter existed.
 */
function dateRange() {
  const y = Number(route.query.year) || 0
  const m = Number(route.query.month) || 0
  if (!y) return { from: route.query.from, to: route.query.to }
  if (!m) return { from: `${y}-01-01`, to: `${y}-12-31` }
  const lastDay = new Date(y, m, 0).getDate()
  return { from: `${y}-${pad(m)}-01`, to: `${y}-${pad(m)}-${pad(lastDay)}` }
}

function searchQuery(p: number) {
  return {
    q: String(route.query.q ?? '').trim(), page: p, limit: 20,
    category: route.query.category, ...dateRange(),
  }
}

interface SearchResults {
  query: string
  articles: ArticleCard[]
  videos: VideoCardType[]
  authors: AuthorRef[]
  categories: CategoryRef[]
}

const { data, pending } = await useAsyncData(
  () => `search-${route.query.q}-${route.query.year}-${route.query.month}-${route.query.category}-${page.value}`,
  async () => {
    if (!hasQuery.value) return null
    const result = await api.list<SearchResults>('/api/search', searchQuery(page.value))
    return { ...result.data, meta: result.meta }
  },
  { watch: [() => route.query] },
)

// A new term keeps the month and section already chosen. An empty one clears
// the search instead of searching for nothing.
function submit(q: string) {
  router.push({ path: '/search', query: { ...route.query, q: q || undefined, page: undefined } })
}

const meta = computed<ApiMeta | undefined>(() => data.value?.meta)

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
    const result = await api.list<SearchResults>('/api/search', searchQuery(nextPage))
    return { data: result.data.articles ?? [], meta: result.meta }
  },
  { meta: meta.value },
)

// A new query is a new result set.
watch(meta, m => resetFeed(m), { immediate: true })

const allArticles = computed(() => [...(data.value?.articles ?? []), ...extraArticles.value])

useSiteSeo({
  title: route.query.q ? `${t('searchColon')} ${route.query.q}` : t('searchNews'),
  description: t('searchDesc'),
  path: '/search',
  robots: 'noindex, follow',
})
</script>

<template>
  <div class="container-content">
    <h1 class="text-kh-2xl font-bold">{{ t('search') }}</h1>

    <!-- The header's search icon focuses this field by id on this page
         rather than opening a second one. -->
    <SiteSearchForm v-model="term" input-id="page-search" class="mt-4 lg:max-w-2xl" @submit="submit" />

    <MonthSectionFilter v-if="hasQuery" :categories="categories ?? []" class="mt-3" />

    <div v-if="pending" class="py-12 text-center text-ink-muted">{{ t('searching') }}</div>

    <div v-else-if="!data" class="py-12 text-center text-kh-base text-ink-muted">
      {{ t('searchMinChars') }}
    </div>

    <template v-else>
      <p class="mt-6 text-sm text-ink-muted">
        {{ t('foundResults', { n: meta?.total ?? 0, q: data.query }) }}
      </p>

      <div class="mt-4 grid gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <ul v-if="allArticles.length" class="divide-y divide-line">
            <li v-for="article in allArticles" :key="article.id" v-reveal class="py-4 first:pt-0">
              <NewsCard :article="article" variant="list" show-time />
            </li>
          </ul>
          <p v-else class="py-12 text-center text-kh-base text-ink-muted">
            {{ t('noArticlesFound') }}
          </p>

          <div ref="sentinel" aria-hidden="true" />
          <InfiniteFooter
            v-if="allArticles.length"
            :loading="feedLoading"
            :has-more="feedHasMore"
            :failed="feedFailed"
            show-end
            @next="loadNextPage"
          />
        </div>

        <aside class="space-y-8">
          <section v-if="data.categories.length">
            <SectionHeading :title="t('inSections')" />
            <ul class="space-y-2">
              <li v-for="c in data.categories" :key="c.slug">
                <NuxtLink :to="`/category/${c.slug}`" class="text-kh-sm hover:text-brand">
                  {{ c.icon }} {{ categoryName(c) }}
                </NuxtLink>
              </li>
            </ul>
          </section>

          <section v-if="data.authors.length">
            <SectionHeading :title="t('authors')" />
            <ul class="space-y-2">
              <li v-for="a in data.authors" :key="a.slug">
                <NuxtLink :to="`/author/${a.slug}`" class="text-kh-sm hover:text-brand">{{ a.nameKh }}</NuxtLink>
              </li>
            </ul>
          </section>

          <section v-if="data.videos.length">
            <SectionHeading :title="t('inVideos')" />
            <div class="space-y-4">
              <VideoCard v-for="v in data.videos" :key="v.id" :video="v" />
            </div>
          </section>
        </aside>
      </div>
    </template>
  </div>
</template>
