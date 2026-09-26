<script setup lang="ts">
import type { ArticleCard } from '~/types'

/** The byline/time/reading-time line shared by the larger card variants. */
defineProps<{ article: ArticleCard }>()
const { dateTime, iso, khNumber } = useFormat()
const { t, isEnglish } = useLocale()
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted">
    <NuxtLink
      v-if="article.author"
      :to="`/author/${article.author.slug}`"
      class="font-medium text-ink hover:text-brand"
    >
      {{ isEnglish && article.author.nameEn ? article.author.nameEn : article.author.nameKh }}
    </NuxtLink>
    <span v-if="article.author" aria-hidden="true">•</span>

    <time v-if="article.publishedAt" :datetime="iso(article.publishedAt)">
      {{ dateTime(article.publishedAt) }}
    </time>

    <template v-if="article.readingMinutes">
      <span aria-hidden="true">•</span>
      <span>{{ t('readMinutes', { n: isEnglish ? article.readingMinutes : khNumber(article.readingMinutes) }) }}</span>
    </template>
  </div>
</template>
