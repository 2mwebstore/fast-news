<script setup lang="ts">
/**
 * Debounced search field with a clear button and a busy state.
 *
 * The debounce is here rather than in each page so every search behaves the
 * same: one request when typing settles, not one per keystroke.
 */
const model = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<{
  placeholder?: string
  label?: string
  /** Milliseconds to wait after typing stops. */
  delay?: number
  busy?: boolean
  autofocus?: boolean
}>(), { placeholder: 'Search…', delay: 400, busy: false, autofocus: false })

const emit = defineEmits<{ search: [value: string]; clear: [] }>()

const inputId = useId()
const input = ref<HTMLInputElement | null>(null)

const emitSearch = useDebounceFn((value: string) => emit('search', value), props.delay)

function onInput() {
  emitSearch(model.value.trim())
}

function clear() {
  model.value = ''
  emit('clear')
  // Cancel any in-flight debounce by emitting the empty search immediately.
  emit('search', '')
  input.value?.focus()
}

onMounted(() => { if (props.autofocus) input.value?.focus() })
</script>

<template>
  <div class="relative w-full">
    <label :for="inputId" class="sr-only">{{ label || placeholder }}</label>

    <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true">
      <svg v-if="!busy" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" stroke-linecap="round" />
      </svg>
      <svg v-else class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="9" stroke-opacity="0.25" /><path d="M21 12a9 9 0 00-9-9" stroke-linecap="round" />
      </svg>
    </span>

    <input
      :id="inputId"
      ref="input"
      v-model="model"
      type="search"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-9 text-kh-sm outline-none transition-colors focus:border-brand"
      @input="onInput"
      @keydown.enter.prevent="emit('search', model.trim())"
      @keydown.escape="clear"
    >

    <button
      v-if="model"
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
      aria-label="Clear search"
      @click="clear"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>
