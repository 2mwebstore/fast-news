<script setup lang="ts">
import type { PulseResult } from '~/types'

/**
 * News Pulse (§12): which sections are seeing the most reading activity.
 *
 * The disclaimer is part of the module, not an optional footnote — this
 * measures activity on this site, and must not be read as public opinion.
 */
const { data: pulse } = await useAsyncApi<PulseResult>('news-pulse', '/api/pulse')
const { khNumber } = useFormat()
const { t, isEnglish } = useLocale()
</script>

<template>
  <section v-if="pulse?.entries?.length" aria-labelledby="pulse-heading">
    <SectionHeading id="pulse-heading" :title="t('newsPulse')" icon="🔥" :subtitle="t('lastTwentyFourHours')" />

    <ul class="space-y-3">
      <li v-for="(entry, i) in pulse.entries" :key="entry.categorySlug">
        <NuxtLink :to="`/category/${entry.categorySlug}`" class="group block">
          <div class="mb-1 flex items-center justify-between gap-2 text-kh-sm">
            <span class="font-semibold group-hover:text-brand">
              {{ isEnglish ? i + 1 : khNumber(i + 1) }}. {{ isEnglish ? entry.categoryEn : entry.categoryKh }}
            </span>
            <span class="text-xs tabular-nums text-ink-muted">{{ entry.percent }}%</span>
          </div>
          <div
            class="h-2 overflow-hidden rounded-full bg-surface-muted"
            role="img"
            :aria-label="`${entry.categoryEn}: ${entry.percent}% of the busiest section`"
          >
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{
                width: `${Math.max(entry.percent, 4)}%`,
                backgroundColor: entry.color || '#1E3A8A',
              }"
            />
          </div>
        </NuxtLink>
      </li>
    </ul>

    <p class="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-muted khmer-wrap">
      {{ isEnglish ? pulse.disclaimer : pulse.disclaimerKh }}
    </p>
  </section>
</template>
