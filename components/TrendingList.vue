<script setup lang="ts">
import type { ArticleCard } from '~/types'

/** 🔥 Trending sidebar module (§44). */
defineProps<{ articles: ArticleCard[] }>()
const { t } = useLocale()
</script>

<template>
  <section v-if="articles.length" aria-labelledby="trending-heading" class="card p-5">
    <div class="mb-4 flex items-baseline gap-2 border-b-2 border-breaking pb-2">
      <h2 id="trending-heading" class="text-kh-xl font-bold">
        <span aria-hidden="true">🔥</span> {{ t('trending') }}
      </h2>
    </div>

    <ol class="divide-y divide-line">
      <li v-for="(article, i) in articles" :key="article.id" class="py-3 first:pt-0 last:pb-0">
        <NewsCard :article="article" variant="compact" :rank="i + 1" />
      </li>
    </ol>
  </section>
</template>
