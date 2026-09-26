<script setup lang="ts">
import type { ArticleCard } from '~/types'

/** ⚡ 5-Minute News (§11) — the numbered catch-up list. */
const { data: articles } = await useAsyncApi<ArticleCard[]>('five-minute', '/api/five-minute')
const { t } = useLocale()
</script>

<template>
  <section v-if="articles?.length" aria-labelledby="five-min-heading" class="card p-5">
    <div class="mb-4 flex items-baseline gap-2 border-b-2 border-warning pb-2">
      <h2 id="five-min-heading" class="text-kh-xl font-bold">
        <span aria-hidden="true">⚡</span> {{ t('fiveMinute') }}
      </h2>
      <span class="text-xs text-ink-muted">{{ t('quickRead') }}</span>
    </div>

    <ol class="divide-y divide-line">
      <li v-for="(article, i) in articles" :key="article.id" class="py-3 first:pt-0 last:pb-0">
        <NewsCard :article="article" variant="compact" :rank="i + 1" />
      </li>
    </ol>
  </section>
</template>
