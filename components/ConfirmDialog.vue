<script setup lang="ts">
/**
 * Confirmation for an action that cannot be undone.
 *
 * `requireText` demands the operator type an exact phrase before the button
 * enables. That is reserved for genuinely irreversible work — a muscle-memory
 * "yes" is not consent when the thing being deleted is a published article.
 */
const props = withDefaults(defineProps<{
  open: boolean
  title: string
  message: string
  /** The exact text the operator must type. Omit for a plain confirm. */
  requireText?: string
  confirmLabel?: string
  cancelLabel?: string
  busy?: boolean
  /** Extra consequences worth spelling out before the click. */
  consequences?: string[]
}>(), { confirmLabel: 'Delete', cancelLabel: 'Cancel', busy: false })

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const typed = ref('')
const panel = ref<HTMLElement | null>(null)

const canConfirm = computed(() =>
  !props.busy && (!props.requireText || typed.value.trim() === props.requireText),
)

watch(() => props.open, async (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    typed.value = ''
    await nextTick()
    panel.value?.focus()
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

// Escape cancels, which is what every other dialog on the platform does.
onKeyStroke('Escape', () => { if (props.open && !props.busy) emit('cancel') })

function onConfirm() {
  if (canConfirm.value) emit('confirm')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm">
      <div
        v-if="open"
        class="fixed inset-0 z-[110] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
        @click.self="!busy && emit('cancel')"
      >
        <div
          ref="panel"
          class="w-full max-w-md rounded-xl bg-surface p-6 shadow-lift"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="'confirm-title'"
          :aria-describedby="'confirm-message'"
          tabindex="-1"
        >
          <div class="flex items-start gap-3">
            <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-breaking/10" aria-hidden="true">
              <svg class="h-5 w-5 text-breaking" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <div class="min-w-0 flex-1">
              <h2 id="confirm-title" class="text-lg font-bold">{{ title }}</h2>
              <p id="confirm-message" class="mt-1 text-kh-sm text-ink-muted khmer-wrap">{{ message }}</p>
            </div>
          </div>

          <ul v-if="consequences?.length" class="mt-4 space-y-1.5 rounded-lg bg-surface-muted p-3">
            <li v-for="line in consequences" :key="line" class="flex gap-2 text-sm text-ink-muted">
              <span aria-hidden="true">·</span><span class="khmer-wrap">{{ line }}</span>
            </li>
          </ul>

          <div v-if="requireText" class="mt-4">
            <label for="confirm-typed" class="mb-1 block text-sm font-medium">
              Type <code class="rounded bg-surface-muted px-1.5 py-0.5 font-semibold">{{ requireText }}</code> to confirm
            </label>
            <input
              id="confirm-typed"
              v-model="typed"
              type="text"
              autocomplete="off"
              class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-breaking"
              @keydown.enter.prevent="onConfirm"
            >
          </div>

          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted disabled:opacity-50"
              :disabled="busy"
              @click="emit('cancel')"
            >{{ cancelLabel }}</button>
            <button
              type="button"
              class="rounded-lg bg-breaking px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!canConfirm"
              @click="onConfirm"
            >{{ busy ? '…' : confirmLabel }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-enter-active,
.confirm-leave-active { transition: opacity 0.16s ease; }
.confirm-enter-from,
.confirm-leave-to { opacity: 0; }
</style>
