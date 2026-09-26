<script setup lang="ts">
import type { VideoCard as VideoCardType } from '~/types'

/**
 * Live stream page (§28).
 *
 * When nothing is on air the page says so plainly rather than showing a broken
 * player — claiming a live feed that is not running would be misleading.
 */

const { t, title: localTitle } = useLocale()
const { data } = await useAsyncApi<{ live: VideoCardType | null }>('live-video', '/api/live-video')
const live = computed(() => data.value?.live ?? null)

useSiteSeo({
  title: live.value ? `🔴 ${t('liveColon')} ${localTitle(live.value)}` : t('liveBroadcast'),
  description: t('liveVideoDesc'),
  path: '/live-video',
})
</script>

<template>
  <div class="container-content">
    <header class="flex items-center gap-3 border-b-2 border-breaking pb-4">
      <h1 class="flex items-center gap-2 text-kh-2xl font-bold">
        <span
          v-if="live"
          class="inline-block h-3 w-3 rounded-full bg-breaking animate-pulse-dot"
          aria-hidden="true"
        />
        {{ t('liveBroadcast') }}
      </h1>
      <span v-if="live" class="badge-breaking">LIVE</span>
    </header>

    <div v-if="live" class="mt-6 grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <div class="overflow-hidden rounded-lg bg-ink" style="aspect-ratio: 16 / 9">
          <video
            :src="live.hlsUrl || live.sourceUrl || undefined"
            :poster="live.thumbnailUrl || undefined"
            controls autoplay muted playsinline
            class="h-full w-full"
          />
        </div>
        <h2 class="mt-4 text-kh-xl font-bold khmer-wrap">{{ live.titleKh }}</h2>
        <p v-if="live.descKh" class="mt-2 text-kh-base text-ink-muted khmer-wrap">{{ live.descKh }}</p>
      </div>

      <aside class="space-y-8">
        <ArticleSidebarTrending />
      </aside>
    </div>

    <div v-else class="py-16 text-center">
      <p class="text-kh-lg font-semibold">{{ t('nothingLiveNow') }}</p>
      <p class="mt-2 text-kh-base text-ink-muted khmer-wrap">
        {{ t('checkLatestVideos') }}
      </p>
      <NuxtLink to="/video" class="mt-6 inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark">
        {{ t('watchVideos') }}
      </NuxtLink>
    </div>
  </div>
</template>
