<script setup lang="ts">
import type { ApiMeta, ArticleCard, AuthorRef, CategoryRef, VideoCard as VideoCardType } from '~/types'

/**
 * Search (§32).
 *
 * Search result pages are noindex,follow: they are useful to readers but would
 * otherwise flood the index with thousands of near-duplicate URLs.
 */

const { t } = useLocale()
const route = useRoute()
const router = useRouter()
const api = useApi()

const term = ref(String(route.query.q ?? ''))
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

interface SearchResults {
  query: string
  articles: ArticleCard[]
  videos: VideoCardType[]
  authors: AuthorRef[]
  categories: CategoryRef[]
}

const { data, pending } = await useAsyncData(
  () => `search-${route.query.q}-${page.value}`,
  async () => {
    const q = String(route.query.q ?? '').trim()
    if (q.length < 2) return null
    const result = await api.list<SearchResults>('/api/search', {
      q, page: page.value, limit: 20,
      category: route.query.category, from: route.query.from, to: route.query.to,
    })
    return { ...result.data, meta: result.meta }
  },
  { watch: [() => route.query] },
)

function submit() {
  router.push({ path: '/search', query: { ...route.query, q: term.value.trim(), page: undefined } })
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
    const result = await api.list<SearchResults>('/api/search', {
      q: String(route.query.q ?? '').trim(), page: nextPage, limit: 20,
      category: route.query.category, from: route.query.from, to: route.query.to,
    })
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

    <form class="mt-4 flex gap-2" @submit.prevent="submit">
      <input
        v-model="term" type="search" name="q"
        :placeholder="t('searchKeyword')"
        class="w-full rounded-lg border border-line bg-surface-muted px-4 py-3 text-kh-base outline-none focus:border-brand"
      >
      <button type="submit" class="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
        {{ t('search') }}
      </button>
    </form>

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
                  {{ c.icon }} {{ c.nameKh }}
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
