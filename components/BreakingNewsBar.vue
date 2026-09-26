<script setup lang="ts">
import type { ArticleCard } from '~/types'

/**
 * The red breaking bar (§7). Server-rendered from the initial fetch, then kept
 * current by the WebSocket so a reader who leaves the tab open sees a new
 * alert without refreshing.
 */
const props = defineProps<{ initial?: ArticleCard[] }>()

const store = useBreakingStore()
const { t, title: localTitle } = useLocale()

// Fetch on the server when no list was handed down, so the bar is in the
// initial HTML rather than popping in after hydration.
if (props.initial?.length) {
  store.setItems(props.initial)
} else {
  const { data } = await useAsyncApi<ArticleCard[]>('breaking-bar', '/api/breaking')
  if (data.value?.length) store.setItems(data.value)
}

// The socket writes into the same store, so the bar updates in place.
const { connected } = useBreakingSocket()

const index = ref(0)
let rotator: ReturnType<typeof setInterval> | null = null

const items = computed(() => store.items)
const current = computed(() => items.value[index.value] ?? null)

// Rotate through alerts when there is more than one, pausing on hover so a
// reader can actually click the headline they were reading.
const paused = ref(false)

function startRotation() {
  stopRotation()
  if (items.value.length < 2) return
  rotator = setInterval(() => {
    if (!paused.value) index.value = (index.value + 1) % items.value.length
  }, 6000)
}
function stopRotation() {
  if (rotator) { clearInterval(rotator); rotator = null }
}

watch(items, () => {
  index.value = 0
  startRotation()
}, { immediate: true })

onBeforeUnmount(stopRotation)
</script>

<template>
  <div
    v-if="current"
    class="border-b border-breaking/20 bg-breaking text-white"
    role="region"
    :aria-label="t('breakingRegion')"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <div class="container-content flex items-center gap-3 py-2">
      <span class="flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
        <span class="inline-block h-2 w-2 rounded-full bg-white animate-pulse-dot" aria-hidden="true" />
        {{ t('breaking') }}
      </span>

      <!-- aria-live so a screen reader announces a pushed alert, but polite so
           it does not interrupt whatever the reader is already hearing. -->
      <div class="min-w-0 flex-1" aria-live="polite" aria-atomic="true">
        <NuxtLink
          :to="`/news/${current.slug}`"
          class="block truncate text-kh-sm font-semibold hover:underline"
        >
          {{ localTitle(current) }}
        </NuxtLink>
      </div>

      <div v-if="items.length > 1" class="hidden shrink-0 items-center gap-1 sm:flex">
        <button
          v-for="(item, i) in items.slice(0, 5)"
          :key="item.id"
          :class="['h-1.5 rounded-full transition-all', i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50']"
          :aria-label="t('breakingItemAria', { n: i + 1 })"
          @click="index = i"
        />
      </div>

      <NuxtLink to="/live" class="hidden shrink-0 text-xs font-semibold underline underline-offset-2 sm:block">
        {{ t('viewAll') }}
      </NuxtLink>

      <!-- Connection state is shown only when the live channel is down, so the
           bar does not imply real-time updates it is not receiving. -->
      <span
        v-if="!connected"
        class="hidden shrink-0 text-[10px] opacity-70 lg:block"
        title="Live updates unavailable; refreshing periodically"
      >offline</span>
    </div>
  </div>
</template>
