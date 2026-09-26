<script setup lang="ts">
/**
 * The bottom of an infinite feed: the observer target, a real button, and the
 * end-of-list message.
 */
defineProps<{
  loading: boolean
  hasMore: boolean
  failed: boolean
  /** Hide the end message where it would be noise, e.g. an empty feed. */
  showEnd?: boolean
}>()

const emit = defineEmits<{ next: [] }>()
const { t } = useLocale()
</script>

<template>
  <div class="py-8 text-center">
    <!-- aria-live announces new items to a screen reader as they arrive,
         politely so it does not cut across whatever is being read. -->
    <p v-if="loading" class="text-sm text-ink-muted" aria-live="polite">
      {{ t('loading') }}
    </p>

    <template v-else-if="failed">
      <p class="mb-3 text-sm text-breaking">{{ t('noResults') }}</p>
      <button
        type="button"
        class="rounded-lg border border-line px-5 py-2.5 text-kh-sm font-semibold hover:bg-surface-muted"
        @click="emit('next')"
      >{{ t('loadMore') }}</button>
    </template>

    <button
      v-else-if="hasMore"
      type="button"
      class="rounded-lg border border-line px-6 py-3 text-kh-sm font-semibold hover:bg-surface-muted"
      @click="emit('next')"
    >{{ t('loadMore') }}</button>

    <p v-else-if="showEnd" class="text-sm text-ink-muted">{{ t('endOfList') }}</p>
  </div>
</template>
