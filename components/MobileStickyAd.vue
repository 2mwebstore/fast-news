<script setup lang="ts">
const { t } = useLocale()

/**
 * Optional mobile sticky unit (§39).
 *
 * It is dismissible, remembers the dismissal for the session, and respects the
 * safe-area inset so it never sits under a phone's home indicator. The slot is
 * disabled by default in the seed — turning it on is a deliberate decision.
 */
const dismissed = ref(false)
const STORAGE_KEY = 'cfn.sticky-ad.dismissed'

onMounted(() => {
  try {
    dismissed.value = sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    // Private mode or blocked storage: show the ad, it is still dismissible.
  }
})

function dismiss() {
  dismissed.value = true
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Not being able to remember the dismissal is acceptable; ignoring the
    // dismissal would not be.
  }
}
</script>

<template>
  <div
    v-if="!dismissed"
    class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:hidden"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <div class="relative flex justify-center py-1">
      <button
        class="absolute -top-7 right-2 rounded-full bg-ink/80 p-1.5 text-white"
        :aria-label="t('closeAd')"
        @click="dismiss"
      >
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
        </svg>
      </button>

      <AdSlot position="MOBILE_STICKY" collapse-when-empty class="!my-0" />
    </div>
  </div>
</template>
