<script setup lang="ts">
/**
 * Notification opt-in (§30).
 *
 * Readers choose which topics they want rather than being subscribed to
 * everything — §30 is explicit that not every article should be a push.
 * The prompt appears only after a reader has spent time on the site, and a
 * dismissal is remembered.
 */

const { t } = useLocale()
const { supported, permission, subscribed, subscribe } = usePush()

const visible = ref(false)
const selected = ref<string[]>(['breaking'])
const busy = ref(false)

const STORAGE_KEY = 'cfn.push-prompt.dismissed'
const DELAY_MS = 25_000

// Computed so the labels follow the reader's language. The keys are the push
// topics the API accepts and never change with locale.
const topics = computed(() => [
  { key: 'breaking', label: t('topicBreaking') },
  { key: 'cambodia', label: t('topicCambodia') },
  { key: 'sports', label: t('topicSports') },
  { key: 'kun-khmer', label: t('topicKunKhmer') },
  { key: 'business', label: t('topicBusiness') },
  { key: 'technology', label: t('topicTechnology') },
  { key: 'entertainment', label: t('topicEntertainment') },
])

onMounted(() => {
  if (!supported.value || permission.value !== 'default' || subscribed.value) return
  try {
    if (localStorage.getItem(STORAGE_KEY)) return
  } catch {
    // Storage unavailable: show the prompt, it is still dismissible.
  }
  setTimeout(() => { visible.value = true }, DELAY_MS)
})

function dismiss() {
  visible.value = false
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch { /* nothing to do */ }
}

function toggle(topic: string) {
  selected.value = selected.value.includes(topic)
    ? selected.value.filter(t => t !== topic)
    : [...selected.value, topic]
}

async function enable() {
  if (!selected.value.length) return
  busy.value = true
  try {
    await subscribe(selected.value)
  } finally {
    busy.value = false
    dismiss()
  }
}
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-xl border border-line bg-surface p-5 shadow-lift sm:inset-x-auto sm:right-4"
    role="dialog"
    aria-labelledby="push-prompt-heading"
  >
    <h2 id="push-prompt-heading" class="text-kh-base font-bold">{{ t('notifyHeading') }}</h2>
    <p class="mt-1 text-kh-sm text-ink-muted khmer-wrap">
      {{ t('notifyPickTopics') }}
    </p>

    <div class="mt-3 flex flex-wrap gap-2">
      <button
        v-for="topic in topics"
        :key="topic.key"
        :class="[
          'rounded-full border px-3 py-1.5 text-kh-sm transition-colors',
          selected.includes(topic.key)
            ? 'border-brand bg-brand text-white'
            : 'border-line hover:border-brand',
        ]"
        :aria-pressed="selected.includes(topic.key)"
        @click="toggle(topic.key)"
      >
        {{ topic.label }}
      </button>
    </div>

    <div class="mt-4 flex gap-2">
      <button
        class="flex-1 rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        :disabled="busy || !selected.length"
        @click="enable"
      >
        {{ busy ? t('working') : t('notifyEnable') }}
      </button>
      <button class="rounded-lg border border-line px-4 py-2.5 font-semibold hover:bg-surface-muted" @click="dismiss">
        {{ t('notifyNoThanks') }}
      </button>
    </div>
  </div>
</template>
