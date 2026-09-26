<script setup lang="ts">
import type { AdSlotResponse } from '~/types'

/**
 * AdSlot renders one advertising position (§36).
 *
 * The box reserves its exact dimensions before any creative is fetched, so a
 * slot that fills late — or stays empty — never shifts the page (§38, §56).
 * Ads are always labelled, so a reader can tell a paid placement from
 * reporting (§42).
 */
const props = withDefaults(defineProps<{
  position: string
  /** Narrows targeting to the current section. */
  category?: string
  /** Hides the reserved box entirely when no creative is returned. */
  collapseWhenEmpty?: boolean
  class?: string
}>(), { collapseWhenEmpty: false })

const { t, locale } = useLocale()


const api = useApi()
const slot = ref<AdSlotResponse | null>(null)
const loaded = ref(false)
const impressionSent = ref(false)
const container = ref<HTMLElement | null>(null)

// Ads are per-device and change constantly, so they are fetched on the client
// rather than baked into the SSR payload — which also keeps the cached HTML
// identical for every reader.
onMounted(async () => {
  try {
    slot.value = await api.get<AdSlotResponse>('/api/ads', {
      position: props.position,
      category: props.category,
    })
  } catch {
    slot.value = null
  } finally {
    loaded.value = true
  }
})

// An impression counts when the creative is actually on screen, not when it is
// fetched — a slot below the fold that nobody scrolls to was never seen.
const { stop } = useIntersectionObserver(
  container,
  ([entry]) => {
    if (!entry?.isIntersecting || impressionSent.value || !slot.value?.ad) return
    impressionSent.value = true
    api.beacon(`/api/ads/${slot.value.ad.id}/impression?position=${props.position}`)
    stop()
  },
  { threshold: 0.5 },
)

function onClick() {
  if (!slot.value?.ad) return
  api.beacon(`/api/ads/${slot.value.ad.id}/click?position=${props.position}`)
}

const ad = computed(() => slot.value?.ad ?? null)

// The API returns both languages because it cannot know which one the reader
// chose. Falling back to the locale file keeps the disclosure present even if a
// response predates those fields — an unlabelled ad is the one thing §42 does
// not allow.
const adLabel = computed(() => {
  const served = ad.value
  if (!served) return t('advertisement')
  return (locale.value === 'en' ? served.labelEn : served.labelKh) || t('advertisement')
})
const enabled = computed(() => slot.value?.enabled !== false)

// Reserve from the served creative when there is one, otherwise from the slot
// definition, so the height is known before the response arrives.
const reserved = computed(() => ({
  width: ad.value?.width || slot.value?.reservedWidth || 0,
  height: ad.value?.height || slot.value?.reservedHeight || 0,
}))

const hidden = computed(() =>
  !enabled.value || (loaded.value && !ad.value && props.collapseWhenEmpty),
)
</script>

<template>
  <div
    v-if="!hidden"
    ref="container"
    :class="['my-4 flex flex-col items-center', props.class]"
    :data-ad-position="position"
  >
    <!-- The label sits outside the creative so it cannot be styled away by an
         advertiser's own markup. -->
    <span class="mb-1 text-[10px] uppercase tracking-widest text-ink-muted">
      {{ adLabel }}
    </span>

    <div
      class="flex max-w-full items-center justify-center overflow-hidden bg-surface-muted"
      :style="reserved.height ? {
        width: '100%',
        maxWidth: `${reserved.width}px`,
        aspectRatio: `${reserved.width} / ${reserved.height}`,
      } : undefined"
    >
      <a
        v-if="ad?.imageUrl"
        :href="ad.targetUrl"
        target="_blank"
        rel="noopener sponsored nofollow"
        class="block h-full w-full"
        @click="onClick"
      >
        <img
          :src="ad.imageUrl"
          :alt="ad.altText || 'Advertisement'"
          :width="reserved.width || undefined"
          :height="reserved.height || undefined"
          class="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        >
      </a>

      <!-- A third-party ad tag runs inside a sandboxed iframe: it is never
           injected into the page DOM, so it cannot read our cookies or
           rewrite the article around it. -->
      <iframe
        v-else-if="ad?.htmlSnippet"
        :srcdoc="ad.htmlSnippet"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        referrerpolicy="no-referrer"
        class="h-full w-full border-0"
        :title="`Advertisement: ${position}`"
        loading="lazy"
      />
    </div>
  </div>
</template>
