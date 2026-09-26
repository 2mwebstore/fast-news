<script setup lang="ts">
/**
 * AI newsroom assistant (§21, §22).
 *
 * The workflow on screen matches the policy: verified facts in, draft out,
 * human editor, publish. The assistant cannot publish — the only action
 * available on its output is "save as a draft", which lands in the normal
 * review queue.
 */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useAdminLocale()

const api = useAdminApi()
const router = useRouter()

interface Draft {
  titleKh: string; titleEn: string; category: string; subCategory: string
  summary: string; paragraph1: string; paragraph2: string
  telegramPost: string; editorNote: string
}

const input = reactive({ topic: '', facts: '', source: '', date: '' })
const draft = ref<Draft | null>(null)
const disclaimer = ref('')
const busy = ref(false)
const errorMessage = ref('')
const aiStatus = ref<{ configured: boolean; workflow: string[] } | null>(null)
const savingDraft = ref(false)

onMounted(async () => {
  try {
    aiStatus.value = await api.get('/api/ai/status')
  } catch { /* the panel renders its unconfigured state */ }
})

async function generate() {
  if (!input.topic.trim() || !input.facts.trim() || !input.source.trim()) {
    errorMessage.value = t('needTopicFactsSource')
    return
  }

  busy.value = true
  errorMessage.value = ''
  draft.value = null
  try {
    const result = await api.post<{ draft: Draft; disclaimer: string }>('/api/ai/generate-news', { ...input })
    draft.value = result.draft
    disclaimer.value = result.disclaimer
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('aiUnavailable')
  } finally {
    busy.value = false
  }
}

/** Saves the draft into the normal editorial pipeline, at status "draft". */
async function saveAsDraft() {
  if (!draft.value) return
  savingDraft.value = true
  errorMessage.value = ''
  try {
    const categories = await api.get<{ id: number; slug: string }[]>('/api/categories')
    const matched = categories.find(c => c.slug === draft.value!.category?.toLowerCase())

    const article = await api.post<{ id: number }>('/api/news', {
      titleKh: draft.value.titleKh,
      titleEn: draft.value.titleEn,
      summaryKh: draft.value.summary,
      contentKh: `<p>${draft.value.paragraph1}</p><p>${draft.value.paragraph2}</p>`,
      categoryId: matched?.id ?? categories[0]?.id ?? 0,
      // Flags the article as AI-assisted so the newsroom list shows it and an
      // editor knows to check the facts (§21).
      aiAssisted: true,
    })

    // Record the source the journalist supplied, so provenance is attached
    // from the very first save (§19).
    await api.post(`/api/admin/news/${article.id}/sources`, {
      nameKh: input.source, type: 'other', verification: 'pending',
      notes: `Supplied to the AI assistant on ${new Date().toISOString()}`,
    }).catch(() => {})

    router.push(`/admin/news/${article.id}/edit`)
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('saveFailed')
  } finally {
    savingDraft.value = false
  }
}

useHead({ title: 'AI assistant — Newsroom' })
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold">{{ t('aiAssistant') }}</h1>
    <p class="mb-4 text-sm text-ink-muted">
      {{ t('aiFlow') }}
    </p>

    <div
      v-if="aiStatus && !aiStatus.configured"
      class="mb-4 rounded-lg border border-warning/40 bg-warning/5 p-4 text-sm"
    >
      {{ t('aiNotConfigured') }}
    </div>

    <div class="mb-4 rounded-lg border border-line bg-surface-muted p-4 text-sm">
      <strong>{{ t('aiNeverPublishes') }}</strong>
      {{ t('aiNeverPublishesBody') }}
      {{ t('aiNoFabrication') }}
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- ── Input ─────────────────────────────────────────────────────── -->
      <form class="card space-y-4 p-5" @submit.prevent="generate">
        <h2 class="font-bold">{{ t('verifiedFacts') }}</h2>

        <div>
          <label for="topic" class="mb-1 block text-sm font-semibold">{{ t('topicLabel') }} *</label>
          <input
            id="topic" v-model="input.topic" required
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"
            :placeholder="t('topicPlaceholder')"
          >
        </div>

        <div>
          <label for="facts" class="mb-1 block text-sm font-semibold">{{ t('verifiedFacts') }} *</label>
          <textarea
            id="facts" v-model="input.facts" rows="8" required
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"
            :placeholder="t('factsPlaceholder')"
          />
          <p class="mt-1 text-xs text-ink-muted">
            {{ t('aiOnlyUsesFacts') }}
          </p>
        </div>

        <div>
          <label for="source" class="mb-1 block text-sm font-semibold">{{ t('sourceLabel') }} *</label>
          <input
            id="source" v-model="input.source" required
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"
            :placeholder="t('sourcePlaceholder')"
          >
        </div>

        <button
          type="submit" :disabled="busy || (aiStatus ? !aiStatus.configured : false)"
          class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        >{{ busy ? t('generating') : t('generateDraft') }}</button>

        <p v-if="errorMessage" class="rounded bg-breaking/10 p-3 text-sm text-breaking">{{ errorMessage }}</p>
      </form>

      <!-- ── Draft ─────────────────────────────────────────────────────── -->
      <div v-if="draft" class="card space-y-4 p-5">
        <div class="flex items-center justify-between">
          <h2 class="font-bold">{{ t('draftLabel') }}</h2>
          <span class="rounded bg-ink/10 px-2 py-0.5 text-xs font-semibold text-ink-muted">{{ t('unsaved') }}</span>
        </div>

        <p class="rounded-lg bg-warning/10 p-3 text-xs">{{ disclaimer }}</p>

        <p
          v-if="draft.editorNote"
          class="rounded-lg border border-warning/40 bg-warning/5 p-3 text-sm"
        >
          <strong>{{ t('assistantNote') }}</strong> {{ draft.editorNote }}
        </p>

        <div>
          <p class="text-xs font-semibold text-ink-muted">{{ t('titleKhLabel') }}</p>
          <p class="text-kh-lg font-bold khmer-wrap">{{ draft.titleKh }}</p>
        </div>
        <div v-if="draft.titleEn">
          <p class="text-xs font-semibold text-ink-muted">Headline (English)</p>
          <p class="font-semibold">{{ draft.titleEn }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold text-ink-muted">{{ t('summaryLabel') }}</p>
          <p class="text-kh-base khmer-wrap">{{ draft.summary }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold text-ink-muted">{{ t('bodyLabel') }}</p>
          <p class="text-kh-base khmer-wrap">{{ draft.paragraph1 }}</p>
          <p class="mt-2 text-kh-base khmer-wrap">{{ draft.paragraph2 }}</p>
        </div>
        <div v-if="draft.telegramPost">
          <p class="text-xs font-semibold text-ink-muted">{{ t('telegramMessage') }}</p>
          <p class="whitespace-pre-line rounded-lg bg-surface-muted p-3 text-kh-sm khmer-wrap">{{ draft.telegramPost }}</p>
        </div>

        <button
          :disabled="savingDraft"
          class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          @click="saveAsDraft"
        >{{ savingDraft ? t('saving') : t('saveAsDraft') }}</button>

        <p class="text-center text-xs text-ink-muted">
          {{ t('draftGoesToQueue') }}
        </p>
      </div>
    </div>
  </div>
</template>
