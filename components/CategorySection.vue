<script setup lang="ts">
import type { ArticleCard, CategoryDetail } from '~/types'

/** One homepage section block: a lead story plus a small grid. */
const props = defineProps<{ category: CategoryDetail }>()

const { data: articles } = await useAsyncApi<ArticleCard[]>(
  `section-${props.category.slug}`,
  '/api/news',
  { category: props.category.slug, limit: 5 },
)

const lead = computed(() => articles.value?.[0] ?? null)
const rest = computed(() => articles.value?.slice(1, 5) ?? [])
</script>

<template>
  <section v-if="lead" :aria-labelledby="`section-${category.slug}`">
    <SectionHeading
      :id="`section-${category.slug}`"
      :title="category.nameKh"
      :icon="category.icon"
      :href="`/category/${category.slug}`"
      :accent="category.color"
    />

    <div class="grid gap-6 md:grid-cols-2">
      <NewsCard :article="lead" variant="grid" />

      <div class="space-y-4">
        <NewsCard
          v-for="article in rest"
          :key="article.id"
          :article="article"
          variant="compact"
        />
      </div>
    </div>
  </section>
</template>
