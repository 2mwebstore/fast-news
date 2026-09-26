<script setup lang="ts">
import type { TrafficRoute } from '~/types'

/**
 * Traffic board (§71).
 *
 * CFN has no live traffic feed. Every row shows who assessed it and when, and
 * the page states plainly that this is a manual assessment — presenting it as
 * live data would be a claim we cannot support.
 */

const { t } = useLocale()
interface TrafficResponse {
  routes: TrafficRoute[]
  lastUpdated: string | null
  isLiveData: boolean
  disclaimer: string
  disclaimerKh: string
}

const { data } = await useAsyncApi<TrafficResponse>('traffic', '/api/traffic-status')
const { dateTime } = useFormat()

// Computed, so the level names follow the reader's language. A plain constant
// would be evaluated once at module scope and keep whichever language loaded
// first — the same trap as the admin filter lists.
const levelStyles = computed<Record<string, { label: string; dot: string; text: string }>>(() => ({
  normal: { label: t('trafficNormal'), dot: 'bg-success', text: 'text-success' },
  moderate: { label: t('trafficModerate'), dot: 'bg-warning', text: 'text-warning' },
  heavy: { label: t('trafficHeavy'), dot: 'bg-breaking', text: 'text-breaking' },
}))

useSiteSeo({
  title: t('trafficTitle'),
  description: t('trafficIntro'),
  path: '/traffic',
})
</script>

<template>
  <div class="container-content max-w-prose">
    <h1 class="flex items-center gap-2 text-kh-2xl font-bold">
      <span aria-hidden="true">🚦</span> {{ t('trafficTitle') }}
    </h1>

    <!-- The disclosure sits above the data, not below it. -->
    <div class="mt-4 rounded-lg border border-line bg-surface-muted p-4">
      <p class="text-kh-sm khmer-wrap">{{ data?.disclaimerKh }}</p>
      <p class="mt-1 text-xs text-ink-muted">{{ data?.disclaimer }}</p>
      <p v-if="data?.lastUpdated" class="mt-2 text-xs text-ink-muted">
        {{ t('lastAssessed') }} {{ dateTime(data.lastUpdated) }}
      </p>
    </div>

    <ul class="mt-6 divide-y divide-line">
      <li v-for="route in data?.routes ?? []" :key="route.id" class="flex items-center gap-3 py-4">
        <span
          :class="['h-3 w-3 shrink-0 rounded-full', levelStyles[route.level]?.dot]"
          aria-hidden="true"
        />
        <div class="min-w-0 flex-1">
          <p class="text-kh-base font-semibold khmer-wrap">{{ route.routeKh }}</p>
          <p class="text-xs text-ink-muted">{{ route.routeEn }}</p>
          <p v-if="route.noteKh" class="mt-1 text-kh-sm text-ink-muted khmer-wrap">{{ route.noteKh }}</p>
        </div>
        <div class="shrink-0 text-right">
          <p :class="['text-kh-sm font-bold', levelStyles[route.level]?.text]">
            {{ levelStyles[route.level]?.label }}
          </p>
          <p class="text-[10px] text-ink-muted">{{ route.sourceLabel }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
