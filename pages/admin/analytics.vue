<script setup lang="ts">
/** Analytics (§43). Aggregates only — no per-visitor records exist to show. */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useAdminLocale()

const api = useAdminApi()
const { compact } = useFormat()

interface Analytics {
  days: number
  daily: { day: string; views: number; uniqueViews: number }[]
  topArticles: { slug: string; titleKh: string; views: number }[]
  shares: { network: string; count: number }[]
  note: string
}

const data = ref<Analytics | null>(null)
const days = ref(7)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    data.value = await api.get<Analytics>('/api/admin/analytics', { days: days.value })
  } finally {
    loading.value = false
  }
}
onMounted(load)
watch(days, load)

// Bars are drawn relative to the busiest day in the window.
const peak = computed(() => Math.max(1, ...(data.value?.daily ?? []).map(d => d.views)))

useHead({ title: 'Analytics — Newsroom' })
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-bold">{{ t('analytics') }}</h1>
      <div class="flex gap-2">
        <button
          v-for="d in [1, 7, 30]" :key="d"
          :class="['rounded-full border px-3 py-1.5 text-sm', days === d ? 'border-brand bg-brand text-white' : 'border-line']"
          @click="days = d"
        >{{ d === 1 ? t('today') : t('days', { n: d }) }}</button>
      </div>
    </div>

    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>

    <div v-else-if="data" class="space-y-6">
      <p class="text-xs text-ink-muted">{{ data.note }}</p>

      <section class="card p-5">
        <h2 class="mb-4 text-sm font-bold uppercase tracking-wide text-ink-muted">{{ t('viewsByDay') }}</h2>
        <div class="flex h-40 items-end gap-1">
          <div
            v-for="row in (data.daily || [])" :key="row.day"
            class="flex-1 rounded-t bg-brand/80 transition-all hover:bg-brand"
            :style="{ height: `${Math.max(2, (row.views / peak) * 100)}%` }"
            :title="`${row.day}: ${row.views} views, ${row.uniqueViews} unique`"
          />
        </div>
        <p v-if="!data.daily?.length" class="py-8 text-center text-sm text-ink-muted">{{ t('noData') }}</p>
      </section>

      <div class="grid gap-6 lg:grid-cols-3">
        <section class="card p-5 lg:col-span-2">
          <h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">{{ t('topArticles') }}</h2>
          <ol class="divide-y divide-line">
            <li v-for="(article, i) in (data.topArticles || [])" :key="article.slug" class="flex items-center gap-3 py-2">
              <span class="w-6 text-sm font-bold text-ink-muted">{{ i + 1 }}</span>
              <NuxtLink :to="`/news/${article.slug}`" target="_blank" class="min-w-0 flex-1 truncate text-kh-sm hover:text-brand">
                {{ article.titleKh }}
              </NuxtLink>
              <span class="shrink-0 text-sm font-semibold tabular-nums">{{ compact(article.views) }}</span>
            </li>
          </ol>
          <p v-if="!data.topArticles?.length" class="py-8 text-center text-sm text-ink-muted">{{ t('noData') }}</p>
        </section>

        <section class="card p-5">
          <h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">{{ t('shares') }}</h2>
          <ul class="divide-y divide-line">
            <li v-for="row in (data.shares || [])" :key="row.network" class="flex items-center justify-between py-2 text-sm">
              <span class="capitalize">{{ row.network }}</span>
              <span class="font-semibold tabular-nums">{{ row.count }}</span>
            </li>
          </ul>
          <p v-if="!data.shares?.length" class="py-8 text-center text-sm text-ink-muted">{{ t('noData') }}</p>
        </section>
      </div>
    </div>
  </div>
</template>
