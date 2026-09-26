<script setup lang="ts">
import type { AdminCard } from '~/types/admin'

/** Review queue (§17) — the editor's inbox. */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const { dateTime } = useFormat()
const { t, contentTitle } = useAdminLocale()

const articles = ref<AdminCard[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const result = await api.list<AdminCard[]>('/api/admin/news', { status: 'review', limit: 50 })
    articles.value = result.data ?? []
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function decide(id: number, status: 'approved' | 'rejected') {
  await api.post(`/api/admin/news/${id}/status`, { status })
  await load()
}

useHead({ title: 'Review queue — Newsroom' })
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold">{{ t('reviewQueue') }}</h1>
    <p class="mb-4 text-sm text-ink-muted">{{ t('reviewQueueIntro') }}</p>

    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>
    <p v-else-if="!articles.length" class="card py-12 text-center text-ink-muted">
      {{ t('nothingToReview') }}
    </p>

    <ul v-else class="space-y-3">
      <li v-for="article in articles" :key="article.id" class="card flex flex-wrap items-center gap-3 p-4">
        <div class="min-w-0 flex-1">
          <NuxtLink :to="`/admin/news/${article.id}/edit`" class="block truncate text-kh-base font-semibold hover:text-brand">
            {{ contentTitle(article) }}
          </NuxtLink>
          <p class="mt-1 text-xs text-ink-muted">
            <span v-if="article.category">{{ article.category.nameKh }}</span>
            <span v-if="article.author"> · {{ article.author.nameKh }}</span>
            · {{ dateTime(article.updatedAt) }} · {{ article.wordCount }} {{ t('words') }}
            <span v-if="article.aiAssisted" class="ml-1 rounded bg-brand/10 px-1.5 py-0.5 text-brand">AI draft</span>
          </p>
        </div>

        <div class="flex gap-2">
          <NuxtLink :to="`/admin/news/${article.id}/edit`" class="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-muted">
            {{ t('read') }}
          </NuxtLink>
          <button class="rounded-lg border border-breaking px-3 py-1.5 text-sm text-breaking hover:bg-breaking/5" @click="decide(article.id, 'rejected')">
            {{ t('reject') }}
          </button>
          <button class="rounded-lg bg-success px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90" @click="decide(article.id, 'approved')">
            {{ t('approve') }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
