<script setup lang="ts">
import type { ArticleCard } from '~/types'

/** Trending rail on the article page; fetched separately so it can be cached
    independently of the article itself. */
const { data: trending } = await useAsyncApi<ArticleCard[]>('article-trending', '/api/trending', { limit: 6 })
</script>

<template>
  <TrendingList :articles="trending ?? []" />
</template>
