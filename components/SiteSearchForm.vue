<script setup lang="ts">
/**
 * The reader-facing search field, shared by the header bar and the search page
 * so the two look and behave the same.
 *
 * Navigation is left to the parent: the header starts a fresh search, while
 * the search page keeps the filters already applied. An empty submit is still
 * emitted, so the search page can treat it as "clear the search".
 *
 * Focus is shown by the field turning white and the caret, not by a coloured
 * border or ring.
 */
const model = defineModel<string>({ default: '' })

defineProps<{
  /** Lets something outside the form find and focus the field. */
  inputId?: string
}>()

const emit = defineEmits<{ submit: [term: string] }>()

const { t } = useLocale()
const input = ref<HTMLInputElement | null>(null)

function submit() {
  emit('submit', model.value.trim())
}

defineExpose({ focus: () => input.value?.focus({ preventScroll: true }) })
</script>

<template>
  <form class="flex gap-2" role="search" @submit.prevent="submit">
    <div class="relative min-w-0 flex-1">
      <svg
        class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" stroke-linecap="round" />
      </svg>
      <input
        :id="inputId"
        ref="input"
        v-model="model"
        type="search"
        name="q"
        enterkeyhint="search"
        :aria-label="t('search')"
        :placeholder="t('searchPlaceholder')"
        class="w-full rounded-lg border border-line bg-surface-muted py-1 pl-10 pr-4 text-kh-base outline-none transition-colors focus:bg-surface focus-visible:ring-0 focus-visible:ring-offset-0"
      >
    </div>
    <button
      type="submit"
      class="shrink-0 rounded-lg bg-brand px-4 py-1 font-semibold text-white transition hover:bg-brand-dark active:scale-[0.97] sm:px-5"
    >
      {{ t('search') }}
    </button>
  </form>
</template>
