<script setup lang="ts">
const { t } = useLocale()

import type { VideoCard as VideoCardType } from '~/types'

defineProps<{ video: VideoCardType }>()
const { duration, compact, relativeKh } = useFormat()
</script>

<template>
  <article class="group">
    <NuxtLink :to="`/video/${video.slug}`" class="block">
      <SmartImage
        :src="video.thumbnailUrl"
        :alt="video.thumbnailAlt || video.titleKh"
        :width="640" :height="360"
        img-class="transition-transform duration-300 group-hover:scale-[1.03]"
        class="rounded-lg"
      >

        <span class="absolute inset-0 flex items-center justify-center">
          <span class="rounded-full bg-ink/60 p-3 backdrop-blur-sm transition-transform group-hover:scale-110">
            <svg class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>

        <span
          v-if="video.isLive"
          class="absolute left-2 top-2 badge-breaking"
        >
          <span class="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot" aria-hidden="true" />
          {{ t('liveBadge') }}
        </span>
        <span
          v-else-if="video.durationSec"
          class="absolute bottom-2 right-2 rounded bg-ink/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white"
        >
          {{ duration(video.durationSec) }}
        </span>
      </SmartImage>

      <h3 class="mt-2.5 line-clamp-2 text-kh-base font-semibold leading-snug khmer-wrap group-hover:text-brand">
        {{ video.titleKh }}
      </h3>

      <div class="mt-1 flex items-center gap-2 text-xs text-ink-muted">
        <span v-if="video.category">{{ video.category.nameKh }}</span>
        <template v-if="video.viewCount">
          <span aria-hidden="true">•</span>
          <span>{{ compact(video.viewCount) }} {{ t('views') }}</span>
        </template>
        <template v-if="video.publishedAt">
          <span aria-hidden="true">•</span>
          <time :datetime="video.publishedAt">{{ relativeKh(video.publishedAt) }}</time>
        </template>
      </div>
    </NuxtLink>
  </article>
</template>
