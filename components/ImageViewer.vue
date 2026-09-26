<script setup lang="ts">
/**
 * Fullscreen image viewer.
 *
 * Opened from an article photo so a reader can see detail that the 16:9 crop
 * hides. It keeps the caption and any AI-image disclosure visible at full
 * size — a disclosure that disappears when the picture gets bigger would
 * defeat its purpose (§25).
 */

const { t } = useLocale()
const props = defineProps<{
  src?: string
  alt: string
  caption?: string
  aiGenerated?: boolean
}>()

const open = ref(false)
const dialog = ref<HTMLElement | null>(null)
let restoreFocus: HTMLElement | null = null

function show() {
  if (!props.src) return
  restoreFocus = document.activeElement as HTMLElement
  open.value = true
}

function hide() {
  open.value = false
  // Send focus back where it came from, or a keyboard reader is dumped at the
  // top of the document.
  restoreFocus?.focus()
}

watch(open, async (isOpen) => {
  if (!import.meta.client) return
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) {
    await nextTick()
    dialog.value?.focus()
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

onKeyStroke('Escape', () => { if (open.value) hide() })
</script>

<template>
  <div>
    <button
      v-if="src"
      type="button"
      class="group/zoom relative block w-full cursor-zoom-in"
      :aria-label="t('enlargeImage', { alt })"
      @click="show"
    >
      <slot />
      <span
        class="pointer-events-none absolute right-2 top-2 rounded-full bg-ink/60 p-1.5 opacity-0 backdrop-blur transition-opacity group-hover/zoom:opacity-100"
        aria-hidden="true"
      >
        <svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5M11 8v6M8 11h6" stroke-linecap="round" />
        </svg>
      </span>
    </button>
    <slot v-else />

    <Teleport to="body">
      <Transition name="viewer">
        <div
          v-if="open"
          ref="dialog"
          class="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          :aria-label="alt"
          tabindex="-1"
          @click.self="hide"
        >
          <div class="flex justify-end p-4">
            <button
              type="button"
              class="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
              :aria-label="t('close')"
              @click="hide"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="flex min-h-0 flex-1 items-center justify-center px-4">
            <img :src="src" :alt="alt" class="max-h-full max-w-full object-contain" @click.stop>
          </div>

          <div v-if="caption || aiGenerated" class="px-6 py-5 text-center">
            <p v-if="caption" class="mx-auto max-w-prose text-kh-sm text-white/80 khmer-wrap">
              {{ caption }}
            </p>
            <p v-if="aiGenerated" class="mt-2 text-xs text-white/60">
              {{ t('aiImageIllustration') }}
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.viewer-enter-active,
.viewer-leave-active {
  transition: opacity 0.2s ease;
}
.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}
</style>
