<script setup lang="ts">
import type { CorrectionRef } from '~/types'

/**
 * Published correction notice (§20). Corrections are shown on the article
 * itself, not only recorded internally — a reader who saw the original should
 * be able to see what changed.
 */

const { t } = useLocale()
defineProps<{ corrections: CorrectionRef[] }>()
const { dateTime, iso } = useFormat()
</script>

<template>
  <aside class="mt-6 rounded-lg border-l-4 border-warning bg-warning/5 p-4" aria-labelledby="correction-heading">
    <h2 id="correction-heading" class="mb-2 flex items-center gap-2 text-kh-base font-bold">
      <span aria-hidden="true">✏️</span> {{ t('correctionLabel') }}
    </h2>

    <ul class="space-y-3">
      <li v-for="(correction, i) in corrections" :key="i">
        <p class="text-kh-sm khmer-wrap">{{ correction.noteKh }}</p>
        <p class="mt-1 text-xs text-ink-muted">
          <time :datetime="iso(correction.correctedAt)">{{ dateTime(correction.correctedAt) }}</time>
          <template v-if="correction.editorName"> · {{ correction.editorName }}</template>
        </p>
      </li>
    </ul>
  </aside>
</template>
