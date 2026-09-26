<script setup lang="ts">
/**
 * The ⚡ AI summary block (§24).
 *
 * It is rendered in its own bordered block with an explicit label, never mixed
 * into the article body, so a reader always knows which text was written by a
 * journalist and which was generated.
 */

const { t } = useLocale()
defineProps<{ points: string[]; generatedAt?: string }>()
</script>

<template>
  <aside
    class="mt-6 rounded-lg border border-brand/25 bg-brand/5 p-5"
    aria-labelledby="ai-summary-heading"
  >
    <h2 id="ai-summary-heading" class="mb-3 flex items-center gap-2 text-kh-lg font-bold text-brand">
      <span aria-hidden="true">⚡</span> {{ t('aiSummary') }}
    </h2>

    <ul class="space-y-2">
      <li v-for="(point, i) in points" :key="i" class="flex gap-2 text-kh-base khmer-wrap">
        <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
        <span>{{ point }}</span>
      </li>
    </ul>

    <p class="mt-4 border-t border-brand/20 pt-3 text-xs text-ink-muted khmer-wrap">
      {{ t('aiSummaryFootnote') }}
    </p>
  </aside>
</template>
