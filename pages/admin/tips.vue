<script setup lang="ts">
import type { TipStatus } from '~/types/tips'

/**
 * Citizen submission review (§34). Nothing here is published by this screen —
 * marking a tip "published" records that a story came from it; the story
 * itself still goes through the normal editorial workflow.
 */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useAdminLocale()

const api = useAdminApi()
const { dateTime } = useFormat()

interface Tip {
  id: number; name: string; contact: string; location: string
  description: string; status: TipStatus; reviewNote: string
  photoUrls?: string[]; createdAt: string
}

const tips = ref<Tip[]>([])
const loading = ref(true)
const filter = ref<TipStatus | ''>('pending')

async function load() {
  loading.value = true
  try {
    const result = await api.list<Tip[]>('/api/admin/tips', { status: filter.value || undefined, limit: 50 })
    tips.value = result.data ?? []
  } finally {
    loading.value = false
  }
}
onMounted(load)
watch(filter, load)

async function review(id: number, status: TipStatus, note = '') {
  await api.patch(`/api/admin/tips/${id}`, { status, note })
  await load()
}

// Computed, not a constant: a constant is evaluated once at module scope and
// would keep whichever language was active on first load.
const filters = computed<{ value: TipStatus | ''; label: string }[]>(() => [
  { value: 'pending', label: t('statusPending') },
  { value: 'reviewing', label: t('statusReviewing') },
  { value: 'verified', label: t('verify') },
  { value: 'rejected', label: t('reject') },
  { value: '', label: t('all') },
])

useHead({ title: 'Reader tips — Newsroom' })
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold">{{ t('readerTips') }}</h1>
    <p class="mb-4 text-sm text-ink-muted">
      {{ t('tipsIntro') }}
    </p>

    <div class="mb-4 flex flex-wrap gap-2">
      <button
        v-for="f in filters" :key="f.value"
        :class="[
          'rounded-full border px-3 py-1.5 text-sm',
          filter === f.value ? 'border-brand bg-brand text-white' : 'border-line hover:border-brand',
        ]"
        @click="filter = f.value"
      >{{ f.label }}</button>
    </div>

    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>
    <p v-else-if="!tips.length" class="card py-12 text-center text-ink-muted">{{ t('noTips') }}</p>

    <ul v-else class="space-y-3">
      <li v-for="tip in tips" :key="tip.id" class="card p-4">
        <div class="mb-2 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <span class="rounded bg-ink/10 px-1.5 py-0.5 font-semibold">{{ tip.status }}</span>
          <span>{{ dateTime(tip.createdAt) }}</span>
          <span v-if="tip.location">· {{ tip.location }}</span>
          <span v-if="tip.name">· {{ tip.name }}</span>
        </div>

        <!-- Rendered as text, never as HTML: this is untrusted reader input. -->
        <p class="whitespace-pre-line text-kh-base khmer-wrap">{{ tip.description }}</p>

        <p v-if="tip.contact" class="mt-2 text-xs text-ink-muted">
          {{ t('contactLabel') }} {{ tip.contact }} <span class="italic">{{ t('forVerificationOnly') }}</span>
        </p>

        <div class="mt-3 flex flex-wrap gap-2">
          <button class="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-muted" @click="review(tip.id, 'reviewing')">
            {{ t('statusReviewing') }}
          </button>
          <button class="rounded-lg bg-success px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90" @click="review(tip.id, 'verified')">
            {{ t('statusVerified') }}
          </button>
          <button class="rounded-lg border border-breaking px-3 py-1.5 text-sm text-breaking hover:bg-breaking/5" @click="review(tip.id, 'rejected')">
            {{ t('reject') }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
