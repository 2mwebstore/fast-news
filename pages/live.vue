<script setup lang="ts">
import type { ArticleCard } from '~/types'

/** 🔴 LIVE NOW timeline (§8). */

const { t } = useLocale()
const { data: initial } = await useAsyncApi<ArticleCard[]>('live-feed', '/api/live', { limit: 30 })

const store = useBreakingStore()
const { connected } = useBreakingSocket()
const { time, relativeKh } = useFormat()

// The pushed breaking items lead the timeline, with the wider live feed behind
// them, deduplicated.
const items = computed(() => {
  const seen = new Set<number>()
  const out: ArticleCard[] = []
  for (const article of [...store.items, ...(initial.value ?? [])]) {
    if (seen.has(article.id)) continue
    seen.add(article.id)
    out.push(article)
  }
  return out
})

useSiteSeo({
  title: `${t('live')} — LIVE`,
  description: t('liveDesc'),
  path: '/live',
})
</script>

<template>
  <div class="container-content">
    <header class="flex flex-wrap items-center gap-3 border-b-2 border-breaking pb-4">
      <h1 class="flex items-center gap-2 text-kh-2xl font-bold sm:text-kh-3xl">
        <span class="inline-block h-3 w-3 rounded-full bg-breaking animate-pulse-dot" aria-hidden="true" />
        {{ t('live') }}
      </h1>
      <span class="text-sm text-ink-muted">LIVE NOW</span>

      <span
        :class="[
          'ml-auto rounded-full px-2.5 py-1 text-xs font-semibold',
          connected ? 'bg-success/10 text-success' : 'bg-ink/10 text-ink-muted',
        ]"
      >
        {{ connected ? t('liveUpdating') : t('refreshingEachMinute') }}
      </span>
    </header>

    <div class="mt-6 grid gap-8 lg:grid-cols-3">
      <!-- aria-live so a reader using a screen reader hears new items arrive
           without having to re-read the page. -->
      <ol class="lg:col-span-2" aria-live="polite">
        <li
          v-for="article in items"
          :key="article.id"
          class="relative flex gap-4 border-l-2 border-line pb-6 pl-5 last:pb-0"
        >
          <span
            :class="[
              'absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ring-4 ring-surface',
              article.isBreaking ? 'bg-breaking' : 'bg-brand',
            ]"
            aria-hidden="true"
          />

          <div class="min-w-0 flex-1">
            <div class="mb-1 flex flex-wrap items-center gap-2 text-xs">
              <time
                v-if="article.publishedAt"
                :datetime="article.publishedAt"
                class="font-bold tabular-nums text-ink"
              >{{ time(article.publishedAt) }}</time>
              <BreakingBadge v-if="article.isBreaking" small />
              <span v-else-if="article.category" class="text-brand">{{ article.category.nameKh }}</span>
              <span class="text-ink-muted">{{ relativeKh(article.publishedAt) }}</span>
            </div>

            <NuxtLink :to="`/news/${article.slug}`" class="group flex gap-3">
              <h2 class="min-w-0 flex-1 text-kh-base font-semibold leading-snug khmer-wrap group-hover:text-brand">
                {{ article.titleKh }}
              </h2>
              <img
                v-if="article.imageUrl"
                :src="article.imageUrl" :alt="article.imageAlt || article.titleKh"
                width="96" height="54"
                class="h-auto w-20 shrink-0 rounded object-cover sm:w-24"
                loading="lazy" decoding="async"
              >
            </NuxtLink>
          </div>
        </li>
      </ol>

      <aside class="space-y-8">
        <AdSlot position="HOME_SIDEBAR" collapse-when-empty />
        <FiveMinuteNews />
        <NewsPulse />
      </aside>
    </div>
  </div>
</template>
