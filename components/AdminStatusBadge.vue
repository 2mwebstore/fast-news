<script setup lang="ts">
import type { ArticleStatus } from '~/types'

/**
 * Colour-coded workflow status (§16).
 *
 * Labels come from the admin locale rather than a hard-coded Khmer map, so the
 * badge follows the interface language. It appears on every list, so leaving it
 * in one language was the most visible part of the problem.
 */
const props = defineProps<{ status: ArticleStatus | string }>()

const { t } = useAdminLocale()

// Only the colour is fixed here — colour is not language.
const tone: Record<string, string> = {
  draft: 'bg-ink/10 text-ink-muted',
  review: 'bg-warning/15 text-warning',
  approved: 'bg-brand/10 text-brand',
  scheduled: 'bg-brand-accent/10 text-brand-accent',
  published: 'bg-success/15 text-success',
  rejected: 'bg-breaking/15 text-breaking',
  archived: 'bg-ink/10 text-ink-muted',
}

const labelKeys: Record<string, Parameters<typeof t>[0]> = {
  draft: 'statusDraft',
  review: 'statusReview',
  approved: 'statusApproved',
  scheduled: 'statusScheduled',
  published: 'statusPublished',
  rejected: 'statusRejected',
  archived: 'statusArchived',
}

// An unknown status shows its raw value rather than an empty badge — better to
// see "queued" than nothing when the backend gains a state the UI has not
// caught up with.
const label = computed(() => {
  const key = labelKeys[props.status]
  return key ? t(key) : String(props.status)
})

const classes = computed(() => tone[props.status] ?? 'bg-ink/10 text-ink-muted')
</script>

<template>
  <span :class="['rounded px-1.5 py-0.5 font-semibold', classes]">{{ label }}</span>
</template>
