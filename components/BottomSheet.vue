<script setup lang="ts">
/**
 * A panel that slides up from the bottom on a phone, where it sits under the
 * thumb, and opens as a centred dialog from `sm` up.
 *
 * Drag the handle down to dismiss, as in a native app. Tapping the backdrop or
 * pressing Escape closes it too.
 */
const open = defineModel<boolean>('open', { default: false })

defineProps<{ title: string }>()

const { t } = useLocale()
const panel = ref<HTMLElement | null>(null)

// ── Drag to dismiss ────────────────────────────────────────────────────────
const dragY = ref(0)
const dragging = ref(false)
let startY = 0

function onTouchStart(e: TouchEvent) {
  startY = e.touches[0]?.clientY ?? 0
  dragging.value = true
}

function onTouchMove(e: TouchEvent) {
  if (!dragging.value) return
  dragY.value = Math.max(0, (e.touches[0]?.clientY ?? startY) - startY)
}

function onTouchEnd() {
  if (!dragging.value) return
  dragging.value = false
  if (dragY.value > 80) {
    // Carry on down from where the finger let go instead of snapping back
    // up first; the leave transition finishes the slide.
    dragY.value = panel.value?.offsetHeight ?? dragY.value
    open.value = false
  }
  else {
    dragY.value = 0
  }
}

const panelStyle = computed(() => dragY.value
  ? { transform: `translateY(${dragY.value}px)`, transition: dragging.value ? 'none' : undefined }
  : undefined)

// ── Focus and scroll ───────────────────────────────────────────────────────
let returnFocus: HTMLElement | null = null

watch(open, async (isOpen) => {
  if (!import.meta.client) return
  // The page behind should not scroll while the sheet is up.
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) {
    returnFocus = document.activeElement as HTMLElement | null
    await nextTick()
    panel.value?.focus({ preventScroll: true })
  }
  else {
    returnFocus?.focus({ preventScroll: true })
    returnFocus = null
  }
})

onBeforeUnmount(() => {
  if (import.meta.client && open.value) document.body.style.overflow = ''
})

onKeyStroke('Escape', () => { if (open.value) open.value = false })
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet" :duration="{ enter: 380, leave: 260 }" @after-leave="dragY = 0">
      <div v-if="open" class="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
        <div class="sheet-backdrop absolute inset-0 bg-ink/40" aria-hidden="true" @click="open = false" />

        <div
          ref="panel"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
          :style="panelStyle"
          class="sheet-panel relative flex max-h-[85vh] w-full flex-col rounded-t-3xl bg-surface shadow-lift outline-none transition-transform duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 sm:max-w-md sm:rounded-2xl"
        >
          <!-- The grab area: handle and title. Touches here drag the sheet;
               touches in the list below scroll it. -->
          <div
            class="shrink-0 touch-none select-none"
            @touchstart.passive="onTouchStart"
            @touchmove.passive="onTouchMove"
            @touchend="onTouchEnd"
            @touchcancel="onTouchEnd"
          >
            <span class="mx-auto mt-2.5 block h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden="true" />
            <div class="flex items-center justify-between gap-3 px-5 pb-2 pt-3 sm:pt-4">
              <h2 class="text-kh-lg font-bold">{{ title }}</h2>
              <button
                type="button"
                class="-mr-2 rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                :aria-label="t('close')"
                @click="open = false"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-active .sheet-backdrop {
  transition: opacity 0.3s ease-out;
}
.sheet-leave-active .sheet-backdrop {
  transition: opacity 0.26s ease-in;
}
.sheet-enter-from .sheet-backdrop,
.sheet-leave-to .sheet-backdrop {
  opacity: 0;
}

/* The curve iOS uses for its own sheets: a quick start that settles gently. */
.sheet-enter-active .sheet-panel {
  transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-leave-active .sheet-panel {
  transition: transform 0.26s cubic-bezier(0.4, 0, 1, 1);
}
.sheet-enter-from .sheet-panel,
.sheet-leave-to .sheet-panel {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .sheet-enter-active .sheet-panel,
  .sheet-leave-active .sheet-panel {
    transition: transform 0.22s ease, opacity 0.22s ease;
  }
  .sheet-enter-from .sheet-panel,
  .sheet-leave-to .sheet-panel {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
}
</style>
