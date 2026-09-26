<script setup lang="ts">
import type { ApiMeta, ArticleCard } from '~/types'

/** Author profile (§18), including Person structured data. */
const route = useRoute()
const config = useRuntimeConfig()
const api = useApi()

interface AuthorDetail {
  id: number; slug: string; nameKh: string; nameEn?: string
  title?: string; photoUrl?: string; bioKh?: string; bioEn?: string
  facebook?: string; telegram?: string; x?: string; articleCount: number
}

const slug = computed(() => String(route.params.slug))
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const { data, error } = await useAsyncData(
  () => `author-${slug.value}-${page.value}`,
  async () => {
    const result = await api.list<{ author: AuthorDetail; articles: ArticleCard[] }>(
      `/api/authors/${slug.value}`, { page: page.value, limit: 20 },
    )
    return { ...result.data, meta: result.meta }
  },
  { watch: [slug, page] },
)

if (error.value) throw pageError(error.value, 'Author not found')
if (!data.value?.author) {
  throw createError({ statusCode: 404, statusMessage: 'Author not found', fatal: true })
}

const author = computed(() => data.value!.author)
const articles = computed(() => data.value!.articles ?? [])
const meta = computed<ApiMeta | undefined>(() => data.value!.meta)

useSiteSeo({
  title: `${author.value.nameKh}${author.value.title ? ` — ${author.value.title}` : ''}`,
  description: author.value.bioKh || `អត្ថបទទាំងអស់ដោយ ${author.value.nameKh} នៅ Cambodia Fast News។`,
  path: `/author/${author.value.slug}`,
  image: author.value.photoUrl,
  robots: page.value > 1 ? 'noindex, follow' : undefined,
})

// Person schema. Only profiles that actually exist go into sameAs.
const profiles = computed(() =>
  [author.value.facebook, author.value.telegram, author.value.x].filter(Boolean) as string[],
)

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: author.value.nameKh,
  alternateName: author.value.nameEn || undefined,
  jobTitle: author.value.title || undefined,
  description: author.value.bioKh || undefined,
  image: author.value.photoUrl || undefined,
  url: `${config.public.siteUrl}/author/${author.value.slug}`,
  ...(profiles.value.length ? { sameAs: profiles.value } : {}),
  worksFor: { '@type': 'NewsMediaOrganization', name: config.public.siteName },
})
</script>

<template>
  <div class="container-content">
    <header class="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-start">
      <img
        v-if="author.photoUrl"
        :src="author.photoUrl" :alt="author.nameKh"
        width="96" height="96"
        class="h-24 w-24 shrink-0 rounded-full object-cover"
      >
      <div>
        <h1 class="text-kh-2xl font-bold">{{ author.nameKh }}</h1>
        <p v-if="author.title" class="mt-1 text-kh-base text-brand">{{ author.title }}</p>
        <p v-if="author.bioKh" class="mt-2 max-w-prose text-kh-base text-ink-muted khmer-wrap">
          {{ author.bioKh }}
        </p>
        <p class="mt-2 text-sm text-ink-muted">អត្ថបទ {{ author.articleCount }}</p>

        <ul v-if="profiles.length" class="mt-3 flex gap-3">
          <li v-for="profile in profiles" :key="profile">
            <a :href="profile" target="_blank" rel="noopener me" class="text-sm font-medium text-brand hover:underline">
              {{ profile.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] }}
            </a>
          </li>
        </ul>
      </div>
    </header>

    <div class="mt-6 grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <SectionHeading title="អត្ថបទចុងក្រោយ" />
        <ul class="divide-y divide-line">
          <li v-for="article in articles" :key="article.id" class="py-4 first:pt-0">
            <NewsCard :article="article" variant="list" show-time />
          </li>
        </ul>
        <Pagination v-if="meta" :meta="meta" :base-path="`/author/${slug}`" />
      </div>

      <aside class="space-y-8">
        <ArticleSidebarTrending />
      </aside>
    </div>
  </div>
</template>
