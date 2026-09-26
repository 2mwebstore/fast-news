<script setup lang="ts">
import type { ArticleCard, ApiMeta, CategoryDetail } from '~/types'

/** Category page (§13). */

const { t } = useLocale()
const route = useRoute()
const api = useApi()

const slug = computed(() => String(route.params.slug))
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

// Page size is adjustable but clamped: the API caps it at 60 anyway, and an
// unbounded value here would just produce a confusing mismatch.
const limit = computed(() => Math.min(60, Math.max(5, Number(route.query.limit) || 20)))

const { data, error } = await useAsyncData(
  () => `category-${slug.value}-${page.value}`,
  async () => {
    const result = await api.list<{ category: CategoryDetail; articles: ArticleCard[] }>(
      `/api/categories/${slug.value}`, { page: page.value, limit: limit.value },
    )
    return { ...result.data, meta: result.meta }
  },
  { watch: [slug, page, limit] },
)

if (error.value) throw pageError(error.value, 'Category not found')
if (!data.value?.category) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })
}

const category = computed(() => data.value!.category)
const articles = computed(() => data.value!.articles ?? [])
const meta = computed<ApiMeta | undefined>(() => data.value!.meta)

// Page 1 is server-rendered so the section is indexable and works without
// JavaScript; the feed only ever appends to it.
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
    const result = await api.list<{ category: CategoryDetail; articles: ArticleCard[] }>(
      `/api/categories/${slug.value}`, { page: nextPage, limit: limit.value },
    )
    return { data: result.data.articles ?? [], meta: result.meta }
  },
  { meta: meta.value },
)

// A different section is a different feed.
watch(meta, m => resetFeed(m), { immediate: true })

const allArticles = computed(() => [...articles.value, ...extraArticles.value])

useCategorySeo(category.value, page.value)
useBreadcrumbSchema([
  { name: t('home'), path: '/' },
  ...(category.value.parent
    ? [{ name: category.value.parent.nameKh, path: `/category/${category.value.parent.slug}` }]
    : []),
  { name: category.value.nameKh, path: `/category/${category.value.slug}` },
])
</script>

<template>
  <div class="container-content">
    <AdSlot position="CATEGORY_TOP" :category="slug" collapse-when-empty />

    <header class="border-b-2 border-brand pb-4" :style="category.color ? { borderColor: category.color } : undefined">
      <nav :aria-label="t('breadcrumb')" class="mb-2 flex items-center gap-1.5 text-xs text-ink-muted">
        <NuxtLink to="/" class="hover:text-brand">{{ t('home') }}</NuxtLink>
        <template v-if="category.parent">
          <span aria-hidden="true">›</span>
          <NuxtLink :to="`/category/${category.parent.slug}`" class="hover:text-brand">
            {{ category.parent.nameKh }}
          </NuxtLink>
        </template>
      </nav>

      <h1 class="flex items-center gap-2 text-kh-2xl font-bold sm:text-kh-3xl">
        <span v-if="category.icon" aria-hidden="true">{{ category.icon }}</span>
        {{ category.nameKh }}
      </h1>

      <p v-if="category.descKh" class="mt-2 max-w-prose text-kh-base text-ink-muted khmer-wrap">
        {{ category.descKh }}
      </p>

      <nav v-if="category.children?.length" class="mt-4 flex flex-wrap gap-2" :aria-label="t('subsections')">
        <NuxtLink
          v-for="child in category.children"
          :key="child.slug"
          :to="`/category/${child.slug}`"
          class="rounded-full border border-line px-3 py-1 text-kh-sm hover:border-brand hover:text-brand"
        >
          {{ child.nameKh }}
        </NuxtLink>
      </nav>
    </header>

    <div class="mt-6 grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <p v-if="!articles.length" class="py-12 text-center text-kh-base text-ink-muted">
          {{ t('noArticlesInSection') }}
        </p>

        <ul v-else class="divide-y divide-line">
          <li v-for="article in allArticles" :key="article.id" v-reveal class="py-4 first:pt-0">
            <NewsCard :article="article" variant="list" show-time />
          </li>
        </ul>

        <!-- The sentinel sits before the footer so the next page starts
             loading while the reader is still on the current one. -->
        <div ref="sentinel" aria-hidden="true" />
        <InfiniteFooter
          v-if="articles.length"
          :loading="feedLoading"
          :has-more="feedHasMore"
          :failed="feedFailed"
          show-end
          @next="loadNextPage"
        />
      </div>

      <aside class="space-y-8">
        <AdSlot position="CATEGORY_SIDEBAR" :category="slug" collapse-when-empty />
        <ArticleSidebarTrending />
        <NewsPulse />
      </aside>
    </div>
  </div>
</template>
