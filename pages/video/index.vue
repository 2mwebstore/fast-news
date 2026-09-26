<script setup lang="ts">
import type { ApiMeta, VideoCard as VideoCardType } from '~/types'

/** Video index (§26). */

const { t } = useLocale()
const route = useRoute()
const api = useApi()
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const { data } = await useAsyncData(
  () => `videos-${page.value}`,
  async () => {
    const result = await api.list<VideoCardType[]>('/api/video', { page: page.value, limit: 24 })
    return { videos: result.data, meta: result.meta }
  },
  { watch: [page] },
)

const videos = computed(() => data.value?.videos ?? [])
const meta = computed<ApiMeta | undefined>(() => data.value?.meta)

useSiteSeo({
  title: t('videoNews'),
  description: t('videoDesc'),
  path: '/video',
  robots: page.value > 1 ? 'noindex, follow' : undefined,
})
</script>

<template>
  <div class="container-content">
    <header class="border-b-2 border-brand pb-4">
      <h1 class="flex items-center gap-2 text-kh-2xl font-bold sm:text-kh-3xl">
        <span aria-hidden="true">🎥</span> {{ t('videoNews') }}
      </h1>
    </header>

    <p v-if="!videos.length" class="py-12 text-center text-kh-base text-ink-muted">
      {{ t('noVideos') }}
    </p>

    <div v-else class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <VideoCard v-for="video in videos" :key="video.id" :video="video" />
    </div>

    <Pagination v-if="meta" :meta="meta" base-path="/video" />
  </div>
</template>
