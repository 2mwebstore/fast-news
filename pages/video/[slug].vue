<script setup lang="ts">
import type { VideoCard as VideoCardType } from '~/types'

/** Video detail (§26) with VideoObject structured data. */
const route = useRoute()
const config = useRuntimeConfig()
const api = useApi()
const { duration, dateTime, compact } = useFormat()
const { t, title: localTitle, locale } = useLocale()

const slug = computed(() => String(route.params.slug))

const { data: video, error } = await useAsyncData(
  () => `video-${slug.value}`,
  () => api.get<VideoCardType>(`/api/video/${slug.value}`),
  { watch: [slug] },
)

if (error.value) throw pageError(error.value, 'Video not found')
if (!video.value) {
  throw createError({ statusCode: 404, statusMessage: 'Video not found', fatal: true })
}

const { data: more } = await useAsyncApi<VideoCardType[]>('video-more', '/api/video', { limit: 6 })

// Editor overrides win; the video's own title and description are the fallback,
// which is what most videos will use.
const seo = video.value.seo
useSiteSeo({
  title: seo?.seoTitle || video.value.titleKh,
  description: seo?.seoDescription || video.value.descKh || video.value.titleKh,
  path: `/video/${video.value.slug}`,
  image: seo?.ogImage || video.value.thumbnailUrl,
  type: 'article',
  canonical: seo?.canonicalUrl || undefined,
  keywords: seo?.seoKeywords?.length ? seo.seoKeywords : undefined,
  robots: seo?.robots || undefined,
  ogTitle: seo?.ogTitle || undefined,
  ogDescription: seo?.ogDescription || undefined,
  twitterTitle: seo?.twitterTitle || undefined,
  twitterDescription: seo?.twitterDescription || undefined,
  twitterImage: seo?.twitterImage || undefined,
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: seo?.seoTitle || video.value.titleKh,
  description: seo?.seoDescription || video.value.descKh || video.value.titleKh,
  thumbnailUrl: video.value.thumbnailUrl || undefined,
  uploadDate: video.value.publishedAt || undefined,
  // ISO 8601 duration, which is what Google expects here.
  duration: video.value.durationSec ? `PT${video.value.durationSec}S` : undefined,
  contentUrl: video.value.watchUrl || video.value.sourceUrl || undefined,
  embedUrl: video.value.embedUrl || `${config.public.siteUrl}/video/${video.value.slug}`,
  publisher: { '@type': 'NewsMediaOrganization', name: config.public.siteName },
})
</script>

<template>
  <div v-if="video" class="container-content ">
    <div class="grid gap-8 lg:grid-cols-3 mt-2">
      <div class="lg:col-span-2">
        <!-- This page exists to play the video, so the player loads directly
             rather than behind a facade. -->
        <YouTubeEmbed
          :youtube-id="video.youtubeId"
          :embed-url="video.embedUrl"
          :title="localTitle(video)"
          :poster="video.thumbnailUrl"
          :poster-alt="video.thumbnailAlt"
          autoload
        />

        <h1 class="mt-4 text-kh-xl font-bold khmer-wrap sm:text-kh-2xl">{{ localTitle(video) }}</h1>

        <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <span v-if="video.category" class="badge-category">
            {{ locale === 'en' && video.category.nameEn ? video.category.nameEn : video.category.nameKh }}
          </span>
          <time v-if="video.publishedAt" :datetime="video.publishedAt">{{ dateTime(video.publishedAt) }}</time>
          <span v-if="video.viewCount">• {{ compact(video.viewCount) }} {{ t('views') }}</span>
          <span v-if="video.durationSec">• {{ duration(video.durationSec) }}</span>
        </div>

        <p v-if="video.descKh" class="mt-4 text-kh-base khmer-wrap">{{ video.descKh }}</p>

        <!-- Shares are counted against the video, not the article endpoint, so
             the analytics breakdown attributes them correctly (§43). -->
        <div class="mt-6 border-t border-line pt-4">
          <ShareLinks
            :path="`/video/${video.slug}`"
            :title="localTitle(video)"
            :track-path="`/api/video/${video.slug}/share`"
            expanded
          />
        </div>

        <AdSlot position="ARTICLE_BOTTOM" collapse-when-empty />
      </div>

      <aside class="space-y-6">
        <SectionHeading :title="t('moreVideos')" href="/video" />
        <div class="space-y-4">
          <VideoCard v-for="item in (more ?? []).filter(v => v.id !== video!.id)" :key="item.id" :video="item" />
        </div>
      </aside>
    </div>
  </div>
</template>
