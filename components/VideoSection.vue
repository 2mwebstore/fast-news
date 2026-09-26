<script setup lang="ts">
import type { VideoCard as VideoCardType } from '~/types'

/** 🎥 Video rail on the homepage (§26). */
const { data: videos } = await useAsyncApi<VideoCardType[]>('home-video', '/api/video', { limit: 6 })
const { t } = useLocale()
</script>

<template>
  <section v-if="videos?.length" aria-labelledby="video-heading">
    <SectionHeading id="video-heading" :title="t('videoNews')" icon="🎥" href="/video" />

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <VideoCard v-for="video in videos" :key="video.id" :video="video" />
    </div>
  </section>
</template>
