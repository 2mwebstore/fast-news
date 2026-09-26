<script setup lang="ts">
const { t } = useLocale()

import type { ApiMeta } from '~/types'

/**
 * Pagination. Uses real links rather than buttons so each page is crawlable
 * and can be opened in a new tab.
 */
const props = defineProps<{ meta: ApiMeta; basePath: string }>()

// A window around the current page: a section with 400 pages should not render
// 400 links.
const pages = computed(() => {
  const { page, totalPages } = props.meta
  const window = 2
  const start = Math.max(1, page - window)
  const end = Math.min(totalPages, page + window)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function linkTo(page: number) {
  return page === 1 ? props.basePath : `${props.basePath}?page=${page}`
}
</script>

<template>
  <nav v-if="meta.totalPages > 1" class="mt-8 flex items-center justify-center gap-1" :aria-label="t('pagination')">
    <NuxtLink
      v-if="meta.page > 1"
      :to="linkTo(meta.page - 1)"
      rel="prev"
      class="rounded border border-line px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
    >
      ← {{ t('previous') }}
    </NuxtLink>

    <NuxtLink
      v-for="p in pages"
      :key="p"
      :to="linkTo(p)"
      :aria-current="p === meta.page ? 'page' : undefined"
      :class="[
        'min-w-[2.5rem] rounded px-3 py-2 text-center text-sm font-semibold',
        p === meta.page ? 'bg-brand text-white' : 'border border-line hover:bg-surface-muted',
      ]"
    >
      {{ p }}
    </NuxtLink>

    <NuxtLink
      v-if="meta.hasMore"
      :to="linkTo(meta.page + 1)"
      rel="next"
      class="rounded border border-line px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
    >
      {{ t('next') }} →
    </NuxtLink>
  </nav>
</template>
