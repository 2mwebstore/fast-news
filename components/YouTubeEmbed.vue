<script setup lang="ts">
/**
 * YouTube player, loaded only on demand.
 *
 * The iframe is not rendered until the reader presses play. Embedding it
 * eagerly pulls roughly a megabyte of third-party JavaScript into every page
 * that shows a video, wrecks the largest paint, and sets third-party requests
 * for readers who never watch. A poster plus a play button is indistinguishable
 * to the reader and costs nothing.
 *
 * The embed uses youtube-nocookie.com, which holds off on tracking cookies
 * until playback actually starts.
 */

const { t } = useLocale()
const props = withDefaults(defineProps<{
  youtubeId?: string
  /** Server-built embed URL. Preferred over constructing one here. */
  embedUrl?: string
  title: string
  poster?: string
  posterAlt?: string
  /** Skip the facade — for a page whose whole purpose is the video. */
  autoload?: boolean
}>(), { autoload: false })

const playing = ref(props.autoload)

const src = computed(() => {
  if (!props.youtubeId && !props.embedUrl) return ''
  const base = props.embedUrl
    || `https://www.youtube-nocookie.com/embed/${props.youtubeId}?rel=0&modestbranding=1`
  // autoplay is only added once the reader has asked for playback, so it can
  // never start unprompted.
  return playing.value && !props.autoload ? `${base}&autoplay=1` : base
})

const posterSrc = computed(() =>
  props.poster || (props.youtubeId ? `https://i.ytimg.com/vi/${props.youtubeId}/hqdefault.jpg` : ''),
)
</script>

<template>
  <div class="relative aspect-video overflow-hidden rounded-lg bg-ink">
    <iframe
      v-if="playing && src"
      :src="src"
      :title="title"
      class="absolute inset-0 h-full w-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      loading="lazy"
    />

    <button
      v-else-if="src"
      type="button"
      class="group absolute inset-0 h-full w-full"
      :aria-label="t('playVideoAria', { title })"
      @click="playing = true"
    >
      <img
        v-if="posterSrc"
        :src="posterSrc"
        :alt="posterAlt || title"
        class="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      >
      <span class="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/10">
        <span class="flex h-16 w-16 items-center justify-center rounded-full bg-breaking/90 shadow-lift transition-transform group-hover:scale-110">
          <svg class="ml-1 h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>

    <!-- No video attached yet. Says so plainly rather than showing a dead player. -->
    <div v-else class="absolute inset-0 flex items-center justify-center p-6 text-center">
      <p class="text-kh-sm text-white/70 khmer-wrap">
        {{ t('noVideoAttached') }}
      </p>
    </div>
  </div>
</template>
