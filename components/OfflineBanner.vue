<script setup lang="ts">
/**
 * Connection status.
 *
 * A reader who loses signal mid-article should be told, not left wondering why
 * nothing loads. The bar also confirms recovery, then gets out of the way.
 *
 * State is read on the client only: on the server there is no navigator, and
 * defaulting to offline would flash the bar at every reader on first paint.
 */
const online = ref(true)
const showRestored = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function sync() {
  const next = navigator.onLine
  if (next === online.value) return

  online.value = next
  if (next) {
    showRestored.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { showRestored.value = false }, 4000)
  } else {
    showRestored.value = false
  }
}

onMounted(() => {
  online.value = navigator.onLine
  window.addEventListener('online', sync)
  window.addEventListener('offline', sync)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', sync)
  window.removeEventListener('offline', sync)
  if (timer) clearTimeout(timer)
})

const { t } = useLocale()

const visible = computed(() => !online.value || showRestored.value)
</script>

<template>
  <div
    v-if="visible"
    :class="[
      'fixed inset-x-0 top-0 z-[90] px-4 py-2 text-center text-sm font-semibold text-white',
      'animate-slide-down',
      online ? 'bg-success' : 'bg-ink',
    ]"
    role="status"
    aria-live="polite"
    data-testid="offline-banner"
  >
    <template v-if="online">
      {{ t('backOnline') }}
    </template>
    <template v-else>
      {{ t('offline') }}
    </template>
  </div>
</template>
